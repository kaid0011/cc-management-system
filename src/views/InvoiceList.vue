<template>
  <div class="invoice-management">
    <div class="q-pa-md">
      <q-card>
        <q-tabs
          v-model="tab"
          class="bg-grey-3 text-grey-10"
          active-color="primary"
          indicator-color="amber-8"
          align="justify"
        >
          <q-tab name="all" label="All Transactions" />
          <q-tab name="pendings" label="Pending Orders" />
          <q-tab name="generated" label="Generated Invoices" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated class="bg-primary text-white">
          <q-tab-panel name="all">
            <h4>All Transactions</h4>
            <q-table
              class="table"
              :rows="invoices"
              :columns="columns"
              row-key="id"
              separator="cell"
            >
              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="q-gutter-x-md">
                  <q-btn label="View" color="primary" @click="goToInvoice(props.row)" />
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>

          <q-tab-panel name="pendings">
            <h4>Pending Orders</h4>
            <q-table
              class="table"
              :rows="pendingInvoices"
              :columns="pendingColumns"
              row-key="order_no"
              separator="cell"
            >
              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="q-gutter-x-md">
                  <q-btn label="Generate Invoice" color="primary" @click="viewOrder(props.row)" />
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>

          <q-tab-panel name="generated">
            <h4>Generated Invoices</h4>
            <q-table
              class="table"
              :rows="generatedInvoices"
              :columns="generatedColumns"
              row-key="invoice_no"
              separator="cell"
            >
              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="q-gutter-x-md">
                  <q-btn label="View" color="primary" @click="viewInvoice(props.row)" />
                  <q-btn label="Print" color="secondary" @click="printInvoice(props.row)" />
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>

    <q-dialog v-model="isInvoiceDialogOpen" persistent>
      <q-card class="dialogs" style="min-width: 70vw">
        <q-card-section class="bg-primary">
          <div class="text-h6 text-white">Invoice Details</div>
        </q-card-section>
        <q-card-section class="q-pa-none">
          <q-form>
            <div class="bg-grey-4 rounded-borders row justify-center q-pa-md">
              <div class="column q-gutter-y-sm">
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p">Order No.:</div>
                  <q-input class="pending-input" outlined v-model="selectedInvoice.order_no" readonly dense />
                </div>
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p">Date / Time:</div>
                  <q-input class="pending-input" outlined v-model="formattedOrderDateTime" readonly dense />
                </div>
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p">Ready By:</div>
                  <q-input class="pending-input" outlined type="date" v-model="selectedInvoice.ready_by" dense />
                </div>
              </div>
            </div>
            <div class="q-pa-xl">
              <div class="row q-pb-sm" v-for="(transaction, index) in selectedTransactions" :key="index">
                <div class="col-1"><q-input v-model="transaction.serial_no" dense readonly /></div>
                <div class="col-8"><q-input v-model="transaction.item_name" dense readonly /></div>
                <div class="col-1"><q-input v-model="transaction.tag_no" dense readonly /></div>
                <div class="col-2"><q-input outlined v-model="transaction.price" dense /></div>
              </div>
            </div>
            <div class="bg-grey-4 rounded-borders row justify-center q-pa-md">
              <div class="column q-gutter-y-sm">
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p">Customer Name:</div>
                  <q-input class="pending-customer" outlined v-model="customer.customer_name" readonly dense />
                </div>
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p">Contact No:</div>
                  <q-input class="pending-customer" outlined v-model="customer.contact_no" readonly dense />
                </div>
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p">Delivery Address:</div>
                  <q-input class="pending-customer" outlined v-model="customer.del_address" readonly dense />
                </div>
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p">Remarks:</div>
                  <q-input type="textarea" class="pending-customer" outlined v-model="customer.remarks" readonly dense />
                </div>
              </div>
            </div>
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn push label="Close" color="negative" @click="isInvoiceDialogOpen = false" />
          <q-btn push label="Generate Invoice" color="primary" @click="generateInvoice" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  fetchAllInvoices,
  fetchInvoiceDetails,
  fetchTransactionsByInvoiceId,
  fetchTransactionsByInvoiceNo,
  getNextInvoiceNo,
  updateInvoiceStatusAndDateById,
  fetchInvoiceDetailsByInvoiceNo,
  fetchCustomerDetailsByInvoiceId,
} from "@/../supabase/api/invoices.js";

const formatDateTime = (dateString) => new Date(dateString).toLocaleString("en-US", {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
});

const columns = [
  { name: "invoice_no", align: "left", label: "Invoice No", field: "invoice_no", sortable: true },
  { name: "invoice_date_time", align: "left", label: "Invoice Timestamp", field: row => formatDateTime(row.order_date_time), sortable: true },
  { name: "order_no", align: "left", label: "Order No", field: "order_no", sortable: true },
  { name: "order_date_time", align: "left", label: "Order Timestamp", field: row => formatDateTime(row.order_date_time), sortable: true },
  { name: "status", align: "left", label: "Status", field: "status", sortable: true },
  { name: "actions", align: "left", label: "Actions", field: "actions" },
];

const pendingColumns = [
  { name: "order_no", align: "left", label: "Order No", field: "order_no", sortable: true },
  { name: "order_date_time", align: "left", label: "Order Timestamp", field: row => formatDateTime(row.order_date_time), sortable: true },
  { name: "ready_by", align: "left", label: "Ready By", field: row => formatDate(row.ready_by), sortable: true },
  { name: "status", align: "left", label: "Status", field: "status", sortable: true },
  { name: "actions", align: "left", label: "Actions", field: "actions" },
];

const generatedColumns = [
  { name: "invoice_no", align: "left", label: "Invoice No", field: "invoice_no", sortable: true },
  { name: "invoice_date_time", align: "left", label: "Invoice Timestamp", field: row => formatDateTime(row.order_date_time), sortable: true },
  { name: "order_no", align: "left", label: "Order No", field: "order_no", sortable: true },
  { name: "order_date_time", align: "left", label: "Order Timestamp", field: row => formatDateTime(row.order_date_time), sortable: true },
  { name: "actions", align: "left", label: "Actions", field: "actions" },
];

const tab = ref("all");
const invoices = ref([]);
const pendingInvoices = ref([]);
const generatedInvoices = ref([]);
const selectedInvoice = ref({});
const selectedTransactions = ref([]);
const formattedOrderDateTime = ref("");
const isInvoiceDialogOpen = ref(false);
const customer = ref({});

async function fetchData() {
  try {
    const allInvoices = await fetchAllInvoices();
    invoices.value = allInvoices;
    pendingInvoices.value = invoices.value.filter(invoice => invoice.status === "Pending");
    generatedInvoices.value = invoices.value.filter(invoice => invoice.status === "Done");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const router = useRouter();

async function viewOrder(row) {
  try {
    const invoiceDetails = await fetchInvoiceDetails(row.order_no);
    const transactions = await fetchTransactionsByInvoiceId(invoiceDetails.id);
    const customerDetails = await fetchCustomerDetailsByInvoiceId(invoiceDetails.id);
    selectedInvoice.value = invoiceDetails;
    selectedTransactions.value = transactions.map((transaction, index) => ({
      ...transaction,
      serial_no: index + 1,
    }));
    customer.value = customerDetails;
    formattedOrderDateTime.value = formatDateTime(invoiceDetails.order_date_time);
    isInvoiceDialogOpen.value = true;
  } catch (error) {
    console.error("Error fetching invoice details:", error);
  }
}

async function generateInvoice() {
  try {
    const nextInvoiceNo = await getNextInvoiceNo();
    selectedInvoice.value.invoice_no = nextInvoiceNo;
    selectedInvoice.value.status = "Done";
    selectedInvoice.value.invoice_date_time = new Date().toISOString().slice(0, 19).replace("T", " ");
    await updateInvoiceStatusAndDateById(selectedInvoice.value.id, selectedInvoice.value.status, selectedInvoice.value.invoice_date_time, selectedInvoice.value.invoice_no);
    isInvoiceDialogOpen.value = false;
    fetchData();
  } catch (error) {
    console.error("Error generating invoice:", error);
  }
}

function viewInvoice(row) {
  const url = router.resolve({ name: "View Invoice", params: { invoice_no: row.invoice_no } }).href;
  window.open(url, "_blank");
}

async function printInvoice(row) {
  try {
    const invoiceDetails = await fetchInvoiceDetailsByInvoiceNo(row.invoice_no);
    const transactions = await fetchTransactionsByInvoiceNo(row.invoice_no);
    const pdfContent = generatePdfContent(invoiceDetails, transactions);
    handlePrint(pdfContent);
  } catch (error) {
    console.error("Error fetching invoice details:", error);
  }
}

function generatePdfContent(invoiceDetails, transactions) {
  const transactionsContent = transactions.map((transaction, index) => `
    <div class="html_row">
      <span class="html_cell">${index + 1}</span>
      <span class="html_cell">${transaction.item_name}</span>
      <span class="html_cell">${transaction.tag_no}</span>
      <span class="html_cell">${transaction.price}</span>
    </div>`).join("");

  const formattedOrderDate = formatDate(invoiceDetails.order_date_time);
  const formattedInvoiceDate = formatDate(invoiceDetails.invoice_date_time);
  const formattedReadyBy = formatDate(invoiceDetails.ready_by);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice</title>
      <style>
        .print-container { display: flex; width: 297mm; height: 210mm; flex-wrap: wrap; }
        .html_container { width: 100%; height: 100%; }
        .html_title { font-size: 14px; font-weight: bold; margin-bottom: 15px; padding-bottom: 8px; text-align: center; border-bottom: 1px solid #ccc; color: black; }
        .html_cardNo { font-size: 20px; font-weight: bold; margin-bottom: 15px; text-align: center; }
        .html_detailsContainer { margin-bottom: 15px; padding: 10px; border-bottom: 1px solid #ccc; border-top: 1px solid #ccc; }
        .html_detailsRow { display: flex; align-items: center; margin-bottom: 8px; }
        .html_detailLabel { flex: 1; font-size: 12px; font-weight: bold; text-align: left; padding-left: 30px; }
        .html_detail { flex: 2; font-size: 12px; }
        .html_transactionContainer { margin-bottom: 10px; }
        .html_row { display: flex; padding: 4px 0; border-bottom: 1px solid #ccc; align-items: center; font-size: 10px; }
        .html_cell { flex: 1; text-align: center; }
        .html_headerCell { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="html_container">
        <div class="html_invoiceContainer">
          <h1 class="html_title">COTTON CARE DRY CLEANERS</h1>
          <div class="html_detailsContainer">
            <div class="html_detailsRow"><span class="html_detailLabel">Invoice No:</span><span class="html_detail">${invoiceDetails.invoice_no}</span></div>
            <div class="html_detailsRow"><span class="html_detailLabel">Invoice Date:</span><span class="html_detail">${formattedInvoiceDate}</span></div>
            <div class="html_detailsRow"><span class="html_detailLabel">Order No:</span><span class="html_detail">${invoiceDetails.order_no}</span></div>
            <div class="html_detailsRow"><span class="html_detailLabel">Order Date:</span><span class="html_detail">${formattedOrderDate}</span></div>
            <div class="html_detailsRow"><span class="html_detailLabel">Ready By:</span><span class="html_detail">${formattedReadyBy}</span></div>
          </div>
          <div class="html_transactionContainer">
            <div class="html_row"><span class="html_cell html_headerCell">S/No.</span><span class="html_cell html_headerCell">Item(s)</span><span class="html_cell html_headerCell">Tag No.</span><span class="html_cell html_headerCell">Price</span></div>
            ${transactionsContent}
            <div class="html_row"><span class="html_cell html_headerCell"></span><span class="html_cell html_headerCell"></span><span class="html_cell html_headerCell">TOTAL:</span><span class="html_cell html_headerCell">${invoiceDetails.total_price}</span></div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function handlePrint(content) {
  const printWindow = window.open("", "_blank");
  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Print Preview</title>
      <style>
        @page { size: A4 landscape; margin: 0; }
        body { display: flex; flex-wrap: wrap; gap: 10px; }
        .column { width: calc(50% - 5px); margin: 0 auto; padding: 20px; box-sizing: border-box; }
      </style>
    </head>
    <body>
      <div class="column">${content}</div>
      <div class="column">${content}</div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
  printWindow.onafterprint = () => printWindow.close();
}

async function goToInvoice(row) {
  if (row.status === "Pending") {
    tab.value = "pendings";
    await nextTick();
    highlightedRow.value = row.id;
  } else if (row.status === "Done") {
    tab.value = "generated";
    await nextTick();
    highlightedRow.value = row.invoice_no;
  }
  await nextTick();
  highlightedRow.value = null;
}

onMounted(fetchData);
</script>

<style scoped>
.invoice-management {
  padding: 20px;
}
.q-card-section {
  max-height: 60vh;
  overflow-y: auto;
}
.pending-input {
  width: 200px !important;
  font-weight: 900 !important;
}
.pending-customer {
  width: 600px !important;
  font-weight: 900 !important;
}
.dialogs {
  background-color: #e9e9e9;
}
</style>

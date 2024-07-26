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
              <template v-slot:body="props">
                <q-tr :props="props" :class="{ highlighted: props.row.id === highlightedRow }">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <template v-if="col.name === 'actions'">
                      <q-btn
                        label="View"
                        color="primary"
                        @click="goToInvoice(props.row)"
                      />
                    </template>
                    <template v-else>
                      {{ typeof col.field === 'function' ? col.field(props.row) : props.row[col.field] }}
                    </template>
                  </q-td>
                </q-tr>
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
              <template v-slot:body="props">
                <q-tr :props="props" :class="{ highlighted: props.row.order_no === highlightedRow }">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <template v-if="col.name === 'actions'">
                      <q-btn
                        label="Generate Invoice"
                        color="primary"
                        @click="viewOrder(props.row)"
                      />
                    </template>
                    <template v-else>
                      {{ typeof col.field === 'function' ? col.field(props.row) : props.row[col.field] }}
                    </template>
                  </q-td>
                </q-tr>
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
              <template v-slot:body="props">
                <q-tr :props="props" :class="{ highlighted: props.row.invoice_no === highlightedRow }">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <template v-if="col.name === 'actions'">
                      <q-btn
                        label="View"
                        color="primary"
                        @click="viewInvoice(props.row)"
                      />
                      <q-btn
                      class="q-ml-sm"
                        label="Print"
                        color="secondary"
                        @click="printInvoice(props.row)"
                      />
                    </template>
                    <template v-else>
                      {{ typeof col.field === 'function' ? col.field(props.row) : props.row[col.field] }}
                    </template>
                  </q-td>
                </q-tr>
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
                  <q-input
                    class="pending-input"
                    outlined
                    v-model="selectedInvoice.order_no"
                    readonly
                    dense
                  />
                </div>
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p">Date / Time:</div>
                  <q-input
                    class="pending-input"
                    outlined
                    v-model="formattedOrderDateTime"
                    readonly
                    dense
                  />
                </div>
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p">Ready By:</div>
                  <q-input
                    class="pending-input"
                    outlined
                    type="date"
                    v-model="selectedInvoice.ready_by"
                    dense
                  />
                </div>
              </div>
            </div>
            <div class="q-pa-xl">
              <div
                class="row q-pb-sm"
                v-for="(transaction, index) in selectedTransactions"
                :key="index"
              >
                <div class="col-1">
                  <q-input v-model="transaction.serial_no" dense readonly />
                </div>
                <div class="col-8">
                  <q-input v-model="transaction.item_name" dense readonly />
                </div>
                <div class="col-1">
                  <q-input v-model="transaction.tag_no" dense readonly />
                </div>
                <div class="col-2">
                  <q-input outlined v-model="transaction.price" dense />
                </div>
              </div>
            </div>
            <div class="bg-grey-4 rounded-borders row justify-center q-pa-md">
              <div class="column q-gutter-y-sm">
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p">Customer Name:</div>
                  <q-input
                    class="pending-customer"
                    outlined
                    v-model="customer.customer_name"
                    readonly
                    dense
                  />
                </div>
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p">Contact No:</div>
                  <q-input
                    class="pending-customer"
                    outlined
                    v-model="customer.contact_no"
                    readonly
                    dense
                  />
                </div>
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p">Delivery Address:</div>
                  <q-input
                    class="pending-customer"
                    outlined
                    v-model="customer.del_address"
                    readonly
                    dense
                  />
                </div>
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p">Remarks:</div>
                  <q-input
                    type="textarea"
                    class="pending-customer"
                    outlined
                    v-model="customer.remarks"
                    readonly
                    dense
                  />
                </div>
              </div>
            </div>
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            push
            label="Close"
            color="negative"
            @click="isInvoiceDialogOpen = false"
          />
          <q-btn
            push
            label="Generate Invoice"
            color="primary"
            @click="generateInvoice"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
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

const formatDateTime = (dateString) =>
  new Date(dateString).toLocaleString("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });

const columns = [
  {
    name: "invoice_no",
    align: "left",
    label: "Invoice No",
    field: "invoice_no",
    sortable: true,
  },
  {
    name: "invoice_date_time",
    align: "left",
    label: "Invoice Timestamp",
    field: (row) => formatDateTime(row.order_date_time),
    sortable: true,
  },
  {
    name: "order_no",
    align: "left",
    label: "Order No",
    field: "order_no",
    sortable: true,
  },
  {
    name: "order_date_time",
    align: "left",
    label: "Order Timestamp",
    field: (row) => formatDateTime(row.order_date_time),
    sortable: true,
  },
  {
    name: "status",
    align: "left",
    label: "Status",
    field: "status",
    sortable: true,
  },
  { name: "actions", align: "left", label: "Actions", field: "actions" },
];

const pendingColumns = [
  {
    name: "order_no",
    align: "left",
    label: "Order No",
    field: "order_no",
    sortable: true,
  },
  {
    name: "order_date_time",
    align: "left",
    label: "Order Timestamp",
    field: (row) => formatDateTime(row.order_date_time),
    sortable: true,
  },
  {
    name: "ready_by",
    align: "left",
    label: "Ready By",
    field: (row) => formatDate(row.ready_by),
    sortable: true,
  },
  {
    name: "status",
    align: "left",
    label: "Status",
    field: "status",
    sortable: true,
  },
  { name: "actions", align: "left", label: "Actions", field: "actions" },
];

const generatedColumns = [
  {
    name: "invoice_no",
    align: "left",
    label: "Invoice No",
    field: "invoice_no",
    sortable: true,
  },
  {
    name: "invoice_date_time",
    align: "left",
    label: "Invoice Timestamp",
    field: (row) => formatDateTime(row.order_date_time),
    sortable: true,
  },
  {
    name: "order_no",
    align: "left",
    label: "Order No",
    field: "order_no",
    sortable: true,
  },
  {
    name: "order_date_time",
    align: "left",
    label: "Order Timestamp",
    field: (row) => formatDateTime(row.order_date_time),
    sortable: true,
  },
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
const router = useRouter();
const highlightedRow = ref(null);

async function fetchData() {
  try {
    const allInvoices = await fetchAllInvoices();
    invoices.value = allInvoices;
    pendingInvoices.value = invoices.value.filter(
      (invoice) => invoice.status === "Pending"
    );
    generatedInvoices.value = invoices.value.filter(
      (invoice) => invoice.status === "Done"
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function viewOrder(row) {
  try {
    const invoiceDetails = await fetchInvoiceDetails(row.order_no);
    const transactions = await fetchTransactionsByInvoiceId(invoiceDetails.id);
    const customerDetails = await fetchCustomerDetailsByInvoiceId(
      invoiceDetails.id
    );
    selectedInvoice.value = invoiceDetails;
    selectedTransactions.value = transactions.map((transaction, index) => ({
      ...transaction,
      serial_no: index + 1,
    }));
    customer.value = customerDetails;
    formattedOrderDateTime.value = formatDateTime(
      invoiceDetails.order_date_time
    );
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
    selectedInvoice.value.invoice_date_time = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    await updateInvoiceStatusAndDateById(
      selectedInvoice.value.id,
      selectedInvoice.value.status,
      selectedInvoice.value.invoice_date_time,
      selectedInvoice.value.invoice_no
    );
    isInvoiceDialogOpen.value = false;
    fetchData();
  } catch (error) {
    console.error("Error generating invoice:", error);
  }
}

function viewInvoice(row) {
  const url = router.resolve({
    name: "View Invoice",
    params: { invoice_no: row.invoice_no },
  }).href;
  window.open(url, "_blank");
}

function printInvoice(row) {
  const url = router.resolve({
    name: "View Invoice",
    params: { invoice_no: row.invoice_no },
    query: { print: true }
  }).href;
  window.open(url, "_blank");
}

async function goToInvoice(row) {
  const invoiceId = row.id;
  if (row.status === "Pending") {
    tab.value = "pendings";
    await nextTick();
    highlightedRow.value = pendingInvoices.value.find(invoice => invoice.id === invoiceId)?.order_no;
  } else if (row.status === "Done") {
    tab.value = "generated";
    await nextTick();
    highlightedRow.value = generatedInvoices.value.find(invoice => invoice.id === invoiceId)?.invoice_no;
  }
  await nextTick(() => {
    setTimeout(() => {
      highlightedRow.value = null;
    }, 2000);
  });
}

onMounted(fetchData);
</script>

<template>
  <div class="invoice-management">
    <div class="q-pa-md">
      <q-card flat>
        <q-tabs
          v-model="tab"
          indicator-color="yellow-9"
          align="justify"
        >
          <q-tab name="all" label="All Transactions" />
          <q-tab name="pendings" label="Pending Orders" />
          <q-tab name="generated" label="Generated Invoices" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
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
                <q-tr
                  :props="props"
                  :class="{ highlighted: props.row.id === highlightedRow }"
                >
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    <template v-if="col.name === 'actions'">
                      <q-btn flat
                        label="View"
                        class="main-button"
                        @click="goToInvoice(props.row)"
                      />
                    </template>
                    <template v-else>
                      {{
                        typeof col.field === "function"
                          ? col.field(props.row)
                          : props.row[col.field]
                      }}
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
                <q-tr
                  :props="props"
                  :class="{
                    highlighted: props.row.order_no === highlightedRow,
                  }"
                >
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    <template v-if="col.name === 'actions'">
                      <q-btn flat
                        label=" View Order"
                        class="main-button"
                        @click="viewOrder(props.row)"
                      />
                    </template>
                    <template v-else>
                      {{
                        typeof col.field === "function"
                          ? col.field(props.row)
                          : props.row[col.field]
                      }}
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
                <q-tr
                  :props="props"
                  :class="{
                    highlighted: props.row.invoice_no === highlightedRow,
                  }"
                >
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    <template v-if="col.name === 'actions'">
                      <q-btn flat
                        label="View"
                        class="main-button"
                        @click="viewInvoice(props.row)"
                      />
                      <q-btn flat
                        class="secondary-button q-ml-sm"
                        label="Print"
                        @click="printInvoice(props.row)"
                      />
                    </template>
                    <template v-else>
                      {{
                        typeof col.field === "function"
                          ? col.field(props.row)
                          : props.row[col.field]
                      }}
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
      <q-card class="dialog" style="min-width: 70vw">
        <q-card-section class="dialog-header">
          <div class="text-body1 text-uppercase text-weight-bold">Invoice Details</div>
        </q-card-section>
        <q-card-section class="q-pa-none">
          <q-form>
            <div class="background2 row justify-center q-pa-md">
              <div class="column q-gutter-y-sm">
                <div
                  class="text-body1 text-uppercase text-weight-bold text-center q-pb-md"
                >
                  Order Details
                </div>
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p text-weight-bold">Order No.:</div>
                  <q-input
                    class="pending-input"
                    outlined
                    v-model="selectedOrder.order_no"
                    readonly
                    dense
                  />
                </div>
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p text-weight-bold">Date / Time:</div>
                  <q-input
                    class="pending-input"
                    outlined
                    v-model="formattedOrderDateTime"
                    readonly
                    dense
                  />
                </div>
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p text-weight-bold">Ready By:</div>
                  <q-input
                    class="pending-input"
                    outlined
                    type="date"
                    v-model="selectedOrder.ready_by"
                    dense
                  />
                </div>
              </div>
            </div>
            <div class="background1 q-pa-xl">
              <div
                class="text-body1 text-uppercase text-weight-bold text-center q-pb-md"
              >
                Transaction Details
              </div>
              <div
                class="row q-pb-sm"
              >
                <div class="col-1">
                  <div class="text-caption text-weight-bold">S. No.</div>
                </div>
                <div class="col-8">
                  <div class="text-caption text-weight-bold">Item Name</div>
                </div>
                <div class="col-1">
                  <div class="text-caption text-weight-bold">Tag No.</div>
                </div>
                <div class="col-2">
                  <div class="text-caption text-weight-bold">Price</div>
                </div>
              </div>
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
                  <q-input outlined readonly v-model="transaction.price" dense />
                </div>
              </div>
            </div>
            <div class="background2 q-pa-xl row justify-center">
              <div class="column q-gutter-y-sm">
                <div
                  class="text-body1 text-uppercase text-weight-bold text-center q-pb-md"
                >
                  Customer Details
                </div>
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p text-weight-bold">Customer Name:</div>
                  <q-input
                    class="pending-customer"
                    outlined
                    v-model="selectedOrder.contact_person"
                    readonly
                    dense
                  />
                </div>
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p text-weight-bold">Contact No:</div>
                  <q-input
                    class="pending-customer"
                    outlined
                    v-model="selectedOrder.contact_person_no"
                    readonly
                    dense
                  />
                </div>
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p text-weight-bold">Delivery Address:</div>
                  <q-input
                    class="pending-customer"
                    outlined
                    v-model="selectedOrder.del_address"
                    readonly
                    dense
                  />
                </div>
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p text-weight-bold">Remarks:</div>
                  <q-input
                    type="textarea"
                    class="pending-customer"
                    outlined
                    v-model="selectedOrder.remarks"
                    readonly
                    dense
                  />
                </div>
              </div>
            </div>
            <div class="background1 q-pa-xl column justify-center">
              <div
                class="text-body1 text-uppercase text-weight-bold text-center q-pb-md"
              >
                Instructions
              </div>
              <div class="q-gutter-y-md q-px-xl">
                <div
                class="row q-gutter-y-sm"
                v-for="instruction in selectedInstructions"
                :key="instruction.id"
              >
                <div class="col">
                  <i class="fa-solid fa-caret-right q-pr-sm"></i>
                  {{ instruction.description }}
                  <div class="q-mt-sm">
                    <q-chip
                      v-if="instruction.admin"
                      outline
                      class="chip-admin q-mr-sm text-weight-bold"
                      >Admin</q-chip
                    >
                    <q-chip
                      v-if="instruction.tagger"
                      outline
                      class="chip-tagger q-mr-sm text-weight-bold"
                      >Tagger</q-chip
                    >
                    <q-chip
                      v-if="instruction.packer"
                      outline
                      class="chip-packer q-mr-sm text-weight-bold"
                      >Packer</q-chip
                    >
                    <q-chip
                      v-if="instruction.collection"
                      outline
                      class="chip-collection q-mr-sm text-weight-bold"
                      >Collection</q-chip
                    >
                    <q-chip v-if="instruction.delivery" 
                     outline
                     class="chip-delivery text-weight-bold"
                      >Delivery</q-chip
                    >
                  </div>
                </div>
              </div>
              </div>
            </div>
          </q-form> 
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Close"
            class="negative-button"
            @click="isInvoiceDialogOpen = false"
          />
          <q-btn
            flat
            class="main-button"
            label="Generate Invoice"
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
  fetchAllOrders,
  fetchAllInvoices,
  fetchOrderDetails,
  fetchTransactionsByOrderId,
  updateOrderStatusAndDateById,
  fetchCustomerDetailsByOrderId,
  insertInvoiceByOrderId,
  fetchInvoiceByOrderId,
  fetchInstructionsByOrderId,
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
    field: (row) =>
      row.invoice_no ? row.invoice_no.toString().padStart(8, "0") : null,
    sortable: true,
  },
  {
    name: "invoice_date_time",
    align: "left",
    label: "Invoice Timestamp",
    field: (row) => formatDateTime(row.invoice_date_time),
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
const selectedOrder = ref({});
const selectedTransactions = ref([]);
const selectedInstructions = ref([]);
const formattedOrderDateTime = ref("");
const isInvoiceDialogOpen = ref(false);
const customer = ref({});
const router = useRouter();
const highlightedRow = ref(null);

async function fetchData() {
  try {
    const [allOrders, allInvoices] = await Promise.all([
      fetchAllOrders(),
      fetchAllInvoices(),
    ]);

    const combinedData = allOrders.map((order) => {
      const invoice = allInvoices.find((inv) => inv.order_id === order.id);
      return {
        ...order,
        invoice_no: invoice ? invoice.invoice_no : null,
        invoice_date_time: invoice ? invoice.invoice_date_time : null,
      };
    });

    invoices.value = combinedData;
    pendingInvoices.value = invoices.value.filter(
      (order) => order.status === "Pending"
    );
    generatedInvoices.value = invoices.value.filter(
      (order) => order.status === "Done"
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function viewOrder(row) {
  try {
    const orderDetails = await fetchOrderDetails(row.id);
    const transactions = await fetchTransactionsByOrderId(orderDetails.id);
    const instructions = await fetchInstructionsByOrderId(orderDetails.id);
    selectedOrder.value = orderDetails;
    selectedTransactions.value = transactions.map((transaction, index) => ({
      ...transaction,
      serial_no: index + 1,
    }));
    selectedInstructions.value = instructions;
    formattedOrderDateTime.value = formatDateTime(orderDetails.order_date_time);
    isInvoiceDialogOpen.value = true;
  } catch (error) {
    console.error("Error fetching order details:", error);
  }
}

async function generateInvoice() {
  try {
    selectedOrder.value.status = "Done";

    await updateOrderStatusAndDateById(
      selectedOrder.value.id,
      selectedOrder.value.status
    );

    await insertInvoiceByOrderId(selectedOrder.value.id);

    // Fetch the newly created invoice details
    await fetchInvoiceByOrderId(selectedOrder.value.id);

    isInvoiceDialogOpen.value = false;
    fetchData();
  } catch (error) {
    console.error("Error generating invoice:", error.message);
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
    query: { print: true },
  }).href;
  window.open(url, "_blank");
}

async function goToInvoice(row) {
  const orderId = row.id;
  if (row.status === "Pending") {
    tab.value = "pendings";
    await nextTick();
    highlightedRow.value = pendingInvoices.value.find(
      (order) => order.id === orderId
    )?.order_no;
  } else if (row.status === "Done") {
    tab.value = "generated";
    await nextTick();
    highlightedRow.value = generatedInvoices.value.find(
      (order) => order.id === orderId
    )?.invoice_no;
  }
  await nextTick(() => {
    setTimeout(() => {
      highlightedRow.value = null;
    }, 2000);
  });
}

onMounted(fetchData);
</script>

<template>
  <div class="order-management">
    <div class="q-pa-md">
      <q-card flat>
        <q-tabs v-model="tab" indicator-color="yellow-9" align="justify">
          <q-tab name="all" label="All Orders" />
          <q-tab name="pendings" label="Pending Orders" />
          <q-tab name="completed" label="Completed Orders" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="all">
            <div>
              <q-btn
                flat
                class="float-right main-button"
                label="Create Order"
                @click="openCreateOrder"
              />
            </div>
            <div class="row full-width justify-center q-mb-lg">
              <div class="text-h4">All Orders</div>
            </div>
            <!-- Search Field -->
            <div class="q-mb-lg search-container">
              <q-input
                v-model="searchQueryAll"
                placeholder="Search all orders"
                outlined
                dense
                clearable
                @clear="clearSearchAll"
              />
            </div>
            <q-table
              class="table"
              :rows="filteredAllOrders"
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
                        @click="goToOrder(props.row)"
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
            <!-- Search Field -->
            <div class="q-mb-lg search-container">
              <q-input
                v-model="searchQueryPending"
                placeholder="Search pending orders"
                outlined
                dense
                clearable
                @clear="clearSearchPending"
              />
            </div>
            <q-table
              class="table"
              :rows="filteredPendingOrders"
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
                        label="View Order"
                        class="main-button"
                        @click="navigateToOrderView(props.row)"
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

          <q-tab-panel name="completed">
            <h4>Completed Orders</h4>
            <!-- Search Field -->
            <div class="q-mb-lg search-container">
              <q-input
                v-model="searchQueryCompleted"
                placeholder="Search completed orders"
                outlined
                dense
                clearable
                @clear="clearSearchCompleted"
              />
            </div>
            <q-table
              class="table"
              :rows="filteredCompletedOrders"
              :columns="completedColumns"
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
                        label="View Order"
                        class="main-button"
                        @click="navigateToOrderView(props.row)"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { fetchAllOrders } from "@/../supabase/api/orders.js";

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

const completedColumns = [
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

const tab = ref("all");
const orders = ref([]);
const pendingOrders = ref([]);
const completedOrders = ref([]);
const router = useRouter();
const highlightedRow = ref(null);

const searchQueryAll = ref("");
const searchQueryPending = ref("");
const searchQueryCompleted = ref("");

// Computed properties for filtering orders based on search queries
const filteredAllOrders = computed(() => {
  if (!searchQueryAll.value) {
    return orders.value;
  }
  return orders.value.filter(order =>
    Object.values(order).some(val =>
      String(val).toLowerCase().includes(searchQueryAll.value.toLowerCase())
    )
  );
});

const filteredPendingOrders = computed(() => {
  if (!searchQueryPending.value) {
    return pendingOrders.value;
  }
  return pendingOrders.value.filter(order =>
    Object.values(order).some(val =>
      String(val).toLowerCase().includes(searchQueryPending.value.toLowerCase())
    )
  );
});

const filteredCompletedOrders = computed(() => {
  if (!searchQueryCompleted.value) {
    return completedOrders.value;
  }
  return completedOrders.value.filter(order =>
    Object.values(order).some(val =>
      String(val).toLowerCase().includes(searchQueryCompleted.value.toLowerCase())
    )
  );
});

async function fetchData() {
  try {
    const allOrders = await fetchAllOrders();

    orders.value = allOrders;
    pendingOrders.value = orders.value.filter(
      (order) => order.status === "Pending"
    );
    completedOrders.value = orders.value.filter(
      (order) => order.status === "Done"
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function navigateToOrderView(order) {
  const url = router.resolve({
    name: "View Order",
    params: { order_id: order.id },
  }).href;
  window.open(url, "_blank");
}

function openCreateOrder() {
  const url = router.resolve({
    name: "Create Order",
  }).href;
  window.open(url, "_blank");
}

async function goToOrder(row) {
  const order_id = row.id;
  if (row.status === "Pending") {
    tab.value = "pendings";
    await nextTick();
    highlightedRow.value = pendingOrders.value.find(
      (order) => order.id === order_id
    )?.order_no;
  } else if (row.status === "Done") {
    tab.value = "completed";
    await nextTick();
    highlightedRow.value = completedOrders.value.find(
      (order) => order.id === order_id
    )?.order_no;
  }
  await nextTick(() => {
    setTimeout(() => {
      highlightedRow.value = null;
    }, 2000);
  });
}

function clearSearchAll() {
  searchQueryAll.value = '';
}

function clearSearchPending() {
  searchQueryPending.value = '';
}

function clearSearchCompleted() {
  searchQueryCompleted.value = '';
}

onMounted(fetchData);
</script>

<style scoped>
.order-management {
  padding: 20px;
}

.q-dialog__inner {
  max-width: 500px;
}

.q-card-section.bg-primary {
  background-color: #3f51b5;
  color: #ffffff;
}

.search-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
</style>

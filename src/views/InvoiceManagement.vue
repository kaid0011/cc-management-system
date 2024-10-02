<template>
  <div class="invoice-management">
    <div class="q-pa-md">
      <q-card flat>
        <q-tabs v-model="tab" indicator-color="yellow-9" align="justify">
          <q-tab name="all" label="All Orders" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="all">
            <div>
              <q-btn flat class="float-right main-button" label="Generate Invoice" />
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
                      <q-checkbox
                        v-model="selectedOrders[props.row.id]"
                        :value="props.row.id"
                        :indeterminate-value="false"
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
import { ref, computed, onMounted } from "vue";
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
  {
    name: "actions",
    align: "left",
    label: "Actions",
    field: "actions",
  },
];

const tab = ref("all");
const orders = ref([]);
const selectedOrders = ref({});

const router = useRouter();
const highlightedRow = ref(null);

const searchQueryAll = ref("");

// Computed properties for filtering orders based on search queries
const filteredAllOrders = computed(() => {
  if (!searchQueryAll.value) {
    return orders.value;
  }
  return orders.value.filter((order) =>
    Object.values(order).some((val) =>
      String(val).toLowerCase().includes(searchQueryAll.value.toLowerCase())
    )
  );
});

async function fetchData() {
  try {
    const allOrders = await fetchAllOrders();
    orders.value = allOrders;

    // Initialize selectedOrders with default value of false
    orders.value.forEach(order => {
      selectedOrders.value[order.id] = false;
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function clearSearchAll() {
  searchQueryAll.value = "";
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

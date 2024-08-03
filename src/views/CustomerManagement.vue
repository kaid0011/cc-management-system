<template>
  <div class="customers-management">
    <!-- Add Customer Button -->
    <q-btn
      flat
      class="main-button q-mb-lg"
      @click="showAddCustomerDialog = true"
      label="Add Customer"
    />

    <!-- Customers Table -->
    <q-table
      class="table"
      :rows="customers"
      :columns="customerColumns"
      row-key="id"
      separator="cell"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-md">
          <q-btn
            flat
            label="View"
            class="main-button"
            @click="viewCustomer(props.row)"
          />
          <q-btn
            flat
            label="Update"
            class="secondary-button"
            @click="openUpdateDialog(props.row)"
          />
          <q-btn
            flat
            label="Delete"
            class="negative-button"
            @click="openDeleteDialog(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Add Customer Dialog -->
    <q-dialog
      v-model="showAddCustomerDialog"
      persistent
      transition-show="slide-down"
      transition-hide="slide-up"
    >
      <q-card class="dialog" style="width: 500px">
        <q-card-section class="dialog-header">
          <div class="text-body1 text-uppercase text-weight-bold">Add New Customer</div>
        </q-card-section>
        <q-card-section>
          <!-- Add Customer Form -->
          <q-form @submit.prevent="addCustomer" class="q-gutter-md">
            <q-input v-model="newCustomer.name" label="Name" outlined required />
            <q-input v-model="newCustomer.address" label="Address" outlined />
            <q-input v-model="newCustomer.contact_no1" label="Contact No 1" outlined />
            <q-input v-model="newCustomer.contact_no2" label="Contact No 2" outlined />
            <q-input v-model="newCustomer.email" label="Email" outlined />
            <q-input v-model="newCustomer.remarks" label="Remarks" outlined />
            <q-card-actions align="right">
              <q-btn flat class="negative-button"
              @click="showAddCustomerDialog = false"
                label="Cancel"
              />
              <q-btn flat class="main-button" color="primary" type="submit" label="Add Customer" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Update Customer Dialog -->
    <q-dialog
      v-model="showUpdateCustomerDialog"
      persistent
      transition-show="slide-down"
      transition-hide="slide-up"
    >
      <q-card class="dialog" style="width: 500px">
        <q-card-section class="dialog-header">
          <div class="text-body1 text-uppercase text-weight-bold">Update Customer</div>
        </q-card-section>
        <q-card-section>
          <!-- Update Customer Form -->
          <q-form @submit.prevent="updateCustomer" class="q-gutter-md">
            <q-input v-model="selectedCustomer.name" label="Name" outlined required />
            <q-input v-model="selectedCustomer.address" label="Address" outlined />
            <q-input v-model="selectedCustomer.contact_no1" label="Contact No 1" outlined />
            <q-input v-model="selectedCustomer.contact_no2" label="Contact No 2" outlined />
            <q-input v-model="selectedCustomer.email" label="Email" outlined />
            <q-input v-model="selectedCustomer.remarks" label="Remarks" outlined />
            <q-card-actions align="right">
              <q-btn flat class="negative-button"
                @click="showUpdateCustomerDialog = false"
                label="Cancel"
              />
              <q-btn flat class="main-button" type="submit" label="Update Customer" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog
      v-model="showDeleteCustomerDialog"
      persistent
      transition-show="slide-down"
      transition-hide="slide-up"
    >
      <q-card class="dialog" style="width: 500px">
        <q-card-section class="dialog-header">
          <div class="text-body1 text-uppercase text-weight-bold">Delete Customer</div>
        </q-card-section>
        <q-card-section>
          <p>Are you sure you want to delete this customer?</p>
          <q-card-actions align="right">
            <q-btn flat class="negative-button"
              label="No"
              @click="showDeleteCustomerDialog = false"
            />
            <q-btn flat class="main-button" label="Yes" @click="deleteCustomer" />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  fetchAllCustomers,
  createCustomer,
  updateCustomers,
  deleteCustomers,
} from "@/../supabase/api/customers.js";

const router = useRouter();

const customers = ref([]);
const customerColumns = [
  { name: "name", label: "Name", field: "name", align: "left", sortable: true },
  { name: "address", label: "Address", field: "address", align: "left", sortable: true },
  { name: "contact_no1", label: "Contact No 1", field: "contact_no1", align: "left", sortable: true },
  { name: "contact_no2", label: "Contact No 2", field: "contact_no2", align: "left", sortable: true },
  { name: "email", label: "Email", field: "email", align: "left", sortable: true },
  { name: "remarks", label: "Remarks", field: "remarks", align: "left", sortable: true },
  { name: "actions", label: "Actions", field: "actions", align: "left" },
];

const showAddCustomerDialog = ref(false);
const showUpdateCustomerDialog = ref(false);
const showDeleteCustomerDialog = ref(false);

const newCustomer = ref({
  name: "",
  address: "",
  contact_no1: "",
  contact_no2: "",
  email: "",
  remarks: ""
});

const selectedCustomer = ref({});

onMounted(async () => {
  await fetchAllCustomersData();
});

const fetchAllCustomersData = async () => {
  try {
    const fetchedCustomers = await fetchAllCustomers();
    if (fetchedCustomers) {
      customers.value = fetchedCustomers;
    } else {
      customers.value = [];
    }
  } catch (error) {
    console.error("Failed to fetch customers:", error);
  }
};

const viewCustomer = (customer) => {
  const url = router.resolve({ name: "View Customer", params: { id: customer.id } }).href;
  window.open(url, "_blank");
};

const openUpdateDialog = (customer) => {
  selectedCustomer.value = { ...customer };
  showUpdateCustomerDialog.value = true;
};

const openDeleteDialog = (customer) => {
  selectedCustomer.value = { ...customer };
  showDeleteCustomerDialog.value = true;
};

const addCustomer = async () => {
  try {
    await createCustomer(newCustomer.value);
    await fetchAllCustomersData();
    showAddCustomerDialog.value = false;
  } catch (error) {
    console.error("Error adding customer:", error);
  }
};

const updateCustomer = async () => {
  try {
    await updateCustomers(selectedCustomer.value);
    await fetchAllCustomersData();
    showUpdateCustomerDialog.value = false;
  } catch (error) {
    console.error("Error updating customer:", error);
  }
};

const deleteCustomer = async () => {
  try {
    await deleteCustomers(selectedCustomer.value.id);
    await fetchAllCustomersData();
    showDeleteCustomerDialog.value = false;
  } catch (error) {
    console.error("Error deleting customer:", error);
  }
};
</script>

<style scoped>
.customers-management {
  padding: 20px;
}

.q-dialog__inner {
  max-width: 500px;
}

.q-card-section.bg-primary {
  background-color: #3f51b5;
  color: #ffffff;
}
</style>

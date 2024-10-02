<template>
  <div class="drivers-management">
    <!-- Add Driver Button -->
    <q-btn
      flat
      class="main-button q-mb-lg"
      @click="showAddDriverDialog = true"
      label="Add Driver"
    />

    <!-- Search Field -->
    <div class="q-mb-lg search-container">
      <q-input
        v-model="searchQuery"
        placeholder="Search drivers"
        outlined
        dense
        clearable
        @clear="clearSearch"
      />
    </div>

    <!-- Drivers Table -->
    <q-table
      class="table"
      :rows="filteredDrivers"
      :columns="columns"
      row-key="id"
      separator="cell"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-md">
          <q-btn
            flat
            label="Update"
            class="main-button"
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

    <!-- Add Driver Dialog -->
    <q-dialog
      v-model="showAddDriverDialog"
      persistent
      transition-show="slide-down"
      transition-hide="slide-up"
    >
      <q-card style="width: 500px" class="dialog">
        <q-card-section class="dialog-header">
          <div class="text-body1 text-uppercase text-weight-bold">Add New Driver</div>
        </q-card-section>
        <q-card-section>
          <!-- Add Driver Form -->
          <q-form @submit="addDriver" class="q-gutter-md">
            <q-input
              v-model="newDriver.name"
              label="Driver Name"
              outlined
              required
            ></q-input>
            <q-input
              v-model="newDriver.code"
              label="Code"
              outlined
              required
            ></q-input>
            <q-input
              v-model="newDriver.contact_no1"
              label="Contact Number"
              type="tel"
              outlined
              required
            ></q-input>
            <q-card-actions align="right">
              <q-btn flat class="negative-button"
                @click="showAddDriverDialog = false"
                label="Cancel"
              ></q-btn>
              <q-btn flat type="submit" class="main-button" label="Add Driver"></q-btn>
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Update Driver Dialog -->
    <q-dialog
      v-model="showUpdateDriverDialog"
      persistent
      transition-show="slide-down"
      transition-hide="slide-up"
    >
      <q-card style="width: 500px" class="dialog">
        <q-card-section class="dialog-header">
          <div class="text-body1 text-uppercase text-weight-bold">Update Driver</div>
        </q-card-section>
        <q-card-section>
          <!-- Update Driver Form -->
          <q-form @submit="updateDriver" class="q-gutter-md">
            <q-input
              v-model="selectedDriver.name"
              label="Driver Name"
              outlined
              required
            ></q-input>
            <q-input
            v-model="selectedDriver.code"
            label="Code"
            outlined
            required
          ></q-input>
            <q-input
              v-model="selectedDriver.contact_no1"
              label="Contact Number"
              type="tel"
              outlined
              required
            ></q-input>
            <q-card-actions align="right">
              <q-btn flat class="negative-button"
                @click="showUpdateDriverDialog = false"
                label="Cancel"
              ></q-btn>
              <q-btn flat class="main-button" type="submit" label="Update Driver"></q-btn>
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog
      v-model="showDeleteDriverDialog"
      persistent
      transition-show="slide-down"
      transition-hide="slide-up"
    >
      <q-card style="width: 500px">
        <q-card-section class="dialog-header">
          <div class="text-body1 text-uppercase text-weight-bold">Delete Driver</div>
        </q-card-section>
        <q-card-section>
          <p>Are you sure you want to delete this driver?</p>
          <q-card-actions align="right">
            <q-btn flat class="negative-button"
              label="No"
              @click="showDeleteDriverDialog = false"
            ></q-btn>
            <q-btn flat class="main-button" label="Yes" @click="deleteDriver"></q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import {
  fetchAllDrivers,
  createDriver,
  updateDrivers,
  deleteDrivers,
} from "@/../supabase/api/drivers.js";

// Define columns for q-table
const columns = [
  {
    name: "name",
    label: "Name",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "code",
    label: "Code",
    align: "left",
    field: "code",
    sortable: true,
  },
  {
    name: "contact_no1",
    label: "Contact Number",
    align: "left",
    field: "contact_no1",
    sortable: true,
  },
  { name: "actions", label: "Actions", align: "left", field: "actions" },
];

// Define reactive variables
const drivers = ref([]);
const searchQuery = ref(""); // Added search query state
const showAddDriverDialog = ref(false);
const showUpdateDriverDialog = ref(false);
const showDeleteDriverDialog = ref(false);
const newDriver = ref({
  name: "",
  code: "",
  contact_no1: "",
});
const selectedDriver = ref({
  id: null,
  name: "",
  code: "",
  contact_no1: "",
});
const driverToDelete = ref(null);

// Quasar utilities
const $q = useQuasar();

// Computed property for filtered drivers
const filteredDrivers = computed(() => {
  if (!searchQuery.value) {
    return drivers.value;
  }
  return drivers.value.filter(driver =>
    Object.values(driver).some(val =>
      String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

// Fetch drivers on component mount
onMounted(async () => {
  await fetchDrivers();
});

// Function to fetch all drivers
const fetchDrivers = async () => {
  try {
    const fetchedDrivers = await fetchAllDrivers();
    if (fetchedDrivers) {
      drivers.value = fetchedDrivers;
    } else {
      drivers.value = [];
    }
  } catch (error) {
    console.error("Error fetching drivers:", error);
    $q.notify({ type: "negative", message: "Failed to fetch drivers" });
  }
};

// Function to add a new driver
const addDriver = async () => {
  try {
    const cleanedNewDriver = { ...newDriver.value };

    await createDriver(cleanedNewDriver);
    $q.notify({ type: "positive", message: "Driver added successfully" });
    showAddDriverDialog.value = false;
    await fetchDrivers(); // Refresh the drivers list
  } catch (error) {
    console.error("Error adding driver:", error);
    $q.notify({ type: "negative", message: "Failed to add driver" });
  }
};

// Function to open update driver dialog with selected driver data
const openUpdateDialog = (driver) => {
  selectedDriver.value = { ...driver };
  showUpdateDriverDialog.value = true;
};

// Function to update a driver
const updateDriver = async () => {
  try {
    const cleanedDriver = { ...selectedDriver.value };

    await updateDrivers(cleanedDriver);
    $q.notify({ type: "positive", message: "Driver updated successfully" });
    showUpdateDriverDialog.value = false;
    await fetchDrivers(); // Refresh the drivers list
  } catch (error) {
    console.error("Error updating driver:", error);
    $q.notify({ type: "negative", message: "Failed to update driver" });
  }
};

// Function to open delete confirmation dialog
const openDeleteDialog = (driver) => {
  driverToDelete.value = driver;
  showDeleteDriverDialog.value = true;
};

// Function to delete a driver
const deleteDriver = async () => {
  try {
    await deleteDrivers(driverToDelete.value.id);
    $q.notify({ type: "positive", message: "Driver deleted successfully" });
    showDeleteDriverDialog.value = false;
    await fetchDrivers();
  } catch (error) {
    console.error("Error deleting driver:", error);
    $q.notify({ type: "negative", message: "Failed to delete driver" });
  }
};

// Function to clear the search query
const clearSearch = () => {
  searchQuery.value = '';
};
</script>

<style scoped>
.drivers-management {
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

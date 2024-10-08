<template>
  <div class="items-management">
    <!-- Add Item Button -->
    <q-btn
      flat
      class="main-button q-mb-lg"
      @click="showAddItemDialog = true"
      label="Add Item"
    />

    <!-- Search Field -->
    <div class="q-mb-lg search-container">
      <q-input
        v-model="searchQuery"
        placeholder="Search items"
        outlined
        dense
        clearable
        @clear="clearSearch"
      />
    </div>

    <!-- Items Table -->
    <q-table
      class="table"
      :rows="filteredItems"
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

    <!-- Add Item Dialog -->
    <q-dialog
      v-model="showAddItemDialog"
      persistent
      transition-show="slide-down"
      transition-hide="slide-up"
    >
      <q-card style="width: 500px" class="dialog">
        <q-card-section class="dialog-header">
          <div class="text-body1 text-uppercase text-weight-bold">Add New Item</div>
        </q-card-section>
        <q-card-section>
          <!-- Add Item Form -->
          <q-form @submit="addItem" class="q-gutter-md">
            <q-input
              v-model="newItem.name"
              label="Item Name"
              outlined
              required
            ></q-input>
            <q-input
              v-model="newItem.category"
              label="Category"
              outlined
              required
            ></q-input>
            <q-input
              v-model="newItem.sub_category"
              label="Sub-category"
              outlined
            ></q-input>
            <q-input
              v-model="newItem.laundry_price"
              type="number"
              label="Laundry Price"
              outlined
            ></q-input>
            <q-input
              v-model="newItem.dryclean_price"
              type="number"
              label="Dry Clean Price"
              outlined
            ></q-input>
            <q-input
              v-model="newItem.pressing_price"
              type="number"
              label="Pressing Only Price"
              outlined
            ></q-input>
            <q-input
              v-model="newItem.others_price"
              type="number"
              label="Others Price"
              outlined
            ></q-input>
            <q-select
              v-model="newItem.unit"
              label="Unit"
              outlined
              :options="units"
              required
            ></q-select>
            <q-card-actions align="right">
              <q-btn
                flat
                class="negative-button"
                @click="showAddItemDialog = false"
                label="Cancel"
              ></q-btn>
              <q-btn flat type="submit" class="main-button" label="Add Item"></q-btn>
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Update Item Dialog -->
    <q-dialog
      v-model="showUpdateItemDialog"
      persistent
      transition-show="slide-down"
      transition-hide="slide-up"
    >
      <q-card style="width: 500px" class="dialog">
        <q-card-section class="dialog-header">
          <div class="text-body1 text-uppercase text-weight-bold">Update Item</div>
        </q-card-section>
        <q-card-section>
          <!-- Update Item Form -->
          <q-form @submit="updateItem" class="q-gutter-md">
            <q-input
              v-model="selectedItem.name"
              label="Item Name"
              outlined
              required
            ></q-input>
            <q-input
              v-model="selectedItem.category"
              label="Category"
              outlined
              required
            ></q-input>
            <q-input
              v-model="selectedItem.sub_category"
              label="Sub-category"
              outlined
            ></q-input>
            <q-input
              v-model="selectedItem.laundry_price"
              type="number"
              label="Laundry Price"
              outlined
            ></q-input>
            <q-input
              v-model="selectedItem.dryclean_price"
              type="number"
              label="Dry Clean Price"
              outlined
            ></q-input>
            <q-input
              v-model="selectedItem.pressing_price"
              type="number"
              label="Pressing Only Price"
              outlined
            ></q-input>
            <q-input
              v-model="selectedItem.others_price"
              type="number"
              label="Others Price"
              outlined
            ></q-input>
            <q-select
              v-model="selectedItem.unit"
              label="Unit"
              outlined
              :options="units"
              required
            ></q-select>
            <q-card-actions align="right">
              <q-btn
                flat
                class="negative-button"
                @click="showUpdateItemDialog = false"
                label="Cancel"
              ></q-btn>
              <q-btn flat class="main-button" type="submit" label="Update Item"></q-btn>
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog
      v-model="showDeleteItemDialog"
      persistent
      transition-show="slide-down"
      transition-hide="slide-up"
    >
      <q-card style="width: 500px">
        <q-card-section class="dialog-header">
          <div class="text-body1 text-uppercase text-weight-bold">Delete Item</div>
        </q-card-section>
        <q-card-section>
          <p>Are you sure you want to delete this item?</p>
          <q-card-actions align="right">
            <q-btn
              flat
              class="negative-button"
              label="No"
              @click="showDeleteItemDialog = false"
            ></q-btn>
            <q-btn flat class="main-button" label="Yes" @click="deleteItem"></q-btn>
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
  fetchAllItems,
  createItem,
  updateItems,
  deleteItems,
} from "@/../supabase/api/item_list.js";

// Define available units
const units = ["/pc", "/kg", "/cm", "/ft", "/sqft"];

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
    name: "category",
    label: "Category",
    align: "left",
    field: "category",
    sortable: true,
  },
  {
    name: "laundry_price",
    label: "Laundry",
    align: "left",
    field: (row) => (row.laundry_price ? `$ ${row.laundry_price.toFixed(2)}` : ""),
    sortable: true,
  },
  {
    name: "dryclean_price",
    label: "Dry Clean",
    align: "left",
    field: (row) => (row.dryclean_price ? `$ ${row.dryclean_price.toFixed(2)}` : ""),
    sortable: true,
  },
  {
    name: "pressing_price",
    label: "Pressing Only",
    align: "left",
    field: (row) => (row.pressing_price ? `$ ${row.pressing_price.toFixed(2)}` : ""),
    sortable: true,
  },
  {
    name: "others_price",
    label: "Others",
    align: "left",
    field: (row) => (row.others_price ? `$ ${row.others_price.toFixed(2)}` : ""),
    sortable: true,
  },
  {
    name: "unit",
    label: "Unit",
    align: "left",
    field: "unit",
    sortable: true,
  },
  { name: "actions", label: "Actions", align: "left", field: "actions" },
];

// Define reactive variables
const items = ref([]);
const searchQuery = ref(""); // Added search query state
const showAddItemDialog = ref(false);
const showUpdateItemDialog = ref(false);
const showDeleteItemDialog = ref(false);
const newItem = ref({
  name: "",
  category: "",
  sub_category: "None",
  laundry_price: null,
  dryclean_price: null,
  pressing_price: null,
  others_price: null,
  unit: "", // Added unit field
});
const selectedItem = ref({
  id: null,
  name: "",
  category: "",
  sub_category: "",
  laundry_price: 0,
  dryclean_price: 0,
  pressing_price: 0,
  others_price: 0,
  unit: "", // Added unit field
});
const itemToDelete = ref(null);

// Quasar utilities
const $q = useQuasar();

// Computed property for filtered items
const filteredItems = computed(() => {
  if (!searchQuery.value) {
    return items.value;
  }
  return items.value.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

// Fetch items on component mount
onMounted(async () => {
  await fetchItems();
});

// Helper function to set empty inputs to null
const cleanItem = (item) => {
  Object.keys(item).forEach((key) => {
    if (item[key] === "") {
      item[key] = null;
    }
  });
};

// Function to fetch all items
const fetchItems = async () => {
  try {
    const fetchedItems = await fetchAllItems();
    if (fetchedItems) {
      items.value = fetchedItems;
    } else {
      items.value = [];
    }
  } catch (error) {
    console.error("Error fetching items:", error);
    $q.notify({ type: "negative", message: "Failed to fetch items" });
  }
};

// Function to add a new item
const addItem = async () => {
  try {
    const cleanedNewItem = { ...newItem.value };
    cleanItem(cleanedNewItem);

    await createItem(cleanedNewItem);
    $q.notify({ type: "positive", message: "Item added successfully" });
    showAddItemDialog.value = false;
    await fetchItems(); // Refresh the items list
  } catch (error) {
    console.error("Error adding item:", error);
    $q.notify({ type: "negative", message: "Failed to add item" });
  }
};

// Function to open update item dialog with selected item data
const openUpdateDialog = (item) => {
  selectedItem.value = { ...item };
  showUpdateItemDialog.value = true;
};

// Function to update an item
const updateItem = async () => {
  try {
    const cleanedItem = { ...selectedItem.value };
    cleanItem(cleanedItem);

    await updateItems(cleanedItem);
    $q.notify({ type: "positive", message: "Item updated successfully" });
    showUpdateItemDialog.value = false;
    await fetchItems(); // Refresh the items list
  } catch (error) {
    console.error("Error updating item:", error);
    $q.notify({ type: "negative", message: "Failed to update item" });
  }
};

// Function to open delete confirmation dialog
const openDeleteDialog = (item) => {
  itemToDelete.value = item;
  showDeleteItemDialog.value = true;
};

// Function to delete an item
const deleteItem = async () => {
  try {
    await deleteItems(itemToDelete.value.id);
    $q.notify({ type: "positive", message: "Item deleted successfully" });
    showDeleteItemDialog.value = false;
    await fetchItems();
  } catch (error) {
    console.error("Error deleting item:", error);
    $q.notify({ type: "negative", message: "Failed to delete item" });
  }
};

// Function to clear the search query
const clearSearch = () => {
  searchQuery.value = '';
};
</script>

<style scoped>
.items-management {
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

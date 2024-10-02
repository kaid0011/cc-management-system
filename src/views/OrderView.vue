<template>
  <div class="order-view q-pa-md">
    <q-form>
      <q-tabs
        v-model="activeTab"
        class="text-weight-bold text-center"
        align="justify"
      >
        <q-tab name="order-details" label="Order Details" />
        <q-tab name="collection" label="Collection" />
        <q-tab name="deliveries" label="Deliveries" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="order-details">
          <q-card class="background2 row justify-center q-pa-md">
            <div class="column q-gutter-y-sm">
              <div class="text-body1 text-uppercase text-weight-bold text-center q-pb-md">
                Order Details
              </div>
              <template v-for="(label, key) in orderDetailsItems" :key="key">
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p text-weight-bold">{{ label }}:</div>
                  <q-input
                    class="pending-input"
                    outlined
                    v-model="selectedOrder[key]"
                    :readonly="readonlyItems.includes(key)"
                    :type="inputTypes[key] || 'text'"
                    dense
                  />
                </div>
              </template>
            </div>
          </q-card>

          <q-card class="background2 row justify-center q-pa-md">
            <div class="column q-gutter-y-sm">
              <div class="text-body1 text-uppercase text-weight-bold text-center q-pb-md">
                Customer Details
              </div>
              <template v-for="(label, key) in customerDetailsItems" :key="key">
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p text-weight-bold">{{ label }}:</div>
                  <q-input
                    class="pending-input"
                    outlined
                    v-model="customerDetails[key]"
                    readonly
                    dense
                  />
                </div>
              </template>
            </div>
          </q-card>

          <q-card class="background2 q-pa-xl">
            <div class="text-body1 text-uppercase text-weight-bold text-center q-pb-md">
              Transaction Details
            </div>
            <div class="row q-pb-sm">
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
                {{ transaction.serial_no }}
              </div>
              <div class="col-8">
                {{ transaction.item_name }}
              </div>
              <div class="col-1">
                {{ transaction.tag_no }}
              </div>
              <div class="col-2">
                {{ transaction.price }}
              </div>
            </div>
          </q-card>

          <q-card class="background2 q-pa-xl column justify-center">
            <div class="text-body1 text-uppercase text-weight-bold text-center q-pb-md">
              Order Instructions
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
                    <template v-for="chip in instructionChips" :key="chip.key">
                      <q-chip
                        v-if="instruction[chip.key]"
                        outline
                        :class="chip.class"
                        class="q-mr-sm text-weight-bold"
                        >{{ chip.label }}</q-chip
                      >
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </q-card>
        </q-tab-panel>

        <q-tab-panel name="collection">
          <q-card class="background2 q-pa-xl row justify-center">
            <div class="column q-gutter-y-sm">
              <div class="text-body1 text-uppercase text-weight-bold text-center q-pb-md">
                Collection Details
              </div>
              <template v-for="(label, key) in collectionDetailsItems" :key="key">
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p text-weight-bold">{{ label }}:</div>
                  <q-input
                    class="pending-customer"
                    outlined
                    :type="key.includes('date') ? 'date' : 'text'"
                    v-model="collectionDetails[key]"
                    readonly
                    dense
                  />
                </div>
              </template>
              <div class="row items-center justify-between q-gutter-x-md">
                <div class="text-p text-weight-bold">Driver Name:</div>
                <q-input
                  class="pending-customer"
                  outlined
                  v-model="collectionDetails.driver_name"
                  readonly
                  dense
                />
              </div>
              <q-btn label="Edit Collection" color="primary" @click="showEditDialog('collection')" />
              <div class="text-body1 text-uppercase text-weight-bold text-center q-pb-md">
                Collection Contact Person Details
              </div>
              <template v-for="(label, key) in contactDetailsItems" :key="key">
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p text-weight-bold">{{ label }}:</div>
                  <q-input
                    class="pending-customer"
                    outlined
                    v-model="collectionContactPerson[key]"
                    readonly
                    dense
                  />
                </div>
              </template>
              <q-btn label="Update" color="primary" @click="showDialog('collection')" />
            </div>
          </q-card>
        </q-tab-panel>

        <q-tab-panel name="deliveries">
          <q-card class="background2 q-pa-xl row justify-center">
            <div class="column q-gutter-y-sm">
              <div class="text-body1 text-uppercase text-weight-bold text-center q-pb-md">
                Delivery Details
              </div>
              <template v-for="(label, key) in deliveryDetailsItems" :key="key">
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p text-weight-bold">{{ label }}:</div>
                  <q-input
                    class="pending-customer"
                    outlined
                    :type="key.includes('date') ? 'date' : 'text'"
                    v-model="deliveryDetails[key]"
                    readonly
                    dense
                  />
                </div>
              </template>
              <div class="row items-center justify-between q-gutter-x-md">
                <div class="text-p text-weight-bold">Driver Name:</div>
                <q-input
                  class="pending-customer"
                  outlined
                  v-model="deliveryDetails.driver_name"
                  readonly
                  dense
                />
              </div>
              <q-btn label="Edit Delivery" color="primary" @click="showEditDialog('delivery')" />
              <div class="text-body1 text-uppercase text-weight-bold text-center q-pb-md">
                Delivery Contact Person Details
              </div>
              <template v-for="(label, key) in contactDetailsItems" :key="key">
                <div class="row items-center justify-between q-gutter-x-md">
                  <div class="text-p text-weight-bold">{{ label }}:</div>
                  <q-input
                    class="pending-customer"
                    outlined
                    v-model="deliveryContactPerson[key]"
                    readonly
                    dense
                  />
                </div>
              </template>
              <q-btn label="Update" color="primary" @click="showDialog('delivery')" />
            </div>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </q-form>

    <q-dialog v-model="showDialogVisible" persistent>
      <q-card class="q-pa-md">
        <div class="q-mb-md text-h6">Select Contact Person</div>
        <q-list bordered>
          <q-item
            v-for="person in contactPersons"
            :key="person.id"
            clickable
            @click="selectContactPerson(person.id)"
            :active="selectedContactPersonId === person.id"
          >
            <q-item-section>
              <template v-for="(label, key) in contactDetailsItems" :key="key">
                <q-item-label><strong>{{ label }}:</strong> {{ person[key] }}</q-item-label>
              </template>
            </q-item-section>
          </q-item>
        </q-list>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Update"
            color="primary"
            @click="updateContactPerson"
            :disabled="!selectedContactPersonId"
          />
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showEditDialogVisible" persistent>
      <q-card class="q-pa-md">
        <div class="q-mb-md text-h6">Edit {{ currentPanel }} Details</div>
        <div class="q-gutter-y-sm">
          <q-input
            v-model="editDetails.date_from"
            label="Date From"
            type="date"
            outlined
            dense
          />
          <q-input
            v-model="editDetails.date_to"
            label="Date To"
            type="date"
            outlined
            dense
          />
          <q-input
            v-model="editDetails.status"
            label="Status"
            outlined
            dense
          />
          <q-input
            v-model="editDetails.area"
            label="Area"
            outlined
            dense
          />
          <q-input
            v-model="editDetails.remarks"
            label="Remarks"
            type="textarea"
            outlined
            dense
          />
        </div>
        <q-card-actions align="right">
          <q-btn flat label="Save" color="primary" @click="updateDetails" />
          <q-btn flat label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  fetchOrderDetails,
  fetchCollectionDetails,
  fetchDeliveryDetails,
  fetchCustomerDetails,
  fetchTransactionsByOrderId,
  fetchInstructionsByOrderId,
  fetchContactPersonsByCustomerId,
  updateCollectionDetails,
  updateDeliveryDetails,
  updateCollectionContactPerson,
  updateDeliveryContactPerson,
} from "@/../supabase/api/orders.js";

const route = useRoute();
const router = useRouter();
const order_id = route.params.order_id;

const selectedOrder = ref({});
const collectionDetails = reactive({}); // Use reactive to allow editing
const deliveryDetails = reactive({}); // Use reactive to allow editing
const collectionContactPerson = ref({});
const deliveryContactPerson = ref({});
const customerDetails = ref({});
const selectedTransactions = ref([]);
const selectedInstructions = ref([]);
const formattedOrderDateTime = ref("");
const contactPersons = ref([]);
const selectedContactPersonId = ref(null);
const activeTab = ref("order-details");
const showDialogVisible = ref(false);
const showEditDialogVisible = ref(false);
const currentPanel = ref(null);

const orderDetailsItems = {
  order_no: "Order No.",
  order_date_time: "Order Timestamp",
  ready_by: "Ready By",
};

const customerDetailsItems = {
  name: "Name",
  remarks: "Remarks",
};

const contactDetailsItems = {
  name: "Name",
  contact_no1: "Contact No1",
  contact_no2: "Contact No2",
  email: "Email",
  address: "Address",
  postal: "Postal Code",
  remarks: "Remarks",
};

const collectionDetailsItems = {
  date_from: "Date From",
  date_to: "Date To",
  status: "Status",
  area: "Area",
  remarks: "Remarks",
};

const deliveryDetailsItems = {
  date_from: "Date From",
  date_to: "Date To",
  status: "Status",
  area: "Area",
  remarks: "Remarks",
};

const instructionChips = [
  { key: "admin", label: "Admin", class: "chip-admin" },
  { key: "tagger", label: "Tagger", class: "chip-tagger" },
  { key: "packer", label: "Packer", class: "chip-packer" },
  { key: "collection", label: "Collection", class: "chip-collection" },
  { key: "delivery", label: "Delivery", class: "chip-delivery" },
];

const readonlyItems = ["order_no", "order_date_time"];
const inputTypes = { ready_by: "date" };

const editDetails = reactive({
  date_from: '',
  date_to: '',
  status: '',
  area: '',
  remarks: '',
});

async function fetchOrderData() {
  try {
    const orderDetails = await fetchOrderDetails(order_id);

    if (orderDetails.collection_id) {
      const collectionDetailsResponse = await fetchCollectionDetails(orderDetails.collection_id);
      Object.assign(collectionDetails, formatDates(collectionDetailsResponse.collection)); // Format dates and populate collection details
      collectionContactPerson.value = collectionDetailsResponse.contact_person;
    }

    if (orderDetails.delivery_id) {
      const deliveryDetailsResponse = await fetchDeliveryDetails(orderDetails.delivery_id);
      Object.assign(deliveryDetails, formatDates(deliveryDetailsResponse.delivery)); // Format dates and populate delivery details
      deliveryContactPerson.value = deliveryDetailsResponse.contact_person;
    }

    if (orderDetails.customer_id) {
      const customer = await fetchCustomerDetails(orderDetails.customer_id);
      customerDetails.value = customer;

      const contactPersonData = await fetchContactPersonsByCustomerId(orderDetails.customer_id);
      contactPersons.value = contactPersonData;
    }

    const transactions = await fetchTransactionsByOrderId(orderDetails.id);
    const instructions = await fetchInstructionsByOrderId(orderDetails.id);

    selectedOrder.value = orderDetails;
    selectedTransactions.value = transactions.map((transaction, index) => ({
      ...transaction,
      serial_no: index + 1,
    }));
    selectedInstructions.value = instructions;
    formattedOrderDateTime.value = formatDateTime(orderDetails.order_date_time);
  } catch (error) {
    console.error("Error fetching order details:", error);
  }
}

function formatDates(details) {
  return {
    ...details,
    date_from: details.date_from ? details.date_from.split('T')[0] : '',
    date_to: details.date_to ? details.date_to.split('T')[0] : ''
  };
}

const formatDateTime = (dateString) =>
  new Date(dateString).toLocaleString("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

function selectContactPerson(personId) {
  selectedContactPersonId.value = personId;
  console.log("Selected Contact Person ID:", personId); // Debugging log
}

function showDialog(panel) {
  currentPanel.value = panel;
  showDialogVisible.value = true;
}

function showEditDialog(panel) {
  currentPanel.value = panel;
  showEditDialogVisible.value = true;
  if (panel === 'collection') {
    Object.assign(editDetails, collectionDetails);
  } else if (panel === 'delivery') {
    Object.assign(editDetails, deliveryDetails);
  }
}

async function updateContactPerson() {
  try {
    if (currentPanel.value === 'collection') {
      if (!selectedOrder.value.collection_id) {
        alert("Collection ID is missing, unable to update contact person.");
        return;
      }

      alert(`Attempting to update contact person for collection ID: ${selectedOrder.value.collection_id} to contact person ID: ${selectedContactPersonId.value}`);
      
      await updateCollectionContactPerson(selectedOrder.value.collection_id, selectedContactPersonId.value);

      collectionContactPerson.value = contactPersons.value.find(
        (person) => person.id === selectedContactPersonId.value
      );

      alert(`Updated contact person for collection ID: ${selectedOrder.value.collection_id}`);
    }

    if (currentPanel.value === 'delivery') {
      if (!selectedOrder.value.delivery_id) {
        alert("Delivery ID is missing, unable to update contact person.");
        return;
      }

      alert(`Attempting to update contact person for delivery ID: ${selectedOrder.value.delivery_id} to contact person ID: ${selectedContactPersonId.value}`);

      await updateDeliveryContactPerson(selectedOrder.value.delivery_id, selectedContactPersonId.value);

      deliveryContactPerson.value = contactPersons.value.find(
        (person) => person.id === selectedContactPersonId.value
      );

      alert(`Updated contact person for delivery ID: ${selectedOrder.value.delivery_id}`);
    }
  } catch (error) {
    alert("Error updating contact person: " + error.message);
  } finally {
    showDialogVisible.value = false;
  }
}

async function updateDetails() {
  try {
    const sanitizeInput = (value) => (value === '' ? null : value);

    const updateData = {
      date_from: sanitizeInput(editDetails.date_from),
      date_to: sanitizeInput(editDetails.date_to),
      status: sanitizeInput(editDetails.status),
      area: sanitizeInput(editDetails.area),
      remarks: sanitizeInput(editDetails.remarks),
    };

    if (currentPanel.value === 'collection') {
      if (!selectedOrder.value.collection_id) {
        alert("Collection ID is missing, unable to update details.");
        return;
      }

      console.log('Attempting to update collection details with:', updateData);

      await updateCollectionDetails(
        selectedOrder.value.collection_id,
        updateData
      );

      // Re-fetch the updated collection details
      const refreshedCollection = await fetchCollectionDetails(
        selectedOrder.value.collection_id
      );

      Object.assign(collectionDetails, formatDates(refreshedCollection.collection));

      alert('Collection details updated successfully!');
    } else if (currentPanel.value === 'delivery') {
      if (!selectedOrder.value.delivery_id) {
        alert("Delivery ID is missing, unable to update details.");
        return;
      }

      console.log('Attempting to update delivery details with:', updateData);

      await updateDeliveryDetails(
        selectedOrder.value.delivery_id,
        updateData
      );

      // Re-fetch the updated delivery details
      const refreshedDelivery = await fetchDeliveryDetails(
        selectedOrder.value.delivery_id
      );

      Object.assign(deliveryDetails, formatDates(refreshedDelivery.delivery));

      alert('Delivery details updated successfully!');
    }
  } catch (error) {
    alert('Error updating details: ' + error.message);
  } finally {
    showEditDialogVisible.value = false;
  }
}



onMounted(fetchOrderData);
</script>

<style scoped>
.order-view {
  padding: 20px;
}

.q-item.active {
  background-color: #e0f7fa;
}
</style>

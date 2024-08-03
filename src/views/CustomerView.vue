<template>
    <div class="contact-persons-management">
      <!-- Add Contact Person Button -->
      <q-btn
        flat
        class="main-button q-mb-lg"
        @click="showAddContactPersonDialog = true"
        label="Add Contact Person"
      />
  
      <!-- Contact Persons Table -->
      <q-table
        class="table"
        :rows="contactPersons"
        :columns="contactPersonColumns"
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
  
      <!-- Add Contact Person Dialog -->
      <q-dialog
        v-model="showAddContactPersonDialog"
        persistent
        transition-show="slide-down"
        transition-hide="slide-up"
      >
        <q-card class="dialog" style="width: 500px">
          <q-card-section class="dialog-header">
            <div class="text-body1 text-uppercase text-weight-bold">Add New Contact Person</div>
          </q-card-section>
          <q-card-section>
            <!-- Add Contact Person Form -->
            <q-form @submit.prevent="addContactPerson" class="q-gutter-md">
              <q-input v-model="newContactPerson.name" label="Name" outlined required />
              <q-input v-model="newContactPerson.address" label="Address" outlined />
              <q-input v-model="newContactPerson.contact_no1" label="Contact No 1" outlined />
              <q-input v-model="newContactPerson.contact_no2" label="Contact No 2" outlined />
              <q-input v-model="newContactPerson.email" label="Email" outlined />
              <q-input v-model="newContactPerson.remarks" label="Remarks" outlined />
              <q-card-actions align="right">
                <q-btn flat class="negative-button"
                  @click="showAddContactPersonDialog = false"
                  label="Cancel"
                />
                <q-btn flat class="main-button" type="submit" label="Add Contact Person" />
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
  
      <!-- Update Contact Person Dialog -->
      <q-dialog
        v-model="showUpdateContactPersonDialog"
        persistent
        transition-show="slide-down"
        transition-hide="slide-up"
      >
        <q-card class="dialog" style="width: 500px">
          <q-card-section class="dialog-header">
            <div class="text-body1 text-uppercase text-weight-bold">Update Contact Person</div>
          </q-card-section>
          <q-card-section>
            <!-- Update Contact Person Form -->
            <q-form @submit.prevent="updateContactPerson" class="q-gutter-md">
              <q-input v-model="selectedContactPerson.name" label="Name" outlined required />
              <q-input v-model="selectedContactPerson.address" label="Address" outlined />
              <q-input v-model="selectedContactPerson.contact_no1" label="Contact No 1" outlined />
              <q-input v-model="selectedContactPerson.contact_no2" label="Contact No 2" outlined />
              <q-input v-model="selectedContactPerson.email" label="Email" outlined />
              <q-input v-model="selectedContactPerson.remarks" label="Remarks" outlined />
              <q-card-actions align="right">
                <q-btn flat class="negative-button"
                  @click="showUpdateContactPersonDialog = false"
                  label="Cancel"
                />
                <q-btn flat class="main-button" type="submit" label="Update Contact Person" />
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
  
      <!-- Delete Confirmation Dialog -->
      <q-dialog
        v-model="showDeleteContactPersonDialog"
        persistent
        transition-show="slide-down"
        transition-hide="slide-up"
      >
        <q-card class="dialog" style="width: 500px">
          <q-card-section class="dialog-header">
            <div class="text-body1 text-uppercase text-weight-bold">Delete Contact Person</div>
          </q-card-section>
          <q-card-section>
            <p>Are you sure you want to delete this contact person?</p>
            <q-card-actions align="right">
              <q-btn flat class="negative-button"
                label="No"
                @click="showDeleteContactPersonDialog = false"
              />
              <q-btn flat class="main-button" label="Yes" @click="deleteContactPerson" />
            </q-card-actions>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import {
    fetchContactPersonsByCustomerId,
    createContactPerson,
    updateContactPersons,
    deleteContactPersons,
  } from '@/../supabase/api/contact_persons.js';
  
  const route = useRoute();
  const contactPersons = ref([]);
  const contactPersonColumns = [
    { name: "name", label: "Name", field: "name", align: "left", sortable: true },
    { name: "address", label: "Address", field: "address", align: "left", sortable: true },
    { name: "contact_no1", label: "Contact No 1", field: "contact_no1", align: "left", sortable: true },
    { name: "contact_no2", label: "Contact No 2", field: "contact_no2", align: "left", sortable: true },
    { name: "email", label: "Email", field: "email", align: "left", sortable: true },
    { name: "remarks", label: "Remarks", field: "remarks", align: "left", sortable: true },
    { name: "actions", label: "Actions", field: "actions", align: "left" },
  ];
  
  const showAddContactPersonDialog = ref(false);
  const showUpdateContactPersonDialog = ref(false);
  const showDeleteContactPersonDialog = ref(false);
  
  const newContactPerson = ref({
    name: "",
    address: "",
    contact_no1: "",
    contact_no2: "",
    email: "",
    remarks: ""
  });
  const selectedContactPerson = ref({});
  
  onMounted(async () => {
    await loadContactPersons();
  });
  
  const loadContactPersons = async () => {
    try {
      contactPersons.value = await fetchContactPersonsByCustomerId(route.params.id);
    } catch (error) {
      console.error("Error loading contact persons:", error);
    }
  };
  
  const addContactPerson = async () => {
    try {
      await createContactPerson({ ...newContactPerson.value, customer_id: route.params.id });
      await loadContactPersons();
      showAddContactPersonDialog.value = false;
    } catch (error) {
      console.error("Error adding contact person:", error);
    }
  };
  
  const updateContactPerson = async () => {
    try {
      await updateContactPersons(selectedContactPerson.value);
      await loadContactPersons();
      showUpdateContactPersonDialog.value = false;
    } catch (error) {
      console.error("Error updating contact person:", error);
    }
  };
  
  const deleteContactPerson = async () => {
    try {
      await deleteContactPersons(selectedContactPerson.value.id);
      await loadContactPersons();
      showDeleteContactPersonDialog.value = false;
    } catch (error) {
      console.error("Error deleting contact person:", error);
    }
  };
  
  const openUpdateDialog = (contactPerson) => {
    selectedContactPerson.value = { ...contactPerson };
    showUpdateContactPersonDialog.value = true;
  };
  
  const openDeleteDialog = (contactPerson) => {
    selectedContactPerson.value = { ...contactPerson };
    showDeleteContactPersonDialog.value = true;
  };
  </script>
  
  <style scoped>
  .contact-persons-management {
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
  
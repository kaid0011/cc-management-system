<template>
  <div class="q-mt-xl">
    <div class="dashboard">
      <div class="text-h4 text-uppercase q-mb-lg">Board of Announcements</div>
      <div v-if="announcements.length" class="announcement-container">
        <div
          v-for="announcement in announcements"
          :key="announcement.id"
          class="announcement"
        >
          <div class="text-h2 announcement-title">{{ announcement.title }}</div>
          <div class="text-p announcement-description">{{ announcement.description }}</div>
          <div class="text-p announcement-dates">
            From: {{ formatDate(announcement.post_from) }} <br />
            To: {{ formatDate(announcement.post_to) }}
          </div>
        </div>
      </div>
      <div v-else class="no-announcements">
        <div class="text-p">No announcements available.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchAnnouncements } from "@/../supabase/api/announcements";

const announcements = ref([]);

onMounted(async () => {
  announcements.value = await fetchAnnouncements();
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
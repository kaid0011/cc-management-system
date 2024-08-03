<template>
  <q-header class="toolbar q-py-xs" height-hint="58">
    <q-toolbar>
      <q-btn
      flat
        dense
        round
        @click="toggleLeftDrawer"
        aria-label="Menu"
        icon="menu"
      />
      <q-btn flat no-caps no-wrap v-if="$q.screen.gt.xs">
        <img
          src="@/assets/images/orange_logo.png"
          alt="Logo"
          style="height: 40px; width: auto"
        />
        <q-toolbar-title shrink class="text-weight-bold text-uppercase">
          CC Management System
        </q-toolbar-title>
      </q-btn>
      <q-space />
      <q-toggle
        v-model="isDarkMode"
        :color="toggleColor"
        label-left
        icon="light_mode"
        checked-icon="dark_mode"
        unchecked-icon="light_mode"
        @change="toggleTheme"
      />
    </q-toolbar>
  </q-header>
  <q-drawer
    v-model="leftDrawerOpen"
    show-if-above
    class="bg-grey-2"
    :width="240"
  >
    <q-scroll-area class="fit">
      <q-list padding>
        <q-item
          v-for="link in links1"
          :key="link.text"
          v-ripple
          clickable
          @click="navigate(link.path)"
        >
          <q-item-section avatar>
            <q-icon color="grey" :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-left">{{ link.text }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator class="q-my-md" />
      </q-list>
      <q-list padding>
        <q-item
          v-for="link in links2"
          :key="link.text"
          v-ripple
          clickable
          @click="link.text === 'Log Out' ? signOut() : navigate(link.path)"
        >
          <q-item-section avatar>
            <q-icon color="grey" :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-left">{{ link.text }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator class="q-my-md" />
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { getProfile, signOutUser } from "@/../supabase/api/auth.js";

const props = defineProps({
  session: {
    type: Object,
    default: () => ({ user: null }), // Default value to prevent undefined error
  },
});

const leftDrawerOpen = ref(false);
const router = useRouter();

// Initialize state
const username = ref("");
const website = ref("");
const avatarUrl = ref("");
const loading = ref(false);

onMounted(async () => {
  const { user } = props.session; // Access the user from props

  if (user) {
    loading.value = true;

    const { data, error } = await getProfile(user.id);

    if (error) {
      console.warn(error);
    } else if (data) {
      username.value = data.username;
      website.value = data.website;
      avatarUrl.value = data.avatar_url;
    }

    loading.value = false;
  }
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function navigate(path) {
  router.push(path);
}

const links1 = [
  { icon: "dashboard", text: "Dashboard", path: "/" },
  { icon: "inventory", text: "Item Management", path: "/items" },
  { icon: "receipt_long", text: "Invoice Management", path: "/invoices" },
  { icon: "person", text: "Customer Management", path: "/customers" },
];

const links2 = [{ icon: "logout", text: "Log Out", path: "/" }];

const isDarkMode = ref(false);

const toggleColor = computed(() => (isDarkMode.value ? "teal" : "primary"));

const toggleTheme = () => {
  const htmlElement = document.documentElement;
  const newTheme = isDarkMode.value ? "dark" : "light";
  htmlElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    isDarkMode.value = savedTheme === "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }
});

watch(isDarkMode, () => {
  toggleTheme();
});

const signOut = () => {
  signOutUser();
};
</script>

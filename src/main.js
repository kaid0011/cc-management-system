import { createApp } from "vue";
import { Quasar, Dialog, Notify } from "quasar";
import router from "./router";
import print from 'vue3-print-nb'

// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/fontawesome-v5/fontawesome-v5.css";
import "@quasar/extras/fontawesome-v6/fontawesome-v6.css";

import "quasar/src/css/index.sass";
import "./style.css";

import App from "./App.vue";

const myApp = createApp(App);

myApp.use(Quasar, {
  config: {
    dark: false /* look at QuasarConfOptions from the API card */,
  },
  plugins: {
    Dialog,
    Notify,
  }, // import Quasar plugins and add here
});

myApp.use(router);
myApp.use(print);
myApp.mount("#app");

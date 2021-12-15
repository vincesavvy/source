import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./locales/i18n.js"

createApp(App).use(i18n).mount("#app");

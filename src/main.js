import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./locales/i18n.js";
import router from "./routes/router";
import store from "./state/store"

createApp(App).use(i18n).use(router).use(store).mount("#app");

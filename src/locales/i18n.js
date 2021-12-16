import { createI18n } from "vue-i18n/index";
import en from "./en.json"
import fr from "./fr.json"

const i18n = createI18n({
  locale: "en",
  messages: {
    en,
    fr
    // en: en,
    // fr: fr
  }
});

export default i18n
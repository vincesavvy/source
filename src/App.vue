<template>
  <div class="container">
    <HomePage v-if="path === '/'"/>
    <SignUpPage v-else-if="path === '/signup'"/>
    <LoginPage v-else-if="path === '/login'"/>
    <UserPage v-else-if="path.startsWith('/user/')"/>
    <LanguageSelector/>
  </div>
</template>

<script>
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import UserPage from "./pages/UserPage"
import LanguageSelector from "./components/LanguageSelector"

export default {
  name: "App",
  components: {
    HomePage,
    SignUpPage,
    LoginPage,
    UserPage,
    LanguageSelector
  },

  computed: {
    path() {
      return window.location.pathname
    }
  }
};
</script>
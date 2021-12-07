<template>
  <form>
    <h1>Sign Up</h1>

    <label for="username">Username</label>
    <input id="username" v-model="username" />

    <label for="email">Email</label>
    <input id="email" v-model="email" />

    <label for="password">Password</label>
    <input id="password" type="password" v-model="password" />

    <label for="password-repeat">Password Repeat</label>
    <input id="password-repeat" type="password" v-model="passwordRepeat" />

    <button :disabled="isDisabled" @click.prevent="submit">Sign Up</button>
  </form>
</template>

<script>
// import axios from "axios";
export default {
  name: "SignUpPage",

  data() {
    return {
      username: "",
      email: "",
      password: "",
      passwordRepeat: "",
    };
  },

  computed: {
    isDisabled() {
      return this.password && this.passwordRepeat
        ? this.password !== this.passwordRepeat
        : true;
      /*
       ** ### EXPLANATION OF THIS TERNARY OPERATOR ###
       ** If "password" and "passwordRepeat" have value:
       ** If it's true (they have value), check if they are the same thing, if they are the same thing, return false => "isDisabled" returns false, button is enabled!
       ** If it's true and they are not the same thing, return true => "isDisabled" returns true, button is disabled!
       ** If "password" and "passwordRepeat" don't have value: return true => "isDisabled" returns true, button is disabled!
       */
    },
  },

  methods: {
    submit() {
      const requestBody = {
        username: this.username,
        email: this.email,
        password: this.password,
      }
      // axios.post("/api/1.0/users", {
      //   username: this.username,
      //   email: this.email,
      //   password: this.password,
      // });
      fetch("/api/1.0/users", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type" : "application/json"
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
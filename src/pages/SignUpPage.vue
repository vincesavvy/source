<template>
  <h1>Sign Up</h1>

  <label for="username">Username</label>
  <input id="username" />

  <label for="email">Email</label>
  <input id="email" />

  <label for="password">Password</label>
  <input id="password" type="password" v-model="password" />

  <label for="password-repeat">Password Repeat</label>
  <input id="password-repeat" type="password" v-model="passwordRepeat" />

  <button :disabled="isDisabled">Sign Up</button>
</template>

<script>

export default {

  name: "SignUpPage",

  data() {
    return {
      password: '',
      passwordRepeat: ''
    };
  },

  computed: {
    isDisabled() {
      return (this.password && this.passwordRepeat ? this.password !== this.passwordRepeat : true) 
      /* 
      ** ### EXPLANATION OF THIS TERNARY OPERATOR ###
      ** If "password" and "passwordRepeat" have value:
      ** If it's true (they have value), check if they are the same thing, if they are the same thing, return false => "isDisabled" returns false, button is enabled!
      ** If it's true and they are not the same thing, return true => "isDisabled" returns true, button is disabled!
      ** If "password" and "passwordRepeat" don't have value: return true => "isDisabled" returns true, button is disabled!
      */
    }
  },

  methods: {
    //
  }
};
</script>

<style lang="scss" scoped>
</style>
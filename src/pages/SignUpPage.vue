<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
    <form class="card mt-5">
      <div class="card-header">
        <h1 class="text-center">Sign Up</h1>
      </div>

      <div class="card-body">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input id="username" v-model="username" class="form-control" />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input id="email" v-model="email" class="form-control" />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            class="form-control"
          />
        </div>

        <div class="mb-3">
          <label for="password-repeat" class="form-label"
            >Password Repeat</label
          >
          <input
            id="password-repeat"
            type="password"
            v-model="passwordRepeat"
            class="form-control"
          />
        </div>

        <div class="text-center">
          <button
            :disabled="isDisabled"
            @click.prevent="submit"
            class="btn btn-primary"
          >
            Sign Up
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
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
      axios.post("/api/1.0/users", {
        username: this.username,
        email: this.email,
        password: this.password,
      });
    },
  },
};
</script>


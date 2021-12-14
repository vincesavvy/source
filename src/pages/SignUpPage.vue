<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
    <form v-if="!signUpSuccess" class="card mt-5" data-testid="form-sign-up">
      <div class="card-header">
        <h1 class="text-center">Sign Up</h1>
      </div>

      <div class="card-body">

        <Input
          id="username"
          label="Username"
          :help="errors.username"
          v-model="username"
        />
        <!-- NOTE: We could have multiple v-models, like this: v-model:input-one="username" v-model:input-two="identifier"... and in the Input component, we would only need to reflect the "emits" array and their relevent ":value" and such... -->

        <!-- NOTE: <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input id="username" v-model="username" class="form-control" />
          <span>{{errors.username}}</span>
        </div> -->

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
            :disabled="isDisabled || apiProgress"
            @click.prevent="submit"
            class="btn btn-primary"
          >
            <span
              v-if="apiProgress"
              class="spinner-border spinner-border-sm"
              role="status"
            ></span>
            <!-- This "span" used to have the property: "aria-hidden='true'", but this renders it "hidden" to the DOM. So, a test that would query for its "role" of "status" would fail... So we removed the "aria-hidden='true'". -->
            Sign Up
          </button>
        </div>
      </div>
    </form>

    <div v-else class="alert alert-success mt-3">
      Please check your email to activate your account.
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Input from "../components/Input.vue";

export default {
  name: "SignUpPage",

  components: {
    Input,
  },

  data() {
    return {
      username: "",
      email: "",
      password: "",
      passwordRepeat: "",
      apiProgress: false,
      signUpSuccess: false,
      errors: {},
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
      this.apiProgress = true;
      axios
        .post("/api/1.0/users", {
          username: this.username,
          email: this.email,
          password: this.password,
        })
        .then(() => {
          this.signUpSuccess = true;
        })
        .catch((error) => {
          if (error.response.status === 400) {
            this.errors = error.response.data.validationErrors;
          }
          this.apiProgress = false;
        });
    },
  },
};
</script>


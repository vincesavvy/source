<template>
  <div
    class="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
    data-testid="signup-page"
  >
    <form v-if="!signUpSuccess" class="mt-5" data-testid="form-sign-up">
      <Card>
        <template v-slot:header>
          <h1>{{ $t("signUp") }}</h1>
        </template>

        <template v-slot:body>
          <Input
            id="username"
            :label="$t('username')"
            :help="errors.username"
            v-model="username"
          />

          <Input
            id="email"
            :label="$t('email')"
            :help="errors.email"
            v-model="email"
          />

          <Input
            type="password"
            id="password"
            :label="$t('password')"
            :help="errors.password"
            v-model="password"
          />

          <Input
            type="password"
            id="password-repeat"
            :label="$t('passwordRepeat')"
            :help="hasPasswordMismatch ? $t('passwordMismatch') : ''"
            v-model="passwordRepeat"
          />

          <div class="text-center">
            <ButtonWithProgress
              :apiProgress="apiProgress"
              :disabled="isDisabled"
              :onClick="submit"
            >
              {{ $t("signUp") }}
            </ButtonWithProgress>
          </div>
        </template>
      </Card>
    </form>

    <div v-else class="alert alert-success mt-3">
      {{ $t("acountActivationNotification") }}
    </div>
  </div>
</template>

<script>
import { signUp } from "../api/apiCalls.js";
import Input from "../components/Input.vue";
import ButtonWithProgress from "../components/ButtonWithProgress";
import Card from "../components/Card";

export default {
  name: "SignUpPage",

  components: {
    Input,
    ButtonWithProgress,
    Card,
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

  watch: {
    username() {
      delete this.errors.username;
    },
    email() {
      delete this.errors.email;
    },
    password() {
      delete this.errors.password;
    },
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
    hasPasswordMismatch() {
      return this.password !== this.passwordRepeat;
    },
  },

  methods: {
    async submit() {
      this.apiProgress = true;

      try {
        await signUp({
          username: this.username,
          email: this.email,
          password: this.password,
        });
        this.signUpSuccess = true;
      } catch (error) {
        if (error.response.status === 400) {
          this.errors = error.response.data.validationErrors;
        }
        this.apiProgress = false;
      }
    },
  },
};
</script>


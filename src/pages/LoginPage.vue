<template>
  <div
    class="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
    data-testid="login-page"
  >
    <form class="card mt-5">
      <div class="card-header">
        <h1 class="text-center">Login</h1>
      </div>

      <div class="card-body">
        <Input id="email" label="Email" v-model="email" />

        <Input
          type="password"
          id="password"
          label="Password"
          v-model="password"
        />

        <div class="text-center">
          <button
            :disabled="isDisabled || apiProgress"
            class="btn btn-primary"
            @click.prevent="submit"
          >
            <Spinner v-if="apiProgress" />
            Login
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Input from "../components/Input";
import Spinner from "../components/Spinner";
import { login } from "../api/apiCalls";
export default {
  components: {
    Input,
    Spinner,
  },
  data() {
    return {
      email: "",
      password: "",
      apiProgress: false,
    };
  },
  computed: {
    isDisabled() {
      return !(this.email && this.password);
    },
  },
  methods: {
    async submit() {
      this.apiProgress = true;
      try {
        await login({ email: this.email, password: this.password });
      } catch (e) {
        //
      }
      this.apiProgress = false;
    },
  },
};
</script>

<style scoped>
</style>
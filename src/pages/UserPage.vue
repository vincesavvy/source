<template>
  <div data-testid="user-page">
    <ProfileCard :user="user" v-if="!pendingApiCall && !failResponse" />
    <div v-else-if="pendingApiCall" class="alert alert-secondary text-center">
      <Spinner size="normal" />
    </div>
    <div class="alert alert-danger text-center" v-if="failResponse">
        {{failResponse}}
    </div>
  </div>
</template>

<script>
import ProfileCard from "../components/ProfileCard.vue";
import Spinner from "../components/Spinner.vue";
import { getUserById } from "../api/apiCalls";
export default {
  name: "UserPage",
  components: {
    ProfileCard,
    Spinner,
  },
  data() {
    return {
      user: {},
      pendingApiCall: true,
      failResponse: undefined,
    };
  },
  async mounted() {
    try {
      const response = await getUserById(this.$route.params.id);
      this.user = response.data;
    } catch (e) {
      this.failResponse = e.response.data.message;
    }

    this.pendingApiCall = false;
  },
};
</script>

<style scoped>
</style>
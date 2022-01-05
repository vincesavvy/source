<template>
  <div data-testid="user-page">
    <ProfileCard :user="user" v-if="!pendingApiCall" />
    <div v-else class="alert alert-secondary text-center">
    <Spinner size="normal" />
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
    Spinner
  },
  data() {
    return {
      user: {},
      pendingApiCall: true
    };
  },
  async mounted() {
    const response = await getUserById(this.$route.params.id);
    this.user = response.data;
    this.pendingApiCall = false
  },
};
</script>

<style scoped>
</style>
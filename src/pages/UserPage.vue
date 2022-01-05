<template>
  <div data-testid="user-page">
    <ProfileCard :user="user" />
  </div>
</template>

<script>
import ProfileCard from "../components/ProfileCard.vue";
import { getUserById } from "../api/apiCalls";
export default {
  name: "UserPage",
  components: {
    ProfileCard,
  },
  data() {
    return {
      user: {},
    };
  },
  async mounted() {
    const response = await getUserById(this.$route.params.id);
    this.user = response.data;
  },
};
</script>

<style scoped>
</style>
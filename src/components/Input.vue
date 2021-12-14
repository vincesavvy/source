<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <input :id="id" class="form-control" />
    <span>{{ help }}</span>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    id: String,
    help: String,
  },
  data() {
    return {
      //
    };
  },
};
</script>

<style scoped>
</style>
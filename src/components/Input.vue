<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <input :id="id" class="form-control" @input="onChange" />
    <!-- NOTE: The developper tool, using " @input="onChange" " will not reflect the change right away, but it does work.-->
    <span>{{ help }}</span>
  </div>
</template>

<script>
export default {
  emits: ["custom"],
  props: {
    label: String,
    id: String,
    help: String,
  },
  methods: {
    onChange(event) {
      this.$emit("custom", event.target.value);
    },
  },
};
</script>

<style scoped>
</style>
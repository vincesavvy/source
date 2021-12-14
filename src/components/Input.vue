<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <input :id="id" class="form-control" @input="onChange"/>
    <!-- NOTE: The developper tool, using " @input="onChange" " will not reflect the change right away, but it does work.-->
    <span>{{ help }}</span>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    id: String,
    help: String,
    onChange: Function
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
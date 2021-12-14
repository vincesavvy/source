<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <input
      :id="id"
      class="form-control"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    
    <span>{{ help }}</span>
  </div>
</template>

<script>
export default {
    // IMPORTANT: using this method, with "props : modelValue [and] emits: ["update:modelValue"] ", the vue devtools is now able to keep track of the v-model chnages!
  emits: ["update:modelValue"],
  props: {
    label: String,
    id: String,
    help: String,
    modelValue: String, // Relating to v-model on parent component.
  }
};
</script>

<style scoped>
</style>
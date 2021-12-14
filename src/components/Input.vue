<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <input
      :id="id"
      class="form-control"
      :value="inputOne"
      @input="$emit('update:inputOne', $event.target.value)"
    />
    
    <span>{{ help }}</span>
  </div>
</template>

<script>
export default {
    // IMPORTANT: using this method, with "props : modelValue [and] emits: ["update:modelValue"] ", the vue devtools is now able to keep track of the v-model chnages!
  emits: ["update:inputOne"],
  props: {
    label: String,
    id: String,
    help: String,
    inputOne: String, // Relating to v-model on parent component.
  }
};
</script>

<style scoped>
</style>
<template>
  <button
    :disabled="disabled || apiProgress"
    class="btn btn-primary"
    @click.prevent="onClick"
  >
    <Spinner v-if="apiProgress" />
    <!-- The slot tag here will be filled with whatever this compnent contains between its 2 tags! The "Button" listed there is the fallback value if none is provided-->
    <slot>Button</slot>   
  </button>
</template>

<script>
import Spinner from "./Spinner";
export default {
  components: {
    Spinner,
  },
  props: {
    apiProgress: Boolean,
    disabled: Boolean,
    onClick: Function,
  },
};
</script>

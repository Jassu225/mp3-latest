<template>
  <i class="material-icons">
    <slot />
  </i>
</template>

<script>
export default {
  props: ["click"],
  mounted() {
    if (this.click) {
      this.$el.addEventListener("click", this.click);
    }
  },
};
</script>

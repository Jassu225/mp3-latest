<template>
    <i class="material-icons">
        <slot></slot>
    </i>
</template>

<script>
export default {
    props: ["click"],
    mounted: function() {
        if(this.click) {
            this.$el.addEventListener("click", this.click);
        }
    }
}
</script>

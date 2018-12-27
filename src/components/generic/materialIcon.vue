<template>
    <i class="material-icons" :title="title">
        <slot></slot>
    </i>
</template>

<script>
export default {
    props: ['title']
}
</script>

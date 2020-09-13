<template>
    <div
        :title="title"
        :class="{ active }"
        class="icon"
        v-html="svg"
    />
</template>

<script>
export default {
    props: {
        icon: {
            type: String,
            default: null,
        },
        title: {
            type: String,
            default: null,
        },
        active: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            svg: null,
        };
    },
    beforeMount() {
        this.svg = require(`../img/icons/${this.icon}.svg`).default;
    },
};
</script>

<style lang="scss">
.icon {
    display: inline-block;
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;

    svg {
        width: 100%;
        height: 100%;
    }
}
</style>

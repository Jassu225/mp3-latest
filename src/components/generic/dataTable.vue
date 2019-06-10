<template>
    <div class="fullWidth fullHeight gridWarpper directionCol">
        <slot name="header">
            <div class="flexContainer centerItemsVertically header">
                <div v-for="(header, index) in headers"
                    :key="index"
                    :style="{
                        flex: header.width ? 'unset': '1 1 auto',
                        flexBasis: header.width ? header.width : 'auto',
                        textAlign: header.align ? header.align : 'center'
                    }"
                >
                    {{ header.title }}
                </div>
            </div>
        </slot>
        <div class="overflow contentContainer">
            <slot v-for="(item, index) in items.slice(start, end)" name="content" :item="item" :index="index">
            </slot>
        </div>
        <div class="pagination flexContainer centerItemsVertically">
            <material-icon style="flexBasis: 4rem" class="cursorPointer" :click="goToNextPage">arrow_right</material-icon>
            <material-icon style="flexBasis: 4rem" class="cursorPointer" :click="goToPreviousPage">arrow_left</material-icon>
            <div>Showing {{ rowText }}s {{ start + 1 }} to {{ end }} of {{items.length}}</div>
        </div>
    </div>
</template>

<script>
import materialIcon from './materialIcon.vue';
export default {
    props: ["headers", "items", "rowsPerPageNumber", "rowText"],
    components: {
        materialIcon
    },
    data: function() {
        return {
            start: 0,
            currentPage: 1,
            maxPerPage: parseInt(this.rowsPerPageNumber) >= this.items.length ? this.items.length: parseInt(this.rowsPerPageNumber)
        };
    },
    methods: {
        goToNextPage: function() {
            if(this.end < this.items.length)
                this.start = this.end;
        },
        goToPreviousPage: function() {
            if(this.start > 0)
                this.start = this.start - parseInt(this.rowsPerPageNumber);
            console.log(this.start);
        }
    },
    computed: {
        end: {
            get: function() {
                return this.start + this.maxPerPage;
            },
            set: function(newValue, oldValue) {

            }
        }
    }
}
</script>

<style scoped>
.gridWarpper {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 3rem 1fr 3rem;
}

.pagination {
    flex-direction: row-reverse;
}
</style>

<template>
    <div>
        <i-container :config="pages" v-ref:ipage></i-container>
    </div>
</template>
<script>
    import layout from './layout'
    import index from './index'
    import attributeSection from './sections/attributeSection.vue'
    import containerLayout from './sections/containerLayout.vue'
    import contentComponent from './sections/contentComponent.vue'
    import designAreaSection from './sections/designAreaSection.vue'
    import layoutReviewSection from './sections/layoutReviewSection.vue'
    import topMenuSection from './sections/topMenuSection.vue'

    Vue.component('ivuAttributeSection', attributeSection)
    Vue.component('ivuDesignAreaSection', designAreaSection)
    Vue.component('ivuLayoutReviewSection', layoutReviewSection)
    Vue.component('ivuTopMenuSection', topMenuSection)

    export default {
       /* components: {
            attributeSection,
            containerLayout,
            contentComponent,
            designAreaSection,
            layoutReviewSection,
            topMenuSection
        },*/
        props: {layoutConfig: Object},

        data () {
            return {
                pages: this.$merge(layout, index(this))
            }
        },

        ready(){
            this.$getSection('designAreaSection').options.config = this.layoutConfig
        },

        computed: {
            ps(){
                return this.$store.state.index
            },
        },

        methods: {
            selectSection(col, rows, index1, cols, index2){
                this.$getInstance('attributeSection').options = col
                this.ps.selectedSection = {currentCol: col, rows: rows, rowIndex: index1, cols: cols, colIndex: index2}
            },

            test(){
                console.log(this.pages)
            }
        }
    }
</script>
<style>
    html, body, body > main {
        height: 100%;
    }

    body > main > div, body > main > div > div, body > main > div > div > div:first-child {
        height: 100%;
    }
</style>

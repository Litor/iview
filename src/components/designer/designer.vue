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

            this._setHeight100Per(this.$el)
        },

        methods: {
            _setHeight100Per(el){
                if(el != document.body){
                    this._setHeight100Per(el.parentNode)
                }
                el.style.height = '100%'
            },
            selectSection(col, rows, index1, cols, index2){
                this.$getInstance('attributeSection').options = col
            },

            test(){
                console.log(this.pages)
            }
        }
    }
</script>
<style>
    html, body {
        height: 100%;
    }
</style>

<template>
    <div :class="config.class" :style="config.style">
        <container-layout :layout="config.layout"></container-layout>
        <Modal
                :visible.sync="modal[item.name]"
                :title="item.title"
                @on-ok="item.ok"
                @on-cancel="item.cancel" v-for="item in config.modals">
            <component :is="item.component" :options="item.options" :events="item.events" class="{{item.name?('comp-name-'+item.name):''}}"></component>
        </Modal>
    </div>
</template>
<script>
    import Row from '../layout/row.vue'
    import iCol from '../layout/col.vue'
    import Modal from '../modal/modal.vue'
    import containerLayout from './containerLayout.vue'

    export default {
        props: {config: Object},
        components:{Row, iCol, Modal, containerLayout},

        data: function () {
            return {
                modal: {}
            }
        },

        methods: {
            __getComponent(comp, name){
                var res = null
                _.each(comp.$children, (item) => {
                    if (res) {
                        return false
                    }
                    if (_.includes(item.$el.classList, 'comp-name-' + name)) {
                        res = item
                    } else {
                        res = this.__getComponent(item, name)
                    }
                })
                return res
            },

            get(name){
                return this.__getComponent(this, name)
            }
        },

        created(){
            _.each(this.config.modals, (modal) => {
                this.$set('modal.' + modal.name, false)
            })
        }
    }
</script>

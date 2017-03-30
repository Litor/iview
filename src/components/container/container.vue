<template>
    <div>
        <div :class="config.class" :style="config.style" v-if="!config.designer">
            <container-layout :rows="config.rows" :mock="config.mock"></container-layout>
            <div v-for="item in config.modals">
                <Modal
                        :visible.sync="config.$modals[item.name]"
                        :title="item.options.$title"
                        :header="item.options.$header"
                        :footer="item.options.$footer"
                        :loading="item.options.$loading"
                        :closable="item.options.$closable"
                        :width="item.options.$width"
                        :ok-text="item.options.$okText"
                        :cancel-text="item.options.$cancelText"
                        :scrollable="item.options.$scrollable"
                        :class-name="item.options.$className"
                        :style="item.options.$style"
                        :mask-closable="item.options.$maskClosable === true"
                        @on-ok="__modalOk(item.events && item.events['$on-ok'], item.name)"
                        @on-cancel="__modalCancel(item.events && item.events['$on-cancel'], item.name)"
                        v-if="config.$modals[item.name]">
                    <component :is="item.component" :options="item.options" :events="item.events"
                               class="{{item.name?('comp-name-'+item.name):''}}" v-if="config.$modals[item.name]"></component>
                </Modal>
            </div>
        </div>
        <div v-if="config.designer">
            <designer :layout-config="config"></designer>
        </div>
    </div>
</template>
<script>
    import designer from '../designer/designer.vue'
    import Row from '../layout/row.vue'
    import iCol from '../layout/col.vue'
    import Modal from '../modal/modal.vue'
    import containerLayout from './containerLayout.vue'

    export default {
        props: {config: Object},
        $name:'$iContainer', // 用于页面中查找container组件
        components: {Row, iCol, Modal, containerLayout, designer},

        methods: {
            __modalOk(callback, modalName){
                if (callback) {
                    callback()
                } else {
                    this.config.$modals[modalName] = false
                }
            },

            __modalCancel(callback, modalName){
                if (callback) {
                    callback()
                } else {
                    this.config.$modals[modalName] = false
                }
            },
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
        }
    }
</script>

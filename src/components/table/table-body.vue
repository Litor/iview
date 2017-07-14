<template>
    <table cellspacing="0" cellpadding="0" border="0" :style="style">
        <colgroup>
            <col v-for="column in columns" :width="setCellWidth(column, $index, false)">
        </colgroup>
        <tbody :class="[prefixCls + '-tbody']">
        <tr
                v-for="(index, row) in data"
                :class="rowClasses(row._index)"
                @mouseenter.stop="handleMouseIn(row._index)"
                @mouseleave.stop="handleMouseOut(row._index)"
                @click="clickCurrentRow(row._index)"
                @dblclick.stop="dblclickCurrentRow(row._index)">
            <td v-for="column in columns" :class="alignCls(column, row)">
                <div :class="classes(column)">
                    <template v-if="renderType(column) === 'index'">{{index + 1}}</template>
                    <template v-if="renderType(column) === 'selection'">
                        <Checkbox :checked="objData[row._index] && objData[row._index]._isChecked" @on-change="toggleSelect(index)"
                                  :disabled="rowDisabled(row._index)"></Checkbox>
                    </template>
                    <template v-if="renderType(column) === 'singleSelection'">
                        <Radio :checked="objData[row._index] && objData[row._index]._isChecked" @click="singleSelect(row._index)"
                               :disabled="rowDisabled(row._index)"></Radio>
                    </template>
                    <template v-if="renderType(column) === 'normal' && column.showMore">
                        <span title="{{{ row[column.key] }}}">{{{ row[column.key] }}}</span>
                    </template>
                    <template v-if="renderType(column) === 'normal' && !column.showMore">
                       {{{ row[column.key] }}}
                    </template>
                    <template v-if="renderType(column) === 'render'">
                        {{{column.render(row, column, row._index)}}}
                    </template>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
</template>
<script>
    import Cell from './cell.vue';
    import Mixin from './mixin';

    export default {
        mixins: [Mixin],
        components: {Cell},
        props: {
            prefixCls: String,
            style: Object,
            columns: Array,
            data: Array,    // rebuildData
            objData: Object,
            columnsWidth: Object,
            fixed: {
                type: [Boolean, String],
                default: false
            }
        },

        ready(){
            this.$parent.content.$compile(this.$el);
        },

        watch: {
            columns: {
                handler: function () {
                    this.$parent.content.$compile(this.$el);
                },
                deep: true
            },
            data: {
                handler: function () {
                    this.$parent.content.$compile(this.$el);
                },
                deep: true
            }
        },

        methods: {
            rowClasses (_index) {
                return [
                    `${this.prefixCls}-row`,
                    this.rowClsName(_index),
                    {
                        [`${this.prefixCls}-row-highlight`]: this.objData[_index] && this.objData[_index]._isHighlight,
                        [`${this.prefixCls}-row-hover`]: this.objData[_index] && this.objData[_index]._isHover
                    }
                ];
            },
            rowChecked (_index) {
                return this.objData[_index] && this.objData[_index]._isChecked;
            },
            rowDisabled(_index){
                return this.objData[_index] && this.objData[_index]._isDisabled;
            },
            rowClsName (_index) {
                return this.$parent.rowClassName(this.objData[_index], _index);
            },
            handleMouseIn (_index) {
                this.$parent.handleMouseIn(_index);
            },
            handleMouseOut (_index) {
                this.$parent.handleMouseOut(_index);
            },
            clickCurrentRow (_index) {
                this.$parent.clickCurrentRow(_index);
            },
            dblclickCurrentRow (_index) {
                this.$parent.dblclickCurrentRow(_index);
            },

            // from cell.vue
            renderType(column){
                var renderType = ''
                if (column.type === 'index') {
                    renderType = 'index';
                } else if (column.type === 'selection') {
                    renderType = 'selection';
                } else if (column.render) {
                    renderType = 'render';
                } else if (column.type === 'singleSelection') {
                    renderType = 'singleSelection'
                } else {
                    renderType = 'normal';
                }

                return renderType
            },

            toggleSelect (index) {
                this.$parent.toggleSelect(index);
            },

            singleSelect(index){
                this.$parent.singleSelect(index);
            },

            classes (column) {
                return [
                    `${this.prefixCls}-cell`,
                    {
                        [`${this.prefixCls}-hidden`]: !this.fixed && column.fixed && (column.fixed === 'left' || column.fixed === 'right'),
                        [`${this.prefixCls}-cell-ellipsis`]: column.ellipsis || false
                    }
                ];
            }
        }
    };
</script>

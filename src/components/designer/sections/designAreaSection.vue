<template>
    <div>
        <container-layout :rows="options.config.rows" :mock="options.config.mock" @on-select="select"
                          :selected-section.sync="options.selectedSection"></container-layout>
    </div>
</template>
<script>
    import containerLayout from './containerLayout.vue'
    export default {
        components:{containerLayout},
        props: {
            options: {
                type: Object, default: () => {
                }
            },
            events: {
                type: Object, default: () => {
                }
            },
            mock: Boolean
        },

        created(){
            if (this.mock && this.$options.mock) {
                if (this.$options.mock.options) {
                    this.options = this.$options.mock.options
                }

                if (this.$options.mock.events) {
                    this.events = this.$options.mock.events
                }
            }
            var events = _.keys(this.events)

            events.forEach((event) => {
                this.$on(event, this.events[event])
            })
        },

        mock: mockData(),

        data: function () {
            return {
                selectedSection: {}
            }
        },

        methods: {
            select(col, rows, index1, cols, index2){
                this.$emit('on-select', col, rows, index1, cols, index2)
            },

            createRow(arrow){
                var selectedSection = this.options.selectedSection

                if (selectedSection.rowIndex == undefined) {
                    this.$Message.info('请选择操作区域！');
                    return
                }

                var rowIndex = selectedSection.rowIndex
                var length = selectedSection.rows.length

                if (arrow == 'up') {
                    for (var i = length - 1; i >= rowIndex; i--) {
                        selectedSection.rows.$set(i + 1, selectedSection.rows[i])
                    }
                    selectedSection.rows.$set(rowIndex, {
                            cols: [{
                                name: '',
                                component: '',
                                style: {},
                                span: 24
                            }]
                        }
                    )
                }

                if (arrow == 'down') {
                    for (var i = length - 1; i > rowIndex; i--) {
                        selectedSection.rows.$set(i + 1, selectedSection.rows[i])
                    }
                    selectedSection.rows.$set(rowIndex + 1, {
                            cols: [{
                                name: '',
                                component: '',
                                style: {},
                                span: 24
                            }]
                        }
                    )
                }
            },

            moveRow(arrow){
                var selectedSection = this.options.selectedSection

                if (selectedSection.rowIndex == undefined) {
                    this.$Message.info('请选择操作区域！');
                    return
                }

                var rows = selectedSection.rows
                var rowIndex = selectedSection.rowIndex

                if (arrow == 'up') {
                    if (rowIndex == 0) {
                        return
                    }
                    var temp = rows[rowIndex]

                    rows.$set(rowIndex, rows[rowIndex - 1])
                    rows.$set(rowIndex - 1, temp)

                    this.options.selectedSection.rowIndex = rowIndex - 1
                }

                if (arrow == 'down') {
                    if (rowIndex == rows.length - 1) {
                        return
                    }
                    var temp = rows[rowIndex]

                    rows.$set(rowIndex, rows[rowIndex + 1])
                    rows.$set(rowIndex + 1, temp)
                    this.options.selectedSection.rowIndex = rowIndex + 1
                }
            },

            delCol(){
                var selectedSection = this.options.selectedSection

                if (selectedSection.rowIndex == undefined) {
                    this.$Message.info('请选择操作区域！');
                    return
                }

                var cols = selectedSection.cols
                var colIndex = selectedSection.colIndex
                cols = cols.splice(colIndex, 1)
            },

            createCol(arrow){
                var selectedSection = this.options.selectedSection

                if (selectedSection.rowIndex == undefined) {
                    this.$Message.info('请选择操作区域！');
                    return
                }

                var length = selectedSection.cols.length
                var colIndex = selectedSection.colIndex

                if (arrow == 'left') {
                    for (var i = length - 1; i >= colIndex; i--) {
                        selectedSection.cols.$set(i + 1, selectedSection.cols[i])
                    }
                    selectedSection.cols.$set(colIndex, {
                            name: '',
                            component: '',
                            style: {},
                            span: 24
                        }
                    )
                }

                if (arrow == 'right') {
                    for (var i = length - 1; i > colIndex; i--) {
                        selectedSection.cols.$set(i + 1, selectedSection.cols[i])
                    }
                    selectedSection.cols.$set(colIndex + 1, {
                            name: '',
                            component: '',
                            style: {},
                            span: 24
                        }
                    )
                }
            },

            moveCol(arrow){
                var selectedSection = this.options.selectedSection

                if (selectedSection.rowIndex == undefined) {
                    this.$Message.info('请选择操作区域！');
                    return
                }

                var cols = selectedSection.cols
                var colIndex = selectedSection.colIndex

                if (arrow == 'left') {
                    if (colIndex == 0) {
                        return
                    }
                    var temp = cols[colIndex]

                    cols.$set(colIndex, cols[colIndex - 1])
                    cols.$set(colIndex - 1, temp)

                    this.options.selectedSection.colIndex = colIndex - 1
                }

                if (arrow == 'right') {
                    if (colIndex == cols.length - 1) {
                        return
                    }
                    var temp = cols[colIndex]

                    cols.$set(colIndex, cols[colIndex + 1])
                    cols.$set(colIndex + 1, temp)
                    this.options.selectedSection.colIndex = colIndex + 1
                }
            },

            clearSelected(){
                this.options.selectedSection = {}
            }
        }
    }

    function mockData() {
        return {
            options: {
                config: [
                    {
                        style: {'margin': '8px 0 16px', 'font-size': '14px', 'font-weight': 700},
                        cols: [{content: '录取前汇总成绩计算', style: {'margin-top': '8px'}}]
                    },
                    {
                        cols: [{
                            name: 'alertSection',
                            style: {'margin-bottom': '16px'},
                            hidden: false,
                            content: '<Alert type="warning" type="warning" show-icon>当前批次为未开放状态，无法进行公式配置和成绩计算。</Alert>'
                        }]
                    },
                    {
                        style: {'margin-bottom': '16px'},
                        cols: [{
                            name: 'topTipSection',
                            component: 'topTipSection'
                        }]
                    },
                    {
                        style: {'margin': '16px 0', 'font-size': '12px', 'font-weight': 700},
                        cols: [{content: '普通类型考生分科类汇总成绩计算公式配置', component: '', style: {}}]
                    },
                    {
                        cols: [{
                            name: 'formulaTableSection1',
                            component: 'formulaTableSection',
                            style: {}
                        }]
                    },
                    {
                        style: {'margin': '16px 0', 'font-size': '12px', 'font-weight': 700},
                        cols: [{content: '特殊类型考生分类型汇总成绩计算公式配置', component: '', style: {}}]
                    },
                    {
                        cols: [{
                            name: 'formulaTableSection2',
                            component: 'formulaTableSection',
                            style: {}
                        }]
                    }
                ]
            }
        }
    }
</script>

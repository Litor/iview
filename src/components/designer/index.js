import utils from '../utils/utils'

export default  function (vm) {
    var options = {
        layoutReviewSection: {
            $title: '查看布局文件',
            layoutSource: ''
        },
        attributeSection: {
            currentCol: {},
            expanded: false,
            componentList:[]
        },
        designAreaSection: {
            selectedSection: {},
            config: []
        }
    }

    var events = {
        designAreaSection: {
            'on-select': function () {
                vm.$getSection('attributeSection').options.currentCol = vm.$getSection('designAreaSection').options.selectedSection.currentCol
            }
        },

        attributeSection: {
            'on-expand': function () {
                var expanded = vm.$getSection('attributeSection').options.expanded
                if (expanded) {
                    vm.$getSection('attributeSection').span = 5
                    vm.$getSection('designAreaSection').span = 19
                    vm.$getSection('attributeSection').options.expanded = false
                } else {
                    vm.$getSection('attributeSection').span = 12
                    vm.$getSection('designAreaSection').span = 12
                    vm.$getSection('attributeSection').options.expanded = true
                }
            },
            'on-create':function () {
                var path = vm.$parent.$parent.$options._ubase_component_app_path
                fetch('http://localhost:34398/getComponentList', {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({path: path})
                }).then(function(response) {
                    return response.json()
                }).then(function (res) {
                    vm.$getSection('attributeSection').options.componentList = res;
                })
            }
        },

        topMenuSection: {
            'on-create-row': function (arrow) {
                vm.$getInstance('designAreaSection').createRow(arrow)
            },

            'on-del-col': function () {
                vm.$getInstance('designAreaSection').delCol()
            },

            'on-move-row': function (arrow) {
                vm.$getInstance('designAreaSection').moveRow(arrow)
            },

            'on-clear-selected': function () {
                vm.$getInstance('designAreaSection').clearSelected()
                vm.$getSection('attributeSection').options.currentCol = {}
            },

            'on-create-col': function (arrow) {
                vm.$getInstance('designAreaSection').createCol(arrow)
            },

            'on-move-col': function (arrow) {
                vm.$getInstance('designAreaSection').moveCol(arrow)
            },

            'on-export': function () {
                vm.$getSection('layoutReviewSection').options.layoutSource = JSON.stringify(vm.$getSection('designAreaSection').options.config, null, 2).replace(/\n/g, '<br/>').replace(/\ /g, '&nbsp;')
                vm.$getModals().layoutReviewSection = true
            },

            'on-save': function () {
                var path = vm.$parent.$parent.$options._ubase_component_path
                var config = _.cloneDeep(vm.$getSection('designAreaSection').options.config)

                utils.removeOptionsAndEvents(config)

                fetch('http://localhost:34398/saveConfig', {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({path: path, config: config})
                })
            }
        }
    }

    return {options, events}
}

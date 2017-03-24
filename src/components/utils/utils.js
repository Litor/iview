import {deepCopy} from '../../utils/assist'
function __getComponent(comp, name) {
    var res = null
    _.each(comp.$children, (item) => {
        if (res) {
            return false
        }
        if (_.includes(item.$el.classList, 'comp-name-' + name)) {
            res = item
        } else {
            res = __getComponent(item, name)
        }
    })
    return res
}

function getInstance(name) {
    return __getComponent(this, name)
}

function merge(layout, config) {
    layout = deepCopy(layout)
    if(layout.rows){
        __mergeRows(layout.rows, config.options, config.events)
    }

    if (layout.modals) {
        __mergeModals(layout.modals, config.options, config.events)
    }

    return layout
}

function __mergeModals(modals, options, events) {
    modals.forEach(function (modal) {
        if (modal.name && options[modal.name]) {
            modal.options = options[modal.name]
        } else {
            modal.options = {}
        }

        if (modal.name && events[modal.name]) {
            modal.events = events[modal.name]
        } else {
            modal.events = {}
        }
    })
}
function __mergeRows(row, options, events) {
    row.forEach(function (row) {
        row.cols.forEach(function (col) {
            if (col.rows) {
                __mergeRows(col.rows, options, events)
            }

            if (col.name && options[col.name]) {
                col.options = options[col.name]
            } else {
                col.options = {}
            }

            if (col.name && events[col.name]) {
                col.events = events[col.name]
            } else {
                col.events = {}
            }
        })
    })
}

function getModals() {
    return __findContainer(this).modal
}

function getSection(name) {
    var container = __findContainer(this)
    var config = container.config
    var res = __getRowsSection(config.rows, name)

    if (!res) {
        config.modals.forEach(function (modal) {
            if (modal.name == name) {
                res = modal
            }
        })
    }

    return res
}

function __findContainer(comp) {
    var res = null
    var children = comp.$children

    if(children){
        children.forEach(function (child) {
            if(res){
                return
            }
            if(child.$options && child.$options.$name == '$iContainer'){
                res = child
            }else{
                res = __findContainer(child)
            }
        })
    }

    return res
}


function __getRowsSection(rows, name) {
    var res = null

    rows.forEach(function (row) {
        if (res || !row.cols) {
            return
        }

        row.cols.forEach(function (col) {
            if (col.name == name) {
                res = col
            }

            if (col.rows) {
                res = __getRowsSection(col.rows, name)
            }
        })
    })

    return res
}

function removeOptionsAndEvents(config) {
    __removeRowsOptionsAndEvents(config.rows)
    __removeModalsOptionsAndEvents(config.modals)
}

function __removeRowsOptionsAndEvents(rows) {
    rows.forEach(function (row) {
        row.cols.forEach(function (col) {
            if(col.options){
                delete col.options
            }
            if(col.events){
                delete col.events
            }

            if (col.rows) {
                res = __removeRowsOptionsAndEvents(col.rows)
            }
        })
    })
}

function __removeModalsOptionsAndEvents(modals) {
    modals.forEach(function (modal) {
        if(modal.options){
            delete modal.options
        }
        if(modal.events){
            delete modal.events
        }
    })
}


export default {getInstance, merge, getModals, getSection, removeOptionsAndEvents}
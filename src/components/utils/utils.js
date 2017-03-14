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

function get(name) {
    return __getComponent(this, name)
}

function merge(layout, config) {
    __mergeRows(layout.rows, config.options, config.events)
    __mergeModals(layout.modals, config.options, config.events)

    return layout
}

function __mergeModals(modals, options, events) {
    modals.forEach(function (modal) {
        if (modal.name && options[modal.name]) {
            modal.options = options[modal.name]
        }else{
            modal.options = {}
        }

        if (modal.name && events[modal.name]) {
            modal.events = events[modal.name]
        }else{
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
            }else{
                col.options = {}
            }

            if (col.name && events[col.name]) {
                col.events = events[col.name]
            }else{
                col.events = {}
            }
        })
    })
}

function getModals() {
 return this.$children[0].modal
}


export default {get, merge, getModals}
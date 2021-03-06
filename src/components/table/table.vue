<template>
    <div :class="wrapClasses" :style="styles">
        <div :class="classes">
            <div :class="[prefixCls + '-title']" v-if="showSlotHeader" v-el:title><slot name="header"></slot></div>
            <div :class="[prefixCls + '-header']" v-if="showHeader" v-el:header @mousewheel="handleMouseWheel">
                <table-head
                    :prefix-cls="prefixCls"
                    :style="tableStyle"
                    :columns="centerColumns"
                    :obj-data="objData"
                    :columns-width="columnsWidth"
                    :data="rebuildData"
                    :header-height="headerHeight"></table-head>
            </div>
            <div :class="[prefixCls + '-body']" :style="bodyStyle" v-el:body @scroll="handleBodyScroll"
                v-show="!((!!noDataText && (!data || data.length === 0)) || (!!noFilteredDataText && (!rebuildData || rebuildData.length === 0)))">
                <table-body
                    v-ref:tbody
                    :prefix-cls="prefixCls"
                    :style="tableStyle"
                    :columns="centerColumns"
                    :data="rebuildData"
                    :columns-width="columnsWidth"
                    :obj-data="objData"></table-body>
            </div>
            <div
                :class="[prefixCls + '-tip']"
                v-else>
                <table cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                        <tr>
                            <td :style="{ 'height': bodyStyle.height }">
                              {{{!data || data.length === 0 ? noDataText : noFilteredDataText}}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div :class="[prefixCls + '-fixed']" :style="fixedTableStyle" v-if="isLeftFixed">
                <div :class="[prefixCls + '-fixed-header']" v-if="showHeader">
                    <table-head
                        fixed="left"
                        :prefix-cls="prefixCls"
                        :style="fixedTableStyle"
                        :columns="leftFixedColumns"
                        :obj-data="objData"
                        :columns-width.sync="columnsWidth"
                        :data="rebuildData"
                        :header-height="headerHeight"></table-head>
                </div>
                <div :class="[prefixCls + '-fixed-body']" :style="fixedBodyStyle" v-el:fixed-body>
                    <table-body
                        fixed="left"
                        :prefix-cls="prefixCls"
                        :style="fixedTableStyle"
                        :columns="leftFixedColumns"
                        :data="rebuildData"
                        :columns-width="columnsWidth"
                        :obj-data="objData"></table-body>
                </div>
            </div>
            <div :class="[prefixCls + '-fixed-right']" :style="fixedRightTableStyle" v-if="isRightFixed">
                <div :class="[prefixCls + '-fixed-header']" v-if="showHeader">
                    <table-head
                        fixed="right"
                        :prefix-cls="prefixCls"
                        :style="fixedRightTableStyle"
                        :columns="rightFixedColumns"
                        :obj-data="objData"
                        :columns-width.sync="columnsWidth"
                        :data="rebuildData"
                        :header-height="headerHeight"></table-head>
                </div>
                <div :class="[prefixCls + '-fixed-body']" :style="fixedBodyStyle" v-el:fixed-right-body>
                    <table-body
                        fixed="right"
                        :prefix-cls="prefixCls"
                        :style="fixedRightTableStyle"
                        :columns="rightFixedColumns"
                        :data="rebuildData"
                        :columns-width="columnsWidth"
                        :obj-data="objData"></table-body>
                </div>
            </div>
            <div :class="[prefixCls + '-footer']" v-if="showSlotFooter" v-el:footer><slot name="footer"></slot></div>
        </div>
    </div>
</template>
<script>
    import tableHead from './table-head.vue';
    import tableBody from './table-body.vue';
    import { oneOf, getStyle, deepCopy, getScrollBarSize } from '../../utils/assist';
    import { t } from '../../locale';
    import Csv from '../../utils/csv';
    import ExportCsv from './export-csv';
    const prefixCls = 'ivu-table';

    export default {
        components: { tableHead, tableBody },
        props: {
            data: {
                type: Array,
                default () {
                    return [];
                }
            },
            columns: {
                type: Array,
                default () {
                    return [];
                }
            },
            size: {
                validator (value) {
                    return oneOf(value, ['small', 'large', 'default']);
                }
            },
            width: {
                type: [Number, String]
            },
            height: {
                type: [Number, String]
            },
            headerHeight:{
                type: [Number, String]
            },
            stripe: {
                type: Boolean,
                default: false
            },
            border: {
                type: Boolean,
                default: false
            },
            showHeader: {
                type: Boolean,
                default: true
            },
            highlightRow: {
                type: Boolean,
                default: false
            },
            rowClassName: {
                type: Function,
                default () {
                    return '';
                }
            },
            content: {
                type: Object
            },
            noDataText: {
                type: String,
                default () {
                    return t('i.table.noDataText');
                }
            },
            noFilteredDataText: {
                type: String,
                default () {
                    return t('i.table.noFilteredDataText');
                }
            }
        },
        data () {
            return {
                ready: false,
                tableWidth: 0,
                columnsWidth: {},
                prefixCls: prefixCls,
                compiledUids: [],
                objData: this.makeObjData(),     // checkbox or highlight-row
                rebuildData: [],    // for sort or filter
                cloneColumns: [],
                showSlotHeader: true,
                showSlotFooter: true,
                bodyHeight: 0,
                bodyRealHeight: 0,
                paddingLeft:0,
                paddingRight:0,
                centerColumns:[],
                leftFixedColumns:[],
                rightFixedColumns :[],
                isLeftFixed:false,
                isRightFixed :false,
                scrollBarWidth: getScrollBarSize()
            };
        },
        computed: {
            wrapClasses () {
                return [
                    `${prefixCls}-wrapper`,
                    {
                        [`${prefixCls}-hide`]: !this.ready,
                        [`${prefixCls}-with-header`]: this.showSlotHeader,
                        [`${prefixCls}-with-footer`]: this.showSlotFooter
                    }
                ];
            },
            classes () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-${this.size}`]: !!this.size,
                        [`${prefixCls}-border`]: this.border,
                        [`${prefixCls}-stripe`]: this.stripe,
                        [`${prefixCls}-with-fixed-top`]: !!this.height
                    }
                ];
            },
            styles () {
                let style = {};
                if (this.height) {
                    const height = (this.isLeftFixed || this.isRightFixed) ? parseInt(this.height) + this.scrollBarWidth : parseInt(this.height);
                    style.height = `${height}px`;
                }
                if (this.width) style.width = `${this.width}px`;
                return style;
            },
            tableStyle () {
                let style = {};
                if (this.tableWidth !== 0) {
                    let width = '';
                    if (this.bodyHeight === 0) {
                        width = this.tableWidth;
                    } else {
                        if (this.bodyHeight > this.bodyRealHeight) {
                            width = this.tableWidth;
                        } else {
                            width = this.tableWidth - this.scrollBarWidth;
                        }
                    }
//                    const width = this.bodyHeight === 0 ? this.tableWidth : this.tableWidth - this.scrollBarWidth;
                    style.width = `${width}px`;
                }
                style.paddingLeft = this.paddingLeft+'px'
                style.paddingRight = this.paddingRight+'px'

                return style;
            },
            fixedTableStyle () {
                let style = {};
                let width = 0;
                this.leftFixedColumns.forEach((col) => {
                    if (col.fixed && col.fixed === 'left') width += col._width;
                });
                style.width = `${width}px`;
                return style;
            },
            fixedRightTableStyle () {
                let style = {};
                let width = 0;
                this.rightFixedColumns.forEach((col) => {
                    if (col.fixed && col.fixed === 'right') width += col._width;
                });
                width += this.scrollBarWidth;
                style.width = `${width}px`;
                return style;
            },
            bodyStyle () {
                let style = {};
                if (this.bodyHeight !== 0) {
                    // add a height to resolve scroll bug when browser has a scrollBar in fixed type and height prop
                    const height = (this.isLeftFixed || this.isRightFixed) ? this.bodyHeight + this.scrollBarWidth : this.bodyHeight;
                    style.height = `${height}px`;
                }
                return style;
            },
            fixedBodyStyle () {
                let style = {};
                if (this.bodyHeight !== 0) {
                    let height = this.bodyHeight + this.scrollBarWidth - 1;

                    if (this.width && this.width < this.tableWidth){
                        height = this.bodyHeight;
                    }
//                    style.height = this.scrollBarWidth > 0 ? `${this.bodyHeight}px` : `${this.bodyHeight - 1}px`;
                    style.height = this.scrollBarWidth > 0 ? `${height}px` : `${height - 1}px`;
                }
                return style;
            },
            /*leftFixedColumns () {
                let left = [];
                let other = [];
                let paddingLeft = 0
                this.cloneColumns.forEach((col) => {
                    if (col.fixed && col.fixed === 'left') {
                        left.push(col);
                        paddingLeft += col.width
                    } else {
                        other.push(col);
                    }
                });

                console.log(paddingLeft)

                this.paddingLeft = paddingLeft

                return left //.concat(other);
            },
            centerColumns () {
                let center = [];
                this.cloneColumns.forEach((col) => {
                    if (!col.fixed) {
                        center.push(col);
                    }
                });
                return center
            },
            rightFixedColumns () {
                let right = [];
                let other = [];
                let paddingRight = 0;

                this.cloneColumns.forEach((col) => {
                    if (col.fixed && col.fixed === 'right') {
                        paddingRight += col.width
                        right.push(col);
                    } else {
                        other.push(col);
                    }
                });

                this.paddingRight = paddingRight

                return right //.concat(other);
            },
            isLeftFixed () {
                return this.columns.some(col => col.fixed && col.fixed === 'left');
            },
            isRightFixed () {
                return this.columns.some(col => col.fixed && col.fixed === 'right');
            }*/
        },
        methods: {
            resetPrivateVariables(){
                let left = []
                let right = []
                let center = []
                let paddingRight = 0
                let paddingLeft = 0
                let isLeftFixed = false
                let isRightFixed = false

                this.cloneColumns.forEach((col) => {
                    if (col.fixed === 'left') {
                        left.push(col);
                        isLeftFixed = true
                        paddingLeft += col.width
                    } else if(col.fixed === 'right'){
                        right.push(col);
                        isRightFixed = true
                        paddingRight += col.width
                    }else{
                        center.push(col)
                    }
                });

                this.centerColumns = center
                this.leftFixedColumns = left
                this.rightFixedColumns = right
                this.paddingRight = paddingRight
                this.paddingLeft = paddingLeft
                this.isLeftFixed = isLeftFixed
                this.isRightFixed = isRightFixed

            },
            rowClsName (index) {
                return this.rowClassName(this.data[index], index);
            },
            handleResize () {
                this.$nextTick(() => {
                    const allWidth = !this.columns.some(cell => !cell.width);    // each column set a width
                    if (allWidth && this.columns.length > 0) {
                        this.tableWidth = this.columns.map(cell => cell.width).reduce((a, b) => a + b);
                    } else {
                        this.tableWidth = parseInt(getStyle(this.$el, 'width')) - 1;
                    }
                    this.columnsWidth = {};
                    this.$nextTick(() => {
                        let columnsWidth = {};
                        let autoWidthIndex = -1;
                        if (allWidth) autoWidthIndex = this.cloneColumns.findIndex(cell => !cell.width);//todo 这行可能有问题

                        if (this.data.length) {
                            const $td = this.$refs.tbody.$el.querySelectorAll('tbody tr')[0].querySelectorAll('td');
                            for (let i = 0; i < $td.length; i++) {    // can not use forEach in Firefox
                                const column = this.cloneColumns[i];

                                let width = parseInt(getStyle($td[i], 'width'));
                                if (i === autoWidthIndex) {
                                    width = parseInt(getStyle($td[i], 'width')) - 1;
                                }
                                if (column.width) width = column.width;

                                this.cloneColumns[i]._width = width;

                                columnsWidth[column._index] = {
                                    width: width
                                };
                            }
                            this.columnsWidth = columnsWidth;
                        }
                    });
                    // get table real height,for fixed when set height prop,but height < table's height,show scrollBarWidth
                    this.bodyRealHeight = parseInt(getStyle(this.$refs.tbody.$el, 'height'));
                });
            },
            handleMouseIn (_index) {
                if (this.objData[_index]._isHover) return;
                this.objData[_index]._isHover = true;
            },
            handleMouseOut (_index) {
                this.objData[_index]._isHover = false;
            },
            highlightCurrentRow (_index) {
                if (!this.highlightRow || this.objData[_index]._isHighlight) return;

                let oldIndex = -1;
                for (let i in this.objData) {
                    if (this.objData[i]._isHighlight) {
                        oldIndex = parseInt(i);
                        this.objData[i]._isHighlight = false;
                    }
                }
                this.objData[_index]._isHighlight = true;
                const oldData = oldIndex < 0 ? null : JSON.parse(JSON.stringify(this.data[oldIndex]));
                this.$emit('on-current-change', JSON.parse(JSON.stringify(this.data[_index])), oldData);
            },
            clickCurrentRow (_index) {
                this.highlightCurrentRow (_index);
                this.$emit('on-row-click', JSON.parse(JSON.stringify(this.data[_index])));
            },
            dblclickCurrentRow (_index) {
                this.highlightCurrentRow (_index);
                this.$emit('on-row-dblclick', JSON.parse(JSON.stringify(this.data[_index])));
            },
            getSelection () {
                let selectionIndexes = [];
                for (let i in this.objData) {
                    if (this.objData[i]._isChecked) selectionIndexes.push(parseInt(i));
                }
                return JSON.parse(JSON.stringify(this.data.filter((data, index) => selectionIndexes.indexOf(index) > -1)));
            },
            toggleSelect (_index) {
                let data = {};

                for (let i in this.objData) {
                    if (parseInt(i) === _index) {
                        data = this.objData[i];
                    }
                }
                const status = !data._isChecked;

                this.objData[_index]._isChecked = status;

                const selection = this.getSelection();
                if (status) {
                    this.$emit('on-select', selection, JSON.parse(JSON.stringify(this.data[_index])));
                }
                this.$emit('on-selection-change', selection);
            },

            singleSelect(_index){
                if(this.objData[_index]._isDisabled){
                    return
                }

                for (let i in this.objData) {
                    if (parseInt(i) === _index) {
                        this.objData[i]._isChecked = true
                    }else{
                        this.objData[i]._isChecked = false
                    }
                }
                this.$emit('on-select', JSON.parse(JSON.stringify(this.data[_index])));
            },
            selectAll (status) {
                // this.rebuildData.forEach((data) => {
                //     if(this.objData[data._index]._isDisabled){
                //         this.objData[data._index]._isChecked = false;
                //     }else{
                //         this.objData[data._index]._isChecked = status;
                //     }

                // });
                for(const data of this.rebuildData){
                    if(this.objData[data._index]._isDisabled){
                        continue;
                    }else{
                        this.objData[data._index]._isChecked = status;
                    }
                }
                const selection = this.getSelection();
                if (status) {
                    this.$emit('on-select-all', selection);
                }
                this.$emit('on-selection-change', selection);
            },
            fixedHeader () {
                if (this.height) {
                    this.$nextTick(() => {
                        const titleHeight = parseInt(getStyle(this.$els.title, 'height')) || 0;
                        const headerHeight = parseInt(getStyle(this.$els.header, 'height')) || 0;
                        const footerHeight = parseInt(getStyle(this.$els.footer, 'height')) || 0;
                        this.bodyHeight = this.height - titleHeight - headerHeight - footerHeight;
                    });
                } else {
                    this.bodyHeight = 0;
                }
            },
            hideColumnFilter () {
                this.cloneColumns.forEach((col) => col._filterVisible = false);
            },
            handleBodyScroll (event) {
                if (this.showHeader) this.$els.header.scrollLeft = event.target.scrollLeft;
                if (this.isLeftFixed) this.$els.fixedBody.scrollTop = event.target.scrollTop;
                if (this.isRightFixed) this.$els.fixedRightBody.scrollTop = event.target.scrollTop;
                this.hideColumnFilter();
            },
            handleMouseWheel (event) {
                const deltaX = event.deltaX;
                const $body = this.$els.body;

                if (deltaX > 0) {
                    $body.scrollLeft = $body.scrollLeft + 10;
                } else {
                    $body.scrollLeft = $body.scrollLeft - 10;
                }
            },
            sortData (data, type, index) {
                const key = this.cloneColumns[index].key;
                data.sort((a, b) => {
                    if (this.cloneColumns[index].sortMethod) {
                        return this.cloneColumns[index].sortMethod(a[key], b[key], type);
                    } else {
                        if (type === 'asc') {
                            return a[key] > b[key] ? 1 : -1;
                        } else if (type === 'desc') {
                            return a[key] < b[key] ? 1 : -1;
                        }
                    }
                });
                return data;
            },
            handleSort (index, type) {
                this.cloneColumns.forEach((col) => col._sortType = 'normal');

                const key = this.cloneColumns[index].key;
                if (this.cloneColumns[index].sortable !== 'custom') {    // custom is for remote sort
                    if (type === 'normal') {
                        this.rebuildData = this.makeDataWithFilter();
                    } else {
                        this.rebuildData = this.sortData(this.rebuildData, type, index);
                    }
                }
                this.cloneColumns[index]._sortType = type;

                this.$emit('on-sort-change', {
                    column: JSON.parse(JSON.stringify(this.columns[this.cloneColumns[index]._index])),
                    key: key,
                    order: type
                });
            },
            handleFilterHide (index) {    // clear checked that not filter now
                if (!this.cloneColumns[index]._isFiltered) this.cloneColumns[index]._filterChecked = [];
            },
            filterData (data, column) {
                return data.filter((row) => {
                    let status = !column._filterChecked.length;
                    for (let i = 0; i < column._filterChecked.length; i++) {
                        status = column.filterMethod(column._filterChecked[i], row);
                        if (status) break;
                    }
                    return status;
                });
            },
            filterOtherData (data, index) {
                this.cloneColumns.forEach((col, colIndex) => {
                    if (colIndex !== index) {
                        data = this.filterData(data, col);
                    }
                });
                return data;
            },
            handleFilter (index) {
                const column = this.cloneColumns[index];
                let filterData = this.makeDataWithSort();

                // filter others first, after filter this column
                filterData = this.filterOtherData(filterData, index);
                this.rebuildData = this.filterData(filterData, column);

                this.cloneColumns[index]._isFiltered = true;
                this.cloneColumns[index]._filterVisible = false;
            },
            handleFilterSelect (index, value) {
                this.cloneColumns[index]._filterChecked = [value];
                this.handleFilter(index);
            },
            handleFilterReset (index) {
                this.cloneColumns[index]._isFiltered = false;
                this.cloneColumns[index]._filterVisible = false;
                this.cloneColumns[index]._filterChecked = [];

                let filterData = this.makeDataWithSort();
                filterData = this.filterOtherData(filterData, index);
                this.rebuildData = filterData;
            },
            makeData () {
                let data = deepCopy(this.data);
                data.forEach((row, index) => row._index = index);
                return data;
            },
            makeDataWithSort () {
                let data = this.makeData();
                let sortType = 'normal';
                let sortIndex = -1;
                let isCustom = false;

                for (let i = 0; i < this.cloneColumns.length; i++) {
                    if (this.cloneColumns[i]._sortType !== 'normal') {
                        sortType = this.cloneColumns[i]._sortType;
                        sortIndex = i;
                        isCustom = this.cloneColumns[i].sortable === 'custom';
                        break;
                    }
                }
                if (sortType !== 'normal' && !isCustom) data =  this.sortData(data, sortType, sortIndex);
                return data;
            },
            makeDataWithFilter () {
                let data = this.makeData();
                this.cloneColumns.forEach(col => data = this.filterData(data, col));
                return data;
            },
            makeDataWithSortAndFilter () {
                let data = this.makeDataWithSort();
                this.cloneColumns.forEach(col => data = this.filterData(data, col));
                return data;
            },
            makeObjData () {
                let data = {};
                this.data.forEach((row, index) => {
                    const newRow = deepCopy(row);// todo 直接替换
                    newRow._isHover = false;
                    if(newRow._disabled){
                        newRow._isDisabled = newRow._disabled;
                    }else{
                        newRow._isDisabled = false;
                    }
                    if (newRow._checked) {
                        newRow._isChecked = newRow._checked;
                    } else {
                        newRow._isChecked = false;
                    }
                    if (newRow._highlight) {
                        newRow._isHighlight = newRow._highlight;
                    } else {
                        newRow._isHighlight = false;
                    }
                    data[index] = newRow;
                });
                return data;
            },
            makeColumns () {
                let columns = deepCopy(this.columns);
                let left = [];
                let right = [];
                let center = [];

                columns.forEach((column, index) => {
                    column._index = index;
                    column._width = column.width ? column.width : '';    // update in handleResize()
                    column._sortType = 'normal';
                    column._filterVisible = false;
                    column._isFiltered = false;
                    column._filterChecked = [];

                    if ('filterMultiple' in column) {
                        column._filterMultiple = column.filterMultiple;
                    } else {
                        column._filterMultiple = true;
                    }
                    if ('filteredValue' in column) {
                        column._filterChecked = column.filteredValue;
                        column._isFiltered = true;
                    }

                    if (column.fixed && column.fixed === 'left') {
                        left.push(column);
                    } else if (column.fixed && column.fixed === 'right') {
                        right.push(column);
                    } else {
                        center.push(column);
                    }
                });
                return left.concat(center).concat(right);
            },
            exportCsv (params) {
                if (params.filename) {
                    if (params.filename.indexOf('.csv') === -1) {
                        params.filename += '.csv';
                    }
                } else {
                    params.filename = 'table.csv';
                }

                let columns = [];
                let datas = [];
                if (params.columns && params.data) {
                    columns = params.columns;
                    datas = params.data;
                } else {
                    columns = this.columns;
                    if (!('original' in params)) params.original = true;
                    datas = params.original ? this.data : this.rebuildData;
                }

                let noHeader = false;
                if ('noHeader' in params) noHeader = params.noHeader;

                const data = Csv(columns, datas, ',', noHeader);
                ExportCsv.download(params.filename, data);
            }
        },
        compiled () {
            if (!this.content) this.content = this.$parent;
            this.showSlotHeader = this.$els.title.innerHTML.replace(/\n/g, '').replace(/<!--[\w\W\r\n]*?-->/gmi, '') !== '';
            this.showSlotFooter = this.$els.footer.innerHTML.replace(/\n/g, '').replace(/<!--[\w\W\r\n]*?-->/gmi, '') !== '';
            this.rebuildData = this.makeDataWithSortAndFilter();
        },
        ready () {
            this.handleResize();
            this.fixedHeader();
            this.$nextTick(() => this.ready = true);
            window.addEventListener('resize', this.handleResize, false);
            this.cloneColumns = this.makeColumns()
            this.resetPrivateVariables()
        },
        beforeDestroy () {
            window.removeEventListener('resize', this.handleResize, false);
        },
        watch: {
            data: {
                handler () {
                    this.objData = this.makeObjData();
                    this.rebuildData = this.makeDataWithSortAndFilter();
                    this.handleResize();
                },
                deep: true
            },
            columns: {
                handler () {
                    // todo 这里有性能问题，可能是左右固定计算属性影响的
                    this.cloneColumns = this.makeColumns();
                    this.rebuildData = this.makeDataWithSortAndFilter();
                    this.handleResize();
                    this.resetPrivateVariables()
                },
                deep: true
            },
            height () {
                this.fixedHeader();
            }
        }
    };
</script>

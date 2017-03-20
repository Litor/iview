<template>
  <div>
    <Row v-for="(index1, row) in rows" :class="row.class" :style="row.style" v-show="!row.hidden">
      <i-col :span="col.span" v-for="(index2, col) in row.cols" v-show="!col.hidden"
             @click="select(col, rows, index1, row.cols, index2)">
        <div :style="col.style" class="designer-col {{col == selectedSection.currentCol?'designer-col-selected':''}}">
          <div v-if="col.component">
            <component :is="col.component" class="{{col.name?('comp-name-'+col.name):''}}" :options="col.options || {}" :events="col.events || {}" :mock="mock"></component>
          </div>
          <div v-else>
            <content-component class="{{col.name?('comp-name-'+col.name):''}}" :mock="mock"
                               :content="col.content" :options="col.options || {}" :events="col.events || {}"></content-component>
          </div>
          <div v-if="col.rows">
            <container-layout :rows="col.rows" :mock="mock" @on-select="select" :current-col.sync="currentCol"></container-layout>
          </div>
          <div v-if="!col.content &&　!col.component && !col.rows">
            <div style="font-size:14px;text-align:center;height:36px;line-height:36px;font-weight: 400;">空</div>
          </div>
        </div>
        <div class="mask"></div>
      </i-col>
    </Row>
  </div>
</template>
<script>
  import contentComponent from './contentComponent.vue'
  import containerLayout from './containerLayout.vue'

  export default {
    components: {contentComponent, containerLayout},
    props: {rows: Array, mock: {type: Boolean, default: false}, selectedSection:Object},
    name: 'containerLayout',

    methods: {
      select(col, rows, index1, cols, index2){
        this.selectedSection = {currentCol: col, rows: rows, rowIndex: index1, cols: cols, colIndex: index2}
        this.$emit('on-select', col, rows, index1, cols, index2)
      },

      del(cols, index){
        cols = cols.splice(index)
      },

      up(cols, index){

        if (index == 0) {
          return
        }

        var temp = cols[index]

        cols.$set(index, cols[index - 1])
        cols.$set(index-1, temp)
      },

      down(cols, index){

        if (index == cols.length -1) {
          return
        }

        var temp = cols[index]

        cols.$set(index, cols[index + 1])
        cols.$set(index+1, temp)
      },

      addCol(cols){
          cols.push({name:'',component:'', style:{}, span:24})
      }
    }
  }
</script>
<style>
  .designer-col{
    position: relative;
  }

  .designer-col + .mask{
    background-color: rgba(0,0,0, 0.1);
    height: 100%;
    position: absolute;
    width: 100%;
    display: none;
    top:0;
  }

  .designer-col-selected + .mask {
    display: block;
  }
</style>

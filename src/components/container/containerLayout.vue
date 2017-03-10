<template>
  <div>
    <Row v-for="row in layout" :class="row.class" :style="row.style" v-show="!row.hidden">
      <i-col :span="col.span" v-for="col in row.cols" :class="col.class" :style="col.style" v-show="!col.hidden">
        <div v-if="col.content">{{{col.content}}}</div>
        <div v-if="col.component">
          <component :is="col.component" :options="col.options || {}" :events="col.events || {}"
                     class="{{col.name?('comp-name-'+col.name):''}}" :mock="mock"></component>
        </div>
        <div v-if="col.layout">
          <container-layout :layout="col.layout" :mock="mock"></container-layout>
        </div>
      </i-col>
    </Row>
  </div>
</template>
<script>
  export default {
      props:{layout:Array, mock:{type:Boolean, default:false}},
      name:'containerLayout',
      ready(){
          console.log(this.layout)
      }
  }
</script>

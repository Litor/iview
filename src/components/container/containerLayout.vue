<template>
    <div>
        <Row v-for="row in rows" :class="row.class" :style="row.style" v-show="!row.hidden">
            <i-col :span="col.span" v-for="col in row.cols" :class="col.class" :style="col.style" v-show="!col.hidden">
                <div v-if="col.content">
                    <content-component  :options="col.options || {}" :events="col.events || {}"
                               class="{{col.name?('comp-name-'+col.name):''}}" :mock="mock" :content="col.content"></content-component>
                    </div>
                <div v-if="col.component">
                    <component :is="col.component" :options="col.options || {}" :events="col.events || {}"
                               class="{{col.name?('comp-name-'+col.name):''}}" :mock="mock"></component>
                </div>
                <div v-if="col.rows">
                    <container-layout :layout="col.rows" :mock="mock"></container-layout>
                </div>
            </i-col>
        </Row>
    </div>
</template>
<script>
    import contentComponent from './contentComponent.vue'

    export default {
        components:{contentComponent},
        props: {rows: Array, mock: {type: Boolean, default: false}},
        name: 'containerLayout'
    }
</script>

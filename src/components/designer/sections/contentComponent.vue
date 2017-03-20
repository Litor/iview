<template>
    <div>
        {{{realContent}}}
    </div>
</template>
<script>
    export default {
        props:{events:Object, options:{type:Object, default:function () {
            return {}
        }}, mock:Boolean, content:String},
        created(){
            var events = _.keys(this.events)

            events.forEach((event) => {
                this.$on(event, this.events[event])
            })
        },
        ready(){
            this.$compile(this.$el)
        },

        computed:{
            // 为什么使用realcontent： 如果直接使用content，当content改变时会移除之前渲染的元素 会报找不到parentNode
            realContent:function () {
              return '<div>'+(this.content || '')+'</div>'
            }
        },
        watch:{
            content:function () {
              this.$compile(this.$el)
            },
        }
    }
</script>

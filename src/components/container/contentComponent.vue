<template>
    <div>
        {{{content}}}
    </div>
</template>
<script>
    export default {
        props:{events:Object, options:Object, mock:Boolean, content:String},
        created(){
            var events = _.keys(this.events)

            events.forEach((event) => {
                this.$on(event, this.events[event])
            })
        },
        ready(){
            this.$compile(this.$el)
        }
    }
</script>
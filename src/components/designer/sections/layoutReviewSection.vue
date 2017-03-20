<template>
  <div>
    <div class="layout-review">
      <code>
        {{{options.layoutSource}}}
      </code>
    </div>
  </div>
</template>
<script>
  export default {
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
  }
</script>
<style scoped>
  .layout-review {
    height: 300px;
    overflow-y: scroll;
  }
</style>

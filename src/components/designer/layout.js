export default {
  //mock: true,
  style: {'padding': '0 8px 0'},
  class: '',
  modals: [{name:'layoutReviewSection',component:'ivuLayoutReviewSection'}],
  rows: [{
    cols:[{
      style:{'padding-bottom':'8px'},
      name:'topMenuSection',
      component:'ivuTopMenuSection'
    }]
  },
    {
      style:{'height':'calc(100% - 94px)','border':'1px solid #d7dde4'},
      cols: [{
        style:{'border-right':'1px solid #d7dde4', 'height':'100%','overflow-y':'scroll'},
        span:19,
        component:'ivuDesignAreaSection',
        name:'designAreaSection'
      },{
        span:5,
        name:'attributeSection',
        component:'ivuAttributeSection',
        style:{'padding':'0 4px','height':'100%','overflow-y':'scroll'},
        options:{}
      }]
    }
  ]
}

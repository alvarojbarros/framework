Vue.config.devtools = true;

var vue_record = new Vue({
  el: '#recordFields',
  data: {
    values: '',
    table: '',
  },

  methods: {
	removeRow: function (field,index) {
		this.values.record[field].splice(index,1);
	},
  },

  watch: {
    values: {
      handler: function (val, oldVal) {
		if (val._state==1){
			res = ''
			for (k in val.recordTitle){
				fieldname = val.recordTitle[k];
				fieldvalue = val.record[fieldname];
				linkto = val.links[fieldname]
				if (linkto){
					linkvalue = linkto[fieldvalue]
					if (linkvalue){
						fieldvalue=linkvalue;
					}
				}
				if (fieldvalue){
					if (res){res = res.concat(' - ')}
					res = res.concat(fieldvalue);
				}
			}
			vue_title.Title = res;
		}else{
			vue_title.Title = 'Nuevo Registro'
		}
      },
      deep: true
    }
  },
})

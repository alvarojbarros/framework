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
			if (val.record.Name){
				vue_title.Title = val.record.Name
			}else{
				vue_title.Title = val.record.id
			}
		}else{
			vue_title.Title = 'Nuevo Registro'
		}
      },
      deep: true
    }
  },
})

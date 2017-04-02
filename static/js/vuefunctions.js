Vue.config.devtools = true;

var messages = new  Vue({
	el: "#messages",
	data: {
		error_msg: '',
		success_msg: '',
	}
});


Vue.component('vue-input',{
	template: '#vue_input',
	props: ['input','field','label','value','readonly','itype','field_values'],
  	methods: {
	updateValue: function (value) {
      this.$emit('input', value)
	}
  }

});

var vue_title = new Vue({
  el: '#vue_title',
  data: {
    Title: '',
  },

})


var vue_record = new Vue({
  el: '#recordFields',
  data: {
    values: '',
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

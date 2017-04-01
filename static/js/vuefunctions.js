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

var vue_record = new Vue({
  el: '#recordFields',
  data: {
    values: '',
    price: 1
  },


  methods: {
	removeRow: function (field,index) {
		this.values.record[field].splice(index,1);
	},
  }

})

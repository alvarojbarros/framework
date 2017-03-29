Vue.config.devtools = true;

var messages = new  Vue({
	el: "#messages",
	data: {
		error_msg: '',
		success_msg: '',
	}
});

var vue_record = new Vue({
  el: '#recordFields',
  data: {
    values: '',
  },


  methods: {
	removeRow: function (field,index) {
		console.log(111)
		this.values.record[field].splice(index,1);
	},
  }

})


function setVueObject(record){
	console.log(record)
}
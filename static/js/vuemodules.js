Vue.config.devtools = true;


var vue_modules = new Vue({
  el: '#side-menu',
  data: {
    values: '',
    names: '',
  },
	mounted: function () {
		for (k in this.names){
			$(this.$refs['module-' + k]).html(this.names[k])
		}
	},
	updated: function () {
		for (k in this.names){
			$(this.$refs['module-' + k]).html(this.names[k])
		}
	},
})


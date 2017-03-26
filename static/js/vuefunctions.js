Vue.config.devtools = true;

var messages = new  Vue({
	el: "#messages",
	data: {
		error_msg: '',
		success_msg: '',
	}
});

var vue_detail = new Vue({
  el: '#Schedules',
  data: {
    vue_rows: []
  }
})

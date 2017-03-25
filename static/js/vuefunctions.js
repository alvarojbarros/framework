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
var app4 = new Vue({
  el: '#app4',
  data: {
    todos: [
      { text: 'Learn JavaScript' },
      { text: 'Learn Vue' },
      { text: 'Build something awesome' }
    ]
  }
})
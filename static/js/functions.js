/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction(n) {
    document.getElementById("myDropdown"+n).classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function refreshList() {
	$('#searchDiv').load(document.URL +  ' #searchDiv');
	//setTimeout(arguments.callee, 3000);
}


function newRecord(Table,TemplateName) {
    if (!TemplateName){
        TemplateName = 'recordform.html';
    }
    var vars = {Template: TemplateName,Table: Table,RecordId: ''}
    getTemplate('container-fluid',vars,function(){
		getRecord({TableName: Table},function (data){
			Vue.set(vue_record,'values', data);
			Vue.set(vue_record,'table', Table);
			Vue.set(vue_buttons,'canEdit', data.canEdit);
			Vue.set(vue_buttons,'canDelete', data.canDelete);
			setCustomVue(TemplateName,data.record);
			vue_title.Title = 'Nuevo Registro'
		})
	})
}


function sendFiles(table,id){

	var files = new FormData();
	FilesInputs = document.getElementsByClassName('fileinput-filename');
	for (k in FilesInputs){
		e = FilesInputs[k];
		efile = document.getElementById(e.id + '-file');
		if (efile){
			if (efile.files.length>0){
				if (efile.files[0].size>512000){
					alert('El tama&ntilde;o de imagen debe ser de 500 Kb')
					return;
				}
				files.append(e.id + '-table',table);
				files.append(e.id + '-id',id);
				files.append(e.id,efile.files[0]);
			}
		}
	}

	$.ajax({
		type: 'POST',
		url: '/_save_files',
		data: files,
		contentType: false,
		cache: false,
		processData: false,
		success: function(data) {
			//alert("OK");
		},
		failure: function(data){
			alert("No es posible actualizar archivos");
		}
	});
}

function saveRecord(form_id,table) {

    fields = vue_record.values.record;
    fields['TableName'] = table;
  	var _state = document.getElementById('_state');
    fields['_state'] = _state.value
    $.getJSON($SCRIPT_ROOT + '/_save_record', fields, function(data) {
      	res = data.result['res']
      	messages.error_msg  = '';
      	if (res){
      		vue_record.values.record.id = data.result['id'];
      		vue_record.values.record.syncVersion = data.result['syncVersion'];
      		vue_record.values._state = 1
      		//setCustomVue(table,data.result)
      		if (data.result['Name']){
				vue_title.recordName = data.result['Name']
			}else{
				vue_title.recordName = data.result['id']
			}
      		sendFiles(table,data.result['id']);
			setMessageTimeout('Registro Grabado')
      		if (data.result.RunJS){
				var callback_function = new Function(data.result.RunJS);
				callback_function();
			}
	  	}else{
			messages.error_msg = data.result['Error'];
		};
    });

};


function getRecordForm(Table,TemplateName,id,callName,runFunction){

	if (runFunction){
		var callback_function = new Function(runFunction);
		callback_function();
	}
    var vars = {Template: TemplateName,Table: Table, id: id}
	if (callName){
		var callback_function = new Function(callName);
		getTemplate('container-fluid',vars,function(){
			callback_function();
			getRecord({TableName: Table,id: id},function (data){
				Vue.set(vue_record,'table', Table);
				Vue.set(vue_record,'values', data);
				Vue.set(vue_buttons,'canEdit', data.canEdit);
				Vue.set(vue_buttons,'canDelete', data.canDelete);
				setCustomVue(TemplateName,data.record);
				if (data.record['Name']){
					vue_title.recordName = data.record['Name']
				}else{
					vue_title.recordName = data.record['id']
				}
			})
		})
	    //getTemplate('container-fluid',vars,null);
	}else{
	    getTemplate('container-fluid',vars,function (){
			getRecord({TableName: Table,id: id},function (data){
				Vue.set(vue_record,'table', Table);
				Vue.set(vue_record,'values', data);
				Vue.set(vue_buttons,'canEdit', data.canEdit);
				Vue.set(vue_buttons,'canDelete', data.canDelete);
				setCustomVue(TemplateName,data.record);
				if (data.record['Name']){
					vue_title.recordName = data.record['Name']
				}else{
					vue_title.recordName = data.record['id']
				}
			})
		});
	}
}

function getRecord(filters,callbalck){
  $.getJSON($SCRIPT_ROOT + '/_get_record', filters, function(data) {
    if (data.result.record.id){
    	data.result['_state'] = 1
	}else{
    	data.result['_state'] = 0
	}
    callbalck(data.result)
  });
}

function getRecordBy(Table,filters,callbalck){
  filters.TableName = Table;
  $.getJSON($SCRIPT_ROOT + '/_get_record', filters, function(data) {
    callbalck(data.result)
  });
}


function deleteRecord(table) {
    var fields = {}
    fields['TableName'] = table;
    messages.error_msg = '';
	_id = vue_record.values.record.id;
    if (_id){
		fields['id'] = _id;
		$.getJSON($SCRIPT_ROOT + '/_delete_record', fields, function(data) {
		  if (data.result['res']){
			  setMessageTimeout('Registro Borrado')
		  }else{
			  messages.error_msg = data.result['Error'];
		  }
		});
	}else{
	  alret('Registro No grabado. No se puede eliminar')
	}
};


function sortDict(obj){
	return Object.keys(obj).sort()
}


function searchBoxOnKey(e){
	var filter = $(e).val().toLowerCase();
    li = $('.list-group-full li');
    for (i = 0; i < li.length; i++) {
        a = li[i].innerText;
        words = filter.split(' ');
        var found = true;
        for (j = 0; j < words.length; j++) {
			var word = words[j];
			if (word){
				if (a.toLowerCase().indexOf(word)==-1) {
					found = false;
				}
			}
		}
		if (found==true) {
			li[i].style.display = "";
		} else {
			li[i].style.display = "none";
		}

    }
}

function runSearchBoxOnKey(){
	$('.list-group-full li').each(function(){
		$(this).attr('data-search-term', $(this).text().toLowerCase());
	});

	$('.live-search-box').on('keyup', function(){
		searchBoxOnKey(this);
	});
}

jQuery(document).ready(function($){

	getModulesVue();
	getCurrentUser();

	localStorage.clear();
	$('.list-group-full li').each(function(){
		$(this).attr('data-search-term', $(this).text().toLowerCase());
	});

	$('.live-search-box').on('keyup', function(){
		searchBoxOnKey(this);
	});

	getMyFunctionReady();

});


function checkFileSize(e){

	children1 = e.childNodes;
	for (i in children1){
		children2 = children1[i].childNodes;
		for (k in children2){
			childeren3 = children2[k]
			if (childeren3.files){
				oldFile = childeren3.files[0];
				if (childeren3.files[0].size>512000){
					alert('El tama&ntilde;o de imagen debe ser de 500 Kb');
					return;
				}
			}
		}
	}
}

function addNewRow(field){
	fields = vue_record.values.fields[field].fieldsDefinition;
	new_row = {}
	for (dfield in fields){
		if (dfield.substring(0,2)=='__'){
			continue;
		}
		new_row[dfield] = null;
	}
	vue_record.values.record[field].push(new_row)
}

function getTemplateModule(divName,moduleNr,index){
	var vars = vue_modules.values[moduleNr][index].Vars
	OpenCloseMenu();
	getTemplate(divName,vars,function(){
		vue_title.Title = vars.Name;
	});
}

function AddToLocalStorage(html){

	var myIndex = localStorage['index'];
	if (myIndex){
		localStorage['index'] = parseInt(localStorage['index']) + 1;
	}else{
		localStorage['index'] = 1;
	}
	divIndex = 'index' + localStorage['index'];
	localStorage[divIndex] = html;


	/*var i = parseInt(localStorage['index']) + 1;
	var l = localStorage.length;
	for (i; i < localStorage.length; i++) {
		divIndex = 'index' + i;
		localStorage.removeItem(divIndex);
	}*/

}


function getTemplate(divName,vars,callback){

	AddToLocalStorage($('.container-fluid').html())
	var myNode = document.getElementById(divName);
	history.pushState("1","","");

	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}

	runFunction = vars['runFunction'];
	if (runFunction){
		var callback_function = new Function(runFunction);
		callback_function();
	}

  	$.getJSON($SCRIPT_ROOT + '/_get_template', vars ,function(data) {

		var myNode = document.getElementById(divName);
		$(myNode).html(data.result.html)
		functions = data.result.functions;
		if (functions){
			var callback_function = new Function(functions);
			callback_function();
		}
		if (callback){
			callback();
		}
    });
}

function backLocalStorage(){
	divIndex = 'index' + localStorage['index'];
	var myNode = $('.container-fluid');
	myNode.html(localStorage[divIndex])
	localStorage.removeItem(divIndex);
	localStorage['index'] = parseInt(localStorage['index']) - 1;

}

window.onpopstate = function (event) {

	if(event.state) {
		backLocalStorage();
	}
}

function OpenCloseMenu(){
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		$(".navbar-toggle i").toggleClass("ti-menu"),$(".navbar-toggle i").addClass("ti-close")
		e = $(".sidebar-nav").toggleClass("in");
	}
}

function recoverPassword(){
	var e = document.getElementById('Email');
	if (!e.value){
		alert('Debe ingresar Email');
		return;
	}
	messages.error_msg  = '';
  	$.getJSON($SCRIPT_ROOT + '/_recover_password', {'email': e.value},function(data) {
      	res = data.result['res']
      	if (res){
			alert('Se ha enviado un correo con su nuevo password');
			show_signIn();
	  	}else{
			alert(data.result['Error']);
		};
    });
}


function cleanMessageText(text){
	messages.success_msg = '';
}


function setMessageTimeout(text){
	messages.success_msg = text;
	setTimeout("cleanMessageText()", 5000);
}


function changePassword(){
	event.preventDefault()
	var p = document.getElementById('password');
	var p1 = document.getElementById('password1');
	var p2 = document.getElementById('password2');
	messages.error_msg  = '';
	if (p1.value==p2.value){
		$.getJSON($SCRIPT_ROOT + '/_change_password', {'pwd': p.value,'newpwd': p1.value},function(data) {
			res = data.result['res']
			if (res){
				//alert('Se ha modificado el password correctamente');
				setMessageTimeout('Se ha modificado el password correctamente')
			}else{
				//alert(data.result['Error']);
				messages.error_msg = data.result['Error'];
			};
		});
	}else{
		messages.error_msg = "Los password no coinciden";
		return;
	}
}


function getModulesVue(){

  var sidemenu = document.getElementById('side-menu');
  if (sidemenu){
	$.getJSON($SCRIPT_ROOT + '/_get_modules', {},function(data) {
		Vue.set(vue_modules,'values', data.result.modules);
		Vue.set(vue_modules,'names', data.result.names);
		for (k in vue_modules.names){
			$(vue_modules.$refs['module-' + k]).html(vue_modules.names[k])
		}
	});
  }
}

function getCurrentUser(callback){

  var usermenu = document.getElementById('user-menu');
  if (usermenu){
	$.getJSON($SCRIPT_ROOT + '/_get_current_user_type', {},function(data) {
		Vue.set(vue_user_menu,'current_user_type', data.result.user_type);
		Vue.set(vue_user_menu,'current_user_id', data.result.user_id);
		if (callback){
			callback();
		}
	});
  }
}

function getRecordList(table,fields,limit,order_by,desc){

	var vars = {'Table': table,'Fields': fields }
	if (limit) {vars['Limit'] = limit;}
	if (order_by) {vars['OrderBy'] = order_by;}
	if (desc) {vars['Desc'] = desc;}
	Vue.set(vue_recordlist,'table', table);
	Vue.set(vue_recordlist,'user_type', vue_user_menu.current_user_type);
	Vue.set(vue_recordlist,'user_id', vue_user_menu.current_user_id);
	$.getJSON($SCRIPT_ROOT + '/_record_list', vars ,function(data) {
		Vue.set(vue_recordlist,'values', data.result.records);
		Vue.set(vue_recordlist,'filters', data.result.filters);
		Vue.set(vue_recordlist,'filtersNames', data.result.filtersNames);
	});
}


function updateLinkTo(fieldname){
	fields = vue_record.values.record;
	fields['TableName'] = vue_record.table;
	if (fieldname){
		fields['FieldName'] = fieldname;
	}
	$.getJSON($SCRIPT_ROOT + '/_update_linkto', fields,function(data) {
		if (fieldname){
			vue_record.values.links[fieldname] = data.result[fieldname];
		}else{
			vue_record.values.links = data.result;
		}
	});
}

function updateRecordList(div,Filter){
    for (i in vue_recordlist.values){
        if (div.value==Filter){
            vue_recordlist.values[i]._Skip = false;
        }else{
            if (vue_recordlist.values[i][Filter]!=div.value){
                vue_recordlist.values[i]._Skip = true;
            }else{
                vue_recordlist.values[i]._Skip = false;
            }
        }
    }
}


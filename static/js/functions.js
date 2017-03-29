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
    vars = {Template: TemplateName,Table: Table,RecordId: ''}
    getTemplate('container-fluid',vars,function(){
		createRecordForm(null,Table,null,'recordFields');
	})
}

function close_form(form) {
  var e = document.getElementById(form);
  e.style.display = 'none';
  var elem = document.getElementById('record_form');
  elem.parentNode.removeChild(elem);
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
	/*msj = '';
    form = document.getElementById(form_id);
    var fields = {}
    fields['TableName'] = table;
  	var _state = document.getElementById('_state');
    fields['_state'] = _state.value
    for(var i=0; i < form.elements.length; i++){
        var e = form.elements[i];
        var detail = e.getAttribute('detail');
        if (detail){
			var detailField = document.getElementById(detail);
			var has_rows = detailField.getAttribute('has_rows');
			if (has_rows=='false'){
				continue;
			}
			if (!fields[detail]){
				fields[detail] = {};
			}
        	var row = e.parentNode.parentNode;
        	var rowNr = row.getAttribute('rowNr');
        	var rowId = row.getAttribute('rowId');
			if (!fields[detail][rowNr]){
				fields[detail][rowNr] = {};
				fields[detail][rowNr]['id'] = rowId;
			}
			fields[detail][rowNr][e.name] = e.value;
			if (e.type=="checkbox"){
				fields[detail][rowNr][e.name]  = 0;
				if (e.checked==true){
					fields[detail][rowNr][e.name] = 1;
				}
			}
			continue;
		}
        if (e.name){
				fields[e.id] = e.value;
			if (e.type=="checkbox"){
				fields[e.id] = 0;
				if (e.checked==true){
					fields[e.id] = 1;
				}
			}
		}
    }*/

    fields = vue_record.values.record;
    fields['TableName'] = table;
  	var _state = document.getElementById('_state');
    fields['_state'] = _state.value
    $.getJSON($SCRIPT_ROOT + '/_save_record', fields, function(data) {
      	res = data.result['res']
      	messages.error_msg  = ''
      	if (res){
      		vue_record.values.record.id = data.result['id'];
      		vue_record.values.record.syncVersion = data.result['syncVersion'];
      		//form.elements['id'].value = data.result['id'];
      		//form.elements['syncVersion'].value = data.result['syncVersion'];
      		sendFiles(table,data.result['id']);
			//alert('Registro Grabado');
			//messages.success_msg = 'Registro Grabado';
			setMessageTimeout('Registro Grabado')
	  	}else{
			//alert(data.result['Error']);
			messages.error_msg = data.result['Error'];
		};
    });

};


function getRecordForm(Table,TemplateName,id,callName,runFunction){

	if (runFunction){
		var callback_function = new Function(runFunction);
		callback_function();
	}
    vars = {Template: TemplateName,Table: Table, id: id}
	if (callName){
		var callback_function = new Function(callName);
		getTemplate('container-fluid',vars,function(){
			callback_function();
			getRecord(Table,id,function (data){
				Vue.set(vue_record,'values', data);
			})
		})
	    //getTemplate('container-fluid',vars,null);
	}else{
	    getTemplate('container-fluid',vars,function (){
			getRecord(Table,id,function (data){
				Vue.set(vue_record,'values', data);
			})
		});
	}
}

function getRecord(Table,id,callbalck){
  $.getJSON($SCRIPT_ROOT + '/_get_record', {id: id, TableName: Table}, function(data) {
    callbalck(data.result)
  });
}

function getRecordBy(Table,filters,callbalck){
  filters.TableName = Table;
  $.getJSON($SCRIPT_ROOT + '/_get_record', filters, function(data) {
    callbalck(data.result)
  });
}


function deleteRecord(id,table,formId) {
    form = document.getElementById(id);
    var fields = {}
    fields['TableName'] = table;
	_id = form.elements['id'].value;
    if (_id){
		fields['id'] = _id;
		$.getJSON($SCRIPT_ROOT + '/_delete_record', fields, function(data) {
		  if (data.result['res']){
			  //alert('Registro Borrado')
			  messages.success_msg = 'Registro Borrado';
		  }else{
			  //alert(data.result['Error'])
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

	localStorage.clear();
	$('.list-group-full li').each(function(){
		$(this).attr('data-search-term', $(this).text().toLowerCase());
	});

	$('.live-search-box').on('keyup', function(){
		searchBoxOnKey(this);
	});

});


function setComboField(record,fields,links,key,e){
  if (!e){
	  var e = document.createElement('select')
	  e.setAttribute('class','form-control')
  }else{
	  while (e.firstChild) {
	  	  e.removeChild(e.firstChild);
	  }
  }
  e.name = key;
  e.id = key;
  values = fields[key]['Values'];
  if (values){
	  for (var combo in values){
		var c = document.createElement('option');
		c.value = combo;
		c.innerHTML = values[combo]
		e.appendChild(c)
		if (record[key]==combo){
			c.selected = true;
		}
	  }
  }
  linkto = links[key];
  if (linkto){
	  var c = document.createElement('option');
	  c.value = null;
	  c.innerHTML = '';
	  if (!record[key]){
		c.selected = true;
	  }
	  e.appendChild(c)
	  for (var key1 in linkto){
		var c = document.createElement('option');
		c.value = key1;
		c.innerHTML = linkto[key1]
		e.appendChild(c)
		if (record[key]==key1){
			c.selected = true;
		}
	  }
  }
  return e;
}

function setInput(record,fields,key){
  var e = document.createElement('input')
  e.placeholder = fields[key]['Label'];
  e.name = key;
  e.id = key;
  e.value = record[key];
  e.type = fields[key]['Input'];
  e.setAttribute('class','form-control')
  return e;
}

function setCheckbox(record,fields,key){
  var e = document.createElement('input')
  e.id = key;
  e.name = key;
  e.type = fields[key]['Input'];
  e.setAttribute('class','fxhdr')
  if (record[key]==1){
      e.checked = true;
  }
  return e;
}

function setInputDateTime(record,fields,key){
  var e = document.createElement('input')
  e.placeholder = fields[key]['Label'];
  e.name = key;
  e.id = key;
  e.value = record[key];
  e.type = fields[key]['Input'];
  e.setAttribute('class','form-control mydatepicker')
  return e;
}

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

function setFileInput(record,fields,key){

  var fi = document.createElement('div')
  fi.setAttribute('class','fileinput fileinput-new input-group');
  fi.setAttribute('onchange','checkFileSize(this)');
  fi.setAttribute('data-provides','fileinput');

  var e = document.createElement('div');
  e.setAttribute('class','form-control');
  e.setAttribute('data-trigger','fileinput');
  fi.appendChild(e);
  var i = document.createElement('i');
  i.setAttribute('class','glyphicon glyphicon-file fileinput-exists');
  e.appendChild(i);

  var sp = document.createElement('span');
  sp.setAttribute('class','fileinput-filename');
  sp.name = key;
  sp.id = key;
  sp.innerHTML = record[key]
  e.appendChild(sp);

  var sp2 = document.createElement('span');
  sp2.setAttribute('class','input-group-addon btn btn-default btn-file');
  fi.appendChild(sp2);

  var sp3 = document.createElement('span');
  sp3.setAttribute('class','fileinput-new');
  sp3.innerHTML = 'Seleccionar Archivo';
  sp2.appendChild(sp3);
  var sp4 = document.createElement('span');
  sp4.setAttribute('class','fileinput-exists');
  sp4.innerHTML = 'Cambiar';
  sp2.appendChild(sp4);

  var in1 = document.createElement('input');
  in1.setAttribute('type','hidden');
  in1.setAttribute('value','');
  in1.name = '...';
  sp2.appendChild(sp4);

  var in2 = document.createElement('input');
  in2.setAttribute('type','file');
  in2.name = key + '-file';
  in2.id = key + '-file';
  sp2.appendChild(in2);

  var a = document.createElement('a');
  a.href = '#';
  a.setAttribute('class','input-group-addon btn btn-default fileinput-exists');
  a.setAttribute('data-dismiss','fileinput');
  a.innerHTML = 'Quitar';
  fi.appendChild(a);

  //fi.type = fields[key]['Input'];
  return fi;
}


function setTextArea(record,fields,key){
  var e = document.createElement('textarea')
  e.setAttribute('class','form-control')
  e.name = key;
  e.id = key;
  e.value = record[key];
  e.type = fields[key]['Input'];
  return e;
}

function createForm(){
    var formh = document.createElement('form')
    formh.autocomplete = "off";
    formh.setAttribute('action','/');
    formh.id = 'record_form';
	formh.setAttribute('class','form-material form-horizontal');
	return formh;
}


function create_State(_state){
	var e = document.createElement('input');
	e.name = '_state';
	e.id = '_state';
	e.value = _state;
	e.type = 'hidden';
	return e;
}

function createHiddes(fields,formh,record){
    for (var key in fields) {
      if (fields[key]['Hidde']){
          var e = document.createElement('input')
          e.name = key;
          e.id = key;
          e.value = record[key];
          e.type = 'hidden';
		  formh.appendChild(e);
	  }
	}
}

function cretateTabRow(formh,Name){
    var divrow = document.createElement('div')
	divrow.setAttribute('class','row');
	formh.appendChild(divrow);
    var divcol12 = document.createElement('div')
	divcol12.setAttribute('class','col-xs-12');
	divrow.appendChild(divcol12);
    var divwb = document.createElement('div')
	divwb.setAttribute('class','white-box');
	divcol12.appendChild(divwb);
	var h3 = document.createElement('h3')
	h3.setAttribute('class','box-title');
	h3.innerHTML = Name;
	divwb.appendChild(h3);
	return divwb;
}

function createField(divf,fields,record,key,_state){

	var label = document.createElement('label')
	label.setAttribute('class','col-xs-12')
	label.innerHTML = fields[key]['Label'];
	label.setAttribute('for',key);

	if (fields[key]['Input']!='checkbox'){
	  divf.appendChild(label)
	}

	var divc = document.createElement('div')
	divc.setAttribute('class','col-xs-12')
	divf.appendChild(divc)

	if (fields[key]['Input']=='combo'){
	  var e = setComboField(record,fields,links,key,null);
	}

	if (['text','number','integer','datetime','date','password','time'].indexOf(fields[key]['Input']) > -1){
	  var e = setInput(record,fields,key);
	}

	if (fields[key]['Input']=='checkbox'){
	  var e = setCheckbox(record,fields,key);
	  divc.setAttribute('class','checkbox checkbox-primary')
	  label.removeAttribute('class')
	}

	if (fields[key]['Input']=='datetime-local'){
	  var e = setInputDateTime(record,fields,key);
	}
	if (fields[key]['Input']=='textarea'){
	  var e = setTextArea(record,fields,key);
	}
	if (fields[key]['Input']=='fileinput'){
	  var e = setFileInput(record,fields,key);
	}

	readonly = fields[key]['Readonly'];
	setReadonly(readonly,_state,e,fields[key]['Input']=='combo');

	onClick = fields[key]['onClick'];
	if (onClick){
		e.setAttribute('onClick',onClick);
	}


	memo_rows = fields[key]['rows'];
	if (memo_rows){
		e.setAttribute('rows',memo_rows);
	}
	memo_cols = fields[key]['cols'];
	if (memo_cols){
		e.setAttribute('cols',memo_cols);
	}

	divc.appendChild(e)
	if (fields[key]['Input']=='checkbox'){
	  divc.appendChild(label)
	}
}


function myIndexOf(array,mykey) {
    for (key in array) {
		if (key==mykey){
			return true;
		}
    }
    return false;
}

function setReadonly(readonly,_state,e,combo){
	if (readonly && readonly==1 && readonly==_state){
		e.readOnly = true;
		if (combo){
			e.disabled = true;
		}
	}
	if (readonly && readonly==2){
		e.readOnly = true;
		if (combo){
			e.disabled = true;
		}
	}
}


function createArrayRow(divfg,details,detailNames,key,notNew,_state){
	var tr = document.createElement('div')
	tr.setAttribute('v-for','(row,cnt) in vue_rows['+key+']')
	tr.setAttribute('class','col-xs-12')
	tr.setAttribute('name',key + 'Rows')
	//tr.setAttribute('id','row' + cnt);
	tr.setAttribute(':rowNr','cnt+1');
	if (notNew){
		tr.setAttribute('rowId',"row['id']");
	}
	divfg.appendChild(tr);
	var kl = detailNames['__order__'].length;
	var md = 12 / kl;
	for (dkey in detailNames['__order__']){
		dname = detailNames['__order__'][dkey]
		var dfield = detailNames[dname];
		if (dfield['Hidde']){
			continue;
		}
		var td = document.createElement('div');
		tr.appendChild(td);
		td.setAttribute('class','col-xs-6 col-md-' + md)

		var tdi = document.createElement('input')
		tdi.setAttribute('class','form-control');
		tdi.setAttribute('onchange','setModified("'+key+'")');
		tdi.setAttribute('onkeyup','setModified("'+key+'")');
		tdi.placeholder = dfield['Label'];
		tdi.setAttribute('detail',key);
		tdi.name = dname;
		tdi.id = dname;
		tdi.type = dfield['Input'];
		if (notNew){
			tdi.setAttribute(':value','row['+dname+']');
		}
		if (tdi.type=='checkbox'){
			tdi.setAttribute(':checked','row['+dname+']')
		}
		tdl = document.createElement('label');
		tdl.innerHTML = dfield['Label'];

		if (dfield['Input']=='checkbox'){
			td.setAttribute('class','col-xs-3 col-md' + md + ' checkbox checkbox-primary')
			td.appendChild(tdi);
			tdl.setAttribute('labelfor',dname)
			td.appendChild(tdl);
		}else{
			td.appendChild(tdl);
			td.appendChild(tdi);
		}

		readonly = dfield['Readonly'];
		setReadonly(readonly,_state,tdi,dfield['Input']=='combo');

	}

	var delrow = document.createElement('div');
	delrow.setAttribute('class','col-lg-1 col-xs-6 col-md-1')
	var a = document.createElement('button');
	a.setAttribute('class','btn btn-danger btn-rounded waves-effect waves-light')
	a.type = 'button';
	//a.id = 'delete' + cnt;
	//a.setAttribute('onclick','deleteRow("'+cnt+'","'+key+'")');
	delrow.appendChild(a);
	a.innerHTML = '<span class="btn-label"><i class="fa fa-times"></i></span>Borrar'
	tr.appendChild(delrow);
}

function createArrayField(rowrecord,divfg ,field,key,_state){

	divfg.setAttribute('id',key);
	var detailNames = field['fieldsDefinition'];

	var details = rowrecord;
	createArrayRow(divfg,details,detailNames,key,true,_state)
	/*var cnt = 1;
	for (row in details){
		createArrayRow(divfg,cnt,details,row,detailNames,key,true,_state)
		cnt += 1;
	}

	if (cnt==1){
		createArrayRow(divfg,cnt,null,null,detailNames,key,false,_state)
		divfg.setAttribute('has_rows',false);
	}else{
		divfg.setAttribute('has_rows',true);
	}*/

	var a = document.createElement('button');
	a.setAttribute('class','btn btn-warning btn-rounded waves-effect waves-light')
	a.type = 'button';
	a.setAttribute('onclick','addNewRow("'+key+'")');
	a.innerHTML = '<span class="btn-label"><i class="fa fa-times"></i></span>Agregar'
	divfg.appendChild(a);


}

function appendField(record,fields,LineField,mydiv,_state){

	if (fields[LineField]['Type'] instanceof Array){
		createArrayField(record[LineField],mydiv,fields[LineField],LineField,_state);
	}else{
		createField(mydiv,fields,record,LineField,_state);
	}
}

function appendFields(LineFilds,fields,record,mydiv,_state){

	var divf = document.createElement('div')
	divf.setAttribute('class','form-group')
	mydiv.appendChild(divf);
	var cnt = 0;

	if (LineFilds.length>1){
		var kl = LineFilds.length;
		var md = 12 / kl;
		for (k in LineFilds){
			LineField = LineFilds[k];
			if (myIndexOf(fields,LineField)){
				cnt += 1;
				if (fields[LineField]['Hidde']){
					continue
				}
				var divl = document.createElement('div');
				if (k==0){
					divl.setAttribute('class','col-xs-12 col-md-' + md + ' p-0 m-b-25');
				}else{
					divl.setAttribute('class','col-xs-12 col-md-' + md +' p-0');
				}
				divf.appendChild(divl);

				appendField(record,fields,LineField,divl,_state);
			}
		}
	}else{
		for (k in LineFilds){
			LineField = LineFilds[k];
			if (myIndexOf(fields,LineField)){
				cnt += 1;
				if (fields[LineField]['Hidde']){
					continue
				}
				appendField(record,fields,LineField,divf,_state);
			}
		}
	}
	return cnt;
}

function createFormDiv(_state,fields,record,htmlView){

	var formh = createForm()
	var statef = create_State(_state);
	formh.appendChild(statef);
	createHiddes(fields,formh,record)

	if (htmlView){
		for (tkey in htmlView){
			htmlTab = htmlView[tkey]
			var divwb = cretateTabRow(formh,htmlTab.Name)
			var cnt = 0;
			for (fkey in htmlTab.Fields) {
				LineFilds = htmlTab.Fields[fkey]["1"];
				cntk = appendFields(LineFilds,fields,record,divwb,_state);
				cnt += cntk
			}
			if (cnt==0){
				divwb.parentNode.removeChild(divwb);
			}
		}
	}else{
		var divwb = cretateTabRow(formh,"")
		for (var key in fields) {
			if (fields[key]['Hidde']){
				continue
			}
			appendField(record,fields,key,divwb,_state);
		}
	}
	return formh;
}

function createRecordForm(_id,Table,_state,divId,callback){
  filters = {TableName: Table,_state: _state}
  if (_id){
  	filters.id = _id;
  }
  $.getJSON($SCRIPT_ROOT + '/_get_record', filters, function(data) {
    record = data.result.record;
    fields = data.result.fields;
    links = data.result.links;
    htmlView = data.result.htmlView;
    xml = data.result.xml;

	Vue.set(vue_record,'values', 'c');

    var title1 = document.getElementById('title1')
    var title2 = document.getElementById('title2')
    if (_id){
	    title1.innerHTML = record.Name;
	    title2.innerHTML = record.Name;
	}else{
	    title1.innerHTML = 'Nuevo ' + Table;
	    title2.innerHTML = 'Nuevo ' + Table;
	}

	var div = document.getElementById(divId)
	//var formh = createFormDiv(_state,fields,record,htmlView);
	//div.appendChild(formh);
	//div.appendChild(xml);
	$(div).html(xml);
	if (callback){
		callback();
	}
	});
}


function setModified(id){
	var li = document.getElementById(id);
	li.setAttribute('has_rows',true);
}

/*function addNewRow(key){
	var table = document.getElementsByName(key+'Rows');
	var lastrow = table[ table.length - 1 ];
	var newrow = lastrow.cloneNode(true);
	rowNr = parseInt(lastrow.getAttribute('rowNr')) + 1
	inputs = newrow.getElementsByTagName('input')
	for (i = 0; i < inputs.length; i++) {
		var inp = inputs[i];
		inp.value = null;
		if (inp.type=="checkbox"){
			inp.checked = false;
		}
	}
	newrow.setAttribute('rowNr',rowNr);
	newrow.id = 'row' + rowNr;
	newrow.setAttribute('status',0);
	newrow.setAttribute('rowId','');
	var a = newrow.getElementsByTagName('button')[0];
	a.id = 'delete' + rowNr;
	a.setAttribute('onclick','deleteRow('+ rowNr +',"'+key+'")');
	lastrow.parentNode.appendChild(newrow);
}*/

function addNewRow(field){
	var row = vue_record.values.record[field][0];
	var new_row = Object.assign({}, row);
	fields = vue_record.values.fields[field].fieldsDefinition;
	for (dfield in fields){
		if (dfield=='__order__'){
			continue;
		}
		new_row[dfield] = null;
	}
	console.log(vue_record.values.record[field].push(new_row))
}

function deleteRow(id,key){
    var row = document.getElementById('row' + id);
	var table = document.getElementsByName(key + 'Rows');
    var rowscnt = table.length;
    if (rowscnt==1){
		var newrow = row.cloneNode(true);
		inputs = newrow.getElementsByTagName('input')
		for (i = 0; i < inputs.length; i++) {
			var inp = inputs[i];
			inp.value = null;
			if (inp.type=="checkbox"){
				inp.checked = false;
			}
		}
		var li = document.getElementById(key);
		li.setAttribute('has_rows',false);
	}
    parentN = row.parentNode;
    parentN.removeChild(row);

    if (rowscnt==1){
		newrow.setAttribute('rowNr',1);
		newrow.id = 'row1';
		newrow.setAttribute('status',0);
		newrow.setAttribute('rowId','');
		var a = newrow.getElementsByTagName('button')[0];
		a.id = 'delete1';
		a.setAttribute('onclick','deleteRow(1,"'+key+'")');
		parentN.appendChild(newrow);
	}
}


function getTemplateModule(divName,vars){
	OpenCloseMenu();
	getTemplate(divName,vars);
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
		//myNode.innerHTML = data.result.html;
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
  	$.getJSON($SCRIPT_ROOT + '/_recover_password', {'email': e.value},function(data) {
      	res = data.result['res']
      	if (res){
			//alert('Se ha enviado un correo con su nuevo password');
			messages.success_msg = 'Se ha enviado un correo con su nuevo password';
			show_signIn();
	  	}else{
			//alert(data.result['Error']);
			messages.error_msg = data.result['Error'];
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
	if (p1.value==p2.value){
		$.getJSON($SCRIPT_ROOT + '/_change_password', {'pwd': p.value,'newpwd': p1.value},function(data) {
			res = data.result['res']
			if (res){
				//alert('Se ha modificado el password correctamente');
				messages.success_msg = 'Se ha modificado el password correctamente';
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




from xml.etree.ElementTree import Element, SubElement, Comment, tostring

def setComboField(record,fields,links,key):
    e = Element('select',{'class':'form-control','name':key,'id':key})

    values = fields[key].get('Values',None)
    if (values):
        for combo in values:
            c = Element('option',{'value':str(combo)})
            c.text = values[combo]
            e.append(c)
            if (record[key]==combo):
                c.set('selected','true')
    linkto = links.get(key,None)
    if (linkto):
        c = Element('option',{'value':'null'})
        c.text = ''
        if (not record[key]):
            c.set('selected','true')
        e.append(c)
        for key1 in linkto:
            c = Element('option',{'value':str(key1)})
            c.text = linkto[key1]
            e.append(c)
            if (record[key]==key1):
                c.set('selected','true')
    return e

def setInput(record,fields,key):
    e = Element('input')
    e.set('placeholder',fields[key]['Label'])
    e.set('name',key)
    e.set('id',key)
    e.set('value',str(record[key]))
    e.set('type',fields[key]['Input'])
    e.set('class','form-control')
    return e

def setCheckbox(record,fields,key):
    e = Element('input')
    e.set('id',key)
    e.set('name',key)
    e.set('type',fields[key]['Input'])
    e.set('class','fxhdr')
    if (record[key]==1):
        e.set('checked','true')
    return e

def setInputDateTime(record,fields,key):
    e = Element('input')
    e.set('placeholder',fields[key]['Label'])
    e.set('name',key)
    e.set('id',key)
    e.set('value',str(record[key]))
    e.set('type',fields[key]['Input'])
    e.set('class','form-control mydatepicker')
    return e

def setTextArea(record,fields,key):
    e = Element('textarea')
    e.set('class','form-control')
    e.set('name',key)
    e.set('id',key)
    e.set('value',str(record[key]))
    e.set('type',fields[key]['Input'])
    return e

def createForm():
    formh = Element('form')
    formh.set('autocomplete',"off")
    formh.set('action','/')
    formh.set('id','record_form')
    formh.set('class','form-material form-horizontal')
    return formh


def create_State(_state):
    e = Element('input')
    e.set('name','_state')
    e.set('id','_state')
    e.set('value',_state)
    e.set('type','hidden')
    return e

def createHiddes(fields,formh,record):
    for key in fields:
        if (fields[key].get('Hidde',None)):
            e = Element('input')
            e.set('name',key)
            e.set('id',key)
            e.set('value',str(record[key]))
            e.set('type','hidden')
            formh.append(e)


def cretateTabRow(formh,Name):
    divrow = Element('div')
    divrow.set('class','row')
    formh.append(divrow)
    divcol12 = Element('div')
    divcol12.set('class','col-xs-12')
    divrow.append(divcol12)
    divwb = Element('div')
    divwb.set('class','white-box')
    divcol12.append(divwb)
    h3 = Element('h3')
    h3.set('class','box-title')
    h3.text = Name
    divwb.append(h3)
    return divwb,divrow

def setFileInput(record,fields,key):
    fi = Element('div')
    fi.set('class','fileinput fileinput-new input-group')
    fi.set('onchange','checkFileSize(this)')
    fi.set('data-provides','fileinput')

    e = Element('div')
    e.set('class','form-control')
    e.set('data-trigger','fileinput')
    fi.append(e)
    i = Element('i')
    i.set('class','glyphicon glyphicon-file fileinput-exists')
    e.append(i)

    sp = Element('span')
    sp.set('class','fileinput-filename')
    sp.set('name',key)
    sp.set('id',key)
    sp.text = record[key]
    e.append(sp)

    sp2 = Element('span')
    sp2.set('class','input-group-addon btn btn-default btn-file')
    fi.append(sp2)

    sp3 = Element('span')
    sp3.set('class','fileinput-new')
    sp3.text = 'Seleccionar Archivo'
    sp2.append(sp3)
    sp4 = Element('span')
    sp4.set('class','fileinput-exists')
    sp4.text = 'Cambiar'
    sp2.append(sp4)

    in1 = Element('input')
    in1.set('type','hidden')
    in1.set('value','')
    in1.set('name','...')
    sp2.append(sp4)

    in2 = Element('input')
    in2.set('type','file')
    in2.set('name',key + '-file')
    in2.set('id',key + '-file')
    sp2.append(in2)

    a = Element('a')
    a.set('href','#')
    a.set('class','input-group-addon btn btn-default fileinput-exists')
    a.set('data-dismiss','fileinput')
    a.text = 'Quitar'
    fi.append(a)

    #fi.type = fields[key]['Input']
    return fi

def createField(divf,fields,record,key,_state,links):

    label = Element('label')
    label.set('class','col-xs-12')
    label.text = fields[key]['Label']
    label.set('for',key)

    if (fields[key]['Input']!='checkbox'):
        divf.append(label)

    divc = Element('div')
    divc.set('class','col-xs-12')
    divf.append(divc)
    e = Element('div')
    if (fields[key]['Input']=='combo'):
        e = setComboField(record,fields,links,key)

    if (fields[key]['Input'] in ['text','number','integer','datetime','date','password','time']):
        e = setInput(record,fields,key)

    if (fields[key]['Input']=='checkbox'):
        e = setCheckbox(record,fields,key)
        divc.set('class','checkbox checkbox-primary')
        del label.attrib['class']

    if (fields[key]['Input']=='datetime-local'):
        e = setInputDateTime(record,fields,key)
    if (fields[key]['Input']=='textarea'):
        e = setTextArea(record,fields,key)
    if (fields[key]['Input']=='fileinput'):
        e = setFileInput(record,fields,key)

    readonly = fields[key].get('Readonly',None)
    setReadonly(readonly,_state,e,fields[key]['Input']=='combo')

    onClick = fields[key].get('onClick',None)
    if (onClick):
        e.set('onClick',onClick)

    memo_rows = fields[key].get('rows',None)
    if (memo_rows):
        e.set('rows',memo_rows)
    memo_cols = fields[key].get('cols',None)
    if (memo_cols):
        e.set('cols',memo_cols)
    divc.append(e)
    if (fields[key]['Input']=='checkbox'):
        divc.append(label)

def setReadonly(readonly,_state,e,combo):
    if (readonly and readonly==1 and readonly==_state):
        e.set('readOnly','true')
        if (combo):
            e.set('disabled','true')
    if (readonly and readonly==2):
        e.set('readOnly','true')
        if (combo):
            e.set('disabled','true')

def createArrayRow(divfg,cnt,row,detailNames,key,notNew,_state):
    tr = Element('div')
    tr.set('class','col-xs-12')
    tr.set('name',key + 'Rows')
    tr.set('id','row' + str(cnt))
    tr.set('rowNr',str(cnt))
    if (notNew):
        tr.set('rowId',str(row['id']))
    divfg.append(tr)
    kl = len(detailNames['__order__'])
    md = int(12 / kl)
    for dname in detailNames['__order__']:
        dfield = detailNames[dname]
        if (dfield.get('Hidde',None)):
            continue
        td = Element('div')
        tr.append(td)
        td.set('class','col-xs-6 col-md-' + str(md))
        tdi = Element('input')
        tdi.set('class','form-control')
        tdi.set('onchange','setModified("'+key+'")')
        tdi.set('onkeyup','setModified("'+key+'")')
        tdi.set('placeholder',dfield['Label'])
        tdi.set('detail',key)
        tdi.set('name',dname)
        tdi.set('id',dname)
        tdi.set('type',dfield['Input'])
        if (notNew):
            tdi.set('value',str(row[dname]))
        if (dfield['Input']=='checkbox'):
            if (tdi.get('value',None)==1):
                tdi.set('checked','true')
        tdl = Element('label')
        tdl.text = dfield['Label']

        if (dfield['Input']=='checkbox'):
            td.set('class','col-xs-3 col-md' + str(md) + ' checkbox checkbox-primary')
            td.append(tdi)
            tdl.set('labelfor',dname)
            td.append(tdl)
        else:
            td.append(tdl)
            td.append(tdi)
        readonly = dfield.get('Readonly',None)
        setReadonly(readonly,_state,tdi,dfield['Input']=='combo')

    delrow = Element('div')
    delrow.set('class','col-lg-1 col-xs-6 col-md-1')
    a = Element('button')
    a.set('class','btn btn-danger btn-rounded waves-effect waves-light')
    a.set('type','button')
    a.set('id','delete%i' % cnt)
    a.set('onclick','deleteRow("'+str(cnt)+'","'+key+'")')
    delrow.append(a)
    sp = Element('span')
    sp.set('clas','btn-label')
    a.append(sp)
    spi = Element('i')
    spi.set('class','fa fa-times')
    sp.append(spi)
    a.text = 'Borrar'
    #a.text = '<span class="btn-label"><i class="fa fa-times"></i></span>Borrar'
    tr.append(delrow)

def createArrayField(rowrecord,divfg ,field,key,_state):

    divfg.set('id',key)
    detailNames = field['fieldsDefinition']

    details = rowrecord
    cnt = 1
    for row in details:
        createArrayRow(divfg,cnt,row,detailNames,key,True,_state)
        cnt += 1

    if (cnt==1):
        createArrayRow(divfg,cnt,None,detailNames,key,False,_state)
        divfg.set('has_rows','false')
    else:
        divfg.set('has_rows','true')

    a = Element('button')
    a.set('class','btn btn-warning btn-rounded waves-effect waves-light')
    a.set('type','button')
    a.set('onclick','addNewRow("'+key+'")')

    sp = Element('span')
    sp.set('clas','btn-label')
    a.append(sp)
    spi = Element('i')
    spi.set('class','fa fa-times')
    sp.append(spi)
    a.text = 'Agregar'

    #a.text = '<span class="btn-label"><i class="fa fa-times"></i></span>Agregar'
    divfg.append(a)


def appendField(record,fields,LineField,mydiv,_state,links):
    if isinstance(fields[LineField]['Type'],list):
        createArrayField(record[LineField],mydiv,fields[LineField],LineField,_state)
    else:
        createField(mydiv,fields,record,LineField,_state,links)

def appendFields(LineFilds,fields,record,mydiv,_state,links):

    divf = Element('div')
    divf.set('class','form-group')
    mydiv.append(divf)
    cnt = 0

    if (len(LineFilds)>1):
        kl = len(LineFilds)
        md = int(12 / kl)
        k = 0
        for LineField in LineFilds:
            if (LineField in fields):
                cnt += 1
                if (fields[LineField].get('Hidde',None)):
                    continue
                divl = Element('div')
                if (k==0):
                    divl.set('class','col-xs-12 col-md-' + str(md) + ' p-0 m-b-25')
                else:
                    divl.set('class','col-xs-12 col-md-' + str(md) +' p-0')
                divf.append(divl)
                appendField(record,fields,LineField,divl,_state,links)
            k += 1
    else:
        for LineField in LineFilds:
            if (LineField in fields):
                cnt += 1
                if (fields[LineField].get('Hidde',None)):
                    continue
                appendField(record,fields,LineField,divf,_state,links)
    return cnt


def createFormDiv(_state,fields,record,htmlView,links):
    formh = createForm()
    statef = create_State(_state)
    formh.append(statef)
    createHiddes(fields,formh,record)
    if (htmlView):
        for tkey in htmlView:
            htmlTab = htmlView[tkey]
            divwb,tab = cretateTabRow(formh,htmlTab['Name'])
            cnt = 0
            for fkey in htmlTab['Fields']:
                LineFilds = fkey[1]
                cntk = appendFields(LineFilds,fields,record,divwb,_state,links)
                cnt += cntk
            if (cnt==0):
                formh.remove(tab)
    else:
        divwb,tab = cretateTabRow(formh,"")
        for key in fields:
            if (fields[key].get('Hidde',None)):
                continue
            appendField(record,fields,key,divwb,_state,links)

    return tostring(formh)

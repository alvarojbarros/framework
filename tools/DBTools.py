# -*- coding: utf-8 -*-

from sqlalchemy.orm import sessionmaker
from tools.dbconnect import Session
from flask_login import current_user
from tools.Tools import *
from flask import url_for
import os
import getsettings
settings = getsettings.getSettings()

FormatTypes = {'str':'String','datetime':'DateTime','integer':'Integer'}

def getFieldColum(fieldname,attrs):
    ftype = FormatTypes[attrs['Type']]
    if ftype=='String':
        ftype = '%s(%i)' %(ftype,attrs['Length'])
    res = "%s = Column(%s)" % (fieldname,ftype)
    return res

def filterFiedlsByUserAccess(fields):
    to_remove = []
    for fn in fields:
        field = fields[fn]
        if ('Level' in field) and (current_user.UserType not in field['Level']):
            to_remove.append(fn)
        if ('Values' in field and 'ValuesLevel' in field):
            levels = field['ValuesLevel']
            values_remove = []
            for value in field['Values']:
                user_level = levels[current_user.UserType]
                if value not in user_level:
                    values_remove.append(value)
            for value in values_remove:
                del field['Values'][value]
    for fn in to_remove:
        del fields[fn]


def importTable(f):
    if not f:
        return
    lines = str(f.read()).split('\\r\\n')
    c = 0
    k = 0
    fieldNames = []
    session = Session()
    for line in lines:
        fields = line.split('\\t')
        if c==0:
            table = fields[0][2:]
            var = {}
            exec('from %s import %s as TableName' % (table,table),var)
            TableClass = var['TableName']
            records = session.query(var['TableName'])
            session.close()
        elif c==1:
            fieldNames = fields
        elif len(fields)==len(fieldNames):
            dic = {}
            for i in range(len(fieldNames)):
                value = fields[i]
                if value:
                    dic[fieldNames[i]] = value
            new_record = TableClass(dic)
            if new_record.check():
                session.add(new_record)
                k += 1

        c += 1
    try:
        session.commit()
        session.close()
    except:
        session.rollback()
        session.close()
        return Error("Error al importar")
    return "Registros importados %i" % k

def fillRecordList(records,fields,fieldsDef=None):
    res = []
    for record in records:
        row = {}
        #links = getLinksTo(fieldsDef,None)
        for field in fields:
            value = getattr(record,field)
            if isinstance(value,date):
                value = value.strftime("%d/%m/%Y")
            elif isinstance(value,time):
                value = value.strftime("%H:%M")
            elif (isinstance(value,int) or isinstance(value,str)) and fieldsDef:
                fieldDef = fieldsDef[field]
                if 'Values' in fieldDef:
                    value = fieldDef['Values'][value]
                elif 'LinkTo' in fieldDef:
                    #value = links[field][value]
                    pass

            row[field] = value
        res.append(row)
    return res

def getLinksTo(fields,record):
    links = {}
    for fn in fields:
        field = fields[fn]
        if ('LinkTo' in field):
            links[fn] = get_linkto(field['LinkTo'],record)
    return links

def get_linkto(linkto,record=None):
    res = {}
    table = linkto['Table']
    show = linkto['Show']
    method = linkto.get('Method',None)
    params = linkto.get('Params',None)
    TableClass = getTableClass(table)
    if method:
        records = settings.getMyFunction(method,params)
    elif record:
        records = record.getLinkToFromRecord(TableClass)
    else:
        records = TableClass.getRecordList(TableClass)
    for record in records:
        show_list = []
        for field in show:
            show_list.append(getattr(record,field))
        res[record.id] = ' '.join(show_list)
    return res

def getImageLink(table,id,fieldname):
    fname = '%s/%s.%s' %(table,fieldname,id)
    f = os.path.isfile("%s/%s/%s" % (settings.images_url,settings.images_folder,fname))
    if not f:
        url = url_for('static',filename='images/user.jpg')
    else:
        fname = "%s/%s" %(settings.images_folder,fname)
        url = url_for(settings.custom_static,filename=fname)
    return url

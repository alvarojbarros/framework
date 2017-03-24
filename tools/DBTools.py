from sqlalchemy.orm import sessionmaker
from tools.dbconnect import Session
from flask_login import current_user
from tools.Tools import *

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
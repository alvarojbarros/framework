from datetime import datetime,timedelta,date,time
import json
import copy
import random
import getsettings
db_foder = getsettings.getDbFolder()

def now():
    return datetime.now()

def today():
    return now().date()

def errorLog(text):
    f = open('Error.log','a')
    line = "%s: %s\n" %(str(now()),text)
    f.write(line)
    f.close()


def checkMandatoryFields(obj):
    for field in obj.mandatoryFields():
        if not getattr(obj,field):
            errorLog('No se pudo inicializar %s, campo %s' % (obj,field))
            return Error('No se pudo inicializar %s, campo %s' % (obj,field))
    return True

def stringToDateTime(string):
    if not string:
        return None
    try:
        if 'T' in string:
            t = datetime.strptime(string, "%Y-%m-%dT%H:%M:%S")
        else:
            t = datetime.strptime(string, "%Y-%m-%d %H:%M:%S")
        return t
    except:
        return None

def stringToDate(string):
    if not string:
        return None
    try:
        t = datetime.strptime(string, "%Y-%m-%d")
        return t.date()
    except:
        return None

def stringToTime(string):
    if not string:
        return None
    try:
        try:
            t = datetime.strptime(string, "%H:%M:%S")
        except:
            t = datetime.strptime(string, "%H:%M")
        return t.time()
    except:
        return None

def addTimeDaysToDatetime(days,myTime,myDatetime):
    seconds = 0
    if myTime:
        seconds = myTime.hour * 3600 + myTime.minute * 60 + myTime.second
    try:
        myDatetime += timedelta(days,seconds)
    except:
        pass
    return myDatetime

def addTimeToDatetime(myTime,myDatetime):
    seconds = myTime.hour * 3600 + myTime.minute * 60 + myTime.second
    try:
        myDatetime += timedelta(0,seconds)
    except:
        pass
    return myDatetime

def addMonthToDateTime(months,myDateTime):
    newmonth = ((( myDateTime.month - 1) + months ) % 12 ) + 1
    newyear  = myDateTime.year + ((( myDateTime.month - 1) + months ) / 12 )
    newday = myDateTime.day
    if newday>=28:
        while newday >= 28:
            try:
                res = datetime( int(newyear), int(newmonth), newday)
                return res
            except:
                newday += -1
    else:
        res = datetime( int(newyear), int(newmonth), newday)
    return res

def firstDayOfMonth(myDateTime):
    return datetime(myDateTime.year,myDateTime.month,1)

def lastDayOfMonth(myDateTime):
    firstDate = datetime(myDateTime.year,myDateTime.month,1)
    lastDate = addDaysToDatetime(-1,addMonthToDateTime(1,firstDate))
    return lastDate

def addDaysToDatetime(days,myDatetime):
    try:
        myDatetime += timedelta(days,0)
    except:
        pass
    return myDatetime


def addDays(myDate, days):
    try:
        myDate += timedelta(days)
    except:
        pass
    return myDate

def addHoursToDateTime(myDate, h):
    try:
        myDate += timedelta(hours=h)
    except:
        pass
    return myDate

def addMinutesToDateTime(myDate, m):
    try:
        myDate += timedelta(minutes=m)
    except:
        pass
    return myDate

def addMinutesToTime(myTime, minutes):
    td = timedelta(hours=myTime.hour,minutes = (myTime.minute + minutes),seconds=myTime.second)
    mins = td.seconds // 60
    secs = td.seconds % 60
    hrs = mins // 60
    mins = mins - hrs * 60
    return time(hrs,mins,secs)

def addTime(myTime1, myTime2):
    d1 = timedelta(hours=myTime1.hour,minutes = myTime1.minute,seconds=myTime1.second)
    d2 = timedelta(hours=myTime2.hour,minutes = myTime2.minute,seconds=myTime2.second)
    d3 = d1 + d2
    mins = d3.seconds // 60
    secs = d3.seconds % 60
    hrs = mins // 60
    mins = mins - hrs * 60
    myTime = time(hrs,mins,secs)
    return (myTime)


def importJson(filename):
    with open(filename, 'r') as fp:
        data = json.load(fp)
    return data


def getObjectClass(jsonlist,clasname,key=[]):
    if not key:
        records = []
    else:
        records = {}
    errors = False
    var = {}
    for e in jsonlist:
        exec('from %.%s import %s; r = %s(%s)' %(db_foder,clasname,clasname,clasname,e),var)
        record = var['r']
        if not hasattr(record,'initOk'):
            errors = True
            #break
        if not record.check():
            errors = True
            #break
        if not key:
            records.append(record)
        else:
            keyvalues = [getattr(record,keyname,None) for keyname in key]
            records[tuple(keyvalues)] = record
    if errors:
        print("Hay Errores. Revisar Log")
    return records

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    #if obj.__class__.__name__=='date':
    if isinstance(obj, date):
        serial = str(obj)
        return serial
    #if obj.__class__.__name__=='time':
    if isinstance(obj, time):
        serial = str(obj)
        return serial
    if isinstance(obj, int):
        serial = str(obj)
        return serial
    if isinstance(obj, datetime):
        serial = obj.isoformat()
        return serial
    if isinstance(obj, timedelta):
        serial = str(obj)
        return serial
    #if isinstance(obj, dict):
    #    return serial
    #if isinstance(obj, list):
    #    serial = json.dumps(obj,default=json_serial, sort_keys=True,indent=4, separators=(',', ': '))
    #    return serial
    raise TypeError ("Type not serializable")


def importRest(filename):
    f = open(filename, 'r')
    k = 0
    res = []
    for l in f:
        fields = l.replace('\n','').split('\t')
        if k==0:
            dkeys = fields
        else:
            dic = {}
            for i in range(0,len(fields)):
                dic[dkeys[i]] = int(fields[i])
            res.append(dic)
        k += 1
    return res

def importTable(filename):
    f = open(filename, 'r')
    k = 0
    res = {}
    for l in f:
        fields = l.replace('\n','').split('\t')
        if k==0:
            dkeys = fields
        else:
            dic = {}
            for i in range(1,len(fields)):
                dic[dkeys[i]] = int(fields[i])
            res[(int(fields[1]),int(fields[13]))] = dic
        k += 1
    return res

def timeDiff(st,et):
    t1 = datetime(1900,1,1,st.hour,st.minute,st.second)
    t2 = datetime(1900,1,1,et.hour,et.minute,et.second)
    return t2-t1

def objToString(obj):
    if isinstance(obj, dict):
        for key in obj:
            obj[key] = objToString(obj[key])
        return str(obj)
    elif isinstance(obj, list):
        for i in obj:
            obj[i] = objToString(obj[i])
        return str(obj)
    elif obj.__class__.__name__ in ('TSV'):
        return str(obj.__dict__)
    else:
        return str(obj)

def objectToStringExport(fname,obj):
    f = open(fname,'w')
    jsonobj = objToString(obj)
    f.write(jsonobj)
    f.close()

def setValue(record,key,val):
    if isinstance(val,list):
        detailName = key
        detail = getattr(record,detailName)
        var = {}
        ClassName = record.fieldsDefinition()[detailName]['Class']
        exec('from %s.%s import %s as Detail' % (db_foder,record.__class__.__name__,ClassName),var)
        Detail = var['Detail']

        for drow in detail:
            found = False
            for row in val:
                if row['id'] and int(row['id'])==drow.id:
                    found = True
                    break
            if not found:
                detail.remove(drow)

        for row in val:
            found = False
            for drow in detail:
                if row['id'] and int(row['id'])==drow.id:
                    found = True
                    break
            if not found:
                drow = Detail()
                detail.append(drow)
            for fname in row:
                field = record.fieldsDefinition()[detailName]['fieldsDefinition'][fname]
                dval = row[fname]
                if field['Type']=='integer':
                    if not dval or dval=='null':
                        dval = None
                    elif dval=='false':
                        dval = 0
                    elif dval=='true':
                        dval = 1
                    else:
                        dval = int(dval)
                if field['Type']=='time':
                    if not dval or dval=='null':
                        dval = None
                setattr(drow,fname,dval)
    else:
        rdef = record.fieldsDefinition()
        if key in rdef:
            field = rdef[key]
            if field['Type']=='integer':
                if not val or val=='null':
                    val = None
                elif val=='false':
                    val = 0
                elif val=='true':
                    val = 1
                else:
                    val = int(val)
            elif field['Type'] in ('time','float'):
                if not val or val=='null':
                    val = None
            if field['Type']=='text' and not val:
                val = None
            setattr(record,key,val)

def getDetailDict(fields):
    to_remove = []
    to_add = []
    rows = {}
    for key in fields:
        if '[' in key:
            nkey = key.replace(']','').replace('[','.')
            detail = nkey.split('.')[0]
            rownr = int(nkey.split('.')[1])
            fname = nkey.split('.')[2]
            value = fields[key]
            to_remove.append(key)
            to_add.append((detail,rownr,fname,value))
    to_add.sort(key=lambda x: x[1])
    rowcnt = 0
    for tup in to_add:
        rownr = tup[1]
        if rownr not in rows:
            rows[rownr] = rowcnt
            rowcnt += 1
    for tup in to_add:
        detail = tup[0]
        rownr = rows[tup[1]]
        fname = tup[2]
        value = tup[3]
        if detail not in fields:
            fields[detail] = []
        if rownr>=len(fields[detail]):
            row = {}
            fields[detail].append(row)
        fields[detail][rownr][fname] = value
    for key in to_remove:
        del fields[key]

def getTableClass(table):
    var = {}
    exec('from %s.%s import %s as TableName' % (db_foder,table,table),var)
    TableClass = var['TableName']
    return TableClass

def canUserCreate(table):
    return getTableClass(table).canUserCreate()

def canUserEdit(table,record):
    return getTableClass(table).canUserEdit(record)

def canUserDelete(table):
    return getTableClass(table).canUserDelete()

def canUserAddRow(table):
    return getTableClass(table).canUserAddRow()

def canUserDeleteRow(table):
    return getTableClass(table).canUserDeleteRow()

class Error:

    def __init__(self, msj=""):
        self.msj = msj

    def __nonzero__(self):
        return False

    def __str__(self):
        return repr(self.msj)

    def __bool__(self):
        return False

def passwordRamdom():
    alphabet = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    pw_length = 8
    mypw = ""
    for i in range(pw_length):
        next_index = random.randrange(len(alphabet))
        mypw = mypw + alphabet[next_index]
    return mypw

def mapEnum(records,fvalues,fname):
    l = []
    for record in records:
        r = {}
        for key in record.keys():
            if key==fname:
                v = getattr(record,fname)
                r[fname] = fvalues[v]
            else:
                r[key] = getattr(record,key)
        l.append(r)
    return l
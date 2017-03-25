from sqlalchemy import Column, Integer
from tools.dbconnect import Session
from sqlalchemy.orm import sessionmaker
from tools.Tools import *

class Record(object):
    syncVersion = Column(Integer)

    @classmethod
    def fieldsDefinition(cls):
        res = {}
        res['syncVersion'] = {'Type': 'integer','Hidde': True}
        res['id'] = {'Type': 'integer','Hidde': True}
        return res

    def filterFields(self,fields):
        return fields

    def check(self):
        return True

    def afterCommitInsert(self):
        pass

    def afterCommitUpdate(self):
        pass

    def afterInsert(self):
        return True

    def afterUpdate(self):
        return True

    def beforeInsert(self):
        if not self.syncVersion: self.syncVersion = 1
        return True

    def checkSyncVersion(self,version):
        if int(version)!=self.syncVersion:
            return False
        return True

    def defaults(self):
        pass

    @classmethod
    def canUserDelete(cls):
        return True

    @classmethod
    def canUserEdit(cls,recordId):
        return True

    @classmethod
    def canUserCreate(cls):
        return True

    @classmethod
    def getUserFieldsReadOnly(cls,rocord,fieldname):
        return 0

    @classmethod
    def isPersistent(cls,fieldname):
        fields = cls.fieldsDefinition()
        if 'Persistent' in fields[fieldname] and not fields[fieldname]['Persistent']:
            return False
        return True

    @classmethod
    def getfieldsDefinition(cls,record):
        res = cls.fieldsDefinition()
        for fname in res:
            readonly = cls.getUserFieldsReadOnly(record,fname)
            if readonly:
                res[fname]['Readonly'] = readonly
            if res[fname]['Type']==[]:
                dres = res[fname]['fieldsDefinition']
                dclass = res[fname]['Class']
                var = {}
                exec('from %s import %s as DetailName' % (cls.__module__,dclass),var)
                DetailClass = var['DetailName']
                for dname in dres:
                    dreadonly = DetailClass.getUserFieldsReadOnly(dname)
                    if dreadonly:
                        dres[dname]['Readonly'] = dreadonly
        return res

    @classmethod
    def htmlView(cls):
        return None

    @classmethod
    def query(cls):
        session = Session()
        records = session.query(cls)
        session.close()
        return records

    @classmethod
    def getDefValue(cls,fieldname):
        Type = cls.fieldsDefinition()[fieldname]['Type']
        if Type==[]: return 0
        elif Type=='integer': return 0
        elif Type=='text': return ''
        return None

    @classmethod
    def getRecordList(cls,TableClass):
        session = Session()
        records = session.query(TableClass)
        session.close()
        return records

    def save(self,session):
        if not self.syncVersion:
            self.syncVersion = 1
        else:
            if not self.checkSyncVersion(self.syncVersion):
                return Error('Otro Usuario ha modoficado el Registro')
            self.syncVersion += 1
        try:
            session.commit()
        except Exception as e:
            session.rollback()
            return Error(str(e))
        finally:
            session.close()
        return True

    @classmethod
    def getRecordById(cls,id):
        session = Session()
        record = session.query(cls).filter_by(id=id).first()
        session.close()
        return record


class DetailRecord(object):

    @classmethod
    def fieldsDefinition(cls):
        return {}

    @classmethod
    def fieldsOrder(cls):
        return cls.fieldsDefinition().keys()

    @classmethod
    def getUserFieldsReadOnly(cls,fieldname):
        return 0

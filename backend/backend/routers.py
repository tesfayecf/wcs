
class TimeSeriesRouter:
    app = "sensors"
    database = "timeseries"
    
    def db_for_read(self, model, **hints):
        if model._meta.app_label == self.app:
            return self.database
        return False
    
    def db_for_write(self, model, **hints):
        if model._meta.app_label == self.app:
            return self.database
        return False
    
    def allow_relation(self, obj1, obj2, **hints):
        if obj1._meta.app_label == self.app and obj2._meta.app_label == self.app:
            return True
        return False
    
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == self.app:
            return db == self.database
        return False
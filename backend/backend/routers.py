
from django.db import router

class MainRouter(router.AppRouter):
    """
    A router to use the default database for all models in the 'data' app.
    """
    database = 'main'  # This can be your custom database name for the data app
    apps = ['data', 'users'] 

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        This method controls which apps should be migrated into the specific database.
        Override this method to specify custom logic.
        """
        if app_label in self.apps:
            return self.database
        return None

    def allow_relation(self, obj1, obj2, **hints):
        """
        This method controls which relations should be allowed between two objects.
        Override this method to specify custom logic.
        """
        if (
            obj1._meta.app_label in self.apps
            and obj2._meta.app_label in self.apps
        ):
            return True
        return None

    def db_for_read(self, model, **hints):
        """
        This method controls which database to read from for a specific model.
        Override this method to specify custom logic.
        """
        if model._meta.app_label in self.apps:
            return self.database
        return None

    def db_for_write(self, model, **hints):
        """
        This method controls which database to write to for a specific model.
        Override this method to specify custom logic.
        """
        if model._meta.app_label in self.apps:
            return self.database
        return None


class TimeSeriesRouter(router.AppRouter):
    """
    A router to use the default database for all models in the 'data' app.
    """
    database = 'timeseries'
    apps = ['sensors']

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        This method controls which apps should be migrated into the specific database.
        Override this method to specify custom logic.
        """
        if app_label == 'data':
            return self.database
        return None

    def allow_relation(self, obj1, obj2, **hints):
        """
        This method controls which relations should be allowed between two objects.
        Override this method to specify custom logic.
        """
        if (
            obj1._meta.app_label in self.apps
            and obj2._meta.app_label in self.apps
        ):
            return True
        return None

    def db_for_read(self, model, **hints):
        """
        This method controls which database to read from for a specific model.
        Override this method to specify custom logic.
        """
        if model._meta.app_label == 'data':
            return self.database
        return None

    def db_for_write(self, model, **hints):
        """
        This method controls which database to write to for a specific model.
        Override this method to specify custom logic.
        """
        if model._meta.app_label == 'data':
            return self.database
        return None
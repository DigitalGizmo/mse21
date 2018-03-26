class MapdataRouter(object):
    """
    Determine how to route database calls for an app's models (in this case, for an app named mapdata).
    All other models will be routed to the next router in the DATABASE_ROUTERS setting if applicable,
    or otherwise to the default database.
    """

    def db_for_read(self, model, **hints):
        """Send all read operations on mapdata app models to `msemap_db`."""
        if model._meta.app_label == 'mapdata':
            return 'msemap_db'
        return None

    def db_for_write(self, model, **hints):
        """Send all write operations on mapdatag app models to `msemap_db`."""
        if model._meta.app_label == 'mapdata':
            return 'msemap_db'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        """Determine if relationship is allowed between two objects."""

        # Allow any relation between two models that are both in the mapdata app.
        if obj1._meta.app_label == 'mapdata' and obj2._meta.app_label == 'mapdata':
            return True
        # No opinion if neither object is in the mapdata app (defer to default or other routers).
        elif 'mapdata' not in [obj1._meta.app_label, obj2._meta.app_label]:
            return None

        # Block relationship if one object is in the mapdata app and the other isn't.
            return False

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """Ensure that the mapdata app's models get created on the right database."""
        if app_label == 'mapdata':
            # The mapdata app should be migrated only on the msemap_db database.
            return db == 'msemap_db'
        elif db == 'msemap_db':
            # Ensure that all other apps don't get migrated on the msemap_db database.
            return False

        # No opinion for all other scenarios
        return None

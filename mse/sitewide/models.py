from django.db import models
# for finding resource object model from string
from django.apps import apps


class Menu(models.Model):
    """
    As this this class has evolved, it should really be called PageInfo, or PageTypeInfo
    Originally and mostly it is for menu titles and blurbs, but in the case of Profiles
    and classroom projects its not.
    """
    short_name = models.CharField(max_length=32, unique=True)
    title = models.CharField(max_length=128)
    menu_blurb = models.TextField('About this menu', blank=True, default='')
    aside_blurb = models.TextField('Aside box text', blank=True, default='')
    has_icon = models.BooleanField(default=True)
    main_nav_name = models.CharField(max_length=32, blank=True, default='')

    def __str__(self):
        return self.title

class Featured(models.Model):
    """
    Featured items to appear on home page
    - The featured list is a different case from menus. In menus we have objects of 
    a certain type where we have each object in hand (can get namespace, resource type 
    from the newly discovered ability to have "class" properties)
    - But the featured list is different because we have the namespace and 
    resource type, but need to use them to retrieve the objects.
    - NEXT: rename resource_type to resource_locator

    The view retrieves banner item, tryptic and new_list accessed from that instance.
    """
    RESOURCE_LOCATOR = (
        ('artifacts:artifact', 'artifact'),
        ('community:project', 'classroom project'),
        ('documents:document', 'document'),
        ('about:event', 'event'),
        ('scholars:interview', 'interview'),
        ('scholars:lecture', 'lecture'),
        ('curriculum:lesson', 'lesson'),
        ('maps:geomap', 'map'),
        ('community:profile', 'profile'),
        ('resources:resourceset', 'resource set'),
        ('nolink', 'item not linked'),
    )
    DISPLAY_STATUS = (
        (0,'0 - not displayed'),
        (1,'1 - on list'),
        (2,'2 - one of three'),
        (3,'3 - banner'),
    )

    short_name = models.CharField(max_length=32)
    resource_locator = models.CharField(max_length=32, choices=RESOURCE_LOCATOR)
    display_status = models.IntegerField(default=0, choices=DISPLAY_STATUS)
    ordinal = models.IntegerField('Order in list', default=99)
    banner_blurb = models.CharField(max_length=255, blank=True, default='')
    banner_name = models.CharField(max_length=32, blank=True, default='')

    class Meta:
        ordering = ['-display_status', 'ordinal']

    # view retrieves banner item, tryptic and new_list accessed from that instance.

    # return list of the three featured items
    @property
    def tryptic_list(self):
        return Featured.objects.filter(display_status=2)

    # return list of other new items
    @property
    def new_list(self):
        return Featured.objects.filter(display_status=1)

    # return resource object title
    @property
    def resource_title(self):
        resource_locator_params = self.resource_locator.split(':')
        # use apps.get_model to get resource model
        # resource_locator_params[0] = app_name
        # resource_locator_params[1] = resource_locator
        ResourceModel = apps.get_model(app_label=resource_locator_params[0], 
            model_name=resource_locator_params[1].capitalize())
        # get title, that's all we need here
        o = ResourceModel.objects.get(short_name=self.short_name)
        return o.title

    # return resource object title
    @property
    def resource_type_title(self):
        resource_locator_params = self.resource_locator.split(':')
        # resource_locator_params[1] = resource_type
        # get Menu object
        menu = Menu.objects.get(short_name=resource_locator_params[1])
        return menu.title

    def __str__(self):
        return self.short_name
        

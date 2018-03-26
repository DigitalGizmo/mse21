from sitewide.models import Menu, Featured
from django.contrib import admin

class MenuAdmin(admin.ModelAdmin):
    fieldsets = [
	    (None, {'fields': ['short_name', 'main_nav_name', 'title', 'menu_blurb', 'has_icon']}),
	    ('Aside Box', {'fields': ['aside_blurb'], 
	        'classes': ['collapse']}),
    ]
    list_display = ('title', 'short_name', 'main_nav_name')

admin.site.register(Menu, MenuAdmin)


class FeaturedAdmin(admin.ModelAdmin):
    fieldsets = [
	    (None, {'fields': ['short_name', 'resource_locator', 'display_status', 'ordinal']}),
	    ('Banner', {'fields': ['banner_blurb', 'banner_name'], 
            'classes': ['collapse']}),
    ]
    list_display = ('short_name', 'resource_locator', 'display_status', 'ordinal')

admin.site.register(Featured, FeaturedAdmin)

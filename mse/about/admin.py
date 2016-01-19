from django.contrib import admin
from .models import Event, Scene, Single

class EventAdmin(admin.ModelAdmin):
	fieldsets = [
		(None,	{'fields': ['short_name', 'title', 'subtitle', 'start_date', 'end_date', 'time_details', 
			'location', 'cost', 'ordinal', 'on_home', 'description', 'details']}),
		('Contact',   {'fields': ['contact_name', 'contact_email', 'contact_phone']}),
	]
	list_display = ('title', 'short_name', 'start_date', 'location', 'on_home')

admin.site.register(Event, EventAdmin)


class SceneAdmin(admin.ModelAdmin):
	fieldsets = [
		(None,	{'fields': ['short_name', 'title', 'subtitle', 'posted', 'is_active',
			'narrative']}),
	]
	list_display = ('title', 'short_name', 'posted', 'is_active')

admin.site.register(Scene, SceneAdmin)


class SingleAdmin(admin.ModelAdmin):
	fieldsets = [
		(None,	{'fields': ['short_name', 'title', 'subtitle', 'narrative']}),
	]
	list_display = ('title', 'short_name', 'subtitle')

admin.site.register(Single, SingleAdmin)

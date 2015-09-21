from sitewide.models import Menu
from django.contrib import admin

class MenuAdmin(admin.ModelAdmin):
    fields = ['short_name', 'title', 'menu_blurb']
    list_display = ('short_name', 'title')

admin.site.register(Menu, MenuAdmin)

from sitewide.models import Menu
from django.contrib import admin

class MenuAdmin(admin.ModelAdmin):
    fields = ['short_name', 'title', 'menu_blurb', 'has_icon']
    list_display = ('short_name', 'title', 'has_icon')

admin.site.register(Menu, MenuAdmin)

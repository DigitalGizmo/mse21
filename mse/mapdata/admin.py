from django.contrib import admin
from .models import Voyage

# Register your models here.

# Fields that could eventually be calculated:
# 'lat_deg', 'lat_min', 'lat_sec', 'lat_ns', 'lon_deg', 'lon_min', 'lon_sec', 'lon_ew',
# 'barrel_yield', 'code_total',  'days_at_sea', 'running_total_oil'

class VoyageAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['voyageid', ('day', 'month', 'year'), ('lat', 'lon'), 
            ('struck_code', 'struck_quantity', 'struck_species'), 
            ('spotted_code', 'spotted_quantity', 'spotted_species'),
            ('gam_code', 'vessels_sighted', 'gam_description'), 
            ('weather_code', 'anchor_code', 'code_total'), 
            ('barrels_sperm_oil', 'barrels_train_oil', 'barrels_other_oil'), 
            ('barrel_yield','running_total_oil'),  
            ('logbook_page',  'bib_id', 'logbook_title'),
            'logbook_entry', 'weather_conditions']}),
        ('Not yet auto calculated',   {'fields': [('lat_deg', 'lat_min', 'lat_sec', 'lat_ns'), 
        	('lon_deg', 'lon_min', 'lon_sec', 'lon_ew'),	   
        	'days_at_sea']}),
        ('Legacy fields',   {'fields': ['date', 'dayofweek', 'boats_lowered',
        	'sailor_activities', 'second_mate_note', 'barrels_sperm_breakdown', 'location_estimated', 
        	'geo_references'], 'classes': ['collapse']}),
    ]
    list_display = ('voyageid', 'yr_mo_da', 'lat', 'lon', 'struck_code', 'spotted_code', 
        'gam_code', 'weather_code', 'anchor_code', 'code_total')
    list_filter	 = ['voyageid']

    def yr_mo_da(self, obj):
        return str(obj.year) + "-" + str(obj.month) + "-" + str(obj.day)

admin.site.register(Voyage, VoyageAdmin)


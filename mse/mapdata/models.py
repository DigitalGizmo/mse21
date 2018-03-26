from django.db import models


class Voyage(models.Model):
    voyageid = models.CharField(max_length=32)
    day = models.IntegerField()
    month = models.IntegerField()
    year = models.IntegerField()
    lat = models.FloatField()
    lon = models.FloatField()
    anchor_code = models.IntegerField(null=True, blank=True)
    weather_conditions = models.TextField(blank=True, default='')
    weather_code = models.IntegerField(null=True, blank=True)
    spotted_code = models.IntegerField(null=True, blank=True)
    spotted_quantity = models.IntegerField(null=True, blank=True)
    spotted_species = models.CharField(max_length=128, blank=True, default='')
    struck_code = models.IntegerField(null=True, blank=True)
    struck_quantity = models.IntegerField(null=True, blank=True)
    struck_species = models.CharField(max_length=64, blank=True, default='')
    barrels_sperm_oil = models.IntegerField(null=True, blank=True)
    barrels_train_oil = models.IntegerField(null=True, blank=True)
    barrels_other_oil = models.IntegerField(null=True, blank=True)
    barrel_yield = models.IntegerField(null=True, blank=True)
    running_total_oil = models.IntegerField(null=True, blank=True)
    gam_code = models.IntegerField(null=True, blank=True)
    vessels_sighted = models.CharField(max_length=32, blank=True, default='')
    gam_description = models.CharField(max_length=255, blank=True, default='')
    code_total = models.IntegerField(null=True, blank=True)
    logbook_title = models.CharField(max_length=255, blank=True, default='')
    logbook_entry = models.TextField(blank=True, default='')
    logbook_page = models.IntegerField(null=True, blank=True)
    bib_id = models.IntegerField(null=True, blank=True)

    # legacy fields
    date = models.DateField(null=True, blank=True)
    dayofweek = models.CharField(max_length=12, blank=True, default='')
    days_at_sea = models.IntegerField(null=True, blank=True)
    boats_lowered = models.CharField(max_length=32, blank=True, default='')
    sailor_activities = models.TextField(blank=True, default='')
    second_mate_note = models.CharField(max_length=255, blank=True, default='')
    barrels_sperm_breakdown = models.CharField(max_length=64, blank=True, default='')
    location_estimated = models.CharField(max_length=255, blank=True, default='')
    geo_references = models.CharField(max_length=255, blank=True, default='')
    lat_deg = models.IntegerField(null=True, blank=True)
    lat_min = models.IntegerField(null=True, blank=True)
    lat_sec = models.FloatField(null=True, blank=True)
    lat_ns = models.CharField(max_length=1, blank=True, default='')
    lon_deg = models.IntegerField(null=True, blank=True)
    lon_min = models.IntegerField(null=True, blank=True)
    lon_sec = models.FloatField(null=True, blank=True)
    lon_ew = models.CharField(max_length=1, blank=True, default='')

    class Meta:
        ordering = ['year', 'month', 'day']

    def __str__(self):
        return str(self.day) + "/" + str(self.month) + "/" + str(self.year)



from django.shortcuts import render
from django.http import JsonResponse
from .models import Voyage


def voyage_entries(request, voyageid):
    entries_queryset = Voyage.objects.filter(voyageid=voyageid)
    entries_values = list(entries_queryset.values())
    return JsonResponse(entries_values, safe=False)

def compare_voyage_entries(request, voyageid):
    entries_queryset = Voyage.objects.filter(voyageid=voyageid)
    entries_values = list(entries_queryset.values("lat", "lon"))
    return JsonResponse(entries_values, safe=False)

def voyage_year_entries(request, voyageid, year):
    entries_queryset = Voyage.objects.filter(voyageid=voyageid, year=year)
    entries_values = list(entries_queryset.values())
    return JsonResponse(entries_values, safe=False)

def voyage_year_mode_entries(request, voyageid, year, mode_col_name):
    # ref for variable column name: 
    # https://stackoverflow.com/questions/4720079/django-query-filter-with-variable-column
    modeFilter = mode_col_name + '__gt'
    entries_queryset = Voyage.objects.filter(voyageid=voyageid, year=year, **{modeFilter: 0}) 
    entries_values = list(entries_queryset.values())
    return JsonResponse(entries_values, safe=False)


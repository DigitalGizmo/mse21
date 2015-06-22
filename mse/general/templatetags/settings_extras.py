from django import template
from django.conf import settings

register = template.Library()

@register.assignment_tag
def is_production(parser):
    return settings.IS_PRODUCTION

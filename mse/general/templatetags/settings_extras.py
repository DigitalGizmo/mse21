from django import template
from django.conf import settings

register = template.Library()

@register.assignment_tag
def is_production(parser):
    return settings.IS_PRODUCTION

# use:
# {% is_production "" as show_production %}
# {% if show_production %}

# use: {% if foo|include_analytic %}
#@register.filter
#def include_analytic(value):
#    return True
    #return settings.INCLUDE_TRACKING

# settings value
#@register.simple_tag
#def settings_value(name):
#    return getattr(settings, name, "")
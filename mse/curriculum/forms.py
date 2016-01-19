from django import forms
from .models import Gradelevel, Subject

class LessonSearchForm(forms.Form):
    """
    Patterened after sitewide SearchForm
    choices defined by the Python values_list function
    """
    q = forms.CharField(max_length=100, required=False)

    page = forms.IntegerField(required=False)

    # get grade level list directly from the database
    gls = forms.MultipleChoiceField(
        choices = Gradelevel.objects.all().values_list('short_name', 
            'title').order_by('ordinal'),
        widget  = forms.CheckboxSelectMultiple,
        required=False,
    )

    # get subject list directly from the database
    sjs = forms.MultipleChoiceField(
        choices = Subject.objects.all().values_list('short_name', 
            'title').order_by('ordinal'),
        widget  = forms.CheckboxSelectMultiple,
        required=False,
    )

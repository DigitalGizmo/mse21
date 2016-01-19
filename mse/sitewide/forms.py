from django import forms

class SearchForm(forms.Form):
    """
    docstring for SearchForm
    """
    RESOURCE_TYPES = (
        ('m','Maps'),
        ('l','Lectures'),
        ('i','Interviews'),
        ('d','Documents'),
        ('a','Artifacts'),
    )
    q = forms.CharField(max_length=100, required=False)
    #q = forms.CharField(widget=forms.TextInput(attrs={'class': 'search-resources--field', 
        #'placeholder': 'Search resources', 'aria-label': 'Search'}))
    #q = forms.CharField(attrs={'class': 'search-resources--field', 'placeholder': 
        # 'Search resources', 'aria-label': 'Search'})

    #c = forms.CharField(widget=forms.TextInput(attrs={'size': '40'}))

    page = forms.IntegerField(required=False)
    
    rts = forms.MultipleChoiceField(
        choices = RESOURCE_TYPES,
        widget  = forms.CheckboxSelectMultiple,
        required=False,
    )

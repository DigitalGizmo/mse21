from django import forms

class ItemSearchForm(forms.Form):
    """
    Patterened after sitewide SearchForm
    """
    AUGMENTED_TYPES = (
        ('f','Augmented Item'),
        ('r','Record'),
        ('a','All'),
    )
    q = forms.CharField(max_length=100, required=False)
    
    page = forms.IntegerField(required=False)

    aug = forms.ChoiceField(
      choices = AUGMENTED_TYPES,
      widget  = forms.RadioSelect,
      required=False,
    )

    # show Status for Aside -- to know when we're coming from Arti/Doc menu
    sa = forms.CharField(max_length=2, required=False)

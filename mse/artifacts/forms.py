from django import forms
from artifacts.models import Question

class QuestionForm(forms.ModelForm):
    '''QuestionForm.  Used to size the text input boxes'''

    class Meta: 
        #widgets = { 'question_text': forms.Textarea(attrs={'rows':'2', 'cols': '60'})
        widgets = { 'question_text': forms.TextInput(attrs={'size': 160})
                   , 'question_num': forms.TextInput(attrs={'size': 2})
                 }
# examples of other form widgets: PasswordInput, HiddenInput, Select, DateInput, etc.
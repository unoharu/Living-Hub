from django import forms

from .models import Article


class ArticleForm(forms.ModelForm):
    class Meta:
        # どのモデルをフォームにするか指定
        model = Article
        # そのフォームの中から表示するフィールドを指定
        fields = ('title', 'comment', 'dashboard_picture')
        labels = {
            'title': '新しいタイトル',
            'comment': '新しいコメント',
            
        }
        widgets = {
            'title': forms.TextInput(attrs={'class': 'title-class'}),
            'comment': forms.Textarea(attrs={'class': 'comment-class'}),
        }


    # フォームを綺麗にするための記載
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['title'].widget.attrs['class'] = 'title-class'
        self.fields['comment'].widget.attrs['class'] = 'comment-class'
        
    def clean_title(self):
        title = self.cleaned_data.get('title')
        if not title:
            raise forms.ValidationError("タイトルを入力してください")
        return title

    def clean_comment(self):
        comment = self.cleaned_data.get('comment')
        if not comment:
            raise forms.ValidationError("本文を入力してください")
        return comment
    
    

from django.db import models
from accounts.models import User

class Article(models.Model):
    title = models.TextField(verbose_name='タイトル', max_length=50)
    comment = models.TextField(verbose_name='内容', max_length=1000)
    dashboard_picture = models.FileField(verbose_name='画像', upload_to='dashboard/', max_length=100, null=True, blank=True)
    created_at = models.DateTimeField('作成日時', auto_now_add=True)
    updated_at = models.DateTimeField('更新日時', auto_now=True)
    user = models.ForeignKey(User, verbose_name="送信者", on_delete=models.CASCADE)
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ('-created_at',)
        db_table = 'article'
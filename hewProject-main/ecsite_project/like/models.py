from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class Like(models.Model):
     property = models.ForeignKey('stores.Property', on_delete=models.CASCADE)
     like = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
     timestamp = models.DateTimeField(auto_now=True)

     class Meta:
         db_table = 'like'
         unique_together = [['property', 'like']]

class Review(models.Model):
    review_title = models.CharField(verbose_name='タイトル', max_length=100)
    review_content = models.CharField(verbose_name='内容', max_length=1000)
    rate = models.IntegerField(
        verbose_name='評価', 
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=3,  # デフォルト
    )
    created_at = models.DateTimeField('作成日時', auto_now_add=True)
    updated_at = models.DateTimeField('更新日時', auto_now=True) 
    property = models.ForeignKey(
        'stores.Property', on_delete=models.CASCADE
        )
    user = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE
        )
    
    def __str__(self):
        return f'{self.property.property_name}-{self.user.username}'
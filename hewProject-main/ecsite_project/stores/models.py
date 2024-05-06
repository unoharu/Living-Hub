from django.db import models
    
class PropertyType(models.Model):
    property_type = models.CharField(verbose_name='タイプ', max_length=1000)

    class Meta:
        db_table = 'property_type'

    def __str__(self):
        return self.property_type 

class Ward(models.Model):
    ward_name = models.CharField(verbose_name='区名', max_length=20)

    class Meta:
        db_table = 'ward'

    def __str__(self):
        return self.ward_name 



class Property(models.Model):
    property_name = models.CharField(verbose_name='物件名', max_length=100)
    address = models.CharField(verbose_name='住所', max_length=100)
    deposit_key_money = models.CharField(verbose_name='敷金/礼金', max_length=20)
    year_built = models.IntegerField(verbose_name='築年数')
    phone_number = models.CharField(verbose_name='電話番号', max_length=20)
    picture_url = models.FileField(verbose_name='トップ画像',upload_to="property_main/", default="/media/layout_img/no-img.png", max_length=100)
    station = models.CharField(verbose_name='沿線',max_length=1000)
    walk_minute = models.IntegerField(verbose_name='徒歩')
    created_at = models.DateTimeField(verbose_name='作成日時', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='更新日時', auto_now=True)
    property_type = models.ForeignKey(PropertyType, verbose_name='物件の種類', on_delete=models.CASCADE)
    ward = models.ForeignKey(Ward, verbose_name='区', on_delete=models.CASCADE)
    class Meta:
        db_table = 'property'

    def __str__(self):
        return self.property_name
    

class Condition(models.Model):
    condition = models.CharField(verbose_name='条件', max_length=50)
    property = models.ForeignKey(Property, verbose_name='物件', on_delete=models.CASCADE)
    class Meta:
        db_table = 'condition'

    def __str__(self):
        return f'{self.property.property_name}-{self.id}'


class PropertyDetail(models.Model):
    layout = models.CharField(verbose_name='間取り', max_length=100)
    layout_img = models.FileField(
        upload_to='layout_img/',
        default='/media/layout_img/no-img.png'
        )
    area = models.IntegerField(verbose_name='面積')
    rent = models.IntegerField(verbose_name='賃料')
    credit = models.BooleanField(verbose_name='クレジット決済', default=True, help_text='否の場合False')
    management_fee = models.IntegerField(verbose_name='管理費')
    floor = models.IntegerField(verbose_name='階')
    room_number = models.IntegerField(verbose_name='部屋番号')
    position = models.CharField(verbose_name='位置', max_length=50)
    remarks = models.CharField(verbose_name='備考', max_length=1000)
    property_tour_url = models.URLField(verbose_name='内見', max_length=200)
    purchase_status = models.BooleanField(verbose_name='契約状況', default=True, help_text='契約済ならFalse')
    parking_flg = models.BooleanField(verbose_name='駐車場有無情報', default=True, help_text='否の場合False')
    pet_flg = models.BooleanField(verbose_name='ペット可否情報', default=True, help_text='否の場合False')
    created_at = models.DateTimeField('作成日時', auto_now_add=True)
    updated_at = models.DateTimeField('更新日時', auto_now=True)
    property = models.ForeignKey(
        Property, verbose_name='物件', on_delete=models.CASCADE
        )
    
    class Meta:
        db_table = 'property_detail'

    def __str__(self):
        return f'{self.property.property_name}-{self.room_number}'
    
class PropertyPicture(models.Model):
    picture = models.FileField(
        upload_to='property_detail_picture/'
        )
    property_detail = models.ForeignKey(
        PropertyDetail, on_delete=models.CASCADE
    )
    order = models.IntegerField()

    class Meta:
        db_table = 'property_detail_picture'
        ordering = ['order']

    def __str__(self):
        return f'{self.property_detail.property}-image{str(self.order)}'


class Bathroom(models.Model):
    bathroom = models.CharField(verbose_name='バス・トイレ', max_length=100)
    property_detail = models.ForeignKey(
        PropertyDetail, on_delete=models.CASCADE
    )

    class Meta:
        db_table = 'bathroom'

    def __str__(self):
        return self.bathroom


class Kitchen(models.Model):
    kitchen = models.CharField(verbose_name='キッチン', max_length=100)
    property_detail = models.ForeignKey(
        PropertyDetail, on_delete=models.CASCADE
    )
    class Meta:
        db_table = 'kitchen'

    def __str__(self):
        return self.kitchen

class Service(models.Model):
    service = models.CharField(verbose_name='設備・サービス', max_length=100)
    property_detail = models.ForeignKey(
        PropertyDetail, on_delete=models.CASCADE
    )
    class Meta:
        db_table = 'service'

    def __str__(self):
        return self.service

class Other(models.Model):
    other = models.CharField(verbose_name='その他', max_length=100)
    property_detail = models.ForeignKey(
        PropertyDetail, on_delete=models.CASCADE
    )
    class Meta:
        db_table = 'other'

    def __str__(self):
        return self.other
    

class PropertyPicture(models.Model):
    picture = models.FileField(
        upload_to='property_detail_picture/'
        )
    property_detail = models.ForeignKey(
        PropertyDetail, on_delete=models.CASCADE
    )
    order = models.IntegerField()

    class Meta:
        db_table = 'property_detail_picture'
        ordering = ['order']

    def __str__(self):
        return f'{self.property_detail.property}-image{str(self.order)}'


from django.contrib import admin
from .models import (
    PropertyType, Ward, Property, Bathroom, Kitchen, Service, Other, PropertyDetail, PropertyPicture, Condition
)

admin.site.register(
    [PropertyType, Ward, Property, Bathroom, Kitchen, Service, Other, PropertyDetail, PropertyPicture, Condition]
)
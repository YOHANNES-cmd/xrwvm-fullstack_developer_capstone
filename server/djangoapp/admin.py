# from django.contrib import admin
# from .models import related models


# Register your models here.

# CarModelInline class

# CarModelAdmin class

# CarMakeAdmin class with CarModelInline

# Register models here
from django.contrib import admin
from .models import CarMake, CarModel

# CarModelInline class to allow editing models inline on the CarMake admin panel page
class CarModelInline(admin.TabularInline):
    model = CarModel
    extra = 1

# CarMakeAdmin class with CarModelInline
class CarMakeAdmin(admin.ModelAdmin):
    fields = ['name', 'description', 'country_of_origin']
    inlines = [CarModelInline]
    list_display = ('name', 'country_of_origin')

# CarModelAdmin class
class CarModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'car_make', 'type', 'year', 'dealer_id')
    list_filter = ['type', 'year', 'car_make']
    search_fields = ['name', 'car_make__name']

# Register models on the admin site
admin.site.register(CarMake, CarMakeAdmin)
admin.site.register(CarModel, CarModelAdmin)

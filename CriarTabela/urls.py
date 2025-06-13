from django.urls import path
from .views import CreateCustomTableView, DynamicDataAPI, TableSchemaAPI, ListTablesAPI, TableDataAPI

urlpatterns = [
    path('tables/create/', CreateCustomTableView.as_view(), name='create-custom-table'),
    path('data/<str:table_name>/', DynamicDataAPI.as_view(), name='dynamic-data-api'),
    path('tables/schema/<str:table_name>/', TableSchemaAPI.as_view(), name='table-schema-api'),
    path('tables/', ListTablesAPI.as_view(), name='list-tables'),
    path('tables/<str:table_name>/data/', TableDataAPI.as_view(), name='table-data'),

]
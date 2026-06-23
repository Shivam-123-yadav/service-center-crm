from django.urls import path

from .views import (
    CustomerListCreateAPIView,
    CustomerRetriveUpdateDestroyAPIView,
)

urlpatterns = [
    path(
        "",
        CustomerListCreateAPIView.as_view()
    ),
    path(
        "<int:pk>/",
        CustomerRetriveUpdateDestroyAPIView.as_view()
    ),
]

from django.shortcuts import render

# Create your views here.


from rest_framework import generics

from .models import Customer
from .serializers import CustomerSerializer


class CustomerListCreateAPIView(
    generics.ListCreateAPIView
):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    
    
class CustomerRetriveUpdateDestroyAPIView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Customer.objects.all()
    
    serializer_class = CustomerSerializer
    
    
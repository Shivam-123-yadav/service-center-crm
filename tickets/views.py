from django.shortcuts import render
from rest_framework import generics
from .models import Ticket
from .serializers import TicketSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import (
    SearchFilter,
    OrderingFilter
)
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import BasePermission


from .permissions import ti




class TicketListCreateAPIView(
    generics.ListCreateAPIView
):
    queryset = Ticket.objects.select_related(
        "customer",
        "assigned_to"
    )
    serializer_class = TicketSerializer
    
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter
    ]
    
    filterset_fields=[
        "status",
        "priority"
    ]
    
    search_fields=[
        "title",
        "discription"
    ]
    
    ordering_fields=[
        "created_at",
        "priority"
    ]
    
class TicketRetrieveUpdateDestroyAPIView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Ticket.objects.all()
    
    serializer_class = TicketSerializer
    
    
class TicketViewSet(ModelViewSet):
    
    
    serializer_class = TicketSerializer
    
    def get_queryset(self):
        
        user = self.request.user
        
        if user.role == "admin":
            
            return Ticket.objects.select_related(
                "customer",
                "assigned_to"
            )
            
        if user.role == "technician":
            return Ticket.objects.filter(
                assigned_to=user
            ).select_related(
                "customer",
                "assigned_to"
            )
            
        if user.role == "customer":
            
            return Ticket.objects.filter(
                customer__user=user
            ).select_related(
                "customer",
                "assigned_to"
            )
            
        return Ticket.objects.none()
    

class TicketPermission(BasePermission):
    
    def has_permission(self, request, view):
        
        
        if request.user.role == "admin":
            return True
        
        if request.user.role == "customer":
            
            if request.method in [
                "GET",
                "POST"
            ]:
                return True
            
        
        if request.user.role == "technician":
            
            if request.method in [
                "GET",
                "PUT",
                "PATCH"
            ]:
                return True
        return False
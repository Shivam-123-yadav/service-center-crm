from rest_framework import serializers
from .models import Ticket

class TicketSerializer(serializers.ModelSerializer):
    
    customer_name = serializers.CharField(
        source = "customer.name",
        read_only=True
    )
    
    technician_name = serializers.CharField(
        source = "assigned_to.username",
        read_only=True
    )
    
    class Meta:
        model = Ticket
        
        fields = "__all__"
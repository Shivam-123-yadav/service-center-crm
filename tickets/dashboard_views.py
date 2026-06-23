from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Ticket
from django.db.models import Count

class DashboardAPIView(APIView):
    
    def get(self, request):
        
        data = {
            "total_tickets":
                Ticket.objects.count(),
                
            "open_tickets":
                Ticket.objects.filter(
                    status="open"
                ).count(),
                
            "closed_tickets":
                Ticket.objects.filter(
                    status="closed"
                ).count(),
                
            "high_priority_tickets":
                Ticket.objects.filter(
                    priority = "high"
                ).count(),
        }
        
        return Response(data)
    
    
class TechnicianStateAPIView(APIView):
    
    def get(self, request):
        data = (
            Ticket.objects.values(
                "assigned_to__username"
            )
            .annotate(
                total_ticket = Count("id")
            )
        )
        return Response(data)
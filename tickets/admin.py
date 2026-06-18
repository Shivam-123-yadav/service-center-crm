from django.contrib import admin

# Register your models here.
from .models import Ticket

@admin.register(Ticket)

class TicketAdmin(admin.ModelAdmin):
    
    list_display = (
        "id",
        "title",
        "customer",
        "assigned_to",
        "priority",
        "status"
    )
    
    list_filter = (
        "status",
        "priority"
    )
    
    search_fields = (
        "title",
    )
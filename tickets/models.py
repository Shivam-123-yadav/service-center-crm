from django.db import models

# Create your models here.
from common.models import BaseModel
from customers.models import Customer
from accounts.models import User

STATUS_CHOICES = [
    ("open", "Open"),
    ("in_progress", "In Progress"),
    ("closed", "Closed"),
]

PRIORITY_CHOICES = [
    ("low", "Low"),
    ("medium", "Medium"),
    ("high", "High"),
]


class Ticket(BaseModel):
    
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="tickets"
    )
    
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_tickets"
    )
    
    title = models.CharField(max_length=255, db_index=True)
    
    discription = models.TextField()
    
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default="medium",
        db_index=True
    )
    
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="open",
        db_index=True
    )
    
    def __str__(self):
        return f"{self.id} - {self.title}"
from django.db import models
from common.models import BaseModel
from django.conf import settings
# Create your models here.


class Customer(BaseModel):
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="customer_profile",
        null=True,
        blank=True
    )
    
    name = models.CharField(max_length=100)
    
    phone = models.CharField(
        max_length=15,
        unique=True
    )
    
    email = models.EmailField(
        blank=True,
        null=True
    )
    
    address = models.TextField(
        blank=True,
        null=True
    )
    
    def __str__(self):
        return self.name
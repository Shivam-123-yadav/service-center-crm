from django.db import models
from common.models import BaseModel
# Create your models here.


class Customer(BaseModel):
    
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
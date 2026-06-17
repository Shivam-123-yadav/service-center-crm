from django.contrib.auth.models import AbstractUser
from django.db import models
from common.models import BaseModel


class User(BaseModel, AbstractUser):

    ADMIN = "admin"
    TECHNICIAN = "technician"
    CUSTOMER = "customer"

    ROLE_CHOICES = [
        (ADMIN, "Admin"),
        (TECHNICIAN, "Technician"),
        (CUSTOMER, "Customer"),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=CUSTOMER
    )

    phone = models.CharField(
        max_length=15,
        blank=True,
        null=True
    )

    def __str__(self):
        return self.username
    
    
@property
def is_admin(self):
    return self.role == self.ADMIN


@property
def is_technician(self):
    return self.role == self.TECHNICIAN


@property
def is_customer(self):
    return self.role == self.CUSTOMER    
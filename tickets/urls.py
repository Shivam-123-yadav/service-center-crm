from django.urls import path

from .views import(
    TicketListCreateAPIView,
    TicketRetrieveUpdateDestroyAPIView,
    
)

from .dashboard_views import(
    DashboardAPIView,
    TechnicianStateAPIView,
)

urlpatterns = [
    path("",TicketListCreateAPIView.as_view()),
    path("dashboard/", DashboardAPIView.as_view()),
    path("<int:pk>/", TicketRetrieveUpdateDestroyAPIView.as_view()),
    path("technician-stats/", TechnicianStateAPIView.as_view()),
]

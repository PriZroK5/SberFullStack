from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('reviews/', ReviewListCreateView.as_view(), name='reviews'),
    path('send-email/', SendEmailView.as_view(), name='send_email'),
    path('coworking/booking/', CoworkingBookingView.as_view(), name='coworking_booking'),
]

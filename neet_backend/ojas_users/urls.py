from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('profile/', views.get_profile, name='profile'),
    path('logout/', views.logout, name='logout'),
    path('change-password/', views.change_password, name='change_password'),
    path('home-leave-requests/', views.home_leave_requests, name='home_leave_requests'),
    path('parent-visit-requests/', views.parent_visit_requests, name='parent_visit_requests'),
    path('notices/', views.notices, name='notices'),
    path('enquiry/', views.submit_enquiry, name='enquiry'),
]
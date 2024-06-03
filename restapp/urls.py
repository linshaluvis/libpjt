from django.urls import path,include
from . import views
from .views import userview
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, CategoryViewSet
from .views import UserInfoView,profile_view


# Initialize the router and register the viewsets
router = DefaultRouter()
router.register(r'books', BookViewSet)
router.register(r'categories', CategoryViewSet)


urlpatterns = [
    path('',views.home,name='home'),
    path('post_data',views.post_data,name='post_data'),
    path('delete',views.delete_data,name='delete'),
    path('class',userview.as_view(),name='classbased'),
    path('class/<int:id>',userview.as_view(),name='classdelete'),
    path('register',views.register,name='register'),
    path('loginview',views.loginview,name='loginview'),
    path('get_data',views.get_data,name='get_data'),
    path('logout/', views.logout_view, name='logout'),
    path('create_category/', views.create_category, name='create_category'),
    path('add_book/',views.add_book, name='add_book'),
    path('get_categories/', views.get_categories, name='get_categories'),
    path('memberreg/', views.memberreg, name='memberreg'),
    path('api/', include(router.urls)),
    path('api/books/<int:pk>/', views.delete_book, name='delete_book'),
    path('memberdetails',views.memberdetails,name='memberdetails'),
    path('buy_book/<int:book_id>/', views.buy_book, name='buy_book'),
    path('api/user-info/', UserInfoView.as_view(), name='user_info'),
    path('profileapi/', views.profile_api, name='profileapi'),
    path('profile/', views.profile_view, name='profile-edit'),













]


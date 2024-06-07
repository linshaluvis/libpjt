from django.urls import path,include
from . import views
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
    # path('class',userview.as_view(),name='classbased'),
    # path('class/<int:id>',userview.as_view(),name='classdelete'),
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
     path('api/cart-items/', views.cart_items, name='cart_items'),
    path('api/cart/increase/<int:book_id>/', views.increase_quantity, name='increase_quantity'),
    path('api/cart/decrease/<int:book_id>/', views.decrease_quantity, name='decrease_quantity'),
    path('api/cart/remove/<int:item_id>/', views.remove_item, name='remove_item'),
     path('check_phone_number/', views.checkPhoneNumber, name='check_phone_number'),
    path('check_username/', views.checkUserName, name='check_username'),
    path('update_password/', views.updatePassword, name='update_password'),
    path('checkout/', views.checkout, name='checkout'),
    path('checkout_success/', views.checkout_success, name='checkout_success'),
    path('borrow_book/<int:book_id>/', views.borrow_book, name='borrow_book'),
    path('borrow_details/', views.borrow_details, name='borrow_details'),
    path('return_book/<int:pk>/', views.return_book, name='return_book'),
    path('mark_book_missing/<int:pk>/', views.mark_book_missing, name='mark_book_missing'),
    path('borrow_admin/', views.borrow_admin, name='borrow_admin'),
    path('order_data/', views.order_data, name='order_data'),
    path('overdue_books/', views.overdue_books_view, name='overdue_books'),
    path('overdue_booksUser/', views.overdue_booksUser, name='overdue_booksUser'),
    path('userorder/', views.userorder, name='userorder'),

    























]


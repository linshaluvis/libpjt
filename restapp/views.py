from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from . models import*
from .serializers import restserializer,userserializer,loginserializer,CategorySerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate,login
from rest_framework import permissions
from rest_framework.permissions import AllowAny,IsAdminUser,IsAuthenticated
from rest_framework import status
from .serializers import BookSerializer
from .serializers import MemberSerializer,BookuserSerializer,BorrowerSerializer,userinfoserializer
from .serializers import CartItemSerializer,MemberuserSerializer
from django.conf import settings
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import  authentication_classes
from django.shortcuts import get_object_or_404
from .models import CustomUser
from django.core.mail import send_mail
import logging









@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_data(request):
    user = restapi.objects.all()
    u = restserializer(user,many=True)
    return Response(u.data)
    


# Create your views here.

class userview(APIView):
    permission_classes =[AllowAny]
    def get(self,request):
        user = restapi.objects.all()
        u = restserializer(user,many=True)
        return Response(u.data)
    def post(self,request):
        serialiser = restserializer(data=request.data)
        if serialiser.is_valid():
            serialiser.save()
            return Response(serialiser.data)
        else:
            return Response(serialiser.errors)
        
    def delete(self,request,id):
        if id:
            user = restapi.objects.get(id=id)
            user.delete()
            return JsonResponse({"data":"data deleted"})
        else:
            return JsonResponse({"error":"no such data"})
        
    def put(self,request,id):
        if id :
            user = restapi.objects.get(id=id)
            serialiser = restserializer(data=request.data)
            if serialiser.is_valid():
                user.name = request.data.get('name')
                user.age = request.data.get('age')
                user.course = request.data.get('course')
                user.save()
                return Response(serialiser.data)
            else:
                return Response(serialiser.errors)






@api_view(['GET'])
def home(request):
    user = restapi.objects.all()
    serialiser = restserializer(user,many=True)
    #arr = []
    #for i in user:
    #    username = [{'name':i.name}]
    #    arr.append(username)
    return Response(serialiser.data)
@api_view(['POST'])
def post_data(request):
    serialiser = restserializer(data=request.data)
    if serialiser.is_valid():
        serialiser.save()
    return Response(serialiser.data)

@api_view(['DELETE'])
def delete_data(request):
    id = request.GET.get('id')
    if id:
        user = restapi.objects.get(id=1)
        user.delete()
        return JsonResponse({"data":'data deleted'})
    else:
        return JsonResponse({"error":'give id as param'})
    

@api_view(['POST'])
def register(request):
    serialiser = userserializer(data=request.data)
    if serialiser.is_valid():
            user = CustomUser.objects.create_user(username = request.data.get('username'),password = request.data.get('password'))
            token = Token.objects.create(user=user)
            print(token)
            return Response(serialiser.data)
    else:
            return Response(serialiser.errors)
from django.contrib.auth.backends import ModelBackend
       

from django.contrib.auth.hashers import check_password


@api_view(['POST'])
def loginview(request):
    serializer = loginserializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data.get('username')
        password = serializer.validated_data.get('password')
        
        if not username or not password:
            return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Debugging information
        try:
            user = CustomUser.objects.get(username=username)
            print(f"User found in database: {user}")
            is_password_correct = check_password(password, user.password)
            print(f"Password correct: {is_password_correct}")
            
            if not is_password_correct:
                return JsonResponse({'error': 'Incorrect password'}, status=status.HTTP_401_UNAUTHORIZED)
            
            user = authenticate(username=username, password=password)
            # user = CustomUser.objects.get(username=username)

            print(f"Authenticated user: {user}")
            
            if user is not None:
                role = 'admin' if user.is_superuser else 'user'
                token, created = Token.objects.get_or_create(user=user)
                print(f"Role: {role}, Token: {token}")
                return JsonResponse({'role': role, 'token': token.key}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({'error': 'Authentication failed'}, status=status.HTTP_401_UNAUTHORIZED)
        except CustomUser.DoesNotExist:
            print("User not found in database")
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return JsonResponse({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_view(request):
    return JsonResponse({'status': 'success', 'message': 'Logged out successfully'})


@api_view(['POST'])
def create_category(request):
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, parser_classes


@api_view(['GET'])
def get_categories(request):
    categories = category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def add_book(request):
    serializer = BookSerializer(data=request.data)
    print(request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    # Log detailed error messages
    print(serializer.errors)  # or use logging
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

import random
@parser_classes([MultiPartParser, FormParser])
@permission_classes([IsAuthenticated])
def approve_disapprove_user(request):
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        print(user_id)
        action = request.POST.get('action')
        print(action)
        
        try:
            user = CustomUser.objects.get( id=user_id)
            print(user)
            user_member = member.objects.get(user=user)
            print(user_member)

            if action == 'approve':
                password = str(random.randint(100000, 999999))
                user.set_password(password)
                user.is_active = True
                user.save()

                subject = 'Your account has been approved'
                message = (
                    f'Hello {user.first_name},\n\n'
                    f'Your account has been approved.\n'
                    f'Username: {user.username}\n'
                    f'Password: {password}\n\n'
                    f'Thank you.'
                )
                send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email])
                return JsonResponse({'status': 'success', 'message': f'{user.username} has been approved'})

            elif action == 'disapprove':
                user_member.delete()
                user.delete()

                subject = 'Your account has been rejected'
                message = 'Your account request has been rejected.\nThank you.'
                send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email])
                return JsonResponse({'status': 'success', 'message': f'{user.username} has been disapproved'})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': 'An error occurred while processing your request.'}, status=500)

    else:
        pending_members = member.objects.filter(user__is_active=False)
        approved_members = member.objects.filter(user__is_active=True)
        
        # Placeholder for overdue books logic

        pending_members_data = [
            {
                'id': mem.id,
                'username': mem.user.username,
                'first_name': mem.user.first_name,
                'last_name': mem.user.last_name,
                'email': mem.user.email
            }
            for mem in pending_members
        ]
        
        approved_members_data = [
            {
                'id': mem.id,
                'username': mem.user.username,
                'first_name': mem.user.first_name,
                'last_name': mem.user.last_name,
                'email': mem.user.email
            }
            for mem in approved_members
        ]

        return JsonResponse({
            'pending_members': pending_members_data,
            'pending_count': len(pending_members_data),
            'approved_members': approved_members_data,
        })
        

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_disapprove_mail(request, user_id):
    try:
        action = request.data.get('action')  # Using request.data to handle JSON request body
        print(action)
        print(user_id)
        user = CustomUser.objects.get(id=user_id)
        user_member = member.objects.get(user=user)
        # user_member = member.objects.get(id=user_id)
        # user=user_member.user

        
        print(user)
        print(user_member)

        if action == 'approve':
            # Generate a random password for the user
            password = str(random.randint(100000, 999999))
            user.set_password(password)
            user.is_active = True
            user.save()

            # Send approval email
            subject = 'Your account has been approved'
            message = (
                f'Hello {user.first_name},\n\n'
                f'Your account has been approved.\n'
                f'Username: {user.username}\n'
                f'Password: {password}\n\n'
                f'Thank you.'
            )
            send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email])

            return JsonResponse({'status': 'success', 'message': f'{user.username} has been approved'})

        elif action == 'disapprove':
            # Delete the user and related member
            user_member.delete()
            user.delete()

            # Send disapproval email
            subject = 'Your account has been rejected'
            message = 'Your account request has been rejected.\nThank you.'
            send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email])

            return JsonResponse({'status': 'success', 'message': f'{user.username} has been disapproved'})

        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid action.'}, status=400)

    except CustomUser.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found.'}, status=404)
    except member.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Member not found.'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': 'An error occurred while processing your request.'}, status=500)

   

# @api_view(['POST'])
# @parser_classes([MultiPartParser, FormParser])
# def memberreg(request):
#     serializer = MemberSerializer(data=request.data)
#     print(request.data)
#     if serializer.is_valid():
#         member_instance = serializer.save()
#         # Create token for the user
#         token, created = Token.objects.get_or_create(user=member_instance.user)
#         response_data = serializer.data
#         response_data['token'] = token.key  # Include the token in the response
#         return Response(response_data, status=status.HTTP_201_CREATED)
#     else:
#         print(serializer.errors)  # Print validation errors to console for debugging
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# views.py

from django.core.validators import validate_email
from django.core.exceptions import ValidationError

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def memberreg(request):
    data = request.data

    user_data = {
        'first_name': data.get('user.first_name'),
        'last_name': data.get('user.last_name'),
        'username': data.get('user.username'),
        'email': data.get('user.email'),
    }
    print(user_data)

    number = data.get('number')
    img = data.get('mebimage')
    print(img)

    # Validate contact number
    if len(number) != 10 or not number.isdigit():
        return Response({'error': 'Contact number must be 10 digits.'}, status=status.HTTP_400_BAD_REQUEST)

    # Validate email
    try:
        validate_email(user_data['email'])
        if '.com' not in user_data['email']:
            raise ValidationError("Email must contain .com")
    except ValidationError:
        return Response({'error': 'Invalid email address. Email must contain .com'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if email already exists
    if CustomUser.objects.filter(email=user_data['email']).exists():
        print("email checked")
        return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if username already exists
    if CustomUser.objects.filter(username=user_data['username']).exists():
        print("username")
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if phone number already exists
    if member.objects.filter(number=number).exists():
        return Response({'error': 'Phone number already exists'}, status=status.HTTP_400_BAD_REQUEST)

    # Create user and member instances
    serializer = MemberSerializer(data={
        'user': user_data,
        'number': number,
        'mebimage': img,
    })

    if serializer.is_valid():
        member_instance = serializer.save()
        # Create token for the user
        token, created = Token.objects.get_or_create(user=member_instance.user)
        response_data = serializer.data
        response_data['token'] = token.key  # Include the token in the response
        return Response(response_data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class BookViewSet(viewsets.ModelViewSet):
    queryset = book.objects.all()
    serializer_class = BookuserSerializer
    parser_classes = (MultiPartParser, FormParser)

    @action(detail=True, methods=['get', 'put'])
    @permission_classes([IsAuthenticated])  # Ensure only authenticated users can access this action
    # @authentication_classes([TokenAuthentication])

    def edit(self, request, pk=None):
        book_instance = get_object_or_404(book, pk=pk)
        if request.method == 'GET':
            serializer = BookSerializer(book_instance)
            categories = category.objects.all()
            category_serializer = CategorySerializer(categories, many=True)
            return Response({
                'book': serializer.data,
                'categories': category_serializer.data
            })
        elif request.method == 'PUT':
            serializer = BookSerializer(book_instance, data=request.data)
            print(request.data)
            print(book_instance)
            if serializer.is_valid():
                serializer.save()
                print(serializer.data)
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = category.objects.all()
    serializer_class = CategorySerializer
    

@api_view(['DELETE'])
def delete_book(request, pk):
    
    book = book.objects.get(pk=pk)
    book.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def memberdetails(request):
    members = member.objects.all()
    serializer = MemberSerializer(members, many=True)
    print(serializer.data)
    return JsonResponse(serializer.data, safe=False)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def buy_book(request, book_id):
    try:
        Book = book.objects.get(id=book_id)
        if Book.stock > 0:
            serializer = CartItemSerializer(data={'book': Book.id}, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Book added to cart successfully!'}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Book is out of stock!'}, status=status.HTTP_400_BAD_REQUEST)
    except book.DoesNotExist:
        return Response({'error': 'Book not found!'}, status=status.HTTP_404_NOT_FOUND)


class UserInfoView(APIView):
    authentication_classes = [ TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        logging.info(f"User: {user}")
        logging.info(f"Is Authenticated: {user.is_authenticated}")
        logging.info(f"Authentication: {request.auth}")
        if user.is_authenticated:
            serializer = userinfoserializer(user)
            return Response(serializer.data)
        else:
            return Response({"detail": "Authentication credentials were not provided."}, status=401)
   
logger = logging.getLogger(__name__)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile_api(request):
    current_user = request.user
    logger.info(f"Authenticated user: {current_user}")
    if not request.user.is_authenticated:
        return Response({'error': 'User is not authenticated'}, status=401)

    try:
        member_instance = member.objects.get(user=current_user)
        logger.info(f"Member found: {member_instance}")
    except member.DoesNotExist:
        logger.error("Member not found")
        return Response({'error': 'Member not found'}, status=404)

    member_serializer = MemberSerializer(member_instance)
    books = book.objects.all()
    books_serializer = BookSerializer(books, many=True)
    categories = category.objects.all()
    categories_serializer = CategorySerializer(categories, many=True)

    logger.debug(f"Member data: {member_serializer.data}")
    logger.debug(f"Books data: {books_serializer.data}")
    logger.debug(f"Categories data: {categories_serializer.data}")

    return Response({
        'member': member_serializer.data,
        'books': books_serializer.data,
        'categories': categories_serializer.data,
    })




@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def profile_view(request):
    try:
        member_instance = member.objects.get(user=request.user)
    except member.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = MemberuserSerializer(member_instance)
        return Response(serializer.data)

    elif request.method == 'PUT':
        member_data = request.data
        user = request.user
        member_data = request.data

        # Update CustomUser fields
        user.first_name = member_data.get('first_name', user.first_name)
        user.last_name = member_data.get('last_name', user.last_name)
        user.email = member_data.get('email', user.email)
        user.save()

        serializer = MemberuserSerializer(member_instance, data=member_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            print(serializer.data)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@permission_classes([IsAuthenticated])
    
def cart_items(request):
    cart_items = cartitem.objects.all()
    total_price = sum(item.book.price * item.quantity for item in cart_items)
    items = [
        {
            'id': item.id,
            'book': {
                'id': item.book.id,
                'name': item.book.book,
                'price': item.book.price,
                'image': item.book.image.url if item.book.image else None
            },
            'quantity': item.quantity
        }
        for item in cart_items
    ]
    return JsonResponse({'items': items, 'total_price': total_price})

@permission_classes([IsAuthenticated])
@api_view(['POST'])  # Using POST for increase and decrease quantity
def increase_quantity(request, book_id):
    try:
        cart_item = cartitem.objects.get(id=book_id)
        cart_item.quantity += 1
        cart_item.save()
        return Response({"message": "Quantity increased", "quantity": cart_item.quantity}, status=200)
    except cartitem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

@permission_classes([IsAuthenticated])
@api_view(['POST'])  # Using POST for increase and decrease quantity
def decrease_quantity(request, book_id):
    try:
        cart_item = cartitem.objects.get(id=book_id)
        if cart_item.quantity > 1:
            cart_item.quantity -= 1
            cart_item.save()
            return Response({"message": "Quantity decreased", "quantity": cart_item.quantity}, status=200)
        else:
            return Response({"message": "Quantity cannot be less than 1"}, status=400)
    except cartitem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)
@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
def remove_item(request, item_id):
    cart_item = cartitem.objects.get(id=item_id)

    cart_item.delete()
    return cart_items(request)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def checkout(request):
    user1 = request.user
    cart_items = cartitem.objects.filter(user=user1)

    order_details = []
    for cart_item in cart_items:
        order_instance = order.objects.create(
            book=cart_item.book,
            quantity=cart_item.quantity,
            user=user1,
        )
        order_details.append({
            'book_name': cart_item.book.book,  # Assuming book has a title field
            'quantity': cart_item.quantity,
        })
    cart_items.delete()
    email_subject = 'Order Confirmation'
    email_body = 'Dear {},\n\nThank you for your order. Here are the details of your purchase:\n\n'.format(user1.username)
    for item in order_details:
        email_body += 'Book: {}\nQuantity: {}\n\n'.format(item['book_name'], item['quantity'])
    email_body += 'Thank you for shopping with us!\n\nBest regards,\nYour Bookstore Team'

    # Send email
    send_mail(
        email_subject,
        email_body,
        settings.DEFAULT_FROM_EMAIL,
        [user1.email],
        fail_silently=False,
    )


    return JsonResponse({'status': 'success'}, status=200)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def checkout_success(request):
    user1 = request.user
    user_orders = order.objects.filter(user=user1)
    
    # subject = "Order Confirmation"
    # message = f"Hello {user1.first_name},\n\nYour order has been placed successfully.\n\n"
    
    # for order_obj in user_orders:
    #     message += f"Book: {order_obj.book.book}\nQuantity: {order_obj.quantity}\n\n"
    
    # send_mail(subject, message, settings.EMAIL_HOST_USER, [user1.email])
    
    return JsonResponse({'status': 'success', 'user_orders': list(user_orders.values())}, status=200)
@api_view(['POST'])
def checkUserName(request):
    if request.method == 'POST':
        uname = request.data['userName']
        if CustomUser.objects.filter(username = uname).exists():
            return Response({'status':True, 'is_exists': True, 'message':'Username already Exists.!'})
        else:
            return Response({'status':True, 'is_exists': False, 'message':''})

@api_view(['POST'])
def checkPhoneNumber(request):
    if request.method == 'POST':
        phn = request.data['mobile']
        if member.objects.filter(number__iexact = phn).exists():
            return Response({'status':True, 'is_exists': True, 'message':'Mobile No. already Exists.!'})
        else:
            return Response({'status':True, 'is_exists': False, 'message':''})
@api_view(['POST'])
def updatePassword(request):
    if request.method == 'POST':
        uName = request.data['username']

        if not CustomUser.objects.filter(username = uName).exists():
            return Response({'status':False, 'message':'Username not found.!'},status=status.HTTP_404_NOT_FOUND)
        else:
            user = CustomUser.objects.get(username = uName)
            pas = request.data['password']
            user.set_password(pas)
            user.save()
            return Response({'status':True, 'message':'Password Updated successfully'}, status=status.HTTP_200_OK)
from datetime import date, timedelta
       
@api_view(['POST'])
def borrow_book(request, book_id):

        book_instance = book.objects.get(id=book_id)        
        if book_instance.stock > 0:
            # Decrease stock and save the book instance
            book_instance.stock -= 1
            book_instance.save()
            
            borrow_date = date.today()
            fine = 0
            due_date = borrow_date + timedelta(days=1)

            borrower = Borrower.objects.create(
                book=book_instance,
                user=request.user,
                borrow_date=borrow_date,
                return_date=due_date,
                fine=fine,
                returned='No'
            )
            
            serializer = BorrowerSerializer(borrower)
            return Response(serializer.data, status=201)
        else:
            return Response({'error': 'Book is out of stock!'}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])       
def borrow_details(request):
    user1 = request.user
    books = book.objects.all()
    borrows = Borrower.objects.filter(user=user1)
    serialized_books = BookSerializer(books, many=True).data
    serialized_borrows = BorrowerSerializer(borrows, many=True).data
    return JsonResponse({'books': serialized_books, 'borrows': serialized_borrows})   


def calculate_fine(borrow_date, book_price, book_missing=False):
    fine_per_day = 5
    additional_charge = 20  
    days_difference = (date.today() - borrow_date).days
    
    if days_difference > 1:
        fine = fine_per_day * (days_difference - 1)
    else:
        fine = 0

    if book_missing:
        fine += float(book_price + additional_charge)

    return fine

@api_view(['POST'])
def return_book(request, pk):
    borrower = get_object_or_404(Borrower, id=pk)
    book1 = get_object_or_404(book, id=borrower.book_id) 

    if request.method == 'POST':
        book_missing = request.data.get('book_missing') == 'yes'
        fine = calculate_fine(borrower.borrow_date, book1.price, book_missing)
        borrower.fine = fine
        borrower.return_date = date.today()
        borrower.returned = 'Yes'
        borrower.save(update_fields=['fine', 'returned', 'return_date'])
        
        if not book_missing:
            book1.stock += 1
            book1.save(update_fields=['stock'])
            return JsonResponse({'status': 'success', 'message': 'Book returned successfully'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Book is missing'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])       
# def return_book(request, pk):
#     try:
#         borrow = Borrower.objects.get(pk=pk)
#         borrow.returned = 'Yes'
#         borrow.save()
#         return JsonResponse({'status': 'success'})
#     except Borrower.DoesNotExist:
#         return JsonResponse({'error': 'Borrow record not found'}, status=404)
@api_view(['POST'])
@permission_classes([IsAuthenticated])       
def mark_book_missing(request, pk):
    try:
        borrow = Borrower.objects.get(pk=pk)
        # You can set additional fields or logic for marking a book as missing
        borrow.returned = 'Missing'
        borrow.save()
        return JsonResponse({'status': 'success'})
    except Borrower.DoesNotExist:
        return JsonResponse({'error': 'Borrow record not found'}, status=404)
    
def borrow_admin(request):
    data = Borrower.objects.all()
    serialized_data = BorrowerSerializer(data, many=True).data
    print(serialized_data)
    return JsonResponse(serialized_data, safe=False)
from .serializers import OrderSerializer

def order_data(request):
    data = order.objects.all()
    serialized_data = OrderSerializer(data, many=True).data
    return JsonResponse({'orders': serialized_data}, safe=False)

def overdue_book_admin():
    today = date.today()
    overdue_books = Borrower.objects.filter(return_date__lt=today, returned='No').select_related('user', 'book')
    print(overdue_books)
    return overdue_books

def overdue_books_view(request):
    overdue_books = overdue_book_admin()
    print(overdue_books)
    overdue_books_data = [
        {
            'book_title': borrow.book.book,
            'borrow_date': borrow.borrow_date,
            'return_date': borrow.return_date,
            'user': {
                'first_name': borrow.user.first_name,
                'last_name': borrow.user.last_name
            }
        }
        for borrow in overdue_books
    ]
    print(overdue_books_data)

    return JsonResponse({'overdue_books': overdue_books_data})
from django.utils import timezone
@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def overdue_booksUser(request):
        user = request.user
        print(user)
        overdue_books = Borrower.objects.filter(user=user, return_date__lt=timezone.now(), returned='No')

        overdue_books_list = [
            {
                'id': book.id,
                'book': {
                    'id': book.book.id,
                    'title': book.book.book,
                },
                'due_date': book.return_date
            }
            for book in overdue_books
        ]
        print(overdue_books_list)
        return JsonResponse(overdue_books_list, safe=False)
@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def userorder(request):
    user1 = request.user
    data = order.objects.filter(user=user1)
    pro = book.objects.all()
    categories = category.objects.all()

    order_data = [
            {
                'book': {
                    'image': {
                        'url': order.book.image.url
                    },
                    'book': order.book.book,
                },
                'quantity': order.quantity
            }
            for order in data
    ]
    print(order_data)
    return JsonResponse(order_data, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_status(request):
    pending_users = CustomUser.objects.filter(is_active=False)
    approved_users = CustomUser.objects.filter(is_active=True)
    pending_count = pending_users.count()
    
    pending_users_data = [
        {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email
        } for user in pending_users
    ]
    
    approved_users_data = [
        {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email
        } for user in approved_users
    ]
    
    return JsonResponse({
        'pending_users': pending_users_data,
        'pending_count': pending_count,
        'approved_users': approved_users_data
    })
@api_view(['POST'])
@permission_classes([IsAuthenticated])     
def pay_fine(request, pk):
    borrower = get_object_or_404(Borrower, id=pk)

    try:
        name = request.POST.get('name')
        address = request.POST.get('address')
        credit_card_number = request.POST.get('credit_card_number')

        # Assume you have some logic to process the payment here

        borrower.paid = True
        borrower.save(update_fields=['paid'])
        return JsonResponse({'message': 'Fine paid successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
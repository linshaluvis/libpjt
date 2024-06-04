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
from .serializers import MemberSerializer,BookuserSerializer,CustomUserSerializer,userinfoserializer
from .serializers import CartItemSerializer,MemberuserSerializer

from django.shortcuts import get_object_or_404
from .models import CustomUser







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


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def memberreg(request):
    serializer = MemberSerializer(data=request.data)
    print(request.data)
    if serializer.is_valid():
        member_instance = serializer.save()
        # Create token for the user
        token, created = Token.objects.get_or_create(user=member_instance.user)
        response_data = serializer.data
        response_data['token'] = token.key  # Include the token in the response
        return Response(response_data, status=status.HTTP_201_CREATED)
    else:
        print(serializer.errors)  # Print validation errors to console for debugging
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import  authentication_classes


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

# class BookViewSet(viewsets.ModelViewSet):
#     queryset = book.objects.all()
#     serializer_class = BookuserSerializer
#     parser_classes = (MultiPartParser, FormParser)

#     @action(detail=True, methods=['get', 'put'])
#     def edit(self, request, pk=None):
#         book_instance = get_object_or_404(book, pk=pk)
#         if request.method == 'GET':
#             serializer = BookSerializer(book_instance)
#             categories = category.objects.all()
#             category_serializer = CategorySerializer(categories, many=True)
#             return Response({
#                 'book': serializer.data,
#                 'categories': category_serializer.data
#             })
#         elif request.method == 'PUT':
#             serializer = BookSerializer(book_instance, data=request.data)
#             print(request.data)
#             print(book_instance)
#             if serializer.is_valid():
#                 serializer.save()
#                 print(serializer.data)
#                 return Response(serializer.data)
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

# class UserInfoView(APIView):

#     def get(self, request):
#         user=request.user
#         print('User:', user)
#         serializer = userinfoserializer(user)
#         print(serializer.data)
#         return Response(serializer.data)
import logging

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



# @api_view(['GET', 'PUT'])
# @permission_classes([IsAuthenticated])
# def profile_view(request):
#     try:
#         Member = member.objects.get(user=request.user)
#     except member.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = MemberuserSerializer(Member)
#         print(serializer.data)
#         return Response(serializer.data)

#     elif request.method == 'PUT':
#         serializer = MemberuserSerializer(Member, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             print(serializer.data)
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
def increase_quantity(request, book_id):
    cart_item = get_object_or_404(cartitem, book_id=book_id)
    cart_item.quantity += 1
    cart_item.save()
    return cart_items(request)
@permission_classes([IsAuthenticated])
def decrease_quantity(request, book_id):
    cart_item = get_object_or_404(cartitem, book_id=book_id)
    if cart_item.quantity > 1:
        cart_item.quantity -= 1
        cart_item.save()
    return cart_items(request)
@permission_classes([IsAuthenticated])
def remove_item(request, item_id):
    cart_item = get_object_or_404(cartitem, id=item_id)
    cart_item.delete()
    return cart_items(request)

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
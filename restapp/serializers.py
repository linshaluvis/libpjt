from rest_framework import serializers
from .models import restapi,CustomUser,category,book,member,cartitem,Borrower,order

class restserializer(serializers.ModelSerializer):
    class Meta:
        model = restapi
        fields = '__all__'


class userserializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email']
class MemberuserSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = member
        fields = '__all__'

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        
        # Update the user fields if they exist
        if user_data:
            user_instance = instance.user
            user_instance.first_name = user_data.get('first_name', user_instance.first_name)
            user_instance.last_name = user_data.get('last_name', user_instance.last_name)
            user_instance.email = user_data.get('email', user_instance.email)
            user_instance.save()
        
        # Update the member fields
        instance.number = validated_data.get('number', instance.number)
        instance.mebimage = validated_data.get('mebimage', instance.mebimage)
        instance.save()

        return instance
class userinfoserializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name']
        
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'username', 'email']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        user.is_active = False
        user.save()
        return user

class MemberSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()

    class Meta:
        model = member
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = CustomUserSerializer.create(CustomUserSerializer(), validated_data=user_data)
        Member = member.objects.create(user=user, **validated_data)
        return Member

class loginserializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = category
        fields = ['id', 'category_name']
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = book
        fields = '__all__'

class BookuserSerializer(serializers.ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = book
        fields = '__all__'
        
class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = cartitem
        fields = ['id', 'book', 'user', 'quantity']
        read_only_fields = ['id', 'user']

    def create(self, validated_data):
        book = validated_data['book']
        user = self.context['request'].user

        cart_item, created = cartitem.objects.get_or_create(book=book, user=user)
        cart_item.quantity += 1
        cart_item.save()

        # Decrease the book stock
        book.stock -= 1
        book.save()

        return cart_item
    
class BorrowerSerializer(serializers.ModelSerializer):
    book = BookSerializer()
    user = UserSerializer()


    class Meta:
        model = Borrower
        fields = ['id', 'book', 'user', 'borrow_date', 'return_date', 'fine', 'returned']
class OrderSerializer(serializers.ModelSerializer):
    book = BookSerializer()
    user = UserSerializer()

    class Meta:
        model = order
        fields = '__all__'

    
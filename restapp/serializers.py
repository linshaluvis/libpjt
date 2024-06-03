from rest_framework import serializers
from .models import restapi,CustomUser,category,book,member,cartitem

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
        fields = ['first_name', 'last_name', 'email', 'username']
class MemberuserSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    mebimage = serializers.ImageField(required=False)


    class Meta:
        model = member
        fields = ['user', 'number', 'mebimage']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        user = instance.user

        instance.number = validated_data.get('number', instance.number)
        instance.mebimage = validated_data.get('mebimage', instance.image)
        instance.save()

        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.email = user_data.get('email', user.email)
        user.username = user_data.get('username', user.username)
        user.save()

        return instance
class userinfoserializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name']
        
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        user.is_active = True
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
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class CustomUser(AbstractUser):
    pass

class restapi(models.Model):
    name = models.CharField(max_length=200,null=True)
    age = models.CharField(max_length=200,null=True)
    course = models.CharField(max_length=200,null=True)
    
class category(models.Model):
    category_name=models.CharField(max_length=200)
    def __str__(self):
        return self.category_name
    
class member(models.Model):
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE,null=True)
    number=models.BigIntegerField(null=True)
    mebimage=models.ImageField(upload_to='image/',null=True)
    Join_date=models.DateField(auto_now_add=True)

class book(models.Model):
    category=models.ForeignKey(category,on_delete=models.CASCADE,null=True)
    book=models.CharField(max_length=200,null=True)
    author=models.CharField(max_length=200,null=True)
    publisher_id=models.IntegerField(null=True)
    price=models.IntegerField(null=True)
    image=models.ImageField(upload_to='image/',null=True)
    stock= models.IntegerField(default=0)
    def __str__(self):
        return self.book
    
class cartitem(models.Model):
      user=models.ForeignKey(CustomUser,on_delete=models.CASCADE,null=True)
      book=models.ForeignKey(book,on_delete=models.CASCADE,null=True)
      quantity = models.PositiveIntegerField(default=0, null=True, blank=True)

      def __str__(self):
        return f'{self.quantity} x {self.book.book}'
class Borrower(models.Model):
    book = models.ForeignKey(book, on_delete=models.CASCADE)
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE,null=True)
    
    borrow_date = models.DateField(auto_now_add=True)
    return_date = models.DateField(null=True, blank=True)
    fine = models.IntegerField()
    returned = models.CharField(max_length=3,default='No')
    paid = models.BooleanField(default=False) 


    

class order(models.Model):
     user=models.ForeignKey(CustomUser,on_delete=models.CASCADE,null=True)
     book=models.ForeignKey(book,on_delete=models.CASCADE,null=True)
     quantity = models.IntegerField(default=0, null=True, blank=True)

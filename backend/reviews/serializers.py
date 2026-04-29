from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Review, CoworkingBooking
import re


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)
    name = serializers.CharField(max_length=150)

    class Meta:
        model = User
        fields = ['name', 'password', 'confirm_password']

    def validate_name(self, value):
        if not re.match(r'^[А-Яа-яЁё\s]+$', value):
            raise serializers.ValidationError('Имя должно содержать только русские буквы')
        if User.objects.filter(first_name=value).exists():
            raise serializers.ValidationError('Пользователь с таким именем уже существует')
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Пароли не совпадают'})
        return data

    def create(self, validated_data):
        name = validated_data['name']
        password = validated_data['password']
        user = User.objects.create_user(
            username=name,
            first_name=name,
            password=password
        )
        return user


class LoginSerializer(serializers.Serializer):
    name = serializers.CharField()
    password = serializers.CharField(write_only=True)


class ReviewSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.first_name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'author_name', 'text', 'rating', 'created_at']
        read_only_fields = ['id', 'author_name', 'created_at']


class CoworkingBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoworkingBooking
        fields = ['id', 'name', 'date', 'time_start', 'time_end', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate(self, data):
        date = data.get('date')
        time_start = data.get('time_start')
        time_end = data.get('time_end')

        if time_end <= time_start:
            raise serializers.ValidationError(
                {'time_end': 'Время окончания должно быть позже времени начала'}
            )

        overlapping = CoworkingBooking.objects.filter(
            date=date,
            time_start__lt=time_end,
            time_end__gt=time_start,
        )
        if overlapping.exists():
            conflict = overlapping.first()
            raise serializers.ValidationError({
                'conflict': (
                    f'Коворкинг уже занят {conflict.date.strftime("%d.%m.%Y")} '
                    f'с {conflict.time_start.strftime("%H:%M")} '
                    f'до {conflict.time_end.strftime("%H:%M")}'
                )
            })

        return data

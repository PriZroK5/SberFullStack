from django.db import models
from django.contrib.auth.models import User


class Review(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    text = models.TextField(max_length=1000)
    rating = models.PositiveSmallIntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.author.first_name} — {self.text[:50]}'


class CoworkingBooking(models.Model):
    name = models.CharField(max_length=200, verbose_name='Имя')
    date = models.DateField(verbose_name='Дата')
    time_start = models.TimeField(verbose_name='Время начала')
    time_end = models.TimeField(verbose_name='Время окончания')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date', 'time_start']
        verbose_name = 'Бронирование коворкинга'
        verbose_name_plural = 'Бронирования коворкинга'

    def __str__(self):
        return f'{self.name} — {self.date} {self.time_start}–{self.time_end}'

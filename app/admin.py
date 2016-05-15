from django.contrib import admin

# Register your models here.
from .models import Crypth

class CrypthAdmin(admin.ModelAdmin):
    list_display = ["source_text", "step", "final_text", "method", "timestamp"]
    class Meta:
        model = Crypth


admin.site.register(Crypth)
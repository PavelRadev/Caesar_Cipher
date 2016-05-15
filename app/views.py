from django.shortcuts import render
from django.http import JsonResponse
from .models import Crypth


def home(request):
    if request.method == 'POST':
        if request.is_ajax():
            crypted = Crypth(request.POST.get('text'), int(request.POST.get('step')), request.POST.get('method'))
            data = {"crypted_text": crypted.final_text}
            crypted.writeCSV()
            return JsonResponse(data)
    return render(request, 'base.html')

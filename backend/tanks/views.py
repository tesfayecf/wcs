import json

from django.shortcuts import render, redirect

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.auth.decorators import login_required

from django.http import HttpResponse, JsonResponse

from django.views.decorators.csrf import csrf_exempt

from .models import Tank, TankGroup

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializer import TankSerializer, TankGroupSerializer, CreateTankSerializer, CreateTankGroupSerializer

from .forms import *


# Frontend
@login_required(login_url='/accounts/login/')
def frontend(request):
    context = {}
    return render(request, "index.html", context)

# API


class TanksViews(generics.ListAPIView):
    queryset = Tank.objects.all()
    serializer_class = TankSerializer


def tank(request, tankId):
    t_list = Tank.objects.all()
    return HttpResponse(t_list, content_type="application/json")


class CreateTankView(APIView):
    serializer_class = CreateTankSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            name = serializer.data.get('name')
            capacity = serializer.data.get('capacity'),
            isActive = serializer.data.get('isActive'),
            x = serializer.data.get('x'),
            y = serializer.data.get('y'),
            z = serializer.data.get('z'),
            material = serializer.data.get('material'),
            brandName = serializer.data.get('brandName'),
            tankGroup = serializer.data.get('tankGroup')

            queryName = Tank.objects.filter(name=name)

            if len(queryName) == 0:
                tank = Tank(
                    name=name,
                    capacity=capacity,
                    isActive=isActive,
                    x=x,
                    y=y,
                    z=z,
                    material=material,
                    brandName=brandName,
                    tankGroup=tankGroup,
                )
                tank.save()
                return Response(TankSerializer(tank).data, status=status.HTTP_201_CREATED)
            return Response({'Bad Request': 'Invalid name...'}, status=status.HTTP_302_FOUND)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class TankGroupsView(generics.ListAPIView):
    queryset = TankGroup.objects.all()
    serializer_class = TankGroupSerializer


def tank_group(request, tankGroupId):
    tg_list = TankGroup.objects.all()
    return HttpResponse(tg_list, content_type="application/json")


class CreateTankGroupView(APIView):

    serializer_class = CreateTankGroupSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            name = serializer.data.get('name'),
            isActive = serializer.data.get('isActive'),
            location = serializer.data.get('location'),

            queryName = TankGroup.objects.filter(name=name)

            if len(queryName) == 0:
                TankGroup = TankGroup(
                    name=name,
                    isActive=isActive,
                    location=location,
                )
                TankGroup.save()
                return Response(TankGroupSerializer(TankGroup).data, status=status.HTTP_201_CREATED)
            return Response({'Bad Request': 'Invalid name...'}, status=status.HTTP_302_FOUND)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


# Login interface
def login_view(request):
    next = request.GET.get('next')
    form = UserLoginForm(request.POST or None)
    if form.is_valid():
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password')
        user = authenticate(username=username, password=password)
        login(request, user)
        if next:
            return redirect(next)
        return redirect('/')

    context = {
        'form': form,
    }
    return render(request, "login.html", context)

def register_view(request):
    next = request.GET.get('next')
    form = UserRegisterForm(request.POST or None)
    if form.is_valid():
        user = form.save(commit=False)
        password = form.cleaned_data.get('password')
        user.set_password(password)
        user.save()
        new_user = authenticate(username=user.username, password=password)
        login(request, new_user)
        if next:
            return redirect(next)
        return redirect('/')

    context = {
        'form': form,
    }
    return render(request, "signup.html", context)

def logout_view(request):
    logout(request)
    return redirect('/')

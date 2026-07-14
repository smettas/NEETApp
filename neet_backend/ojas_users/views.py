import re
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import StudentProfile, Enquiry

MOBILE_REGEX = re.compile(r'^[6-9]\d{9}$')


def _profile_payload(user, profile):
    return {
        'id': user.id,
        'name': user.get_full_name(),
        'roll_number': profile.roll_number,
        'mobile': profile.mobile,
        'gender': profile.gender,
        'blood_group': profile.blood_group,
        'studying': profile.current_class,
        'address': profile.address,
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = request.data
    try:
        mobile = (data.get('mobile') or '').strip()
        roll_number = (data.get('roll_number') or '').strip()
        password = data.get('password') or ''
        first_name = (data.get('first_name') or '').strip()

        if not mobile or not MOBILE_REGEX.match(mobile):
            return Response(
                {'error': 'Enter a valid 10 digit mobile number'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not roll_number:
            return Response(
                {'error': 'Roll Number is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not password or len(password) < 6:
            return Response(
                {'error': 'Password must be at least 6 characters'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not first_name:
            return Response(
                {'error': 'First Name is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Mobile doubles as the Django username
        if User.objects.filter(username=mobile).exists():
            return Response(
                {'error': 'Mobile number already registered'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if StudentProfile.objects.filter(roll_number=roll_number).exists():
            return Response(
                {'error': 'Roll Number already registered'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create User (no email — mobile is the identity)
        user = User.objects.create_user(
            username=mobile,
            password=password,
            first_name=first_name,
            last_name=data.get('last_name', ''),
        )

        # Create Student Profile
        profile = StudentProfile.objects.create(
            user=user,
            gender=data.get('gender', ''),
            blood_group=data.get('blood_group', ''),
            mobile=mobile,
            address=data.get('address', ''),
            current_class=data.get('studying', ''),
            roll_number=roll_number,
            batch='2025-26',
        )

        # Create Token
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'success': True,
            'message': 'Registration successful!',
            'token': token.key,
            'user': _profile_payload(user, profile),
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    data = request.data
    mobile = (data.get('mobile') or '').strip()
    password = data.get('password') or ''

    if not mobile or not password:
        return Response(
            {'error': 'Mobile Number and Password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(username=mobile)
    except User.DoesNotExist:
        return Response(
            {'error': 'Mobile number not registered'},
            status=status.HTTP_404_NOT_FOUND
        )

    authenticated_user = authenticate(username=user.username, password=password)
    if not authenticated_user:
        return Response(
            {'error': 'Invalid password'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    token, _ = Token.objects.get_or_create(user=authenticated_user)
    profile = authenticated_user.profile

    return Response({
        'success': True,
        'token': token.key,
        'user': _profile_payload(authenticated_user, profile),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    try:
        profile = request.user.profile
        payload = _profile_payload(request.user, profile)
        payload['photo'] = request.build_absolute_uri(profile.photo.url) if profile.photo else None
        return Response(payload)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        request.user.auth_token.delete()
        return Response({'success': True, 'message': 'Logged out successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def submit_enquiry(request):
    data = request.data
    try:
        enquiry = Enquiry.objects.create(
            name=data.get('name', ''),
            phone=data.get('phone', ''),
            email=data.get('email', ''),
            current_class=data.get('class', ''),
            program=data.get('program', ''),
            city=data.get('city', ''),
            message=data.get('message', ''),
        )
        return Response({
            'success': True,
            'message': 'Enquiry submitted successfully!',
            'id': enquiry.id,
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

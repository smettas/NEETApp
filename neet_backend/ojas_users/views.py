from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import StudentProfile
from .models import StudentProfile, Enquiry

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = request.data
    try:
        # Check if email exists
        if User.objects.filter(email=data.get('email')).exists():
            return Response(
                {'error': 'Email already registered'},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Check if mobile exists
        if StudentProfile.objects.filter(mobile=data.get('mobile')).exists():
            return Response(
                {'error': 'Mobile number already registered'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create User
        user = User.objects.create_user(
            username=data.get('email'),
            email=data.get('email'),
            password=data.get('password'),
            first_name=data.get('firstName', ''),
            last_name=data.get('lastName', ''),
        )

        # Generate roll number
        count = StudentProfile.objects.count() + 1
        roll_number = f"OJA-2025-{str(count).zfill(3)}"

        # Create Student Profile
        profile = StudentProfile.objects.create(
            user=user,
            gender=data.get('gender', ''),
            dob=data.get('dob') or None,
            blood_group=data.get('bloodGroup', ''),
            father_name=data.get('fatherName', ''),
            mother_name=data.get('motherName', ''),
            parent_mobile=data.get('parentMobile', ''),
            parent_occupation=data.get('parentOccupation', ''),
            aadhar_number=data.get('aadhar', ''),
            mobile=data.get('mobile', ''),
            state=data.get('state', ''),
            district=data.get('district', ''),
            city=data.get('city', ''),
            pincode=data.get('pincode', ''),
            address=data.get('address', ''),
            school_name=data.get('schoolName', ''),
            current_class=data.get('currentClass', ''),
            board=data.get('board', ''),
            year_of_passing=data.get('yearOfPassing', ''),
            tenth_marks=data.get('tenthMarks', ''),
            puc1_marks=data.get('puc1Marks', ''),
            puc2_marks=data.get('puc2Marks', ''),
            previous_coaching=data.get('previousCoaching') == 'Yes',
            institute_name=data.get('instituteName', ''),
            neet_attempt_status=data.get('neetAttemptStatus', ''),
            attempt1_marks=data.get('attempt1Marks', ''),
            attempt2_marks=data.get('attempt2Marks', ''),
            program=data.get('courseApplied', ''),
            hostel_required=data.get('hostelRequired') == 'Yes',
            roll_number=roll_number,
            batch='2025-26',
        )

        # Create Token
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'success': True,
            'message': 'Registration successful!',
            'token': token.key,
            'user': {
                'id': user.id,
                'name': user.get_full_name(),
                'email': user.email,
                'roll_number': profile.roll_number,
                'program': profile.program,
                'batch': profile.batch,
            }
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
    email = data.get('email', '')
    password = data.get('password', '')

    try:
        user = User.objects.get(email=email)
        user = authenticate(username=user.username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            profile = user.profile

            return Response({
                'success': True,
                'token': token.key,
                'user': {
                    'id': user.id,
                    'name': user.get_full_name(),
                    'email': user.email,
                    'roll_number': profile.roll_number,
                    'program': profile.program,
                    'batch': profile.batch,
                    'mobile': profile.mobile,
                    'city': profile.city,
                }
            })
        else:
            return Response(
                {'error': 'Invalid password'},
                status=status.HTTP_401_UNAUTHORIZED
            )
    except User.DoesNotExist:
        return Response(
            {'error': 'Email not registered'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    try:
        profile = request.user.profile
        return Response({
            'id': request.user.id,
            'name': request.user.get_full_name(),
            'email': request.user.email,
            'roll_number': profile.roll_number,
            'program': profile.program,
            'batch': profile.batch,
            'mobile': profile.mobile,
            'city': profile.city,
            'state': profile.state,
            'gender': profile.gender,
            'blood_group': profile.blood_group,
            'father_name': profile.father_name,
            'mother_name': profile.mother_name,
            'school_name': profile.school_name,
            'current_class': profile.current_class,
            'hostel_required': profile.hostel_required,
            'photo': request.build_absolute_uri(profile.photo.url) if profile.photo else None,
        })
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
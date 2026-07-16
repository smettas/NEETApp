import re
from datetime import datetime
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import StudentProfile, Enquiry, HomeLeaveRequest, ParentVisitRequest, Notice

MOBILE_REGEX = re.compile(r'^[6-9]\d{9}$')
DATE_FORMAT = '%d/%m/%Y'


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

    response_data = {
        'success': True,
        'token': token.key,
        'user': _profile_payload(authenticated_user, profile),
    }
    
    # Check if user needs to change password
    if profile.require_password_change:
        response_data['require_password_change'] = True

    return Response(response_data)


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

def _leave_request_payload(leave_request):
    return {
        'id': leave_request.id,
        'from_date': leave_request.start_date.strftime(DATE_FORMAT),
        'to_date': leave_request.end_date.strftime(DATE_FORMAT),
        'days': (leave_request.end_date - leave_request.start_date).days + 1,
        'reason': leave_request.reason,
        'guardian_name': leave_request.guardian_name,
        'guardian_mobile': leave_request.guardian_mobile,
        'guardian_relation': leave_request.guardian_relation,
        'status': leave_request.status.lower(),
        'admin_comment': leave_request.admin_comment or '',
        'applied_on': leave_request.created_at.strftime(DATE_FORMAT),
    }


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def home_leave_requests(request):
    try:
        profile = request.user.profile
        if request.method == 'GET':
            requests = HomeLeaveRequest.objects.filter(student=profile)
            return Response({'requests': [_leave_request_payload(item) for item in requests]})

        data = request.data
        required_fields = ('from_date', 'to_date', 'reason', 'guardian_name', 'guardian_mobile', 'guardian_relation')
        if any(not str(data.get(field, '')).strip() for field in required_fields):
            return Response({'error': 'Please fill all required fields'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            start_date = datetime.strptime(data['from_date'].strip(), DATE_FORMAT).date()
            end_date = datetime.strptime(data['to_date'].strip(), DATE_FORMAT).date()
        except ValueError:
            return Response({'error': 'Enter dates in DD/MM/YYYY format'}, status=status.HTTP_400_BAD_REQUEST)
        if end_date < start_date:
            return Response({'error': 'To date must be the same as or after From date'}, status=status.HTTP_400_BAD_REQUEST)

        guardian_mobile = str(data['guardian_mobile']).strip()
        if not MOBILE_REGEX.match(guardian_mobile):
            return Response({'error': 'Enter a valid 10 digit guardian mobile number'}, status=status.HTTP_400_BAD_REQUEST)

        leave_request = HomeLeaveRequest.objects.create(
            student=profile, start_date=start_date, end_date=end_date,
            reason=data['reason'].strip(), guardian_name=data['guardian_name'].strip(),
            guardian_mobile=guardian_mobile, guardian_relation=data['guardian_relation'].strip(),
        )
        return Response({'success': True, 'message': 'Home leave request submitted successfully.', 'request': _leave_request_payload(leave_request)}, status=status.HTTP_201_CREATED)
    except StudentProfile.DoesNotExist:
        return Response({'error': 'Student profile not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def _parent_visit_payload(visit):
    return {'id': visit.id, 'date': visit.visit_date.strftime(DATE_FORMAT), 'time': visit.visit_time, 'parent_name': visit.parent_name, 'relation': visit.relation, 'purpose': visit.purpose, 'number_of_visitors': visit.number_of_visitors, 'visiting_message': visit.visiting_message, 'status': visit.status.lower(), 'admin_comment': visit.admin_comment, 'applied_on': visit.created_at.strftime(DATE_FORMAT)}


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def parent_visit_requests(request):
    profile = request.user.profile
    if request.method == 'GET':
        visits = ParentVisitRequest, Notice.objects.filter(student=profile)
        return Response({'requests': [_parent_visit_payload(visit) for visit in visits]})
    data = request.data
    required = ('visit_date', 'visit_time', 'parent_name', 'parent_mobile', 'relation', 'purpose')
    if any(not str(data.get(field, '')).strip() for field in required):
        return Response({'error': 'Please fill all required fields'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        date_value = data['visit_date'].strip()
        try:
            visit_date = datetime.strptime(date_value, '%Y-%m-%d').date()
        except ValueError:
            visit_date = datetime.strptime(date_value, DATE_FORMAT).date()
    except ValueError:
        return Response({'error': 'Select a valid visit date'}, status=status.HTTP_400_BAD_REQUEST)
    if visit_date <= datetime.now().date():
        return Response({'error': 'Visit must be booked at least one day in advance'}, status=status.HTTP_400_BAD_REQUEST)
    mobile = str(data['parent_mobile']).strip()
    if not MOBILE_REGEX.match(mobile):
        return Response({'error': 'Enter a valid 10 digit parent mobile number'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        visitor_count = int(data.get('number_of_visitors') or 1)
        if visitor_count < 1:
            raise ValueError
    except (TypeError, ValueError):
        return Response({'error': 'Number of visitors must be at least 1'}, status=status.HTTP_400_BAD_REQUEST)
    visit = ParentVisitRequest, Notice.objects.create(student=profile, visit_date=visit_date, visit_time=data['visit_time'].strip(), parent_name=data['parent_name'].strip(), parent_mobile=mobile, relation=data['relation'].strip(), purpose=data['purpose'].strip(), number_of_visitors=visitor_count, visiting_message=(data.get('visiting_message') or '').strip())
    return Response({'success': True, 'request': _parent_visit_payload(visit)}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notices(request):
    return Response({'notices': [{'id': item.id, 'title': item.title, 'category': item.category, 'message': item.message, 'attachment': request.build_absolute_uri(item.attachment.url) if item.attachment else '', 'published_at': item.published_at.isoformat()} for item in Notice.objects.all()]})

@api_view(['POST'])
@permission_classes([AllowAny])
def change_password(request):
    data = request.data
    mobile = (data.get('mobile') or '').strip()
    current_password = data.get('current_password') or ''
    new_password = data.get('new_password') or ''

    if not mobile or not current_password or not new_password:
        return Response(
            {'error': 'Mobile Number, Current Password and New Password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(new_password) < 6:
        return Response(
            {'error': 'New password must be at least 6 characters'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(new_password) > 15:
        return Response(
            {'error': 'New password cannot exceed 15 characters'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(username=mobile)
    except User.DoesNotExist:
        return Response(
            {'error': 'Mobile number not registered'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Verify current password
    authenticated_user = authenticate(username=user.username, password=current_password)
    if not authenticated_user:
        return Response(
            {'error': 'Current password is incorrect'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Check if new password is same as old password
    if current_password == new_password:
        return Response(
            {'error': 'New password must be different from current password'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Update password
    user.set_password(new_password)
    user.save()

    # Mark require_password_change as False
    profile = user.profile
    profile.require_password_change = False
    profile.save()

    return Response({
        'success': True,
        'message': 'Password changed successfully!'
    })


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

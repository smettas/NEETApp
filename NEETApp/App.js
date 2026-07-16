import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Splash
import SplashScreen from './screens/SplashScreen';

// Public Screens
import HomeScreen from './screens/HomeScreen';
import ProgramsScreen from './screens/ProgramsScreen';
import FacultyScreen from './screens/FacultyScreen';
import GalleryScreen from './screens/GalleryScreen';
import ContactScreen from './screens/ContactScreen';
import EnquiryScreen from './screens/EnquiryScreen';

// Auth Screens
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import ChangePasswordScreen from './screens/auth/ChangePasswordScreen';

// Student Screens
import DashboardScreen from './screens/student/DashboardScreen';
import MyCoursesScreen from './screens/student/MyCoursesScreen';
import PDFLibraryScreen from './screens/student/PDFLibraryScreen';
import PerformanceScreen from './screens/student/PerformanceScreen';
import ProfileScreen from './screens/student/ProfileScreen';
import ResultsHomeScreen from './screens/student/ResultsHomeScreen';
import ODTResultsScreen from './screens/student/ODTResultsScreen';
import OWTResultsScreen from './screens/student/OWTResultsScreen';
import TheoryResultsScreen from './screens/student/TheoryResultsScreen';
import AttendanceScreen from './screens/student/AttendanceScreen';
import HomeLeaveScreen from './screens/student/HomeLeaveScreen';
import ParentVisitScreen from './screens/student/ParentVisitScreen';

// Subscription
import PlansScreen from './screens/subscription/PlansScreen';

import * as NavigationBar from 'expo-navigation-bar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// TAB ICON COMPONENT
function TabIcon({ emoji, label, focused }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text style={{
        fontSize: 10,
        fontWeight: focused ? '700' : '500',
        color: focused ? '#C9A227' : '#9CA3AF',
        marginTop: 2,
      }}>{label}</Text>
    </View>
  );
}

// PUBLIC BOTTOM TABS
function PublicTabs({ isLoggedIn, user }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F2548',
          borderTopColor: 'rgba(201,162,39,0.2)',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="HomeTab"
        options={{
          tabBarIcon: ({ focused }) =>
            <TabIcon emoji="🏠" label="Home" focused={focused} />,
        }}>
        {props => <HomeScreen {...props} isLoggedIn={isLoggedIn} user={user} />}
      </Tab.Screen>
      <Tab.Screen
        name="ProgramsTab"
        component={ProgramsScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            <TabIcon emoji="📚" label="Programs" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="FacultyTab"
        component={FacultyScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            <TabIcon emoji="👨‍🏫" label="Faculty" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ContactTab"
        component={ContactScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            <TabIcon emoji="📞" label="Contact" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

// STUDENT BOTTOM TABS
function StudentApp({ user, onLogout }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1A3A6C' },
        headerTintColor: '#C9A227',
        headerTitleStyle: { fontWeight: 'bold' },
        headerBackTitle: 'Back',
      }}>
      <Stack.Screen
        name="StudentHome"
        options={{ headerShown: false }}>
        {props => <DashboardScreen {...props} user={user} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="ResultsHome" options={{ title: '📊 My Results' }}>
        {props => <ResultsHomeScreen {...props} user={user} />}
      </Stack.Screen>
      <Stack.Screen name="ODTResults" options={{ title: 'ODT Results' }} component={ODTResultsScreen} />
      <Stack.Screen name="OWTResults" options={{ title: 'OWT Results' }} component={OWTResultsScreen} />
      <Stack.Screen name="TheoryResults" options={{ title: 'Theory Test Results' }} component={TheoryResultsScreen} />
      <Stack.Screen name="Performance" options={{ title: '📈 Performance' }}>
        {props => <PerformanceScreen {...props} user={user} />}
      </Stack.Screen>
      <Stack.Screen name="Attendance" options={{ title: '📅 Attendance' }} component={AttendanceScreen} />
      <Stack.Screen name="HomeLeave" options={{ title: '🏠 Home Leave Request' }} component={HomeLeaveScreen} />
      <Stack.Screen name="ParentVisit" options={{ title: '👨‍👩‍👧 Parent Visit Booking' }} component={ParentVisitScreen} />
      <Stack.Screen name="StudentProfile" options={{ title: '👤 My Profile' }}>
        {props => <ProfileScreen {...props} user={user} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="MyCourses" options={{ title: '📚 My Courses' }} component={MyCoursesScreen} />
      <Stack.Screen name="PDFLibrary" options={{ title: '📄 PDF Library' }} component={PDFLibraryScreen} />
      <Stack.Screen name="Plans" options={{ title: '💳 Subscription Plans' }} component={PlansScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Restore user session from AsyncStorage on app startup
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userData = await AsyncStorage.getItem("user");
        
        console.log('[App] Checking session - Token:', !!token, 'User data:', !!userData);
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          console.log('[App] ✓ User session restored:', parsedUser.name);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } else {
          console.log('[App] No session found, user not logged in');
        }
      } catch (error) {
        console.error('[App] Error restoring session:', error);
      } finally {
        setIsCheckingSession(false);
      }
    };
    
    restoreSession();
    NavigationBar.setVisibilityAsync('hidden');
    NavigationBar.setBehaviorAsync('inset-swipe');
  }, []);

  const handleLogin = (userData) => {
    console.log('[App] ✓ User logged in:', userData.name, 'Roll:', userData.roll_number);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    console.log('[App] User logging out');
    setUser(null);
    setIsLoggedIn(false);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  // Determine which screen to show based on session state
  let initialScreen = "Splash";
  if (!isCheckingSession) {
    initialScreen = isLoggedIn && user ? "StudentApp" : "MainApp";
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialScreen}
        screenOptions={{
          headerStyle: { backgroundColor: '#1A3A6C' },
          headerTintColor: '#C9A227',
          headerTitleStyle: { fontWeight: 'bold' },
        }}>

        {/* SPLASH */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        {/* MAIN PUBLIC APP WITH TABS */}
        <Stack.Screen
          name="MainApp"
          options={{ headerShown: false }}>
          {props => <PublicTabs {...props} isLoggedIn={isLoggedIn} user={user} />}
        </Stack.Screen>

        {/* STUDENT APP */}
        <Stack.Screen
          name="StudentApp"
          options={{ headerShown: false }}>
          {props => <StudentApp {...props} user={user} onLogout={handleLogout} />}
        </Stack.Screen>

        {/* PUBLIC STACK SCREENS */}
        <Stack.Screen name="Programs" component={ProgramsScreen} />
        <Stack.Screen name="Faculty" component={FacultyScreen} />
        <Stack.Screen name="Gallery" component={GalleryScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="Enquiry" component={EnquiryScreen} />

        {/* AUTH SCREENS */}
        <Stack.Screen
          name="Login"
          options={{ title: 'Student Login' }}>
          {props => <LoginScreen {...props} onLogin={handleLogin} />}
        </Stack.Screen>
        <Stack.Screen
          name="Register"
          options={{ title: 'Create Account' }}
          component={RegisterScreen}
        />
        <Stack.Screen
          name="ChangePassword"
          options={{ title: 'Change Password', headerBackVisible: false }}>
          {props => <ChangePasswordScreen {...props} />}
        </Stack.Screen>

        {/* STUDENT SCREENS */}
        <Stack.Screen
          name="Dashboard"
          options={{ title: 'My Dashboard' }}>
          {props => <DashboardScreen {...props} user={user} onLogout={handleLogout} />}
        </Stack.Screen>
        <Stack.Screen
          name="MyCourses"
          options={{ title: 'My Courses' }}
          component={MyCoursesScreen}
        />
        <Stack.Screen
          name="PDFLibrary"
          options={{ title: 'PDF Library' }}
          component={PDFLibraryScreen}
        />
        <Stack.Screen
          name="Performance"
          options={{ title: 'My Performance' }}
          component={PerformanceScreen}
        />
        <Stack.Screen
          name="Profile"
          options={{ title: 'My Profile' }}>
          {props => <ProfileScreen {...props} user={user} onLogout={handleLogout} />}
        </Stack.Screen>

        {/* SUBSCRIPTION */}
        <Stack.Screen
          name="Plans"
          options={{ title: 'Choose Your Plan' }}
          component={PlansScreen}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
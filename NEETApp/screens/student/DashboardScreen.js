import React, { useState, useEffect } from "react";

import {
  getSettings,
  getTodayTest,
  getAnnouncement,
} from "../../services/googleSheetsService";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";

export default function DashboardScreen({ navigation, user, onLogout }) {
  
  // States FIRST
const [menuOpen, setMenuOpen] = useState(false);
const [settings, setSettings] = useState({});
const [announcement, setAnnouncement] = useState("");
const [todayTestInfo, setTodayTestInfo] = useState(null);

// Debug: Log user data when component loads
useEffect(() => {
  console.log('[DashboardScreen] User data received:', user);
}, []);

// Then user info - ONLY use defaults if user is truly undefined
if (!user) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 }}>⚠️ User Data Missing</Text>
      <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', paddingHorizontal: 20 }}>
        Your user information could not be loaded. Please try logging out and logging back in.
      </Text>
      <TouchableOpacity 
        onPress={onLogout}
        style={{ marginTop: 20, backgroundColor: '#C0392B', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 8 }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const studentName = user.name || "Student";
const program = settings?.["Institute Name"] || "VAIDYANATHA";
const batch = settings?.["Academic Year"] || "2025-26";
const rollNumber = user.roll_number || "Roll Number Not Set";

console.log('[DashboardScreen] Displaying:', { studentName, rollNumber, program });

    // Debug Today's Test
    useEffect(() => {
      if (todayTestInfo) {
        console.log("Today's Test:", todayTestInfo);
      }
    }, [todayTestInfo]);

    // Debug Announcement
    useEffect(() => {
      if (announcement) {
        console.log("Announcement:", announcement);
      }
    }, [announcement]);


  //helper function
  const getTodayTestInfo = () => {
    const day = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });

    switch (day) {
      case "Monday":
        return {
          name: "Weekly Test",
          marks: "720 Marks",
          subjects: [
            "Physics - 180",
            "Chemistry - 180",
            "Biology - 360",
          ],
        };

      case "Tuesday":
      case "Wednesday":
        return {
          name: "Daily Test PCB",
          marks: "160 Marks",
          subjects: [
            "Physics - 40",
            "Chemistry - 40",
            "Biology - 80",
          ],
        };

      case "Thursday":
      case "Friday":
        return {
          name: "Daily Test PCM",
          marks: "120 Marks",
          subjects: [
            "Physics - 40",
            "Chemistry - 40",
            "Maths - 40",
          ],
        };

      case "Saturday":
        return {
          name: "Theory Test",
          marks: "100 Marks",
          subjects: [
            "Physics - 25",
            "Chemistry - 25",
            "Maths - 25",
            "Biology - 25",
          ],
        };

      default:
        return {
          name: "Holiday",
          marks: "",
          subjects: [],
        };
    }
  };


  const menuItems = [
    { icon: '📚', label: 'Syllabus & Topics', screen: 'MyCourses', color: '#F3E8FF' },
    { icon: '📄', label: 'PDF Library', screen: 'PDFLibrary', color: '#FFE8E8' },
    { icon: '📊', label: 'My Results', screen: 'ResultsHome', color: '#EBF3FF' },
    { icon: '📈', label: 'Performance', screen: 'Performance', color: '#E8F8EF' },
    { icon: '📅', label: 'Attendance', screen: 'Attendance', color: '#FFF3E0' },
    { icon: '🏠', label: 'Home Leave Request', screen: 'HomeLeave', color: '#E8FFF3' },
    { icon: '👨‍👩‍👧', label: 'Parent Visit Booking', screen: 'ParentVisit', color: '#FFF8E8' },
    { icon: '👤', label: 'My Profile', screen: 'StudentProfile', color: '#F0F4FF' },
  ];

  const todaySchedule = () => {
    const day = new Date().getDay();

    switch (day) {
      case 1:
        return {
          day: "Monday",
          test: "Weekly Test",
          subjects: "Physics • Chemistry • Biology",
          marks: "720 Marks",
          sheet: "Weekly Test",
          color: "#C9A227",
        };

      case 2:
      case 3:
        return {
          day: day === 2 ? "Tuesday" : "Wednesday",
          test: "ODT PCB",
          subjects: "Physics • Chemistry • Biology",
          marks: "160 Marks",
          sheet: "odt-PCB",
          color: "#27AE60",
        };

      case 4:
      case 5:
        return {
          day: day === 4 ? "Thursday" : "Friday",
          test: "ODT PCM",
          subjects: "Physics • Chemistry • Maths",
          marks: "120 Marks",
          sheet: "odt-PCM",
          color: "#2980B9",
        };

      case 6:
        return {
          day: "Saturday",
          test: "Theory Test",
          subjects: "Physics • Chemistry • Maths • Biology",
          marks: "100 Marks",
          sheet: "Theory Test",
          color: "#8E44AD",
        };

      default:
        return {
          day: "Sunday",
          test: "No Test Today",
          subjects: "Enjoy your holiday",
          marks: "",
          sheet: "",
          color: "#EF4444",
        };
    }
  };

  const today = todaySchedule();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              onLogout();
              navigation.replace('MainApp');
            }}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Student Info Card */}
        <View style={styles.studentCard}>
          <View style={styles.studentAvatar}>
            <Text style={styles.studentAvatarText}>
              {studentName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{studentName}</Text>
            <Text style={styles.studentRoll}>Roll No: {rollNumber}</Text>
            <View style={styles.studentBadges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{program}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: 'rgba(39,174,96,0.2)', borderColor: 'rgba(39,174,96,0.4)' }]}>
                <Text style={[styles.badgeText, { color: '#27AE60' }]}>Batch {batch}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* TODAY'S TEST BANNER */}
      <View style={[styles.todayBanner, { borderLeftColor: today.color }]}>
        <View style={styles.todayLeft}>
          <Text style={styles.todayLabel}>TODAY'S TEST — {today.day.toUpperCase()}</Text>
          <Text style={styles.todayTest}>
              {today.test}
          </Text>

          <Text
          style={{
              color:"#6B7280",
              marginTop:2,
              fontSize:14
          }}>
              {today.subjects}
          </Text>
          <Text style={[styles.todayMarks, { color: today.color }]}>{today.marks}</Text>
        </View>
        <Text style={styles.todayIcon}>📝</Text>
      </View>

      {/* TEST SCHEDULE */}
      <View style={styles.scheduleCard}>
        <Text style={styles.scheduleTitle}>📅 Weekly Test Schedule</Text>
        {[
          {
            day: 'Monday',
            test: 'Weekly Test',
            marks: '720 Marks',
            color: '#C9A227',
          },
          {
            day: 'Tuesday',
            test: 'Daily Test PCB',
            marks: '160 Marks',
            color: '#27AE60',
          },
          {
            day: 'Wednesday',
            test: 'Daily Test PCB',
            marks: '160 Marks',
            color: '#27AE60',
          },
          {
            day: 'Thursday',
            test: 'Daily Test PCM',
            marks: '120 Marks',
            color: '#2980B9',
          },
          {
            day: 'Friday',
            test: 'Daily Test PCM',
            marks: '120 Marks',
            color: '#2980B9',
          },
          {
            day: 'Saturday',
            test: 'Theory Test',
            marks: '100 Marks',
            color: '#8E44AD',
          },
          {
            day: 'Sunday',
            test: 'Holiday',
            marks: 'Enjoy Holiday',
            color: '#EF4444',
          },
        ].map((item, i) => {
          const isToday = item.day === today.day;

          return (
            <View
              key={i}
              style={[
                styles.scheduleRow,
                isToday && styles.scheduleRowActive,
              ]}
            >
              <View
                style={[
                  styles.scheduleDot,
                  { backgroundColor: item.color },
                ]}
              />

              <View style={{ width: 95 }}>
                <Text
                  style={[
                    styles.scheduleDay,
                    isToday && styles.scheduleDayActive,
                  ]}
                >
                  {item.day}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.scheduleTest,
                    isToday && { color: '#0F2548', fontWeight: '700' },
                  ]}
                >
                  {item.test}
                </Text>
              </View>

              <Text
                style={[
                  styles.scheduleMarks,
                  { color: item.color },
                ]}
              >
                {item.marks}
              </Text>
            </View>
          );
        })}
      </View>
      {/* QUICK ACTIONS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.menuCard, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.screen)}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* IMPORTANT NOTICE */}
      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>📢 Important Notice</Text>
        <Text style={styles.noticeText}>
          • Home leave requests must be submitted 3-4 days in advance{'\n'}
          • Parent visit must be booked 1 day prior{'\n'}
          • Results are updated after each test by the academy{'\n'}
          • Contact academy for any queries
        </Text>
        <TouchableOpacity
          style={styles.contactBtn}
          onPress={() => Linking.openURL('https://wa.me/919632906660')}>
          <Text style={styles.contactBtnText}>💬 Contact Academy</Text>
        </TouchableOpacity>
      </View>

      {/* CONTACT INFO */}
      <View style={styles.contactCard}>
        <Text style={styles.contactTitle}>📞 OJAS ONE Academy</Text>
        <TouchableOpacity onPress={() => Linking.openURL('tel:+919632906660')}>
          <Text style={styles.contactInfo}>+91 9632906660</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('tel:+919845416820')}>
          <Text style={styles.contactInfo}>+91 9845416820</Text>
        </TouchableOpacity>
        <Text style={styles.contactAddress}>
          📍 Block M, Gangothri Campus, Rajiv Gandhi Nagar, Sunkadakatte, Bengaluru – 560091
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },

  // HEADER
  header: { backgroundColor: '#1A3A6C', padding: 20, paddingTop: 50 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerLogo: { width: 140, height: 46 },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  logoutText: { color: 'white', fontSize: 13, fontWeight: '600' },

  // STUDENT CARD
  studentCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  studentAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#C9A227', alignItems: 'center', justifyContent: 'center' },
  studentAvatarText: { fontSize: 28, fontWeight: '900', color: '#0F2548' },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 20, fontWeight: '700', color: 'white', marginBottom: 4 },
  studentRoll: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  studentBadges: { flexDirection: 'row', gap: 8 },
  badge: { backgroundColor: 'rgba(201,162,39,0.2)', borderWidth: 1, borderColor: 'rgba(201,162,39,0.4)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 100 },
  badgeText: { fontSize: 11, color: '#C9A227', fontWeight: '600' },

  // TODAY BANNER
  todayBanner: { backgroundColor: 'white', margin: 16, borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  todayLeft: { flex: 1 },
  todayLabel: { fontSize: 10, fontWeight: '600', color: '#9CA3AF', letterSpacing: 2, marginBottom: 4 },
  todayTest: { fontSize: 18, fontWeight: '700', color: '#0F2548', marginBottom: 4 },
  todayMarks: { fontSize: 14, fontWeight: '600' },
  todayIcon: { fontSize: 36 },

  // SCHEDULE
  scheduleCard: { backgroundColor: 'white', marginHorizontal: 16, borderRadius: 14, padding: 16, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  scheduleTitle: { fontSize: 16, fontWeight: '700', color: '#0F2548', marginBottom: 12 },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', gap: 10 },
  scheduleRowActive: { backgroundColor: '#F8FAFF', borderRadius: 8, paddingHorizontal: 8, marginHorizontal: -8 },
  scheduleDot: { width: 8, height: 8, borderRadius: 4 },
  scheduleDay: { width: 80, fontSize: 13, color: '#6B7280', fontWeight: '500' },
  scheduleDayActive: { color: '#0F2548', fontWeight: '700' },
  scheduleTest: { flex: 1, fontSize: 13, color: '#3D5278' },
  scheduleMarks: { fontSize: 13, fontWeight: '700' },

  // MENU GRID
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F2548', marginBottom: 14 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  menuCard: { width: '47%', borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  menuIcon: { fontSize: 32, marginBottom: 8 },
  menuLabel: { fontSize: 13, fontWeight: '700', color: '#0F2548', textAlign: 'center' },

  // NOTICE
  noticeCard: { backgroundColor: '#FFF8E8', marginHorizontal: 16, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#F0D080', marginBottom: 12 },
  noticeTitle: { fontSize: 15, fontWeight: '700', color: '#B84A00', marginBottom: 10 },
  noticeText: { fontSize: 13, color: '#6B7280', lineHeight: 24 },
  contactBtn: { backgroundColor: '#25D366', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  contactBtnText: { color: 'white', fontWeight: '700', fontSize: 14 },

  // CONTACT
  contactCard: { backgroundColor: '#1A3A6C', marginHorizontal: 16, borderRadius: 14, padding: 16, marginBottom: 32 },
  contactTitle: { fontSize: 15, fontWeight: '700', color: '#C9A227', marginBottom: 10 },
  contactInfo: { fontSize: 14, color: 'white', marginBottom: 4, fontWeight: '600' },
  contactAddress: { fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 20, marginTop: 8 },
});
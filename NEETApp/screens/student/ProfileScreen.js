import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Linking
} from 'react-native';

export default function ProfileScreen({ navigation, user, onLogout }) {
  const studentInfo = {
    name: user?.name || 'Student',
    email: user?.email || '—',
    phone: user?.mobile || '—',
    program: user?.program || '—',
    batch: user?.batch || '—',
    rollNo: user?.roll_number || '—',
    joinDate: user?.join_date || '—',
    city: user?.city || '—',
    currentClass: user?.current_class || '—',
  };

  const menuItems = [
    { icon: '📚', label: 'Syllabus & Topics', screen: 'MyCourses', color: '#EBF3FF' },
    { icon: '📄', label: 'Notices & Updates', screen: 'PDFLibrary', color: '#FFF3E0' },
    { icon: '📊', label: 'Performance', screen: 'Performance', color: '#F3E8FF' },
    { icon: '📅', label: 'Attendance', screen: 'Attendance', color: '#E8F8EF' },
  ];

  const supportItems = [
    { icon: '📞', label: 'Call Support', action: () => Linking.openURL('tel:+919632906660') },
    { icon: '💬', label: 'WhatsApp Support', action: () => Linking.openURL('https://wa.me/919632906660') },
    { icon: '✉️', label: 'Email Support', action: () => Linking.openURL('mailto:ojasoneacademy@gmail.com') },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* PROFILE HEADER */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {studentInfo.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.studentName}>{studentInfo.name}</Text>
        <Text style={styles.studentEmail}>{studentInfo.email}</Text>
        <View style={styles.programBadge}>
          {studentInfo.program !== '—' && (
          <View style={styles.programBadge}>
            <Text style={styles.programBadgeText}>
              {studentInfo.program} Program
            </Text>
          </View>
        )}
        <Text style={styles.rollText}>Roll No: {studentInfo.rollNo}</Text>
        </View>
      </View>

          { label: 'Student Name', value: studentInfo.name },
      {/* QUICK MENU */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        {menuItems.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}>
            <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
              <Text style={styles.menuIconText}>{item.icon}</Text>
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* SUPPORT */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        {supportItems.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.menuItem}
            onPress={item.action}>
            <View style={[styles.menuIcon, { backgroundColor: '#E8F8EF' }]}>
              <Text style={styles.menuIconText}>{item.icon}</Text>
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* APP INFO */}
      <View style={styles.appInfo}>
        <Text style={styles.appName}>OJAS ONE Academy</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
        <Text style={styles.appTagline}>Inner Strength for Ultimate Excellence</Text>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => {
          onLogout();
          navigation.replace('Home');
        }}>
        <Text style={styles.logoutBtnText}>🚪 Logout</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },

  // HEADER
  header: { backgroundColor: '#1A3A6C', padding: 32, paddingTop: 20, alignItems: 'center' },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#C9A227', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { fontSize: 36, fontWeight: '900', color: '#0F2548' },
  studentName: { fontSize: 24, fontWeight: '700', color: 'white', marginBottom: 4 },
  studentEmail: { fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 12 },
  programBadge: { backgroundColor: 'rgba(201,162,39,0.2)', borderWidth: 1, borderColor: 'rgba(201,162,39,0.4)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 100 },
  programBadgeText: { fontSize: 13, color: '#C9A227', fontWeight: '600' },

  // INFO CARD
  infoCard: { backgroundColor: 'white', margin: 16, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0F2548', marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  infoLabel: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  infoValue: { fontSize: 13, color: '#0F2548', fontWeight: '700' },
  rollText: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4 },

  // MENU
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F2548', marginBottom: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 14, padding: 14, marginBottom: 8, gap: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  menuIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuIconText: { fontSize: 22 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#0F2548' },
  menuArrow: { fontSize: 22, color: '#9CA3AF', fontWeight: '300' },

  // APP INFO
  appInfo: { alignItems: 'center', padding: 16, marginTop: 8 },
  appName: { fontSize: 16, fontWeight: '700', color: '#1A3A6C' },
  appVersion: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  appTagline: { fontSize: 12, color: '#9CA3AF', marginTop: 2, fontStyle: 'italic' },

  // LOGOUT
  logoutBtn: { margin: 16, marginTop: 8, padding: 16, borderRadius: 12, borderWidth: 1.5, borderColor: '#FEE2E2', backgroundColor: '#FFF5F5', alignItems: 'center', marginBottom: 40 },
  logoutBtnText: { fontSize: 15, color: '#EF4444', fontWeight: '700' },
});


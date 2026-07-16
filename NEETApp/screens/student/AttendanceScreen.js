import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity
} from 'react-native';

export default function AttendanceScreen({ navigation }) {
  const [selectedMonth, setSelectedMonth] = useState('July 2026');

  const months = ['July 2026', 'June 2026', 'May 2026'];

  const attendanceData = {
    'July 2026': {
      totalDays: 5,
      present: 4,
      absent: 1,
      homeLeave: 0,
      days: [
        { date: '01 Jul', day: 'Wed', status: 'present' },
        { date: '02 Jul', day: 'Thu', status: 'present' },
        { date: '03 Jul', day: 'Fri', status: 'present' },
        { date: '04 Jul', day: 'Sat', status: 'absent' },
        { date: '05 Jul', day: 'Sun', status: 'holiday' },
        { date: '06 Jul', day: 'Mon', status: 'present' },
        { date: '07 Jul', day: 'Tue', status: 'present' },
      ],
    },
    'June 2026': {
      totalDays: 26,
      present: 22,
      absent: 2,
      homeLeave: 2,
      days: [
        { date: '01 Jun', day: 'Mon', status: 'present' },
        { date: '02 Jun', day: 'Tue', status: 'present' },
        { date: '03 Jun', day: 'Wed', status: 'present' },
        { date: '04 Jun', day: 'Thu', status: 'absent' },
        { date: '05 Jun', day: 'Fri', status: 'present' },
        { date: '06 Jun', day: 'Sat', status: 'present' },
        { date: '07 Jun', day: 'Sun', status: 'holiday' },
        { date: '08 Jun', day: 'Mon', status: 'present' },
        { date: '09 Jun', day: 'Tue', status: 'present' },
        { date: '10 Jun', day: 'Wed', status: 'present' },
        { date: '11 Jun', day: 'Thu', status: 'present' },
        { date: '12 Jun', day: 'Fri', status: 'present' },
        { date: '13 Jun', day: 'Sat', status: 'homeLeave' },
        { date: '14 Jun', day: 'Sun', status: 'holiday' },
        { date: '15 Jun', day: 'Mon', status: 'homeLeave' },
        { date: '16 Jun', day: 'Tue', status: 'present' },
        { date: '17 Jun', day: 'Wed', status: 'present' },
        { date: '18 Jun', day: 'Thu', status: 'present' },
        { date: '19 Jun', day: 'Fri', status: 'present' },
        { date: '20 Jun', day: 'Sat', status: 'present' },
        { date: '21 Jun', day: 'Sun', status: 'holiday' },
        { date: '22 Jun', day: 'Mon', status: 'present' },
        { date: '23 Jun', day: 'Tue', status: 'present' },
        { date: '24 Jun', day: 'Wed', status: 'absent' },
        { date: '25 Jun', day: 'Thu', status: 'present' },
        { date: '26 Jun', day: 'Fri', status: 'present' },
        { date: '27 Jun', day: 'Sat', status: 'present' },
        { date: '28 Jun', day: 'Sun', status: 'holiday' },
        { date: '29 Jun', day: 'Mon', status: 'present' },
        { date: '30 Jun', day: 'Tue', status: 'present' },
      ],
    },
    'May 2026': {
      totalDays: 27,
      present: 24,
      absent: 1,
      homeLeave: 2,
      days: [],
    },
  };

  const current = attendanceData[selectedMonth];
  const percentage = Math.round((current.present / current.totalDays) * 100);

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#27AE60';
      case 'absent': return '#C0392B';
      case 'homeLeave': return '#C9A227';
      case 'holiday': return '#9CA3AF';
      default: return '#E5E7EB';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'present': return 'P';
      case 'absent': return 'A';
      case 'homeLeave': return 'HL';
      case 'holiday': return 'H';
      default: return '-';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'present': return '#E8F8EF';
      case 'absent': return '#FFE8E8';
      case 'homeLeave': return '#FFF8E8';
      case 'holiday': return '#F5F5F5';
      default: return '#F5F5F5';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>ATTENDANCE TRACKER</Text>
        <Text style={styles.headerTitle}>My <Text style={styles.headerAccent}>Attendance</Text></Text>
      </View>

      {/* MONTH SELECTOR */}
      <View style={styles.monthSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.monthRow}>
            {months.map((month) => (
              <TouchableOpacity
                key={month}
                style={[styles.monthBtn, selectedMonth === month && styles.monthBtnActive]}
                onPress={() => setSelectedMonth(month)}>
                <Text style={[styles.monthText, selectedMonth === month && styles.monthTextActive]}>
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* SUMMARY CARDS */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { borderTopColor: '#27AE60' }]}>
          <Text style={[styles.summaryNum, { color: '#27AE60' }]}>{current.present}</Text>
          <Text style={styles.summaryLabel}>Present</Text>
        </View>
        <View style={[styles.summaryCard, { borderTopColor: '#C0392B' }]}>
          <Text style={[styles.summaryNum, { color: '#C0392B' }]}>{current.absent}</Text>
          <Text style={styles.summaryLabel}>Absent</Text>
        </View>
        <View style={[styles.summaryCard, { borderTopColor: '#C9A227' }]}>
          <Text style={[styles.summaryNum, { color: '#C9A227' }]}>{current.homeLeave}</Text>
          <Text style={styles.summaryLabel}>Home Leave</Text>
        </View>
        <View style={[styles.summaryCard, { borderTopColor: '#1A3A6C' }]}>
          <Text style={[styles.summaryNum, { color: '#1A3A6C' }]}>{percentage}%</Text>
          <Text style={styles.summaryLabel}>Attendance</Text>
        </View>
      </View>

      {/* PROGRESS BAR */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Overall Attendance</Text>
          <Text style={[styles.progressPct, {
            color: percentage >= 75 ? '#27AE60' : '#C0392B'
          }]}>{percentage}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {
            width: `${percentage}%`,
            backgroundColor: percentage >= 75 ? '#27AE60' : '#C0392B'
          }]} />
        </View>
        <Text style={styles.progressNote}>
          {percentage >= 75
            ? '✅ Good attendance! Keep it up.'
            : '⚠️ Attendance below 75%. Please improve.'}
        </Text>
      </View>

      {/* LEGEND */}
      <View style={styles.legend}>
        {[
          { label: 'Present', color: '#27AE60', bg: '#E8F8EF' },
          { label: 'Absent', color: '#C0392B', bg: '#FFE8E8' },
          { label: 'Home Leave', color: '#C9A227', bg: '#FFF8E8' },
          { label: 'Holiday', color: '#9CA3AF', bg: '#F5F5F5' },
        ].map((item, i) => (
          <View key={i} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.bg, borderColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* DAILY ATTENDANCE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Record</Text>
        <View style={styles.daysGrid}>
          {current.days.map((day, i) => (
            <View
              key={i}
              style={[styles.dayCard, { backgroundColor: getStatusBg(day.status) }]}>
              <Text style={styles.dayDate}>{day.date}</Text>
              <Text style={styles.dayName}>{day.day}</Text>
              <Text style={[styles.dayStatus, { color: getStatusColor(day.status) }]}>
                {getStatusLabel(day.status)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* HOME BUTTON */}
      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.navigate('StudentHome')}>
        <Text style={styles.homeBtnText}>🏠 Back to Dashboard</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },

  header: { backgroundColor: '#1A3A6C', padding: 24, paddingTop: 20 },
  headerLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 3, color: '#C9A227', textTransform: 'uppercase', marginBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: 'white' },
  headerAccent: { color: '#C9A227' },

  monthSelector: { paddingVertical: 12, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  monthRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8 },
  monthBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#FAFAFA' },
  monthBtnActive: { backgroundColor: '#1A3A6C', borderColor: '#1A3A6C' },
  monthText: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  monthTextActive: { color: 'white' },

  summaryRow: { flexDirection: 'row', padding: 16, gap: 10 },
  summaryCard: { flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 12, alignItems: 'center', borderTopWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  summaryNum: { fontSize: 22, fontWeight: '900', marginBottom: 4 },
  summaryLabel: { fontSize: 10, color: '#6B7280', textAlign: 'center' },

  progressCard: { backgroundColor: 'white', marginHorizontal: 16, borderRadius: 14, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressTitle: { fontSize: 14, fontWeight: '700', color: '#0F2548' },
  progressPct: { fontSize: 14, fontWeight: '700' },
  progressBar: { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, marginBottom: 8 },
  progressFill: { height: 8, borderRadius: 4 },
  progressNote: { fontSize: 12, color: '#6B7280' },

  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 16, marginBottom: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 16, height: 16, borderRadius: 4, borderWidth: 1.5 },
  legendText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },

  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F2548', marginBottom: 14 },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dayCard: { width: '13%', borderRadius: 8, padding: 6, alignItems: 'center' },
  dayDate: { fontSize: 9, color: '#6B7280', marginBottom: 2 },
  dayName: { fontSize: 9, color: '#9CA3AF', marginBottom: 4 },
  dayStatus: { fontSize: 12, fontWeight: '900' },

  homeBtn: { marginHorizontal: 16, marginBottom: 32, backgroundColor: '#1A3A6C', padding: 16, borderRadius: 12, alignItems: 'center' },
  homeBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
});
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity
} from 'react-native';

export default function ResultsHomeScreen({ navigation, route, user }) {
  // Get roll number from route params or user prop
  const rollNumber = route.params?.rollNumber || user?.roll_number;
  
  if (!rollNumber) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingIcon}>❌</Text>
        <Text style={styles.loadingText}>Student information not available</Text>
      </View>
    );
  }

  const testTypes = [
     {
      id: 1,
      code: 'OWT',
      name: 'OJAS Weekly Test',
      subtitle: 'All Subjects Combined',
      days: 'Every Monday',
      marks: '720 Marks',
      subjects: ['Physics', 'Chemistry', 'Biology'],
      color: '#C9A227',
      bgColor: '#FFF8E8',
      icon: '📝',
      screen: 'OWTResults',
      params: { title: 'OWT Weekly Results' },
    },
    {
      id: 2,
      code: 'ODT PCB',
      name: 'OJAS Daily Test',
      subtitle: 'Physics • Chemistry • Biology',
      days: 'Tuesday & Wednesday',
      marks: '160 Marks',
      subjects: ['Physics', 'Chemistry', 'Biology'],
      color: '#27AE60',
      bgColor: '#E8F8EF',
      icon: '🔬',
      screen: 'ODTResults',
      params: { type: 'PCB', title: 'ODT PCB Results' },
    },
    {
      id: 3,
      code: 'ODT PCM',
      name: 'OJAS Daily Test',
      subtitle: 'Physics • Chemistry • Maths',
      days: 'Thursday & Friday',
      marks: '120 Marks',
      subjects: ['Physics', 'Chemistry', 'Maths'],
      color: '#2980B9',
      bgColor: '#EBF3FF',
      icon: '📐',
      screen: 'ODTResults',
      params: { type: 'PCM', title: 'ODT PCM Results' },
    },
    {
      id: 4,
      code: 'THEORY',
      name: 'Theory Test',
      subtitle: 'All Subjects Combined',
      days: 'Every Saturday',
      marks: '100 Marks',
      subjects: ['Physics', 'Chemistry', 'Biology', 'Maths'],
      color: '#8E44AD',
      bgColor: '#F3E8FF',
      icon: '📖',
      screen: 'TheoryResults',
      params: { title: 'Theory Test Results' },
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>ACADEMIC RESULTS</Text>
        <Text style={styles.headerTitle}>My <Text style={styles.headerAccent}>Results</Text></Text>
        <Text style={styles.headerDesc}>
          Select a test type to view your detailed results and performance analysis.
        </Text>
      </View>

      {/* TEST TYPE CARDS */}
      <View style={styles.cardsContainer}>
        {testTypes.map((test) => (
          <TouchableOpacity
            key={test.id}
            style={[styles.testCard, { borderLeftColor: test.color }]}
            onPress={() => navigation.navigate(test.screen, { ...test.params, rollNumber })}>

            {/* Top Row */}
            <View style={styles.cardTop}>
              <View style={[styles.iconBox, { backgroundColor: test.bgColor }]}>
                <Text style={styles.testIcon}>{test.icon}</Text>
              </View>
              <View style={styles.cardInfo}>
                <View style={[styles.codeBadge, { backgroundColor: test.bgColor }]}>
                  <Text style={[styles.codeText, { color: test.color }]}>{test.code}</Text>
                </View>
                <Text style={styles.testName}>{test.name}</Text>
                <Text style={styles.testSubtitle}>{test.subtitle}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </View>

            {/* Bottom Row */}
            <View style={styles.cardBottom}>
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>📅</Text>
                <Text style={styles.metaText}>{test.days}</Text>
              </View>
              <View style={[styles.marksBadge, { backgroundColor: test.bgColor }]}>
                <Text style={[styles.marksText, { color: test.color }]}>{test.marks}</Text>
              </View>
            </View>

            {/* Subjects */}
            <View style={styles.subjectsRow}>
              {test.subjects.map((sub, i) => (
                <View key={i} style={styles.subjectChip}>
                  <Text style={styles.subjectChipText}>{sub}</Text>
                </View>
              ))}
            </View>

          </TouchableOpacity>
        ))}
      </View>

      {/* INFO BOX */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ About Results</Text>
        <Text style={styles.infoText}>
          • Results are updated by academy after each test{'\n'}
          • Each result shows: Correct, Wrong, Skipped & Total Marks{'\n'}
          • Contact academy if results are not updated{'\n'}
          • Results are individual and private
        </Text>
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

  // HEADER
  header: { backgroundColor: '#1A3A6C', padding: 24, paddingTop: 20 },
  headerLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 3, color: '#C9A227', textTransform: 'uppercase', marginBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: 'white', marginBottom: 8 },
  headerAccent: { color: '#C9A227' },
  headerDesc: { fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 22 },

  // CARDS
  cardsContainer: { padding: 16, gap: 14 },
  testCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, borderLeftWidth: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },

  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  iconBox: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  testIcon: { fontSize: 26 },
  cardInfo: { flex: 1 },
  codeBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 100, marginBottom: 4 },
  codeText: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  testName: { fontSize: 16, fontWeight: '700', color: '#0F2548', marginBottom: 2 },
  testSubtitle: { fontSize: 13, color: '#6B7280' },
  arrow: { fontSize: 28, color: '#9CA3AF', fontWeight: '300' },

  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaIcon: { fontSize: 14 },
  metaText: { fontSize: 13, color: '#6B7280' },
  marksBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  marksText: { fontSize: 13, fontWeight: '700' },

  subjectsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  subjectChip: { backgroundColor: '#F8FAFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#E5E7EB' },
  subjectChipText: { fontSize: 11, color: '#3D5278', fontWeight: '600' },

  // INFO BOX
  infoBox: { backgroundColor: '#EBF3FF', marginHorizontal: 16, borderRadius: 14, padding: 16, marginBottom: 12 },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#1A3A6C', marginBottom: 8 },
  infoText: { fontSize: 13, color: '#3D5278', lineHeight: 24 },

  // HOME BUTTON
  homeBtn: { marginHorizontal: 16, marginBottom: 32, backgroundColor: '#1A3A6C', padding: 16, borderRadius: 12, alignItems: 'center' },
  homeBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
});
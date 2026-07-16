import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking
} from 'react-native';

export default function ProgramsScreen({ navigation }) {
  const programs = [
    {
      tag: 'Foundation Program',
      name: 'AADHYA',
      subtitle: 'Building Future Toppers from the Right Stage',
      classes: 'Classes 8th, 9th & 10th',
      color: ['#0A4A2F', '#1A7A4A'],
      features: [
        'Building Future Toppers from Right Stage',
        'Step-by-step: Basics → Application → Mastery',
        'Daily study system with disciplined execution',
        'Intensive MCQ practice (NEET/JEE pattern)',
        'Weekly Tests & Cumulative Tests',
        'Advanced Error Analysis System (EAS)',
        'Smart revision strategy & booster modules',
      ],
    },
    {
      tag: 'Integrated Program',
      name: 'VISHWANATHA',
      subtitle: 'Board Excellence + Competitive Success',
      classes: 'Integrated PU + NEET + KCET',
      color: ['#1A2A6C', '#C41E3A'],
      features: [
        'Complete PU syllabus with NEET/KCET',
        'Dual focus: Descriptive + Objective',
        'Parallel preparation strategy',
        'Regular board + NEET/KCET pattern tests',
        'Time management & exam strategy training',
        'Strong conceptual clarity with application',
      ],
    },
    {
      tag: 'Long-Term NEET Coaching',
      name: 'VAIDYANATHA',
      subtitle: 'Focused Pathway to Medical Excellence',
      classes: 'Long-Term NEET Coaching',
      color: ['#0F2548', '#1A3A6C'],
      features: [
        'Complete NCERT mastery + NEET advanced',
        'Step-by-step: Basics → Application → Mastery',
        'Intensive MCQ practice (NEET pattern)',
        'Daily, Weekly, Monthly & Grand Tests',
        'Advanced Error Analysis System (EAS)',
        'Smart revision strategy & booster modules',
        'Intelligent guessing techniques training',
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>ACADEMIC PROGRAMS</Text>
        <Text style={styles.headerTitle}>Choose Your{'\n'}
          <Text style={styles.headerAccent}>Path to Excellence</Text>
        </Text>
        <Text style={styles.headerDesc}>
          Three distinct programs designed to meet every student at their stage.
        </Text>
      </View>

      {/* PROGRAM CARDS */}
      {programs.map((program, index) => (
        <View key={index} style={styles.programCard}>

          {/* Card Header */}
          <View style={[styles.cardHeader, { backgroundColor: program.color[0] }]}>
            <Text style={styles.cardTag}>{program.tag}</Text>
            <Text style={styles.cardName}>{program.name}</Text>
            <Text style={styles.cardSubtitle}>"{program.subtitle}"</Text>
          </View>

          {/* Card Body */}
          <View style={styles.cardBody}>
            <View style={styles.classTag}>
              <Text style={styles.classTagText}>{program.classes}</Text>
            </View>
            {program.features.map((feature, i) => (
              <View key={i} style={styles.featureRow}>
                <Text style={styles.featureDot}>✦</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.enquireBtn}
              onPress={() => navigation.navigate('Enquiry')}>
              <Text style={styles.enquireBtnText}>Enquire Now →</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* LIMITED SEATS BANNER */}
      <View style={styles.seatsBanner}>
        <Text style={styles.seatsWarning}>⚠️ Limited Seats Only</Text>
        <Text style={styles.seatsPrograms}>AADHYA • VISHWANATHA • VAIDYANATHA</Text>
        <TouchableOpacity
          style={styles.seatsBtn}
          onPress={() => navigation.navigate('Enquiry')}>
          <Text style={styles.seatsBtnText}>Secure Your Seat Now</Text>
        </TouchableOpacity>
      </View>

      {/* CONTACT */}
      <View style={styles.contactBar}>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => Linking.openURL('tel:+919632906660')}>
          <Text style={styles.callBtnText}>📞 Call Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.waBtn}
          onPress={() => Linking.openURL('https://wa.me/919632906660')}>
          <Text style={styles.waBtnText}>💬 WhatsApp</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // HEADER
  header: {
    backgroundColor: '#1A3A6C',
    padding: 28,
    paddingTop: 48,
  },
  headerLabel: {
    fontSize: 11, fontWeight: '600',
    letterSpacing: 3, color: '#C9A227',
    textTransform: 'uppercase', marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28, fontWeight: '700',
    color: 'white', lineHeight: 36, marginBottom: 12,
  },
  headerAccent: { color: '#C9A227' },
  headerDesc: {
    fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 22,
  },

  // PROGRAM CARD
  programCard: {
    margin: 16, borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
  },
  cardHeader: { padding: 28 },
  cardTag: {
    fontSize: 11, fontWeight: '600',
    letterSpacing: 2, color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase', marginBottom: 8,
  },
  cardName: {
    fontSize: 28, fontWeight: '700',
    color: 'white', marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13, color: 'rgba(255,255,255,0.75)',
    fontStyle: 'italic',
  },

  // CARD BODY
  cardBody: { backgroundColor: 'white', padding: 24 },
  classTag: {
    backgroundColor: '#F8FAFF', paddingHorizontal: 14,
    paddingVertical: 6, borderRadius: 100,
    alignSelf: 'flex-start', marginBottom: 18,
  },
  classTagText: { fontSize: 13, fontWeight: '700', color: '#1A3A6C' },
  featureRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: 10, paddingVertical: 7,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  featureDot: { color: '#C9A227', fontSize: 11, marginTop: 2 },
  featureText: { flex: 1, fontSize: 14, color: '#3D5278', lineHeight: 20 },
  enquireBtn: {
    borderWidth: 2, borderColor: '#1A3A6C',
    borderRadius: 8, padding: 14,
    alignItems: 'center', marginTop: 18,
  },
  enquireBtnText: { color: '#1A3A6C', fontWeight: '700', fontSize: 15 },

  // SEATS BANNER
  seatsBanner: {
    margin: 16, padding: 24,
    borderWidth: 2, borderColor: '#C9A227',
    borderRadius: 16, alignItems: 'center',
    backgroundColor: '#FFFDF0',
  },
  seatsWarning: {
    fontSize: 18, fontWeight: '700',
    color: '#C9A227', marginBottom: 8,
  },
  seatsPrograms: {
    fontSize: 14, color: '#3D5278', marginBottom: 18,
  },
  seatsBtn: {
    backgroundColor: '#C9A227',
    paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 8,
  },
  seatsBtnText: { color: '#0F2548', fontWeight: '700', fontSize: 15 },

  // CONTACT BAR
  contactBar: {
    flexDirection: 'row', gap: 12,
    padding: 16, marginBottom: 24,
  },
  callBtn: {
    flex: 1, backgroundColor: '#1A3A6C',
    padding: 14, borderRadius: 10, alignItems: 'center',
  },
  callBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  waBtn: {
    flex: 1, backgroundColor: '#25D366',
    padding: 14, borderRadius: 10, alignItems: 'center',
  },
  waBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
});
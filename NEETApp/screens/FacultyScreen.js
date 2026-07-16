import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Linking, Image
} from 'react-native';

export default function FacultyScreen() {
  const [expandedId, setExpandedId] = useState(null);

  const faculty = [
    {
      id: 1,
      name: 'Hanumantha Rao Y',
      role: 'Founder, Academic Director & HOD Chemistry',
      subject: 'Academic Leadership & Strategy',
      badge: 'Founder',
      badgeColor: '#FFF3E0',
      badgeTextColor: '#B84A00',
      headerColor: '#1A3A6C',
      image: require('../assets/images/faculty/founder.jpg'),
      experience: '18+ Years',
      tagline: 'Visionary Educator | Academic Strategist | Mentor of Results',
      quote: '"Your Dream. Our Mission. Your Success. Our Pride."',
      highlights: [
        '18+ Years of Academic Leadership',
        'Mentored thousands across Karnataka',
        'Expert in NEET, JEE & K-CET Coaching',
        'Founder of OJAS ONE Academy',
        'Specialist in Scientific Study Methodology',
      ],
      message: 'Every student possesses immense potential. Success is the result of clarity, consistency, discipline, and dedicated mentorship. At OJAS ONE, we create an ecosystem that encourages intellectual growth, critical thinking, and emotional resilience.',
    },
    {
      id: 2,
      name: 'Dr. Ravi Shankara B.E.',
      role: 'Co-Founder & HOD Chemistry',
      subject: 'Chemistry — NEET & KCET',
      badge: 'Chemistry',
      badgeColor: '#FFF3E0',
      badgeTextColor: '#B84A00',
      headerColor: '#B84A00',
      image: require('../assets/images/faculty/co-founder.jpg'),
      experience: '20+ Years',
      tagline: 'Academic Consultant | Researcher | Chemistry Educator',
      quote: '"Excellence is not an achievement; it is a habit built through discipline, dedication, and continuous learning."',
      highlights: [
        'B.Ed., M.Sc., M.Phil., Ph.D.',
        '20+ Years Teaching & Research Experience',
        'Mnemonic Learning Techniques Expert',
        'HOD Chemistry — OJAS ONE Academy',
        'Mentored 1000s of NEET/JEE students',
      ],
      message: 'Chemistry is not merely studied as a subject but appreciated as a fascinating science that explains the world around us. We aim to make learning both meaningful and enjoyable through innovative teaching methodologies.',
    },
    {
      id: 3,
      name: 'Mr. Dilip Kumar',
      role: 'Head of Department — Physics',
      subject: 'Physics — NEET, JEE & KCET',
      badge: 'Physics',
      badgeColor: '#EBF3FF',
      badgeTextColor: '#1A3A6C',
      headerColor: '#0F2548',
      image: require('../assets/images/faculty/physics.jpg'),
      experience: '15+ Years',
      tagline: 'Physics Educator | Academic Mentor | Competitive Exam Specialist',
      quote: '"Great achievements begin with clear concepts, consistent effort, and an unwavering belief in oneself."',
      highlights: [
        'M.Tech — Pondicherry University',
        '15+ Years Competitive Exam Coaching',
        'JIPMER & Top Medical College Selections',
        'HOD Physics — OJAS ONE Academy',
        'Expert in Conceptual & Application-Based Learning',
      ],
      message: 'Physics is a way of understanding the universe. Success in NEET, JEE, and K-CET requires conceptual clarity, analytical thinking, and consistent practice — not just memorization.',
    },
    {
      id: 4,
      name: 'Dr. Haseebur Rahman',
      role: 'Head of Department — Biology',
      subject: 'Biology — NEET Specialist',
      badge: 'Biology',
      badgeColor: '#E8F8EF',
      badgeTextColor: '#0A5A30',
      headerColor: '#0A5A30',
      image: require('../assets/images/faculty/biology.jpg'),
      experience: '14+ Years',
      tagline: 'Research Scholar | Scientist | Senior NEET Biology Faculty',
      quote: '"Success in Biology is not about memorizing facts; it is about understanding life, connecting concepts, and applying knowledge with confidence."',
      highlights: [
        'Ph.D. — Biotechnology',
        '14+ Years Teaching & Research Experience',
        'NCERT Mastery & NEET Strategy Expert',
        'HOD Biology — OJAS ONE Academy',
        'Smart Memory & Revision Techniques',
      ],
      message: 'Biology is the foundation of every future doctor\'s career. At OJAS ONE, we combine NCERT mastery, conceptual clarity, and examination-oriented preparation to help every student excel.',
    },
    {
      id: 5,
      name: 'Mr. Kuresh Netha',
      role: 'Academic Coordinator',
      subject: 'Academic Planning & Student Support',
      badge: 'Coordinator',
      badgeColor: '#F3E8FF',
      badgeTextColor: '#4A1A8C',
      headerColor: '#4A1A8C',
      image: require('../assets/images/faculty/coordinator.jpg'),
      experience: '10+ Years',
      tagline: 'Bridging Vision with Execution for Student Success',
      quote: '"Every plan becomes a reality when a committed team works together with purpose, passion, and perseverance."',
      highlights: [
        'Academic Progress Monitoring',
        'Student-Centric Learning Environment',
        'Faculty & Admin Coordination',
        'Individual Student Support & Guidance',
        'Strategic Academic Planning',
      ],
      message: 'My focus is to monitor academic progress, facilitate timely support, and ensure that every student receives the guidance, attention, and resources needed to achieve their fullest potential.',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>MEET THE EXPERTS</Text>
        <Text style={styles.headerTitle}>Our <Text style={styles.headerAccent}>Expert Team</Text></Text>
        <Text style={styles.headerDesc}>
          Our faculty are not just teachers — they are mentors, researchers, and subject matter experts who have shaped hundreds of successful medical careers.
        </Text>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        {[
          { num: '5+', label: 'Expert Faculty' },
          { num: '75+', label: 'Years Combined Exp.' },
          { num: '2000+', label: 'Students Mentored' },
          { num: '500+', label: 'NEET Selections' },
        ].map((stat, i) => (
          <View key={i} style={styles.statItem}>
            <Text style={styles.statNum}>{stat.num}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* FACULTY CARDS */}
      {faculty.map((f) => (
        <View key={f.id} style={styles.facultyCard}>

          {/* Card Top */}
          <View style={[styles.cardTop, { backgroundColor: f.headerColor }]}>
            <Image source={f.image} style={styles.cardAvatar} />
            <View style={styles.cardTopInfo}>
              <View style={[styles.badge, { backgroundColor: f.badgeColor }]}>
                <Text style={[styles.badgeText, { color: f.badgeTextColor }]}>{f.badge}</Text>
              </View>
              <Text style={styles.cardName}>{f.name}</Text>
              <Text style={styles.cardRole}>{f.role}</Text>
              <Text style={styles.cardSubject}>{f.subject}</Text>
            </View>
          </View>

          {/* Experience Badge */}
          <View style={styles.expBadge}>
            <Text style={styles.expText}>⭐ {f.experience} Experience</Text>
          </View>

          {/* Card Body */}
          <View style={styles.cardBody}>

            {/* Tagline */}
            <Text style={styles.tagline}>{f.tagline}</Text>

            {/* Highlights */}
            {f.highlights.map((item, i) => (
              <View key={i} style={styles.highlightRow}>
                <Text style={styles.highlightCheck}>✓</Text>
                <Text style={styles.highlightText}>{item}</Text>
              </View>
            ))}

            {/* Expandable Message */}
            <TouchableOpacity
              style={styles.readMoreBtn}
              onPress={() => setExpandedId(expandedId === f.id ? null : f.id)}>
              <Text style={styles.readMoreText}>
                {expandedId === f.id ? '▲ Hide Message' : '▼ Read Message'}
              </Text>
            </TouchableOpacity>

            {expandedId === f.id && (
              <View style={styles.messageBox}>
                <Text style={styles.messageText}>{f.message}</Text>
              </View>
            )}

            {/* Quote */}
            <View style={styles.quoteBox}>
              <Text style={styles.quoteText}>{f.quote}</Text>
            </View>

          </View>
        </View>
      ))}

      {/* JOIN BANNER */}
      <View style={styles.joinBanner}>
        <Text style={styles.joinTitle}>Learn from the Best!</Text>
        <Text style={styles.joinDesc}>
          Our faculty combine deep subject knowledge with proven teaching methods to maximize your NEET score.
        </Text>
        <TouchableOpacity
          style={styles.joinBtn}
          onPress={() => Linking.openURL('https://wa.me/919632906660')}>
          <Text style={styles.joinBtnText}>💬 Book Free Counselling</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // HEADER
  header: { backgroundColor: '#1A3A6C', padding: 28, paddingTop: 48 },
  headerLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 3, color: '#C9A227', textTransform: 'uppercase', marginBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: 'white', marginBottom: 12 },
  headerAccent: { color: '#C9A227' },
  headerDesc: { fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 22 },

  // STATS
  statsRow: { flexDirection: 'row', backgroundColor: '#2b4c7e', padding: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: '900', color: '#C9A227' },
  statLabel: { fontSize: 9, color: 'rgba(255,255,255,0.65)', textAlign: 'center', marginTop: 2 },

  // FACULTY CARD
  facultyCard: { margin: 16, borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  cardTop: { padding: 20, flexDirection: 'row', alignItems: 'center', gap: 14 },
  cardAvatar: { width: 80, height: 80, borderRadius: 16, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  cardTopInfo: { flex: 1 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 100, marginBottom: 6 },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  cardName: { fontSize: 17, fontWeight: '700', color: 'white', marginBottom: 2 },
  cardRole: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '600', marginBottom: 2 },
  cardSubject: { fontSize: 11, color: 'rgba(255,255,255,0.65)' },

  // EXP BADGE
  expBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center' },
  expText: { fontSize: 13, fontWeight: '700', color: '#B84A00' },

  // CARD BODY
  cardBody: { backgroundColor: 'white', padding: 20 },
  tagline: { fontSize: 12, color: '#6B7280', fontStyle: 'italic', marginBottom: 14, lineHeight: 18 },
  highlightRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  highlightCheck: { color: '#C9A227', fontWeight: '700', fontSize: 14, marginTop: 1 },
  highlightText: { flex: 1, fontSize: 14, color: '#3D5278' },

  // READ MORE
  readMoreBtn: { marginTop: 14, paddingVertical: 8, alignItems: 'center', backgroundColor: '#F8FAFF', borderRadius: 8 },
  readMoreText: { fontSize: 13, color: '#1A3A6C', fontWeight: '700' },

  // MESSAGE
  messageBox: { backgroundColor: '#F8FAFF', borderRadius: 10, padding: 14, marginTop: 10, borderLeftWidth: 3, borderLeftColor: '#1A3A6C' },
  messageText: { fontSize: 13, color: '#3D5278', lineHeight: 22 },

  // QUOTE
  quoteBox: { backgroundColor: '#FFF8E8', borderRadius: 10, borderLeftWidth: 3, borderLeftColor: '#C9A227', padding: 14, marginTop: 14 },
  quoteText: { fontSize: 13, color: '#3D5278', fontStyle: 'italic', lineHeight: 20 },

  // JOIN BANNER
  joinBanner: { backgroundColor: '#1A3A6C', margin: 16, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 32 },
  joinTitle: { fontSize: 22, fontWeight: '700', color: '#C9A227', marginBottom: 10 },
  joinDesc: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  joinBtn: { backgroundColor: '#25D366', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 10 },
  joinBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
});
import ReviewsCarousel from '../components/ReviewsCarousel';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Linking, Dimensions, Image
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation, isLoggedIn, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* NAVBAR */}
      <View style={styles.navbar}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.navLogo}
          resizeMode="contain"
        />
        <View style={styles.navButtons}>
          {isLoggedIn ? (
            <TouchableOpacity style={styles.navLogin}
              onPress={() => navigation.navigate('StudentApp')}>
              <Text style={styles.navLoginText}>📚 Dashboard</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.navLogin}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.navLoginText}>🔐 Login</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => setMenuOpen(!menuOpen)}>
            <Text style={styles.menuBtnText}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* HAMBURGER MENU DROPDOWN */}
      {menuOpen && (
        <View style={styles.menuDropdown}>
          {[
            { icon: '🏠', label: 'Home', action: () => { setMenuOpen(false); } },
            { icon: '📚', label: 'Programs', action: () => { setMenuOpen(false); navigation.navigate('Programs'); } },
            { icon: '👨‍🏫', label: 'Faculty', action: () => { setMenuOpen(false); navigation.navigate('Faculty'); } },
            { icon: '🖼️', label: 'Gallery', action: () => { setMenuOpen(false); navigation.navigate('Gallery'); } },
            { icon: '📞', label: 'Contact', action: () => { setMenuOpen(false); navigation.navigate('Contact'); } },
            { icon: '📝', label: 'Enquiry', action: () => { setMenuOpen(false); navigation.navigate('Enquiry'); } },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.menuItem}
              onPress={item.action}>
              <Text style={styles.menuItemIcon}>{item.icon}</Text>
              <Text style={styles.menuItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.menuDivider} />

          <View style={styles.menuSocial}>
            <TouchableOpacity style={styles.socialBtn}
              onPress={() => { setMenuOpen(false); Linking.openURL('https://wa.me/919632906660'); }}>
              <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/120px-WhatsApp.svg.png' }} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}
              onPress={() => { setMenuOpen(false); Linking.openURL('https://www.instagram.com'); }}>
              <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/120px-Instagram_icon.png' }} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}
              onPress={() => { setMenuOpen(false); Linking.openURL('https://twitter.com'); }}>
              <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/X_logo.jpg/120px-X_logo.jpg' }} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}
              onPress={() => { setMenuOpen(false); Linking.openURL('https://www.youtube.com'); }}>
              <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/120px-YouTube_full-color_icon_%282017%29.svg.png' }} style={styles.socialIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.menuAddress}>
            <Text style={styles.menuAddressText}>
              📍 Block M, Gangothri Campus, Rajiv Gandhi Nagar, Sunkadakatte, Bengaluru – 560091
            </Text>
            <Text style={styles.menuAddressText}>📞 +91 9632906660</Text>
          </View>

        </View>
      )}

      {/* HERO */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>🔴 Admissions Open 2025–26</Text>
        </View>
        <Text style={styles.heroSub}>NEET | KCET | FOUNDATION</Text>
        <Text style={styles.heroTitle}>Ojas One Academy{'\n'}
          <Text style={styles.heroTitleGold}>Of Excellence</Text>
        </Text>
        <Text style={styles.heroTagline}>Inner Strength for Ultimate Excellence</Text>
        <View style={styles.heroProgramTags}>
          {['NEET', 'K-CET', 'Foundation', 'PU Integrated'].map(tag => (
            <View key={tag} style={styles.progTag}>
              <Text style={styles.progTagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.heroBtns}>
          <TouchableOpacity style={styles.btnPrimary}
            onPress={() => navigation.navigate('Enquiry')}>
            <Text style={styles.btnPrimaryText}>Apply Now →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline}
            onPress={() => Linking.openURL('https://wa.me/919632906660')}>
            <Text style={styles.btnOutlineText}>💬 WhatsApp</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.heroFeatures}>
          {[
            '✓ Experienced Faculty',
            '✓ Scientific Learning System',
            '✓ Hostel Facility',
            '✓ NEET Focused Training',
            '✓ Integrated PU Program',
            '✓ Error Analysis System',
          ].map(f => (
            <View key={f} style={styles.heroFeat}>
              <Text style={styles.heroFeatText}>{f}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* STUDENT LOGIN BANNER */}
      <View style={styles.studentBanner}>
        <Text style={styles.studentBannerText}>🎓 Already a student?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.studentBannerLink}>Login to access your courses →</Text>
        </TouchableOpacity>
      </View>

      {/* STATS */}
      <View style={styles.statsSection}>
        {[
          { num: '2000+', label: 'Students Trained' },
          { num: '500+', label: 'NEET/KCET Selections' },
          { num: '25+', label: 'Expert Faculty' },
          { num: '5+', label: 'Years Excellence' },
        ].map(stat => (
          <View key={stat.label} style={styles.statItem}>
            <Text style={styles.statNum}>{stat.num}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* OJAS PHILOSOPHY */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>OUR PHILOSOPHY</Text>
        <Text style={styles.sectionTitle}>The <Text style={styles.accent}>OJAS</Text> Framework</Text>
        <View style={styles.ojasGrid}>
          {[
            { letter: 'O', word: 'Organize', color: '#E74C3C', desc: 'Structured Beginning of Success' },
            { letter: 'J', word: 'Justify', color: '#E67E22', desc: 'Deep Conceptual Understanding' },
            { letter: 'A', word: 'Apply', color: '#D4A017', desc: 'Turning Knowledge into Performance' },
            { letter: 'S', word: 'Solve', color: '#27AE60', desc: 'Mastery through Practice' },
            { letter: 'O', word: 'Observe', color: '#2980B9', desc: 'Intelligent Self-Monitoring' },
            { letter: 'N', word: 'Nurture', color: '#8E44AD', desc: 'Building Inner Power' },
            { letter: 'E', word: 'Excel', color: '#C0392B', desc: 'Ultimate Success & Achievement' },
          ].map((item, i) => (
            <View key={i} style={styles.ojasCard}>
              <Text style={[styles.ojasLetter, { color: item.color }]}>{item.letter}</Text>
              <Text style={styles.ojasWord}>{item.word}</Text>
              <Text style={styles.ojasDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ADVANTAGE */}
      <View style={[styles.section, styles.darkSection]}>
        <Text style={[styles.sectionLabel, { color: '#C9A227' }]}>THE DIFFERENCE</Text>
        <Text style={[styles.sectionTitle, { color: 'white' }]}>
          The OJAS ONE <Text style={{ color: '#C9A227' }}>Advantage</Text>
        </Text>
        {[
          { icon: '📐', title: 'Scientific Academic System', items: ['Chapter → Subtopic → Concept', 'Designed as per NEET/JEE', 'NCERT mastery + advanced level'] },
          { icon: '📊', title: 'Testing & Performance System', items: ['Daily tests & practice sheets', 'Weekly & monthly tests', 'Detailed performance reports'] },
          { icon: '🔍', title: 'Error Analysis System (EAS)', items: ['Identify concept errors', 'Spot silly mistakes', 'Personalized correction strategy'] },
          { icon: '🧠', title: 'Smart Revision System', items: ['Quick booster modules', 'Revision notes & worksheets', 'Continuous improvement loop'] },
        ].map((adv, i) => (
          <View key={i} style={styles.advCard}>
            <Text style={styles.advIcon}>{adv.icon}</Text>
            <View style={styles.advContent}>
              <Text style={styles.advTitle}>{adv.title}</Text>
              {adv.items.map((item, j) => (
                <Text key={j} style={styles.advItem}>→ {item}</Text>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* HOLISTIC */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>BEYOND ACADEMICS</Text>
        <Text style={styles.sectionTitle}>Holistic <Text style={styles.accent}>Development</Text></Text>
        <View style={styles.holisticGrid}>
          {[
            { emoji: '🧘', title: 'Yoga & Meditation', desc: 'Improves concentration & reduces stress' },
            { emoji: '⚽', title: 'Sports & Games', desc: 'Boosts fitness & improves focus' },
            { emoji: '💪', title: 'Mindset Training', desc: 'Confidence & exam temperament' },
            { emoji: '🤝', title: 'Personal Counselling', desc: 'Emotional strength & mentorship' },
          ].map((item, i) => (
            <View key={i} style={styles.holisticCard}>
              <Text style={styles.holisticEmoji}>{item.emoji}</Text>
              <Text style={styles.holisticTitle}>{item.title}</Text>
              <Text style={styles.holisticDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* FACILITIES */}
      <View style={[styles.section, { backgroundColor: '#F8FAFF' }]}>
        <Text style={styles.sectionLabel}>CAMPUS LIFE</Text>
        <Text style={styles.sectionTitle}>World-Class <Text style={styles.accent}>Facilities</Text></Text>
        <View style={styles.facilitiesGrid}>
          {[
            { icon: '🏫', name: 'Spacious Classrooms' },
            { icon: '⚗️', name: 'Physics Lab' },
            { icon: '🧪', name: 'Chemistry Lab' },
            { icon: '🔬', name: 'Biology Lab' },
            { icon: '📚', name: 'Library' },
            { icon: '🏠', name: 'Hostel' },
            { icon: '🧘', name: 'Meditation Hall' },
            { icon: '🍽️', name: 'Dining Hall' },
            { icon: '🚌', name: 'Transport' },
            { icon: '🏀', name: 'Sports Area' },
            { icon: '👤', name: 'Mentoring' },
            { icon: '💬', name: 'Counselling' },
          ].map((f, i) => (
            <View key={i} style={styles.facilityCard}>
              <Text style={styles.facilityIcon}>{f.icon}</Text>
              <Text style={styles.facilityName}>{f.name}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* GOOGLE REVIEWS CAROUSEL */}
      <ReviewsCarousel />
      

      {/* ADMISSION STEPS */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>HOW TO JOIN</Text>
        <Text style={styles.sectionTitle}>Admission <Text style={styles.accent}>Process</Text></Text>
        {[
          { num: '01', title: 'Register', desc: 'Fill the enquiry form or call us' },
          { num: '02', title: 'Counselling', desc: 'Free one-on-one counselling session' },
          { num: '03', title: 'Assessment', desc: 'Diagnostic test to place you right' },
          { num: '04', title: 'Admission', desc: 'Complete formalities & begin journey!' },
        ].map((step, i) => (
          <View key={i} style={styles.stepItem}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{step.num}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.btnPrimary}
          onPress={() => navigation.navigate('Enquiry')}>
          <Text style={styles.btnPrimaryText}>Secure Your Seat Now →</Text>
        </TouchableOpacity>
      </View>

      {/* CONTACT FOOTER */}
      <View style={[styles.section, styles.darkSection]}>
        <Text style={[styles.sectionTitle, { color: 'white', textAlign: 'center' }]}>Get In <Text style={{ color: '#C9A227' }}>Touch</Text></Text>
        <View style={styles.contactBlock}>
          <Text style={styles.contactIcon}>📍</Text>
          <Text style={styles.contactText}>Block M, Gangothri Campus, Rajiv Gandhi Nagar, Sunkadakatte, Bengaluru – 560091</Text>
        </View>
        <View style={styles.contactBlock}>
          <Text style={styles.contactIcon}>📞</Text>
          <Text style={styles.contactText}>+91 9632906660 | +91 9845416820</Text>
        </View>
        <View style={styles.contactBlock}>
          <Text style={styles.contactIcon}>✉️</Text>
          <Text style={styles.contactText}>ojasoneacademy@gmail.com</Text>
        </View>
        <View style={styles.contactBtns}>
          <TouchableOpacity style={styles.btnCall}
            onPress={() => Linking.openURL('tel:+919632906660')}>
            <Text style={styles.btnCallText}>📞 Call Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnWhatsapp}
            onPress={() => Linking.openURL('https://wa.me/919632906660')}>
            <Text style={styles.btnWhatsappText}>💬 WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 OJAS ONE Academy of Excellence</Text>
        <Text style={styles.footerSub}>Inner Strength for Ultimate Excellence</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },

  // NAVBAR
  navbar: { backgroundColor: '#F8FAFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12},
  navLogo: { width: 200, height: 80 },
  navButtons: { flexDirection: 'row', gap: 8, alignItems: 'center', flex: 1, justifyContent: 'flex-end', paddingRight: 0 },
  navLogin: { borderWidth: 1, borderColor: '#C9A227', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  navLoginText: { color: '#C9A227', fontWeight: '700', fontSize: 13 },
  menuBtn: { backgroundColor: '#1A3A6C', borderRadius: 8, padding: 2, marginLeft: 0 },
  menuBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },

  // MENU DROPDOWN
  menuDropdown: { backgroundColor: '#0F2548', borderBottomWidth: 1, borderBottomColor: 'rgba(201,162,39,0.2)', zIndex: 999 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  menuItemIcon: { fontSize: 20 },
  menuItemText: { fontSize: 15, color: 'white', fontWeight: '600' },
  menuDivider: { height: 1, backgroundColor: 'rgba(201,162,39,0.3)', marginVertical: 4 },
  menuSocial: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 14 },
  socialBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  socialBtnText: { fontSize: 22 },
  socialIcon: { width: 28, height: 28, borderRadius: 6 },
  menuAddress: { paddingHorizontal: 20, paddingBottom: 16, gap: 6 },
  menuAddressText: { fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 20 },

  // STUDENT BANNER
  studentBanner: { backgroundColor: '#EBF3FF', padding: 16, marginHorizontal: 16, borderRadius: 12, marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  studentBannerText: { fontSize: 14, color: '#1A3A6C', fontWeight: '600' },
  studentBannerLink: { fontSize: 14, color: '#C9A227', fontWeight: '700' },

  // HERO
  hero: { backgroundColor: '#F8FAFF', padding: 24, paddingTop: 10 },
  heroBadge: { backgroundColor: 'rgba(201,162,39,0.15)', borderWidth: 1, borderColor: 'rgba(201,162,39,0.4)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, alignSelf: 'flex-start', marginBottom: 16 },
  heroBadgeText: { color: '#C9A227', fontSize: 13, fontWeight: '700' },
  heroSub: { fontSize: 12, color: '#6b7280', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 12 },
  heroTitle: { fontSize: 32, fontWeight: '700', color: '#0F2548', lineHeight: 40, marginBottom: 8 },
  heroTitleGold: { color: '#C9A227' },
  heroTagline: { fontSize: 16, color: '#4b5563', fontStyle: 'italic', marginBottom: 20 },
  heroProgramTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  progTag: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dbe3f0', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6 },
  progTagText: { color: '#0F2548', fontSize: 13, fontWeight: '700' },
  heroBtns: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  heroFeatures: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  heroFeat: { width: '48%' },
  heroFeatText: { fontSize: 13, color: '#374151', fontWeight: '500' },

  // BUTTONS
  btnPrimary: { backgroundColor: '#C9A227', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnPrimaryText: { color: '#0F2548', fontWeight: '700', fontSize: 15 },
  btnOutline: { borderWidth: 2, borderColor: '#1A3A6C', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 8 },
  btnOutlineText: { color: '#1A3A6C', fontWeight: '700', fontSize: 15 },

  // STATS
  statsSection: { backgroundColor: '#2b4c7e', flexDirection: 'row', flexWrap: 'wrap', padding: 24, gap: 8 },
  statItem: { width: '48%', alignItems: 'center', paddingVertical: 12 },
  statNum: { fontSize: 36, fontWeight: '900', color: '#C9A227' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, textAlign: 'center' },

  // SECTIONS
  section: { padding: 24 },
  darkSection: { backgroundColor: '#1A3A6C' },
  sectionLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 3, color: '#C9A227', textTransform: 'uppercase', marginBottom: 8 },
  sectionTitle: { fontSize: 26, fontWeight: '700', color: '#0F2548', marginBottom: 20, lineHeight: 34 },
  accent: { color: '#C9A227' },

  // OJAS
  ojasGrid: { gap: 12 },
  ojasCard: { backgroundColor: '#F8FAFF', borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: '#C9A227' },
  ojasLetter: { fontSize: 32, fontWeight: '700', marginBottom: 4 },
  ojasWord: { fontSize: 14, fontWeight: '700', color: '#1A3A6C', textTransform: 'uppercase', letterSpacing: 1 },
  ojasDesc: { fontSize: 13, color: '#6b7280', marginTop: 4 },

  // ADVANTAGE
  advCard: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: 16, marginBottom: 12, gap: 14 },
  advIcon: { fontSize: 32 },
  advContent: { flex: 1 },
  advTitle: { fontSize: 16, fontWeight: '700', color: 'white', marginBottom: 8 },
  advItem: { fontSize: 13, color: 'rgba(255,255,255,0.65)', paddingVertical: 2 },

  // HOLISTIC
  holisticGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  holisticCard: { width: '48%', backgroundColor: '#F8FAFF', borderRadius: 14, padding: 16, alignItems: 'center' },
  holisticEmoji: { fontSize: 36, marginBottom: 10 },
  holisticTitle: { fontSize: 15, fontWeight: '700', color: '#0F2548', marginBottom: 6, textAlign: 'center' },
  holisticDesc: { fontSize: 12, color: '#6b7280', textAlign: 'center', lineHeight: 18 },

  // FACILITIES
  facilitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  facilityCard: { width: '30%', backgroundColor: 'white', borderRadius: 10, padding: 12, alignItems: 'center', borderTopWidth: 3, borderTopColor: '#C9A227' },
  facilityIcon: { fontSize: 28, marginBottom: 6 },
  facilityName: { fontSize: 11, fontWeight: '700', color: '#0F2548', textAlign: 'center' },

  // TESTIMONIALS
  testiCard: { backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: 20, marginBottom: 12 },
  testiQuote: { fontSize: 40, color: '#C9A227', lineHeight: 44 },
  testiText: { fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 22, fontStyle: 'italic', marginBottom: 16 },
  testiAuthor: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  testiAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#C9A227', alignItems: 'center', justifyContent: 'center' },
  testiAvatarText: { color: '#0F2548', fontWeight: '700', fontSize: 18 },
  testiName: { fontSize: 15, fontWeight: '700', color: 'white' },
  testiRank: { fontSize: 12, color: '#C9A227', marginTop: 2 },

  // ADMISSION STEPS
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  stepNum: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#C9A227', alignItems: 'center', justifyContent: 'center' },
  stepNumText: { color: '#0F2548', fontWeight: '700', fontSize: 18 },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 16, fontWeight: '700', color: '#0F2548' },
  stepDesc: { fontSize: 13, color: '#6b7280', marginTop: 2 },

  // CONTACT
  contactBlock: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  contactIcon: { fontSize: 20 },
  contactText: { flex: 1, fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 22 },
  contactBtns: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btnCall: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', padding: 14, borderRadius: 10, alignItems: 'center' },
  btnCallText: { color: 'white', fontWeight: '700', fontSize: 15 },
  btnWhatsapp: { flex: 1, backgroundColor: '#25D366', padding: 14, borderRadius: 10, alignItems: 'center' },
  btnWhatsappText: { color: 'white', fontWeight: '700', fontSize: 15 },

  // FOOTER
  footer: { backgroundColor: '#080F1E', padding: 24, alignItems: 'center' },
  footerText: { color: 'rgba(255,255,255,0.35)', fontSize: 13 },
  footerSub: { color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: 4 },
});
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Linking
} from 'react-native';

export default function ContactScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>GET IN TOUCH</Text>
        <Text style={styles.headerTitle}>Contact <Text style={styles.headerAccent}>Us</Text></Text>
        <Text style={styles.headerDesc}>
          We are here to help! Reach out to us through any of the channels below.
        </Text>
      </View>

      {/* QUICK CONTACT BUTTONS */}
      <View style={styles.quickBtns}>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => Linking.openURL('tel:+919632906660')}>
          <Text style={styles.quickBtnIcon}>📞</Text>
          <Text style={styles.quickBtnText}>Call Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.waBtn}
          onPress={() => Linking.openURL('https://wa.me/919632906660')}>
          <Text style={styles.quickBtnIcon}>💬</Text>
          <Text style={styles.quickBtnText}>WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.emailBtn}
          onPress={() => Linking.openURL('mailto:ojasoneacademy@gmail.com')}>
          <Text style={styles.quickBtnIcon}>✉️</Text>
          <Text style={styles.quickBtnText}>Email</Text>
        </TouchableOpacity>
      </View>

      {/* CONTACT DETAILS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact <Text style={styles.accent}>Details</Text></Text>

        {/* Phone */}
        <View style={styles.contactCard}>
          <View style={[styles.contactIconBox, { backgroundColor: '#EBF3FF' }]}>
            <Text style={styles.contactIconText}>📞</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Phone Numbers</Text>
            <TouchableOpacity onPress={() => Linking.openURL('tel:+919632906660')}>
              <Text style={styles.contactValue}>+91 9632906660</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('tel:+919845416820')}>
              <Text style={styles.contactValue}>+91 9845416820</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Email */}
        <View style={styles.contactCard}>
          <View style={[styles.contactIconBox, { backgroundColor: '#FFF3E0' }]}>
            <Text style={styles.contactIconText}>✉️</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Email Address</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL('mailto:ojasoneacademy@gmail.com')}>
              <Text style={styles.contactValue}>ojasoneacademy@gmail.com</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Address */}
        <View style={styles.contactCard}>
          <View style={[styles.contactIconBox, { backgroundColor: '#E8F8EF' }]}>
            <Text style={styles.contactIconText}>📍</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Address</Text>
            <Text style={styles.contactValue}>
              Block M, Gangothri Campus,{'\n'}
              Rajiv Gandhi Nagar,{'\n'}
              Sunkadakatte,{'\n'}
              Bengaluru – 560091
            </Text>
            <TouchableOpacity
              style={styles.mapsBtn}
              onPress={() => Linking.openURL('https://maps.google.com/?q=Sunkadakatte+Bengaluru')}>
              <Text style={styles.mapsBtnText}>📍 Open in Google Maps</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Timing */}
        <View style={styles.contactCard}>
          <View style={[styles.contactIconBox, { backgroundColor: '#F3E8FF' }]}>
            <Text style={styles.contactIconText}>🕐</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Office Hours</Text>
            <Text style={styles.contactValue}>Monday – Saturday</Text>
            <Text style={styles.contactValue}>9:00 AM – 6:00 PM</Text>
          </View>
        </View>
      </View>

      {/* SOCIAL MEDIA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Follow <Text style={styles.accent}>Us</Text></Text>
        <View style={styles.socialGrid}>
          <TouchableOpacity
            style={[styles.socialCard, { backgroundColor: '#E8F4FD' }]}
            onPress={() => Linking.openURL('https://www.facebook.com')}>
            <Text style={styles.socialIcon}>📘</Text>
            <Text style={styles.socialName}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialCard, { backgroundColor: '#FDE8F4' }]}
            onPress={() => Linking.openURL('https://www.instagram.com')}>
            <Text style={styles.socialIcon}>📸</Text>
            <Text style={styles.socialName}>Instagram</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialCard, { backgroundColor: '#E8FDE8' }]}
            onPress={() => Linking.openURL('https://wa.me/919632906660')}>
            <Text style={styles.socialIcon}>💬</Text>
            <Text style={styles.socialName}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialCard, { backgroundColor: '#FDEEE8' }]}
            onPress={() => Linking.openURL('https://www.youtube.com')}>
            <Text style={styles.socialIcon}>▶️</Text>
            <Text style={styles.socialName}>YouTube</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CTA BANNER */}
      <View style={styles.ctaBanner}>
        <Text style={styles.ctaTitle}>Ready to Join OJAS ONE?</Text>
        <Text style={styles.ctaDesc}>
          Take the first step towards your NEET success today!
        </Text>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => Linking.openURL('https://wa.me/919632906660?text=Hi, I want to know more about OJAS ONE Academy admissions.')}>
          <Text style={styles.ctaBtnText}>💬 Chat With Us Now</Text>
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
    padding: 28, paddingTop: 48,
  },
  headerLabel: {
    fontSize: 11, fontWeight: '600',
    letterSpacing: 3, color: '#C9A227',
    textTransform: 'uppercase', marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28, fontWeight: '700',
    color: 'white', marginBottom: 12,
  },
  headerAccent: { color: '#C9A227' },
  headerDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)', lineHeight: 22,
  },

  // QUICK BUTTONS
  quickBtns: {
    flexDirection: 'row', gap: 10,
    padding: 16, backgroundColor: '#F8FAFF',
  },
  callBtn: {
    flex: 1, backgroundColor: '#1A3A6C',
    borderRadius: 12, padding: 14, alignItems: 'center',
  },
  waBtn: {
    flex: 1, backgroundColor: '#25D366',
    borderRadius: 12, padding: 14, alignItems: 'center',
  },
  emailBtn: {
    flex: 1, backgroundColor: '#C9A227',
    borderRadius: 12, padding: 14, alignItems: 'center',
  },
  quickBtnIcon: { fontSize: 22, marginBottom: 4 },
  quickBtnText: { color: 'white', fontWeight: '700', fontSize: 12 },

  // SECTION
  section: { padding: 24 },
  sectionTitle: {
    fontSize: 22, fontWeight: '700',
    color: '#0F2548', marginBottom: 16,
  },
  accent: { color: '#C9A227' },

  // CONTACT CARDS
  contactCard: {
    flexDirection: 'row', gap: 16,
    padding: 16, borderRadius: 14,
    borderWidth: 1, borderColor: '#F0F0F0',
    marginBottom: 12, backgroundColor: '#FAFAFA',
  },
  contactIconBox: {
    width: 48, height: 48, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  contactIconText: { fontSize: 22 },
  contactInfo: { flex: 1 },
  contactLabel: {
    fontSize: 12, fontWeight: '600',
    color: '#9CA3AF', textTransform: 'uppercase',
    letterSpacing: 1, marginBottom: 4,
  },
  contactValue: {
    fontSize: 14, color: '#1A3A6C',
    fontWeight: '500', lineHeight: 22,
  },
  mapsBtn: {
    marginTop: 8, backgroundColor: '#EBF3FF',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 6, alignSelf: 'flex-start',
  },
  mapsBtnText: { fontSize: 12, color: '#1A3A6C', fontWeight: '600' },

  // SOCIAL
  socialGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
  },
  socialCard: {
    width: '47%', borderRadius: 14,
    padding: 16, alignItems: 'center',
  },
  socialIcon: { fontSize: 32, marginBottom: 8 },
  socialName: { fontSize: 14, fontWeight: '600', color: '#1A3A6C' },

  // CTA
  ctaBanner: {
    backgroundColor: '#1A3A6C',
    margin: 16, borderRadius: 16,
    padding: 24, alignItems: 'center',
    marginBottom: 32,
  },
  ctaTitle: {
    fontSize: 22, fontWeight: '700',
    color: '#C9A227', marginBottom: 10,
  },
  ctaDesc: {
    fontSize: 14, color: 'rgba(255,255,255,0.7)',
    textAlign: 'center', lineHeight: 22, marginBottom: 20,
  },
  ctaBtn: {
    backgroundColor: '#25D366',
    paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 10,
  },
  ctaBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
});
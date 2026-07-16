import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Linking, Image
} from 'react-native';

export default function GalleryScreen() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Campus', 'Classroom', 'Labs', 'Events', 'Sports'];

  const galleryItems = [
    { id: 1, image: require('../assets/images/gallery/campus.jpg'), title: 'Main Campus Building', category: 'Campus', desc: 'Our state-of-the-art campus in Sunkadakatte, Bengaluru' },
    { id: 2, image: require('../assets/images/gallery/classroom.jpg'), title: 'Smart Classrooms', category: 'Classroom', desc: 'Modern classrooms with digital learning tools' },
    { id: 3, image: require('../assets/images/gallery/chemistry_lab.jpg'), title: 'Chemistry Lab', category: 'Labs', desc: 'Fully equipped chemistry laboratory' },
    { id: 4, image: require('../assets/images/gallery/biology_lab.jpg'), title: 'Biology Lab', category: 'Labs', desc: 'Advanced biology lab with microscopes' },
    { id: 5, image: require('../assets/images/gallery/physics_lab.jpg'), title: 'Physics Lab', category: 'Labs', desc: 'Modern physics lab for practical learning' },
    { id: 6, image: require('../assets/images/gallery/hostel.jpg'), title: 'Hostel Facility', category: 'Campus', desc: 'Comfortable hostel for outstation students' },
    { id: 7, image: require('../assets/images/gallery/dining.jpg'), title: 'Dining Hall', category: 'Campus', desc: 'Hygienic and nutritious meals for students' },
    { id: 8, image: require('../assets/images/gallery/sports.jpg'), title: 'Sports Area', category: 'Sports', desc: 'Open sports area for physical fitness' },
  ];

  const filtered = activeFilter === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>CAMPUS LIFE</Text>
        <Text style={styles.headerTitle}>Our <Text style={styles.headerAccent}>Gallery</Text></Text>
        <Text style={styles.headerDesc}>
          Take a virtual tour of OJAS ONE Academy — our campus, facilities, events and student life.
        </Text>
      </View>

      {/* STATS ROW */}
      <View style={styles.statsRow}>
        {[
          { num: '2+', label: 'Acre Campus' },
          { num: '20+', label: 'Classrooms' },
          { num: '3', label: 'Science Labs' },
          { num: '500+', label: 'Hostel Capacity' },
        ].map((stat, i) => (
          <View key={i} style={styles.statItem}>
            <Text style={styles.statNum}>{stat.num}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* FILTERS */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtersRow}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterBtn, activeFilter === filter && styles.filterBtnActive]}
                onPress={() => setActiveFilter(filter)}>
                <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* GALLERY GRID */}
      <View style={styles.galleryGrid}>
        {filtered.map((item) => (
          <View key={item.id} style={styles.galleryCard}>
            <View style={styles.galleryImageBox}>
              <Image
                source={item.image}
                style={styles.galleryImage}
                resizeMode="cover"
              />
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{item.category}</Text>
              </View>
            </View>
            <View style={styles.galleryInfo}>
              <Text style={styles.galleryTitle}>{item.title}</Text>
              <Text style={styles.galleryDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* VISIT CTA */}
      <View style={styles.visitBanner}>
        <Text style={styles.visitTitle}>🏫 Visit Our Campus</Text>
        <Text style={styles.visitDesc}>
          Schedule a free campus tour and see our world-class facilities in person!
        </Text>
        <View style={styles.visitBtns}>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => Linking.openURL('tel:+919632906660')}>
            <Text style={styles.callBtnText}>📞 Call to Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.waBtn}
            onPress={() => Linking.openURL('https://wa.me/919632906660?text=Hi, I want to schedule a campus visit.')}>
            <Text style={styles.waBtnText}>💬 WhatsApp</Text>
          </TouchableOpacity>
        </View>
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

  // STATS
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#2b4c7e',
    padding: 16,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '900', color: '#C9A227' },
  statLabel: {
    fontSize: 10, color: 'rgba(255,255,255,0.65)',
    textAlign: 'center', marginTop: 2,
  },

  // FILTERS
  filtersContainer: { paddingVertical: 16 },
  filtersRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8 },
  filterBtn: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 100, borderWidth: 1.5,
    borderColor: '#E5E7EB', backgroundColor: '#FAFAFA',
  },
  filterBtnActive: {
    backgroundColor: '#1A3A6C', borderColor: '#1A3A6C',
  },
  filterText: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  filterTextActive: { color: 'white' },

  // GALLERY GRID
  galleryGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    padding: 12, gap: 12,
  },
  galleryCard: {
    width: '47%', borderRadius: 14,
    overflow: 'hidden', borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  galleryImageBox: {
    height: 120, backgroundColor: '#F8FAFF',
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(26,58,108,0.85)',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: { fontSize: 10, color: 'white', fontWeight: '600' },
  galleryInfo: { padding: 10 },
  galleryTitle: {
    fontSize: 13, fontWeight: '700',
    color: '#0F2548', marginBottom: 4,
  },
  galleryDesc: { fontSize: 11, color: '#6B7280', lineHeight: 16 },

  // VISIT BANNER
  visitBanner: {
    backgroundColor: '#1A3A6C',
    margin: 16, borderRadius: 16,
    padding: 24, marginBottom: 32,
  },
  visitTitle: {
    fontSize: 20, fontWeight: '700',
    color: '#C9A227', marginBottom: 10,
  },
  visitDesc: {
    fontSize: 14, color: 'rgba(255,255,255,0.7)',
    lineHeight: 22, marginBottom: 20,
  },
  visitBtns: { flexDirection: 'row', gap: 12 },
  callBtn: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    padding: 12, borderRadius: 10, alignItems: 'center',
  },
  callBtnText: { color: 'white', fontWeight: '700', fontSize: 13 },
  waBtn: {
    flex: 1, backgroundColor: '#25D366',
    padding: 12, borderRadius: 10, alignItems: 'center',
  },
  waBtnText: { color: 'white', fontWeight: '700', fontSize: 13 },
});
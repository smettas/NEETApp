import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import * as WebBrowser from 'expo-web-browser';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// ─────────────────────────────────────────────
//  NOTICES DATA
//  Academy uploads files to a specific folder
//  and adds entries here. New within 3 days
//  will automatically show "NEW" badge.
// ─────────────────────────────────────────────
const NOTICES = [
  {
    id: 9,
    type: 'Notes',        // Schedule / Notes / Result / Update
    icon: '📄',
    title: 'Physics — Gravitation Notes',
    desc: 'Complete notes for Gravitation chapter.',
    date: '2026-07-15',   // ← today's date = auto "NEW" badge
    fileUrl: 'https://drive.google.com/file/d/1ovRg02AYNOl9tYUuZFCMBfUW86mrr0Xo/view?usp=sharing',
    pinned: false,
  },
  {
    id: 1,
    type: 'Schedule',
    icon: '📅',
    title: 'July 2026 Test Schedule',
    desc: 'Complete test schedule for July 2026 — ODT, OWT and Theory dates.',
    date: '2026-07-14',
    fileUrl: 'https://drive.google.com/file/d/1qpkb2hFN_UtU7ESA58xEp98oJoWuSraA/view?usp=sharing',
    pinned: true,
  },
  {
    id: 2,
    type: 'Notes',
    icon: '📄',
    title: 'Physics — Laws of Motion Notes',
    desc: 'Complete chapter notes with solved examples. PDF by Dilip Kumar Sir.',
    date: '2026-07-13',
    fileUrl: 'https://drive.google.com/file/d/1Da0q77vVWACciq7s9sbD-6BgS3G2vz6k/view?usp=sharing',
    pinned: false,
  },
  {
    id: 3,
    type: 'Result',
    icon: '📊',
    title: 'ODT Result — 12 Jul 2026',
    desc: 'ODT PCB result sheet published. Check your individual result in Results section.',
    date: '2026-07-12',
    fileUrl: 'https://drive.google.com/file/d/1ClpYxa4YsxhdbnTkUhB-qWCJrMyc5WAj/view?usp=sharing',
    pinned: false,
  },
  {
    id: 4,
    type: 'Update',
    icon: '📢',
    title: 'Holiday Notice — 15 Jul 2026',
    desc: 'Holiday plans',
    date: '2026-07-11',
    fileUrl: 'https://drive.google.com/file/d/1ClpYxa4YsxhdbnTkUhB-qWCJrMyc5WAj/view?usp=sharing',
    pinned: false,
  },
  {
    id: 5,
    type: 'Notes',
    icon: '📄',
    title: 'Chemistry — Chemical Bonding Formula Sheet',
    desc: 'Quick formula sheet for Chemical Bonding chapter by Dr. Ravi Shankara Sir.',
    date: '2026-07-10',
    fileUrl: 'https://drive.google.com/file/d/1WOq5D01N6wQ7uLgeCpO7WskIXV2M4bic/view?usp=sharing',
    pinned: false,
  },
  {
    id: 6,
    type: 'Schedule',
    icon: '📅',
    title: 'Parent-Teacher Meeting — 20 Jul 2026',
    desc: 'Parents',
    date: '2026-07-09',
    fileUrl: 'https://drive.google.com/file/d/1wf0FGZH9oEI_pqVZfZle_wv1aqIj4sVN/view?usp=sharing',
    pinned: false,
  },
  {
    id: 7,
    type: 'Notes',
    icon: '📄',
    title: 'Biology — Cell Structure Diagrams',
    desc: 'Diagram booklet for Cell Structure & Function by Dr. Haseebur Rahman Sir.',
    date: '2026-07-08',
    fileUrl: 'https://drive.google.com/file/d/1y1_RIgVvUZ7MCOCB5WSmpTZ3YPwdh39x/view?usp=sharing',
    pinned: false,
  },
  {
    id: 8,
    type: 'Update',
    icon: '📢',
    title: 'Hostel Electricity Maintenance',
    desc: 'Hostel electricity will be under maintenance on 16 Jul from 10 AM to 12 PM.',
    date: '2026-07-07',
    fileUrl: 'https://drive.google.com/file/d/1_vhEC-6yKpsMs2_Hdbkj2ABPhtVFlmS7/view?usp=sharing',
    pinned: false,
  },
];

const TYPE_COLORS = {
  Schedule: { bg: '#EBF3FF', text: '#1A3A6C', border: '#93C5FD' },
  Notes:    { bg: '#F0FDF4', text: '#15803D', border: '#86EFAC' },
  Result:   { bg: '#FFF7ED', text: '#C2410C', border: '#FDC6A0' },
  Update:   { bg: '#FDF4FF', text: '#7E22CE', border: '#E9D5FF' },
};

const FILTERS = ['All', 'Schedule', 'Notes', 'Result', 'Update'];

function isNew(dateStr) {
  const posted = new Date(dateStr);
  const now = new Date();
  const diffDays = (now - posted) / (1000 * 60 * 60 * 24);
  return diffDays <= 3;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function PDFLibraryScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const pinned = NOTICES.filter(n => n.pinned);
  const rest   = NOTICES.filter(n => !n.pinned);

  const filtered = (activeFilter === 'All' ? rest : rest.filter(n => n.type === activeFilter))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const newCount = NOTICES.filter(n => isNew(n.date)).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>ACADEMY NOTICES</Text>
        <Text style={styles.headerTitle}>
          Updates &amp; <Text style={styles.headerAccent}>Notices</Text>
        </Text>
        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatNum}>{NOTICES.length}</Text>
            <Text style={styles.headerStatLabel}>Total Notices</Text>
          </View>
          <View style={styles.headerStatDivider} />
          <View style={styles.headerStat}>
            <Text style={[styles.headerStatNum, { color: '#4ADE80' }]}>{newCount}</Text>
            <Text style={styles.headerStatLabel}>New (3 days)</Text>
          </View>
          <View style={styles.headerStatDivider} />
          <View style={styles.headerStat}>
            <Text style={styles.headerStatNum}>{pinned.length}</Text>
            <Text style={styles.headerStatLabel}>Pinned</Text>
          </View>
        </View>
      </View>

      {/* ── FILTERS ── */}
      <View style={styles.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterRow}>
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.filterBtn, activeFilter === f && styles.filterBtnActive]}
                onPress={() => setActiveFilter(f)}>
                <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* ── PINNED ── */}
      {activeFilter === 'All' && pinned.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionIcon}>📌</Text>
            <Text style={styles.sectionLabel}>Pinned</Text>
          </View>
          {pinned.map(n => <NoticeCard key={n.id} notice={n} />)}
        </View>
      )}

      {/* ── RECENT ── */}
      <View style={styles.section}>
        {activeFilter === 'All' && (
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionIcon}>🕐</Text>
            <Text style={styles.sectionLabel}>Recent</Text>
          </View>
        )}
        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No notices in this category</Text>
          </View>
        ) : (
          filtered.map(n => <NoticeCard key={n.id} notice={n} />)
        )}
      </View>

      {/* ── BACK ── */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate('StudentHome')}>
        <Text style={styles.backBtnText}>🏠 Back to Dashboard</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

/* ── Notice Card Component ── */
function NoticeCard({ notice }) {
  const colors = TYPE_COLORS[notice.type] || TYPE_COLORS.Update;
  const fresh  = isNew(notice.date);

  return (
    <View style={[styles.card, notice.pinned && styles.cardPinned]}>

      {/* Top Row */}
      <View style={styles.cardTop}>
        <View style={[styles.iconBox, { backgroundColor: colors.bg, borderColor: colors.border }]}>
          <Text style={styles.cardIcon}>{notice.icon}</Text>
        </View>

        <View style={styles.cardMeta}>
          <View style={styles.cardBadgeRow}>
            <View style={[styles.typeBadge, { backgroundColor: colors.bg }]}>
              <Text style={[styles.typeBadgeText, { color: colors.text }]}>{notice.type}</Text>
            </View>
            {fresh && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            )}
            {notice.pinned && (
              <View style={styles.pinnedBadge}>
                <Text style={styles.pinnedBadgeText}>📌 Pinned</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardDate}>{formatDate(notice.date)}</Text>
        </View>
      </View>

      {/* Content */}
      <Text style={styles.cardTitle}>{notice.title}</Text>
      <Text style={styles.cardDesc}>{notice.desc}</Text>

      {/* Action */}
      {notice.fileUrl && (
        <TouchableOpacity
          style={styles.openBtn}
          onPress={async () => {
              try {
                // Convert Drive view URL to direct download URL
                const fileId = notice.fileUrl.match(/\/d\/(.*?)\//)?.[1];
                if (!fileId) {
                  await WebBrowser.openBrowserAsync(notice.fileUrl);
                  return;
                }
                const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
                const fileName = notice.title.replace(/[^a-z0-9]/gi, '_') + '.pdf';
                const localUri = FileSystem.documentDirectory + fileName;

                const { uri } = await FileSystem.downloadAsync(downloadUrl, localUri);
                await Sharing.shareAsync(uri, {
                  mimeType: 'application/pdf',
                  dialogTitle: 'Save or Open PDF',
                  UTI: 'com.adobe.pdf',
                });
              } catch (e) {
                console.log(e);
                await WebBrowser.openBrowserAsync(notice.fileUrl);
              }
            }}>
          <Text style={styles.openBtnText}>📂 Open File</Text>
        </TouchableOpacity>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FA' },

  // HEADER
  header: { backgroundColor: '#0F2D5C', padding: 24, paddingTop: 28 },
  headerLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 3, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 8 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: 20 },
  headerAccent: { color: '#C9A227' },
  headerStats: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 14 },
  headerStat: { flex: 1, alignItems: 'center' },
  headerStatNum: { fontSize: 20, fontWeight: '800', color: '#C9A227' },
  headerStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  headerStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: 8 },

  // FILTERS
  filterWrap: { backgroundColor: '#fff', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 100, borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
  filterBtnActive: { backgroundColor: '#0F2D5C', borderColor: '#0F2D5C' },
  filterText: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  filterTextActive: { color: '#fff' },

  // SECTIONS
  section: { paddingHorizontal: 16, paddingTop: 16 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  sectionIcon: { fontSize: 16 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 },

  // EMPTY
  emptyBox: { alignItems: 'center', paddingVertical: 48 },
  emptyIcon: { fontSize: 44, marginBottom: 12 },
  emptyText: { fontSize: 15, color: '#9CA3AF', fontWeight: '500' },

  // CARD
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPinned: {
    borderWidth: 1.5,
    borderColor: '#C9A227',
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  iconBox: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  cardIcon: { fontSize: 22 },
  cardMeta: { flex: 1 },
  cardBadgeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 4 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  typeBadgeText: { fontSize: 10, fontWeight: '700' },
  newBadge: { backgroundColor: '#DC2626', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  newBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  pinnedBadge: { backgroundColor: '#FFF8E8', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  pinnedBadgeText: { fontSize: 10, fontWeight: '700', color: '#92400E' },
  cardDate: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 6, lineHeight: 22 },
  cardDesc: { fontSize: 13, color: '#6B7280', lineHeight: 20, marginBottom: 10 },
  openBtn: {
    backgroundColor: '#EBF3FF',
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
  },
  openBtnText: { fontSize: 13, fontWeight: '700', color: '#1A3A6C' },

  // BACK
  backBtn: { marginHorizontal: 16, marginTop: 8, marginBottom: 36, backgroundColor: '#0F2D5C', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  backBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
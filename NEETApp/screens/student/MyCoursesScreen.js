import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity
} from 'react-native';
import { getSyllabus } from "../../services/googleSheetsService";

const SUBJECT_ICON = { Physics: '⚡', Chemistry: '🧪', Biology: '🔬', Maths: '📐' };
const SUBJECT_COLOR = { Physics: '#EBF3FF', Chemistry: '#FFF3E0', Biology: '#E8F8EF', Maths: '#F3E8FF' };
const SUBJECT_ACCENT = { Physics: '#2980B9', Chemistry: '#E67E22', Biology: '#27AE60', Maths: '#8E44AD' };

const STATUS_META = {
  'Completed': { color: '#27AE60', progress: 100, badge: '✅' },
  'In Progress': { color: '#C9A227', progress: 50, badge: '▶' },
  'Not Started': { color: '#9CA3AF', progress: 0, badge: '—' },
};

const getPct = (list) => {
  if (!list.length) return 0;
  const completed = list.filter((c) => c.status === 'Completed').length;
  return Math.round((completed / list.length) * 100);
};

export default function MyCoursesScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [allChapters, setAllChapters] = useState([]);

  // 'groups' | 'subjects' | 'chapters'
  const [viewLevel, setViewLevel] = useState('groups');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await getSyllabus();
      setAllChapters(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingIcon}>📚</Text>
        <Text style={styles.loadingText}>Loading your syllabus...</Text>
      </View>
    );
  }

  const openGroup = (group) => {
    setSelectedGroup(group);
    setViewLevel('subjects');
  };

  const openSubject = (subject) => {
    setSelectedSubject(subject);
    setViewLevel('chapters');
  };

  const backToGroups = () => {
    setViewLevel('groups');
    setSelectedGroup(null);
    setSelectedSubject(null);
  };

  const backToSubjects = () => {
    setViewLevel('subjects');
    setSelectedSubject(null);
  };

  // ---------- LEVEL 1: GROUPS ----------
  if (viewLevel === 'groups') {
    const groups = ['11th', '12th'];

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>OJAS ONE ACADEMY OF EXCELLENCE</Text>
          <Text style={styles.headerTitle}>Subjects <Text style={styles.headerAccent}>Progress</Text></Text>
        </View>

        <View style={styles.groupList}>
          {groups.map((g) => {
            const list = allChapters.filter((c) => c.group === g);
            const pct = getPct(list);
            const completed = list.filter((c) => c.status === 'Completed').length;

            return (
              <TouchableOpacity key={g} style={styles.groupCard} onPress={() => openGroup(g)}>
                <View style={styles.groupCardIcon}>
                  <Text style={styles.groupCardIconText}>📘</Text>
                </View>
                <View style={styles.groupCardInfo}>
                  <Text style={styles.groupCardTitle}>{g} PUC</Text>
                  <Text style={styles.groupCardMeta}>{completed} of {list.length} chapters completed</Text>
                  <View style={styles.progressRow}>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: '#C9A227' }]} />
                    </View>
                    <Text style={styles.progressText}>{pct}%</Text>
                  </View>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  // ---------- LEVEL 2: SUBJECTS ----------
  if (viewLevel === 'subjects') {
    const groupChapters = allChapters.filter((c) => c.group === selectedGroup);
    const subjects = Array.from(new Set(groupChapters.map((c) => c.subject)));
    const groupPct = getPct(groupChapters);

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backRow} onPress={backToGroups}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backLabel}>All Courses</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedGroup} <Text style={styles.headerAccent}>PUC</Text></Text>
          <Text style={styles.headerSub}>{groupPct}% overall completed</Text>
        </View>

        <View style={styles.subjectList}>
          {subjects.map((sub) => {
            const list = groupChapters.filter((c) => c.subject === sub);
            const pct = getPct(list);
            const completed = list.filter((c) => c.status === 'Completed').length;
            const accent = SUBJECT_ACCENT[sub] || '#1A3A6C';

            return (
              <TouchableOpacity key={sub} style={styles.subjectCard} onPress={() => openSubject(sub)}>
                <View style={[styles.subjectIconBox, { backgroundColor: SUBJECT_COLOR[sub] || '#F3F4F6' }]}>
                  <Text style={styles.subjectIconText}>{SUBJECT_ICON[sub] || '📘'}</Text>
                </View>
                <View style={styles.subjectInfo}>
                  <Text style={styles.subjectName}>{sub}</Text>
                  <Text style={styles.subjectMeta}>{completed} of {list.length} chapters completed</Text>
                  <View style={styles.progressRow}>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: accent }]} />
                    </View>
                    <Text style={[styles.progressText, { color: accent }]}>{pct}%</Text>
                  </View>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  // ---------- LEVEL 3: CHAPTERS ----------
  const chapterList = allChapters.filter(
    (c) => c.group === selectedGroup && c.subject === selectedSubject
  );
  const pct = getPct(chapterList);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backRow} onPress={backToSubjects}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backLabel}>{selectedGroup} PUC</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {SUBJECT_ICON[selectedSubject] || ''} <Text style={styles.headerAccent}>{selectedSubject}</Text>
        </Text>
        <Text style={styles.headerSub}>{pct}% completed</Text>
      </View>

      <View style={styles.chapterListWrap}>
        {chapterList.map((chapter, i) => {
          const meta = STATUS_META[chapter.status];
          return (
            <View key={`${chapter.chapter}-${i}`} style={styles.chapterCard}>
              <View style={styles.chapterInfo}>
                <Text style={styles.chapterName}>{chapter.chapter}</Text>
                <View style={styles.progressRow}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${meta.progress}%`, backgroundColor: meta.color }]} />
                  </View>
                  <Text style={[styles.progressText, { color: meta.color }]}>{chapter.status}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: meta.color + '20' }]}>
                <Text style={[styles.statusBadgeText, { color: meta.color }]}>{meta.badge}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },

  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFF' },
  loadingIcon: { fontSize: 48, marginBottom: 12 },
  loadingText: { fontSize: 16, color: '#6B7280', fontWeight: '500' },

  // HEADER
  header: { backgroundColor: '#1A3A6C', padding: 24, paddingTop: 20 },
  headerLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 3, color: '#C9A227', textTransform: 'uppercase', marginBottom: 8 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: 'white' },
  headerAccent: { color: '#C9A227' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 6 },

  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  backArrow: { fontSize: 26, color: '#C9A227', fontWeight: '700', marginRight: 4 },
  backLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  // LEVEL 1: GROUPS
  groupList: { padding: 16 },
  groupCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 16, padding: 18, marginBottom: 12, gap: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  groupCardIcon: { width: 56, height: 56, borderRadius: 14, backgroundColor: '#EBF3FF', alignItems: 'center', justifyContent: 'center' },
  groupCardIconText: { fontSize: 26 },
  groupCardInfo: { flex: 1 },
  groupCardTitle: { fontSize: 18, fontWeight: '800', color: '#0F2548', marginBottom: 4 },
  groupCardMeta: { fontSize: 12, color: '#6B7280', marginBottom: 8 },

  // LEVEL 2: SUBJECTS
  subjectList: { padding: 16 },
  subjectCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 10, gap: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  subjectIconBox: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  subjectIconText: { fontSize: 24 },
  subjectInfo: { flex: 1 },
  subjectName: { fontSize: 16, fontWeight: '700', color: '#0F2548', marginBottom: 4 },
  subjectMeta: { fontSize: 12, color: '#6B7280', marginBottom: 8 },

  // LEVEL 3: CHAPTERS
  chapterListWrap: { padding: 16 },
  chapterCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 10, gap: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  chapterInfo: { flex: 1 },
  chapterName: { fontSize: 14, fontWeight: '700', color: '#0F2548', marginBottom: 8, lineHeight: 20 },
  statusBadge: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  statusBadgeText: { fontSize: 16, fontWeight: '700' },

  // SHARED
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressBar: { flex: 1, height: 4, backgroundColor: '#F0F0F0', borderRadius: 2 },
  progressFill: { height: 4, borderRadius: 2 },
  progressText: { fontSize: 11, fontWeight: '700', width: 80 },
  chevron: { fontSize: 26, color: '#D1D5DB', fontWeight: '300' },
});
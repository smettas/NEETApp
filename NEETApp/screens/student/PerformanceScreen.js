import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity
} from 'react-native';
import {
  getPCBResults, getPCMResults,
  getWeeklyResults, getTheoryResults,
} from "../../services/googleSheetsService";

const isNum = (v) => typeof v === 'number' && !isNaN(v);

// ---------- date range helpers ----------
const getWeekRange = (refDate = new Date()) => {
  const date = new Date(refDate);
  const day = date.getDay(); // 0 = Sun ... 6 = Sat
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
};

const getMonthRange = (refDate = new Date()) => {
  const date = new Date(refDate);
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
};

const inRange = (dateStr, range) => {
  const d = new Date(dateStr);
  return d >= range.start && d <= range.end;
};

// ---------- subject aggregation (percentage only, never raw marks) ----------
const aggregateSubject = (tests, subjectName) => {
  const pctVals = [];
  const correctVals = [];
  const wrongVals = [];
  const skipVals = [];

  tests.forEach((t) => {
    const s = t.subjects?.[subjectName];
    if (!s) return;

    if (isNum(s.marks) && s.totalMarks) {
      pctVals.push((s.marks / s.totalMarks) * 100);
    }
    if (isNum(s.correct) && s.questions) {
      correctVals.push((s.correct / s.questions) * 100);
    }
    if (isNum(s.wrong) && s.questions) {
      wrongVals.push((s.wrong / s.questions) * 100);
    }
    if (isNum(s.skip) && s.questions) {
      skipVals.push((s.skip / s.questions) * 100);
    }
  });

  const avg = (arr) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null);

  if (!pctVals.length) return null;

  return {
    percentage: avg(pctVals),
    correct: avg(correctVals),
    wrong: avg(wrongVals),
    skip: avg(skipVals),
    testsCounted: pctVals.length,
  };
};

const avgOverallPercentage = (tests) => {
  const vals = tests.filter((t) => isNum(t.percentage)).map((t) => t.percentage);
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
};

const SUBJECT_ORDER = ['Physics', 'Chemistry', 'Biology', 'Maths'];
const SUBJECT_ICON = { Physics: '⚡', Chemistry: '🧪', Biology: '🔬', Maths: '📐' };
const SUBJECT_COLOR = { Physics: '#2980B9', Chemistry: '#E67E22', Biology: '#27AE60', Maths: '#8E44AD' };

const getScoreColor = (percent) => {
  if (percent >= 75) return '#27AE60';
  if (percent >= 55) return '#C9A227';
  return '#C0392B';
};

export default function PerformanceScreen({ navigation, route, user }) {
  const rollNumber = route.params?.rollNumber || user?.roll_number;
  
  if (!rollNumber) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingIcon}>❌</Text>
        <Text style={styles.loadingText}>Student information not available</Text>
      </View>
    );
  }
  const [activeTab, setActiveTab] = useState('week'); // week | month | all
  const [loading, setLoading] = useState(true);
  const [allTests, setAllTests] = useState([]);

  useEffect(() => {
    const load = async () => {
      console.log(`[PerformanceScreen] Loading performance data for roll number: ${rollNumber}`);
      const [pcb, pcm, weekly, theory] = await Promise.all([
        getPCBResults(rollNumber),
        getPCMResults(rollNumber),
        getWeeklyResults(rollNumber),
        getTheoryResults(rollNumber),
      ]);

      const combined = [
        ...Object.values(pcb),
        ...Object.values(pcm),
        ...Object.values(weekly),
        ...Object.values(theory),
      ].sort((a, b) => new Date(a.calendarDate) - new Date(b.calendarDate));

      console.log(`[PerformanceScreen] Data loaded: ${combined.length} total results`);
      setAllTests(combined);
      setLoading(false);
    };

    load();
  }, [rollNumber]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingIcon}>📊</Text>
        <Text style={styles.loadingText}>Crunching your results...</Text>
      </View>
    );
  }

  const weekRange = getWeekRange();
  const monthRange = getMonthRange();

  const weekTests = allTests.filter((t) => inRange(t.calendarDate, weekRange));
  const monthTests = allTests.filter((t) => inRange(t.calendarDate, monthRange));

  const tabTests =
    activeTab === 'week' ? weekTests :
    activeTab === 'month' ? monthTests :
    allTests;

  const tabLabel =
    activeTab === 'week' ? 'This Week' :
    activeTab === 'month' ? 'This Month' :
    'All Time';

  const overallAvg = avgOverallPercentage(tabTests);

  const subjectRows = SUBJECT_ORDER
    .map((sub) => ({ sub, agg: aggregateSubject(tabTests, sub) }))
    .filter((row) => row.agg !== null);

  const trendTests = tabTests
    .filter((t) => isNum(t.percentage))
    .slice()
    .sort((a, b) => new Date(a.calendarDate) - new Date(b.calendarDate));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>ANALYTICS</Text>
        <Text style={styles.headerTitle}>
          My <Text style={styles.headerAccent}>Performance</Text>
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: '#C9A227' }]}>
              {overallAvg !== null ? `${overallAvg}%` : '—'}
            </Text>
            <Text style={styles.statLabel}>Average ({tabLabel})</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: '#2980B9' }]}>{tabTests.length}</Text>
            <Text style={styles.statLabel}>Tests ({tabLabel})</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: '#8E44AD' }]}>{allTests.length}</Text>
            <Text style={styles.statLabel}>Total Tests Ever</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: '#27AE60' }]}>{subjectRows.length}</Text>
            <Text style={styles.statLabel}>Subjects Tracked</Text>
          </View>
        </View>
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        {['week', 'month', 'all'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'week' ? '📅 This Week' :
                tab === 'month' ? '🗓️ This Month' : '📊 All Time'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tabContent}>

        {tabTests.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No tests found for {tabLabel.toLowerCase()}</Text>
          </View>
        ) : (
          <>
            {/* SUBJECT AVERAGES (percentage only) */}
            <Text style={styles.sectionTitle}>Subject Averages — {tabLabel}</Text>
            {subjectRows.map(({ sub, agg }) => (
              <View key={sub} style={styles.subjectCard}>
                <View style={styles.subjectTop}>
                  <Text style={styles.subjectIcon}>{SUBJECT_ICON[sub]}</Text>
                  <View style={styles.subjectInfo}>
                    <Text style={styles.subjectName}>{sub}</Text>
                    <Text style={styles.subjectTests}>{agg.testsCounted} tests averaged</Text>
                  </View>
                  <Text style={[styles.subjectScore, { color: SUBJECT_COLOR[sub] }]}>
                    {agg.percentage}%
                  </Text>
                </View>

                <View style={styles.progressBar}>
                  <View style={[styles.progressFill,
                    { width: `${agg.percentage}%`, backgroundColor: SUBJECT_COLOR[sub] }]} />
                </View>

                {(agg.correct !== null || agg.wrong !== null || agg.skip !== null) && (
                  <View style={styles.miniStatsRow}>
                    <View style={styles.miniStat}>
                      <Text style={[styles.miniStatVal, { color: '#27AE60' }]}>
                        {agg.correct !== null ? `${agg.correct}%` : '—'}
                      </Text>
                      <Text style={styles.miniStatLabel}>Correct</Text>
                    </View>
                    <View style={styles.miniStatDivider} />
                    <View style={styles.miniStat}>
                      <Text style={[styles.miniStatVal, { color: '#C0392B' }]}>
                        {agg.wrong !== null ? `${agg.wrong}%` : '—'}
                      </Text>
                      <Text style={styles.miniStatLabel}>Wrong</Text>
                    </View>
                    <View style={styles.miniStatDivider} />
                    <View style={styles.miniStat}>
                      <Text style={[styles.miniStatVal, { color: '#9CA3AF' }]}>
                        {agg.skip !== null ? `${agg.skip}%` : '—'}
                      </Text>
                      <Text style={styles.miniStatLabel}>Skipped</Text>
                    </View>
                  </View>
                )}
              </View>
            ))}

            {/* TREND */}
            {trendTests.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Score Trend — {tabLabel}</Text>
                <View style={styles.trendCard}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {trendTests.map((test, i) => (
                      <View key={i} style={styles.trendItem}>
                        <View style={styles.trendBar}>
                          <View style={[styles.trendBarFill,
                            { height: `${test.percentage}%`,
                              backgroundColor: getScoreColor(test.percentage) }]} />
                        </View>
                        <Text style={styles.trendPercent}>{test.percentage}%</Text>
                        <Text style={styles.trendDate}>
                          {new Date(test.calendarDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </Text>
                        <Text style={styles.trendType}>{test.testType}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </>
            )}
          </>
        )}
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
  headerTitle: { fontSize: 28, fontWeight: '700', color: 'white', marginBottom: 20 },
  headerAccent: { color: '#C9A227' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: '47%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 16 },
  statNum: { fontSize: 22, fontWeight: '900', marginBottom: 4 },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.65)' },

  // TABS
  tabs: { flexDirection: 'row', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#1A3A6C' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#1A3A6C' },

  // TAB CONTENT
  tabContent: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F2548', marginBottom: 14, marginTop: 6 },

  emptyBox: { alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, fontWeight: '600', color: '#6B7280', textAlign: 'center' },

  // SUBJECT CARDS
  subjectCard: { backgroundColor: 'white', borderRadius: 14, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  subjectTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  subjectIcon: { fontSize: 28 },
  subjectInfo: { flex: 1 },
  subjectName: { fontSize: 16, fontWeight: '700', color: '#0F2548' },
  subjectTests: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  subjectScore: { fontSize: 22, fontWeight: '900' },
  progressBar: { height: 6, backgroundColor: '#F0F0F0', borderRadius: 3, marginBottom: 12 },
  progressFill: { height: 6, borderRadius: 3 },

  miniStatsRow: { flexDirection: 'row', backgroundColor: '#F9FAFB', borderRadius: 10, padding: 10 },
  miniStat: { flex: 1, alignItems: 'center' },
  miniStatVal: { fontSize: 15, fontWeight: '800' },
  miniStatLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  miniStatDivider: { width: 1, backgroundColor: '#E5E7EB', marginHorizontal: 6 },

  // TREND
  trendCard: { backgroundColor: 'white', borderRadius: 14, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  trendItem: { alignItems: 'center', width: 56 },
  trendBar: { width: 24, backgroundColor: '#F0F0F0', borderRadius: 4, height: 80, justifyContent: 'flex-end', marginBottom: 4 },
  trendBarFill: { width: '100%', borderRadius: 4 },
  trendPercent: { fontSize: 11, fontWeight: '700', color: '#0F2548' },
  trendDate: { fontSize: 10, color: '#6B7280', marginTop: 2 },
  trendType: { fontSize: 9, color: '#9CA3AF', marginTop: 1 },
});
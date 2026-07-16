import { Calendar } from "react-native-calendars";
import React, { useState, useEffect } from "react";
import { getWeeklyResults } from "../../services/googleSheetsService";
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity
} from 'react-native';

export default function OWTResultsScreen({ navigation, route }) {
  const rollNumber = route.params?.rollNumber;
  
  if (!rollNumber) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingIcon}>❌</Text>
        <Text style={styles.loadingText}>Student information not available</Text>
      </View>
    );
  }
  const [results, setResults] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [testNumber, setTestNumber] = useState(1);


  useEffect(() => {
    const loadResults = async () => {
      console.log(`[OWTResultsScreen] Loading weekly results for roll number: ${rollNumber}`);
      const data = await getWeeklyResults(rollNumber);
      console.log(`[OWTResultsScreen] Results loaded:`, Object.keys(data).length, 'entries');
      setResults(data);
    };
    loadResults();
  }, [rollNumber]);

  const resultDates = Object.keys(results).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  useEffect(() => {
    if (resultDates.length > 0 && !selectedDate) {
      setSelectedDate(resultDates[0]);
    }
  }, [resultDates]);
  const currentResult = results[selectedDate];
  const currentIndex = resultDates.indexOf(selectedDate);
  if (!currentResult || resultDates.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingIcon}>📊</Text>
          <Text style={styles.loadingText}>Loading Results...</Text>
        </View>
      );
    }

    const totalObtained = currentResult.obtainedMarks;
    const percentage = currentResult.percentage;
  
    const getScoreColor = (pct) => {
      if (pct >= 80) return '#16A34A';
      if (pct >= 60) return '#2563EB';
      if (pct >= 40) return '#D97706';
      return '#DC2626';
    };
  
    const scoreColor = getScoreColor(percentage);
  
    const markedDates = {};
    resultDates.forEach((date) => {
      markedDates[date] = { marked: true, dotColor: '#2563EB' };
    });
    if (selectedDate) {
      markedDates[selectedDate] = {
        selected: true,
        selectedColor: '#0F2D5C',
        marked: true,
        dotColor: '#fff',
      };
    }
  
    const handlePrev = () => {
      if (currentIndex < resultDates.length - 1) {
        const newDate = resultDates[currentIndex + 1];
        setSelectedDate(newDate);
        setTestNumber(resultDates.length - currentIndex - 1);
      }
    };
  
    const handleNext = () => {
      if (currentIndex > 0) {
        const newDate = resultDates[currentIndex - 1];
        setSelectedDate(newDate);
        setTestNumber(resultDates.length - currentIndex + 1);
      }
    };

  const subjects = ["Physics", "Chemistry", "Biology"];
    const subjectIcons = {
    Physics: "⚡",
    Chemistry: "🧪",
    Biology: "🔬",
  };  
  const subjectColors = {
    Physics: "#2563EB",
    Chemistry: "#D97706",
    Biology: "#16A34A",
  };

  return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
  
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>OJAS WEEKLY TEST</Text>
          <Text style={styles.headerTitle}>Weekly Test Result</Text>
          <View style={styles.headerMeta}>
            <Text style={styles.headerDate}>
              {currentResult.date} • {currentResult.day}
            </Text>
            <View style={styles.presentBadge}>
              <Text style={styles.presentText}>✓ Present</Text>
            </View>
          </View>
        </View>
  
        {/* ── NAVIGATION ── */}
        <View style={styles.navBar}>
  
          <TouchableOpacity
            disabled={currentIndex >= resultDates.length - 1}
            onPress={handlePrev}
          >
            <Text
              style={[
                styles.navText,
                currentIndex >= resultDates.length - 1 && {
                  opacity: .35,
                },
              ]}
            >
              ◀ Previous
            </Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            onPress={() =>
              setCalendarVisible(!calendarVisible)
            }
            style={{
              alignItems: "center",
            }}
          >
            <Text style={styles.navDateText}>
              {currentResult.date}
            </Text>
  
            <Text style={styles.navDayText}>
              {currentResult.day}
            </Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            disabled={currentIndex === 0}
            onPress={handleNext}
          >
            <Text
              style={[
                styles.navText,
                currentIndex === 0 && {
                  opacity: .35,
                },
              ]}
            >
              Next ▶
            </Text>
          </TouchableOpacity>
  
        </View>
  
        {/* ── CALENDAR ── */}
        {calendarVisible && (
          <View style={styles.calendarCard}>
            <Calendar
              current={selectedDate}
              minDate={resultDates[resultDates.length - 1]}
              maxDate={resultDates[0]}
              markedDates={markedDates}
              enableSwipeMonths={true}
              onDayPress={(day) => {
                if (results.hasOwnProperty(day.dateString)) {
                  setSelectedDate(day.dateString);
                  setCalendarVisible(false);
                }
              }}
              theme={{
                todayTextColor: '#2563EB',
                selectedDayBackgroundColor: '#0F2D5C',
                arrowColor: '#0F2D5C',
                dotColor: '#2563EB',
                textDayFontWeight: '500',
                textMonthFontWeight: '700',
                textDayHeaderFontWeight: '600',
                calendarBackground: '#fff',
              }}
            />
          </View>
        )}
  
        {/* ── SUMMARY CARD ── */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTestLabel}>Weekly Test{resultDates.length - currentIndex}</Text>
  
          <View style={styles.summaryScoreRow}>
            <Text style={[styles.summaryBigScore, { color: scoreColor }]}>
              {totalObtained}
            </Text>
            <Text style={styles.summarySlash}> / </Text>
            <Text style={styles.summaryTotalScore}>{currentResult.totalMarks}</Text>
          </View>
  
          <Text style={[styles.summaryPct, { color: scoreColor }]}>{percentage}%</Text>
  
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: scoreColor }]} />
          </View>
  
          <View style={styles.summaryStatsRow}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatVal}>{totalObtained}</Text>
              <Text style={styles.summaryStatLabel}>Obtained</Text>
            </View>
            <View style={styles.summaryStatDivider} />
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatVal}>{currentResult.totalMarks}</Text>
              <Text style={styles.summaryStatLabel}>Total</Text>
            </View>
            <View style={styles.summaryStatDivider} />
            <View style={styles.summaryStat}>
              <Text style={[styles.summaryStatVal, { color: scoreColor }]}>{percentage}%</Text>
              <Text style={styles.summaryStatLabel}>Percentage</Text>
            </View>
          </View>
        </View>
  
        {/* ── SUBJECT CARDS ── */}
        <View style={styles.subjectsSection}>
          <Text style={styles.subjectsSectionTitle}>Subject Breakdown</Text>
  
          {subjects.map((sub) => {
            const data = currentResult.subjects[sub];
            if (!data) return null;
  
            const marks = data.marks || 0;
            const correct = data.correct || 0;
            const wrong = data.wrong || 0;
            const skipped = data.skipped || 0;
            const questions =
              (data.correct || 0) +
              (data.wrong || 0) +
              (data.skipped || 0);
            const subPct = questions > 0 ? Math.round((correct / questions) * 100) : 0;
            const color = subjectColors[sub];
  
            return (
              <View key={sub} style={styles.subCard}>
  
                {/* Subject Header */}
                <View style={styles.subCardHeader}>
                  <Text style={styles.subIcon}>{subjectIcons[sub]}</Text>
                  <Text style={styles.subName}>{sub}</Text>
                  <Text style={[styles.subMarks, { color }]}>{marks} Marks</Text>
                </View>
  
                <View style={styles.subDivider} />
  
                {/* Stats Row */}
                <View style={styles.subStatsRow}>
                  <View style={styles.subStatItem}>
                    <Text style={styles.subStatLabel}>Correct</Text>
                    <Text style={[styles.subStatVal, { color: '#16A34A' }]}>{correct}</Text>
                  </View>
                  <View style={styles.subStatItem}>
                    <Text style={styles.subStatLabel}>Wrong</Text>
                    <Text style={[styles.subStatVal, { color: '#DC2626' }]}>{wrong}</Text>
                  </View>
                  <View style={styles.subStatItem}>
                    <Text style={styles.subStatLabel}>Skipped</Text>
                    <Text style={[styles.subStatVal, { color: '#6B7280' }]}>{skipped}</Text>
                  </View>
                  <View style={styles.subStatItem}>
                    <Text style={styles.subStatLabel}>Total Questions</Text>
                    <Text style={[styles.subStatVal, { color: '#374151' }]}>{questions}</Text>
                  </View>
                </View>
  
                {/* Progress */}
                <View style={styles.subProgressRow}>
                  <View style={styles.subProgressTrack}>
                    <View style={[styles.subProgressFill, { width: `${subPct}%`, backgroundColor: color }]} />
                  </View>
                  <Text style={[styles.subPct, { color }]}>{subPct}%</Text>
                </View>
  
              </View>
            );
          })}
        </View>
  
        {/* ── BACK BUTTON ── */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate('StudentHome')}>
          <Text style={styles.backBtnText}>← Back to Dashboard</Text>
        </TouchableOpacity>
  
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F6FA' },
  
    // LOADING
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6FA' },
    loadingIcon: { fontSize: 48, marginBottom: 12 },
    loadingText: { fontSize: 16, color: '#6B7280', fontWeight: '500' },
  
    // HEADER
    header: {
      backgroundColor: '#0F2D5C',
      paddingHorizontal: 24,
      paddingTop: 28,
      paddingBottom: 24,
    },
    headerLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: 'rgba(255,255,255,0.55)',
      letterSpacing: 2,
      textTransform: 'uppercase',
      marginBottom: 8,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: '#fff',
      marginBottom: 12,
    },
    headerMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerDate: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.75)',
      fontWeight: '500',
    },
    presentBadge: {
      backgroundColor: 'rgba(22,163,74,0.25)',
      borderWidth: 1,
      borderColor: 'rgba(22,163,74,0.5)',
      borderRadius: 100,
      paddingHorizontal: 10,
      paddingVertical: 3,
    },
    presentText: { fontSize: 12, fontWeight: '600', color: '#4ADE80' },
  
    // NAVIGATION
    navBar: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    navIconBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#0F2D5C',
      alignItems: 'center',
      justifyContent: 'center',
    },
    navIconBtnDisabled: { backgroundColor: '#E5E7EB' },
    navIconText: { fontSize: 22, color: '#fff', fontWeight: '700', lineHeight: 26 },
    navIconTextDisabled: { color: '#9CA3AF' },
    navDateCenter: { alignItems: 'center' },
    navDateText: { fontSize: 16, fontWeight: '700', color: '#111827' },
    navDayText: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  
    // CALENDAR
    calendarCard: {
      marginHorizontal: 16,
      marginTop: 10,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
  
    // SUMMARY CARD
    summaryCard: {
      backgroundColor: '#fff',
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    summaryTestLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 16,
    },
    summaryScoreRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: 4,
    },
    summaryBigScore: { fontSize: 48, fontWeight: '800', lineHeight: 52 },
    summarySlash: { fontSize: 28, color: '#D1D5DB', fontWeight: '300' },
    summaryTotalScore: { fontSize: 28, color: '#9CA3AF', fontWeight: '400' },
    summaryPct: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
    progressTrack: {
      height: 4,
      backgroundColor: '#F3F4F6',
      borderRadius: 10,
      marginBottom: 20,
      overflow: 'hidden',
    },
    progressFill: { height: 4, borderRadius: 10 },
    summaryStatsRow: {
      flexDirection: 'row',
      backgroundColor: '#F9FAFB',
      borderRadius: 12,
      padding: 14,
    },
    summaryStat: { flex: 1, alignItems: 'center' },
    summaryStatVal: { fontSize: 17, fontWeight: '700', color: '#111827' },
    summaryStatLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 3 },
    summaryStatDivider: { width: 1, backgroundColor: '#E5E7EB', marginHorizontal: 8 },
  
    // SUBJECT CARDS
    subjectsSection: { paddingHorizontal: 16, marginTop: 16 },
    subjectsSectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#374151',
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    subCard: {
      backgroundColor: '#fff',
      borderRadius: 14,
      padding: 16,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 2,
    },
    subCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    subIcon: { fontSize: 20, marginRight: 10 },
    subName: { flex: 1, fontSize: 16, fontWeight: '600', color: '#111827' },
    subMarks: { fontSize: 16, fontWeight: '700' },
    subDivider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 12 },
    subStatsRow: { flexDirection: 'row', marginBottom: 12 },
    subStatItem: { flex: 1 },
    subStatLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 4, fontWeight: '500' },
    subStatVal: { fontSize: 17, fontWeight: '700' },
    subProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    subProgressTrack: {
      flex: 1,
      height: 4,
      backgroundColor: '#F3F4F6',
      borderRadius: 10,
      overflow: 'hidden',
    },
    subProgressFill: { height: 4, borderRadius: 10 },
    subPct: { fontSize: 13, fontWeight: '700', width: 38, textAlign: 'right' },
  
    // BACK BUTTON
    backBtn: {
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 36,
      backgroundColor: '#0F2D5C',
      paddingVertical: 15,
      borderRadius: 12,
      alignItems: 'center',
    },
    backBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  });
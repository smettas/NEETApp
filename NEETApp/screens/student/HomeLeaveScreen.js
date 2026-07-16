import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert
} from 'react-native';
import api from '../../services/api';
import { Calendar } from 'react-native-calendars';

export default function HomeLeaveScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('request');
  const [form, setForm] = useState({
    fromDate: '',
    toDate: '',
    reason: '',
    parentName: '',
    parentPhone: '',
    relation: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [previousRequests, setPreviousRequests] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [datePicker, setDatePicker] = useState('');

  const relations = ['Father', 'Mother', 'Guardian'];

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const data = await api.getHomeLeaveRequests();
      setPreviousRequests(data.requests || []);
    } catch (error) {
      Alert.alert('Could not load history', error.message);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const getStatusColor = (status) => {
    if (status === 'approved') return '#27AE60';
    if (status === 'rejected') return '#C0392B';
    return '#C9A227';
  };

  const getStatusBg = (status) => {
    if (status === 'approved') return '#E8F8EF';
    if (status === 'rejected') return '#FFE8E8';
    return '#FFF8E8';
  };

  const handleSubmit = async () => {
    if (!form.fromDate || !form.toDate || !form.reason || !form.parentName || !form.parentPhone || !form.relation) {
      Alert.alert('Missing Info', 'Please fill all required fields');
      return;
    }
    try {
      await api.submitHomeLeaveRequest({
        from_date: form.fromDate,
        to_date: form.toDate,
        reason: form.reason,
        guardian_name: form.parentName,
        guardian_mobile: form.parentPhone,
        guardian_relation: form.relation,
      });
      await loadHistory();
      setSubmitted(true);
    } catch (error) {
      Alert.alert('Request not submitted', error.message);
    }
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.successTitle}>Request Submitted!</Text>
        <Text style={styles.successDesc}>
          Your home leave request has been submitted successfully. Academy will review and respond within 24 hours.
        </Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => { setSubmitted(false); setActiveTab('history'); setForm({ fromDate: '', toDate: '', reason: '', parentName: '', parentPhone: '', relation: '' }); }}>
          <Text style={styles.backBtnText}>View Request History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('StudentHome')}>
          <Text style={styles.homeBtnText}>🏠 Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>LEAVE MANAGEMENT</Text>
        <Text style={styles.headerTitle}>🏠 Home Leave <Text style={styles.headerAccent}>Request</Text></Text>
        <View style={styles.ruleBox}>
          <Text style={styles.ruleText}>⚠️ Requests must be submitted at least 3-4 days in advance</Text>
        </View>
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'request' && styles.tabActive]}
          onPress={() => setActiveTab('request')}>
          <Text style={[styles.tabText, activeTab === 'request' && styles.tabTextActive]}>New Request</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}>
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>History</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'request' && (
        <View style={styles.formContainer}>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>From Date *</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputIcon}>📅</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                value={form.fromDate}
                onChangeText={(v) => setForm({ ...form, fromDate: v })}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>To Date *</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputIcon}>📅</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                value={form.toDate}
                onChangeText={(v) => setForm({ ...form, toDate: v })}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reason for Leave *</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Explain reason for home leave..."
              value={form.reason}
              onChangeText={(v) => setForm({ ...form, reason: v })}
              multiline
              numberOfLines={3}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Parent/Guardian Name *</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Parent or Guardian Name"
                value={form.parentName}
                onChangeText={(v) => setForm({ ...form, parentName: v })}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Parent Mobile *</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputIcon}>📞</Text>
              <TextInput
                style={styles.input}
                placeholder="10-digit Mobile Number"
                value={form.parentPhone}
                onChangeText={(v) => setForm({ ...form, parentPhone: v })}
                keyboardType="numeric"
                maxLength={10}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Relation *</Text>
            <View style={styles.chipsRow}>
              {relations.map((rel) => (
                <TouchableOpacity
                  key={rel}
                  style={[styles.chip, form.relation === rel && styles.chipActive]}
                  onPress={() => setForm({ ...form, relation: rel })}>
                  <Text style={[styles.chipText, form.relation === rel && styles.chipTextActive]}>{rel}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Submit Leave Request →</Text>
          </TouchableOpacity>

        </View>
      )}

      {activeTab === 'history' && (
        <View style={styles.historyContainer}>
          {historyLoading && <Text style={styles.emptyHistory}>Loading requests...</Text>}
          {!historyLoading && previousRequests.length === 0 && (
            <Text style={styles.emptyHistory}>No home leave requests yet.</Text>
          )}
          {previousRequests.map((req) => (
            <View key={req.id} style={styles.historyCard}>
              <View style={styles.historyTop}>
                <View>
                  <Text style={styles.historyDates}>{req.from_date} → {req.to_date}</Text>
                  <Text style={styles.historyDays}>{req.days} day(s) leave</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBg(req.status) }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(req.status) }]}>
                    {req.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.historyReason}>Reason: {req.reason}</Text>
              <Text style={styles.historyApplied}>Applied on: {req.applied_on}</Text>
              {!!req.admin_comment && <Text style={styles.historyComment}>Admin note: {req.admin_comment}</Text>}
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.dashboardBtn}
        onPress={() => navigation.navigate('StudentHome')}>
        <Text style={styles.dashboardBtnText}>🏠 Back to Dashboard</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },

  header: { backgroundColor: '#1A3A6C', padding: 24, paddingTop: 20 },
  headerLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 3, color: '#C9A227', textTransform: 'uppercase', marginBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: 'white', marginBottom: 12 },
  headerAccent: { color: '#C9A227' },
  ruleBox: { backgroundColor: 'rgba(201,162,39,0.2)', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: 'rgba(201,162,39,0.4)' },
  ruleText: { fontSize: 13, color: '#C9A227', fontWeight: '600' },

  tabs: { flexDirection: 'row', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#1A3A6C' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#1A3A6C' },

  formContainer: { padding: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#1A3A6C', marginBottom: 6 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, backgroundColor: '#FAFAFA' },
  inputIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, paddingVertical: 12, fontSize: 14, color: '#111827' },
  textArea: { borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, backgroundColor: '#FAFAFA', height: 90, textAlignVertical: 'top', fontSize: 14, color: '#111827' },

  chipsRow: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#FAFAFA' },
  chipActive: { borderColor: '#1A3A6C', backgroundColor: '#EBF3FF' },
  chipText: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  chipTextActive: { color: '#1A3A6C' },

  submitBtn: { backgroundColor: '#1A3A6C', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },

  historyContainer: { padding: 16 },
  historyCard: { backgroundColor: 'white', borderRadius: 14, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  historyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  historyDates: { fontSize: 15, fontWeight: '700', color: '#0F2548', marginBottom: 2 },
  historyDays: { fontSize: 12, color: '#6B7280' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  historyReason: { fontSize: 13, color: '#3D5278', marginBottom: 4 },
  historyApplied: { fontSize: 12, color: '#9CA3AF' },
  historyComment: { fontSize: 12, color: '#3D5278', marginTop: 6 },
  emptyHistory: { textAlign: 'center', color: '#6B7280', paddingVertical: 28, fontSize: 14 },

  dashboardBtn: { marginHorizontal: 16, marginBottom: 32, backgroundColor: '#1A3A6C', padding: 16, borderRadius: 12, alignItems: 'center' },
  dashboardBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },

  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#fff' },
  successIcon: { fontSize: 64, marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: '700', color: '#27AE60', marginBottom: 12 },
  successDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  backBtn: { borderWidth: 2, borderColor: '#1A3A6C', padding: 14, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 12 },
  backBtnText: { color: '#1A3A6C', fontWeight: '700', fontSize: 15 },
  homeBtn: { backgroundColor: '#1A3A6C', padding: 14, borderRadius: 12, width: '100%', alignItems: 'center' },
  homeBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
});
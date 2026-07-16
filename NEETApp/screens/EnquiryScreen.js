import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity, Linking, Alert
} from 'react-native';
import api from '../services/api';

export default function EnquiryScreen() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    class: '',
    program: '',
    city: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const programs = ['AADHYA (8th-10th)', 'VISHWANATHA (PU+NEET)', 'VAIDYANATHA (NEET)'];
  const classes = ['8th', '9th', '10th', '11th', '12th', 'Repeater'];

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.program) {
      Alert.alert('Missing Info', 'Please fill Name, Phone and Program at minimum.');
      return;
    }
    try {
      const response = await api.submitEnquiry({
        name: form.name,
        phone: form.phone,
        email: form.email,
        class: form.class,
        program: form.program.split(' ')[0],
        city: form.city,
        message: form.message,
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitted(true);
    }
  };
  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>🎉</Text>
        <Text style={styles.successTitle}>Enquiry Submitted!</Text>
        <Text style={styles.successDesc}>
          Thank you {form.name}! Our team will contact you within 24 hours.
        </Text>
        <TouchableOpacity
          style={styles.waBtn}
          onPress={() => Linking.openURL(`https://wa.me/919632906660?text=Hi, I am ${form.name}. I enquired about ${form.program} program.`)}>
          <Text style={styles.waBtnText}>💬 WhatsApp Us Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setSubmitted(false)}>
          <Text style={styles.backBtnText}>Submit Another Enquiry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>ADMISSIONS 2025-26</Text>
        <Text style={styles.headerTitle}>Start Your <Text style={styles.headerAccent}>Journey</Text></Text>
        <Text style={styles.headerDesc}>Fill the form below and our counsellor will contact you within 24 hours.</Text>
      </View>

      {/* FORM */}
      <View style={styles.formContainer}>

        {/* Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Phone */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
            keyboardType="phone-pad"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            keyboardType="email-address"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Class */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Current Class *</Text>
          <View style={styles.optionsRow}>
            {classes.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.optionBtn, form.class === c && styles.optionBtnActive]}
                onPress={() => setForm({ ...form, class: c })}>
                <Text style={[styles.optionText, form.class === c && styles.optionTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Program */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Interested Program *</Text>
          {programs.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.programOption, form.program === p && styles.programOptionActive]}
              onPress={() => setForm({ ...form, program: p })}>
              <View style={[styles.radio, form.program === p && styles.radioActive]} />
              <Text style={[styles.programOptionText, form.program === p && styles.programOptionTextActive]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* City */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your city"
            value={form.city}
            onChangeText={(text) => setForm({ ...form, city: text })}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Message */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Message (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any specific questions or requirements?"
            value={form.message}
            onChangeText={(text) => setForm({ ...form, message: text })}
            multiline
            numberOfLines={4}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Submit Enquiry →</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR CONTACT DIRECTLY</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Direct Contact */}
        <View style={styles.directContact}>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => Linking.openURL('tel:+919632906660')}>
            <Text style={styles.callBtnText}>📞 Call Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.waDirectBtn}
            onPress={() => Linking.openURL('https://wa.me/919632906660')}>
            <Text style={styles.waDirectBtnText}>💬 WhatsApp</Text>
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

  // FORM
  formContainer: { padding: 24 },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 14, fontWeight: '600',
    color: '#1A3A6C', marginBottom: 8,
  },
  input: {
    borderWidth: 1.5, borderColor: '#E5E7EB',
    borderRadius: 10, padding: 14,
    fontSize: 15, color: '#111827',
    backgroundColor: '#FAFAFA',
  },
  textArea: { height: 100, textAlignVertical: 'top' },

  // OPTIONS
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionBtn: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 8, borderWidth: 1.5,
    borderColor: '#E5E7EB', backgroundColor: '#FAFAFA',
  },
  optionBtnActive: {
    borderColor: '#1A3A6C', backgroundColor: '#EBF3FF',
  },
  optionText: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  optionTextActive: { color: '#1A3A6C' },

  // PROGRAM OPTIONS
  programOption: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, padding: 14, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#E5E7EB',
    marginBottom: 8, backgroundColor: '#FAFAFA',
  },
  programOptionActive: {
    borderColor: '#1A3A6C', backgroundColor: '#EBF3FF',
  },
  radio: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: '#9CA3AF',
  },
  radioActive: { borderColor: '#1A3A6C', backgroundColor: '#1A3A6C' },
  programOptionText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  programOptionTextActive: { color: '#1A3A6C', fontWeight: '700' },

  // SUBMIT
  submitBtn: {
    backgroundColor: '#C9A227',
    padding: 16, borderRadius: 12,
    alignItems: 'center', marginTop: 8,
  },
  submitBtnText: { color: '#0F2548', fontWeight: '700', fontSize: 16 },

  // DIVIDER
  divider: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginVertical: 24,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { fontSize: 11, color: '#9CA3AF', fontWeight: '600', letterSpacing: 1 },

  // DIRECT CONTACT
  directContact: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  callBtn: {
    flex: 1, backgroundColor: '#1A3A6C',
    padding: 14, borderRadius: 10, alignItems: 'center',
  },
  callBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  waDirectBtn: {
    flex: 1, backgroundColor: '#25D366',
    padding: 14, borderRadius: 10, alignItems: 'center',
  },
  waDirectBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },

  // SUCCESS
  successContainer: {
    flex: 1, alignItems: 'center',
    justifyContent: 'center', padding: 32,
    backgroundColor: '#fff',
  },
  successIcon: { fontSize: 64, marginBottom: 16 },
  successTitle: {
    fontSize: 28, fontWeight: '700',
    color: '#1A3A6C', marginBottom: 12,
  },
  successDesc: {
    fontSize: 15, color: '#6B7280',
    textAlign: 'center', lineHeight: 24, marginBottom: 28,
  },
  waBtn: {
    backgroundColor: '#25D366',
    paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 10, marginBottom: 12,
    width: '100%', alignItems: 'center',
  },
  waBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  backBtn: {
    borderWidth: 1.5, borderColor: '#1A3A6C',
    paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 10, width: '100%', alignItems: 'center',
  },
  backBtnText: { color: '#1A3A6C', fontWeight: '700', fontSize: 15 },
});
import React, { useRef, useState } from 'react';
import api from '../../services/api';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity, Alert, Image
} from 'react-native';

const TOTAL_STEPS = 3;
const STEP_LABELS = ['Personal Info', 'Account Setup', 'Address & Summary'];

const genders = ['Male', 'Female', 'Other'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const studyingOptions = ['10th', 'PUC 1', 'PUC 2'];

const getPasswordStrength = (pw) => {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return 'Weak';
  if (score <= 4) return 'Medium';
  return 'Strong';
};

const STRENGTH_COLOR = { Weak: '#C0392B', Medium: '#D97706', Strong: '#27AE60' };

export default function RegisterScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Use refs for fields that don't need live derived UI feedback
  const firstName = useRef('');
  const lastName = useRef('');
  const dob = useRef('');
  const rollNumber = useRef('');
  const mobile = useRef('');
  const address = useRef('');

  // Password needs real state for live strength/match feedback
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Selected options (need state for UI update)
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedBlood, setSelectedBlood] = useState('');
  const [selectedStudying, setSelectedStudying] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const passwordStrength = getPasswordStrength(password);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!firstName.current || !selectedGender) {
        Alert.alert('Error', 'Please fill First Name and select Gender');
        return;
      }
      if (!rollNumber.current) {
        Alert.alert('Error', 'Please enter your Roll Number');
        return;
      }
    }

    if (currentStep === 2) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!mobile.current) {
        Alert.alert('Error', 'Please fill Mobile Number');
        return;
      }
      if (!phoneRegex.test(mobile.current)) {
        Alert.alert('Error', 'Enter a valid 10 digit mobile number');
        return;
      }
      if (!selectedStudying) {
        Alert.alert('Error', 'Please select what you are currently studying');
        return;
      }
      if (!password || password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return;
      }
      if (password.length > 15) {
        Alert.alert('Error', 'Password cannot exceed 15 characters');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
    }

    if (currentStep < TOTAL_STEPS) setCurrentStep(currentStep + 1);
  };

  const handleSubmit = async () => {
    if (!agreedTerms) {
      Alert.alert('Error', 'Please confirm that the information you entered is correct');
      return;
    }

    setLoading(true);

    const payload = {
      roll_number: rollNumber.current,
      first_name: firstName.current,
      last_name: lastName.current,
      gender: selectedGender,
      blood_group: selectedBlood,
      studying: selectedStudying,
      mobile: mobile.current,
      address: address.current,
      password,
    };

    console.log('[RegisterScreen] Submitting payload:', {
      ...payload,
      password: '***', // Don't log password
    });

    try {
      const response = await api.register(payload);
      console.log('[RegisterScreen] Registration successful:', response);

      setLoading(false);

      Alert.alert(
        '✅ Successfully Registered!',
        'Your account has been created. Please log in with your mobile number and password.',
        [{
          text: 'Go to Login',
          onPress: () => navigation.replace('Login')
        }]
      );
    } catch (error) {
      console.error('[RegisterScreen] Registration failed:', error.message);
      setLoading(false);

      Alert.alert(
        'Registration Failed',
        error.message || 'Something went wrong. Please try again.'
      );
    }
  };

  // Chip selector component
  const Chips = ({ label, options, selected, onSelect }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipsRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, selected === opt && styles.chipActive]}
            onPress={() => onSelect(opt)}>
            <Text style={[styles.chipText, selected === opt && styles.chipTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Fixed input that doesn't lose focus (ref-based, uncontrolled)
  const Field = ({ label, placeholder, refVal, keyboardType, maxLength, icon, secureTextEntry }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputBox}>
        {icon && <Text style={styles.inputIcon}>{icon}</Text>}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          defaultValue={refVal.current}
          onChangeText={(v) => { refVal.current = v; }}
          keyboardType={keyboardType || 'default'}
          maxLength={maxLength}
          secureTextEntry={secureTextEntry || false}
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
          blurOnSubmit={false}
        />
        {maxLength && (
          <Text style={styles.maxLen}>{maxLength}</Text>
        )}
      </View>
    </View>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View>
            <Text style={styles.stepHeading}>👤 Personal Information</Text>

            {/* Photo Upload */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Student Photo</Text>
              <TouchableOpacity
                style={styles.photoUpload}
                onPress={() => Alert.alert('Photo Upload', 'Photo upload will work in the final APK with camera access.')}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Text style={styles.photoIcon}>📷</Text>
                    <Text style={styles.photoText}>Tap to Upload Photo</Text>
                    <Text style={styles.photoSubText}>JPG, PNG (Max 2MB)</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Field label="First Name *" placeholder="First Name" refVal={firstName} icon="👤" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Last Name" placeholder="Last Name" refVal={lastName} />
              </View>
            </View>

            <Chips label="Gender *" options={genders} selected={selectedGender} onSelect={setSelectedGender} />
            <Chips label="Blood Group" options={bloodGroups} selected={selectedBlood} onSelect={setSelectedBlood} />
            <Field label="Roll Number *" placeholder="e.g. OJAS250124" refVal={rollNumber} icon="🎓" />
            <Field label="Date of Birth" placeholder="DD/MM/YYYY" refVal={dob} icon="📅" />
          </View>
        );

      case 2:
        return (
          <View>
            <Text style={styles.stepHeading}>🔐 Account Information</Text>
            <Field label="Mobile Number *" placeholder="10-digit Mobile Number" refVal={mobile} keyboardType="numeric" maxLength={10} icon="📱" />

            <Chips label="Currently Studying *" options={studyingOptions} selected={selectedStudying} onSelect={setSelectedStudying} />

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password * (6-15 characters)</Text>
              <View style={styles.inputBox}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Create Password (max 15 chars)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  maxLength={15}
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.showBtn}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
              {passwordStrength && (
                <Text style={[styles.strengthText, { color: STRENGTH_COLOR[passwordStrength] }]}>
                  Password Strength: {passwordStrength}
                </Text>
              )}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password *</Text>
              <View style={styles.inputBox}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  maxLength={15}
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {confirmPassword.length > 0 && (
                password === confirmPassword ? (
                  <Text style={styles.matchGood}>✓ Passwords Match</Text>
                ) : (
                  <Text style={styles.matchBad}>Passwords do not match</Text>
                )
              )}
            </View>
          </View>
        );

      case 3:
        return (
          <View>
            <Text style={styles.stepHeading}>📍 Address & Summary</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Address (Optional)</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Enter Full Address"
                defaultValue={address.current}
                onChangeText={(v) => { address.current = v; }}
                multiline
                numberOfLines={3}
                placeholderTextColor="#9CA3AF"
                autoCorrect={false}
              />
            </View>

            {/* SUMMARY */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>📋 Registration Summary</Text>
              {[
                { label: 'Roll Number', value: rollNumber.current },
                { label: 'Name', value: `${firstName.current} ${lastName.current}`.trim() },
                { label: 'Gender', value: selectedGender },
                { label: 'Blood Group', value: selectedBlood },
                { label: 'Studying', value: selectedStudying },
                { label: 'Mobile Number', value: mobile.current },
              ].filter(i => i.value).map((item, i) => (
                <View key={i} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{item.label}</Text>
                  <Text style={styles.summaryValue}>{item.value}</Text>
                </View>
              ))}
            </View>

            {/* TERMS */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreedTerms(!agreedTerms)}>
              <Text style={styles.termsCheckbox}>{agreedTerms ? '☑' : '☐'}</Text>
              <Text style={styles.termsText}>I confirm that the above information is correct.</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>OJAS ONE</Text>
        <Text style={styles.headerTitle}>Student Registration 🎓</Text>
        <Text style={styles.headerDesc}>Complete all steps to create your account</Text>
      </View>

      {/* STEP INDICATOR */}
      <View style={styles.stepIndicator}>
        {[1, 2, 3].map((step) => (
          <View key={step} style={styles.stepIndicatorItem}>
            <View style={[
              styles.stepDot,
              currentStep === step && styles.stepDotActive,
              currentStep > step && styles.stepDotDone,
            ]}>
              <Text style={[
                styles.stepDotText,
                (currentStep === step || currentStep > step) && styles.stepDotTextActive,
              ]}>
                {currentStep > step ? '✓' : step}
              </Text>
            </View>
            {step < TOTAL_STEPS && <View style={[styles.stepLine, currentStep > step && styles.stepLineDone]} />}
          </View>
        ))}
      </View>

      {/* STEP LABEL */}
      <View style={styles.stepLabelRow}>
        <Text style={styles.stepLabel}>Step {currentStep} of {TOTAL_STEPS}</Text>
        <Text style={styles.stepLabelName}>{STEP_LABELS[currentStep - 1]}</Text>
      </View>

      {/* FORM */}
      <View style={styles.formContainer}>
        {renderStep()}

        {/* BUTTONS */}
        <View style={styles.navBtns}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentStep(currentStep - 1)}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
          )}
          {currentStep < TOTAL_STEPS ? (
            <TouchableOpacity style={[styles.nextBtn, currentStep === 1 && { flex: 1 }]} onPress={handleNext}>
              <Text style={styles.nextBtnText}>Next →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.submitBtn, (loading || !agreedTerms) && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading || !agreedTerms}>
              <Text style={styles.submitBtnText}>
                {loading ? 'Creating Account...' : '✅ Submit Registration'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login Here →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#1A3A6C', padding: 32, paddingTop: 60, alignItems: 'center' },
  logo: { fontSize: 28, fontWeight: '900', color: '#C9A227', letterSpacing: 4, marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: 'white', marginBottom: 6 },
  headerDesc: { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },

  stepIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, paddingBottom: 8 },
  stepIndicatorItem: { flexDirection: 'row', alignItems: 'center' },
  stepDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#E5E7EB' },
  stepDotActive: { backgroundColor: '#1A3A6C', borderColor: '#1A3A6C' },
  stepDotDone: { backgroundColor: '#27AE60', borderColor: '#27AE60' },
  stepDotText: { fontSize: 12, fontWeight: '700', color: '#9CA3AF' },
  stepDotTextActive: { color: 'white' },
  stepLine: { width: 24, height: 2, backgroundColor: '#E5E7EB', marginHorizontal: 2 },
  stepLineDone: { backgroundColor: '#27AE60' },

  stepLabelRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 8 },
  stepLabel: { fontSize: 12, color: '#9CA3AF' },
  stepLabelName: { fontSize: 12, fontWeight: '700', color: '#1A3A6C' },

  formContainer: { padding: 20 },
  stepHeading: { fontSize: 18, fontWeight: '700', color: '#0F2548', marginBottom: 20, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: '#C9A227' },
  row: { flexDirection: 'row', gap: 10 },

  // PHOTO
  photoUpload: { borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed', borderRadius: 12, overflow: 'hidden' },
  photoPlaceholder: { alignItems: 'center', padding: 24 },
  photoIcon: { fontSize: 40, marginBottom: 8 },
  photoText: { fontSize: 14, fontWeight: '600', color: '#1A3A6C' },
  photoSubText: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  photoPreview: { width: '100%', height: 150, resizeMode: 'cover' },

  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#1A3A6C', marginBottom: 6 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, backgroundColor: '#FAFAFA' },
  inputIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, paddingVertical: 12, fontSize: 14, color: '#111827' },
  showBtn: { fontSize: 18, padding: 4 },
  maxLen: { fontSize: 10, color: '#9CA3AF', paddingLeft: 4 },
  textArea: { borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, backgroundColor: '#FAFAFA', height: 80, textAlignVertical: 'top', fontSize: 14, color: '#111827' },

  strengthText: { fontSize: 12, fontWeight: '600', marginTop: 6 },
  matchGood: { fontSize: 12, fontWeight: '600', color: '#27AE60', marginTop: 6 },
  matchBad: { fontSize: 12, fontWeight: '600', color: '#C0392B', marginTop: 6 },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#FAFAFA' },
  chipActive: { borderColor: '#1A3A6C', backgroundColor: '#EBF3FF' },
  chipText: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  chipTextActive: { color: '#1A3A6C' },

  summaryCard: { backgroundColor: '#F8FAFF', borderRadius: 14, padding: 16, marginTop: 8, borderWidth: 1, borderColor: '#E8EDF8' },
  summaryTitle: { fontSize: 15, fontWeight: '700', color: '#1A3A6C', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  summaryLabel: { fontSize: 13, color: '#6B7280' },
  summaryValue: { fontSize: 13, fontWeight: '600', color: '#0F2548', flex: 1, textAlign: 'right' },

  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  termsCheckbox: { fontSize: 20, color: '#1A3A6C' },
  termsText: { flex: 1, fontSize: 13, color: '#374151' },

  navBtns: { flexDirection: 'row', gap: 12, marginTop: 24, marginBottom: 16 },
  backBtn: { flex: 1, borderWidth: 2, borderColor: '#1A3A6C', padding: 14, borderRadius: 12, alignItems: 'center' },
  backBtnText: { color: '#1A3A6C', fontWeight: '700', fontSize: 15 },
  nextBtn: { flex: 1, backgroundColor: '#1A3A6C', padding: 14, borderRadius: 12, alignItems: 'center' },
  nextBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  submitBtn: { flex: 1, backgroundColor: '#C9A227', padding: 14, borderRadius: 12, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#0F2548', fontWeight: '700', fontSize: 15 },

  loginRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 40 },
  loginText: { fontSize: 14, color: '#6B7280' },
  loginLink: { fontSize: 14, color: '#C9A227', fontWeight: '700' },
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import api from '../../services/api';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity, Alert, Animated
} from 'react-native';

export default function ChangePasswordScreen({ navigation, route }) {
  const { mobile } = route.params || {};
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [toastOpacity] = useState(new Animated.Value(1));

  // Auto-hide success message
  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [successMessage, toastOpacity]);

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
  const passwordStrength = getPasswordStrength(newPassword);

  const handleChangePassword = async () => {
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current (temporary) password');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }

    if (newPassword.length > 15) {
      Alert.alert('Error', 'Password cannot exceed 15 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword === currentPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return;
    }

    setLoading(true);

    try {
      console.log('[ChangePasswordScreen] Changing password for mobile:', mobile);
      
      // Call API to change password
      const response = await api.changePassword(mobile, currentPassword, newPassword);
      
      console.log('[ChangePasswordScreen] Password changed successfully');
      setLoading(false);

      // Show success message for 2 seconds
      setSuccessMessage('✅ Password Changed Successfully!');
      
      // Navigate to StudentApp after 2 seconds
      setTimeout(() => {
        navigation.replace('StudentApp');
      }, 2000);
    } catch (error) {
      console.error('[ChangePasswordScreen] Change password error:', error.message);
      setLoading(false);
      Alert.alert('Failed', error.message || 'Could not change password. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>OJAS ONE</Text>
        <Text style={styles.headerTitle}>Change Password 🔐</Text>
        <Text style={styles.headerDesc}>Update your password to secure your account</Text>
      </View>

      {/* FORM */}
      <View style={styles.formContainer}>

        {/* INFO BOX */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            You logged in with a temporary password. Please change it to a new, secure password that only you know.
          </Text>
        </View>

        {/* Current Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Current Password (Temporary) *</Text>
          <View style={styles.inputBox}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your temporary password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
              <Text style={styles.showBtn}>{showCurrentPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* New Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password * (6-15 characters)</Text>
          <View style={styles.inputBox}>
            <Text style={styles.inputIcon}>🔐</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              maxLength={15}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <Text style={styles.showBtn}>{showNewPassword ? '🙈' : '👁️'}</Text>
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
          <Text style={styles.label}>Confirm New Password *</Text>
          <View style={styles.inputBox}>
            <Text style={styles.inputIcon}>🔐</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showNewPassword}
              maxLength={15}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {confirmPassword.length > 0 && (
            newPassword === confirmPassword ? (
              <Text style={styles.matchGood}>✓ Passwords Match</Text>
            ) : (
              <Text style={styles.matchBad}>Passwords do not match</Text>
            )
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleChangePassword}
          disabled={loading}>
          <Text style={styles.submitBtnText}>
            {loading ? 'Updating Password...' : '✅ Save New Password'}
          </Text>
        </TouchableOpacity>

      </View>

      {/* SUCCESS TOAST */}
      {successMessage && (
        <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]}>
          <Text style={styles.toastText}>{successMessage}</Text>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#1A3A6C', padding: 32, paddingTop: 60, alignItems: 'center' },
  logo: { fontSize: 28, fontWeight: '900', color: '#C9A227', letterSpacing: 4, marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: 'white', marginBottom: 6 },
  headerDesc: { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },

  formContainer: { padding: 20 },
  infoBox: { backgroundColor: '#EBF3FF', borderRadius: 12, padding: 16, marginBottom: 24, borderLeftWidth: 4, borderLeftColor: '#1A3A6C', flexDirection: 'row' },
  infoIcon: { fontSize: 24, marginRight: 12 },
  infoText: { flex: 1, fontSize: 13, color: '#1A3A6C', lineHeight: 20 },

  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#1A3A6C', marginBottom: 6 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, backgroundColor: '#FAFAFA' },
  inputIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, paddingVertical: 12, fontSize: 14, color: '#111827' },
  showBtn: { fontSize: 18, padding: 4 },

  strengthText: { fontSize: 12, fontWeight: '600', marginTop: 6 },
  matchGood: { fontSize: 12, fontWeight: '600', color: '#27AE60', marginTop: 6 },
  matchBad: { fontSize: 12, fontWeight: '600', color: '#C0392B', marginTop: 6 },

  submitBtn: { backgroundColor: '#C9A227', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#0F2548', fontWeight: '700', fontSize: 15 },

  toastContainer: { 
    position: 'absolute', 
    bottom: 40, 
    left: 20, 
    right: 20, 
    backgroundColor: '#27AE60', 
    padding: 16, 
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  toastText: { 
    color: 'white', 
    fontWeight: '700', 
    fontSize: 14,
  },
});

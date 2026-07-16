import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity, Alert
} from 'react-native';

export default function LoginScreen({ navigation, onLogin }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-login if a token already exists
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        navigation.replace("StudentApp");
      }
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
    if (!mobile || !password) {
      setError('Please enter Mobile Number and Password');
      Alert.alert('Error', 'Please enter Mobile Number and Password');
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(mobile)) {
      setError('Invalid mobile number. Enter 10 digits starting with 6-9.');
      Alert.alert('Invalid Mobile Number', 'Enter a valid 10 digit mobile number.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      Alert.alert('Password', 'Minimum 6 characters required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('[LoginScreen] Attempting login with mobile:', mobile);
      const response = await api.login(mobile, password);
      
      console.log('[LoginScreen] ✓ Login successful');
      console.log('[LoginScreen] Saving user data:', response.user);
      
      // Save token and user data to AsyncStorage
      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.user));
      
      console.log('[LoginScreen] ✓ Data saved to storage, calling onLogin');
      setLoading(false);
      setError('');
      
      // Call onLogin to update App.js state
      onLogin(response.user);
      
      // Check if user needs to change password (temp password scenario)
      if (response.require_password_change) {
        console.log('[LoginScreen] Temp password detected - showing change password screen');
        navigation.replace('ChangePassword', { mobile });
      } else {
        console.log('[LoginScreen] Normal login - going to StudentApp');
        navigation.replace('StudentApp');
      }
    } catch (error) {
      console.error('[LoginScreen] ✗ Login error:', error.message);
      setLoading(false);
      const errorMsg = error.message || 'Something went wrong. Please try again.';
      setError('❌ ' + errorMsg);
      Alert.alert('Login Failed', errorMsg);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>OJAS ONE</Text>
        <Text style={styles.headerTitle}>Welcome Back! 👋</Text>
        <Text style={styles.headerDesc}>Login to access your courses, tests and study material</Text>
      </View>

      {/* FORM */}
      <View style={styles.formContainer}>

        {/* ERROR MESSAGE */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Mobile Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.inputBox}>
            <Text style={styles.inputIcon}>📱</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Mobile Number"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              maxLength={10}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputBox}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showBtn}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={() =>
            Alert.alert(
              "🔐 Forgot Password?",
              "Please contact OJAS ONE administration to request a temporary password.\n\nAdministrator will provide you with a temporary password which you can use to log in. After logging in, you'll be asked to change your password immediately.",
              [{ text: 'OK', style: 'default' }]
            )
          }>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
          onPress={handleLogin}
          disabled={loading}>
          <Text style={styles.loginBtnText}>
            {loading ? 'Logging in...' : 'Login →'}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>NEW STUDENT?</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerBtnText}>Create New Account →</Text>
        </TouchableOpacity>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Login using your registered Mobile Number and Password. If you forgot your password, please contact the institute administration.
          </Text>
        </View>

        {/* Contact */}
        <View style={styles.contactRow}>
          <Text style={styles.contactText}>Need assistance? </Text>
          <Text style={styles.contactLink}>Call +91 9632906660</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
          <Text style={styles.footerText}>© OJAS ONE Academy</Text>
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
    padding: 32, paddingTop: 60,
    alignItems: 'center',
  },
  logo: {
    fontSize: 28, fontWeight: '900',
    color: '#C9A227', letterSpacing: 4,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24, fontWeight: '700',
    color: 'white', marginBottom: 8,
  },
  headerDesc: {
    fontSize: 14, color: 'rgba(255,255,255,0.7)',
    textAlign: 'center', lineHeight: 22,
  },

  // FORM
  formContainer: { padding: 24 },
  errorBox: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#C0392B',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#C0392B',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 14, fontWeight: '600',
    color: '#1A3A6C', marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E5E7EB',
    borderRadius: 12, paddingHorizontal: 14,
    backgroundColor: '#FAFAFA',
  },
  inputIcon: { fontSize: 18, marginRight: 10 },
  input: {
    flex: 1, paddingVertical: 14,
    fontSize: 15, color: '#111827',
  },
  showBtn: { fontSize: 18, padding: 4 },

  // FORGOT
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotText: { fontSize: 14, color: '#C9A227', fontWeight: '600' },

  // LOGIN BUTTON
  loginBtn: {
    backgroundColor: '#C9A227',
    padding: 16, borderRadius: 12,
    alignItems: 'center', marginBottom: 24,
  },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: { color: '#0F2548', fontWeight: '700', fontSize: 16 },

  // DIVIDER
  divider: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: 16,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { fontSize: 11, color: '#9CA3AF', fontWeight: '600', letterSpacing: 1 },

  // REGISTER
  registerBtn: {
    borderWidth: 2, borderColor: '#1A3A6C',
    padding: 16, borderRadius: 12,
    alignItems: 'center', marginBottom: 24,
  },
  registerBtnText: { color: '#1A3A6C', fontWeight: '700', fontSize: 15 },

  // INFO
  infoBox: {
    flexDirection: 'row', gap: 10,
    backgroundColor: '#EBF3FF', borderRadius: 12,
    padding: 14, marginBottom: 16,
  },
  infoIcon: { fontSize: 18 },
  infoText: { flex: 1, fontSize: 13, color: '#1A3A6C', lineHeight: 20 },

  // CONTACT
  contactRow: {
    flexDirection: 'row', justifyContent: 'center',
    marginBottom: 16,
  },
  contactText: { fontSize: 14, color: '#6B7280' },
  contactLink: { fontSize: 14, color: '#C9A227', fontWeight: '700' },

  // FOOTER
  footer: { alignItems: 'center', marginBottom: 32 },
  footerText: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
});

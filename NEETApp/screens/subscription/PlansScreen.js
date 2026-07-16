import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Linking
} from 'react-native';

export default function PlansScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [selectedDuration, setSelectedDuration] = useState('annual');

  const durations = [
    { id: 'monthly', label: '1 Month' },
    { id: 'quarterly', label: '3 Months' },
    { id: 'annual', label: '12 Months', badge: 'BEST VALUE' },
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: '📚',
      color: '#2980B9',
      prices: { monthly: 999, quarterly: 2499, annual: 7999 },
      features: [
        { text: 'All Video Lectures', included: true },
        { text: 'Chapter Notes PDFs', included: true },
        { text: 'Formula Sheets', included: true },
        { text: 'Chapter Tests', included: true },
        { text: 'Full Mock Tests', included: false },
        { text: 'Performance Analytics', included: false },
        { text: 'Live Classes', included: false },
        { text: 'Personal Mentoring', included: false },
      ],
    },
    {
      id: 'standard',
      name: 'Standard',
      icon: '🏆',
      color: '#C9A227',
      popular: true,
      prices: { monthly: 1499, quarterly: 3999, annual: 11999 },
      features: [
        { text: 'All Video Lectures', included: true },
        { text: 'All PDFs & Notes', included: true },
        { text: 'Formula Sheets', included: true },
        { text: 'Chapter Tests', included: true },
        { text: 'Full Mock Tests', included: true },
        { text: 'Performance Analytics', included: true },
        { text: 'Live Classes', included: false },
        { text: 'Personal Mentoring', included: false },
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: '👑',
      color: '#8E44AD',
      prices: { monthly: 2499, quarterly: 6499, annual: 19999 },
      features: [
        { text: 'All Video Lectures', included: true },
        { text: 'All PDFs & Notes', included: true },
        { text: 'Formula Sheets', included: true },
        { text: 'Chapter Tests', included: true },
        { text: 'Full Mock Tests', included: true },
        { text: 'Performance Analytics', included: true },
        { text: 'Live Classes (Join Live)', included: true },
        { text: 'Personal Mentoring', included: true },
      ],
    },
  ];

  const getDiscount = (monthly, duration) => {
    if (duration === 'quarterly') return Math.round(((monthly * 3) - plans.find(p => p.id === selectedPlan).prices.quarterly) / (monthly * 3) * 100);
    if (duration === 'annual') return Math.round(((monthly * 12) - plans.find(p => p.id === selectedPlan).prices.annual) / (monthly * 12) * 100);
    return 0;
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);
  const price = selectedPlanData?.prices[selectedDuration] || 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>UNLOCK FULL ACCESS</Text>
        <Text style={styles.headerTitle}>
          Choose Your <Text style={styles.headerAccent}>Plan</Text>
        </Text>
        <Text style={styles.headerDesc}>
          Get unlimited access to all courses, tests and live classes
        </Text>
      </View>

      {/* DURATION SELECTOR */}
      <View style={styles.durationSection}>
        <Text style={styles.durationTitle}>Select Duration</Text>
        <View style={styles.durationRow}>
          {durations.map((dur) => (
            <TouchableOpacity
              key={dur.id}
              style={[styles.durationBtn,
                selectedDuration === dur.id && styles.durationBtnActive]}
              onPress={() => setSelectedDuration(dur.id)}>
              <Text style={[styles.durationText,
                selectedDuration === dur.id && styles.durationTextActive]}>
                {dur.label}
              </Text>
              {dur.badge && (
                <View style={styles.durationBadge}>
                  <Text style={styles.durationBadgeText}>{dur.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* PLAN CARDS */}
      <View style={styles.plansContainer}>
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[styles.planCard,
              selectedPlan === plan.id && styles.planCardActive,
              selectedPlan === plan.id && { borderColor: plan.color }]}
            onPress={() => setSelectedPlan(plan.id)}>

            {/* Popular Badge */}
            {plan.popular && (
              <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                <Text style={styles.popularBadgeText}>⭐ MOST POPULAR</Text>
              </View>
            )}

            {/* Plan Header */}
            <View style={[styles.planHeader, { backgroundColor: plan.color + '20' }]}>
              <Text style={styles.planIcon}>{plan.icon}</Text>
              <View style={styles.planHeaderInfo}>
                <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                <View style={styles.planPriceRow}>
                  <Text style={styles.planCurrency}>₹</Text>
                  <Text style={[styles.planPrice, { color: plan.color }]}>
                    {plan.prices[selectedDuration].toLocaleString()}
                  </Text>
                  <Text style={styles.planDuration}>
                    /{selectedDuration === 'monthly' ? 'mo' :
                      selectedDuration === 'quarterly' ? '3mo' : 'yr'}
                  </Text>
                </View>
                {selectedDuration !== 'monthly' && (
                  <Text style={styles.planSavings}>
                    Save {getDiscount(plan.prices.monthly, selectedDuration)}% vs monthly
                  </Text>
                )}
              </View>
              {selectedPlan === plan.id && (
                <View style={[styles.selectedCheck, { backgroundColor: plan.color }]}>
                  <Text style={styles.selectedCheckText}>✓</Text>
                </View>
              )}
            </View>

            {/* Features */}
            <View style={styles.planFeatures}>
              {plan.features.map((feature, i) => (
                <View key={i} style={styles.featureRow}>
                  <Text style={[styles.featureCheck,
                    { color: feature.included ? '#27AE60' : '#D1D5DB' }]}>
                    {feature.included ? '✓' : '✗'}
                  </Text>
                  <Text style={[styles.featureText,
                    { color: feature.included ? '#0F2548' : '#9CA3AF' }]}>
                    {feature.text}
                  </Text>
                </View>
              ))}
            </View>

          </TouchableOpacity>
        ))}
      </View>

      {/* CHECKOUT */}
      <View style={styles.checkoutSection}>
        <View style={styles.checkoutSummary}>
          <View style={styles.checkoutRow}>
            <Text style={styles.checkoutLabel}>Selected Plan</Text>
            <Text style={styles.checkoutValue}>{selectedPlanData?.name}</Text>
          </View>
          <View style={styles.checkoutRow}>
            <Text style={styles.checkoutLabel}>Duration</Text>
            <Text style={styles.checkoutValue}>
              {durations.find(d => d.id === selectedDuration)?.label}
            </Text>
          </View>
          <View style={[styles.checkoutRow, styles.checkoutTotal]}>
            <Text style={styles.checkoutTotalLabel}>Total Amount</Text>
            <Text style={styles.checkoutTotalValue}>₹{price.toLocaleString()}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.payBtn}
          onPress={() => Linking.openURL('https://wa.me/919632906660?text=Hi, I want to subscribe to OJAS ONE ' + selectedPlanData?.name + ' plan for ' + durations.find(d => d.id === selectedDuration)?.label)}>
          <Text style={styles.payBtnText}>
            Pay ₹{price.toLocaleString()} via Razorpay →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.waBtn}
          onPress={() => Linking.openURL('https://wa.me/919632906660')}>
          <Text style={styles.waBtnText}>💬 Pay via WhatsApp</Text>
        </TouchableOpacity>

        <Text style={styles.secureText}>🔒 100% Secure Payment via Razorpay</Text>
      </View>

      {/* GUARANTEES */}
      <View style={styles.guaranteeSection}>
        <Text style={styles.guaranteeTitle}>Why Subscribe?</Text>
        {[
          { icon: '🎬', text: 'Unlimited video lecture access anytime' },
          { icon: '📄', text: 'Download all PDFs and study materials' },
          { icon: '📝', text: 'Unlimited mock tests with detailed analysis' },
          { icon: '📊', text: 'AI-powered performance tracking' },
          { icon: '👨‍🏫', text: 'Live classes with expert faculty' },
          { icon: '💯', text: 'Proven results — 500+ NEET selections' },
        ].map((item, i) => (
          <View key={i} style={styles.guaranteeItem}>
            <Text style={styles.guaranteeIcon}>{item.icon}</Text>
            <Text style={styles.guaranteeText}>{item.text}</Text>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },

  // HEADER
  header: { backgroundColor: '#1A3A6C', padding: 24, paddingTop: 20 },
  headerLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 3, color: '#C9A227', textTransform: 'uppercase', marginBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: 'white', marginBottom: 8 },
  headerAccent: { color: '#C9A227' },
  headerDesc: { fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 22 },

  // DURATION
  durationSection: { padding: 20 },
  durationTitle: { fontSize: 16, fontWeight: '700', color: '#0F2548', marginBottom: 12 },
  durationRow: { flexDirection: 'row', gap: 10 },
  durationBtn: { flex: 1, borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, alignItems: 'center', backgroundColor: 'white' },
  durationBtnActive: { borderColor: '#1A3A6C', backgroundColor: '#EBF3FF' },
  durationText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  durationTextActive: { color: '#1A3A6C' },
  durationBadge: { backgroundColor: '#C9A227', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  durationBadgeText: { fontSize: 9, fontWeight: '700', color: '#0F2548' },

  // PLANS
  plansContainer: { paddingHorizontal: 16, gap: 12 },
  planCard: { backgroundColor: 'white', borderRadius: 20, borderWidth: 2, borderColor: '#E5E7EB', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  planCardActive: { borderWidth: 2, shadowOpacity: 0.12 },
  popularBadge: { paddingVertical: 6, alignItems: 'center' },
  popularBadgeText: { fontSize: 11, fontWeight: '700', color: 'white', letterSpacing: 1 },
  planHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  planIcon: { fontSize: 32 },
  planHeaderInfo: { flex: 1 },
  planName: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  planPriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  planCurrency: { fontSize: 16, fontWeight: '700', color: '#0F2548' },
  planPrice: { fontSize: 28, fontWeight: '900' },
  planDuration: { fontSize: 13, color: '#6B7280', marginLeft: 2 },
  planSavings: { fontSize: 11, color: '#27AE60', fontWeight: '600', marginTop: 2 },
  selectedCheck: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  selectedCheckText: { color: 'white', fontWeight: '700', fontSize: 16 },
  planFeatures: { padding: 16, paddingTop: 0 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  featureCheck: { fontSize: 14, fontWeight: '700', width: 16 },
  featureText: { fontSize: 13, flex: 1 },

  // CHECKOUT
  checkoutSection: { padding: 20 },
  checkoutSummary: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  checkoutRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  checkoutLabel: { fontSize: 14, color: '#6B7280' },
  checkoutValue: { fontSize: 14, fontWeight: '600', color: '#0F2548' },
  checkoutTotal: { borderBottomWidth: 0, marginTop: 4 },
  checkoutTotalLabel: { fontSize: 16, fontWeight: '700', color: '#0F2548' },
  checkoutTotalValue: { fontSize: 22, fontWeight: '900', color: '#C9A227' },
  payBtn: { backgroundColor: '#1A3A6C', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  payBtnText: { color: 'white', fontWeight: '700', fontSize: 16 },
  waBtn: { backgroundColor: '#25D366', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  waBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  secureText: { fontSize: 13, color: '#6B7280', textAlign: 'center' },

  // GUARANTEES
  guaranteeSection: { padding: 20, paddingTop: 0, marginBottom: 32 },
  guaranteeTitle: { fontSize: 18, fontWeight: '700', color: '#0F2548', marginBottom: 14 },
  guaranteeItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  guaranteeIcon: { fontSize: 22 },
  guaranteeText: { fontSize: 14, color: '#3D5278', flex: 1, lineHeight: 20 },
});
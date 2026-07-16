import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions, Image
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const slideAnim = new Animated.Value(30);

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Show splash for 3 seconds, then let App.js handle routing
    const timer = setTimeout(() => {
      console.log('[SplashScreen] Splash animation complete - App.js will handle routing');
      // App.js will handle navigation based on isLoggedIn state
      navigation.replace('MainApp');  // Default, will be overridden by App.js conditional routing
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>

      {/* Background Circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      {/* Logo */}
      <Animated.View style={[styles.logoContainer, {
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }]
      }]}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={[styles.taglineContainer, {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }]}>
        <Text style={styles.tagline}>Inner Strength for</Text>
        <Text style={styles.taglineAccent}>Ultimate Excellence</Text>
      </Animated.View>

      {/* Programs */}
      <Animated.View style={[styles.programsRow, {
        opacity: fadeAnim,
      }]}>
        {['NEET', 'K-CET', 'Foundation', 'PU Integrated'].map((p, i) => (
          <View key={i} style={styles.programTag}>
            <Text style={styles.programTagText}>{p}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Loading Bar */}
      <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
        <View style={styles.loadingBar}>
          <Animated.View style={styles.loadingFill} />
        </View>
        <Text style={styles.loadingText}>Loading...</Text>
      </Animated.View>

      {/* Footer */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.footerText}>Bengaluru, Karnataka</Text>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F2548',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // BACKGROUND CIRCLES
  circle1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(201,162,39,0.05)',
    top: -100,
    right: -100,
  },
  circle2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(26,58,108,0.5)',
    bottom: -80,
    left: -80,
  },
  circle3: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(201,162,39,0.08)',
    top: '30%',
    left: -60,
  },

  // LOGO
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoImage: {
    width: 280,
    height: 92,
    marginBottom: 16,
  },
  logoBox: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#C9A227',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#C9A227',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  logoIcon: { fontSize: 52 },
  logoText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#C9A227',
    letterSpacing: 4,
    marginBottom: 6,
  },
  logoSubText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // TAGLINE
  taglineContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
  },
  taglineAccent: {
    fontSize: 20,
    color: '#C9A227',
    fontWeight: '700',
    fontStyle: 'italic',
  },

  // PROGRAMS
  programsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 48,
    paddingHorizontal: 32,
  },
  programTag: {
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.4)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
  },
  programTagText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },

  // LOADING
  loadingContainer: {
    alignItems: 'center',
    width: '60%',
  },
  loadingBar: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginBottom: 10,
    overflow: 'hidden',
  },
  loadingFill: {
    width: '70%',
    height: 3,
    backgroundColor: '#C9A227',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
  },

  // FOOTER
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1,
  },
});

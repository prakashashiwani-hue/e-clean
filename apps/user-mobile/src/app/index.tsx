import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();
  const pulse = useRef(new Animated.Value(0.4)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Fade + slide the logo in
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulsing loading dots
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Redirect after splash
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D4F" />

      {/* Background decorative circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      {/* Logo + tagline */}
      <Animated.View
        style={[
          styles.centerContent,
          { opacity: fadeIn, transform: [{ translateY: slideUp }] },
        ]}>
        {/* Logo mark */}
        <View style={styles.logoMark}>
          <Text style={styles.logoLeaf}>🌿</Text>
        </View>

        {/* Wordmark */}
        <Text style={styles.wordmark}>E-Clean</Text>
        <Text style={styles.tagline}>Together for a Cleaner Tomorrow</Text>
      </Animated.View>

      {/* Pulse loading dots */}
      <View style={styles.loadingRow}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                opacity: Animated.add(
                  pulse,
                  new Animated.Value(i === 1 ? 0 : i === 0 ? -0.2 : 0.2)
                ),
              },
            ]}
          />
        ))}
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>v1.0 · Municipal Services</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E7D4F',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Decorative background circles
  bgCircle1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: -100,
    right: -100,
  },
  bgCircle2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -80,
    left: -80,
  },
  bgCircle3: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: '35%',
    right: -40,
  },

  centerContent: {
    alignItems: 'center',
    marginBottom: 60,
  },

  logoMark: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  logoLeaf: {
    fontSize: 44,
  },

  wordmark: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FCFEFA',
    fontFamily: 'Sora',
    letterSpacing: -1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(252,254,250,0.75)',
    fontFamily: 'Plus Jakarta Sans',
    letterSpacing: 0.3,
    textAlign: 'center',
    paddingHorizontal: 40,
  },

  loadingRow: {
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    bottom: 80,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(252,254,250,0.8)',
  },

  footerText: {
    position: 'absolute',
    bottom: 36,
    fontSize: 12,
    color: 'rgba(252,254,250,0.4)',
    fontFamily: 'Plus Jakarta Sans',
  },
});

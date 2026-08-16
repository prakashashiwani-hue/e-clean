import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OtpScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(['1', '2', '3', '4', '5', '6']);
  const [timer, setTimer] = useState(25);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleKeyPress = (num: string) => {
    if (num === 'DEL') {
      setOtp((prev) => {
        const next = [...prev];
        const lastIdx = next.findLastIndex((val) => val !== '');
        if (lastIdx !== -1) next[lastIdx] = '';
        return next;
      });
    } else {
      setOtp((prev) => {
        const next = [...prev];
        const firstEmptyIdx = next.findIndex((val) => val === '');
        if (firstEmptyIdx !== -1) {
          next[firstEmptyIdx] = num;
        }
        return next;
      });
    }
  };

  const handleVerify = () => {
    // Navigate directly into main tab application (Home screen)
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBF8" />
      <View style={styles.content}>
        {/* Shield Check Badge */}
        <View style={styles.shieldBadge}>
          <Text style={styles.shieldIcon}>🛡️</Text>
        </View>

        <Text style={styles.title}>Verify Your Number</Text>
        <Text style={styles.subtitle}>Enter the 6-digit OTP sent to +91 98765 43210</Text>

        {/* 6 OTP Boxes */}
        <View style={styles.otpBoxesRow}>
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <View key={idx} style={[styles.otpBox, otp[idx] ? styles.otpBoxFilled : null]}>
              <Text style={styles.otpText}>{otp[idx] || ''}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.resendText}>
          Resend OTP in 00:{timer < 10 ? `0${timer}` : timer}
        </Text>
      </View>

      {/* Keypad */}
      <View style={styles.keypadContainer}>
        {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', 'DEL']].map((row, rIdx) => (
          <View key={rIdx} style={styles.keypadRow}>
            {row.map((btn, bIdx) => {
              if (!btn) return <View key={bIdx} style={styles.keypadBtnEmpty} />;
              return (
                <Pressable
                  key={bIdx}
                  style={styles.keypadBtn}
                  onPress={() => handleKeyPress(btn)}>
                  <Text style={styles.keypadText}>{btn}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}

        <Pressable style={styles.verifyBtn} onPress={handleVerify}>
          <Text style={styles.verifyBtnText}>Verify & Proceed →</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBF8',
    justifyContent: 'space-between',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    marginTop: 20,
  },
  shieldBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2E7D4F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: 'rgba(46, 90, 60, 0.25)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
  },
  shieldIcon: {
    fontSize: 34,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#23302A',
    fontFamily: 'Sora',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7A70',
    textAlign: 'center',
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: 28,
  },
  otpBoxesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  otpBox: {
    width: 44,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE3D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpBoxFilled: {
    borderColor: '#2E7D4F',
    backgroundColor: '#F5F8F3',
  },
  otpText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#23302A',
    fontFamily: 'Sora',
  },
  resendText: {
    fontSize: 13,
    color: '#6B7A70',
    fontFamily: 'Plus Jakarta Sans',
  },
  keypadContainer: {
    gap: 12,
    marginBottom: 12,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  keypadBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE3D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadBtnEmpty: {
    flex: 1,
    height: 48,
  },
  keypadText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#23302A',
    fontFamily: 'Sora',
  },
  verifyBtn: {
    backgroundColor: '#2E7D4F',
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: 'rgba(46, 90, 60, 0.25)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 4,
  },
  verifyBtnText: {
    color: '#FCFEFA',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Sora',
  },
});

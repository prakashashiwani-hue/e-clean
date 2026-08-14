import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = () => {
    // Navigate to OTP verification screen
    router.push('/otp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBF8" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to continue reporting civic issues</Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tabItem, tab === 'login' && styles.tabItemActive]}
            onPress={() => setTab('login')}>
            <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>Login</Text>
          </Pressable>
          <Pressable
            style={[styles.tabItem, tab === 'register' && styles.tabItemActive]}
            onPress={() => setTab('register')}>
            <Text style={[styles.tabText, tab === 'register' && styles.tabTextActive]}>Register</Text>
          </Pressable>
        </View>

        {/* Input Fields */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+91 98765 43210"
            placeholderTextColor="#6B7A70"
          />

          <Text style={styles.fieldLabel}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#6B7A70"
          />

          <Pressable style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </Pressable>
        </View>

        {/* Action Button */}
        <Pressable style={styles.loginBtn} onPress={handleSubmit}>
          <Text style={styles.loginBtnText}>{tab === 'login' ? 'Login' : 'Send OTP Register'}</Text>
        </Pressable>

        {/* Social Auth Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login Buttons */}
        <View style={styles.socialRow}>
          <Pressable style={styles.socialBtn} onPress={handleSubmit}>
            <Text style={styles.socialIcon}>G</Text>
          </Pressable>
          <Pressable style={styles.socialBtn} onPress={handleSubmit}>
            <Text style={styles.socialIcon}></Text>
          </Pressable>
          <Pressable style={styles.socialBtn} onPress={handleSubmit}>
            <Text style={styles.socialIcon}>📱</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBF8',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#23302A',
    fontFamily: 'Sora',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7A70',
    fontFamily: 'Plus Jakarta Sans',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F5F8F3',
    borderRadius: 999,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DCE3D8',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 999,
  },
  tabItemActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(46, 90, 60, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7A70',
    fontFamily: 'Plus Jakarta Sans',
  },
  tabTextActive: {
    color: '#2E7D4F',
    fontWeight: '800',
  },
  formGroup: {
    gap: 8,
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#23302A',
    fontFamily: 'Sora',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#DCE3D8',
    fontSize: 15,
    color: '#23302A',
    fontFamily: 'Plus Jakarta Sans',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D4F',
    fontFamily: 'Plus Jakarta Sans',
  },
  loginBtn: {
    backgroundColor: '#2E7D4F',
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: 'rgba(46, 90, 60, 0.25)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 4,
  },
  loginBtnText: {
    color: '#FCFEFA',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Sora',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DCE3D8',
  },
  dividerText: {
    fontSize: 12,
    color: '#6B7A70',
    fontFamily: 'Plus Jakarta Sans',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE3D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#23302A',
  },
});

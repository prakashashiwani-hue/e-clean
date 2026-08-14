import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ReportSubmittedScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const reportId = id || '#1035';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBF8" />
      <View style={styles.content}>
        {/* Big Green Check Badge */}
        <View style={styles.checkCircle}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>

        <Text style={styles.title}>Thank You!</Text>
        <Text style={styles.subtitle}>Your report has been submitted successfully.</Text>

        {/* Report ID Box */}
        <View style={styles.reportIdBox}>
          <Text style={styles.reportIdLabel}>Report ID</Text>
          <Text style={styles.reportIdValue}>{reportId}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={styles.viewReportBtn}
          onPress={() => router.push(`/report-tracking/${encodeURIComponent(reportId)}`)}>
          <Text style={styles.viewReportText}>View Report</Text>
        </Pressable>

        <Pressable style={styles.backHomeBtn} onPress={() => router.replace('/(tabs)/home')}>
          <Text style={styles.backHomeText}>Back to Home</Text>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2E7D4F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: 'rgba(46, 90, 60, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 6,
  },
  checkIcon: {
    fontSize: 52,
    color: '#FCFEFA',
    fontWeight: '800',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#23302A',
    fontFamily: 'Sora',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7A70',
    textAlign: 'center',
    fontFamily: 'Plus Jakarta Sans',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  reportIdBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCE3D8',
  },
  reportIdLabel: {
    fontSize: 12,
    color: '#6B7A70',
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: 2,
  },
  reportIdValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2E7D4F',
    fontFamily: 'Sora',
  },
  footer: {
    marginBottom: 16,
    gap: 12,
  },
  viewReportBtn: {
    backgroundColor: '#2E7D4F',
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: 'rgba(46, 90, 60, 0.25)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 4,
  },
  viewReportText: {
    color: '#FCFEFA',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Sora',
  },
  backHomeBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backHomeText: {
    color: '#6B7A70',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Plus Jakarta Sans',
  },
});

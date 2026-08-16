import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCitizenStore } from '@/store/citizen-store';

export default function CameraCaptureScreen() {
  const router = useRouter();
  const { updateDraftReport } = useCitizenStore();
  const [activeTab, setActiveTab] = useState<'Doc' | 'Photo' | 'Gallery'>('Photo');
  const [flash, setFlash] = useState(false);
  const [captured, setCaptured] = useState(false);

  const samplePhoto =
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80';

  const handleCapture = () => {
    setCaptured(true);
    updateDraftReport({
      photos: [samplePhoto],
      location: 'Sector 21, Rourkela, Odisha',
    });
  };

  const handleNext = () => {
    router.push('/report-details');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Dark Viewfinder */}
      <View style={styles.viewfinderContainer}>
        <Image source={{ uri: samplePhoto }} style={styles.viewfinderImage} resizeMode="cover" />

        {/* Overlay gradient tint */}
        <View style={styles.topGradient} />
        <View style={styles.bottomGradient} />

        {/* Top Controls */}
        <View style={styles.topControls}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <Text style={styles.iconText}>✕</Text>
          </Pressable>

          <Text style={styles.topTitle}>Capture Waste</Text>

          <Pressable onPress={() => setFlash(!flash)} style={styles.iconBtn}>
            <Text style={styles.iconText}>{flash ? '⚡' : '🌩️'}</Text>
          </Pressable>
        </View>

        {/* Viewfinder guide frame */}
        {!captured && (
          <View style={styles.guideFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
        )}

        {/* Captured checkmark */}
        {captured && (
          <View style={styles.capturedBadge}>
            <Text style={styles.capturedIcon}>✓</Text>
            <Text style={styles.capturedText}>Photo Captured</Text>
          </View>
        )}

        {/* Location Bar */}
        <View style={styles.locationBar}>
          <Text style={styles.locationPinText}>📍 Sector 21, Rourkela, Odisha</Text>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          {/* Mode Tabs */}
          <View style={styles.modeTabsRow}>
            {(['Doc', 'Photo', 'Gallery'] as const).map((mode) => (
              <Pressable key={mode} onPress={() => setActiveTab(mode)} style={styles.modeTab}>
                <Text style={[styles.modeText, activeTab === mode && styles.modeTextActive]}>
                  {mode}
                </Text>
                {activeTab === mode && <View style={styles.modeUnderline} />}
              </Pressable>
            ))}
          </View>

          {/* Shutter Row */}
          <View style={styles.shutterRow}>
            {/* Gallery thumbnail placeholder */}
            <View style={styles.galleryThumb}>
              {captured && (
                <Image source={{ uri: samplePhoto }} style={styles.galleryThumbImg} />
              )}
            </View>

            {/* Main Shutter Button */}
            <Pressable style={styles.shutterRing} onPress={handleCapture}>
              <View style={[styles.shutterCenter, captured && styles.shutterCenterCaptured]} />
            </Pressable>

            {/* Flip camera */}
            <Pressable style={styles.flipBtn}>
              <Text style={styles.flipIcon}>🔄</Text>
            </Pressable>
          </View>

          {/* Next button — appears after capture */}
          {captured && (
            <Pressable style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>Next: Add Details →</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  viewfinderContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
  },
  viewfinderImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.88,
  },

  // Gradients
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  // Top bar
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 12,
    zIndex: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  topTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Sora',
  },

  // Guide frame corners
  guideFrame: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    right: '10%',
    height: '40%',
    zIndex: 5,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#FFFFFF',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 4,
  },

  // Captured badge
  capturedBadge: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: 'rgba(46, 125, 79, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  capturedIcon: {
    fontSize: 18,
    color: '#FCFEFA',
    fontWeight: '800',
  },
  capturedText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FCFEFA',
    fontFamily: 'Sora',
  },

  // Location
  locationBar: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 10,
  },
  locationPinText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Plus Jakarta Sans',
  },

  // Bottom controls
  bottomControls: {
    paddingBottom: 24,
    paddingHorizontal: 20,
    zIndex: 10,
    gap: 16,
  },
  modeTabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 36,
  },
  modeTab: {
    alignItems: 'center',
    gap: 4,
  },
  modeText: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Plus Jakarta Sans',
  },
  modeTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  modeUnderline: {
    width: 20,
    height: 2,
    borderRadius: 999,
    backgroundColor: '#E3A93A',
  },

  // Shutter
  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  galleryThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  galleryThumbImg: {
    width: '100%',
    height: '100%',
  },
  shutterRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterCenter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  shutterCenterCaptured: {
    backgroundColor: '#2E7D4F',
  },
  flipBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  flipIcon: {
    fontSize: 18,
  },

  // Next button
  nextBtn: {
    backgroundColor: '#2E7D4F',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: 'rgba(46, 90, 60, 0.4)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 4,
  },
  nextBtnText: {
    color: '#FCFEFA',
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'Sora',
  },
});

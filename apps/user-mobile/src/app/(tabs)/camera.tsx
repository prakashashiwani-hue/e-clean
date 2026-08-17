import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  FadeIn,
} from 'react-native-reanimated';
import { useCitizenStore } from '@/store/citizen-store';

const MAX_PHOTOS = 5;

export default function CameraCaptureScreen() {
  const router = useRouter();
  const { draftReport, updateDraftReport } = useCitizenStore();
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [capturing, setCapturing] = useState(false);
  const [activeTab, setActiveTab] = useState<'Photo' | 'Gallery'>('Photo');

  const flashOverlay = useSharedValue(0);
  const photos = draftReport.photos ?? [];
  const location = draftReport.location || 'Detecting location...';

  const fetchLocation = useCallback(async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const { coords } = await Location.getCurrentPositionAsync({});
      updateDraftReport({
        lat: coords.latitude,
        lng: coords.longitude,
      });
      const address = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      const first = address[0];
      if (first) {
        const parts = [first.street, first.district, first.city, first.region].filter(Boolean);
        const label = parts.length > 0 ? parts.join(', ') : 'Exact GPS locked';
        updateDraftReport({ location: label });
      }
    } catch {
      // location is optional for the draft
    }
  }, [updateDraftReport]);

  React.useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const handleCapture = async () => {
    if (capturing || !cameraRef.current) return;
    if (photos.length >= MAX_PHOTOS) {
      Alert.alert('Limit reached', `You can add up to ${MAX_PHOTOS} photos per report.`);
      return;
    }
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) {
        flashOverlay.value = withSequence(
          withTiming(0.85, { duration: 100 }),
          withTiming(0, { duration: 300 })
        );
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        updateDraftReport({ photos: [...photos, photo.uri] });
      }
    } catch {
      Alert.alert('Error', 'Could not capture photo. Please try again.');
    } finally {
      setCapturing(false);
    }
  };

  const handleGalleryPick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: MAX_PHOTOS - photos.length,
        quality: 0.7,
      });
      if (!result.canceled && result.assets.length > 0) {
        Haptics.selectionAsync().catch(() => {});
        const uris = result.assets.map((a) => a.uri).slice(0, MAX_PHOTOS - photos.length);
        updateDraftReport({ photos: [...photos, ...uris] });
      }
    } catch {
      Alert.alert('Error', 'Could not open your photo library.');
    }
  };

  const handleRemovePhoto = (index: number) => {
    const next = photos.filter((_, i) => i !== index);
    updateDraftReport({ photos: next });
  };

  const handleNext = () => {
    if (photos.length === 0) return;
    router.push('/report-details');
  };

  const flashOverlayStyle = useAnimatedStyle(() => ({
    opacity: flashOverlay.value,
  }));

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, styles.permissionContainer]}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0F0C" />
        <View style={styles.permissionIconCircle}>
          <Text style={styles.permissionIcon}>📷</Text>
        </View>
        <Text style={styles.permissionTitle}>Camera Access Needed</Text>
        <Text style={styles.permissionText}>
          e-clean needs the camera to photograph waste, so AI can classify it
          and teams can clean it up.
        </Text>
        <Pressable style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Enable Camera</Text>
        </Pressable>
        <Pressable style={styles.permissionGhostBtn} onPress={() => router.back()}>
          <Text style={styles.permissionGhostText}>Not Now</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View style={styles.viewfinderContainer}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          flash={flash}
          mirror={facing === 'front'}
          onCameraReady={fetchLocation}
        />

        {/* Gradients */}
        <LinearGradient
          colors={['rgba(0,0,0,0.55)', 'transparent']}
          style={styles.topGradient}
          pointerEvents="none"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.72)']}
          style={styles.bottomGradient}
          pointerEvents="none"
        />

        {/* Shutter flash effect */}
        <Animated.View
          style={[styles.flashOverlay, flashOverlayStyle]}
          pointerEvents="none"
        />

        {/* Top Controls */}
        <View style={styles.topControls}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <Text style={styles.iconText}>✕</Text>
          </Pressable>

          <Text style={styles.topTitle}>Capture Waste</Text>

          <Pressable
            onPress={() =>
              setFlash((f) => (f === 'off' ? 'on' : 'off'))
            }
            style={styles.iconBtn}>
            <Text style={[styles.iconText, flash === 'off' && { opacity: 0.5 }]}>⚡</Text>
            {flash === 'on' && <View style={styles.flashDot} />}
          </Pressable>
        </View>

        {/* Viewfinder guide frame */}
        <View style={styles.guideFrame} pointerEvents="none">
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>

        {/* Captured strip */}
        {photos.length > 0 && (
          <Animated.View style={styles.capturedRow} entering={FadeIn.duration(250)}>
            {photos.map((uri, idx) => (
              <View key={`${uri}-${idx}`} style={styles.thumbWrap}>
                <Image source={{ uri }} style={styles.thumbImg} />
                <Pressable style={styles.thumbRemove} onPress={() => handleRemovePhoto(idx)}>
                  <Text style={styles.thumbRemoveText}>✕</Text>
                </Pressable>
              </View>
            ))}
            {photos.length < MAX_PHOTOS && (
              <View style={styles.thumbCount}>
                <Text style={styles.thumbCountText}>
                  {photos.length}/{MAX_PHOTOS}
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* Location Bar */}
        <View style={styles.locationBar}>
          <Text style={styles.locationPinText} numberOfLines={1}>
            📍 {location}
          </Text>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          {/* Mode Tabs */}
          <View style={styles.modeTabsRow}>
            <Pressable
              onPress={() => setActiveTab('Photo')}
              style={styles.modeTab}>
              <Text style={[styles.modeText, activeTab === 'Photo' && styles.modeTextActive]}>
                Photo
              </Text>
              {activeTab === 'Photo' && <View style={styles.modeUnderline} />}
            </Pressable>
            <Pressable onPress={handleGalleryPick} style={styles.modeTab}>
              <Text style={styles.modeText}>Gallery</Text>
            </Pressable>
          </View>

          {/* Shutter Row */}
          <View style={styles.shutterRow}>
            {/* Gallery thumbnail */}
            <Pressable onPress={handleGalleryPick} style={styles.galleryThumb}>
              {photos.length > 0 ? (
                <Image source={{ uri: photos[photos.length - 1] }} style={styles.galleryThumbImg} />
              ) : (
                <Text style={styles.galleryThumbIcon}>🖼️</Text>
              )}
            </Pressable>

            {/* Main Shutter Button */}
            <Pressable
              style={styles.shutterRing}
              onPress={handleCapture}
              disabled={capturing}>
              <View
                style={[
                  styles.shutterCenter,
                  (capturing || photos.length >= MAX_PHOTOS) && styles.shutterCenterCaptured,
                ]}
              />
            </Pressable>

            {/* Flip camera */}
            <Pressable
              style={styles.flipBtn}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setFacing((f) => (f === 'back' ? 'front' : 'back'));
              }}>
              <Text style={styles.flipIcon}>🔄</Text>
            </Pressable>
          </View>

          {/* Next button */}
          {photos.length > 0 && (
            <Animated.View entering={FadeIn.duration(250)}>
              <Pressable style={styles.nextBtn} onPress={handleNext}>
                <Text style={styles.nextBtnText}>Next: Add Details →</Text>
              </Pressable>
            </Animated.View>
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

  // Permission state
  permissionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0F0C',
    padding: 32,
    gap: 12,
  },
  permissionIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(46, 125, 79, 0.25)',
    borderWidth: 2,
    borderColor: 'rgba(46, 125, 79, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  permissionIcon: { fontSize: 40 },
  permissionTitle: {
    color: '#FCFEFA',
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'Sora',
    textAlign: 'center',
  },
  permissionText: {
    color: 'rgba(252, 254, 250, 0.65)',
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 16,
  },
  permissionBtn: {
    backgroundColor: '#2E7D4F',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 999,
  },
  permissionBtnText: {
    color: '#FCFEFA',
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'Sora',
  },
  permissionGhostBtn: {
    padding: 8,
  },
  permissionGhostText: {
    color: 'rgba(252, 254, 250, 0.5)',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Plus Jakarta Sans',
  },

  // Gradients
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 260,
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    zIndex: 20,
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
  flashDot: {
    position: 'absolute',
    bottom: 6,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E3A93A',
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
    top: '22%',
    left: '8%',
    right: '8%',
    height: '42%',
    zIndex: 5,
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: 'rgba(252, 254, 250, 0.9)',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 6,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 6,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 6,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 6,
  },

  // Captured strip
  capturedRow: {
    position: 'absolute',
    top: '66%',
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 8,
    zIndex: 12,
  },
  thumbWrap: {
    position: 'relative',
  },
  thumbImg: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  thumbRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#D64545',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbRemoveText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  thumbCount: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  thumbCountText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },

  // Location
  locationBar: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 10,
    maxWidth: '80%',
  },
  locationPinText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Plus Jakarta Sans',
  },

  // Bottom controls
  bottomControls: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    zIndex: 10,
    gap: 14,
  },
  modeTabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 36,
  },
  modeTab: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
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
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryThumbImg: {
    width: '100%',
    height: '100%',
  },
  galleryThumbIcon: {
    fontSize: 16,
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

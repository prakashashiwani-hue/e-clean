import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '📸',
    image:
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    headline: 'Report Waste Instantly',
    sub: 'Snap a photo of any waste issue in your area and submit a report in under 60 seconds.',
  },
  {
    id: '2',
    emoji: '📊',
    image:
      'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80',
    headline: 'Track Municipal Action',
    sub: 'Follow your report in real-time as the municipal team reviews, assigns, and resolves it.',
  },
  {
    id: '3',
    emoji: '🌿',
    image:
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80',
    headline: 'See Your City Get Cleaner',
    sub: 'Earn eco-points, view hotspot maps, and watch your neighbourhood transform together.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const goToNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      const next = activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    } else {
      router.push('/location-permission');
    }
  };

  const handleSkip = () => {
    router.push('/location-permission');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBF8" />

      {/* Skip button */}
      <View style={styles.topRow}>
        <Pressable onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Slide list */}
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            {/* Illustration card */}
            <View style={styles.imageCard}>
              <Image source={{ uri: item.image }} style={styles.heroImage} resizeMode="cover" />
              {/* Overlay pill */}
              <View style={styles.emojiPill}>
                <Text style={styles.emojiText}>{item.emoji}</Text>
              </View>
            </View>

            {/* Copy */}
            <Text style={styles.headline}>{item.headline}</Text>
            <Text style={styles.subtext}>{item.sub}</Text>
          </View>
        )}
      />

      {/* Bottom controls */}
      <View style={styles.footer}>
        {/* Pagination dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => {
            const isActive = i === activeIndex;
            return (
              <View
                key={i}
                style={[
                  styles.dot,
                  isActive ? styles.dotActive : styles.dotInactive,
                ]}
              />
            );
          })}
        </View>

        {/* Next / Get Started */}
        <Pressable style={styles.nextBtn} onPress={goToNext}>
          <Text style={styles.nextBtnText}>
            {activeIndex < SLIDES.length - 1 ? 'Next →' : 'Get Started →'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFBF8',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  skipBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F5F8F3',
    borderWidth: 1,
    borderColor: '#DCE3D8',
  },
  skipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7A70',
    fontFamily: 'Plus Jakarta Sans',
  },

  // Slides
  slide: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 12,
  },
  imageCard: {
    width: '100%',
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    position: 'relative',
    backgroundColor: '#E8F0E5',
    borderWidth: 1,
    borderColor: '#DCE3D8',
    shadowColor: 'rgba(46, 90, 60, 0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 4,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  emojiPill: {
    position: 'absolute',
    bottom: 14,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(220,227,216,0.6)',
    shadowColor: 'rgba(46,90,60,0.12)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 2,
  },
  emojiText: {
    fontSize: 22,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: '#23302A',
    fontFamily: 'Sora',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  subtext: {
    fontSize: 15,
    color: '#6B7A70',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Plus Jakarta Sans',
    paddingHorizontal: 8,
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 999,
  },
  dotActive: {
    width: 28,
    backgroundColor: '#2E7D4F',
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#DCEBD9',
  },
  nextBtn: {
    backgroundColor: '#2E7D4F',
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: 'rgba(46, 90, 60, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 4,
  },
  nextBtnText: {
    color: '#FCFEFA',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Sora',
  },
});

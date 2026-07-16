import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Image, Animated, Dimensions, TouchableOpacity
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.82;
const SPACING = 10;

// Each review with its aspect ratio for proper display
const reviews = [
  { id: 1, image: require('../assets/images/reviews/1.png'), ratio: 287 / 770 },
  { id: 2, image: require('../assets/images/reviews/2.png'), ratio: 193 / 790 },
  { id: 3, image: require('../assets/images/reviews/3.png'), ratio: 208 / 786 },
  { id: 4, image: require('../assets/images/reviews/4.png'), ratio: 187 / 842 },
  { id: 5, image: require('../assets/images/reviews/5.png'), ratio: 193 / 787 },
  { id: 6, image: require('../assets/images/reviews/6.png'), ratio: 347 / 772 },
  { id: 7, image: require('../assets/images/reviews/7.png'), ratio: 160 / 772 },
  { id: 8, image: require('../assets/images/reviews/8.png'), ratio: 160 / 803 },
  { id: 9, image: require('../assets/images/reviews/9.png'), ratio: 423 / 833 },
  { id: 10, image: require('../assets/images/reviews/10.png'), ratio: 213 / 822 },
  { id: 11, image: require('../assets/images/reviews/11.png'), ratio: 128 / 782 },
];

export default function ReviewsCarousel() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const autoScrollRef = useRef(null);

  const startAutoScroll = () => {
    autoScrollRef.current = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % reviews.length;
        scrollRef.current?.scrollTo({
          x: next * (CARD_WIDTH + SPACING * 2),
          animated: true,
        });
        return next;
      });
    }, 2500);
  };

  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(autoScrollRef.current);
  }, []);

  const handleScrollBegin = () => clearInterval(autoScrollRef.current);
  const handleScrollEnd = () => startAutoScroll();

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>GOOGLE REVIEWS</Text>
        <Text style={styles.sectionTitle}>
          What Students <Text style={styles.accent}>Say About Us</Text>
        </Text>
        <View style={styles.ratingRow}>
          <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
          <View style={styles.ratingInfo}>
            <Text style={styles.ratingNum}>5.0</Text>
            <Text style={styles.ratingLabel}>on recent Google Reviews</Text>
          </View>
        </View>
      </View>

      {/* CAROUSEL */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + SPACING * 2}
        snapToAlignment="center">

        {reviews.map((review, index) => {
          const inputRange = [
            (index - 1) * (CARD_WIDTH + SPACING * 2),
            index * (CARD_WIDTH + SPACING * 2),
            (index + 1) * (CARD_WIDTH + SPACING * 2),
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.55, 1, 0.55],
            extrapolate: 'clamp',
          });

          const cardHeight = CARD_WIDTH * review.ratio;

          return (
            <Animated.View
              key={review.id}
              style={[
                styles.card,
                {
                  transform: [{ scale }],
                  opacity,
                  height: cardHeight + 16,
                }
              ]}>
              <Image
                source={review.image}
                style={{
                  width: CARD_WIDTH - 16,
                  height: cardHeight,
                  borderRadius: 8,
                }}
                resizeMode="contain"
              />
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      {/* DOTS */}
      <View style={styles.dotsRow}>
        {reviews.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              setActiveIndex(i);
              scrollRef.current?.scrollTo({
                x: i * (CARD_WIDTH + SPACING * 2),
                animated: true,
              });
            }}>
            <View style={[styles.dot, activeIndex === i && styles.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* COUNTER */}
      <Text style={styles.counter}>{activeIndex + 1} / {reviews.length}</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8FAFF', paddingBottom: 24 },

  // HEADER
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  sectionLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 3, color: '#C9A227', textTransform: 'uppercase', marginBottom: 8 },
  sectionTitle: { fontSize: 24, fontWeight: '700', color: '#0F2548', marginBottom: 12, lineHeight: 32 },
  accent: { color: '#C9A227' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'white', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E8EDF8' },
  stars: { fontSize: 18 },
  ratingInfo: { flex: 1 },
  ratingNum: { fontSize: 20, fontWeight: '900', color: '#1A3A6C' },
  ratingLabel: { fontSize: 12, color: '#6B7280' },

  // CAROUSEL
  scrollContent: { paddingHorizontal: 20, alignItems: 'center' },
  card: {
    width: CARD_WIDTH,
    marginHorizontal: SPACING,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // DOTS
  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap: 5, flexWrap: 'wrap', paddingHorizontal: 20 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D1D5DB' },
  dotActive: { width: 18, backgroundColor: '#C9A227', borderRadius: 3 },

  // COUNTER
  counter: { textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 8 },
});
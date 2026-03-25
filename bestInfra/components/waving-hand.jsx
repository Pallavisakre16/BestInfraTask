import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { useEffect } from 'react';

export function WavingHand() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(1, { duration: 600 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      rotation.value,
      [0, 1],
      [0, 25],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { rotate: `${rotate}deg` },
        { translateY: 0 },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Image
        source={require('../assets/images/hand.png')}
        style={styles.handImage}
        contentFit="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    transformOrigin: 'bottom right',
  },
  handImage: {
    width: '100%',
    height: '100%',
  },
});

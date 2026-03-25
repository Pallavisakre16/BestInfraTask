import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

function strengthenRippleColor(color, minAlpha = 0.42) {
  if (typeof color !== 'string') {
    return color;
  }

  const rgbaMatch = color.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i
  );

  if (!rgbaMatch) {
    return color;
  }

  const [, r, g, b, alphaRaw] = rgbaMatch;
  const alpha = alphaRaw == null ? 1 : Number(alphaRaw);
  const resolvedAlpha = Number.isNaN(alpha) ? minAlpha : Math.max(minAlpha, alpha);
  return `rgba(${r}, ${g}, ${b}, ${resolvedAlpha})`;
}

/**
 * RippleAnimation Component
 * Replicates the concentric ripple circles from the onboarding screen.
 *
 * Props:
 *  - color        : string   - ripple ring color (default: "#FFFFFF")
 *  - size         : number   - base diameter in px (default: 160)
 *  - rings        : number   - how many concentric rings (default: 4)
 *  - duration     : number   - one full cycle in ms (default: 2400)
 *  - delay        : number   - stagger between rings in ms (default: 600)
 *  - minOpacity   : number   - opacity at full expansion (default: 0)
 *  - maxOpacity   : number   - opacity at rest (default: 0.25)
 *  - style        : object   - extra styles for the outer wrapper
 *  - children     : node     - content rendered in the center (e.g. logo)
 */
const RippleRing = ({
  size,
  color,
  index,
  stepFraction,
  progress,
  minOpacity,
  maxOpacity,
  maxScale,
}) => {
  const startAt = Math.min(0.95, Math.max(0, index * stepFraction));
  const revealSpan = Math.max(0.055, Math.min(0.16, stepFraction * 0.9));
  const peakAt = Math.min(0.995, startAt + revealSpan);

  const opacity =
    index === 0
      ? progress.interpolate({
          inputRange: [0, peakAt, 1],
          outputRange: [maxOpacity, maxOpacity, minOpacity],
          extrapolate: 'clamp',
        })
      : progress.interpolate({
          inputRange: [0, startAt, peakAt, 1],
          outputRange: [0.02, 0.02, maxOpacity, minOpacity],
          extrapolate: 'clamp',
        });

  const scale =
    index === 0
      ? progress.interpolate({
          inputRange: [0, peakAt, 1],
          outputRange: [1, maxScale, 1],
          extrapolate: 'clamp',
        })
      : progress.interpolate({
          inputRange: [0, startAt, peakAt, 1],
          outputRange: [1, 1, maxScale, 1],
          extrapolate: 'clamp',
        });

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: strengthenRippleColor(color),
          marginLeft: -size / 2,
          marginTop: -size / 2,
          opacity,
          transform: [{ scale }],
        },
      ]}
    />
  );
};

export function AnimatedRippleRings({
  color = '#FFFFFF',
  size = 120,
  rings = 7,
  ringSpacing = 46,
  extraGap = 20,
  duration = 2600,
  delay = 220,
  minOpacity = 0.16,
  maxOpacity = 0.46,
  maxScale = 1.022,
  style,
  children,
  sizes,
}) {
  const cycleProgress = useRef(new Animated.Value(0)).current;

  const sourceSizes =
    Array.isArray(sizes) && sizes.length
      ? sizes
      : Array.from({ length: Math.max(1, rings) }, (_, i) => size + i * ringSpacing);
  const ringSizes = sourceSizes
    .slice(0, 7)
    .map((ringSize, i) => ringSize + i * Math.max(0, extraGap));
  const outerSize = Math.max(...ringSizes);
  const stepFraction = Math.min(0.22, Math.max(0.06, delay / Math.max(1, duration)));

  useEffect(() => {
    cycleProgress.setValue(0);
    const loop = Animated.loop(
      Animated.timing(cycleProgress, {
        toValue: 1,
        duration: Math.max(1200, duration),
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    loop.start();
    return () => {
      loop.stop();
    };
  }, [cycleProgress, duration]);

  return (
    <View pointerEvents="none" style={[styles.wrapper, { width: outerSize, height: outerSize }, style]}>
      {ringSizes.map((ringSize, i) => {
        const ringMinOpacity = Math.max(0.08, minOpacity - i * 0.012);
        const ringMaxOpacity = Math.max(ringMinOpacity + 0.08, maxOpacity - i * 0.04);

        return (
          <RippleRing
            key={`${ringSize}-${i}`}
            size={ringSize}
            color={color}
            index={i}
            stepFraction={stepFraction}
            progress={cycleProgress}
            minOpacity={ringMinOpacity}
            maxOpacity={ringMaxOpacity}
            maxScale={maxScale}
          />
        );
      })}
      {/* Center content (logo, icon, etc.) */}
      <View style={styles.centre}>{children}</View>
    </View>
  );
}

export default AnimatedRippleRings;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    borderWidth: 1.35,
  },
  centre: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


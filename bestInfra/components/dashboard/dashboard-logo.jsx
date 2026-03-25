import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

export function DashboardLogo({ width = 86, height = 86 }) {
  return (
    <View style={[styles.wrap, { width, height }]}>
      <Image
        source={require('../../assets/images/Vector.png')}
        style={[
          styles.base,
          {
            width: width * 0.98,
            height: height * 0.80,
            left: width * 0.01,
            top: height * 0.12,
          },
        ]}
        contentFit="contain"
      />
      <Image
        source={require('../../assets/images/Vector (2).png')}
        style={[
          styles.dot,
          {
            width: width * 0.18,
            height: height * 0.2,
            right: width * 0.10,
            top: height * 0.13,
          },
        ]}
        contentFit="contain"
      />
      <Image
        source={require('../../assets/images/Vector (1).png')}
        style={[
          styles.wedge,
          {
            width: width * 0.18,
            height: height * 0.26,
            right: width * 0.08,
            bottom: height * 0.08,
          },
        ]}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    
  },
  base: {
    position: 'absolute',
  },
  dot: {
    position: 'absolute',
  },
  wedge: {
    position: 'absolute',
  },
});

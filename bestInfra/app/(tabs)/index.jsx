import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Image source={require('../../assets/images/Ellipse 1.png')} style={styles.glowBase} />
      <Image source={require('../../assets/images/Ellipse 1.png')} style={styles.glowHighlight} />

      <View style={styles.ringsCenter}>
        <View style={styles.rings}>
          <View style={[styles.ring, { width: 110, height: 110 }]} />
          <View style={[styles.ring, { width: 140, height: 140 }]} />
          <View style={[styles.ring, { width: 170, height: 170 }]} />
          <View style={[styles.ring, { width: 200, height: 200 }]} />
          <View style={[styles.ring, { width: 230, height: 230 }]} />
          <View style={[styles.ring, { width: 260, height: 260 }]} />
        </View>

        <Image source={require('../../assets/images/Logo.png')} style={styles.logo} contentFit="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C266C',
    overflow: 'hidden',
  },
  glowBase: {
    position: 'absolute',
    width: 640,
    height: 640,
    left: -320,
    bottom: -220,
    opacity: 0.95,
    transform: [{ rotate: '-15deg' }],
  },
  glowHighlight: {
    position: 'absolute',
    width: 520,
    height: 520,
    left: -220,
    bottom: -250,
    opacity: 0.75,
    transform: [{ rotate: '8deg' }],
  },
  ringsCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  rings: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(112, 162, 255, 0.18)',
  },
  logo: {
    width: 82,
    height: 82,
    zIndex: 10,
  },
});

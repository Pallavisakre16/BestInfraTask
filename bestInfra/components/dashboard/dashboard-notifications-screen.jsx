import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedRippleRings } from '../animated-ripple-rings';
const NOTIFICATION_RIPPLE_SIZES = [96, 130, 164, 198, 232, 266, 300, 334];
const CONTENT_MAX_WIDTH = 460;

function getNotificationAppearance(item, index) {
  const title = item.title.toLowerCase();

  if (title.includes('balance') || index === 0) {
    return {
      titleColor: '#24387A',
      iconBackground: '#EEF0F5',
      iconSource: require('../../assets/images/cheap-dollar 1.png'),
      iconSize: 18,
    };
  }

  if (title.includes('due') || index === 1) {
    return {
      titleColor: '#FF7B55',
      iconBackground: '#FBEDE8',
      iconSource: require('../../assets/images/calendar 1.png'),
      iconSize: 16,
    };
  }

  return {
    titleColor: '#4CBF63',
    iconBackground: '#EAF5EB',
    iconSource: require('../../assets/images/hand-bill 1.png'),
    iconSize: 17,
  };
}

function formatMessage(text = '') {
  return text.replace(/Rs\s?([0-9,]+)/g, '\u20B9$1');
}

export function DashboardNotificationsScreen({
  insets,
  items,
  loading,
  onBack,
  sidePadding,
}) {
  const horizontalPadding = Math.max(12, Math.min(22, sidePadding - 1));
  const notifications = items || [];

  return (
    <View style={[styles.screen, { backgroundColor: '#123D90' }]}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <AnimatedRippleRings color="rgba(129, 154, 214, 0.34)" sizes={NOTIFICATION_RIPPLE_SIZES} style={styles.rippleBackdrop}>
        <View pointerEvents="none" style={styles.logoWrap}>
          <Image source={require('../../assets/images/Logo (1).png')} style={styles.centerLogo} contentFit="contain" />
        </View>
      </AnimatedRippleRings>

      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View
          style={[
            styles.content,
            {
              paddingHorizontal: horizontalPadding,
              paddingBottom: insets.bottom,
              maxWidth: CONTENT_MAX_WIDTH,
              width: '100%',
              alignSelf: 'center',
            },
          ]}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={[styles.circleButton, styles.leftButton, { backgroundColor: '#FFFFFF' }]}
              activeOpacity={0.85}
              onPress={onBack}>
              <Image
                source={require('../../assets/images/bars-staggered 2.png')}
                style={styles.headerIcon}
                contentFit="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.circleButton, styles.rightButton, { backgroundColor: '#59B86E' }]}
              activeOpacity={0.9}>
              <Image source={require('../../assets/images/bell 1 (1).png')} style={styles.headerIcon} contentFit="contain" />
            </TouchableOpacity>
          </View>

          <View style={styles.cardsWrap}>
            {loading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator size="small" color="#FFFFFF" />
              </View>
            ) : !notifications.length ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>No notifications available right now.</Text>
              </View>
            ) : (
              notifications.map((item, index) => {
                const appearance = getNotificationAppearance(item, index);

                return (
                  <View key={item.id} style={styles.card}>
                    <View style={styles.cardCopy}>
                      <Text style={[styles.cardTitle, { color: appearance.titleColor }]}>{item.title}</Text>
                      <Text style={styles.cardMessage}>{formatMessage(item.message)}</Text>
                    </View>

                    <View style={[styles.iconCircle, { backgroundColor: appearance.iconBackground }]}>
                      <Image
                        source={appearance.iconSource}
                        style={{ width: appearance.iconSize, height: appearance.iconSize }}
                        contentFit="contain"
                      />
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    
  },
  safeArea: {
    flex: 1,
  },
  rippleBackdrop: {
    position: 'absolute',
    top: -72,
    left: 0,
    right: 0,
    width: '100%',
    height: 344,
  },
  logoWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLogo: {
    width: 45,
    height: 51,
  },
  content: {
    flex: 1,
  },
  topBar: {
    height: 56,
    marginTop: 8,
    position: 'relative',
  },
  circleButton: {
    position: 'absolute',
    top: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButton: {
    left: 0,
  },
  rightButton: {
    right: 0,
  },
  headerIcon: {
    width: 18,
    height: 18,
  },
  cardsWrap: {
    marginTop: 69,
    rowGap: 8,

  },
  card: {
    minHeight: 76,
    borderRadius: 5,
    backgroundColor: '#F4F4F4',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 11,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardCopy: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 20.15,
    lineHeight: 21,
    fontWeight: '700',
  },
  cardMessage: {
    color: '#747474',
    fontSize: 15.6,
    lineHeight: 16,
    marginTop: 2,
  },
  iconCircle: {
    width: 39,
    height: 39,
    borderRadius: 19.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  loadingWrap: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWrap: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  emptyText: {
    color: '#DCE5FF',
    fontSize: 18.2,
    lineHeight: 20,
    textAlign: 'center',
  },
});

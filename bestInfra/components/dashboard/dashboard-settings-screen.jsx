import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedRippleRings } from '../animated-ripple-rings';
import { getDashboardTheme } from './dashboard-theme';

const SETTINGS_RIPPLE_SIZES = [96, 130, 164, 198, 232, 266, 300, 334];
const CONTENT_MAX_WIDTH = 460;

function PreferenceRow({ icon, title, value, theme, trailing, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.preferenceRow, { backgroundColor: theme.preferenceCard }]}
      activeOpacity={0.88}
      onPress={onPress}
      disabled={disabled}>
      <View style={styles.preferenceLeft}>
        {typeof icon === 'string' ? (
          <MaterialIcons name={icon} size={20} color={theme.preferenceIcon} />
        ) : (
          <Image source={icon} style={styles.preferenceIcon} contentFit="contain" />
        )}
        <View style={styles.preferenceCopy}>
          <Text style={[styles.preferenceTitle, { color: theme.preferenceLabel }]}>{title}</Text>
          {value ? <Text style={[styles.preferenceValue, { color: theme.preferenceValue }]}>{value}</Text> : null}
        </View>
      </View>

      {trailing}
    </TouchableOpacity>
  );
}

function ThemeSwitch({ enabled, theme, onToggle }) {
  return (
    <TouchableOpacity
      style={[
        styles.switchTrack,
        { backgroundColor: enabled ? theme.switchTrackOn : theme.switchTrackOff },
      ]}
      activeOpacity={0.9}
      onPress={onToggle}>
      <View
        style={[
          styles.switchThumb,
          {
            backgroundColor: theme.switchThumb,
            transform: [{ translateX: enabled ? 16 : 0 }],
          },
        ]}
      />
    </TouchableOpacity>
  );
}

export function DashboardSettingsScreen({
  insets,
  sidePadding,
  themeMode,
  onBack,
  onToggleTheme,
  settingsData,
  loading,
  updating,
  error,
}) {
  const theme = getDashboardTheme(themeMode);
  const horizontalPadding = Math.max(12, Math.min(22, sidePadding - 3));
  const fontSizeLabel = settingsData?.fontSize ? `${settingsData.fontSize} Px` : '13 Px';
  const termsLabel = settingsData?.termsLabel || 'Terms of Service';
  const privacyLabel = settingsData?.privacyLabel || 'Privacy Policy';
  const darkModeEnabled = settingsData?.themeMode ? settingsData.themeMode === 'dark' : theme.mode === 'dark';

  return (
    <View style={[styles.screen, { backgroundColor: theme.screenBackground }]}>
      <StatusBar style={theme.statusBar} translucent backgroundColor="transparent" />

      <AnimatedRippleRings color={theme.rippleStrongColor || theme.rippleColor} sizes={SETTINGS_RIPPLE_SIZES} style={styles.rippleBackdrop} />

      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View
          style={[
            styles.content,
            {
              paddingHorizontal: horizontalPadding,
              paddingBottom: insets.bottom + 14,
              maxWidth: CONTENT_MAX_WIDTH,
              width: '100%',
              alignSelf: 'center',
            },
          ]}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={[styles.circleButton, { backgroundColor: theme.topButtonSurface }]}
              activeOpacity={0.85}
              onPress={onBack}>
              <Image
                source={require('../../assets/images/bars-staggered 2.png')}
                style={styles.headerIcon}
                contentFit="contain"
              />
            </TouchableOpacity>

            <View pointerEvents="none" style={styles.centerLogoWrap}>
              <Image source={require('../../assets/images/Logo (1).png')} style={styles.centerLogo} contentFit="contain" />
            </View>

            <TouchableOpacity
              style={[styles.circleButton, styles.rightButton, { backgroundColor: theme.topButtonSurface }]}
              activeOpacity={0.85}
              onPress={onBack}>
              <Image source={require('../../assets/images/Back.png')} style={styles.backIcon} contentFit="contain" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>PREFERENCES</Text>

          {loading && !settingsData ? (
            <View style={styles.statusWrap}>
              <ActivityIndicator size="small" color={theme.preferenceLabel} />
            </View>
          ) : (
            <View style={styles.preferenceList}>
              <PreferenceRow
                icon="brightness-4"
                title="Dark Mode"
                theme={theme}
                onPress={onToggleTheme}
                disabled={updating}
                trailing={
                  updating ? (
                    <ActivityIndicator size="small" color={theme.preferenceLabel} />
                  ) : (
                    <ThemeSwitch enabled={darkModeEnabled} theme={theme} onToggle={onToggleTheme} />
                  )
                }
              />

              <PreferenceRow
                icon={require('../../assets/images/Vector (6).png')}
                title="Font Size"
                value={fontSizeLabel}
                theme={theme}
                trailing={
                  <Image
                    source={require('../../assets/images/Back.png')}
                    style={styles.rowChevron}
                    contentFit="contain"
                  />
                }
                disabled
              />

              <PreferenceRow
                icon={require('../../assets/images/Container.png')}
                title={termsLabel}
                theme={theme}
                trailing={
                  <Image
                    source={require('../../assets/images/Back.png')}
                    style={styles.rowChevron}
                    contentFit="contain"
                  />
                }
                disabled
              />

              <PreferenceRow
                icon={require('../../assets/images/Container.png')}
                title={privacyLabel}
                theme={theme}
                trailing={
                  <Image
                    source={require('../../assets/images/Back.png')}
                    style={styles.rowChevron}
                    contentFit="contain"
                  />
                }
                disabled
              />
            </View>
          )}

          {error ? <Text style={[styles.errorText, { color: theme.preferenceDanger }]}>{error}</Text> : null}

          <View style={[styles.homeIndicator, { backgroundColor: theme.mode === 'dark' ? '#32477E' : '#C7CFD8' }]} />
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
    top: -70,
    left: 0,
    right: 0,
    height: 344,
  },
  content: {
    flex: 1,
  },
  topBar: {
    height: 56,
    marginTop: 10,
    position: 'relative',
    justifyContent: 'center',
  },
  circleButton: {
    position: 'absolute',
    left: 0,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightButton: {
    left: undefined,
    right: 0,
  },
  headerIcon: {
    width: 18,
    height: 18,
  },
  backIcon: {
    width: 16,
    height: 16,
  },
  centerLogoWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLogo: {
    width: 56,
    height: 50,
  },
  sectionLabel: {
    fontSize: 16.9,
    lineHeight: 17,
    fontWeight: '700',
    marginTop: 38,
    marginBottom: 14,
  },
  preferenceList: {
    rowGap: 10,
  },
  statusWrap: {
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preferenceRow: {
    minHeight: 48,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceIcon: {
    width: 18,
    height: 18,
  },
  preferenceCopy: {
    marginLeft: 12,
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 19.5,
    lineHeight: 19,
    fontWeight: '500',
  },
  preferenceValue: {
    fontSize: 15.6,
    lineHeight: 15,
    marginTop: 1,
  },
  errorText: {
    fontSize: 15.6,
    lineHeight: 16,
    marginTop: 12,
  },
  switchTrack: {
    width: 38,
    height: 22,
    borderRadius: 999,
    paddingHorizontal: 3,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  rowChevron: {
    width: 12,
    height: 12,
    transform: [{ rotate: '180deg' }],
    tintColor: '#FFFFFF',
    opacity: 1,
  },
  homeIndicator: {
    position: 'absolute',
    left: '50%',
    bottom: 4,
    width: 120,
    height: 4,
    marginLeft: -60,
    borderRadius: 999,
  },
});

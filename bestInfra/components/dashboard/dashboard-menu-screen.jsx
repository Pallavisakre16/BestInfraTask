import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedRippleRings } from '../animated-ripple-rings';
import { getDashboardTheme } from './dashboard-theme';

const MENU_RIPPLE_SIZES = [130, 164, 198, 232, 266, 300, 334, 368];
const MENU_ICON_SOURCES = {
  dashboard: require('../../assets/images/dashboard-monitor(1) 1.png'),
  usage: require('../../assets/images/research-arrows-circle 1.png'),
  payments: require('../../assets/images/file-invoice 1.png'),
  reports: require('../../assets/images/receipt 1.png'),
  tickets: require('../../assets/images/life-ring 1.png'),
  alerts: require('../../assets/images/bell 1 (3).png'),
  settings: require('../../assets/images/Vector (7).png'),
  logout: require('../../assets/images/sign-out-alt 1 (1).png'),
};

function getInitials(value) {
  if (!value || typeof value !== 'string') {
    return 'BI';
  }

  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return 'BI';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
}

function MenuIcon({ itemId, name, active, theme }) {
  const source = MENU_ICON_SOURCES[itemId];

  if (source) {
    return <Image source={source} style={styles.menuIcon} contentFit="contain" />;
  }

  return <MaterialIcons name={name} size={22} color={active ? theme.menuAccent : theme.menuInactive} />;
}

export function DashboardMenuScreen({
  onClose,
  onOpenDashboard,
  onOpenNotifications,
  onOpenSettings,
  onOpenProfile,
  onLogout,
  sidePadding,
  insets,
  themeMode,
  menuData,
  profileData,
}) {
  const theme = getDashboardTheme(themeMode);
  const resolvedMenu = menuData || { items: [], footerItems: [], version: '' };
  const profileName = profileData?.name || resolvedMenu.userName || 'Best Infra User';
  const profileId = profileData?.customerId ? `ID: ${profileData.customerId}` : resolvedMenu.userId || 'ID: -';
  const avatarUrl = profileData?.avatarUrl;
  const hasAvatar = typeof avatarUrl === 'string' && avatarUrl.trim().length > 0;
  const initials = getInitials(profileName);

  const horizontalPadding = Math.max(10, Math.min(18, sidePadding - 9));

  return (
    <View style={[styles.screen, { backgroundColor: theme.screenBackground }]}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <AnimatedRippleRings color={theme.rippleStrongColor || theme.rippleColor} sizes={MENU_RIPPLE_SIZES} style={styles.rippleBackdrop}>
        <View pointerEvents="none" style={styles.rippleLogoWrap}>
          <Image source={require('../../assets/images/Logo (1).png')} style={styles.rippleLogo} contentFit="contain" />
        </View>
      </AnimatedRippleRings>

      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View
          style={[
            styles.content,
            {
              paddingHorizontal: horizontalPadding,
              paddingBottom: insets.bottom + 12,
            },
          ]}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={[styles.activeCircleButton, { backgroundColor: theme.topButtonPrimary }]}
              activeOpacity={0.85}
              onPress={onClose}>
              <Image source={require('../../assets/images/bars-staggered 2.png')} style={styles.headerIcon} contentFit="contain" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.circleButton, { backgroundColor: theme.topButtonSurface }]}
              activeOpacity={0.85}
              onPress={onOpenNotifications}>
              <Image source={require('../../assets/images/bell 1.png')} style={styles.headerIcon} contentFit="contain" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.profileCard, { backgroundColor: theme.cardBackground, borderColor: 'rgba(255,255,255,0.14)' }]}
            activeOpacity={0.85}
            onPress={onOpenProfile}>
            <View style={styles.avatar}>
              {hasAvatar ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} contentFit="cover" />
              ) : (
                <Text style={styles.avatarInitials}>{initials}</Text>
              )}
            </View>

            <View style={styles.profileTextWrap}>
              <Text numberOfLines={1} style={styles.profileName}>
                {profileName}
              </Text>
              <Text numberOfLines={1} style={styles.profileId}>
                {profileId}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.menuBody}>
            <View>
              {resolvedMenu.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  activeOpacity={0.85}
                  onPress={item.id === 'dashboard' ? onOpenDashboard : undefined}>
                  <MenuIcon itemId={item.id} name={item.icon} active={item.active} theme={theme} />
                  <Text
                    style={[
                      styles.menuLabel,
                      { color: item.active ? theme.menuActive : theme.menuInactive },
                      item.active && styles.menuLabelActive,
                    ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.footerBlock}>
              {resolvedMenu.footerItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  activeOpacity={0.85}
                  onPress={item.id === 'settings' ? onOpenSettings : item.id === 'logout' ? onLogout : undefined}>
                  <MenuIcon itemId={item.id} name={item.icon} active={false} theme={theme} />
                  <Text style={[styles.menuLabel, { color: theme.menuInactive }]}>{item.label}</Text>
                </TouchableOpacity>
              ))}

              <Text style={[styles.versionText, { color: theme.textMuted }]}>{resolvedMenu.version}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#143F93',
  },
  rippleBackdrop: {
    position: 'absolute',
    top: -88,
    left: 0,
    right: 0,
    width: '100%',
    height: 380,
  },
  rippleLogoWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rippleLogo: {
    marginTop: "2%",
    width: 42,
    height: 42,
  },
  safeArea: {
    flex: 1,
    paddingTop:10,
  },
  content: {
    flex: 1,
    paddingTop: 18,
  },
  topBar: {
    minHeight: 56,
    justifyContent: 'center',
    marginBottom: 20,
  },
  circleButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  activeCircleButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  headerIcon: {
    width: 20,
    height: 20,
  },
  profileCard: {
    height: "9%",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 99,
    backgroundColor: '#1B4A9B',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.72)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    color: '#F4F7FF',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
  },
  profileTextWrap: {
    marginLeft: 12,
    flex: 1,
  },
  profileName: {
    color: '#F5F8FF',
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '700',
    flexShrink: 1,
  },
  profileId: {
    color: '#B6C7E9',
    fontSize: 18,
    lineHeight: 20,
    marginTop: "2%",
    flexShrink: 1,
  },
  menuBody: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    marginBottom: 2,
  },
  menuLabel: {
    fontSize: 17,
    lineHeight: 25,
    marginLeft: 11,
  },
  menuIcon: {
    width: 22,
    height: 22,
  },
  menuLabelActive: {
    fontWeight: '700',
  },
  footerBlock: {
    paddingBottom: 10,
  },
  versionText: {
    fontSize: 14,
    lineHeight: 18,
    marginTop: 12,
  },
});

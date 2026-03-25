import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

const NAV_MAX_WIDTH = 520;
const BOTTOM_TAB_ICON_SOURCES = {
  home: require('../../assets/images/Home.png'),
  pay: require('../../assets/images/point-of-sale-bill 1.png'),
  usage: require('../../assets/images/Vector (4).png'),
  tickets: require('../../assets/images/customer-service 1.png'),
  invoice: require('../../assets/images/Vector (5).png'),
};

function BottomTabIcon({ itemId, icon, active, theme }) {
  const source = BOTTOM_TAB_ICON_SOURCES[itemId];

  if (source) {
    return <Image source={source} style={styles.navIcon} contentFit="contain" />;
  }

  return <MaterialIcons name={icon} size={18} color={active ? '#FFFFFF' : theme.summaryAccent} />;
}

export function DashboardBottomNav({ items, bottomInset, theme }) {
  if (!items.length) {
    return null;
  }

  return (
    <View
      style={[
        styles.nav,
        {
          paddingBottom: bottomInset + 8,
          backgroundColor: theme.navBackground,
          shadowColor: theme.shadowColor,
        },
      ]}>
      <View style={styles.navInner}>
        {items.map((item) => (
          <View key={item.id} style={styles.navItem}>
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: theme.navIconBg },
                item.active && [styles.iconWrapActive, { backgroundColor: theme.navIconActiveBg }],
              ]}>
              <BottomTabIcon itemId={item.id} icon={item.icon} active={item.active} theme={theme} />
            </View>
            <Text style={[styles.label, { color: theme.navLabel }, item.active && { color: theme.navLabelActive }]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingHorizontal: 12,
    shadowColor: '#0A170B',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  navInner: {
    width: '100%',
    maxWidth: NAV_MAX_WIDTH,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navItem: {
    width: '20%',
    alignItems: 'center',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F6F8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#59B86E',
  },
  navIcon: {
    width: 18,
    height: 18,
  },
  label: {
    color: '#6A6F6A',
    fontSize: 13,
    lineHeight: 13,
    marginTop: 7,
  },
});

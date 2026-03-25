import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedRippleRings } from '../animated-ripple-rings';
import { DashboardAlertsTable } from './dashboard-alerts-table';
import { DashboardBottomNav } from './dashboard-bottom-nav';
import { DashboardEnergySummary } from './dashboard-energy-summary';
import { DashboardMetricsComparison } from './dashboard-metrics-comparison';
import { DashboardOverviewSection } from './dashboard-overview-section';
import { getDashboardTheme } from './dashboard-theme';

const RIPPLE_SIZES = [126, 160, 194, 228, 262, 296, 330];

export function DashboardScreen({
  insets,
  sidePadding,
  onOpenMenu,
  onOpenNotifications,
  themeMode,
  dashboardData,
  loading,
  hideBottomNav = false,
}) {
  const dashboardPadding = Math.max(8, Math.min(14, sidePadding - 14));
  const theme = getDashboardTheme(themeMode);

  return (
    <View style={[styles.screen, { backgroundColor: theme.dashboardBackground }]}>
      <StatusBar style={theme.statusBar} translucent backgroundColor="transparent" />

      <AnimatedRippleRings color={theme.rippleStrongColor || theme.rippleColor} sizes={RIPPLE_SIZES} style={styles.rippleBackdrop} />

      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingHorizontal: dashboardPadding,
              paddingBottom: insets.bottom + 92,
            },
          ]}
          showsVerticalScrollIndicator={false}>
          {dashboardData ? (
            <>
              <DashboardOverviewSection
                data={dashboardData.overview}
                onOpenMenu={onOpenMenu}
                onOpenNotifications={onOpenNotifications}
                theme={theme}
              />
              <DashboardEnergySummary data={dashboardData.energySummary} theme={theme} />
              <DashboardMetricsComparison data={dashboardData.metricSummary} theme={theme} />
              <DashboardAlertsTable rows={dashboardData.alerts} theme={theme} />
            </>
          ) : (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color={theme.summaryAccent} />
            </View>
          )}
        </ScrollView>

        {!hideBottomNav ? (
          <DashboardBottomNav items={dashboardData?.navItems || []} bottomInset={insets.bottom} theme={theme} loading={loading} />
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F9F6',
  },
  safeArea: {
    flex: 1,
    marginTop: 20,
  },
  rippleBackdrop: {
    position: 'absolute',
    top: "-8%",
    left: 0,
    right: 0,
    width: '100%',
    height: 380,
    opacity: 0.82,
  },
  content: {
    paddingTop: 10,
    rowGap: 16,
  },
  loadingWrap: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

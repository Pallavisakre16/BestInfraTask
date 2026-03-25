import { useMemo } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

const MIN_BAR_HEIGHT_PERCENT = 8;

export function DashboardBarChart({ bars = [], barColor, secondaryBarColor, labelColor }) {
  const { width: screenWidth } = useWindowDimensions();
  const chartHeight = useMemo(() => Math.max(172, Math.min(220, Math.round(screenWidth * 0.5))), [screenWidth]);
  const barTrackHeight = Math.max(132, chartHeight - 40);
  const barWidth = screenWidth < 360 ? 11 : 12;

  const normalizedBars = useMemo(
    () =>
      bars.map((bar) => ({
        month: bar.month,
        value: Math.max(0, Number(bar.height) || 0),
        compareValue: Math.max(0, Number(bar.compareHeight) || Math.round((Number(bar.height) || 0) * 0.9)),
      })),
    [bars]
  );

  const maxValue = useMemo(
    () => Math.max(1, ...normalizedBars.flatMap((bar) => [bar.value, bar.compareValue])),
    [normalizedBars]
  );

  return (
    <View style={[styles.container, { height: chartHeight }]}>
      <View style={styles.row}>
        {normalizedBars.map((bar) => {
          const currentFill = Math.max(MIN_BAR_HEIGHT_PERCENT, (bar.value / maxValue) * 100);
          const compareFill = Math.max(MIN_BAR_HEIGHT_PERCENT, (bar.compareValue / maxValue) * 100);

          return (
            <View key={bar.month} style={styles.barItem}>
              <View style={styles.barPair}>
                <View style={[styles.barTrack, { height: barTrackHeight, width: barWidth }]}>
                  <View style={[styles.barFill, { height: `${compareFill}%`, backgroundColor: secondaryBarColor }]} />
                </View>
                <View style={[styles.barDivider, { height: barTrackHeight }]} />
                <View style={[styles.barTrack, { height: barTrackHeight, width: barWidth }]}>
                  <View style={[styles.barFill, { height: `${currentFill}%`, backgroundColor: barColor }]} />
                </View>
              </View>
              <Text style={[styles.barLabel, { color: labelColor }]} numberOfLines={1}>
                {bar.month}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    columnGap: 6,
  },
  barItem: {
    flex: 1,
    alignItems: 'center',
  },
  barPair: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  barTrack: {
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barDivider: {
    width: 1,
    backgroundColor: '#FFFFFF',
  },
  barFill: {
    width: '100%',
  },
  barLabel: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 13,
    fontWeight: '500',
  },
});

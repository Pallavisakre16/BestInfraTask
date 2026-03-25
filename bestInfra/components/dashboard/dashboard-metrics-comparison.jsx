import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View } from 'react-native';

export function DashboardMetricsComparison({ data, theme }) {
  return (
    <View style={styles.section}>
      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { borderColor: theme.borderSoft, backgroundColor: theme.summaryCardSoft }]}>
          <Text style={[styles.metricLabel, { color: theme.summarySubtext }]}>{data.averageLabel}</Text>
          <Text style={[styles.metricValue, { color: theme.summaryBar }]}>{data.averageValue}</Text>
        </View>

        <View style={[styles.metricCard, { borderColor: theme.borderSoft, backgroundColor: theme.summaryCardSoft }]}>
          <Text style={[styles.metricLabel, { color: theme.summarySubtext }]}>{data.peakLabel}</Text>
          <Text style={[styles.metricValue, { color: theme.danger }]}>{data.peakValue}</Text>
        </View>
      </View>

      <View style={[styles.comparisonCard, { borderColor: theme.borderSoft, backgroundColor: theme.summaryCardSoft }]}>
        <View style={styles.comparisonHeader}>
          <MaterialIcons name="compare-arrows" size={16} color={theme.summarySubtext} />
          <Text style={[styles.comparisonTitle, { color: theme.summarySubtext }]}>{data.comparisonTitle}</Text>
        </View>

        <View style={styles.comparisonRow}>
          <View>
            <Text style={[styles.comparisonLabel, { color: theme.summarySubtext }]}>{data.currentLabel}</Text>
            <Text style={[styles.comparisonValue, { color: theme.summaryBar }]}>{data.currentValue}</Text>
          </View>

          <View style={styles.comparisonRight}>
            <Text style={[styles.comparisonLabel, { color: theme.summarySubtext }]}>{data.previousLabel}</Text>
            <Text style={[styles.comparisonMuted, { color: theme.textMuted }]}>{data.previousValue}</Text>
          </View>
        </View>

        <View style={[styles.progressTrack, { backgroundColor: theme.progressTrack }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${data.savedProgress * 100}%`, backgroundColor: theme.summaryAccent },
            ]}
          />
        </View>

        <View style={styles.savedRow}>
          <MaterialIcons name="eco" size={13} color={theme.summaryAccent} />
          <Text style={[styles.savedText, { color: theme.summaryAccent }]}>{data.savedLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    rowGap: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    columnGap: 12,
  },
  metricCard: {
    flex: 1,
    minHeight: 80,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E4EAE2',
    backgroundColor: '#F0F7F0',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  metricLabel: {
    color: '#515851',
    fontSize: 15.6,
    lineHeight: 16,
  },
  metricValue: {
    color: '#24478E',
    fontSize: 23.4,
    lineHeight: 24,
    fontWeight: '700',
    marginTop: 10,
  },
  comparisonCard: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E4EAE2',
    backgroundColor: '#F0F7F0',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  comparisonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonTitle: {
    color: '#4D4D4D',
    fontSize: 16.9,
    lineHeight: 17,
    fontWeight: '500',
    marginLeft: 3,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  comparisonLabel: {
    color: '#4D4D4D',
    fontSize: 14.3,
    lineHeight: 14,
  },
  comparisonValue: {
    color: '#24478E',
    fontSize: 23.4,
    lineHeight: 24,
    fontWeight: '700',
    marginTop: 2,
  },
  comparisonRight: {
    alignItems: 'flex-end',
  },
  comparisonMuted: {
    color: '#98A1AD',
    fontSize: 23.4,
    lineHeight: 24,
    fontWeight: '700',
    marginTop: 2,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#D7DCE0',
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#59B86E',
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  savedText: {
    color: '#59B86E',
    fontSize: 13,
    lineHeight: 13,
    marginLeft: 4,
  },
});

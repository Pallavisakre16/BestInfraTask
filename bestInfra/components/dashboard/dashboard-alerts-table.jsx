import { StyleSheet, Text, View } from 'react-native';

export function DashboardAlertsTable({ rows, theme }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: theme.sectionTitle }]}>Alerts</Text>

      <View style={[styles.table, { backgroundColor: theme.tableBackground }]}>
        <View style={[styles.headerRow, { backgroundColor: theme.tableHeader }]}>
          <Text style={[styles.headerText, styles.serialColumn, { color: theme.tableHeaderText }]}>S. No</Text>
          <Text style={[styles.headerText, styles.meterColumn, { color: theme.tableHeaderText }]}>Meter SI No</Text>
          <Text style={[styles.headerText, styles.consumerColumn, { color: theme.tableHeaderText }]}>Consumer Name</Text>
        </View>

        {rows.map((row, index) => (
          <View
            key={row.id}
            style={[
              styles.bodyRow,
              { borderBottomColor: theme.tableRowBorder },
              index === rows.length - 1 && styles.lastRow,
            ]}>
            <Text style={[styles.bodyText, styles.serialColumn, { color: theme.tableText }]}>{row.serialNo}</Text>

            <View style={[styles.meterColumn, styles.meterWrap]}>
              <View style={styles.alertDot} />
              <Text style={[styles.bodyText, styles.meterText, { color: theme.tableText }]}>{row.meterNumber}</Text>
            </View>

            <Text style={[styles.bodyText, styles.consumerColumn, { color: theme.tableText }]}>{row.consumerName}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    rowGap: 8,
  },
  title: {
    color: '#2D2D2D',
    fontSize: 18.2,
    lineHeight: 18,
    fontWeight: '600',
  },
  table: {
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    minHeight: 35,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#59B86E',
    paddingHorizontal: 14,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 14.3,
    lineHeight: 14,
    fontWeight: '500',
  },
  bodyRow: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E7ECE6',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  bodyText: {
    color: '#4F4F4F',
    fontSize: 13,
    lineHeight: 13,
  },
  serialColumn: {
    width: '18%',
  },
  meterColumn: {
    width: '33%',
  },
  consumerColumn: {
    width: '49%',
  },
  meterWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#F53030',
    marginRight: 4,
  },
  meterText: {
    color: '#4F4F4F',
  },
});

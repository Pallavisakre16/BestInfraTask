import { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export function DashboardBarChart({ bars = [], barColor, secondaryBarColor, labelColor }) {
  const { width: screenWidth } = useWindowDimensions();
  const chartHeight = useMemo(() => Math.max(172, Math.min(220, Math.round(screenWidth * 0.5))), [screenWidth]);
  const data = useMemo(
    () =>
      bars.map((bar) => ({
        month: bar.month,
        value: Number(bar.height) || 0,
        compareValue: Number(bar.compareHeight) || Math.round((Number(bar.height) || 0) * 0.9),
      })),
    [bars]
  );

  return (
    <View style={styles.container}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={data} margin={{ top: 8, right: 2, left: 2, bottom: 0 }} barCategoryGap="26%" barGap={0}>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: labelColor, fontSize: 10, fontWeight: 500 }}
          />
          <YAxis hide domain={[0, (dataMax) => (dataMax > 0 ? Math.ceil(dataMax * 1.08) : 10)]} />
          <Bar dataKey="compareValue" fill={secondaryBarColor} radius={[0, 0, 0, 0]} barSize={12} stroke="#FFFFFF" strokeWidth={1} />
          <Bar dataKey="value" fill={barColor} radius={[0, 0, 0, 0]} barSize={12} stroke="#FFFFFF" strokeWidth={1} />
        </BarChart>
      </ResponsiveContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
  },
});

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { DashboardBarChart } from "./dashboard-bar-chart";

function formatPickedDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function normalizeRange(range) {
  return String(range || "")
    .trim()
    .toUpperCase();
}

function getBarsForRange({ bars, range, barsByRange }) {
  const safeBars = Array.isArray(bars) ? bars : [];
  const keyedBars = barsByRange?.[range];

  if (Array.isArray(keyedBars) && keyedBars.length > 0) {
    return keyedBars;
  }

  switch (normalizeRange(range)) {
    case "7D":
      return safeBars.slice(-7);
    case "30D":
      return safeBars.slice(-6);
    case "90D":
      return safeBars.slice(-9);
    case "1Y":
    case "1YR":
    case "12M":
      return safeBars;
    default:
      return safeBars;
  }
}

export function DashboardEnergySummary({ data, theme }) {
  const { width: screenWidth } = useWindowDimensions();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [iosDraftDate, setIosDraftDate] = useState(new Date());
  const [chartView, setChartView] = useState("chart");
  const [showChartDropdown, setShowChartDropdown] = useState(false);
  const [activeRange, setActiveRange] = useState(
    data.activeRange || data.ranges?.[0] || "30D",
  );
  const compactLayout = screenWidth < 360;
  const chartHeight = useMemo(
    () => Math.max(172, Math.min(220, Math.round(screenWidth * 0.5))),
    [screenWidth],
  );

  const dateActionLabel = useMemo(
    () => (selectedDate ? formatPickedDate(selectedDate) : data.cta),
    [data.cta, selectedDate],
  );
  const chartOptions = useMemo(
    () => [
      { id: "chart", label: data.chartAction || "Chart" },
      { id: "progress", label: "Progress" },
    ],
    [data.chartAction],
  );
  const visibleBars = useMemo(
    () =>
      getBarsForRange({
        bars: data.bars,
        range: activeRange,
        barsByRange: data.barsByRange,
      }),
    [activeRange, data.bars, data.barsByRange],
  );
  const selectedChartLabel =
    chartOptions.find((option) => option.id === chartView)?.label ||
    chartOptions[0].label;

  const openDatePicker = () => {
    const nextDate = selectedDate || new Date();
    setIosDraftDate(nextDate);
    setShowDatePicker(true);
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  const onAndroidDateChange = (event, value) => {
    setShowDatePicker(false);

    if (event.type === "set" && value) {
      setSelectedDate(value);
    }
  };

  const onIosDateChange = (_event, value) => {
    if (value) {
      setIosDraftDate(value);
    }
  };

  const onConfirmIosDate = () => {
    setSelectedDate(iosDraftDate);
    setShowDatePicker(false);
  };

  const onToggleChartDropdown = () => {
    setShowChartDropdown((prev) => !prev);
  };

  const onSelectChartOption = (nextView) => {
    setChartView(nextView);
    setShowChartDropdown(false);
  };

  const onSelectRange = (nextRange) => {
    setActiveRange(nextRange);
  };

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.sectionTitle }]}>
          {data.title}
        </Text>
        <TouchableOpacity
          style={styles.dateAction}
          activeOpacity={0.85}
          onPress={openDatePicker}
        >
          <Text style={[styles.dateActionText, { color: theme.sectionAction }]}>
            {dateActionLabel}
          </Text>
          <MaterialIcons
            name="calendar-month"
            size={25}
            color={theme.sectionAction}
          />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.summaryCard,
            paddingHorizontal: compactLayout ? 12 : 16,
          },
        ]}
      >
        <View style={styles.topRow}>
          <View>
            <Text style={[styles.usageLabel, { color: theme.summaryText }]}>
              {data.usageLabel}
            </Text>
            <View style={styles.usageRow}>
              <Text style={[styles.usageValue, { color: theme.summaryAccent }]}>
                {data.usageValue}
              </Text>
              <View
                style={[
                  styles.deltaPill,
                  { backgroundColor: theme.summaryAccent },
                ]}
              >
                <Text style={styles.deltaText}>{data.usageDelta}</Text>
                <MaterialIcons
                  name={data.usageDeltaIcon}
                  size={11}
                  color="#FFFFFF"
                />
              </View>
              <Text
                style={[styles.comparisonText, { color: theme.summarySubtext }]}
              >
                {data.usageComparison}
              </Text>
            </View>
          </View>

          <View style={styles.chartActionWrap}>
            <TouchableOpacity
              style={[
                styles.chartButton,
                { backgroundColor: theme.summaryAccent },
              ]}
              activeOpacity={0.85}
              onPress={onToggleChartDropdown}
            >
              <Text style={styles.chartButtonText}>{selectedChartLabel}</Text>
              <MaterialIcons
                name={showChartDropdown ? "expand-less" : "expand-more"}
                size={16}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            {showChartDropdown ? (
              <View
                style={[
                  styles.chartDropdown,
                  {
                    backgroundColor: theme.panelSurface,
                    borderColor: theme.borderSoft,
                    shadowColor: theme.shadowColor,
                  },
                ]}
              >
                {chartOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.chartDropdownItem}
                    activeOpacity={0.85}
                    onPress={() => onSelectChartOption(option.id)}
                  >
                    <Text
                      style={[
                        styles.chartDropdownItemText,
                        {
                          color:
                            option.id === chartView
                              ? theme.summaryAccent
                              : theme.dashboardText,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                    {option.id === chartView ? (
                      <MaterialIcons
                        name="check"
                        size={14}
                        color={theme.summaryAccent}
                      />
                    ) : null}
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>
        </View>

        <View
          style={[styles.rangeRow, compactLayout && styles.rangeRowCompact]}
        >
          {data.ranges.map((range) => {
            const isActive = range === activeRange;

            return (
              <TouchableOpacity
                key={range}
                style={
                  isActive
                    ? [
                        styles.activeRangePill,
                        { backgroundColor: theme.summaryBarActive },
                      ]
                    : styles.rangeButton
                }
                activeOpacity={0.85}
                onPress={() => onSelectRange(range)}
              >
                <Text
                  style={
                    isActive
                      ? styles.activeRangeText
                      : [styles.rangeText, { color: theme.textMuted }]
                  }
                >
                  {range}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {chartView === "chart" ? (
          <View style={styles.legendRow}>
            <LegendDot color={theme.summaryBar} />
            <Text style={[styles.legendText, { color: theme.summarySubtext }]}>
              {data.primarySeriesLabel || "This Month"}
            </Text>
            <LegendDot color={theme.summaryAccent} />
            <Text style={[styles.legendText, { color: theme.summarySubtext }]}>
              {data.secondarySeriesLabel || "Last Month"}
            </Text>
          </View>
        ) : null}

        <View
          style={
            chartView === "chart"
              ? [styles.chartWrap, { height: chartHeight }]
              : [styles.progressWrap, { minHeight: chartHeight }]
          }
        >
          {chartView === "chart" ? (
            <DashboardBarChart
              bars={visibleBars}
              barColor={theme.summaryBar}
              secondaryBarColor={theme.summaryAccent}
              labelColor={theme.textMuted}
            />
          ) : (
            <DashboardProgressBars bars={visibleBars} theme={theme} />
          )}
        </View>
      </View>

      {showDatePicker && Platform.OS === "android" ? (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="calendar"
          onChange={onAndroidDateChange}
        />
      ) : null}

      {showDatePicker && Platform.OS === "ios" ? (
        <Modal
          transparent
          animationType="fade"
          visible
          onRequestClose={closeDatePicker}
        >
          <View style={styles.dateModalBackdrop}>
            <View
              style={[
                styles.dateModalCard,
                { backgroundColor: theme.panelSurface },
              ]}
            >
              <View style={styles.dateModalActions}>
                <TouchableOpacity
                  onPress={closeDatePicker}
                  style={styles.dateActionButton}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.dateActionButtonText,
                      { color: theme.textMuted },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onConfirmIosDate}
                  style={styles.dateActionButton}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.dateActionButtonText,
                      { color: theme.summaryAccent },
                    ]}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={iosDraftDate}
                mode="date"
                display="inline"
                onChange={onIosDateChange}
              />
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

function LegendDot({ color }) {
  return <View style={[styles.legendDot, { backgroundColor: color }]} />;
}

function DashboardProgressBars({ bars = [], theme }) {
  const highestValue = useMemo(
    () => Math.max(1, ...bars.map((bar) => Number(bar.height) || 0)),
    [bars],
  );

  return (
    <View style={styles.progressList}>
      {bars.map((bar) => {
        const value = Number(bar.height) || 0;
        const progress = highestValue ? (value / highestValue) * 100 : 0;

        return (
          <View key={bar.month} style={styles.progressRow}>
            <Text style={[styles.progressMonth, { color: theme.textMuted }]}>
              {bar.month}
            </Text>
            <View
              style={[
                styles.progressTrack,
                { backgroundColor: theme.progressTrack },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.max(progress, 3)}%`,
                    backgroundColor: theme.summaryBar,
                  },
                ]}
              />
            </View>
            <Text
              style={[styles.progressValue, { color: theme.summarySubtext }]}
            >
              {value}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    rowGap: 8,
    marginTop: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  title: {
    color: "#2D2D2D",
    fontSize: 21.84,
    lineHeight: 24,
    fontWeight: "600",
  },
  dateAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateActionText: {
    color: "#5676B3",
    fontSize: 18.72,
    lineHeight: 16,
    marginRight: 6,
  },
  card: {
    borderRadius: 5,
    backgroundColor: "#F0F7F0",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  usageLabel: {
    color: "#404840",
    fontSize: 17.16,
    lineHeight: 20,
  },
  usageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  usageValue: {
    color: "#59B86E",
    fontSize: 21.84,
    lineHeight: 18,
    fontWeight: "700",
  },
  deltaPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    backgroundColor: "#59B86E",
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginLeft: 6,
  },
  deltaText: {
    color: "#FFFFFF",
    fontSize: 14.04,
    lineHeight: 12,
    fontWeight: "700",
    marginRight: 2,
  },
  comparisonText: {
    color: "#505650",
    fontSize: 15.6,
    lineHeight: 13,
    marginLeft: 6,
  },
  chartButton: {
    height: 30,
    borderRadius: 3,
    backgroundColor: "#59B86E",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  chartButtonText: {
    color: "#FFFFFF",
    fontSize: 17.16,
    lineHeight: 14,
    fontWeight: "500",
    marginRight: 6,
  },
  chartActionWrap: {
    alignItems: "flex-end",
    position: "relative",
  },
  chartDropdown: {
    position: "absolute",
    top: 34,
    right: 0,
    minWidth: 120,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 5,
    zIndex: 20,
    elevation: 5,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  chartDropdownItem: {
    minHeight: 34,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chartDropdownItemText: {
    fontSize: 18.72,
    lineHeight: 16,
    fontWeight: "500",
  },
  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  rangeRowCompact: {
    paddingHorizontal: 2,
  },
  rangeText: {
    color: "#717771",
    fontSize: 17.16,
    lineHeight: 14,
    fontWeight: "600",
  },
  rangeButton: {
    minHeight: 26,
    minWidth: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  activeRangePill: {
    height: 26,
    minWidth: 66,
    borderRadius: 4,
    backgroundColor: "#24478E",
    alignItems: "center",
    justifyContent: "center",
  },
  activeRangeText: {
    color: "#FFFFFF",
    fontSize: 13.2,
    lineHeight: 14,
    fontWeight: "700",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
  },
  legendText: {
    fontSize: 12,
    lineHeight: 13,
    marginLeft: 5,
    marginRight: 12,
    fontWeight: "600",
  },
  chartWrap: {
    justifyContent: "flex-end",
  },
  progressWrap: {
    justifyContent: "center",
    paddingVertical: 2,
  },
  progressList: {
    rowGap: 8,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressMonth: {
    width: 28,
    fontSize: 12,
    lineHeight: 13,
    fontWeight: "600",
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  progressValue: {
    width: 38,
    textAlign: "right",
    fontSize: 12,
    lineHeight: 13,
    fontWeight: "600",
  },
  dateModalBackdrop: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    paddingHorizontal: 20,
  },
  dateModalCard: {
    borderRadius: 12,
    overflow: "hidden",
  },
  dateModalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  dateActionButton: {
    minHeight: 32,
    justifyContent: "center",
  },
  dateActionButtonText: {
    fontSize: 16.8,
    lineHeight: 18,
    fontWeight: "600",
  },
});

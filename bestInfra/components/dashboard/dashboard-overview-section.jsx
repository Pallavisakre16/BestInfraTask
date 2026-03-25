import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useRef } from "react";

import { DashboardLogo } from "./dashboard-logo";

export function DashboardOverviewSection({
  data,
  onOpenMenu,
  onOpenNotifications,
  theme,
}) {
  const handRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const waveAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(handRotation, {
          toValue: -30,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(handRotation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );

    waveAnimation.start();
    return () => waveAnimation.stop();
  }, [handRotation]);
  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[
            styles.headerButton,
            styles.headerButtonLeft,
            {
              backgroundColor: theme.topButtonSurface,
              shadowColor: theme.shadowColor,
            },
          ]}
          activeOpacity={0.85}
          onPress={onOpenMenu}
        >
          <Image
            source={require("../../assets/images/bars-staggered 2.png")}
            style={styles.headerMenuIcon}
            contentFit="contain"
          />
        </TouchableOpacity>

        <View pointerEvents="none" style={styles.headerLogoWrap}>
          <DashboardLogo width={54} height={50} />
        </View>

        <TouchableOpacity
          style={[
            styles.headerButton,
            styles.headerButtonRight,
            {
              backgroundColor: theme.topButtonSurface,
              shadowColor: theme.shadowColor,
            },
          ]}
          activeOpacity={0.85}
          onPress={onOpenNotifications}
        >
          <Image
            source={require("../../assets/images/bell 1.png")}
            style={styles.headerBellIcon}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.greetingRow}>
        <Text style={[styles.greeting, { color: theme.dashboardText }]}>
          {data.greeting}
        </Text>
        <Animated.View
          style={[
            styles.handWaveWrap,
            {
              transform: [
                {
                  rotate: handRotation.interpolate({
                    inputRange: [-30, 0],
                    outputRange: ["-30deg", "0deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <Image
            source={require("../../assets/images/hand.png")}
            style={styles.handImage}
            contentFit="contain"
          />
        </Animated.View>
      </View>
      <Text style={[styles.subheading, { color: theme.dashboardSubtext }]}>
        {data.subheading}
      </Text>

      <View style={[styles.dueCard, { backgroundColor: theme.dueCard }]}>
        <Text style={[styles.dueAmount, { color: theme.dueText }]}>
          {data.dueAmount}
        </Text>
        <Text style={[styles.dueDate, { color: theme.dueDate }]}>
          {data.dueDate}
        </Text>
      </View>

      <View style={[styles.payCard, { backgroundColor: theme.payCard }]}>
        <View style={styles.payIconWrap}>
          <Image
            source={require("../../assets/images/globe-shield 1.png")}
            style={styles.payCardIcon}
            contentFit="contain"
          />
        </View>

        <View style={styles.payCopy}>
          <Text style={[styles.payTitle, { color: theme.payText }]}>
            {data.paymentTitle}
          </Text>
          <Text style={[styles.payHint, { color: theme.paySubtext }]}>
            {data.paymentHint}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.payNowButton, { backgroundColor: theme.payButtonBg }]}
          activeOpacity={0.9}
        >
          <Text style={[styles.payNowText, { color: theme.payButtonText }]}>
            Pay Now
          </Text>
        </TouchableOpacity>

        <Text style={[styles.daysLeft, { color: theme.paySubtext }]}>
          {data.daysLeft}
        </Text>
      </View>

      <View
        style={[
          styles.connectionCard,
          { backgroundColor: theme.connectionCard },
        ]}
      >
        <Image
          source={require("../../assets/images/meter-fire 1.png")}
          style={styles.connectionMeterIcon}
          contentFit="contain"
        />

        <View style={styles.connectionCopy}>
          <Text style={[styles.connectionTitle, { color: theme.payText }]}>
            {data.connectionTitle}
          </Text>
          <Text style={[styles.connectionLabel, { color: theme.payText }]}>
            {data.connectionLabel}
          </Text>
        </View>

        <View style={styles.connectionMeta}>
          <View
            style={[styles.statusPill, { backgroundColor: theme.statusPill }]}
          >
            <Text style={styles.statusPillText}>{data.connectionStatus}</Text>
          </View>

          <View style={styles.numberRow}>
            <MaterialIcons
              name="signal-cellular-alt"
              size={22}
              color={theme.summaryAccent}
            />
            <Text style={[styles.connectionNumber, { color: theme.payText }]}>
              {data.connectionNumber}
            </Text>
          </View>

          <Text style={[styles.connectionDate, { color: theme.dueDate }]}>
            {data.connectionDate}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    rowGap: 6,
  },
  headerRow: {
    height: 60,
    position: "relative",
    marginBottom: 10,
  },
  headerButton: {
    position: "absolute",
    top: 5,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FBFCFA",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0A170B",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  headerButtonLeft: {
    left: 0,
  },
  headerButtonRight: {
    right: 0,
  },
  headerMenuIcon: {
    width: 20,
    height: 20,
  },
  headerBellIcon: {
    width: 20,
    height: 20,
  },
  headerLogoWrap: {
    position: "absolute",
    top: 5,
    bottom: 5,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  greetingRow: {
    position: "relative",
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  handWaveWrap: {
    marginLeft: 8,
    width: 35,
    height: 35,
  },
  handImage: {
    width: "100%",
    height: "100%",
  },
  greeting: {
    color: "#283028",
    fontSize: 26,
    lineHeight: 37,
    fontWeight: "700",
  },
  subheading: {
    color: "#667066",
    fontSize: 20,
    lineHeight: 23,
    marginBottom: 18,
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 6,
  },
  dueCard: {
    minHeight: 48,
    borderRadius: 6,
    backgroundColor: "#24478E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  dueAmount: {
    color: "#FFFFFF",
    fontSize: 15.6,
    lineHeight: 16,
    fontWeight: "500",
  },
  dueDate: {
    color: "#D7E5FF",
    fontSize: 12.35,
    lineHeight: 12,
  },
  payCard: {
    borderRadius: 6,
    backgroundColor: "#5BBC6E",
    paddingHorizontal: 14,
    paddingVertical: 23,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  payIconWrap: {
    paddingTop: 4,
    marginRight: 12,
  },
  payCardIcon: {
    width: 34,
    height: 34,
  },
  payCopy: {
    flex: 1,
  },
  payTitle: {
    color: "#FFFFFF",
    fontSize: 22.1,
    lineHeight: 22,
    fontWeight: "700",
  },
  payHint: {
    color: "#E7F8E9",
    fontSize: 14,
    lineHeight: 14,
    marginTop: 4,
  },
  payNowButton: {
    marginLeft: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: "center",
  },
  payNowText: {
    color: "#494949",
    fontSize: 14.3,
    lineHeight: 14,
    fontWeight: "500",
  },
  daysLeft: {
    position: "absolute",
    right: 17,
    bottom: 11,
    color: "#E5FAE9",
    fontSize: 14,
    lineHeight: 12,
  },
  connectionCard: {
    borderRadius: 6,
    backgroundColor: "#24478E",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 22,
  },
  connectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    // borderColor: 'rgba(255,255,255,0.75)',
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  connectionMeterIcon: {
    width: 34,
    height: 34,
  },
  connectionCopy: {
    flex: 1,
    marginLeft: 10,
  },
  connectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 22,
    fontWeight: "700",
  },
  connectionLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "700",
    marginTop: 20,
  },
  connectionMeta: {
    alignItems: "flex-end",
    marginLeft: 10,
  },
  statusPill: {
    minHeight: 22,
    borderRadius: 999,
    backgroundColor: "#64C06B",
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statusPillText: {
    color: "#F7FFF8",
    fontSize: 12,
    lineHeight: 10,
    fontWeight: "600",
  },
  numberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },
  connectionNumber: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 17,
    fontWeight: "700",
    marginLeft: 4,
  },
  connectionDate: {
    color: "#D7E5FF",
    fontSize: 14,
    lineHeight: 14,
    marginTop: 4,
  },
});

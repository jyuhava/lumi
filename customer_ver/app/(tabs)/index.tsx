import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import api, { removeToken } from "../../api/axios";

const mockFoods = [
  { id: 1, icon: "cafe", cal: 540 },
  { id: 2, icon: "nutrition", cal: 601 },
  { id: 3, icon: "fish", cal: 628 },
  { id: 4, icon: "add", isAdd: true },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const themeColors = {
    background: isDark ? "#042f2e" : "#f0fdfa",
    text: isDark ? "#ffffff" : "#111827",
    cardLight: isDark ? "#115e59" : "#ffffff",
    mainCard: isDark ? "#0d9488" : "#14b8a6",
    mainCardDarker: isDark ? "#0f766e" : "#0d9488",
  };

  const handleLogout = async () => {
    try {
      await api.post("/mobile/logout");
    } catch (e) {}
    await removeToken();
    router.replace("/login");
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: themeColors.background }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={themeColors.background}
      />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={handleLogout}>
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color={themeColors.text}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>
          Lumical by Syntaf
        </Text>
        <TouchableOpacity style={styles.avatarPlaceholder} onPress={() => router.push('/profile')}>
          <Ionicons name="person" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* DATE PICKER */}
        <View style={styles.dateRow}>
          <View
            style={[
              styles.dateContainer,
              { backgroundColor: themeColors.cardLight },
            ]}
          >
            <Text style={[styles.dateText, { color: themeColors.text }]}>
              Friday 1 November
            </Text>
          </View>
          <View
            style={[
              styles.calendarIconWrapper,
              { backgroundColor: themeColors.cardLight },
            ]}
          >
            <Ionicons
              name="calendar-outline"
              size={22}
              color={themeColors.mainCard}
            />
          </View>
        </View>

        {/* MAIN STATS CARD */}
        <View
          style={[styles.mainCard, { backgroundColor: themeColors.mainCard }]}
        >
          <View style={styles.statsTopRow}>
            <View style={styles.sideStat}>
              <Text style={styles.sideStatValue}>331</Text>
              <Text style={styles.sideStatLabel}>Left</Text>
            </View>

            {/* Circular Progress Mock */}
            <View style={styles.circleContainer}>
              <View style={styles.semiCircleWrapper}>
                <View
                  style={[
                    styles.semiCircle,
                    { borderColor: isDark ? "#fef08a" : "#fef08a" },
                  ]}
                />
              </View>
              <View style={styles.centerStatText}>
                <Text style={styles.centerStatValue}>1769</Text>
                <Text style={styles.centerStatLabel}>of 2100 kcal</Text>
              </View>
            </View>

            <View style={styles.sideStat}>
              <Text style={styles.sideStatValue}>267</Text>
              <Text style={styles.sideStatLabel}>Burn</Text>
            </View>
          </View>

          <View style={styles.macrosRow}>
            <View style={styles.macroColumn}>
              <Text style={styles.macroTitle}>Carbs</Text>
              <Text style={styles.macroValue}>76/100g</Text>
            </View>
            <View style={styles.macroColumn}>
              <Text style={styles.macroTitle}>Proteins</Text>
              <Text style={styles.macroValue}>23/75g</Text>
            </View>
            <View style={styles.macroColumn}>
              <Text style={styles.macroTitle}>Fat</Text>
              <Text style={styles.macroValue}>31/40g</Text>
            </View>
          </View>
        </View>

        {/* FOOD GRID */}
        <View style={styles.foodGrid}>
          {mockFoods.map((item, index) => (
            <View
              key={index}
              style={[
                styles.foodCard,
                { backgroundColor: themeColors.cardLight },
              ]}
            >
              {item.isAdd ? (
                <TouchableOpacity style={styles.addCardInner}>
                  <View
                    style={[
                      styles.foodCircle,
                      styles.addCircle,
                      { borderColor: themeColors.mainCardDarker },
                    ]}
                  >
                    <Ionicons
                      name="add"
                      size={40}
                      color={themeColors.mainCardDarker}
                    />
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.foodCardInner}>
                  <View
                    style={[
                      styles.foodCircle,
                      { backgroundColor: themeColors.mainCard },
                    ]}
                  >
                    <Ionicons name={item.icon as any} size={45} color="#fff" />
                  </View>
                  <View style={styles.calBadge}>
                    <Text style={styles.calBadgeText}>{item.cal}</Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: Platform.OS === "android" ? 16 : 8,
  },
  headerIconBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fb923c",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 24,
  },
  dateContainer: {
    flex: 1,
    marginRight: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: { fontSize: 16, fontWeight: "600" },
  calendarIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  mainCard: {
    borderRadius: 30,
    padding: 24,
    paddingBottom: 16,
    marginBottom: 30,
    shadowColor: "#0f766e",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 8,
  },
  statsTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  sideStat: { alignItems: "center", paddingBottom: 10 },
  sideStatValue: { fontSize: 20, fontWeight: "800", color: "#ffffff" },
  sideStatLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
    fontWeight: "500",
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: 100,
    width: 140,
    position: "relative",
  },
  semiCircleWrapper: {
    position: "absolute",
    top: 0,
    width: 140,
    height: 70,
    overflow: "hidden",
  },
  semiCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 8,
    borderBottomColor: "transparent",
    borderRightColor: "transparent",
    transform: [{ rotate: "45deg" }],
  },
  centerStatText: { position: "absolute", bottom: -15, alignItems: "center" },
  centerStatValue: { fontSize: 38, fontWeight: "800", color: "#ffffff" },
  centerStatLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginTop: -2,
    fontWeight: "500",
  },
  macrosRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    paddingTop: 16,
    paddingHorizontal: 10,
  },
  macroColumn: { alignItems: "center" },
  macroTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  macroValue: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "600",
  },
  foodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  foodCard: {
    width: "47%",
    aspectRatio: 0.9,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  foodCardInner: { flex: 1, justifyContent: "center", alignItems: "center" },
  addCardInner: { flex: 1, justifyContent: "center", alignItems: "center" },
  foodCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  addCircle: { borderWidth: 8, backgroundColor: "transparent" },
  calBadge: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "#fbbf24",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  calBadgeText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
});

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { MotiView, AnimatePresence } from "moti";
import { supabase } from "../../lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { PieChart } from "react-native-chart-kit";
import LottieView from "lottie-react-native";
import Toast from "react-native-toast-message";
import { FontAwesome } from "@expo/vector-icons";

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;
  const [expenses, setExpenses] = useState<any[]>([]);
  const [simpleModalVisible, setSimpleModalVisible] = useState(false);
  useFocusEffect(
    useCallback(() => {
      (async () => {
        setLoading(true);
        const {
          data: { user },
          error: uErr,
        } = await supabase.auth.getUser();
        if (uErr || !user) return setLoading(false);

        const { data: expensesData } = await supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user.id); // Assuming you store user_id in expenses

        setExpenses(expensesData || []);

        setUserId(user.id);
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error) setCategories(data);
        setLoading(false);
      })();
    }, [])
  );

  const validCats = categories.filter(
    (cat) => typeof cat.totalBudget === "number" && cat.totalBudget > 0
  );
  const totalBudget = validCats.reduce((a, c) => a + c.totalBudget, 0);

  const pieData = validCats.map((cat, index) => ({
    name: cat.name,
    population: cat.totalBudget,
    color: cat.color || "#6366F1", // fallback to indigo
    legendFontColor: "#fff",
    legendFontSize: 14,
  }));

  const getSpentForCategory = (catId: string) => {
    return expenses
      .filter((exp) => exp.category_id === catId)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    // OPTIONAL: check if category has expenses first
    const hasExpenses = expenses.some((exp) => exp.category_id === categoryId);

    if (hasExpenses) {
      Toast.show({
        type: "custom_error",
        text1: "Cannot delete category",
        text2: "Please delete its expenses first.",
      });
      return;
    }

    // Delete from Supabase
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) {
      Toast.show({ type: "error", text1: "Failed to delete category" });
    } else {
      Toast.show({ type: "custom_success", text1: "Category deleted" });
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    }
  };

  const renderCategory = ({ item, index }: { item: any; index: number }) => {
    const spent = getSpentForCategory(item.id);

    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        delay={index * 80}
        className="mx-5 mb-4"
      >
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/expenses",
              params: { id: item.id, name: item.name },
            })
          }
          activeOpacity={0.85}
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: "#ffffff10",
            flexDirection: "row",
            alignItems: "center",
            shadowColor: item.color || "#fff",
            shadowOpacity: 0.12,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 5 },
          }}
        >
          <View
            style={{
              backgroundColor: item.color || "#6366F1",
              height: 50,
              width: 50,
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}
          >
            <Text style={{ fontSize: 24 }}>{item.icon || "🛒"}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 4,
              }}
            >
              {item.name}
            </Text>
            <Text
              style={{
                color: spent > item.totalBudget ? "#ef4444" : "#34D399",
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              ₹{spent} / ₹{item.totalBudget} spent
            </Text>

            {spent > item.totalBudget ? (
              <Text style={{ color: "#ef4444", fontSize: 12 }}>
                Over budget by ₹{spent - item.totalBudget}
              </Text>
            ) : (
              <Text className="text-gray-500 mt-1">
                Remaining: ₹ {item.totalBudget - spent}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <View className="flex-row items-center absolute top-8 right-5">
          <View style={{ flex: 1 }}>{/* Existing name + spent info */}</View>

          <TouchableOpacity
            onPress={() => handleDeleteCategory(item.id)}
            style={{
              marginLeft: 12,
              padding: 8,
              borderRadius: 8,
            }}
          >
            <FontAwesome name="trash" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </MotiView>
    );
  };

  return (
    <View className="flex-1 bg-[#0f0f0f]">
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -40 }}
        animate={{ opacity: 1, translateY: 0 }}
        className="px-6 pt-16 pb-6 flex-row justify-between items-center bg-white/10 backdrop-blur-md border-b border-white/10"
      >
        <Text className="text-white text-2xl font-pbold">Budget Planner</Text>
        <TouchableOpacity
          onPress={() => {
            Toast.show({
              type: "custom_success",
              text1: "Logging out",
              position: "bottom",
              visibilityTime: 2000,
            });

            setTimeout(() => {
              supabase.auth.signOut().then(() => router.replace("/login"));
            }, 1500);
          }}
        >
          <View className="flex-row items-center gap-4">
            <AntDesign name="logout" size={24} color="red" />
            <Text className="text-md font-psemibold" style={{ color: "red" }}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </MotiView>

      {/* Pie Chart */}
      <AnimatePresence exitBeforeEnter>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 600 }}
          className="bg-white/10 backdrop-blur-md m-5 px-4 py-5 rounded-2xl border border-white/10"
        >
          <Text className="text-center text-white text-lg mb-2 font-psemibold">
            Total Budget
          </Text>
          {!loading && pieData.length > 0 ? (
            <PieChart
              data={pieData}
              width={screenWidth - 60}
              height={220}
              accessor={"population"}
              backgroundColor="transparent"
              paddingLeft="15"
              center={[5, 0]}
              absolute
              chartConfig={{
                backgroundColor: "#1e1e1e",
                backgroundGradientFrom: "#1e1e1e",
                backgroundGradientTo: "#1e1e1e",
                decimalPlaces: 0,
                color: () => "#fff",
                labelColor: () => "#fff",
              }}
            />
          ) : (
            <Text className="text-center text-gray-400 mt-4 font-psemibold">
              No data yet
            </Text>
          )}
          <Text className="text-center text-2xl font-pbold text-white mt-3">
            ₹ {totalBudget}
          </Text>
        </MotiView>
      </AnimatePresence>

      {/* Category List */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategory}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
          !loading && (
            <View className="px-4">
              <View
                className="bg-white/5 border border-white/10 rounded-2xl mb-6 items-center justify-center px-4"
                style={{ height: 200, width: "100%" }}
              >
                <LottieView
                  source={require("../../assets/animations/money.json")}
                  autoPlay
                  loop
                  style={{ width: 300, height: 300 }}
                />
              </View>
              <Text className="text-center text-gray-400 mt-20 font-psemibold text-base">
                No categories to show.
              </Text>
              <Text className="text-center text-gray-500 mt-2 font-pregular text-md italic">
                Start by adding a category — every budget begins with a plan 💡
              </Text>
            </View>
          )
        }
      />
      {/* Add Button */}
      <MotiView
        from={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 500 }}
        className="absolute bottom-8 right-6"
      >
        <TouchableOpacity
          className="bg-indigo-600 p-4 rounded-full shadow-lg shadow-indigo-500/50"
          onPress={() => router.push("/category")}
        >
          <AntDesign name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      </MotiView>
    </View>
  );
}

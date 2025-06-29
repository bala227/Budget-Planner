import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { MotiView, AnimatePresence } from "moti";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import * as Progress from "react-native-progress";
import { Swipeable } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";
import "react-native-gesture-handler";
import Modal from "react-native-modal";

export default function AddExpenseScreen() {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const { id, name } = useLocalSearchParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(
    null
  );

  // ✅ NEW: state for "Delete All" modal
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  const confirmDelete = (expenseId: string) => {
    setSelectedExpenseId(expenseId);
    setShowDeleteModal(true);
  };

  const handleConfirmedDelete = async () => {
    if (!selectedExpenseId) return;

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", selectedExpenseId);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      fetchData();
      setShowDeleteModal(false);
      setSelectedExpenseId(null);
    }
  };

  // ✅ NEW: confirm delete all expenses
  const handleDeleteAllExpenses = async () => {
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("category_id", id);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      fetchData();
      setShowDeleteAllModal(false);
    }
  };

  const fetchData = async () => {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    const { data: expenseData } = await supabase
      .from("expenses")
      .select("*")
      .eq("category_id", id)
      .order("created_at", { ascending: false });

    setCategory(categoryData);
    setExpenses(expenseData || []);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddExpense = async () => {
    if (!amount.trim()) {
      return Alert.alert("Missing Input", "Please enter the amount spent.");
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return Alert.alert(
        "Invalid Amount",
        "Enter a valid number greater than 0."
      );
    }

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("expenses").insert([
      {
        category_id: id,
        amount: parsedAmount,
        title: title.trim() || null,
        user_id: user?.id,
      },
    ]);

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setShowSuccess(true);
      setAmount("");
      setTitle("");
      fetchData();
      setTimeout(() => setShowSuccess(false), 1500);
    }
  };

  const renderRightActions = (id: string) => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: 80,
          marginVertical: 6,
          marginRight: 8,
          borderRadius: 16,
        }}
      >
        <TouchableOpacity onPress={() => confirmDelete(id)} activeOpacity={0.7}>
          <FontAwesome name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderExpense = ({ item }: { item: any }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id)}
      overshootRight={false}
    >
      <View
        key={item.id}
        style={{
          backgroundColor: "rgba(255,255,255,0.05)",
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: 1,
          borderRadius: 16,
          paddingVertical: 16,
          paddingHorizontal: 20,
          marginBottom: 12,
          marginHorizontal: 4,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              {item.title || "Unnamed"}
            </Text>
            <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: category?.color || "#10B981",
            }}
          >
            ₹ {item.amount}
          </Text>
        </View>
      </View>
    </Swipeable>
  );

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budget = category?.totalBudget || 1;
  const parsedAmount = parseFloat(amount) || 0;
  const potentialTotal = totalSpent + parsedAmount;
  const progress = Math.min(potentialTotal / budget, 1);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#0A0A0C]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 px-6 pt-16 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-14 left-6 z-50"
          activeOpacity={0.7}
        >
          <MotiView className="bg-white/10 p-3 rounded-full">
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </MotiView>
        </TouchableOpacity>

        <Text className="text-white text-2xl font-pbold text-center mb-8">
          Add Expense to {name}
        </Text>

        <View
          className="bg-white/5 border border-white/10 rounded-2xl mb-6 items-center justify-center"
          style={{ height: 200, width: "100%" }}
        >
          <LottieView
            source={require("../assets/animations/money2.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </View>

        {category && (
          <View className="mb-6">
            <View className="flex-row justify-between mb-1 px-1">
              <Text className="text-s text-gray-400 font-psemibold">₹ 0</Text>
              <Text className="text-s text-gray-400 font-psemibold">
                ₹ {budget}
              </Text>
            </View>
            <Progress.Bar
              progress={progress}
              width={null}
              color={category.color || "#10B981"}
              unfilledColor="#333"
              borderWidth={0}
              height={16}
              borderRadius={10}
            />
            <Text className="text-sm text-center text-gray-400 mt-4 font-psemibold">
              ₹ {potentialTotal.toFixed(2)} spent of ₹ {budget} total
            </Text>
          </View>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-sm text-gray-400 mb-1 font-psemibold">
            Expense Title
          </Text>
          <TextInput
            placeholder="e.g. Coffee, Groceries"
            value={title}
            onChangeText={setTitle}
            className="bg-white/5 text-white px-4 py-4 rounded-2xl mb-5 font-pregular text-base border border-white/10"
            placeholderTextColor="#aaa"
          />

          <Text className="text-sm text-gray-400 mb-1 font-psemibold">
            Amount (₹)
          </Text>
          <TextInput
            placeholder="e.g. 120"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            className="bg-white/5 text-white px-4 py-4 rounded-2xl mb-8 font-pregular text-base border border-white/10"
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity
            onPress={handleAddExpense}
            disabled={loading}
            className="rounded-3xl mb-10"
            style={{
              backgroundColor: category?.color || "#10B981", // ✅ uses category color
              shadowColor: category?.color || "#10B981",
              shadowOpacity: 0.5,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 5 },
            }}
          >
            <View className="py-4 items-center">
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-lg font-pbold">
                  Add Expense
                </Text>
              )}
            </View>
          </TouchableOpacity>

          {/* ✅ Recent Expenses with Delete All */}
          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-white text-lg font-psemibold">
              Recent Expenses
            </Text>
            {expenses.length > 0 && (
              <TouchableOpacity
                onPress={() => setShowDeleteAllModal(true)}
                className="bg-red-600 px-4 py-2 rounded-xl flex-row items-center gap-2"
              >
                <FontAwesome name="trash" size={14} color="#fff" />
                <Text className="text-white font-psemibold text-sm">
                  Delete All
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {expenses.length === 0 ? (
            <Text className="text-gray-500 font-psemibold text-center mt-2">
              No expenses yet.
            </Text>
          ) : (
            <>
              <FlatList
                data={expenses}
                keyExtractor={(item) => item.id}
                renderItem={renderExpense}
                scrollEnabled={false}
              />
              <Text className="text-center text-gray-500 font-psemibold mt-6">
                — End —
              </Text>
            </>
          )}
        </ScrollView>
      </View>

      {/* ✅ Existing single delete modal */}
      <Modal
        isVisible={showDeleteModal}
        onBackdropPress={() => setShowDeleteModal(false)}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.6}
      >
        <View
          style={{
            backgroundColor: "#1F2937",
            padding: 24,
            borderRadius: 20,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "700",
              marginBottom: 12,
            }}
          >
            Delete Expense?
          </Text>
          <Text
            style={{ color: "#9CA3AF", textAlign: "center", marginBottom: 24 }}
          >
            Are you sure you want to remove this expense? This action cannot be
            undone.
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={() => setShowDeleteModal(false)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 12,
                backgroundColor: "#374151",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirmedDelete}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 12,
                backgroundColor: "#EF4444",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ✅ NEW: Delete All Expenses modal */}
      <Modal
        isVisible={showDeleteAllModal}
        onBackdropPress={() => setShowDeleteAllModal(false)}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.6}
      >
        <View
          style={{
            backgroundColor: "#1F2937",
            padding: 24,
            borderRadius: 20,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "700",
              marginBottom: 12,
            }}
          >
            Delete All Expenses?
          </Text>
          <Text
            style={{ color: "#9CA3AF", textAlign: "center", marginBottom: 24 }}
          >
            Are you sure you want to remove all expenses in this category? This
            action cannot be undone.
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={() => setShowDeleteAllModal(false)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 12,
                backgroundColor: "#374151",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeleteAllExpenses}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 12,
                backgroundColor: "#EF4444",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Delete All
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ✅ Success animation */}
      <AnimatePresence>
        {showSuccess && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.75)", // darker dimming
              justifyContent: "center",
              alignItems: "center",
              zIndex: 100,
            }}
          >
            {/* 🎉 Popper Lottie - Fullscreen Confetti */}
            <LottieView
              source={require("../assets/animations/popper.json")}
              autoPlay
              loop={false}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                height: "100%",
                zIndex: 101,
              }}
            />

            {/* ✅ Success Box */}
            <MotiView
              from={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring" }}
              style={{
                backgroundColor: "#0A0A0C",
                paddingVertical: 24,
                paddingHorizontal: 50,
                borderRadius: 24,
                alignItems: "center",
                shadowColor: "#10B981", // use your category color or a default
                shadowOpacity: 0.4,
                shadowOffset: { width: 0, height: 10 },
                shadowRadius: 20,
                zIndex: 102,
              }}
            >
              <View
                style={{
                  backgroundColor: "#10B981",
                  borderRadius: 60,
                  marginBottom: 6,
                }}
              >
                <LottieView
                  source={require("../assets/animations/check.json")}
                  autoPlay
                  loop={false}
                  style={{ width: 100, height: 100 }}
                />
              </View>
              <Text className="text-white mt-3 text-base font-psemibold">
                Expense Added
              </Text>
            </MotiView>
          </View>
        )}
      </AnimatePresence>
    </KeyboardAvoidingView>
  );
}

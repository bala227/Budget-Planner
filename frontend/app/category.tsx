import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { MotiView, AnimatePresence } from "moti";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

const ICONS = [
  "🛒",
  "🍽️",
  "🏠",
  "🚗",
  "🎉",
  "💼",
  "🧾",
  "💡",
  "📚",
  "🎵",
  "🏋️",
  "✈️",
];
const COLORS = [
  "#6E9CFF",
  "#FF6EC7",
  "#6EFFA1",
  "#FFD36E",
  "#C96EFF",
  "#6EFFF2",
  "#FF8A6E",
  "#A16EFF",
];

export default function AddCategoryScreen() {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (!error && user) setUserId(user.id);
    });
  }, []);

  const isValid = name.trim() && parseFloat(budget) > 0;

  const handleCreate = async () => {
    if (!isValid || !userId) return;
    setLoading(true);
    const { error } = await supabase.from("categories").insert([
      {
        name: name.trim(),
        totalBudget: parseFloat(budget),
        user_id: userId,
        icon,
        color,
      },
    ]);
    setLoading(false);
    if (!error) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.back();
      }, 3000);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#0A0A0C]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <MotiView
          from={{ opacity: 0, translateY: 40 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 600 }}
          className="flex-1 px-6 pt-14 pb-10"
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-14 left-6 z-50"
            activeOpacity={0.7}
          >
            <MotiView
              from={{ opacity: 0, translateX: -10 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: "timing", duration: 500 }}
              className="bg-white/10 p-3 rounded-full"
              style={{
                shadowColor: "#fff",
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 6,
              }}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </MotiView>
          </TouchableOpacity>
          {/* Heading & Lottie */}
          <Text className="text-2xl font-pbold text-center text-white mb-10 mt-3">
            Create Category
          </Text>
          <View
            className="bg-white/5 border border-white/10 rounded-2xl mb-6 items-center justify-center"
            style={{ height: 140, width: "100%" }}
          >
            <LottieView
              source={require("../assets/animations/money.json")}
              autoPlay
              loop
              style={{ width: 300, height: 300 }}
            />
          </View>
          {/* Icon Picker */}
          <Text className="text-sm text-gray-400 mb-2 font-psemibold">
            Select Icon
          </Text>
          <View className="flex-row flex-wrap mb-6">
            {ICONS.map((i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setIcon(i)}
                className={`p-3 m-1 rounded-xl ${icon === i ? "bg-white" : "bg-white/10"}`}
              >
                <Text
                  className={`text-2xl ${icon === i ? "text-white" : "text-gray-200"}`}
                >
                  {i}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Inputs */}
          <View className="space-y-4">
            <AnimatedInput
              label="Category Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Rent"
              isValid={!!name.trim()}
              color={color}
            />
            <AnimatedInput
              label="Monthly Budget (₹)"
              value={budget}
              onChangeText={setBudget}
              placeholder="e.g. 3000"
              keyboardType="numeric"
              isValid={parseFloat(budget) > 0}
              color={color}
            />
          </View>

          {/* Color Tag Picker */}
          <Text className="text-sm text-gray-400 mt-6 mb-2 font-psemibold">
            Pick a Tag Color
          </Text>
          <View className="flex-row flex-wrap gap-3 mb-8">
            {COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setColor(c)}
                className="h-10 w-10 rounded-full items-center justify-center"
                style={{
                  backgroundColor: c,
                  borderWidth: 2,
                  borderColor: color === c ? "#fff" : "transparent",
                }}
              >
                {color === c && (
                  <Ionicons name="checkmark" size={18} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Modern Glowing Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleCreate}
            disabled={!isValid || loading}
            className="rounded-3xl"
            style={{
              backgroundColor: isValid ? color : "#333",
              shadowColor: color,
              shadowOpacity: isValid ? 0.6 : 0,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <View className="py-4 items-center">
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-lg font-pbold text-white tracking-wider">
                  Add Category
                </Text>
              )}
            </View>
          </TouchableOpacity>

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
                    shadowColor: color,
                    shadowOpacity: 0.4,
                    shadowOffset: { width: 0, height: 10 },
                    shadowRadius: 20,
                    zIndex: 102,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "green",
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
                    Category Added
                  </Text>
                </MotiView>
              </View>
            )}
          </AnimatePresence>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function AnimatedInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  isValid,
  color,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: any;
  isValid: boolean;
  color: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <MotiView
      from={{ borderColor: "#ffffff22", shadowOpacity: 0 }}
      animate={{
        borderColor: color,
        shadowColor: color,
        shadowOpacity: focused ? 0.4 : 0,
        shadowRadius: focused ? 8 : 0,
      }}
      transition={{ type: "timing", duration: 300 }}
      className="rounded-2xl border mb-4"
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#888"
        keyboardType={keyboardType}
        className="text-white px-4 py-4 rounded-2xl bg-white/5 text-base font-pregular"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </MotiView>
  );
}

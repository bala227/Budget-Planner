import { View, Image, Text, Pressable } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import logo from '../assets/images/bplogo1.png';
import '../global.css';

export default function Loginscreen() {
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
  scale.value = withSpring(0.93, {
    stiffness: 300,
    damping: 15,
    mass: 0.5,
  });
};

const handlePressOut = () => {
  scale.value = withSpring(1, {
    stiffness: 250,
    damping: 10,
    mass: 0.5,
  });
};


  const handleNavigate = () => {
    router.push('/login');
  };

  return (
    <View className="flex-1 items-center bg-[#f2d3d3]">
      <Image source={logo} className="w-72 h-72 mt-52" resizeMode="contain" />

      <Text className="text-black font-pbold text-[30px] text-center mb-6">
        Budget <Text className="text-[#c93052]">Planner</Text>
      </Text>

      <View className="bg-[#c93052] w-full h-full rounded-t-[30px] px-5">
        <Text className="text-white font-psemibold text-[22px] text-center mt-6">
          Stay on Track, Event by Event: Your{' '}
          <Text className="font-pbold text-[25px]">Budget Planner</Text> App
        </Text>

        <Animated.View style={[animatedStyle]} className="mt-14">
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleNavigate}
            className="bg-white py-4 px-6 rounded-full"
          >
            <Text className="text-gray-800 text-center text-2xl font-psemibold">
              Login/Signup
            </Text>
          </Pressable>
        </Animated.View>

        <Text className="text-white font-pregular text-center mt-10">
          * By logging in, you are accepting our terms and regulations
        </Text>
      </View>
    </View>
  );
}

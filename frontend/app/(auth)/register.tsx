import {
  View,
  Text,
  Pressable,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import logo from '../../assets/images/bplogo1.png';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import Toast from 'react-native-toast-message';
import '../../global.css';

export default function Loginscreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  // Button spring scale
  const scale = useSharedValue(1);
  const handlePressIn = () => {
    scale.value = withSpring(0.93, {
      stiffness: 300,
      damping: 15,
    });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, {
      stiffness: 250,
      damping: 12,
    });
  };
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleRegister = async () => {
  if (!username || !password) {
    Toast.show({
      type: 'custom_error',
      text1: 'Missing Fields',
      text2: 'Please enter email and password',
    });
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: username,
      password: password,
    });

    if (error) {
      Toast.show({
        type: 'custom_error',
        text1: 'Registration Error',
        text2: error.message,
      });
    } else {
      Toast.show({
        type: 'custom_success',
        text1: 'Success!',
        text2: 'Please confirm your email.',
      });
      router.push('/login');
    }
  } catch (err) {
    Toast.show({
      type: 'custom_error',
      text1: 'Unexpected Error',
      text2: err.message,
    });
  }
};

const handleLogin = () => {
    router.push('/register');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#f2d3d3]"
    >
      <View className="items-center">
        <Image source={logo} className="w-64 h-64 mt-28" resizeMode="contain" />
      </View>

      <View className="bg-[#c93052] flex-1 rounded-t-[30px] pt-5 px-6 mt-16">
        {/* Username Input */}
        <Text
          className="text-white text-2xl text-center mb-7 px-4 font-psemibold"
          style={{ lineHeight: 34 }}
        >
         Sign Up to Plan Smarter, Spend Better 
        </Text>
        <View
          className="flex-row items-center rounded-3xl px-3 py-3 mb-5 shadow-md bg-white"
        >
          <Ionicons name="person" size={20} color="#c93052" className='ml-3 -mt-2'/>
          <TextInput
            placeholder="Enter your username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            className="flex-1 ml-3 text-base font-pregular"
          />
        </View>

        {/* Password Input */}
        <View
          className="flex-row items-center rounded-3xl px-3 py-3 mb-8 shadow-md bg-[white]"
        >
          <Ionicons name="lock-closed" size={20} color="#c93052" className='ml-3 -mt-2'/>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="flex-1 ml-3 text-base font-pregular"
          />
        </View>

        {/* Animated Login Button */}
        <Animated.View style={[animatedStyle]} className="mt-4 mx-20">
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleRegister}
            className="bg-[white] py-4 rounded-full shadow-lg"
          >
            <Text className="text-center text-2xl font-pbold" style={{ color: '#c93052' }}>
              Register
            </Text>
          </Pressable>
        </Animated.View>

        {/* Register Link */}
        <Text
        onPress={handleLogin}
          className="text-white text-center mt-10 text-[16px] font-semibold"
        >
          Already have an account? <Text className='underline' >Login</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

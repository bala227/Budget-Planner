import React, { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CustomToast } from '../components/CustomToast'; // adjust path if needed
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const toastConfig = {
  custom_success: (props) => <CustomToast {...props} type="success" />,
  custom_error: (props) => <CustomToast {...props} type="error" />,
  custom_warning: (props) => <CustomToast {...props} type="warning" />,
  custom_info: (props) => <CustomToast {...props} type="info" />,
};


function Root() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name={isAuthenticated ? "(tabs)" : "index"} />
    </Stack>
  );
}

export default function Rootlayout() {

  const [fontsLoaded, error] = useFonts({
      "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
      "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
      "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
      "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
      "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
      "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
      "Poppins-BoldItalic": require("../assets/fonts/Poppins-BoldItalic.ttf"),
      "Poppins-SemiBoldItalic": require("../assets/fonts/Poppins-SemiBoldItalic.ttf"),
      "Poppins-MediumItalic": require("../assets/fonts/Poppins-MediumItalic.ttf"),
    });
  
    useEffect(() => {
      if (error) throw error;
      if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded, error]);
  
    if (!fontsLoaded) return null;
   
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppContent />
      </GestureHandlerRootView>
    </AuthProvider>  
  )
}

function AppContent() {

  return (
    <>
      <Root />
      <StatusBar style="light"/>
      <Toast config={toastConfig} />
    </>
  );
}


// components/CustomToast.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const CustomToast = ({ text1, text2, type = 'success', onClose }) => {
  const config = {
    success: {
      icon: 'check-circle',
      gradient: ['#a855f7','#10b981'], // green → purple
      textColor: '#fff',
      iconColor: '#fff',
    },
    info: {
      icon: 'info-circle',
      gradient: ['#3b82f6', '#a855f7'], // blue → purple
      textColor: '#fff',
      iconColor: '#fff',
    },
    warning: {
      icon: 'exclamation-triangle',
      gradient: ['#facc15', '#ef4444'], // yellow → purple
      textColor: '#000',
      iconColor: '#000',
    },
    error: {
      icon: 'times-circle',
      gradient: ['#ef4444', '#a855f7'], // red → purple
      textColor: '#fff',
      iconColor: '#fff',
    },
  };

  const { icon, gradient, textColor, iconColor } = config[type] || config.success;

  return (
    <View style={styles.toastWrapper}>
      <LinearGradient
        colors={gradient}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.toast}
      >
        <FontAwesome name={icon} size={24} color={iconColor} style={styles.icon} />

        <View style={styles.textContainer}>
          {!!text1 && <Text style={[styles.text1, { color: textColor }]}>{text1}</Text>}
          {!!text2 && <Text style={[styles.text2, { color: textColor }]}>{text2}</Text>}
        </View>

        {onClose && (
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={20} color={textColor} />
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  toastWrapper: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    minWidth: 280,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  text1: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  text2: {
    fontSize: 14,
    marginTop: 2,
  },
});

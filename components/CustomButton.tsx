import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface Props extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
}

const CustomButton: React.FC<Props> = ({ title, loading, style, ...props }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} {...props} disabled={props.disabled || loading}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
  },
  text: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

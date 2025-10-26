import { Redirect } from 'expo-router';
import { Platform } from 'react-native';

export default function Index() {
  if (Platform.OS === 'web') {
    return <Redirect href="/(admin)/(tabs)/dashboard" />;
  } else {
    return <Redirect href="/(users)/(tabs)" />;
  }
}
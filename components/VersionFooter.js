import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';

// --- Bonus A (+5): App Version Display ---
// Reads version straight from app.json via expo-constants, so it always
// stays in sync when you bump the version for a new release build.
export default function VersionFooter() {
  const version = Constants.expoConfig?.version ?? 'unknown';
  const androidVersionCode = Constants.expoConfig?.android?.versionCode ?? '-';

  return (
    <View style={styles.container}>
      <Text style={styles.text}>PokeExplorer v{version} (build {androidVersionCode})</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 10, alignItems: 'center' },
  text: { color: '#9E9E9E', fontSize: 12 },
});

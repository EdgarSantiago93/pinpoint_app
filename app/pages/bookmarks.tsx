import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function BookmarksScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, { paddingBottom: Math.max(insets.bottom, 20) + 80 }]}>
      <ThemedText type="title" style={styles.title}>
        Bookmarks
      </ThemedText>
      <ThemedText style={styles.placeholder}>Bookmarked content will appear here</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    marginBottom: 16,
  },
  placeholder: {
    opacity: 0.6,
  },
});


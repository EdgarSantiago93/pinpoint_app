import {
  IconBookmark,
  IconHome,
  IconMapPin,
  IconPlus,
  IconUser,
} from '@tabler/icons-react-native';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useBottomNavigationStore } from '@/stores/bottom-navigation-store';
import * as Haptics from 'expo-haptics';

export function BottomNavigation() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const colors = Colors['light'];
  const isVisible = useBottomNavigationStore((state) => state.isVisible);

  // Animation value for translateY
  const translateY = useSharedValue(0);

  // Update animation when visibility changes
  useEffect(() => {
    const bottomOffset = Math.max(insets.bottom, 20);
    const navigationHeight = 60 + bottomOffset + 40; // tab bar height + bottom offset + extra padding
    translateY.value = withTiming(isVisible ? 0 : navigationHeight, {
      duration: 120,
    });
  }, [isVisible, insets.bottom, translateY]);

  // Animated style for the container
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handlePlusPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/pages/add-place');
  };

  const navigationItems = [
    {
      name: 'feed',
      path: '/pages/feed',
      icon: IconHome,
      title: 'Feed',
    },
    {
      name: 'map',
      path: '/pages/map',
      icon: IconMapPin,
      title: 'Home',
    },
    {
      name: 'bookmarks',
      path: '/pages/bookmarks',
      icon: IconBookmark,
      title: 'Bookmarks',
    },
    {
      name: 'profile',
      path: '/pages/profile',
      icon: IconUser,
      title: 'Profile',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/pages') {
      return (
        pathname === '/pages' ||
        pathname === '/pages/' ||
        pathname === '/pages/index'
      );
    }
    return pathname === path;
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View
        style={[
          styles.tabBar,
          {
            bottom: Math.max(insets.bottom, 20),
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          },
        ]}
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const color = active ? colors.tint : colors.tabIconDefault;

          return (
            <HapticTab
              key={item.name}
              onPress={() => {
                router.replace(item.path as any);
              }}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <Icon size={24} color={color} strokeWidth={active ? 2.5 : 2} />
            </HapticTab>
          );
        })}
      </View>
      {/* Center Plus Button */}
      <TouchableOpacity
        style={[
          styles.plusButton,
          {
            bottom: Math.max(insets.bottom, 20) + 30,
            backgroundColor: colors.tint,
            shadowColor: colors.tint,
          },
        ]}
        onPress={handlePlusPress}
        activeOpacity={0.8}
      >
        <IconPlus size={28} color="#fff" strokeWidth={2.5} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 30,
    marginHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  plusButton: {
    position: 'absolute',
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});

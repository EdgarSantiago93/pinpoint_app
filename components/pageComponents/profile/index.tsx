import ProfileSkeleton from '@/components/pageComponents/profile/skeleton';
import { styles } from '@/components/pageComponents/profile/styles';
import {
  IconArrowRight,
  IconBookmark,
  IconMapPin,
  IconSettings,
} from '@tabler/icons-react-native';
import React, { useRef } from 'react';
import {
  ImageBackground,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {
  SettingsBottomSheet,
  SettingsBottomSheetRef,
} from '@/components/settings-bottom-sheet';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useUser } from '@/hooks/use-user';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colors = Colors['light'];
  const settingsBottomSheetRef = useRef<SettingsBottomSheetRef>(null);

  const {
    data: user,
    isRefetching,
    refetch,
    isLoading,
  } = useUser({
    pins: true,
    collections: true,
    visitCount: true,
    wishlistCount: true,
  });

  const onRefresh = async () => {
    await refetch();
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView
        style={[
          styles.container,
          { paddingBottom: Math.max(insets.bottom, 20) + 80 },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              tintColor={Colors.light.tint}
              colors={[Colors.light.tint]}
              refreshing={isRefetching}
              onRefresh={onRefresh}
            />
          }
        >
          <Animated.View
            entering={FadeInDown.delay(0).duration(400).springify()}
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <TouchableOpacity
              onPress={() => settingsBottomSheetRef.current?.present()}
            >
              <IconSettings />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(50).duration(400).springify()}
            style={styles.profileHeader}
          >
            <ImageBackground
              source={{ uri: user?.avatar }}
              style={[
                styles.avatarContainer,
                {
                  backgroundColor: '#E0E0E0',
                },
              ]}
              imageStyle={{ borderRadius: 50, width: '100%', height: '100%' }}
            >
              {!user?.avatar ? (
                <ThemedText style={styles.avatarText}>
                  {user?.name
                    ?.split(' ')
                    .map((name) => name[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </ThemedText>
              ) : null}
            </ImageBackground>
            <ThemedText type="title" style={styles.name}>
              {user?.name}
            </ThemedText>
            <ThemedText type="dimmed" style={styles.username}>
              @{user?.username}
            </ThemedText>
          </Animated.View>

          {/* Stats Row */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(400).springify()}
            style={styles.statsContainer}
          >
            <ThemedText style={styles.stat}>
              <ThemedText style={styles.statNumber}>
                {user?.pins || 0}
              </ThemedText>{' '}
              {user?.pins && user?.pins > 1 ? 'Pins' : 'Pin'}
            </ThemedText>
            <ThemedText style={styles.stat}>
              <ThemedText style={styles.statNumber}>
                {user?.collections || 0}
              </ThemedText>{' '}
              {user?.collections && user?.collections > 1
                ? 'Colecciones'
                : 'Colección'}
            </ThemedText>
          </Animated.View>

          {/* Action Buttons */}
          {/* <View style={styles.actionButtons}>
            <Button variant="filled" title="Edit Profile" onPress={() => {}} />
          </View> */}

          {/* Content Cards */}
          <Animated.View
            entering={FadeInDown.delay(150).duration(400).springify()}
            style={styles.cardsContainer}
          >
            {/* Visited Card */}
            <TouchableOpacity
              style={[
                styles.card,
                {
                  backgroundColor: '#F5F5F5',
                },
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <View
                    style={[
                      styles.cardIconContainer,
                      {
                        backgroundColor: '#E0E0E0',
                      },
                    ]}
                  >
                    <IconMapPin size={20} color={colors.tint} strokeWidth={2} />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <ThemedText style={styles.cardTitle}>Visitas</ThemedText>
                    <ThemedText style={styles.cardNumber}>
                      {user?.visitCount || 0}
                    </ThemedText>
                  </View>
                </View>
                <IconArrowRight size={18} color={colors.icon} strokeWidth={2} />
              </View>
            </TouchableOpacity>

            {/* Wishlist Card */}
            <TouchableOpacity
              style={[
                styles.card,
                {
                  backgroundColor: '#F5F5F5',
                },
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <View
                    style={[
                      styles.cardIconContainer,
                      {
                        backgroundColor: '#E0E0E0',
                      },
                    ]}
                  >
                    <IconBookmark
                      size={20}
                      color={colors.tint}
                      strokeWidth={2}
                    />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <ThemedText style={styles.cardTitle}>Wishlist</ThemedText>
                    <ThemedText style={styles.cardNumber}>
                      {user?.wishlistCount || 0}
                    </ThemedText>
                  </View>
                </View>
                <IconArrowRight size={18} color={colors.icon} strokeWidth={2} />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Collections Section */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(400).springify()}
            style={styles.collectionsSection}
          >
            <ThemedText type="subtitle" style={styles.collectionsTitle}>
              Colecciones
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.collectionCard,
                {
                  backgroundColor: '#F5F5F5',
                },
              ]}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.collectionImage,
                  {
                    backgroundColor: '#E0E0E0',
                  },
                ]}
              >
                <ThemedText style={styles.collectionImageText}>
                  EUROPE
                </ThemedText>
              </View>
              <ThemedText style={styles.collectionName}>
                test collection
              </ThemedText>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </ThemedView>
      <SettingsBottomSheet ref={settingsBottomSheetRef} />
    </SafeAreaView>
  );
}

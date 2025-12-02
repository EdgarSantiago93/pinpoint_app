import { Avatar } from '@/components/avatar';
import { SkeletonBox } from '@/components/pageComponents/profile/skeleton';
import { ThemedText } from '@/components/themed-text';
import { Colors, nunito600semibold } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export const AvatarGroup = ({
  visitors,
  totalVisitors,
  isLoading,
}: {
  isLoading: boolean;
  visitors: {
    id: string;
    name: string;
    avatar: string;
  }[];
  totalVisitors: number;
}) => {
  const remainingVisitors = totalVisitors - 3;
  return (
    <View style={styles.likesSection}>
      {isLoading ? (
        <>
          <SkeletonBox
            height={30}
            width={30}
            borderRadius={15}
            style={{
              ...styles.avatar,
              marginLeft: 0,
            }}
          />
          <SkeletonBox
            height={30}
            width={30}
            borderRadius={15}
            style={{
              ...styles.avatar,
              marginLeft: -9,
            }}
          />
          <SkeletonBox
            height={30}
            width={30}
            borderRadius={15}
            style={{
              ...styles.avatar,
              marginLeft: -9,
            }}
          />
        </>
      ) : (
        <Animated.View entering={FadeInUp.duration(120).delay(200).springify()}>
          <View style={styles.avatarContainer}>
            {visitors?.map((visitor, index) => (
              <Avatar
                key={visitor.id}
                imageUri={visitor.avatar}
                name={visitor.name}
                size={30}
                style={{
                  ...styles.avatar,
                  marginLeft: index > 0 ? -9 : 0,
                }}
              />
            ))}

            {remainingVisitors > 0 ? (
              <View
                style={[
                  styles.initialsContainer,
                  {
                    ...styles.avatar,
                    marginLeft: -9,
                    width: 30,
                    height: 30,
                    borderRadius: 30 / 2,
                    backgroundColor: '#E0E0E0',
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.initialsText,
                    {
                      fontSize: 10,
                      color: '#687076',
                    },
                  ]}
                >
                  {`+${
                    remainingVisitors <= 999
                      ? remainingVisitors
                      : '+999'.toString()
                  }`}
                </ThemedText>
              </View>
            ) : null}
          </View>
        </Animated.View>
      )}

      {isLoading ? (
        <SkeletonBox height={24} width={100} />
      ) : (
        <Animated.View entering={FadeInUp.duration(120).delay(200).springify()}>
          <ThemedText type="defaultSemiBold" style={styles.likesText}>
            {totalVisitors} personas han visitado este lugar
          </ThemedText>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  likesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  likesText: {
    letterSpacing: -0.1,
    fontSize: 14,
  },
  avatarContainer: {
    flexDirection: 'row',
  },
  avatar: {
    // borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.background,
  },

  //
  //

  initialsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontFamily: nunito600semibold,
    fontWeight: '600',
  },
});

import { FlexView } from '@/components/ui/flex-view';
import { Colors, nunito400regular } from '@/constants/theme';
import { IconBookmark, IconCheck } from '@tabler/icons-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { FadeInDown } from 'react-native-reanimated';

export function ActionButtons({
  isVisited,
  isWishlist,
  isFavorite,
}: {
  isVisited?: boolean;
  isWishlist?: boolean;
  isFavorite?: boolean;
}) {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowButtons(true);
    }, 1000);
  }, []);

  if (!showButtons) {
    return null;
  }

  return (
    <FlexView animated entering={FadeInDown}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          isVisited ? styles.actionButtonActive : styles.actionButtonNormal,
        ]}
      >
        <IconCheck
          size={24}
          color={isVisited ? Colors.light.tint : Colors.light.text}
        />
        {/* <ThemedText
          style={
            isVisited
              ? styles.actionButtonTextActive
              : styles.actionButtonTextNormal
          }
          numberOfLines={1}
        >
          {isVisited ? 'Visitado' : 'Visitado'}
        </ThemedText> */}
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.actionButton,
          isWishlist ? styles.actionButtonActive : styles.actionButtonNormal,
        ]}
      >
        <IconBookmark
          size={24}
          color={isWishlist ? Colors.light.tint : Colors.light.text}
        />
        {/* <ThemedText
          style={
            isWishlist
              ? styles.actionButtonTextActive
              : styles.actionButtonTextNormal
          }
          numberOfLines={1}
        >
          Wishlist
        </ThemedText> */}
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={[styles.actionButton, styles.actionButtonNormal]}
      >
        <IconEdit size={24} color={Colors.light.text} />
        <ThemedText style={styles.actionButtonTextNormal} numberOfLines={1}>
          Notes
        </ThemedText>
      </TouchableOpacity> */}
      {/* </View> */}
    </FlexView>
  );
}

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  actionButtonNormal: {
    backgroundColor: 'white',
    borderColor: '#EAEAEA',
  },
  actionButtonActive: {
    backgroundColor: '#FFF4F2',
    borderColor: Colors.light.tint,
  },
  actionButtonTextNormal: {
    fontSize: 12,
    fontFamily: nunito400regular,
    color: Colors.light.text,
    fontWeight: '500',
  },
  actionButtonTextActive: {
    fontSize: 12,
    fontFamily: nunito400regular,
    color: Colors.light.tint,
    fontWeight: '500',
  },
});

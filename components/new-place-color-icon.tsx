import { PinIcons } from '@/components/pin-icons';
import { ThemedText } from '@/components/themed-text';
import { Colors, nunito400regular } from '@/constants/theme';
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import ColorPicker, { Swatches } from 'reanimated-color-picker';

interface IconOption {
  name: string;
  component: React.ComponentType<{ size?: number; color?: string }>;
}

const AVAILABLE_ICONS: IconOption[] = PinIcons;

interface NewPlaceColorIconProps {
  selectedColor?: string;
  selectedIcon?: string;
  onColorChange?: (color: string) => void;
  onIconChange?: (iconName: string) => void;
}

export default function NewPlaceColorIcon({
  selectedColor = '#912121',
  selectedIcon,
  onColorChange,
  onIconChange,
}: NewPlaceColorIconProps) {
  const colors = Colors['light'];
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return AVAILABLE_ICONS;
    }
    return AVAILABLE_ICONS.filter((icon) =>
      icon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleColorChange = ({ hex }: { hex: string }) => {
    onColorChange?.(hex);
  };

  const handleIconSelect = (iconName: string) => {
    onIconChange?.(iconName);
  };

  return (
    <View style={styles.container}>
      {/* Color Picker Section */}
      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Color
        </ThemedText>
        <View style={styles.colorPickerContainer}>
          <ColorPicker
            value={selectedColor}
            onComplete={handleColorChange}
            style={styles.colorPicker}
          >
            <Swatches />
          </ColorPicker>
        </View>
      </View>

      {/* Icon Search Section */}
      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Icon
        </ThemedText>
        <View style={[styles.inputContainer, { borderColor: colors.icon }]}>
          <TextInput
            style={styles.input}
            placeholder="Search icons..."
            placeholderTextColor={colors.icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Icons Grid */}
        <ScrollView
          style={styles.iconsContainer}
          contentContainerStyle={styles.iconsGrid}
          showsVerticalScrollIndicator={false}
        >
          {filteredIcons.map((icon) => {
            const IconComponent = icon.component;
            const isSelected = selectedIcon === icon.name;
            return (
              <TouchableOpacity
                key={icon.name}
                style={[
                  styles.iconItem,
                  isSelected && {
                    backgroundColor: selectedColor + '20',
                    borderColor: selectedColor,
                  },
                ]}
                onPress={() => handleIconSelect(icon.name)}
                activeOpacity={0.7}
              >
                <IconComponent
                  size={32}
                  color={isSelected ? selectedColor : colors.text}
                />
                <ThemedText style={styles.iconLabel} numberOfLines={1}>
                  {icon.name}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 14,
  },
  colorPickerContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  colorPicker: {
    width: '100%',
  },
  preview: {
    height: 50,
    borderRadius: 8,
    marginBottom: 16,
  },
  panel: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 20,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: nunito400regular,
    color: Colors.light.text,
    padding: 0,
  },
  iconsContainer: {
    maxHeight: 300,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconItem: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
  },
  iconLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: nunito400regular,
  },
});

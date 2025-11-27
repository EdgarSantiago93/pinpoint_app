import { PinIcons } from '@/components/pin-icons';
import { ThemedText } from '@/components/themed-text';
import { Colors, nunito600semibold } from '@/constants/theme';
import { AddPlaceFormData } from '@/stores/add-place-form-store';
import { IconChevronDown } from '@tabler/icons-react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import DatePicker, { DatePickerRef } from 'rn-awesome-date-picker';
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('es');
// Color swatches - predefined colors (moved outside component to avoid re-creation)
const colorSwatches = [
  '#c94726', // Red
  '#FF6B6B', // Light Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#F39C12', // Orange
  '#9B59B6', // Purple
  '#E74C3C', // Dark Red
];

const CustomizeStepComponent = ({
  formData,
  onDataChange,
  onNext,
}: {
  formData: AddPlaceFormData;
  onDataChange: (data: Partial<AddPlaceFormData>) => void;
  onNext?: () => void;
}) => {
  // Generate random icon and color only once, memoized
  const randomIconIndex = useMemo(
    () => Math.floor(Math.random() * PinIcons.length),
    []
  );
  const randomColor = useMemo(
    () => colorSwatches[Math.floor(Math.random() * colorSwatches.length)],
    []
  );

  // Initialize form data with random values if not already set (only on mount)
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;

      if (!formData.selectedIcon || !formData.selectedColor) {
        const updates: Partial<AddPlaceFormData> = {};

        if (!formData.selectedIcon) {
          updates.selectedIcon = PinIcons[randomIconIndex].name;
        }

        if (!formData.selectedColor) {
          updates.selectedColor = randomColor;
        }

        if (Object.keys(updates).length > 0) {
          onDataChange(updates);
        }
      }
    }
  }, [
    formData.selectedIcon,
    formData.selectedColor,
    randomIconIndex,
    randomColor,
    onDataChange,
  ]);

  const [isExpanded, setIsExpanded] = useState(false);
  const selectedColor = formData.selectedColor || randomColor;
  const selectedIconName =
    formData.selectedIcon || PinIcons[randomIconIndex].name;

  // Find the selected icon component
  const selectedIcon = PinIcons.find((icon) => icon.name === selectedIconName);
  const SelectedIconComponent =
    selectedIcon?.component || PinIcons[0].component;

  const accordionHeight = useSharedValue(0);
  const accordionOpacity = useSharedValue(0);
  const accordionContentRef = useRef<View>(null);

  // Animated styles for accordion
  const accordionAnimatedStyle = useAnimatedStyle(() => {
    return {
      maxHeight: accordionHeight.value * 500,
      opacity: accordionOpacity.value,
      marginTop: accordionHeight.value * 16, // Animate margin
      paddingTop: accordionHeight.value * 16, // Animate padding
      borderTopWidth: accordionHeight.value * 1, // Animate border
    };
  });

  const chevronAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${accordionHeight.value * 180}deg`,
        },
      ],
    };
  });

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);

    if (newExpanded) {
      // Expand: animate to full height and fade in
      accordionHeight.value = withTiming(1, { duration: 300 });
      accordionOpacity.value = withTiming(1, { duration: 300 });
    } else {
      // Collapse: animate to 0 height and fade out
      accordionHeight.value = withTiming(0, { duration: 300 });
      accordionOpacity.value = withTiming(0, { duration: 300 });
    }
  };

  const handleColorChange = ({ hex }: { hex: string }) => {
    onDataChange({ selectedColor: hex });
  };

  const handleIconSelect = (iconName: string) => {
    onDataChange({ selectedIcon: iconName });
  };

  const datePickerRef = useRef<DatePickerRef>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const descriptionContainerRef = useRef<View>(null);
  const nameContainerRef = useRef<View>(null);
  // Initialize date from formData if it exists, otherwise use current date
  const initialDate = formData.visitDate
    ? typeof formData.visitDate === 'string'
      ? new Date(formData.visitDate)
      : formData.visitDate
    : new Date();
  const [date, setDate] = useState<Date | null>(initialDate);
  const [descriptionY, setDescriptionY] = useState<number>(0);
  const [nameY, setNameY] = useState<number>(0);

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Selecciona una fecha';

    const dateDayjs = dayjs(date);
    const today = dayjs();
    const yesterday = dayjs().subtract(1, 'day');

    // Check if today
    if (dateDayjs.isSame(today, 'day')) {
      return 'Hoy';
    }

    // Check if yesterday
    if (dateDayjs.isSame(yesterday, 'day')) {
      return 'Ayer';
    }

    // Format as "agosto 18 2004"
    return dateDayjs.format('MMMM D, YYYY');
  };

  const handleDescriptionFocus = () => {
    // Small delay to ensure keyboard is shown and layout is measured
    setTimeout(() => {
      if (descriptionY > 0) {
        scrollViewRef.current?.scrollTo({
          y: descriptionY - 20, // Add some padding from top
          animated: true,
        });
      } else {
        // Fallback: scroll to end if position not measured yet
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  const handleDescriptionLayout = (event: any) => {
    const { y } = event.nativeEvent.layout;
    setDescriptionY(y);
  };

  const handleNameFocus = () => {
    // Small delay to ensure keyboard is shown and layout is measured
    setTimeout(() => {
      if (nameY > 0) {
        scrollViewRef.current?.scrollTo({
          y: nameY - 20, // Add some padding from top
          animated: true,
        });
      } else {
        // Fallback: scroll to end if position not measured yet
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  const handleNameLayout = (event: any) => {
    const { y } = event.nativeEvent.layout;
    setNameY(y);
  };

  const handleDatePickerFocus = () => {
    Keyboard.dismiss();
    datePickerRef.current?.open();
  };
  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.stepContent}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <ThemedText type="title-serif" style={styles.stepTitle}>
        Personaliza tu pin
      </ThemedText>
      <ThemedText style={styles.stepDescription}>
        Agrega detalles de tu pin
      </ThemedText>

      {/* Marker Preview with Accordion */}
      <View style={styles.markerSection}>
        <TouchableOpacity
          onPress={handleToggle}
          activeOpacity={0.7}
          style={styles.markerPreviewContainer}
        >
          <View
            style={[styles.markerContainer, { backgroundColor: selectedColor }]}
          >
            <SelectedIconComponent size={40} color={'#fff'} />
          </View>
          <Animated.View style={chevronAnimatedStyle}>
            <IconChevronDown size={24} color={Colors['light'].text} />
          </Animated.View>
        </TouchableOpacity>

        {/* Accordion Content */}
        <Animated.View
          ref={accordionContentRef}
          style={[styles.accordionContent, accordionAnimatedStyle]}
        >
          <View style={styles.colorSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.colorScrollContent}
            >
              {colorSwatches.map((color) => {
                const isSelected =
                  selectedColor.toLowerCase() === color.toLowerCase();
                return (
                  <TouchableOpacity
                    key={color}
                    onPress={() => handleColorChange({ hex: color })}
                    activeOpacity={0.7}
                    style={[
                      styles.swatchContainer,
                      isSelected && {
                        borderColor: color,
                        borderWidth: 3,
                      },
                    ]}
                  >
                    <View style={[styles.swatch, { backgroundColor: color }]} />
                    {isSelected && (
                      <View style={styles.swatchIndicator}>
                        <View style={styles.swatchCheckmark} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.iconSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.iconScrollContent}
            >
              {PinIcons.map((icon) => {
                const IconComponent = icon.component;
                const isSelected = selectedIconName === icon.name;
                return (
                  <TouchableOpacity
                    key={icon.name}
                    style={[
                      styles.iconItem,
                      isSelected && {
                        backgroundColor: selectedColor + '20',
                        borderColor: selectedColor,
                        borderWidth: 3,
                      },
                    ]}
                    onPress={() => handleIconSelect(icon.name)}
                    activeOpacity={0.7}
                  >
                    <IconComponent
                      size={32}
                      color={isSelected ? selectedColor : Colors['light'].text}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </Animated.View>
      </View>
      {/* Name Input */}
      <View
        style={styles.inputGroup}
        ref={nameContainerRef}
        onLayout={handleNameLayout}
      >
        <ThemedText type="defaultSemiBold" style={styles.label}>
          Nombre del lugar *
        </ThemedText>
        <View style={{ ...styles.inputContainer, height: 56 }}>
          <TextInput
            style={styles.input}
            placeholder="Nombre del lugar"
            placeholderTextColor={Colors['light'].icon}
            value={formData.placeData?.name || ''}
            onChangeText={(value) =>
              onDataChange({
                placeData: {
                  ...formData.placeData,
                  name: value,
                } as AddPlaceFormData['placeData'],
              })
            }
            onFocus={handleNameFocus}
          />
        </View>
      </View>
      <View style={styles.inputGroup}>
        <ThemedText type="defaultSemiBold" style={styles.label}>
          Cuando fuiste?
        </ThemedText>

        <TouchableOpacity onPress={handleDatePickerFocus}>
          <View style={{ ...styles.inputContainer, height: 56 }}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              {formatDate(date)}
            </ThemedText>
          </View>
        </TouchableOpacity>
      </View>
      <DatePicker
        ref={datePickerRef}
        mode="single"
        value={date}
        onChange={(newDate) => {
          setDate(newDate);
          // Save date to form data
          onDataChange({ visitDate: newDate?.toISOString() });
        }}
        showInput={false}
        cancelButtonText="Cancelar"
        chooseDateButtonText="Seleccionar fecha"
        chooseYearButtonText="Cambiar año"
        chooseMonthButtonText="Cambiar mes"
        dateTextColor={Colors['light'].text}
        activeDateTextColor={'#fff'}
        activeDateBackgroundColor={Colors['light'].tint}
        maxDate={new Date()}
        labelStyle={{
          color: Colors['light'].text,
          fontSize: 16,
          fontFamily: nunito600semibold,
        }}
        chooseDateButtonProps={{
          containerStyle: {
            backgroundColor: Colors['light'].tint,
          },
          textStyle: {
            color: 'white',
            fontSize: 16,
            fontFamily: nunito600semibold,
          },
        }}
        cancelButtonProps={{
          containerStyle: {
            borderWidth: 0,
            borderColor: Colors['light'].text,
          },
          textStyle: {
            color: Colors['light'].text,
            fontSize: 16,
            fontFamily: nunito600semibold,
          },
        }}
        chooseYearButtonProps={{
          containerStyle: {
            borderColor: Colors['light'].tint,
            borderWidth: 1.5,
            backgroundColor: 'transparent',
          },
          textStyle: {
            color: Colors['light'].tint,
            fontSize: 16,
            fontFamily: nunito600semibold,
          },
        }}
        chooseMonthButtonProps={{
          containerStyle: {
            borderColor: Colors['light'].tint,
            borderWidth: 1.5,
            backgroundColor: 'transparent',
          },
          textStyle: {
            color: Colors['light'].tint,
            fontSize: 16,
            fontFamily: nunito600semibold,
          },
        }}
      />

      {/* Description Input */}
      <View
        style={styles.inputGroup}
        ref={descriptionContainerRef}
        onLayout={handleDescriptionLayout}
      >
        <ThemedText type="defaultSemiBold" style={styles.label}>
          Cómo describirías tu visita?
        </ThemedText>
        <View style={[styles.inputContainer, styles.textAreaContainer]}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Agrega una descripción..."
            placeholderTextColor={Colors['light'].icon}
            value={formData.description}
            onChangeText={(value) => onDataChange({ description: value })}
            onFocus={handleDescriptionFocus}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default CustomizeStepComponent;

const styles = StyleSheet.create({
  markerSection: {
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  markerPreviewContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  markerContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accordionContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    overflow: 'hidden',
  },
  colorSection: {
    marginBottom: 20,
  },
  colorScrollContent: {
    paddingVertical: 8,
    gap: 12,
  },
  swatchContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  swatchIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  swatchCheckmark: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  iconSection: {
    marginTop: 8,
  },
  iconScrollContent: {
    paddingVertical: 8,
    gap: 12,
  },
  iconItem: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  stepTitle: {
    fontSize: 28,
    marginBottom: 0,
  },
  stepDescription: {
    fontSize: 16,
    color: '#687076',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontSize: 17,
  },

  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },

  //

  // inputContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#F5F5F5',
  //   borderRadius: 8,
  //   paddingHorizontal: 16,
  //   paddingVertical: 12,
  //   borderWidth: 1,
  //   borderColor: '#E0E0E0',
  // },
  input: {
    flex: 1,
    color: Colors.light.text,
    padding: 0,
    fontSize: 16,
    fontFamily: nunito600semibold,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15.5,
    paddingVertical: 12,
    gap: 12,
    padding: 0,
    margin: 0,
    borderWidth: 1.5,

    color: Colors.light.text,
    borderColor: Colors.light.tint + 90,
  },

  textArea: {
    minHeight: 100,
    paddingTop: 0,
  },
});

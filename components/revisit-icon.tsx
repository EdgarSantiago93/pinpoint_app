import { Colors } from '@/constants/theme';
import { IconPinnedFilled, IconRefresh } from '@tabler/icons-react-native';
import { View } from 'react-native';

const RevisitIcon = ({ size = 50, color = Colors.light.icon }) => {
  return (
    <View
      style={{
        position: 'relative',
        width: size,
        height: size,
      }}
    >
      <IconRefresh
        size={size}
        style={{ position: 'absolute', top: 0, left: 0 }}
        strokeWidth={1.5}
        color={color}
      />
      <IconPinnedFilled
        size={size - size / 2}
        strokeWidth={2.2}
        color={color}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
          bottom: 0,
        }}
      />
    </View>
  );
};

export default RevisitIcon;

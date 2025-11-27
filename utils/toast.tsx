import { nunito700bold } from '@/constants/theme';
import { toast } from '@backpackapp-io/react-native-toast';
import {
  IconAlertCircle,
  IconCheck,
  IconInfoCircle,
} from '@tabler/icons-react-native';
import { TextStyle } from 'react-native';

const baseStyles = {
  view: {
    backgroundColor: 'white',

    borderRadius: 8,
    borderWidth: 2,
  },
  text: {
    color: 'rgb(72, 70, 70)',
    fontFamily: nunito700bold,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 16,
  },
};

export const useToast = () => {
  const showSuccessToast = (message: string) => {
    return toast(message, {
      icon: <IconCheck color="rgba(0, 113, 26, 0.7)" />,
      height: 30,
      styles: {
        view: {
          ...baseStyles.view,
          borderColor: 'rgba(0, 113, 26, 0.7)',
        },
        text: { ...(baseStyles.text as TextStyle) },
      },
      animationConfig: {
        duration: 120,
      },
    });
  };

  const showInfoToast = (message: string) => {
    return toast(message, {
      icon: <IconInfoCircle color="rgba(5, 96, 232, 0.7)" />,
      height: 30,
      styles: {
        view: {
          ...baseStyles.view,
          borderColor: 'rgba(5, 96, 232, 0.7)',
        },
        text: { ...(baseStyles.text as TextStyle) },
      },
      animationConfig: {
        duration: 120,
      },
    });
  };
  const showErrorToast = (message: string) => {
    return toast(message, {
      icon: <IconAlertCircle color="rgba(207, 76, 0, 0.7)" />,
      height: 30,

      styles: {
        view: {
          ...baseStyles.view,
          borderColor: 'rgba(207, 76, 0, 0.7)',
        },
        text: { ...(baseStyles.text as TextStyle) },
      },
      animationConfig: {
        duration: 120,
      },
    });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return showSuccessToast(message);
      case 'error':
        return showErrorToast(message);
      case 'info':
        return showInfoToast(message);
      default:
        return showErrorToast(message);
    }
  };

  return { showToast };
};

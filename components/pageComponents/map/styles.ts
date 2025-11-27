import { nunito400regular, nunito600semibold } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    right: 10,
    top: 100,
    backgroundColor: 'rgba(201, 71, 38, 0.7)',
    zIndex: 1000,
    padding: 4,
    borderRadius: 10,
    alignItems: 'center',
    gap: 8,
  },
  loadingContainer: {
    position: 'absolute',
    right: 10,
    top: 60,
    zIndex: 1000,
    padding: 4,
    borderRadius: 10,
    alignItems: 'center',
    gap: 8,
  },

  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    fontFamily: nunito400regular,
  },
  permissionButton: {
    padding: 12,
    paddingHorizontal: 24,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    overflow: 'hidden',
  },
  permissionButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    fontFamily: nunito600semibold,
  },
});

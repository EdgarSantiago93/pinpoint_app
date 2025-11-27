import { dmserif } from '@/constants/theme';
import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '600',
    color: '#687076',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: dmserif,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
    width: '100%',
    paddingHorizontal: 20,
  },
  stat: {
    fontSize: 14,
    textAlign: 'center',
  },
  statNumber: {
    fontWeight: '600',
  },
  statWithLock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    width: '100%',
  },
  editButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
    width: '100%',
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextContainer: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  collectionsSection: {
    marginBottom: 20,
    width: '100%',
  },
  collectionsTitle: {
    marginBottom: 16,
    fontSize: 20,
  },
  collectionCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  collectionImage: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectionImageText: {
    fontSize: 24,
    fontWeight: 'bold',
    opacity: 0.5,
  },
  collectionName: {
    padding: 16,
    fontSize: 16,
  },
});

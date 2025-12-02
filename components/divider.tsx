import { StyleSheet, View } from 'react-native';

const Divider = ({ spacing }: { spacing?: number }) => {
  return <View style={[styles.divider, { marginVertical: spacing ?? 0 }]} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: 'rgb(194, 194, 194)',
  },
});

export default Divider;

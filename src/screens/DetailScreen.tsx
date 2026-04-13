import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export function DetailScreen({ route }: Props) {
  const { movieId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detail</Text>
      <Text style={styles.label}>
        <Text style={styles.labelKey}>movieId</Text>
        {`: ${String(movieId)}`}
      </Text>
      <Text style={styles.hint}>Route param sanity check — no TMDB fetch in Task 6.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography['title-lg'],
    color: colors.on_surface,
  },
  label: {
    ...typography['body-md'],
    color: colors.on_surface,
  },
  labelKey: {
    ...typography['body-md'],
    fontWeight: '600',
    color: colors.primary,
  },
  hint: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
  },
});

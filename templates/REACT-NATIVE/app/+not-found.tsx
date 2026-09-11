import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/src/shared/components/layout/ScreenWrapper';
import { colors, radius, spacing, typography } from '@/src/shared/lib';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper style={s.container}>
      <View style={s.content}>
        <Text style={s.emoji}>🔍</Text>
        <Text style={s.title}>Pagina no encontrada</Text>
        <Text style={s.subtitle}>
          Lo sentimos, la pagina que buscas no existe o fue movida.
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={s.button}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={s.buttonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.body2,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
  },
  buttonText: {
    fontSize: typography.fontSize.body2,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primaryForeground,
  },
});

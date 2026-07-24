import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/src/shared/lib';

interface AvatarProps {
  initials: string;
  size?: number;
  bgGradient?: [string, string];
}

export function Avatar({ initials, size = 48, bgGradient }: AvatarProps) {
  const backgroundColor = bgGradient?.[0] ?? colors.primaryLight;
  const fontSize = size * 0.4;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}
    >
      <Text
        style={[
          styles.initials,
          { fontSize, lineHeight: fontSize * 1.2 },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.foreground,
    fontWeight: typography.fontWeight.semibold,
  },
});

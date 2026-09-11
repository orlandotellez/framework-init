import React from 'react';
import { StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Edge } from 'react-native-safe-area-context';
import { colors, spacing } from '../../lib';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  noPadding?: boolean;
  noTopSafe?: boolean;
}

export function ScreenWrapper({
  children,
  style,
  noPadding = false,
  noTopSafe = false,
}: ScreenWrapperProps) {
  const edges: Edge[] = noTopSafe
    ? ['bottom', 'left', 'right']
    : ['top', 'bottom', 'left', 'right'];

  return (
    <SafeAreaView
      style={[
        styles.container,
        !noPadding && styles.horizontalPadding,
        style,
      ]}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  horizontalPadding: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
});

import { TextStyle } from "react-native";

export const typography = {
  fontFamily: {
    display: undefined as string | undefined,
    body: undefined as string | undefined,
  },
  fontSize: {
    caption: 11,
    caption2: 12,
    body: 14,
    body2: 15,
    subtitle: 17,
    title: 22,
    title2: 26,
  },
  fontWeight: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
  },
} as const;

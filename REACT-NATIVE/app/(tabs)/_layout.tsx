import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';

type TabRoutes = "index" | "profile";

interface TabConfig {
  name: TabRoutes;
  title: string;
  icon: (color: string, size: number) => React.ReactNode;
}

const TABS: TabConfig[] = [
  {
    name: "index",
    title: "Inicio",
    icon: (color, size) => (
      <FontAwesome5 name="home" size={size} color={color} />
    ),
  },
  {
    name: "profile",
    title: "Perfil",
    icon: (color, size) => (
      <Feather name="user" size={size} color={color} />
    ),
  },
];

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarItemStyle: { marginTop: 6 },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => tab.icon(color, size),
          }}
        />
      ))}
    </Tabs>
  );
}

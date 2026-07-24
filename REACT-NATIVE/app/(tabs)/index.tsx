import { ScreenWrapper } from '@/src/shared/components/layout/ScreenWrapper';
import { Avatar } from '@/src/shared/components/ui/Avatar';
import { currentUser } from '@/src/shared/data/user';
import { colors, spacing, typography } from '@/src/shared/lib';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function HomeScreen() {
  return <>
    <ScreenWrapper style={style.screen}>
      <ScrollView>
        {/* Header: Greeting + Bell */}
        <View style={style.headerRow}>
          <View style={style.headerLeft}>
            <Avatar initials={currentUser.avatarInitials} size={48} />
            <View style={style.headerText}>
              <Text style={style.greeting}>
                Buenos dias, {currentUser.name.split(' ')[0]}
              </Text>
              <Text style={style.greetingSub}>Escucha a tu cuerpo hoy</Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.6}
            style={style.bellButton}
          >
            <FontAwesome5 name="bell" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  </>
}

const style = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.foreground,
  },
  greetingSub: {
    fontSize: typography.fontSize.body,
    fontStyle: 'italic',
    color: colors.textMuted,
    marginTop: 2,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  bellIcon: {
    fontSize: 18,
  },
});

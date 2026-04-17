import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { usePathname, useRouter } from 'expo-router';
import { type ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAuth } from '@/providers/auth-provider';

type NavItem = {
  href: string;
  label: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
};

const navItems: NavItem[] = [
  { href: '/(features)/(main)', label: 'Início', icon: 'house' },
  { href: '/(features)/(main)/practice', label: 'Praticar', icon: 'sports-esports' },
  { href: '/(features)/(main)/progress', label: 'Progresso', icon: 'bar-chart' },
  { href: '/(features)/(main)/community', label: 'Comunidade', icon: 'groups' },
];

export function DesktopSidebar({ onLogout = () => undefined }: { onLogout?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  function isActive(href: string) {
    if (href === '/(features)/(main)') return pathname === '/' || pathname === '/index';
    
    if (href === '/(features)/(main)/practice') {
      return pathname.startsWith('/practice') || 
             pathname.startsWith('/coding-practice') || 
             pathname.startsWith('/quiz') ||
             pathname.startsWith('/quick-response') ||
             pathname.startsWith('/datacenter-builder');
    }

    return pathname.startsWith(href.replace('/(features)/(main)', ''));
  }

  return (
    <View
      style={{
        width: 260,
        height: '100%',
        backgroundColor: '#0D0F10',
        borderRightWidth: 1,
        borderRightColor: '#1E2228',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        paddingVertical: 32,
        paddingHorizontal: 16,
      }}>
      {/* Logo */}
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/(features)/(main)' as never)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingHorizontal: 8,
          marginBottom: 40,
          opacity: pressed ? 0.8 : 1,
        })}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: '#3F51B5',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#3F51B5',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}>
          <MaterialIcons name="style" size={24} color="#FFFFFF" />
        </View>
        <Text style={{ color: '#ECEDEE', fontSize: 20, fontWeight: '800', letterSpacing: -0.5 }}>
          QMaster
        </Text>
      </Pressable>

      {/* Navigation */}
      <View style={{ gap: 6, flex: 1 }}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Pressable
              key={item.href}
              onPress={() => router.push(item.href as never)}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: active
                  ? 'rgba(63,81,181,0.12)'
                  : pressed
                    ? 'rgba(255,255,255,0.04)'
                    : 'transparent',
              })}>
              <MaterialIcons
                name={item.icon}
                size={22}
                color={active ? '#A5B4FC' : '#687076'}
              />
              <Text
                style={{
                  color: active ? '#ECEDEE' : '#9BA1A6',
                  fontSize: 15,
                  fontWeight: active ? '700' : '500',
                  letterSpacing: 0.2,
                }}>
                {item.label}
              </Text>
              {active && (
                <View 
                  style={{ 
                    position: 'absolute', 
                    left: -16, 
                    width: 4, 
                    height: 24, 
                    backgroundColor: '#3F51B5', 
                    borderTopRightRadius: 4, 
                    borderBottomRightRadius: 4 
                  }} 
                />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* User footer */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: '#1E2228',
          paddingTop: 24,
          gap: 16,
        }}>
        {user && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 8 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#3F51B5',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1, overflow: 'hidden' }}>
              <Text
                style={{ color: '#ECEDEE', fontSize: 14, fontWeight: '700' }}
                numberOfLines={1}>
                {user.name}
              </Text>
              <Text
                style={{ color: '#687076', fontSize: 12, fontWeight: '500' }}
                numberOfLines={1}>
                {user.email}
              </Text>
            </View>
          </View>
        )}

        <Pressable
          onPress={onLogout}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 12,
            backgroundColor: pressed ? 'rgba(239,68,68,0.08)' : 'transparent',
          })}>
          <MaterialIcons name="logout" size={20} color="#687076" />
          <Text style={{ color: '#687076', fontSize: 14, fontWeight: '600' }}>Sair da conta</Text>
        </Pressable>
      </View>
    </View>
  );
}

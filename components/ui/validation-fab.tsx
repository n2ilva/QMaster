import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

type ValidationFabProps = {
  onPress: () => void;
  disabled?: boolean;
  icon?: React.ComponentProps<typeof MaterialIcons>['name'];
  bottomInset?: number;
};

const FAB_SIZE = 58;

export function ValidationFab({
  onPress,
  disabled = false,
  icon = 'check',
  bottomInset = 0,
}: ValidationFabProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Validar exercício"
      style={({ pressed }) => [
        styles.fab,
        {
          bottom: 12 + bottomInset,
          opacity: disabled ? 0.45 : 1,
          transform: [{ scale: pressed ? 0.94 : 1 }],
        },
      ]}
    >
      <MaterialIcons name={icon} size={28} color="#FFFFFF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 9,
    zIndex: 50,
  },
});

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { Modal, Platform, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { TOKEN_CATEGORY_COLORS } from '../coding-practice.constants';
import { type SyntaxToken } from '../coding-practice.types';

type PuzzlePieceProps = {
  token: SyntaxToken;
  customLabel?: string;
  onPress?: () => void;
  onRename?: (newLabel: string) => void;
  showRemove?: boolean;
  onRemove?: () => void;
  used?: boolean;
  variant?: 'key' | 'answer';
};

export function PuzzlePiece({
  token,
  customLabel,
  onPress,
  onRename,
  showRemove = false,
  onRemove,
  used = false,
  variant = 'key',
}: PuzzlePieceProps) {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [draftLabel, setDraftLabel] = useState(customLabel ?? token.label);

  const colors = TOKEN_CATEGORY_COLORS[token.category] ?? TOKEN_CATEGORY_COLORS.symbol;
  const displayLabel = customLabel ?? token.label;
  const isKey = variant === 'key';

  function handleConfirmEdit() {
    const trimmed = draftLabel.trim();
    if (trimmed && onRename) onRename(trimmed);
    setEditModalVisible(false);
  }

  // Key style (keyboard look)
  if (isKey) {
    return (
      <>
        <TouchableOpacity
          onPress={used ? undefined : onPress}
          onLongPress={() => {
            if (token.editable && onRename) {
              setDraftLabel(customLabel ?? token.label);
              setEditModalVisible(true);
            }
          }}
          disabled={used}
          activeOpacity={0.6}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderRadius: 8,
            borderStyle: 'solid',
            backgroundColor: used ? 'transparent' : colors.bg,
            borderWidth: 1.5,
            borderColor: used ? '#1A1D21' : colors.border,
            borderBottomWidth: used ? 1.5 : 3,
            opacity: used ? 0.3 : 1,
            minWidth: 32,
            minHeight: 34,
            ...(Platform.OS === 'web' && !used && {
              cursor: 'pointer',
            } as any),
          }}
        >
          <Text
            style={{
              color: used ? '#4B5563' : colors.text,
              fontSize: 13,
              fontWeight: '700',
              fontFamily: 'monospace',
              letterSpacing: 0.1,
            }}
          >
            {displayLabel}
          </Text>
        </TouchableOpacity>
        {renderModal()}
      </>
    );
  }

  // Answer variant (inside the answer area)
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        onLongPress={() => {
          if (token.editable && onRename) {
            setDraftLabel(customLabel ?? token.label);
            setEditModalVisible(true);
          }
        }}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 8,
          borderStyle: 'solid',
          borderWidth: 1.5,
          borderBottomWidth: 3,
          backgroundColor: colors.bg,
          borderColor: colors.border,
          minHeight: 30,
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: 12,
            fontWeight:
              token.category === 'keyword' || token.category === 'modifier' ? '700' : '600',
            fontFamily: 'monospace',
            letterSpacing: 0.1,
          }}
        >
          {displayLabel}
        </Text>
      </TouchableOpacity>
      {renderModal()}
    </>
  );

  // Shared rename modal
  function renderModal() {
    return (
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setEditModalVisible(false)}
        >
          <Pressable
            onPress={() => undefined}
            style={{
              backgroundColor: '#1A1D21',
              borderRadius: 16,
              padding: 24,
              width: 300,
              borderWidth: 1,
              borderColor: '#2D3139',
            }}
          >
            <Text style={{ color: '#ECEDEE', fontWeight: '700', fontSize: 16, marginBottom: 4 }}>
              Renomear
            </Text>
            <Text style={{ color: '#687076', fontSize: 12, marginBottom: 14 }}>
              Edite o nome deste identificador:
            </Text>
            <TextInput
              value={draftLabel}
              onChangeText={setDraftLabel}
              autoFocus
              style={{
                backgroundColor: '#0D0F10',
                borderRadius: 10,
                borderWidth: 2,
                borderColor: colors.border,
                color: colors.text,
                fontFamily: 'monospace',
                fontSize: 15,
                paddingHorizontal: 14,
                paddingVertical: 10,
                marginBottom: 18,
              }}
              onSubmitEditing={handleConfirmEdit}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={() => setEditModalVisible(false)}
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: 11,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: '#2D3139',
                  alignItems: 'center',
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text style={{ color: '#9BA1A6', fontSize: 14 }}>Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleConfirmEdit}
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: 11,
                  borderRadius: 10,
                  backgroundColor: colors.border,
                  alignItems: 'center',
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>OK</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }
}

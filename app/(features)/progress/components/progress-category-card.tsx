import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View, useColorScheme } from 'react-native';

import { TRACK_STYLE_FALLBACK, trackStyles } from '@/constants/track-styles';
import { QUIZ_COLORS, QUIZ_RADII } from '@/constants/quiz-ui';
import { trackLabels } from '@/data/tracks';
import { formatDuration, type CategoryProgress } from '@/lib/api';

type ProgressCategoryCardProps = {
  categoryProgress: CategoryProgress;
};

export function ProgressCategoryCard({ categoryProgress }: ProgressCategoryCardProps) {
  const router = useRouter();
  const accuracy = categoryProgress.accuracyPercent;
  const accentColor = accuracy === 100 ? '#22C55E' : accuracy >= 80 ? '#10B981' : accuracy >= 50 ? '#F59E0B' : '#EF4444';
  const trackStyle = trackStyles[categoryProgress.track] ?? TRACK_STYLE_FALLBACK;
  const trackLabel = trackLabels[categoryProgress.track] ?? categoryProgress.track;

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const isHovered = hovered || pressed;

  const bg = isDark ? (isHovered ? '#22252A' : '#1C1F24') : (isHovered ? '#F8FAFC' : '#FFFFFF');
  const borderStatic = isDark ? '#30363D' : '#E2E8F0';
  const borderHover = isDark ? `${accentColor}50` : `${accentColor}40`;
  const textPrimary = isDark ? '#ECEDEE' : '#11181C';
  const textSecondary = isDark ? '#9BA1A6' : '#64748B';

  return (
    <Pressable
      onPress={() =>
        router.push(
          `/study?track=${encodeURIComponent(categoryProgress.track)}&category=${encodeURIComponent(categoryProgress.category)}`,
        )
      }
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        backgroundColor: bg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: isHovered ? borderHover : borderStatic,
        padding: 12, // Reduced padding
        shadowColor: isHovered ? accentColor : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isHovered ? 0.08 : 0.02,
        shadowRadius: 8,
        elevation: 2,
      }}>
      
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ backgroundColor: `${trackStyle.color}15`, borderRadius: 8, padding: 6 }}>
            <MaterialIcons name={trackStyle.icon} size={14} color={trackStyle.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: textSecondary, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 }} numberOfLines={1}>
              {trackLabel}
            </Text>
            <Text style={{ color: textPrimary, fontSize: 13, fontWeight: '800', marginTop: 1, letterSpacing: -0.2 }} numberOfLines={1}>
              {categoryProgress.category}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end', flexDirection: 'row', gap: 4 }}>
            <Text style={{ color: accentColor, fontSize: 16, fontWeight: '900' }}>
              {accuracy}%
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={16}
              color={hovered ? accentColor : textSecondary}
            />
          </View>
        </View>

        <View style={{ gap: 4 }}>
          <View style={{ height: 4, backgroundColor: isDark ? '#2D3139' : '#F1F5F9', borderRadius: 2, overflow: 'hidden' }}>
            <View style={{ height: '100%', borderRadius: 2, width: `${categoryProgress.studyPercent}%`, backgroundColor: accentColor }} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: textSecondary, fontSize: 10, fontWeight: '600' }}>
              {categoryProgress.studyPercent}% · {categoryProgress.uniqueQuestionsAnswered} qs
            </Text>
            <Text style={{ color: textSecondary, fontSize: 10, fontWeight: '600' }}>
              {formatDuration(categoryProgress.avgTimePerQuestionMs)}/q
            </Text>
          </View>
        </View>

        {(categoryProgress.hasInProgressLesson || accuracy < 50) && (
          <View style={{ 
            flexDirection: 'row', 
            gap: 6, 
            paddingTop: 4, 
            marginTop: 2,
            borderTopWidth: 1,
            borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
          }}>
            {categoryProgress.hasInProgressLesson && (
              <View style={{ backgroundColor: '#F59E0B15', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                <Text style={{ color: '#F59E0B', fontSize: 9, fontWeight: '800' }}>ANDAMENTO</Text>
              </View>
            )}
            {accuracy < 50 && (
              <View style={{ backgroundColor: '#EF444415', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                <Text style={{ color: '#EF4444', fontSize: 9, fontWeight: '800' }}>REVISAR</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

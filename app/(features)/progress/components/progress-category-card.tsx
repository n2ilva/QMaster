import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { InteractiveCard } from '@/components/quiz/interactive-card';
import { TRACK_STYLE_FALLBACK, trackStyles } from '@/constants/track-styles';
import { QUIZ_COLORS, QUIZ_RADII } from '@/constants/quiz-ui';
import { trackLabels } from '@/data/tracks';
import { formatDuration, type CategoryProgress } from '@/lib/api';

type ProgressCategoryCardProps = {
  categoryProgress: CategoryProgress;
};

const PROGRESS_CARD_MIN_HEIGHT = 162;
const PROGRESS_CARD_STATUS_AREA_HEIGHT = 34;

export function ProgressCategoryCard({ categoryProgress }: ProgressCategoryCardProps) {
  const router = useRouter();
  const accuracy = categoryProgress.accuracyPercent;
  const accentColor = accuracy === 100 ? '#22C55E' : accuracy >= 80 ? '#10B981' : accuracy >= 50 ? '#F59E0B' : '#EF4444';
  const trackStyle = trackStyles[categoryProgress.track] ?? TRACK_STYLE_FALLBACK;
  const trackLabel = trackLabels[categoryProgress.track] ?? categoryProgress.track;

  return (
    <InteractiveCard
      accentColor={QUIZ_COLORS.borderSubtle}
      hoverAccentColor={QUIZ_COLORS.borderSubtle}
      onPress={() =>
        router.push(
          `/study?track=${encodeURIComponent(categoryProgress.track)}&category=${encodeURIComponent(categoryProgress.category)}`,
        )
      }
      outerRadius={16}
      innerRadius={14}
      innerPadding={14}
      innerStyle={{ minHeight: PROGRESS_CARD_MIN_HEIGHT }}>
      {({ hovered }) => (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
            <View style={{ backgroundColor: `${trackStyle.color}22`, borderRadius: 9, padding: 7, marginTop: 1 }}>
              <MaterialIcons name={trackStyle.icon} size={14} color={trackStyle.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: QUIZ_COLORS.textFaint, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8 }} numberOfLines={1}>
                {trackLabel}
              </Text>
              <Text style={{ color: QUIZ_COLORS.textPrimary, fontSize: 13, fontWeight: '700', marginTop: 2, lineHeight: 18 }} numberOfLines={2}>
                {categoryProgress.category}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ color: accentColor, fontSize: 20, fontWeight: '800', lineHeight: 22 }}>
                  {accuracy}%
                </Text>
                <MaterialIcons
                  name={categoryProgress.hasInProgressLesson ? 'play-arrow' : 'chevron-right'}
                  size={20}
                  color={hovered ? QUIZ_COLORS.accentHover : QUIZ_COLORS.textFaint}
                />
              </View>
              <Text style={{ color: QUIZ_COLORS.textFaint, fontSize: 10, marginTop: 1 }}>
                {categoryProgress.hasInProgressLesson ? 'continuar' : 'acertos'}
              </Text>
            </View>
          </View>

          <View style={{ height: 5, backgroundColor: QUIZ_COLORS.surfaceAlt, borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
            <View style={{ height: '100%', borderRadius: 4, width: `${categoryProgress.studyPercent}%`, backgroundColor: accentColor, opacity: 0.65 }} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: QUIZ_COLORS.textFaint, fontSize: 11 }}>
              {categoryProgress.studyPercent}% estudado · {categoryProgress.uniqueQuestionsAnswered}{' '}
              {categoryProgress.uniqueQuestionsAnswered === 1 ? 'questão' : 'questões'}
            </Text>
            <Text style={{ color: QUIZ_COLORS.textFaint, fontSize: 11 }}>
              {formatDuration(categoryProgress.avgTimePerQuestionMs)}/q
            </Text>
          </View>

          <View style={{ flex: 1 }} />

          <View style={{ minHeight: PROGRESS_CARD_STATUS_AREA_HEIGHT, justifyContent: 'flex-end', gap: 8, paddingTop: 8 }}>
            {categoryProgress.hasInProgressLesson ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F59E0B22', borderWidth: 1, borderColor: '#F59E0B44', borderRadius: QUIZ_RADII.sm, paddingHorizontal: 8, paddingVertical: 5 }}>
                <MaterialIcons name="schedule" size={12} color={QUIZ_COLORS.warning} />
                <Text style={{ color: QUIZ_COLORS.warning, fontSize: 11, fontWeight: '600' }}>
                  Em andamento · {categoryProgress.inProgressAnswered}{' '}
                  {categoryProgress.inProgressAnswered === 1 ? 'resposta' : 'respostas'}
                </Text>
              </View>
            ) : null}

            {accuracy < 50 ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EF444422', borderWidth: 1, borderColor: '#EF444444', borderRadius: QUIZ_RADII.sm, paddingHorizontal: 8, paddingVertical: 5 }}>
                <MaterialIcons name="warning" size={12} color={QUIZ_COLORS.danger} />
                <Text style={{ color: QUIZ_COLORS.danger, fontSize: 11, fontWeight: '600' }}>
                  Taxa baixa — revise este tema
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      )}
    </InteractiveCard>
  );
}

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import { QuizStatCard } from '@/components/quiz/stat-card';
import { SCORE_LEVEL_EMOJIS } from '@/constants/score-levels';
import { QUIZ_COLORS } from '@/constants/quiz-ui';
import { useLayoutMode } from '@/hooks/use-layout-mode';
import { useScreenSize } from '@/hooks/use-screen-size';
import { useTabContentPadding, useTopContentPadding } from '@/hooks/use-tab-content-padding';
import { fetchUserProgress, getScoreLevel, resetUserProgress, type CategoryProgress, type ScoreLevel } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import { useData } from '@/providers/data-provider';

import { ProgressCategoryCard } from './components/progress-category-card';
import { ResetProgressButton } from './components/reset-progress-button';

export function ProgressScreen() {
  const bottomPadding = useTabContentPadding();
  const topPadding = useTopContentPadding();
  const { user } = useAuth();
  const { userProgress: cachedProgress, refreshUserProgress } = useData();
  const layoutMode = useLayoutMode();
  const { isDesktop } = useScreenSize();
  const { width: windowWidth } = useWindowDimensions();
  const categoryGridColumns = isDesktop ? (windowWidth >= 1500 ? 5 : 3) : 2;
  const categoryGridGap = 12;
  const categoryItemWidth = isDesktop
    ? (windowWidth - 344 - (categoryGridColumns - 1) * categoryGridGap) / categoryGridColumns
    : (windowWidth - 104 - (categoryGridColumns - 1) * categoryGridGap) / categoryGridColumns;

  const [loading, setLoading] = useState(!cachedProgress);
  const [resetting, setResetting] = useState(false);
  const [scoreLevel, setScoreLevel] = useState<ScoreLevel>(cachedProgress ? getScoreLevel(cachedProgress.totalScore) : 'Bronze');
  const [score, setScore] = useState(cachedProgress?.totalScore ?? 0);
  const [accuracy, setAccuracy] = useState(cachedProgress?.accuracyPercent ?? 0);
  const [totalLessons, setTotalLessons] = useState(cachedProgress?.totalLessons ?? 0);
  const [streak, setStreak] = useState(cachedProgress?.streak ?? 0);
  const [categories, setCategories] = useState<CategoryProgress[]>(cachedProgress?.categories ?? []);
  const isFirstLoad = useRef(true);

  const loadProgress = useCallback(async () => {
    if (!user) return;
    if (isFirstLoad.current && cachedProgress) {
      isFirstLoad.current = false;
      return;
    }

    isFirstLoad.current = false;

    try {
      setLoading(true);
      const data = await fetchUserProgress(user.id);
      setAccuracy(data.accuracyPercent);
      setTotalLessons(data.totalLessons);
      setStreak(data.streak);
      setCategories(data.categories);
      setScore(data.totalScore);
      setScoreLevel(getScoreLevel(data.totalScore));
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [user, cachedProgress]);

  useFocusEffect(
    useCallback(() => {
      void loadProgress();
    }, [loadProgress]),
  );

  const handleReset = useCallback(() => {
    if (!user) return;

    const doReset = async () => {
      try {
        setResetting(true);
        await resetUserProgress(user.id);
        await refreshUserProgress();
        void loadProgress();

        if (Platform.OS === 'web') {
          alert('Progresso resetado com sucesso!');
        } else {
          Alert.alert('Sucesso', 'Progresso resetado com sucesso!');
        }
      } catch (error) {
        console.error('Reset error:', error);
        if (Platform.OS === 'web') {
          alert('Falha ao resetar progresso. Tente novamente.');
        } else {
          Alert.alert('Erro', 'Falha ao resetar progresso. Tente novamente.');
        }
      } finally {
        setResetting(false);
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Tem certeza? Todas as suas lições completadas e em andamento serão deletadas permanentemente.');
      if (confirmed) void doReset();
      return;
    }

    Alert.alert(
      'Resetar progresso',
      'Tem certeza? Todas as suas lições completadas e em andamento serão deletadas permanentemente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Resetar', style: 'destructive', onPress: () => void doReset() },
      ],
    );
  }, [user, loadProgress, refreshUserProgress]);

  if (layoutMode === 'desktop') {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: '#111316' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 36, paddingTop: 36, paddingBottom: bottomPadding + 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#ECEDEE', fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }}>Sua evolução</Text>
            <Text style={{ color: '#687076', fontSize: 14, marginTop: 6 }}>Acompanhe seu desempenho e identifique onde melhorar.</Text>
          </View>
          {totalLessons > 0 && <ResetProgressButton onPress={handleReset} resetting={resetting} compact />}
        </View>

        {loading ? (
          <View style={{ alignItems: 'center', marginTop: 80 }}>
            <ActivityIndicator size="large" color="#818CF8" />
          </View>
        ) : (
          <>
            <View style={{ flexDirection: 'row', gap: 14, marginBottom: 32, flexWrap: 'nowrap' }}>
              <QuizStatCard label="Lições" value={totalLessons} subtitle="Lições concluídas" icon="school" accentColor={QUIZ_COLORS.primarySoft} backgroundColor={QUIZ_COLORS.surfaceStrong} borderColor={QUIZ_COLORS.borderSubtle} valueColor={QUIZ_COLORS.textPrimary} subtitleColor={QUIZ_COLORS.textFaint} style={{ flex: 1, padding: 22 }} />
              <QuizStatCard label="Acerto" value={`${accuracy}%`} subtitle="Média de acertos" icon={accuracy >= 80 ? 'check-circle' : 'trending-down'} accentColor={accuracy >= 80 ? QUIZ_COLORS.success : QUIZ_COLORS.danger} backgroundColor={QUIZ_COLORS.surfaceStrong} borderColor={QUIZ_COLORS.borderSubtle} valueColor={accuracy >= 80 ? QUIZ_COLORS.textPrimary : QUIZ_COLORS.danger} subtitleColor={accuracy >= 80 ? QUIZ_COLORS.textFaint : QUIZ_COLORS.danger} style={{ flex: 1, padding: 22 }} />
              <QuizStatCard label="Pontuação" value={score} subtitle="Pontos totais" emoji={SCORE_LEVEL_EMOJIS[scoreLevel]} accentColor={QUIZ_COLORS.primarySoft} backgroundColor={QUIZ_COLORS.surfaceStrong} borderColor={QUIZ_COLORS.borderSubtle} valueColor={QUIZ_COLORS.textPrimary} subtitleColor={QUIZ_COLORS.textFaint} style={{ flex: 1, padding: 22 }} />
              <QuizStatCard label="Sequência" value={streak} subtitle={streak === 1 ? 'Dia consecutivo' : 'Dias consecutivos'} emoji="🔥" accentColor={QUIZ_COLORS.warning} backgroundColor={QUIZ_COLORS.surfaceStrong} borderColor={QUIZ_COLORS.borderSubtle} valueColor={streak > 0 ? '#FBBF24' : '#4B5563'} subtitleColor={QUIZ_COLORS.textFaint} style={{ flex: 1, padding: 22 }} />
            </View>

            <View style={{ backgroundColor: QUIZ_COLORS.surfaceStrong, borderRadius: 18, borderWidth: 1, borderColor: QUIZ_COLORS.borderSubtle }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 16 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(34,197,94,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name="trending-up" size={18} color="#22C55E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: QUIZ_COLORS.textPrimary, fontSize: 16, fontWeight: '700' }}>Progresso por tema</Text>
                  <Text style={{ color: QUIZ_COLORS.textFaint, fontSize: 12 }}>Histórico de categorias estudadas</Text>
                </View>
                {categories.length > 0 && (
                  <View style={{ backgroundColor: 'rgba(34,197,94,0.15)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ color: QUIZ_COLORS.success, fontSize: 11, fontWeight: '700' }}>{categories.length}</Text>
                  </View>
                )}
              </View>
              <View style={{ height: 1, backgroundColor: QUIZ_COLORS.borderSubtle }} />

              {categories.length === 0 ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <MaterialIcons name="book" size={32} color="#4B5563" />
                  <Text style={{ color: QUIZ_COLORS.textFaint, fontSize: 14, marginTop: 10 }}>Nenhuma lição concluída ainda.</Text>
                </View>
              ) : (
                <ScrollView style={{ maxHeight: 500 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
                  <View style={{ padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: categoryGridGap, alignContent: 'flex-start', justifyContent: 'center' }}>
                    {[...categories].sort((a, b) => b.lastStudiedAt - a.lastStudiedAt).map((category) => (
                      <View key={`${category.track}__${category.category}`} style={{ width: categoryItemWidth }}>
                        <ProgressCategoryCard categoryProgress={category} />
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>
          </>
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-5 dark:bg-[#151718]"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding }}>
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-[#11181C] dark:text-[#ECEDEE]">Sua evolução</Text>
        {totalLessons > 0 && <ResetProgressButton onPress={handleReset} resetting={resetting} compact />}
      </View>
      <Text className="mt-2 text-[#687076] dark:text-[#9BA1A6]">Veja seu avanço por tema.</Text>

      {loading ? (
        <View className="mt-20 items-center">
          <ActivityIndicator size="large" color="#3F51B5" />
        </View>
      ) : (
        <>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
            <QuizStatCard label="Resumo geral" value={totalLessons} subtitle={`${totalLessons === 1 ? 'lição concluída' : 'lições concluídas'} · ${accuracy}% de acerto`} accentColor="#FFFFFF" backgroundColor={QUIZ_COLORS.primary} borderColor={QUIZ_COLORS.borderSubtle} valueColor="#FFFFFF" labelColor="rgba(255,255,255,0.8)" subtitleColor="rgba(255,255,255,0.7)" style={{ flex: 1 }} size="compact" align="center" />
            <QuizStatCard label="Medalha" value={scoreLevel} subtitle={`${score} pontos`} emoji={SCORE_LEVEL_EMOJIS[scoreLevel]} accentColor={QUIZ_COLORS.primary} backgroundColor="rgba(63,81,181,0.05)" borderColor={QUIZ_COLORS.borderSubtle} valueColor={QUIZ_COLORS.primary} subtitleColor={QUIZ_COLORS.textMuted} style={{ flex: 1 }} align="center" size="compact" />
          </View>

          {streak > 0 && (
            <View className="mt-3 flex-row items-center gap-3 rounded-2xl bg-[#F59E0B]/10 p-4">
              <Text className="text-3xl">🔥</Text>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-[#D97706] dark:text-[#FBBF24]">
                  {streak} {streak === 1 ? 'dia' : 'dias'} consecutivos
                </Text>
                <Text className="mt-0.5 text-xs text-[#B45309] dark:text-[#FCD34D]">Continue estudando para manter sua sequência!</Text>
              </View>
            </View>
          )}

          <View className="mt-5 overflow-hidden rounded-2xl border border-[#E6E8EB] dark:border-[#30363D]">
            <View style={{ backgroundColor: 'rgba(34,197,94,0.08)' }} className="flex-row items-center gap-3 px-4 py-3">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-[#22C55E]/15">
                <MaterialIcons name="trending-up" size={20} color="#22C55E" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-[#22C55E]">Progresso por tema</Text>
                <Text className="text-[11px] text-[#687076] dark:text-[#9BA1A6]">Acompanhe sua evolução em cada categoria</Text>
              </View>
              {categories.length > 0 && (
                <View className="rounded-full bg-[#22C55E]/15 px-2 py-0.5">
                  <Text className="text-[10px] font-bold text-[#22C55E]">{categories.length}</Text>
                </View>
              )}
            </View>

            {categories.length === 0 ? (
              <View className="p-3">
                <Text className="py-2 text-center text-[#687076] dark:text-[#9BA1A6]">Conclua lições para exibir progresso.</Text>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false} nestedScrollEnabled contentContainerStyle={{ padding: 12 }}>
                {categories.map((category, index) => (
                  <View key={`${category.track}__${category.category}`}>
                    {index > 0 && <View className="my-2 h-px bg-[#E6E8EB] dark:bg-[#30363D]" />}
                    <ProgressCategoryCard categoryProgress={category} />
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { DesktopSidebar } from '@/components/desktop-sidebar';
import { QUIZ_COLORS, QUIZ_RADII } from '@/constants/quiz-ui';
import { getCategoryTags } from '@/data/cards/category-tags';
import { CATEGORY_TYPE_LABEL } from '@/data/tracks';
import { useLayoutMode } from '@/hooks/use-layout-mode';
import { fetchCategoryStats, getCategoriesForTrack, resolveTrackLabel, type CategoryStats } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';

import { MasterTestButton } from './components/master-test-button';
import { ReadyCategoryCard } from './components/ready-category-card';

export function ReadyTrackCategoriesScreen() {
  const { track: encodedTrack } = useLocalSearchParams<{ track: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const layoutMode = useLayoutMode();
  const track = useMemo(() => decodeURIComponent(encodedTrack ?? ''), [encodedTrack]);
  const label = resolveTrackLabel(track);

  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [statsMap, setStatsMap] = useState<Record<string, CategoryStats>>({});
  const [loadingStats, setLoadingStats] = useState(true);

  const loadCategories = useCallback(async () => {
    if (!track) {
      setCategories([]);
      setLoadingCategories(false);
      return;
    }

    try {
      setLoadingCategories(true);
      const data = await getCategoriesForTrack(track);
      setCategories(data);
    } catch {
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, [track]);

  useFocusEffect(
    useCallback(() => {
      void loadCategories();
    }, [loadCategories]),
  );

  const loadStats = useCallback(async () => {
    if (!user || !track || categories.length === 0) {
      setLoadingStats(false);
      return;
    }

    try {
      setLoadingStats(true);
      const results = await Promise.all(categories.map(async (category) => [category, await fetchCategoryStats(user.id, track, category)] as const));
      setStatsMap(Object.fromEntries(results));
    } catch {
      // silently fail
    } finally {
      setLoadingStats(false);
    }
  }, [categories, user, track]);

  useFocusEffect(
    useCallback(() => {
      void loadStats();
    }, [loadStats]),
  );

  const fuseItems = useMemo(
    () => categories.map((category) => ({ cat: category, name: category, typeLabel: CATEGORY_TYPE_LABEL[category] ?? '', tags: getCategoryTags(track, category).join(' ') })),
    [categories, track],
  );

  const fuse = useMemo(
    () =>
      new Fuse(fuseItems, {
        keys: ['name', 'typeLabel', 'tags'],
        threshold: 0.35,
        includeMatches: true,
      }),
    [fuseItems],
  );

  const filtered = useMemo(() => {
    const term = searchTerm.trim();
    const list = term ? fuse.search(term).map((result) => result.item.cat) : [...categories];
    return list.sort((a, b) => (statsMap[b]?.totalAnswered ?? 0) - (statsMap[a]?.totalAnswered ?? 0));
  }, [categories, searchTerm, fuse, statsMap]);

  if (layoutMode === 'desktop') {
    return (
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: QUIZ_COLORS.surfaceStrong }}>
        <DesktopSidebar />
        <ScrollView style={{ flex: 1, backgroundColor: QUIZ_COLORS.surfaceBase }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 32, paddingTop: 32, paddingBottom: 48 }}>
          <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24, alignSelf: 'flex-start' }}>
            <MaterialIcons name="arrow-back" size={18} color={QUIZ_COLORS.textFaint} />
            <Text style={{ color: QUIZ_COLORS.textFaint, fontSize: 14 }}>Voltar para Temas</Text>
          </Pressable>

          <View style={{ marginBottom: 28 }}>
            <Text style={{ color: QUIZ_COLORS.textPrimary, fontSize: 28, fontWeight: '700' }}>{label}</Text>
            <Text style={{ color: QUIZ_COLORS.textFaint, fontSize: 14, marginTop: 6 }}>{categories.length} categorias disponíveis para estudo.</Text>
          </View>

          <View style={{ width: '100%', maxWidth: 1040, alignSelf: 'center' }}>
            <View style={{ marginBottom: 12 }}>
              <MasterTestButton track={track ?? ''} />
            </View>

            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Pesquisar categoria..."
              placeholderTextColor="#4B5563"
              autoCapitalize="none"
              autoCorrect={false}
              style={{ marginBottom: 24, backgroundColor: QUIZ_COLORS.surfaceStrong, borderWidth: 1, borderColor: QUIZ_COLORS.borderSubtle, borderRadius: QUIZ_RADII.md, paddingHorizontal: 16, paddingVertical: 12, color: QUIZ_COLORS.textPrimary, fontSize: 14 }}
            />

            {loadingCategories || loadingStats ? (
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <ActivityIndicator size="large" color={QUIZ_COLORS.accentHover} />
              </View>
            ) : filtered.length === 0 ? (
              <Text style={{ color: QUIZ_COLORS.textFaint }}>Nenhuma categoria encontrada.</Text>
            ) : (
              <View style={{ flexDirection: 'row', gap: 16 }}>
                {[filtered.filter((_, index) => index % 2 === 0), filtered.filter((_, index) => index % 2 !== 0)].map((column, columnIndex) => (
                  <View key={columnIndex} style={{ flex: 1, gap: 12 }}>
                    {column.map((category) => (
                      <ReadyCategoryCard key={category} category={category} track={track ?? ''} stats={statsMap[category]} />
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-5 pt-14 dark:bg-[#151718]" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <Text className="text-2xl font-bold text-[#11181C] dark:text-[#ECEDEE]">{label}</Text>
      <Text className="mt-2 text-[#687076] dark:text-[#9BA1A6]">{categories.length} categorias disponíveis para estudo.</Text>

      <View style={{ marginTop: 16, marginBottom: 12 }}>
        <MasterTestButton track={track ?? ''} style={{ width: '100%' }} />
      </View>

      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Pesquisar categoria..."
        placeholderTextColor="#9BA1A6"
        autoCapitalize="none"
        autoCorrect={false}
        style={{ borderRadius: 12, borderWidth: 1, borderColor: '#30363D', backgroundColor: '#1C1F24', paddingHorizontal: 12, paddingVertical: 8, color: '#ECEDEE', fontSize: 14, marginBottom: 8 }}
      />

      {loadingCategories || loadingStats ? (
        <View className="mt-10 items-center">
          <ActivityIndicator size="large" color="#3F51B5" />
        </View>
      ) : (
        <View className="mt-5 gap-3 md:flex-row md:flex-wrap">
          {filtered.length === 0 ? (
            <Text className="text-[#687076] dark:text-[#9BA1A6]">Nenhuma categoria encontrada.</Text>
          ) : (
            filtered.map((category) => <ReadyCategoryCard key={category} category={category} track={track ?? ''} stats={statsMap[category]} />)
          )}
        </View>
      )}
    </ScrollView>
  );
}

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import { useCallback, useMemo, useRef, useState, type ComponentProps } from 'react';
import { ActivityIndicator, Animated, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { DesktopSidebar } from '@/components/desktop-sidebar';
import { getCategoryTags } from '@/data/cards/category-tags';
import { hasDocumentation } from '@/data/documentation';
import { CATEGORY_TYPE_LABEL } from '@/data/tracks';
import { useScreenSize } from '@/hooks/use-screen-size';
import {
    fetchCategoryStats,
    getCategoriesForTrack,
    resolveTrackLabel,
    type CategoryStats,
} from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';

function CategoryCard({
  cat,
  track,
  stats,
}: {
  cat: string;
  track: string;
  stats: CategoryStats | undefined;
}) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const docsScaleAnim = useRef(new Animated.Value(1)).current;
  const uniqueStudied = stats?.uniqueStudied ?? 0;
  const totalCards = stats?.totalCards ?? 0;
  const uniqueCorrect = stats?.uniqueCorrect ?? 0;
  const accuracy = stats?.accuracyPercent ?? 0;
  const dueForReview = stats?.dueForReview ?? 0;
  const hasInProgress = stats?.hasInProgressLesson ?? false;

  const accentColor =
    uniqueStudied === 0
      ? '#6B7280'
      : accuracy >= 80
        ? '#22C55E'
        : accuracy >= 50
          ? '#F59E0B'
          : '#EF4444';

  const buttonIcon: ComponentProps<typeof MaterialIcons>['name'] = hasInProgress ? 'play-arrow' : uniqueStudied > 0 ? 'replay' : 'play-arrow';

  const hasDocs = hasDocumentation(track, cat);

  return (
    <Pressable
      onPress={() => router.push(`/ready/study?track=${encodeURIComponent(track)}&category=${encodeURIComponent(cat)}`)}
      onHoverIn={() => Animated.spring(scaleAnim, { toValue: 1.03, useNativeDriver: true, tension: 300, friction: 10 }).start()}
      onHoverOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }).start()}
    >
      {({ hovered }) => (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View 
            style={{ 
              backgroundColor: hovered ? '#818CF8' : accentColor, 
              borderRadius: 14, 
              padding: 2, 
              overflow: 'hidden',
              ...(Platform.OS === 'web' && {
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }),
            }}>
            <View 
              style={{ 
                backgroundColor: hovered ? '#1A1D24' : '#111316', 
                borderRadius: 12, 
                padding: 16,
                ...(Platform.OS === 'web' && {
                  transition: 'background-color 0.2s ease',
                }),
              }}>
              {/* Header with title and docs button */}
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: CATEGORY_TYPE_LABEL[cat] ? 4 : 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: hovered ? '#FFFFFF' : '#ECEDEE', fontSize: 15, fontWeight: '700' }}>{cat}</Text>
                </View>
                {dueForReview > 0 && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F59E0B', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <MaterialIcons name="schedule" size={11} color="#1A1000" />
                    <Text style={{ color: '#1A1000', fontSize: 10, fontWeight: '700' }}>{dueForReview} p/ revisar</Text>
                  </View>
                )}
                {hasDocs && (
                  <Pressable
                    onPress={(e) => { e.stopPropagation(); router.push(`/ready/theme-info?track=${encodeURIComponent(track)}&category=${encodeURIComponent(cat)}`); }}
                    onHoverIn={() => Animated.spring(docsScaleAnim, { toValue: 1.1, useNativeDriver: true, tension: 400, friction: 8 }).start()}
                    onHoverOut={() => Animated.spring(docsScaleAnim, { toValue: 1, useNativeDriver: true, tension: 400, friction: 8 }).start()}
                  >
                    {({ hovered: docsHovered }) => (
                      <Animated.View style={{ transform: [{ scale: docsScaleAnim }], zIndex: 10 }}>
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 4,
                          backgroundColor: docsHovered ? '#14B8A6' : '#6366F1',
                          borderRadius: 8,
                          paddingVertical: 6,
                          paddingHorizontal: 12,
                          ...(Platform.OS === 'web' && { transition: 'all 0.2s ease' }),
                        }}>
                          <MaterialIcons name="auto-stories" size={14} color="#FFFFFF" />
                          <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Docs</Text>
                        </View>
                      </Animated.View>
                    )}
                  </Pressable>
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <MaterialIcons 
                    name={buttonIcon} 
                    size={18} 
                    color={hovered ? '#818CF8' : '#6B7280'} 
                  />
                </View>
              </View>
              {CATEGORY_TYPE_LABEL[cat] && (
                <Text style={{ color: '#6B7280', fontSize: 11, marginBottom: 10 }}>{CATEGORY_TYPE_LABEL[cat]}</Text>
              )}

              {/* Stats row */}
              <View style={{ flexDirection: 'row', gap: 16, marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <MaterialIcons name="check-circle" size={13} color={hovered ? '#818CF8' : accentColor} />
                  <Text style={{ color: '#9BA1A6', fontSize: 12 }}>Acertos: </Text>
                  <Text style={{ color: '#ECEDEE', fontSize: 12, fontWeight: '700' }}>
                    {uniqueStudied > 0 ? `${uniqueCorrect}/${uniqueStudied} (${accuracy}%)` : '0/0 (0%)'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <MaterialIcons name="style" size={13} color="#6B7280" />
                  <Text style={{ color: '#9BA1A6', fontSize: 12 }}>Cards: </Text>
                  <Text style={{ color: '#ECEDEE', fontSize: 12, fontWeight: '700' }}>
                    {`${Math.min(uniqueStudied, totalCards)}/${totalCards}`}
                  </Text>
                </View>
              </View>

              {/* Accuracy bar */}
              <View style={{ height: 4, backgroundColor: '#1E2328', borderRadius: 4, overflow: 'hidden' }}>
                <View
                  style={{
                    height: '100%',
                    borderRadius: 4,
                    width: `${uniqueStudied > 0 ? accuracy : 0}%`,
                    backgroundColor: accentColor,
                  }}
                />
              </View>
            </View>
          </View>
        </Animated.View>
      )}
    </Pressable>
  );
}

function MasterTestButton({ track, style }: { track: string; style?: object }) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPress={() => router.push(`/ready/study?track=${encodeURIComponent(track)}&mode=master-test`)}
      onHoverIn={() => {
        Animated.spring(scaleAnim, { toValue: 1.02, useNativeDriver: true, tension: 300, friction: 10 }).start();
      }}
      onHoverOut={() => {
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }).start();
      }}
      style={style}
    >
      {({ hovered, pressed }) => (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View
            style={{
              borderRadius: 14,
              borderWidth: 2,
              borderColor: hovered ? '#FFD700' : '#D4A437',
              backgroundColor: pressed ? '#2A2000' : hovered ? '#1F1800' : '#151000',
              paddingVertical: 14,
              paddingHorizontal: 18,
              overflow: 'hidden',
              ...(Platform.OS === 'web' && {
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }),
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ 
                backgroundColor: hovered ? 'rgba(255, 215, 0, 0.25)' : 'rgba(255, 215, 0, 0.15)', 
                borderRadius: 10, 
                padding: 8,
                ...(Platform.OS === 'web' && { transition: 'background-color 0.2s ease' }),
              }}>
                <MaterialIcons name="emoji-events" size={24} color="#FFD700" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#FFD700', fontWeight: '800', fontSize: 15, letterSpacing: 1.5 }}>
                  TESTE MASTER
                </Text>
                <Text style={{
                  color: hovered ? '#FFD700' : '#B8860B',
                  fontSize: 11,
                  marginTop: 2,
                  fontWeight: '500',
                  ...(Platform.OS === 'web' && { transition: 'color 0.2s ease' }),
                }}>
                  20 questões aleatórias do tema
                </Text>
              </View>
              <MaterialIcons name="arrow-forward" size={20} color={hovered ? '#FFD700' : '#D4A437'} />
            </View>
          </View>
        </Animated.View>
      )}
    </Pressable>
  );
}

export default function ReadyTrackCategoriesScreen() {
  const { track: encodedTrack } = useLocalSearchParams<{ track: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const { isDesktop, isTablet, isMobile } = useScreenSize();
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
      const results = await Promise.all(
        categories.map(async (cat) => {
          const stats = await fetchCategoryStats(user.id, track, cat);
          return [cat, stats] as const;
        }),
      );
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
    () =>
      categories.map((cat) => ({
        cat,
        name: cat,
        typeLabel: CATEGORY_TYPE_LABEL[cat] ?? '',
        tags: getCategoryTags(track, cat).join(' '),
      })),
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
    const list = term
      ? fuse.search(term).map((r) => r.item.cat)
      : [...categories];
    return list.sort((a, b) => {
      const aStudied = statsMap[a]?.totalAnswered ?? 0;
      const bStudied = statsMap[b]?.totalAnswered ?? 0;
      return bStudied - aStudied;
    });
  }, [categories, searchTerm, fuse, statsMap]);

  if (isDesktop || isTablet) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#0D0F10' }}>
        {(isDesktop || isTablet) && <DesktopSidebar />}

        {/* Conteúdo principal */}
        <ScrollView
          style={{ flex: 1, backgroundColor: '#111316' }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 32,
            paddingTop: 32,
            paddingBottom: 48,
          }}>

          {/* Breadcrumb / voltar */}
          <Pressable
            onPress={() => router.back()}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24, alignSelf: 'flex-start' }}>
            <MaterialIcons name="arrow-back" size={18} color="#687076" />
            <Text style={{ color: '#687076', fontSize: 14 }}>Voltar para Temas</Text>
          </Pressable>

          {/* Header */}
          <View style={{ marginBottom: 28 }}>
            <Text style={{ color: '#ECEDEE', fontSize: 28, fontWeight: '700' }}>{label}</Text>
            <Text style={{ color: '#687076', fontSize: 14, marginTop: 6 }}>
              {categories.length} categorias disponíveis para estudo.
            </Text>
          </View>

          {/* Teste Master */}
          <View style={{ marginBottom: 12 }}>
            <MasterTestButton track={track ?? ''} />
          </View>

          {/* Busca */}
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Pesquisar categoria..."
            placeholderTextColor="#4B5563"
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              marginBottom: 24,
              backgroundColor: '#0D0F10',
              borderWidth: 1,
              borderColor: '#1E2328',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              color: '#ECEDEE',
              fontSize: 14,
            }}
          />

          {/* Grid de categorias */}
          {loadingCategories || loadingStats ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <ActivityIndicator size="large" color="#818CF8" />
            </View>
          ) : filtered.length === 0 ? (
            <Text style={{ color: '#6B7280' }}>Nenhuma categoria encontrada.</Text>
          ) : (
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {[filtered.filter((_, i) => i % 2 === 0), filtered.filter((_, i) => i % 2 !== 0)].map(
                (col, colIdx) => (
                  <View key={colIdx} style={{ flex: 1, gap: 12 }}>
                    {col.map((cat) => (
                      <CategoryCard key={cat} cat={cat} track={track ?? ''} stats={statsMap[cat]} />
                    ))}
                  </View>
                )
              )}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-5 pt-14 dark:bg-[#151718]"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}>
      <Text className="text-2xl font-bold text-[#11181C] dark:text-[#ECEDEE]">{label}</Text>
      <Text className="mt-2 text-[#687076] dark:text-[#9BA1A6]">
        {categories.length} categorias disponíveis para estudo.
      </Text>

      {/* Teste Master */}
      <View style={{ marginTop: 16, marginBottom: 12 }}>
        <MasterTestButton track={track ?? ''} style={{ width: '100%' }} />
      </View>

      {/* Busca */}
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Pesquisar categoria..."
        placeholderTextColor="#9BA1A6"
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#30363D',
          backgroundColor: '#1C1F24',
          paddingHorizontal: 12,
          paddingVertical: 8,
          color: '#ECEDEE',
          fontSize: 14,
          marginBottom: 8,
        }}
      />

      {loadingCategories || loadingStats ? (
        <View className="mt-10 items-center">
          <ActivityIndicator size="large" color="#3F51B5" />
        </View>
      ) : (
        <View className="mt-5 gap-3 md:flex-row md:flex-wrap">
          {filtered.length === 0 ? (
            <Text className="text-[#687076] dark:text-[#9BA1A6]">
              Nenhuma categoria encontrada.
            </Text>
          ) : (
            filtered.map((cat) => (
              <CategoryCard key={cat} cat={cat} track={track ?? ''} stats={statsMap[cat]} />
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}


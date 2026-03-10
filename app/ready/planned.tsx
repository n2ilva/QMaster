import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View, type ScrollView as ScrollViewType } from 'react-native';

import { TRACK_STYLE_FALLBACK, trackStyles } from '@/constants/track-styles';
import {
  getStudyPlan,
  LANGUAGE_GROUPS,
  STUDY_LEVEL_DESCRIPTIONS,
  STUDY_LEVELS,
  type StudyLevel
} from '@/data/study-plans';
import { useStudyPlans } from '@/hooks/use-last-study-plan';
import { useScreenSize } from '@/hooks/use-screen-size';
import { useAuth } from '@/providers/auth-provider';
import { useData } from '@/providers/data-provider';

type Step = 1 | 2 | 3 | 4;

// ─── Rótulo de tipo por categoria ───────────────────────────────────────────
const CATEGORY_TYPE_LABEL: Record<string, string> = {
  // Linguagens
  'TypeScript': 'Linguagem de Programação',
  'JavaScript': 'Linguagem de Programação',
  'Python': 'Linguagem de Programação',
  'Java': 'Linguagem de Programação',
  'C': 'Linguagem de Programação',
  'C++': 'Linguagem de Programação',
  'C#': 'Linguagem de Programação',
  'Dart': 'Linguagem de Programação',
  'Go': 'Linguagem de Programação',
  'Kotlin': 'Linguagem de Programação',
  'PHP': 'Linguagem de Programação',
  'Rust': 'Linguagem de Programação',
  'Swift': 'Linguagem de Programação',
  'Shell/Bash': 'Linguagem de Script',
  'SQL': 'Linguagem de Consulta',
  // Frameworks / Bibliotecas
  'Angular': 'Framework',
  'React e React Native': 'Biblioteca / Framework',
  'Next.js': 'Framework React',
  'Vue.js': 'Framework',
  'Django': 'Framework Python',
  'Flutter': 'Framework Mobile',
  'Laravel': 'Framework PHP',
  'Spring Boot': 'Framework Java',
  // Cloud
  'AWS — Fundamentos': 'Amazon Web Services',
  'AWS — Serviços Avançados': 'Amazon Web Services',
  'Azure — Fundamentos': 'Microsoft Azure',
  'Azure — Serviços Avançados': 'Microsoft Azure',
  'Google Cloud Platform': 'Google Cloud',
  'Containers e Kubernetes': 'Contêinerização',
  'DevOps e CI/CD': 'Práticas DevOps',
  'Infrastructure as Code': 'Automação de Infraestrutura',
  'Serverless e Functions': 'Arquitetura Serverless',
  // Engenharia de Software
  'Git e Versionamento': 'Ferramenta de Controle',
  'Design Patterns': 'Padrões de Projeto',
  'Clean Code e Boas Práticas': 'Boas Práticas',
  'Programação Orientada a Objetos': 'Paradigma de Programação',
  'Banco de Dados SQL': 'Banco de Dados',
  'Banco de Dados NoSQL': 'Banco de Dados',
  'APIs REST e GraphQL': 'Integração de APIs',
  'Docker e Containers': 'Contêinerização',
  'Mensageria e Filas': 'Arquitetura',
  'Autenticação e Autorização': 'Segurança',
  'Segurança no Desenvolvimento': 'Segurança',
  'System Design': 'Arquitetura de Sistemas',
  'Arquitetura de Software': 'Arquitetura',
  'Testes de Software': 'Qualidade de Software',
  'Metodologias Ágeis': 'Gestão de Projetos',
  'Algoritmos e Estruturas de Dados': 'Fundamentos',
  // ML & IA
  'Deep Learning e Redes Neurais': 'Deep Learning',
  'IA Generativa e LLMs': 'Inteligência Artificial',
  'MLOps e Deploy de Modelos': 'Operações de ML',
  'Aprendizado Não Supervisionado': 'Machine Learning',
  'Algoritmos de Classificação': 'Machine Learning',
  'Algoritmos de Regressão': 'Machine Learning',
  'Processamento de Linguagem Natural': 'NLP',
  'Visão Computacional': 'Computer Vision',
  'Estatística para ML': 'Estatística',
  'Pré-processamento de Dados': 'Engenharia de Dados',
};

// ─── Step indicator ──────────────────────────────────────────────────────────
function StepIndicator({ current, labels }: { current: Step; labels: string[] }) {
  const steps = labels.map((label, i) => ({ n: (i + 1) as Step, label }));

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
      {steps.map((s, idx) => {
        const done = current > s.n;
        const active = current === s.n;
        return (
          <View key={s.n} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: done ? '#22C55E' : active ? '#3F51B5' : '#1E2328',
                  borderWidth: done || active ? 0 : 1,
                  borderColor: '#30363D',
                }}>
                {done ? (
                  <MaterialIcons name="check" size={16} color="#fff" />
                ) : (
                  <Text style={{ color: active ? '#fff' : '#6B7280', fontSize: 13, fontWeight: '700' }}>
                    {s.n}
                  </Text>
                )}
              </View>
              <Text style={{ color: active ? '#ECEDEE' : '#6B7280', fontSize: 11, fontWeight: active ? '600' : '400' }}>
                {s.label}
              </Text>
            </View>
            {idx < steps.length - 1 && (
              <View
                style={{
                  width: 48,
                  height: 2,
                  marginHorizontal: 8,
                  marginBottom: 18,
                  backgroundColor: done ? '#22C55E' : '#1E2328',
                }}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

// ─── Contraste de texto para cores claras ────────────────────────────────────
function isLightColor(hex: string) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function PlannedStudyScreen() {
  const router = useRouter();
  const { trackCatalog, userProgress } = useData();
  const { isDesktop, isTablet, isMobile } = useScreenSize();
  const bottomPadding = 40;

  // Mapa rápido: `track__category` → { studied, percent }
  const studyProgressMap = useMemo(() => {
    const map = new Map<string, { studied: number; percent: number }>();
    for (const c of userProgress?.categories ?? []) {
      map.set(`${c.track}__${c.category}`, {
        studied: c.uniqueQuestionsAnswered,
        percent: c.studyPercent,
      });
    }
    return map;
  }, [userProgress]);

  const scrollRef = useRef<ScrollViewType>(null);
  const [step, setStep] = useState<Step>(1);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<StudyLevel | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [customSequence, setCustomSequence] = useState<string[] | null>(null);
  const { user } = useAuth();
  const { addPlan } = useStudyPlans(user?.id);
  const { resume, track: resumeTrack, level: resumeLevel, language: resumeLanguage } = useLocalSearchParams<{ resume?: string; track?: string; level?: string; language?: string }>();

  const isLanguageTrack = selectedTrack === 'linguagens-de-programacao';
  const stepLabels = isLanguageTrack
    ? ['Tema', 'Linguagem', 'Nível', 'Plano']
    : ['Tema', 'Nível', 'Plano'];

  // Restaura o plano ao abrir via "Meus Planos"
  useEffect(() => {
    if (resume === '1' && resumeTrack) {
      setSelectedTrack(resumeTrack);
      if (resumeLanguage) setSelectedLanguage(resumeLanguage);
      if (resumeLevel) setSelectedLevel(resumeLevel as StudyLevel);
      // Para linguagens com language, ir para step 4 (plano); para outros, step 3
      const isLang = resumeTrack === 'linguagens-de-programacao';
      setStep(isLang ? 4 : 3);
    }
   
  }, [resume, resumeTrack, resumeLevel, resumeLanguage]);

  const tracks = trackCatalog.map((item) => {
    const style = trackStyles[item.key] ?? TRACK_STYLE_FALLBACK;
    return { key: item.key, label: item.label, icon: style.icon, color: style.color };
  });

  // Para linguagens, o plano é gerado a partir do grupo da linguagem selecionada
  const languageGroup = selectedLanguage
    ? LANGUAGE_GROUPS.find((g) => g.language === selectedLanguage)
    : null;

  const plan = useMemo(() => {
    if (isLanguageTrack && languageGroup) {
      return {
        track: selectedTrack!,
        level: (selectedLevel ?? 'Iniciante') as StudyLevel,
        sequence: languageGroup.categories,
        tip: `Estude ${selectedLanguage} e seus frameworks/ferramentas relacionados.`,
      };
    }
    return selectedTrack && selectedLevel
      ? getStudyPlan(selectedTrack, selectedLevel)
      : null;
  }, [isLanguageTrack, languageGroup, selectedTrack, selectedLevel, selectedLanguage]);

  const sequence = customSequence ?? plan?.sequence ?? [];
  const selectedTrackStyle = selectedTrack ? (trackStyles[selectedTrack] ?? TRACK_STYLE_FALLBACK) : null;

  // Sincroniza customSequence quando o plano muda
  useEffect(() => {
    if (plan) setCustomSequence([...plan.sequence]);
  }, [plan]);

  const moveItem = useCallback((from: number, to: number) => {
    setCustomSequence((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }, []);

  // ── Renders por etapa ──────────────────────────────────────────────────────

  function renderStep1() {
    return (
      <>
        <Text style={{ color: '#ECEDEE', fontSize: isDesktop ? 22 : (isTablet ? 21 : 20), fontWeight: '700', marginBottom: 6 }}>
          O que você quer estudar?
        </Text>
        <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>
          Escolha a área de conhecimento para montar seu plano.
        </Text>

        {(isDesktop || isTablet) ? (
          <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap' }}>
            {tracks.map((t) => {
              const active = selectedTrack === t.key;
              const light = isLightColor(t.color);
              const activeText = light ? '#1A1A1A' : '#FFFFFF';
              return (
                <Pressable
                  key={t.key}
                  onPress={() => setSelectedTrack(t.key)}
                  style={({ pressed }) => ({
                    width: isDesktop ? '31%' : '47%',
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: active ? t.color : pressed ? `${t.color}40` : '#1E2328',
                    backgroundColor: active ? t.color : '#0D0F10',
                    padding: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                  })}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: active ? 'rgba(0,0,0,0.25)' : `${t.color}22`,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <MaterialIcons name={t.icon} size={22} color={active ? activeText : t.color} />
                  </View>
                  <Text style={{ color: active ? activeText : '#9BA1A6', fontSize: 14, fontWeight: '600', flex: 1 }}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {tracks.map((t) => {
              const active = selectedTrack === t.key;
              const light = isLightColor(t.color);
              const activeText = light ? '#1A1A1A' : '#FFFFFF';
              return (
                <Pressable
                  key={t.key}
                  onPress={() => {
                    setSelectedTrack(t.key);
                    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
                  }}
                  style={({ pressed }) => ({
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: active ? t.color : '#1E2328',
                    backgroundColor: active ? t.color : pressed ? '#1A1D21' : '#151718',
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                  })}>
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      backgroundColor: active ? 'rgba(0,0,0,0.25)' : `${t.color}22`,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <MaterialIcons name={t.icon} size={22} color={active ? activeText : t.color} />
                  </View>
                  <Text style={{ color: active ? activeText : '#9BA1A6', fontSize: 15, fontWeight: '600', flex: 1 }}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <Pressable
          onPress={() => { if (selectedTrack) setStep(2); }}
          disabled={!selectedTrack}
          style={({ pressed }) => ({
            marginTop: 28,
            backgroundColor: selectedTrack ? (pressed ? '#3348a0' : '#3F51B5') : '#1E2328',
            borderRadius: 14,
            paddingVertical: 15,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
            opacity: selectedTrack ? 1 : 0.5,
          })}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Próximo</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </Pressable>
      </>
    );
  }

  function renderLanguageStep() {
    return (
      <>
        <Text style={{ color: '#ECEDEE', fontSize: isDesktop ? 22 : (isTablet ? 21 : 20), fontWeight: '700', marginBottom: 6 }}>
          Qual linguagem você quer estudar?
        </Text>
        <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>
          Escolha a linguagem e veja todo o conteúdo disponível, incluindo frameworks.
        </Text>

        {(isDesktop || isTablet) ? (
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
            {LANGUAGE_GROUPS.map((g) => {
              const active = selectedLanguage === g.language;
              const light = isLightColor(g.color);
              const activeText = light ? '#1A1A1A' : '#FFFFFF';
              const activeSubText = light ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.7)';
              return (
                <Pressable
                  key={g.language}
                  onPress={() => setSelectedLanguage(g.language)}
                  style={({ pressed }) => ({
                    width: isDesktop ? '31%' : '47%',
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: active ? g.color : pressed ? `${g.color}40` : '#1E2328',
                    backgroundColor: active ? g.color : '#0D0F10',
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  })}>
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: active ? 'rgba(0,0,0,0.2)' : `${g.color}18`, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name={g.icon as any} size={22} color={active ? activeText : g.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: active ? activeText : '#9BA1A6', fontSize: 14, fontWeight: '600' }}>
                      {g.language}
                    </Text>
                    {g.categories.length > 1 && (
                      <Text style={{ color: active ? activeSubText : '#6B7280', fontSize: 11, marginTop: 2 }}>
                        + {g.categories.slice(1).join(', ')}
                      </Text>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={{ gap: 8 }}>
            {LANGUAGE_GROUPS.map((g) => {
              const active = selectedLanguage === g.language;
              const light = isLightColor(g.color);
              const activeText = light ? '#1A1A1A' : '#FFFFFF';
              const activeSubText = light ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.7)';
              return (
                <Pressable
                  key={g.language}
                  onPress={() => setSelectedLanguage(g.language)}
                  style={({ pressed }) => ({
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: active ? g.color : '#1E2328',
                    backgroundColor: active ? g.color : pressed ? '#1A1D21' : '#151718',
                    padding: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  })}>
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: active ? 'rgba(0,0,0,0.2)' : `${g.color}18`, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name={g.icon as any} size={22} color={active ? activeText : g.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: active ? activeText : '#9BA1A6', fontSize: 15, fontWeight: '600' }}>
                      {g.language}
                    </Text>
                    {g.categories.length > 1 && (
                      <Text style={{ color: active ? activeSubText : '#6B7280', fontSize: 11, marginTop: 2 }}>
                        + {g.categories.slice(1).join(', ')}
                      </Text>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 28 }}>
          <Pressable
            onPress={() => setStep(1)}
            style={({ pressed }) => ({
              flex: 1,
              borderRadius: 14,
              paddingVertical: 15,
              alignItems: 'center',
              backgroundColor: pressed ? '#1A1D21' : '#1E2328',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
            })}>
            <MaterialIcons name="arrow-back" size={20} color="#9BA1A6" />
            <Text style={{ color: '#9BA1A6', fontWeight: '700', fontSize: 16 }}>Voltar</Text>
          </Pressable>
          <Pressable
            onPress={() => { if (selectedLanguage) setStep(3); }}
            disabled={!selectedLanguage}
            style={({ pressed }) => ({
              flex: 2,
              backgroundColor: selectedLanguage ? (pressed ? '#3348a0' : '#3F51B5') : '#1E2328',
              borderRadius: 14,
              paddingVertical: 15,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
              opacity: selectedLanguage ? 1 : 0.5,
            })}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Próximo</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          </Pressable>
        </View>
      </>
    );
  }

  function renderLevelStep() {
    return (
      <>
        <Text style={{ color: '#ECEDEE', fontSize: isDesktop ? 22 : (isTablet ? 21 : 20), fontWeight: '700', marginBottom: 6 }}>
          Qual é o seu nível?
        </Text>
        <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>
          Seja honesto — o plano será montado conforme seu ponto de partida.
        </Text>

        <View style={{ gap: 14 }}>
          {STUDY_LEVELS.map((lvl) => {
            const active = selectedLevel === lvl;
            const levelColors: Record<string, string> = {
              Iniciante: '#22C55E',
              Intermediário: '#F59E0B',
              Avançado: '#8B5CF6',
            };
            const color = levelColors[lvl]!;
            const light = isLightColor(color);
            const activeText = light ? '#1A1A1A' : '#FFFFFF';
            const activeSubText = light ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.7)';
            return (
              <Pressable
                key={lvl}
                onPress={() => setSelectedLevel(lvl)}
                style={({ pressed }) => ({
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: active ? color : '#1E2328',
                  backgroundColor: active ? color : pressed ? '#1A1D21' : '#151718',
                  padding: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                })}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: active ? activeText : '#9BA1A6', fontSize: 16, fontWeight: '700' }}>
                    {lvl}
                  </Text>
                  <Text style={{ color: active ? activeSubText : '#6B7280', fontSize: 13, marginTop: 3 }}>
                    {STUDY_LEVEL_DESCRIPTIONS[lvl]}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 28 }}>
          <Pressable
            onPress={() => setStep(isLanguageTrack ? 2 : 1)}
            style={({ pressed }) => ({
              flex: 1,
              borderRadius: 14,
              paddingVertical: 15,
              alignItems: 'center',
              backgroundColor: pressed ? '#1A1D21' : '#1E2328',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
            })}>
            <MaterialIcons name="arrow-back" size={20} color="#9BA1A6" />
            <Text style={{ color: '#9BA1A6', fontWeight: '700', fontSize: 16 }}>Voltar</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              if (selectedLevel && selectedTrack) {
                const trackLabel = tracks.find((t) => t.key === selectedTrack)?.label ?? selectedTrack;
                if (isLanguageTrack && languageGroup) {
                  addPlan({ track: selectedTrack, trackLabel: `${trackLabel} > ${selectedLanguage}`, level: selectedLevel, firstCategory: languageGroup.categories[0], language: selectedLanguage ?? undefined });
                } else {
                  const p = getStudyPlan(selectedTrack, selectedLevel);
                  if (p) {
                    addPlan({ track: selectedTrack, trackLabel, level: selectedLevel, firstCategory: p.sequence[0] });
                  }
                }
                setStep(isLanguageTrack ? 4 : 3);
              }
            }}
            disabled={!selectedLevel}
            style={({ pressed }) => ({
              flex: 2,
              backgroundColor: selectedLevel ? (pressed ? '#3348a0' : '#3F51B5') : '#1E2328',
              borderRadius: 14,
              paddingVertical: 15,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
              opacity: selectedLevel ? 1 : 0.5,
            })}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Ver meu plano</Text>
            <MaterialIcons name="auto-awesome" size={20} color="#fff" />
          </Pressable>
        </View>
      </>
    );
  }

  function renderPlanStep() {
    if (!plan || !selectedTrackStyle) return null;

    const levelColors: Record<string, string> = {
      Iniciante: '#22C55E',
      Intermediário: '#F59E0B',
      Avançado: '#8B5CF6',
    };
    const levelColor = levelColors[selectedLevel!]!;
    const trackColor = selectedTrackStyle.color;

    return (
      <>
        {/* Cabeçalho do plano */}
        <View
          style={{
            borderRadius: 16,
            borderWidth: 1,
            borderColor: `${trackColor}40`,
            backgroundColor: `${trackColor}12`,
            padding: 20,
            marginBottom: 24,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
          }}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              backgroundColor: `${trackColor}25`,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialIcons name={selectedTrackStyle.icon} size={26} color={trackColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#ECEDEE', fontSize: 16, fontWeight: '700' }}>
              {isLanguageTrack && selectedLanguage
                ? `${tracks.find((t) => t.key === selectedTrack)?.label} › ${selectedLanguage}`
                : tracks.find((t) => t.key === selectedTrack)?.label}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 99,
                  backgroundColor: `${levelColor}20`,
                }}>
                <Text style={{ color: levelColor, fontSize: 12, fontWeight: '700' }}>
                  {selectedLevel}
                </Text>
              </View>
              <Text style={{ color: '#6B7280', fontSize: 12 }}>
                {plan.sequence.length} tópicos
              </Text>
            </View>
          </View>
        </View>

        {/* Dica */}
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            backgroundColor: '#1A1D21',
            borderRadius: 12,
            padding: 14,
            marginBottom: 24,
            borderLeftWidth: 3,
            borderLeftColor: '#F59E0B',
          }}>
          <MaterialIcons name="lightbulb" size={18} color="#F59E0B" />
          <Text style={{ color: '#9BA1A6', fontSize: 13, flex: 1, lineHeight: 19 }}>
            {plan.tip}
          </Text>
        </View>

        {/* Sequência */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
          <Text style={{ color: '#ECEDEE', fontSize: 15, fontWeight: '700', flex: 1 }}>
            Sequência de estudos recomendada
          </Text>
          <Text style={{ color: '#6B7280', fontSize: 11 }}>
            Arraste para reordenar
          </Text>
        </View>

        <View style={{ gap: 10 }}>
          {sequence.map((cat, idx) => (
            <View
              key={cat}
              style={{
                borderRadius: 14,
                borderWidth: 1,
                borderColor: '#1E2328',
                backgroundColor: '#151718',
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
              {/* Setas de reordenação */}
              <View style={{ gap: 2 }}>
                <Pressable
                  onPress={() => moveItem(idx, idx - 1)}
                  disabled={idx === 0}
                  style={({ pressed }) => ({
                    width: 28,
                    height: 22,
                    borderRadius: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: pressed && idx > 0 ? '#2A2F36' : 'transparent',
                    opacity: idx === 0 ? 0.25 : 1,
                  })}>
                  <MaterialIcons name="keyboard-arrow-up" size={20} color="#9BA1A6" />
                </Pressable>
                <Pressable
                  onPress={() => moveItem(idx, idx + 1)}
                  disabled={idx === sequence.length - 1}
                  style={({ pressed }) => ({
                    width: 28,
                    height: 22,
                    borderRadius: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: pressed && idx < sequence.length - 1 ? '#2A2F36' : 'transparent',
                    opacity: idx === sequence.length - 1 ? 0.25 : 1,
                  })}>
                  <MaterialIcons name="keyboard-arrow-down" size={20} color="#9BA1A6" />
                </Pressable>
              </View>

              {/* Número */}
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: idx === 0 ? `${trackColor}30` : '#1E2328',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: idx === 0 ? trackColor : '#6B7280',
                    fontSize: 12,
                    fontWeight: '700',
                  }}>
                  {idx + 1}
                </Text>
              </View>

              {/* Nome (tappable para iniciar estudo) */}
              <Pressable
                onPress={() =>
                  router.push(
                    `/ready/study?track=${encodeURIComponent(selectedTrack!)}&category=${encodeURIComponent(cat)}` as never,
                  )
                }
                style={{ flex: 1 }}>
                <Text style={{ color: '#ECEDEE', fontSize: 14, fontWeight: '600' }}>
                  {cat}
                </Text>
                {CATEGORY_TYPE_LABEL[cat] && (
                  <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>
                    {CATEGORY_TYPE_LABEL[cat]}
                  </Text>
                )}
                {(() => {
                  const prog = studyProgressMap.get(`${selectedTrack}__${cat}`);
                  if (!prog || prog.studied === 0) return null;
                  return (
                    <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>
                      {prog.studied} cards estudados · {prog.percent}%
                    </Text>
                  );
                })()}
              </Pressable>

              {/* Badge "Início" no primeiro */}
              {idx === 0 && (
                <View
                  style={{
                    backgroundColor: `${trackColor}20`,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 99,
                  }}>
                  <Text style={{ color: trackColor, fontSize: 10, fontWeight: '700' }}>
                    Comece aqui
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Ação principal */}
        <Pressable
          onPress={() =>
            router.push(
              `/ready/study?track=${encodeURIComponent(selectedTrack!)}&category=${encodeURIComponent(sequence[0])}` as never,
            )
          }
          style={({ pressed }) => ({
            marginTop: 28,
            backgroundColor: pressed ? `${trackColor}cc` : trackColor,
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
          })}>
          <MaterialIcons name="play-arrow" size={22} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
            Iniciar pelo primeiro tópico
          </Text>
        </Pressable>

        {/* Refazer planejamento */}
        <Pressable
          onPress={() => {
            setStep(1);
            setSelectedTrack(null);
            setSelectedLevel(null);
            setSelectedLanguage(null);
          }}
          style={({ pressed }) => ({
            marginTop: 12,
            borderRadius: 14,
            paddingVertical: 13,
            alignItems: 'center',
            backgroundColor: pressed ? '#1A1D21' : 'transparent',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 6,
          })}>
          <MaterialIcons name="refresh" size={18} color="#6B7280" />
          <Text style={{ color: '#6B7280', fontWeight: '600', fontSize: 14 }}>
            Refazer planejamento
          </Text>
        </Pressable>
      </>
    );
  }

  // ── Layout wrapper ─────────────────────────────────────────────────────────
  const content = (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1, backgroundColor: '#111316' }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: isDesktop || isTablet ? 40 : 20,
        paddingTop: isDesktop || isTablet ? 40 : 56,
        paddingBottom: bottomPadding,
        maxWidth: 720,
        alignSelf: (isDesktop || isTablet) ? 'center' : undefined,
        width: (isDesktop || isTablet) ? '100%' : undefined,
      }}>
      {/* Voltar */}
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          marginBottom: 24,
          opacity: pressed ? 0.6 : 1,
          alignSelf: 'flex-start',
        })}>
        <MaterialIcons name="arrow-back" size={20} color="#6B7280" />
        <Text style={{ color: '#6B7280', fontSize: 14 }}>Voltar</Text>
      </Pressable>

      <StepIndicator current={step} labels={stepLabels} />

      {step === 1 && renderStep1()}
      {step === 2 && (isLanguageTrack ? renderLanguageStep() : renderLevelStep())}
      {step === 3 && (isLanguageTrack ? renderLevelStep() : renderPlanStep())}
      {step === 4 && renderPlanStep()}
    </ScrollView>
  );

  return content;
}

import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Svg, { Path, Rect, Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  useColorScheme, 
  Animated,
  Dimensions,
  StyleSheet,
  Alert,
  Modal,
  Pressable
} from 'react-native';
import { Audio } from 'expo-av';
import { router } from 'expo-router';
import { useTabContentPadding, useTopContentPadding } from '@/hooks/use-tab-content-padding';
import { StudyCompletionOverlay } from '../study-session/components/study-completion-overlay';
import { QUIZ_COLORS } from '@/constants/quiz-ui';
import { useAuth } from '@/providers/auth-provider';
import { saveDataCenterResult, fetchDataCenterProgress } from '@/lib/api/datacenter';
import { GlossaryText } from '@/components/glossary-text';

import RackData from '../coding-practice/Data/datacenterbuild.json';
import { 
  DataCenterData, 
  DataCenterLevel, 
  Cable, 
  ActiveConnection,
  InventoryDevice
} from './datacenter-builder.types';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const { width: windowWidth } = Dimensions.get('window');
const data = RackData as unknown as DataCenterData;

const getDeviceIcon = (deviceId: string, type: string) => {
  const idLower = deviceId.toLowerCase();
  
  if (idLower.includes('modem') || idLower.includes('isp')) return 'modem';
  if (idLower.includes('router') || idLower.includes('mikrotik')) return 'router-wireless';
  if (idLower.includes('fw') || idLower.includes('firewall') || idLower.includes('fortinet') || idLower.includes('paloalto')) return 'shield-lock';
  if (idLower.includes('switch')) return 'switch';
  if (idLower.includes('storage') || idLower.includes('nas') || idLower.includes('synology') || idLower.includes('netapp')) return 'database';
  if (idLower.includes('camera')) return 'video-outline';
  if (idLower.includes('voip')) return 'phone-voip';
  if (idLower.includes('load_balancer') || idLower.includes('lb_f5') || idLower.includes('citrix')) return 'transit-connection-variant';
  if (idLower.includes('ups') || idLower.includes('apc') || idLower.includes('eaton')) return 'battery-charging';
  if (idLower.includes('ap_')) return 'wifi';
  
  switch (type) {
    case 'telecom': return 'modem';
    case 'network': return 'router';
    case 'security': return 'security';
    case 'storage': return 'database';
    case 'compute': return 'server';
    case 'power': return 'battery';
    case 'wireless': return 'wifi';
    default: return 'server';
  }
};

// --- Main Screen ---

export function DataCenterBuilderScreen() {
  const isDark = useColorScheme() === 'dark';
  const topPadding = useTopContentPadding();
  const bottomPadding = useTabContentPadding();

  const { user } = useAuth();
  const [activeLevel, setActiveLevel] = useState<DataCenterLevel | null>(null);
  const [selectedCable, setSelectedCable] = useState<Cable | null>(null);
  const [sourceNode, setSourceNode] = useState<{ deviceId: string; port: string } | null>(null);
  const [connections, setConnections] = useState<ActiveConnection[]>([]);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [movements, setMovements] = useState(0);
  
  // Game Flow States
  const [installedDevices, setInstalledDevices] = useState<Record<number, InventoryDevice>>({});
  const [showPhaseAlert, setShowPhaseAlert] = useState(false);
  const [validationError, setValidationError] = useState<{ title: string; message: string } | null>(null);
  const [blinkSlot, setBlinkSlot] = useState<{ index: number, type: 'success' | 'error' } | null>(null);
  const [blinkingInventoryItem, setBlinkingInventoryItem] = useState<string | null>(null);
  const [blinkingPorts, setBlinkingPorts] = useState<Record<string, 'success' | 'error'>>({});
  const [selectedSlotForInstall, setSelectedSlotForInstall] = useState<number | null>(null);
  const [showCableMenu, setShowCableMenu] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSuccessTransition, setShowSuccessTransition] = useState(false);
  const [levelFilter, setLevelFilter] = useState<'TODOS' | 'EASY' | 'MEDIUM' | 'HARD'>('TODOS');
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);
  const [diagnosisActive, setDiagnosisActive] = useState(false);
  const [finalScore, setFinalScore] = useState(100);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [portPositions, setPortPositions] = useState<Record<string, {x: number, y: number}>>({});
  const [rowPositions, setRowPositions] = useState<Record<number, number>>({});
  
  const rackRef = useRef<View>(null);

  const blinkAnim = useRef(new Animated.Value(0)).current;

  const playSound = async (type: 'success' | 'complete' | 'error') => {
    try {
      const soundFile = type === 'complete' ? require('@/assets/songs/concluido.mp3') : 
                        type === 'success' ? require('@/assets/songs/acertou.mp3') : 
                        require('@/assets/songs/erro.mp3');
      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Erro ao tocar som:', error);
    }
  };

  // Visual Assets for Completion
  const completionRingScale = useRef(new Animated.Value(0.8)).current;
  const completionRingOpacity = useRef(new Animated.Value(0)).current;
  const completionBgOpacity = useRef(new Animated.Value(0)).current;
  const completionIconScale = useRef(new Animated.Value(0.5)).current;
  const completionTextOpacity = useRef(new Animated.Value(0)).current;

  const bg = isDark ? '#0D0F10' : '#F8FAFC';
  const textPrimary = isDark ? '#ECEDEE' : '#11181C';
  const textMuted = isDark ? '#9BA1A6' : '#687076';
  const surfaceColor = isDark ? '#1A1D21' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

  const isHardwareInstalled = useMemo(() => {
    if (!activeLevel) return false;
    return Object.keys(installedDevices).length === activeLevel.inventory.length;
  }, [installedDevices, activeLevel]);

  useEffect(() => {
    if (user?.id) {
       fetchDataCenterProgress(user.id).then(results => {
          const done = new Set<number>();
          Object.keys(results).forEach(id => {
             if (results[id].completed) done.add(parseInt(id));
          });
          setCompletedLevels(done);
       });
    }
  }, [user]);

  const handleLevelSelect = (level: DataCenterLevel) => {
    setActiveLevel(level);
    setConnections([]);
    setSourceNode(null);
    setSelectedCable(null);
    setInstalledDevices({});
    setStartTime(Date.now());
    setFinished(false);
    setMovements(0);
    setDiagnosisActive(false);
    setFinalScore(100);
    setRecommendations([]);
    setValidationError(null);
  };

  const goToNextLevel = () => {
    if (!activeLevel) return;
    const currentIndex = data.levels.findIndex(l => l.id === activeLevel.id);
    const nextLevel = data.levels[currentIndex + 1];
    if (nextLevel) {
      handleLevelSelect(nextLevel);
    } else {
      setActiveLevel(null);
    }
  };



  const triggerBlinkPort = (portKey1: string, portKey2: string, type: 'success' | 'error') => {
    setBlinkingPorts({ [portKey1]: type, [portKey2]: type });
    Animated.sequence([
      Animated.timing(blinkAnim, { toValue: 1, duration: 250, useNativeDriver: false }),
      Animated.timing(blinkAnim, { toValue: 0, duration: 500, useNativeDriver: false }),
    ]).start(() => setBlinkingPorts({}));
  };

  const handleInstallItem = (device: InventoryDevice) => {
    if (selectedSlotForInstall === null || !activeLevel) return;

    setInstalledDevices(prev => ({ ...prev, [selectedSlotForInstall]: device }));
    setMovements(m => m + 1);
    setSelectedSlotForInstall(null);
    setDiagnosisActive(false);
  };

  const handlePortPress = (deviceId: string, port: string) => {
    if (!isHardwareInstalled) {
      setShowPhaseAlert(true);
      return;
    }

    const existing = connections.find(c => (c.from.deviceId === deviceId && c.from.port === port) || (c.to?.deviceId === deviceId && c.to?.port === port));
    
    if (existing) {
      removeConnection(deviceId, port);
      return;
    }

    if (!sourceNode) {
      setSourceNode({ deviceId, port });
      setShowCableMenu(true);
    } else {
      if (sourceNode.deviceId === deviceId && sourceNode.port === port) {
        setSourceNode(null);
        setSelectedCable(null);
        return;
      }

      if (!selectedCable) {
        setSourceNode(null);
        return;
      }

      validateConnectionAttempt(sourceNode, { deviceId, port }, selectedCable);
    }
  };

  const validateConnectionAttempt = (from: { deviceId: string; port: string }, to: { deviceId: string; port: string }, cable: Cable) => {
    if (!activeLevel) return;

    const fromKey = `${from.deviceId}.${from.port}`;
    const toKey = `${to.deviceId}.${to.port}`;

    // Now allowing any connection for trial-and-error gameplay
    const newConn: ActiveConnection = {
      id: Math.random().toString(36).substr(2, 9),
      from,
      to,
      cableId: cable.id
    };
    
    setConnections([...connections, newConn]);
    triggerBlinkPort(fromKey, toKey, 'success');
    setSourceNode(null);
    setSelectedCable(null);
    setMovements(m => m + 1);
    setDiagnosisActive(false); // Reset diagnosis on change
  };

  const handleUninstall = (index: number) => {
    const device = installedDevices[index];
    if (!device) return;
    const newInstalled = { ...installedDevices };
    delete newInstalled[index];
    setInstalledDevices(newInstalled);
    setMovements(m => m + 1);
    setDiagnosisActive(false);
  };

  const getPortColor = (portId: string, devId: string) => {
    const conn = connections.find(c => 
      (c.from.deviceId === devId && c.from.port === portId) || 
      (c.to?.deviceId === devId && c.to?.port === portId)
    );
    if (!conn) return '#555';
    const cable = data.cables.find(cb => cb.id === conn.cableId);
    if (cable?.type === 'fiber') return '#F43F5E';
    if (cable?.type === 'direct_attach') return '#A855F7';
    if (cable?.type === 'fiber_copper') return '#EAB308';
    if (cable?.type === 'ethernet') return '#3B82F6';
    return '#F59E0B';
  };

  const removeConnection = (deviceId: string, port: string) => {
    setConnections(connections.filter(c => 
      !(c.from.deviceId === deviceId && c.from.port === port) &&
      !(c.to?.deviceId === deviceId && c.to?.port === port)
    ));
    setMovements(m => m + 1);
    setDiagnosisActive(false);
  };

  const handleValidate = () => {
    if (!activeLevel) return;
    setDiagnosisActive(true);

    // 1. Hardware Scoring & Validation
    let currentScore = 100;
    let currentRecs: string[] = [];
    
    // Check if all required hardware is installed somewhere
    const allHardwareInstalled = activeLevel.inventory.every(expected => 
      Object.values(installedDevices).some(inst => inst.id === expected.id)
    );

    if (allHardwareInstalled) {
      activeLevel.inventory.forEach((expected, idx) => {
        const installedInThisSlot = installedDevices[idx];
        if (!installedInThisSlot || installedInThisSlot.id !== expected.id) {
          currentScore -= 8;
          currentRecs.push(`Posicionamento: O ${expected.label} não está no slot ${activeLevel.inventory.length - idx}U planejado. Isso pode dificultar a identificação em racks densos.`);
        }
      });
    }

    // 2. Cabling Scoring & Validation
    const cablingResults = activeLevel.connections_required.map(req => {
      const conn = connections.find(c => {
        const cFrom = `${c.from.deviceId}.${c.from.port}`;
        const cTo = c.to ? `${c.to.deviceId}.${c.to.port}` : '';
        return (req.from === cFrom && req.to === cTo) || (req.from === cTo && req.to === cFrom);
      });

      if (!conn) return { status: 'missing' };

      if (conn.cableId !== req.cable) {
        const reqCable = data.cables.find(cb => cb.id === req.cable);
        const actualCable = data.cables.find(cb => cb.id === conn.cableId);
        
        // If they share the same physical type (e.g. ethernet), it's functional but suboptimal
        if (reqCable?.type === actualCable?.type) {
          currentScore -= 15;
          currentRecs.push(`Performance: Usar ${actualCable?.id.toUpperCase()} em vez de ${reqCable?.id.toUpperCase()} para ${req.from} reduz a margem de segurança e largura de banda projetada.`);
          return { status: 'suboptimal' };
        }
        return { status: 'wrong_type' };
      }
      return { status: 'correct' };
    });

    const isHardwarePresent = allHardwareInstalled;
    const isCablingFunctional = cablingResults.every(r => r.status === 'correct' || r.status === 'suboptimal');
    const hasWrongCableCategory = cablingResults.some(r => r.status === 'wrong_type' || r.status === 'missing');

    if (isHardwarePresent && isCablingFunctional && !hasWrongCableCategory) {
      setFinalScore(Math.max(0, currentScore));
      setRecommendations(currentRecs);
      setIsSyncing(true);
      playSound('complete');
      setShowSuccessTransition(true);

      // Animation & Transition
      successScale.setValue(0);
      successOpacity.setValue(1);
      
      Animated.timing(successScale, { toValue: 1, duration: 1500, useNativeDriver: true }).start();

      setTimeout(() => {
        Animated.timing(successOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
          setShowSuccessTransition(false);
          setFinished(true);
          setIsSyncing(false);
          
          const now = Date.now();
          const timeSecs = startTime ? Math.floor((now - startTime) / 1000) : 0;
          setElapsedTime(timeSecs);
          setCompletedLevels(new Set([...completedLevels, activeLevel.id]));
          if (user?.id) {
             saveDataCenterResult(user.id, activeLevel.id, timeSecs, movements, Math.max(0, currentScore));
          }
        });
      }, 2000);
    } else {
      playSound('error');
      setDiagnosisActive(true);
      setValidationError({
        title: "Arquitetura Incompleta",
        message: "O projeto não atende aos requisitos técnicos. Verifique os LEDs diagnósticos que estão piscando em vermelho/laranja nos equipamentos e portas."
      });

      // Persistent loop for diagnostic blinking
      blinkAnim.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, { toValue: 1, duration: 600, useNativeDriver: false }),
          Animated.timing(blinkAnim, { toValue: 0.1, duration: 600, useNativeDriver: false }),
        ])
      ).start();
    }
  };

  const renderLevelList = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: topPadding + 20, paddingBottom: bottomPadding + 20, paddingHorizontal: 20 }}
    >
      <View style={{ marginBottom: 32 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={20} color={textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: textPrimary }]}>{data.game.name}</Text>
        <Text style={[styles.subtitle, { color: textMuted }]}>Simulador de montagem e cabeamento estruturado.</Text>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }} contentContainerStyle={{ gap: 8 }}>
        {['TODOS', 'EASY', 'MEDIUM', 'HARD', 'EXPERT', 'EXTREME'].map((filter) => {
          const isActive = levelFilter === filter;
          let filterColor = '#3B82F6';
          if (filter === 'EASY') filterColor = '#22C55E';
          if (filter === 'MEDIUM') filterColor = '#F59E0B';
          if (filter === 'HARD') filterColor = '#EF4444';
          if (filter === 'EXPERT') filterColor = '#8B5CF6'; // Purple
          if (filter === 'EXTREME') filterColor = '#111111'; // Black/Carbon

          return (
            <TouchableOpacity 
              key={filter} 
              onPress={() => setLevelFilter(filter as any)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 14,
                backgroundColor: isActive ? filterColor : surfaceColor,
                borderWidth: 1.5,
                borderColor: isActive ? filterColor : borderColor,
              }}
            >
              <Text style={{ color: isActive ? '#FFFFFF' : textMuted, fontWeight: '800', fontSize: 13 }}>{filter}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      <View style={styles.levelGrid}>
        {data.levels.filter(lvl => levelFilter === 'TODOS' || lvl.difficulty.toUpperCase() === levelFilter).map(lvl => {
          const isDone = completedLevels.has(lvl.id);
          return (
            <TouchableOpacity 
              key={lvl.id} 
              style={[styles.levelCard, { backgroundColor: surfaceColor, borderColor: isDone ? '#10B98150' : '#2D3139' }]}
              onPress={() => handleLevelSelect(lvl)}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelNumber}>{lvl.id}</Text>
                </View>
                <View style={[styles.difficultyBadge, { 
                  backgroundColor: lvl.difficulty === 'easy' ? '#22C55E20' : 
                                   lvl.difficulty === 'medium' ? '#F59E0B20' : 
                                   lvl.difficulty === 'hard' ? '#EF444420' :
                                   lvl.difficulty === 'expert' ? '#8B5CF620' : '#111111'
                }]}>
                  <Text style={[styles.difficultyText, { 
                    color: lvl.difficulty === 'extreme' ? '#FFFFFF' :
                           lvl.difficulty === 'easy' ? '#22C55E' : 
                           lvl.difficulty === 'medium' ? '#F59E0B' : 
                           lvl.difficulty === 'hard' ? '#EF4444' : '#8B5CF6'
                  }]}>
                    {lvl.difficulty.toUpperCase()}
                  </Text>
                </View>
              </View>

              {lvl.tier && <Text style={styles.levelTier}>{lvl.tier}</Text>}
              <Text style={[styles.levelName, { color: textPrimary }]} numberOfLines={2}>{lvl.name}</Text>
              {lvl.description && <Text style={styles.levelDescription} numberOfLines={2}>{lvl.description}</Text>}
              
              {isDone && <MaterialIcons name="check-circle" size={24} color="#10B981" style={styles.doneIcon} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
  const renderWorkbench = () => {
    if (!activeLevel) return null;

    const MAX_RACK_W = 600;
    const SLOT_H = 54;
    const RACK_W = Math.min(windowWidth - 30, MAX_RACK_W);
    const RAIL_W = 24;
    const MAIN_W = RACK_W - (RAIL_W * 2);
    const RACK_TOTAL_H = (activeLevel.inventory.length * SLOT_H) + 20;

    if (finished) {
      return (
        <View style={{ flex: 1, backgroundColor: bg }}>
           <View style={[styles.workbenchHeader, { paddingTop: topPadding + 10, backgroundColor: surfaceColor, borderBottomWidth: 1, borderBottomColor: borderColor }]}>
            <TouchableOpacity onPress={() => setActiveLevel(null)} style={styles.backButton}>
              <MaterialIcons name="close" size={24} color={textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.workbenchTitle, { color: textPrimary }]}>RESULTADOS</Text>
            <View style={{ width: 40 }} />
          </View>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}
          >
            <View style={{ alignItems: 'center', marginBottom: 32 }}>
              <MaterialCommunityIcons name="check-decagram" size={80} color="#22C55E" />
              <Text style={{ fontSize: 24, fontWeight: '800', color: textPrimary, marginTop: 16 }}>PROJETO VALIDADO!</Text>
              <Text style={{ color: textMuted, marginTop: 8, textAlign: 'center' }}>
                O DataCenter está operando em conformidade técnica.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setActiveLevel(null)}
              style={{ backgroundColor: '#22C55E', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center' }}
            >
              <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 16 }}>CONCLUIR PROJETO</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#050505' }}>
        <View style={[styles.workbenchHeader, { paddingTop: topPadding + 10 }]}>
          <TouchableOpacity onPress={() => setActiveLevel(null)} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#ECEDEE" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.workbenchLevelName}>{activeLevel.name}</Text>
            <Text style={styles.workbenchStatus}>
              {isHardwareInstalled ? 'Fase 2: Conectar Portas' : 'Fase 1: Instalação de Hardware'}
            </Text>
          </View>
          {isHardwareInstalled && (
            <TouchableOpacity onPress={handleValidate} disabled={isSyncing} style={[styles.validateButton, { backgroundColor: connections.length === activeLevel.connections_required.length ? '#22C55E' : '#2D3139', opacity: isSyncing ? 0.6 : 1 }]}>
              <Text style={styles.validateButtonText}>{isSyncing ? 'SINCRONIZANDO...' : 'VALIDAR'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={{ padding: 15, paddingBottom: bottomPadding + 100, alignItems: 'center' }}
        >
          <View style={{ width: RACK_W, height: RACK_TOTAL_H }}>
            <Svg width={RACK_W} height={RACK_TOTAL_H} viewBox={`0 0 ${RACK_W} ${RACK_TOTAL_H}`}>
            {/* Main Rack Chassis */}
            <Rect x="0" y="0" width={RACK_W} height={RACK_TOTAL_H} fill="#0A0A0A" rx={8} stroke="#1A1A1A" strokeWidth="2" />
            
            {/* Rails */}
            <G>
              <Rect x="0" y="0" width={RAIL_W} height={RACK_TOTAL_H} fill="#151515" />
              <Rect x={RACK_W - RAIL_W} y="0" width={RAIL_W} height={RACK_TOTAL_H} fill="#151515" />
              <Line x1={RAIL_W} y1="0" x2={RAIL_W} y2={RACK_TOTAL_H} stroke="#222" strokeWidth="1" />
              <Line x1={RACK_W - RAIL_W} y1="0" x2={RACK_W - RAIL_W} y2={RACK_TOTAL_H} stroke="#222" strokeWidth="1" />
              
              {/* Rail Holes */}
              {Array.from({ length: 8 }).map((_, i) => (
                <React.Fragment key={i}>
                  <Circle cx={RAIL_W/2} cy={24 + (i * SLOT_H)} r="4" fill="#000" stroke="#222" strokeWidth="1" />
                  <Circle cx={RACK_W - (RAIL_W/2)} cy={24 + (i * SLOT_H)} r="4" fill="#000" stroke="#222" strokeWidth="1" />
                </React.Fragment>
              ))}
            </G>

            {/* Slots and Hardware */}
            {activeLevel.inventory.map((expectedDevice, index) => {
              const installed = installedDevices[index];
              const y = 10 + (index * SLOT_H);
              const uNum = activeLevel.inventory.length - index;
              const isBlinkingS = blinkSlot?.index === index;
              
              return (
                <G key={index}>
                  {!installed ? (
                    <G>
                      {/* Visuals Base */}
                      <Rect x={RAIL_W + 4} y={y + 2} width={MAIN_W - 8} height={SLOT_H - 4} fill="#080808" rx={2} stroke="#111" strokeWidth="1" />
                      <SvgText x={RACK_W/2} y={y + 32} fill="#222" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="Arial">
                        ADICIONAR {uNum}U
                      </SvgText>
                      {isBlinkingS && (
                        <Rect x={RAIL_W + 4} y={y + 2} width={MAIN_W - 8} height={SLOT_H - 4} fill={blinkSlot?.type === 'success' ? '#22C55E44' : '#EF444444'} rx={2} />
                      )}
                      <SvgText x={4} y={y + 30} fill="#444" fontSize="9" fontWeight="900" fontFamily="Arial">{uNum}U</SvgText>
                    </G>
                  ) : (
                    <G>
                      {/* Hardware Visuals */}
                      <Rect x={RAIL_W} y={y} width={MAIN_W} height={SLOT_H} fill="#18181B" rx={1} stroke="#27272A" strokeWidth="1" />
                      <Rect x={RAIL_W + 4} y={y + 2} width={MAIN_W - 8} height={SLOT_H - 4} fill="#1A1A1E" rx={1} />
                      <SvgText x={4} y={y + 30} fill="#444" fontSize="9" fontWeight="900" fontFamily="Arial">{uNum}U</SvgText>
                      <SvgText x={RAIL_W + 12} y={y + 18} fill="#ECEDEE" fontSize="10" fontWeight="900" fontFamily="Arial">
                        {installed.label || installed.id.toUpperCase()}
                      </SvgText>
                      <SvgText x={RAIL_W + 12} y={y + 28} fill="#71717A" fontSize="7" fontWeight="bold" fontFamily="Arial">
                        {installed.type.toUpperCase()}
                      </SvgText>
                      
                      {/* Diagnostic LEDs */}
                      {diagnosisActive && activeLevel.inventory[index].id !== installed.id ? (
                        <AnimatedCircle 
                          cx={RACK_W - RAIL_W - 35} 
                          cy={y + 18} 
                          r="3" 
                          fill="#EF4444" 
                          opacity={blinkAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.3, 1]
                          })}
                        />
                      ) : (
                        <Circle cx={RACK_W - RAIL_W - 35} cy={y + 18} r="2.5" fill={diagnosisActive ? '#22C55E' : '#27272A'} />
                      )}
                      <Circle cx={RACK_W - RAIL_W - 25} cy={y + 18} r="2.5" fill={finished ? '#3B82F6' : '#27272A'} />

                      {/* Ports */}
                      {installed.ports.map((portId, pIdx) => {
                        const isSelected = sourceNode?.deviceId === installed.id && sourceNode?.port === portId;
                        const isConnected = connections.find(c => (c.from.deviceId === installed.id && c.from.port === portId) || (c.to?.deviceId === installed.id && c.to?.port === portId));
                        const portX = RAIL_W + 12 + (pIdx * 28);
                        const portY = y + 32;
                        
                        // Check if this connection is WRONG during diagnosis
                        let isPortError = false;
                        if (diagnosisActive && isConnected) {
                          const isCorrect = activeLevel.connections_required.some(req => {
                            const cFrom = `${isConnected.from.deviceId}.${isConnected.from.port}`;
                            const cTo = isConnected.to ? `${isConnected.to.deviceId}.${isConnected.to.port}` : '';
                            return ((req.from === cFrom && req.to === cTo) || (req.from === cTo && req.to === cFrom)) && req.cable === isConnected.cableId;
                          });
                          isPortError = !isCorrect;
                        }

                        return (
                          <G key={portId}>
                            <Rect x={portX} y={portY} width={22} height={18} rx={2} fill="#0A0A0A" stroke={isSelected ? '#3B82F6' : (isConnected ? (isPortError ? '#EF4444' : getPortColor(portId, installed.id)) : '#333')} strokeWidth={isSelected || isPortError ? 2 : 1} />
                            {isPortError ? (
                              <AnimatedRect 
                                x={portX + 6} y={portY + 4} width={10} height={10} 
                                fill="#EF4444" 
                                rx={1.5} 
                                opacity={blinkAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0.3, 1]
                                })}
                              />
                            ) : (
                              <Rect x={portX + 6} y={portY + 4} width={10} height={10} fill={isConnected ? getPortColor(portId, installed.id) : "#222"} rx={1.5} />
                            )}
                            <SvgText x={portX + 2} y={portY + 16} fontSize="5" fill="#555" fontWeight="900">{portId.slice(-4)}</SvgText>
                          </G>
                        );
                      })}
                    </G>
                  )}
                </G>
              );
            })}

            {/* Cable Layer (Dynamic bezier paths) */}
            {connections.map(conn => {
              const fromSlotIdx = Object.keys(installedDevices).find(k => installedDevices[parseInt(k)].id === conn.from.deviceId);
              const toSlotIdx = Object.keys(installedDevices).find(k => installedDevices[parseInt(k)].id === conn.to?.deviceId);
              
              if (fromSlotIdx === undefined || toSlotIdx === undefined) return null;
              
              const fsIdx = parseInt(fromSlotIdx);
              const tsIdx = parseInt(toSlotIdx);
              const p1Idx = installedDevices[fsIdx].ports.indexOf(conn.from.port);
              const p2Idx = installedDevices[tsIdx].ports.indexOf(conn.to!.port);

              const p1x = RAIL_W + 12 + (p1Idx * 28) + 11;
              const p1y = 10 + (fsIdx * SLOT_H) + 32 + 9;
              const p2x = RAIL_W + 12 + (p2Idx * 28) + 11;
              const p2y = 10 + (tsIdx * SLOT_H) + 32 + 9;

              const cable = data.cables.find(c => c.id === conn.cableId);
              const color = cable?.type === 'fiber' ? '#F43F5E' : (cable?.type === 'ethernet' ? '#3B82F6' : '#F59E0B');
              const curveX = Math.max(p1x, p2x) + 40;

              const isCableCorrect = activeLevel.connections_required.some(req => {
                const cFrom = `${conn.from.deviceId}.${conn.from.port}`;
                const cTo = conn.to ? `${conn.to.deviceId}.${conn.to.port}` : '';
                return ((req.from === cFrom && req.to === cTo) || (req.from === cTo && req.to === cFrom)) && req.cable === conn.cableId;
              });

              const isError = diagnosisActive && !isCableCorrect;

              return (
                <G key={conn.id}>
                  <AnimatedPath 
                    d={`M ${p1x} ${p1y} C ${curveX} ${p1y} ${curveX} ${p2y} ${p2x} ${p2y}`} 
                    stroke={isError ? '#EF4444' : color} 
                    strokeWidth={isError ? 5 : 3} 
                    fill="none" 
                    strokeLinecap="round" 
                    opacity={isError ? blinkAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1]
                    }) : 0.8}
                  />
                  <Rect x={p1x - 4} y={p1y - 4} width={8} height={8} fill={isError ? '#EF4444' : color} rx={1} />
                  <Rect x={p2x - 4} y={p2y - 4} width={8} height={8} fill={isError ? '#EF4444' : color} rx={1} />
                </G>
              );
            })}
          </Svg>

            {/* 2. Interaction Layer (Native Pressable Overlay) */}
            <View style={{ ...StyleSheet.absoluteFillObject }} pointerEvents="box-none">
              {activeLevel.inventory.map((_, index) => {
                const installed = installedDevices[index];
                const y = 10 + (index * SLOT_H);
                return (
                  <View key={index} style={{ position: 'absolute', top: y, left: 0, width: RACK_W, height: SLOT_H }} pointerEvents="box-none">
                    {/* General Hitbox (Install/Uninstall) */}
                    <Pressable 
                       style={{ ...StyleSheet.absoluteFillObject }}
                       onPress={() => installed ? handleUninstall(index) : setSelectedSlotForInstall(index)}
                    />
                    
                    {/* Port Specific Hitboxes (Higher Priority) */}
                    {installed && (
                      <View style={{ position: 'absolute', top: 30, left: RAIL_W + 10, flexDirection: 'row', gap: 6 }} pointerEvents="box-none">
                        {installed.ports.map((portId, pIdx) => (
                          <Pressable 
                            key={portId}
                            style={{ width: 24, height: 22 }}
                            onPress={() => handlePortPress(installed.id, portId)}
                          />
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Guidelines area */}
          <View style={styles.rulesContainer}>
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
              <MaterialIcons name="info-outline" size={16} color="#9BA1A6" />
              <Text style={styles.rulesTitle}>DIRETRIZES DO PROJETO</Text>
            </View>
            {activeLevel.rules ? activeLevel.rules.map((rule, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 4 }}>
                <Text style={styles.ruleItem}>• </Text>
                <GlossaryText text={rule} track="DataCenter" style={styles.ruleItem} />
              </View>
            )) : <Text style={styles.ruleItem}>• Siga o diagrama lógico do exercício.</Text>}
          </View>
        </ScrollView>

        <Modal visible={selectedSlotForInstall !== null} transparent animationType="slide">
          <Pressable style={styles.modalOverlay} onPress={() => setSelectedSlotForInstall(null)}>
            <View style={[styles.modalContent, { minHeight: 450 }]} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Escolha o Hardware</Text>
                <Text style={styles.modalSubtitle}>Disponível para {selectedSlotForInstall !== null ? activeLevel.inventory.length - selectedSlotForInstall : 0} U</Text>
              </View>

              <ScrollView 
                style={styles.modalScroll} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.inventoryGrid}
              >
                {activeLevel.inventory.filter(device => !Object.values(installedDevices).some(id => id.id === device.id)).map((device) => {
                  const isBlinkingItem = blinkingInventoryItem === device.id;
                  const getIcon = (type: string) => {
                    switch(type) {
                      case 'server': return 'server';
                      case 'storage': return 'database';
                      case 'network': return 'router-network';
                      case 'telecom': return 'transmission-tower';
                      case 'wireless': return 'wifi';
                      case 'security': return 'shield-check';
                      default: return 'chip';
                    }
                  };
                  return (
                    <TouchableOpacity 
                      key={device.id} 
                      onPress={() => handleInstallItem(device)} 
                      style={[
                        styles.inventoryItem, 
                        { margin: 8 }, 
                        isBlinkingItem && { borderColor: '#22C55E', borderWidth: 2, backgroundColor: '#22C55E10' }
                      ]}
                    >
                      <MaterialCommunityIcons 
                        name={getIcon(device.type) as any} 
                        size={32} 
                        color={isBlinkingItem ? '#22C55E' : '#3B82F6'} 
                      />
                      <Text style={styles.inventoryItemName} numberOfLines={2}>{device.label}</Text>
                      <Text style={styles.inventoryItemType}>{device.type.toUpperCase()}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <TouchableOpacity onPress={() => setSelectedSlotForInstall(null)} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>CANCELAR</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>

        <Modal visible={showCableMenu} transparent animationType="slide">
          <Pressable style={styles.modalOverlay} onPress={() => { setShowCableMenu(false); setSourceNode(null); }}>
            <View style={[styles.modalContent, { minHeight: 400 }]} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Selecione o Cabo</Text>
                <Text style={styles.modalSubtitle}>Para conectar {sourceNode?.deviceId}.{sourceNode?.port}</Text>
              </View>

              <ScrollView 
                style={styles.modalScroll} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.cableGrid}
              >
                {data.cables.map((cable) => (
                  <TouchableOpacity 
                    key={cable.id} 
                    onPress={() => { setSelectedCable(cable); setShowCableMenu(false); }} 
                    style={styles.cableMenuItem}
                  >
                    <View style={[styles.cableIconCircle, { backgroundColor: cable.type === 'fiber' ? '#F43F5E20' : (cable.type === 'ethernet' ? '#3B82F620' : '#F59E0B20') }]}>
                      <MaterialCommunityIcons 
                        name="lan" 
                        size={24} 
                        color={cable.type === 'fiber' ? '#F43F5E' : (cable.type === 'ethernet' ? '#3B82F6' : '#F59E0B')} 
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cableMenuName}>{cable.id.toUpperCase()}</Text>
                      <Text style={styles.cableMenuDesc} numberOfLines={2}>{cable.speed} • {cable.type.toUpperCase()}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity onPress={() => { setShowCableMenu(false); setSourceNode(null); }} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>CANCELAR</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>

        {sourceNode && selectedCable && (
          <View style={styles.floatingIndicator}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><MaterialCommunityIcons name="alert-circle-outline" size={24} color="#000" /><View><Text style={styles.floatingText}>CABO {selectedCable.id.toUpperCase()} ATIVO</Text><Text style={{ color: 'rgba(0,0,0,0.6)', fontSize: 11, fontWeight: '700' }}>Toque na porta de destino</Text></View></View>
            <TouchableOpacity onPress={() => { setSourceNode(null); setSelectedCable(null); }} style={styles.cancelLink}><Text style={styles.cancelLinkText}>ANULAR</Text></TouchableOpacity>
          </View>
        )}

        <StudyCompletionOverlay 
          visible={showCompletionEffect || finished} 
          correctCount={connections.length} 
          totalCards={activeLevel.connections_required.length} 
          backgroundOpacity={completionBgOpacity}
          iconScale={completionIconScale}
          textOpacity={completionTextOpacity}
          ringScale={completionRingScale} 
          ringOpacity={completionRingOpacity} 
          title="DataCenter Online!"
          subtitle={`Projeto concluído em ${Math.floor(elapsedTime / 60)}m`}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {!activeLevel ? renderLevelList() : renderWorkbench()}

      {showSuccessTransition && (
        <Animated.View style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(13, 15, 16, 0.9)',
          zIndex: 9999,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: successOpacity
        }}>
          <Animated.View style={{
            transform: [{ scale: successScale }],
            alignItems: 'center'
          }}>
            <View style={{
              width: 160,
              height: 160,
              borderRadius: 80,
              backgroundColor: '#22C55E',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#22C55E',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 40,
              elevation: 20
            }}>
              <MaterialIcons name="check" size={100} color="#FFFFFF" />
            </View>
            <Text style={{ 
              color: '#22C55E', 
              fontSize: 24, 
              fontWeight: '900', 
              marginTop: 32,
              letterSpacing: 2,
              textTransform: 'uppercase'
            }}>
              Projeto Homologado
            </Text>
          </Animated.View>
        </Animated.View>
      )}
        <Modal visible={showPhaseAlert} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { maxWidth: 340, alignItems: 'center' }]}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#F59E0B20', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <MaterialIcons name="warning-amber" size={32} color="#F59E0B" />
              </View>
              <Text style={[styles.modalTitle, { textAlign: 'center' }]}>Fase 1 Pendente</Text>
              <Text style={{ color: '#A1A1AA', textAlign: 'center', marginTop: 12, lineHeight: 20, fontSize: 14 }}>
                Você ainda possui equipamentos no inventário. Finalize a instalação de todo o hardware no rack antes de iniciar o cabeamento.
              </Text>
              <TouchableOpacity 
                onPress={() => setShowPhaseAlert(false)} 
                style={[styles.modalCloseButton, { width: '100%', backgroundColor: '#F59E0B', borderColor: '#F59E0B', marginTop: 32 }]}
              >
                <Text style={[styles.modalCloseText, { color: '#000' }]}>ENTENDI</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Modal de Erro de Validação/Arquitetura */}
        <Modal visible={validationError !== null} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { maxWidth: 340, alignItems: 'center', borderColor: '#EF444430' }]}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#EF444420', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <MaterialIcons name="error-outline" size={32} color="#EF4444" />
              </View>
              <Text style={[styles.modalTitle, { textAlign: 'center', color: '#EF4444' }]}>{validationError?.title}</Text>
              <Text style={{ color: '#A1A1AA', textAlign: 'center', marginTop: 12, lineHeight: 20, fontSize: 13 }}>
                {validationError?.message}
              </Text>
              <TouchableOpacity 
                onPress={() => setValidationError(null)} 
                style={[styles.modalCloseButton, { width: '100%', backgroundColor: '#EF4444', borderColor: '#EF4444', marginTop: 32 }]}
              >
                <Text style={[styles.modalCloseText, { color: '#FFF' }]}>REVISAR PROJETO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Dashboard de Resultados Final */}
        <Modal visible={finished} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { maxHeight: '90%', padding: 20 }]}>
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: finalScore >= 90 ? '#22C55E20' : '#F59E0B20', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <MaterialIcons name={finalScore >= 90 ? "verified" : "assignment-turned-in"} size={48} color={finalScore >= 90 ? "#22C55E" : "#F59E0B"} />
                </View>
                <Text style={[styles.modalTitle, { fontSize: 24 }]}>PROJETO HOMOLOGADO</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 8 }}>
                  <Text style={{ fontSize: 48, fontWeight: '900', color: finalScore >= 90 ? '#22C55E' : '#F59E0B' }}>{finalScore}</Text>
                  <Text style={{ fontSize: 18, color: '#71717A', fontWeight: '700', marginLeft: 4 }}>% EFICIÊNCIA</Text>
                </View>
              </View>

              {recommendations.length > 0 && (
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#ECEDEE', fontSize: 14, fontWeight: '900', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Recomendações Técnicas:</Text>
                  <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    {recommendations.map((rec, i) => (
                      <View key={i} style={{ backgroundColor: '#1A1A1E', padding: 12, borderRadius: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#F59E0B' }}>
                        <Text style={{ color: '#A1A1AA', fontSize: 12, lineHeight: 18 }}>{rec}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
                <TouchableOpacity 
                  onPress={() => setFinished(false)} 
                  style={[styles.modalCloseButton, { flex: 1, backgroundColor: 'transparent', borderColor: '#27272A', marginTop: 0 }]}
                >
                  <Text style={styles.modalCloseText}>REVISAR</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => goToNextLevel()} 
                  style={[styles.modalCloseButton, { flex: 2, backgroundColor: '#3B82F6', borderColor: '#3B82F6', marginTop: 0 }]}
                >
                  <Text style={[styles.modalCloseText, { color: '#FFF' }]}>PRÓXIMO NÍVEL</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

const styles = StyleSheet.create({
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, marginTop: 4, lineHeight: 20 },
  levelGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 24 },
  levelCard: { flexBasis: '48%', flexGrow: 1, padding: 16, borderRadius: 20, borderWidth: 1, position: 'relative' },
  levelBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#3B82F620', alignItems: 'center', justifyContent: 'center' },
  levelNumber: { color: '#3B82F6', fontWeight: '800' },
  levelTier: { color: '#3B82F6', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', marginBottom: 4 },
  levelName: { fontSize: 14, fontWeight: '800', marginBottom: 8 },
  levelDescription: { color: '#9BA1A6', fontSize: 11, lineHeight: 16, marginTop: 4 },
  difficultyBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  difficultyText: { fontSize: 9, fontWeight: '800' },
  doneIcon: { position: 'absolute', top: 58, right: 12 },
  
  workbenchHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingBottom: 15,
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1E'
  },
  closeButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#1A1A1E', alignItems: 'center', justifyContent: 'center' },
  workbenchTitle: { fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  workbenchLevelName: { color: '#ECEDEE', fontSize: 16, fontWeight: '900' },
  workbenchStatus: { color: '#71717A', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginTop: 2 },
  validateButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  validateButtonText: { color: '#FFF', fontWeight: '900', fontSize: 12 },

  rackContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#0A0A0A', 
    borderRadius: 8, 
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20
  },
  rackRailLeft: { 
    width: 28, 
    backgroundColor: '#151515', 
    borderTopLeftRadius: 6, 
    borderBottomLeftRadius: 6, 
    borderRightWidth: 1, 
    borderColor: '#222',
    alignItems: 'center',
    paddingVertical: 4
  },
  rackRailRight: { 
    width: 28, 
    backgroundColor: '#151515', 
    borderTopRightRadius: 6, 
    borderBottomRightRadius: 6, 
    borderLeftWidth: 1, 
    borderColor: '#222',
    alignItems: 'center',
    paddingVertical: 4
  },
  railHole: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#222',
    shadowColor: '#555',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1
  },
  uLabel: {
    color: '#444',
    fontSize: 9,
    fontWeight: '900',
    position: 'absolute',
    left: 4,
  },
  rackMain: { flex: 1, gap: 2, paddingHorizontal: 2 },
  rackSlot: { height: 54, borderRadius: 2, position: 'relative', marginVertical: 1, overflow: 'hidden' },
  emptySlot: { 
    height: 54,
    backgroundColor: '#080808', 
    borderWidth: 1, 
    borderColor: '#111', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 2
  },
  slotEmptyContent: { flexDirection: 'row', alignItems: 'center', opacity: 0.3, gap: 8 },
  slotEmptyText: { color: '#333', fontSize: 11, fontWeight: '900' },

  deviceRow: { 
    width: '100%',
    height: 54,
    maxHeight: 54,
    backgroundColor: '#18181B', 
    borderRadius: 2, 
    borderWidth: 1, 
    borderColor: '#27272A',
    flexDirection: 'row',
    overflow: 'hidden'
  },
  devicePanel: {
    flex: 1,
    height: 52,
    backgroundColor: '#1A1A1E',
    paddingVertical: 0,
    paddingHorizontal: 6,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#2D2D33',
    position: 'relative',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  deviceBrushedEffect: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.03)',
    zIndex: 0
  },
  deviceHandle: {
    width: 14,
    backgroundColor: '#0D0D0F',
    borderWidth: 1,
    borderColor: '#1A1A1E',
    justifyContent: 'center',
    alignItems: 'center'
  },
  handleGrip: {
    width: 4,
    height: '60%',
    backgroundColor: '#222',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#333'
  },
  deviceHeader: { 
    paddingHorizontal: 4, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  deviceName: { color: '#ECEDEE', fontSize: 10, fontWeight: '900', letterSpacing: 0.2 },
  deviceType: { color: '#71717A', fontSize: 7, textTransform: 'uppercase', fontWeight: '800' },
  ledsContainer: { flexDirection: 'row', gap: 2, paddingHorizontal: 2 },
  led: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#111' },
  ledActiveGreen: { 
    backgroundColor: '#22C55E', 
    shadowColor: '#22C55E', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4,
    elevation: 3
  },
  ledActiveOrange: { 
    backgroundColor: '#F59E0B', 
    shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4,
    elevation: 3
  },
  ledActiveRed: { 
    backgroundColor: '#EF4444', 
    shadowColor: '#EF4444', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4,
    elevation: 3
  },
  ledPowerOn: { 
    backgroundColor: '#3B82F6', 
    shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4,
    elevation: 3
  },
  portsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4
  },
  port: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1.5,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#111', 
    borderColor: 'rgba(255,255,255,0.1)'
  },
  portHole: { width: 10, height: 10, borderRadius: 1.5, backgroundColor: '#222' },
  portLabel: { color: '#666', fontSize: 5, fontWeight: '800', position: 'absolute', bottom: -1, right: 1 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#0D0F10', borderRadius: 24, padding: 24, width: '100%', maxWidth: 500, maxHeight: '80%', borderWidth: 1, borderColor: '#1F1F23' },
  modalHeader: { marginBottom: 32, alignItems: 'center' },
  modalTitle: { color: '#F4F4F5', fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  modalSubtitle: { color: '#3B82F6', fontSize: 13, fontWeight: '800', marginTop: 6, textTransform: 'uppercase' },
  modalScroll: { flex: 1 },
  modalCloseButton: { marginTop: 24, paddingVertical: 16, backgroundColor: '#18181B', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#27272A' },
  modalCloseText: { color: '#A1A1AA', fontWeight: '900', fontSize: 14 },

  inventoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  inventoryItem: { 
    width: 100, 
    height: 120, 
    backgroundColor: '#1E1E22', 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    borderWidth: 1, 
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    padding: 8
  },
  inventoryItemName: { color: '#F4F4F5', fontSize: 11, fontWeight: '900', textAlign: 'center' },
  inventoryItemType: { color: '#71717A', fontSize: 9, textTransform: 'uppercase', fontWeight: '700' },

  cableGrid: { gap: 14 },
  cableMenuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 16, 
    backgroundColor: '#18181B', 
    padding: 16, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#27272A' 
  },
  cableIconCircle: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333' },
  cableMenuName: { color: '#F4F4F5', fontSize: 16, fontWeight: '900' },
  cableMenuDesc: { color: '#71717A', fontSize: 12, fontWeight: '600' },

  rulesContainer: { marginTop: 32, padding: 20, backgroundColor: '#111', borderRadius: 16, borderWidth: 1, borderColor: '#1F1F23' },
  rulesTitle: { color: '#A1A1AA', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  ruleItem: { color: '#52525B', fontSize: 13, marginTop: 8, fontWeight: '600' },

  floatingIndicator: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: '#F59E0B', borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, elevation: 15, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 10 },
  floatingText: { color: '#000', fontWeight: '900', fontSize: 14 },
  cancelLink: { backgroundColor: '#000', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  cancelLinkText: { color: '#FFF', fontWeight: '900', fontSize: 12 },

  successIconOuter: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: `${QUIZ_COLORS.success}40`, backgroundColor: `${QUIZ_COLORS.success}10`, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  concluidoTitle: { fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  concluidoSubtitle: { fontSize: 15, marginTop: 8, textAlign: 'center', lineHeight: 22 },
  primaryAction: { padding: 18, borderRadius: 18, backgroundColor: QUIZ_COLORS.success, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, shadowColor: QUIZ_COLORS.success, shadowOpacity: 0.4, shadowRadius: 10 },
  primaryActionText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  secondaryAction: { padding: 18, borderRadius: 18, backgroundColor: 'transparent', borderWidth: 2, borderColor: '#2D3139', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  secondaryActionText: { fontWeight: '900', fontSize: 16 }
});

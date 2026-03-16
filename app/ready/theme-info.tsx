import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { getCategoryDocumentation } from '@/data/documentation';
import { useScreenSize } from '@/hooks/use-screen-size';

// Componente para renderizar conteúdo formatado (markdown-like)
function FormattedContent({ content }: { content: string }) {
  const parts = useMemo(() => {
    const result: Array<{ type: 'text' | 'bold' | 'code' | 'codeblock'; value: string }> = [];
    
    // Dividir por blocos de código primeiro (linhas que começam com espaços/tabs e contêm código)
    const lines = content.split('\n');
    let currentBlock: string[] = [];
    let inCodeBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isCodeLine = line.startsWith('  `') || (inCodeBlock && line.startsWith('  '));
      
      if (isCodeLine && line.includes('`')) {
        // Linha de código
        if (!inCodeBlock) {
          // Flush texto anterior
          if (currentBlock.length > 0) {
            result.push({ type: 'text', value: currentBlock.join('\n') });
            currentBlock = [];
          }
          inCodeBlock = true;
        }
        currentBlock.push(line);
      } else if (inCodeBlock && line.trim() === '') {
        // Linha vazia dentro de bloco de código
        currentBlock.push(line);
      } else {
        // Texto normal
        if (inCodeBlock) {
          // Flush bloco de código
          result.push({ type: 'codeblock', value: currentBlock.join('\n') });
          currentBlock = [];
          inCodeBlock = false;
        }
        currentBlock.push(line);
      }
    }
    
    // Flush final
    if (currentBlock.length > 0) {
      if (inCodeBlock) {
        result.push({ type: 'codeblock', value: currentBlock.join('\n') });
      } else {
        result.push({ type: 'text', value: currentBlock.join('\n') });
      }
    }
    
    return result;
  }, [content]);

  return (
    <View style={{ gap: 8 }}>
      {parts.map((part, idx) => {
        if (part.type === 'codeblock') {
          // Extrair código do bloco (remover backticks e indentação)
          const code = part.value
            .split('\n')
            .map(line => line.replace(/^\s*`/, '').replace(/`$/, ''))
            .join('\n')
            .trim();
          
          return (
            <View
              key={idx}
              style={{
                backgroundColor: '#0A0C0E',
                borderRadius: 10,
                padding: 14,
                borderWidth: 1,
                borderColor: '#2D3748',
                marginVertical: 4,
              }}>
              <Text
                style={{
                  fontFamily: 'monospace',
                  fontSize: 12,
                  color: '#E2E8F0',
                  lineHeight: 20,
                }}>
                {code}
              </Text>
            </View>
          );
        }
        
        // Renderizar texto com formatação inline
        return <InlineFormattedText key={idx} text={part.value} />;
      })}
    </View>
  );
}

// Componente para texto com formatação inline (**bold** e `code`)
function InlineFormattedText({ text }: { text: string }) {
  const parts = useMemo(() => {
    const result: Array<{ type: 'text' | 'bold' | 'code'; value: string }> = [];
    // Regex para **bold**, `code` inline
    const regex = /(\*\*[^*]+\*\*)|(`[^`]+`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Texto antes do match
      if (match.index > lastIndex) {
        result.push({ type: 'text', value: text.slice(lastIndex, match.index) });
      }

      const matchText = match[0];
      if (matchText.startsWith('**')) {
        result.push({ type: 'bold', value: matchText.slice(2, -2) });
      } else if (matchText.startsWith('`')) {
        result.push({ type: 'code', value: matchText.slice(1, -1) });
      }

      lastIndex = regex.lastIndex;
    }

    // Texto restante
    if (lastIndex < text.length) {
      result.push({ type: 'text', value: text.slice(lastIndex) });
    }

    return result;
  }, [text]);

  return (
    <Text style={{ color: '#9BA1A6', fontSize: 14, lineHeight: 24 }}>
      {parts.map((part, idx) => {
        if (part.type === 'bold') {
          return (
            <Text key={idx} style={{ color: '#60A5FA', fontWeight: '700', fontSize: 14 }}>
              {part.value}
            </Text>
          );
        }
        if (part.type === 'code') {
          return (
            <Text
              key={idx}
              style={{
                fontFamily: 'monospace',
                backgroundColor: '#1E293B',
                color: '#F472B6',
                fontSize: 12,
                paddingHorizontal: 4,
                borderRadius: 4,
              }}>
              {part.value}
            </Text>
          );
        }
        return <Text key={idx}>{part.value}</Text>;
      })}
    </Text>
  );
}

export default function ReadyThemeInfoScreen() {
  const router = useRouter();
  const { track, category } = useLocalSearchParams<{ track: string; category: string }>();
  const { isDesktop: isDesktopWidth, isTablet: isTabletWidth } = useScreenSize();

  const decodedTrack = useMemo(() => decodeURIComponent(track ?? ''), [track]);
  const decodedCategory = useMemo(() => decodeURIComponent(category ?? ''), [category]);

  const doc = useMemo(
    () => getCategoryDocumentation(decodedTrack, decodedCategory),
    [decodedTrack, decodedCategory]
  );

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-[#0A0C0E]"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: isDesktopWidth || isTabletWidth ? 32 : 20,
        paddingTop: isDesktopWidth || isTabletWidth ? 32 : 56,
        paddingBottom: 100,
      }}>
      {/* Botão Voltar */}
      <Pressable
        onPress={() => router.back()}
        style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          gap: 6, 
          marginBottom: 20, 
          alignSelf: 'flex-start',
          backgroundColor: '#1E293B',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
        }}>
        <MaterialIcons name="arrow-back" size={16} color="#94A3B8" />
        <Text style={{ color: '#94A3B8', fontSize: 13, fontWeight: '500' }}>Voltar</Text>
      </Pressable>

      {doc ? (
        <>
          {/* Header com gradiente visual */}
          <View 
            style={{ 
              backgroundColor: '#111827',
              borderRadius: 20,
              padding: 24,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: '#1F2937',
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <View style={{ 
                backgroundColor: '#312E81', 
                padding: 12, 
                borderRadius: 14,
              }}>
                <MaterialIcons name="terminal" size={24} color="#A5B4FC" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#F1F5F9', fontSize: 22, fontWeight: '700', letterSpacing: -0.5 }}>
                  {doc.title}
                </Text>
                <Text style={{ color: '#64748B', fontSize: 12, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {decodedTrack} • Referência
                </Text>
              </View>
            </View>
            
            {/* Introdução */}
            <Text style={{ color: '#94A3B8', fontSize: 14, lineHeight: 22, marginTop: 8 }}>
              {doc.introduction}
            </Text>
          </View>

          {/* Seções */}
          {doc.sections.map((section, idx) => (
            <View
              key={idx}
              style={{
                backgroundColor: '#111827',
                borderRadius: 16,
                padding: 20,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#1F2937',
              }}>
              {/* Header da seção */}
              <View 
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  gap: 10, 
                  marginBottom: 16,
                  paddingBottom: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#1F2937',
                }}>
                <View style={{
                  backgroundColor: '#1E3A5F',
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{ color: '#60A5FA', fontSize: 14, fontWeight: '700' }}>
                    {idx + 1}
                  </Text>
                </View>
                <Text style={{ color: '#F1F5F9', fontSize: 16, fontWeight: '600', flex: 1 }}>
                  {section.heading.replace(/^📖\s*/, '')}
                </Text>
              </View>
              
              {/* Conteúdo formatado */}
              <FormattedContent content={section.content} />
            </View>
          ))}

          {/* Tópicos Principais - Pill badges modernos */}
          <View
            style={{
              backgroundColor: '#111827',
              borderRadius: 16,
              padding: 20,
              marginTop: 8,
              borderWidth: 1,
              borderColor: '#1F2937',
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <View style={{
                backgroundColor: '#713F12',
                padding: 8,
                borderRadius: 8,
              }}>
                <MaterialIcons name="auto-awesome" size={16} color="#FCD34D" />
              </View>
              <Text style={{ color: '#F1F5F9', fontSize: 16, fontWeight: '600' }}>
                Comandos Essenciais
              </Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {doc.keyTopics.map((topic, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: '#1E293B',
                    borderRadius: 20,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderWidth: 1,
                    borderColor: '#334155',
                  }}>
                  <Text style={{ 
                    color: '#E2E8F0', 
                    fontSize: 12, 
                    fontWeight: '500',
                    fontFamily: 'monospace',
                  }}>
                    {topic}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </>
      ) : (
        /* Fallback para categorias sem documentação */
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <View style={{
            backgroundColor: '#1F2937',
            padding: 20,
            borderRadius: 20,
          }}>
            <MaterialIcons name="construction" size={48} color="#6B7280" />
          </View>
          <Text style={{ color: '#F1F5F9', fontSize: 18, fontWeight: '600', marginTop: 16 }}>
            Documentação em breve
          </Text>
          <Text style={{ color: '#64748B', fontSize: 14, marginTop: 8, textAlign: 'center' }}>
            {`A documentação para "${decodedCategory}" está sendo preparada.`}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}


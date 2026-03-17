import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { MathGeometry } from './math-geometry';

type CalloutType = 'important' | 'tip' | 'result' | 'formula' | 'example';

type ContentPart =
  | { type: 'text'; value: string }
  | { type: 'codeblock'; value: string; blockType: string }
  | { type: 'callout'; value: string; calloutType: CalloutType };

type FormattedContentProps = {
  content: string;
};

const CALLOUT_PATTERN = /^\[!(IMPORTANT|TIP|RESULT|FORMULA|EXAMPLE)\]\s*$/;

function splitTextSections(text: string): ContentPart[] {
  return text
    .split(/\n\s*\n/)
    .map((section) => section.trim())
    .filter(Boolean)
    .map((section) => {
      const lines = section.split('\n');
      const marker = lines[0]?.trim().match(CALLOUT_PATTERN);

      if (marker) {
        return {
          type: 'callout' as const,
          calloutType: marker[1].toLowerCase() as CalloutType,
          value: lines.slice(1).join('\n').trim(),
        };
      }

      return { type: 'text' as const, value: section };
    });
}

function CalloutBlock({ type, text }: { type: CalloutType; text: string }) {
  const styles = {
    important: {
      title: 'Importante',
      icon: '⚠️',
      borderColor: '#F59E0B',
      backgroundColor: 'rgba(245,158,11,0.12)',
      titleColor: '#FCD34D',
    },
    tip: {
      title: 'Dica',
      icon: '💡',
      borderColor: '#14B8A6',
      backgroundColor: 'rgba(20,184,166,0.12)',
      titleColor: '#5EEAD4',
    },
    result: {
      title: 'Resultado',
      icon: '✅',
      borderColor: '#22C55E',
      backgroundColor: 'rgba(34,197,94,0.12)',
      titleColor: '#86EFAC',
    },
    formula: {
      title: 'Fórmula-chave',
      icon: '📐',
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59,130,246,0.12)',
      titleColor: '#93C5FD',
    },
    example: {
      title: 'Leitura do exemplo',
      icon: '🧭',
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139,92,246,0.12)',
      titleColor: '#C4B5FD',
    },
  }[type];

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: styles.borderColor,
        backgroundColor: styles.backgroundColor,
        borderRadius: 12,
        padding: 14,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Text style={{ fontSize: 16 }}>{styles.icon}</Text>
        <Text style={{ color: styles.titleColor, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 }}>
          {styles.title}
        </Text>
      </View>
      <InlineFormattedText text={text} />
    </View>
  );
}

function CodeBlock({ text, blockType }: { text: string; blockType: string }) {
  const normalizedType = blockType.toLowerCase();
  if (normalizedType === 'geometry') {
    return <MathGeometry text={text} />;
  }

  const blockStyles =
    normalizedType === 'diagram'
      ? {
          borderColor: '#334155',
          backgroundColor: '#0B1220',
          textColor: '#DBEAFE',
          label: 'Diagrama',
        }
      : normalizedType === 'formula'
        ? {
            borderColor: '#1D4ED8',
            backgroundColor: '#0F172A',
            textColor: '#BFDBFE',
            label: 'Fórmula',
          }
        : {
            borderColor: '#2D3748',
            backgroundColor: '#0A0C0E',
            textColor: '#E2E8F0',
            label: 'Bloco',
          };

  return (
    <View
      style={{
        backgroundColor: blockStyles.backgroundColor,
        borderRadius: 10,
        padding: 14,
        borderWidth: 1,
        borderColor: blockStyles.borderColor,
        marginVertical: 4,
      }}>
      <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 }}>
        {blockStyles.label}
      </Text>
      <Text
        style={{
          fontFamily: 'monospace',
          fontSize: normalizedType === 'formula' ? 13 : 12,
          color: blockStyles.textColor,
          lineHeight: normalizedType === 'formula' ? 22 : 20,
          textAlign: normalizedType === 'diagram' ? 'center' : 'left',
        }}>
        {text.trim()}
      </Text>
    </View>
  );
}

function InlineFormattedText({ text }: { text: string }) {
  const parts = useMemo(() => {
    const result: { type: 'text' | 'bold' | 'code'; value: string }[] = [];
    const regex = /(\*\*[^*]+\*\*)|(`[^`]+`)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
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

    if (lastIndex < text.length) {
      result.push({ type: 'text', value: text.slice(lastIndex) });
    }

    return result;
  }, [text]);

  return (
    <Text style={{ color: '#9BA1A6', fontSize: 14, lineHeight: 24 }}>
      {parts.map((part, index) => {
        if (part.type === 'bold') {
          return (
            <Text key={index} style={{ color: '#60A5FA', fontWeight: '700', fontSize: 14 }}>
              {part.value}
            </Text>
          );
        }
        if (part.type === 'code') {
          return (
            <Text
              key={index}
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
        return <Text key={index}>{part.value}</Text>;
      })}
    </Text>
  );
}

export function FormattedContent({ content }: FormattedContentProps) {
  const parts = useMemo(() => {
    const result: ContentPart[] = [];
    const lines = content.split('\n');
    let currentBlock: string[] = [];
    let codeLines: string[] = [];
    let inCodeBlock = false;
    let currentBlockType = 'code';

    function flushTextBlock() {
      const text = currentBlock.join('\n').trim();
      if (text) {
        result.push(...splitTextSections(text));
      }
      currentBlock = [];
    }

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('```')) {
        if (inCodeBlock) {
          result.push({
            type: 'codeblock',
            value: codeLines.join('\n'),
            blockType: currentBlockType,
          });
          codeLines = [];
          currentBlockType = 'code';
          inCodeBlock = false;
        } else {
          flushTextBlock();
          inCodeBlock = true;
          currentBlockType = trimmedLine.slice(3).trim() || 'code';
        }
      } else if (inCodeBlock) {
        codeLines.push(line);
      } else {
        currentBlock.push(line);
      }
    }

    if (inCodeBlock) {
      result.push({ type: 'codeblock', value: codeLines.join('\n'), blockType: currentBlockType });
    } else {
      flushTextBlock();
    }

    return result;
  }, [content]);

  return (
    <View style={{ gap: 8 }}>
      {parts.map((part, index) => {
        if (part.type === 'codeblock') {
          return <CodeBlock key={index} text={part.value} blockType={part.blockType} />;
        }

        if (part.type === 'callout') {
          return <CalloutBlock key={index} type={part.calloutType} text={part.value} />;
        }

        return <InlineFormattedText key={index} text={part.value} />;
      })}
    </View>
  );
}

import { Text, View } from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';

type GeometryType =
  | 'right-triangle'
  | 'cone-section'
  | 'parabola'
  | 'case-split'
  | 'number-line'
  | 'urn-probability'
  | 'growth-comparison'
  | 'truth-table'
  | 'sarrus-grid'
  | 'percentage-flow'
  | 'bounce-sequence'
  | 'ratio-bars';

type GeometrySpec = {
  type: GeometryType;
  title?: string;
  width?: number;
  height?: number;
  baseLabel?: string;
  heightLabel?: string;
  hypotenuseLabel?: string;
  angleLabel?: string;
  vertexTopLabel?: string;
  vertexLeftLabel?: string;
  vertexRightLabel?: string;
  note?: string;
  axisXLabel?: string;
  axisYLabel?: string;
  pointLabel?: string;
  startLabel?: string;
  endLabel?: string;
  intervalLabel?: string;
  caseOneLabel?: string;
  caseTwoLabel?: string;
  caseThreeLabel?: string;
  redCount?: number;
  blueCount?: number;
  firstPickLabel?: string;
  secondPickLabel?: string;
  simpleLabel?: string;
  compoundLabel?: string;
  finalLabel?: string;
  row1?: string;
  row2?: string;
  row3?: string;
  stepOneLabel?: string;
  stepTwoLabel?: string;
  stepThreeLabel?: string;
  levelOneLabel?: string;
  levelTwoLabel?: string;
  levelThreeLabel?: string;
  levelFourLabel?: string;
  labelA?: string;
  labelB?: string;
  labelC?: string;
  ratioA?: number;
  ratioB?: number;
  ratioC?: number;
};

const COLORS = {
  stroke: '#BFDBFE',
  accent: '#60A5FA',
  soft: '#93C5FD',
  muted: '#64748B',
  point: '#F8FAFC',
  highlight: '#FCD34D',
  success: '#86EFAC',
} as const;

function toNumber(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toInteger(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function parseGeometryBlock(text: string): GeometrySpec | null {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const entries = Object.fromEntries(
    lines.map((line) => {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex === -1) return [line, ''];
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      return [key, value];
    }),
  );

  const allowedTypes: GeometryType[] = [
    'right-triangle',
    'cone-section',
    'parabola',
    'case-split',
    'number-line',
    'urn-probability',
    'growth-comparison',
    'truth-table',
    'sarrus-grid',
    'percentage-flow',
    'bounce-sequence',
    'ratio-bars',
  ];

  const type = entries.type as GeometryType | undefined;
  if (!type || !allowedTypes.includes(type)) {
    return null;
  }

  return {
    type,
    title: entries.title,
    width: toNumber(entries.width, 280),
    height: toNumber(entries.height, type === 'parabola' ? 180 : 170),
    baseLabel: entries.baseLabel,
    heightLabel: entries.heightLabel,
    hypotenuseLabel: entries.hypotenuseLabel,
    angleLabel: entries.angleLabel,
    vertexTopLabel: entries.vertexTopLabel,
    vertexLeftLabel: entries.vertexLeftLabel,
    vertexRightLabel: entries.vertexRightLabel,
    note: entries.note,
    axisXLabel: entries.axisXLabel,
    axisYLabel: entries.axisYLabel,
    pointLabel: entries.pointLabel,
    startLabel: entries.startLabel,
    endLabel: entries.endLabel,
    intervalLabel: entries.intervalLabel,
    caseOneLabel: entries.caseOneLabel,
    caseTwoLabel: entries.caseTwoLabel,
    caseThreeLabel: entries.caseThreeLabel,
    redCount: toInteger(entries.redCount, 5),
    blueCount: toInteger(entries.blueCount, 3),
    firstPickLabel: entries.firstPickLabel,
    secondPickLabel: entries.secondPickLabel,
    simpleLabel: entries.simpleLabel,
    compoundLabel: entries.compoundLabel,
    finalLabel: entries.finalLabel,
    row1: entries.row1,
    row2: entries.row2,
    row3: entries.row3,
    stepOneLabel: entries.stepOneLabel,
    stepTwoLabel: entries.stepTwoLabel,
    stepThreeLabel: entries.stepThreeLabel,
    levelOneLabel: entries.levelOneLabel,
    levelTwoLabel: entries.levelTwoLabel,
    levelThreeLabel: entries.levelThreeLabel,
    levelFourLabel: entries.levelFourLabel,
    labelA: entries.labelA,
    labelB: entries.labelB,
    labelC: entries.labelC,
    ratioA: toInteger(entries.ratioA, 2),
    ratioB: toInteger(entries.ratioB, 3),
    ratioC: toInteger(entries.ratioC, 5),
  };
}

function splitCells(row: string | undefined, fallback: string[]) {
  if (!row) return fallback;
  const cells = row
    .split(',')
    .map((cell) => cell.trim())
    .filter(Boolean);
  return cells.length > 0 ? cells : fallback;
}

function FigureContainer({ title, note, children }: { title?: string; note?: string; children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: '#0B1220',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#334155',
        padding: 14,
        alignItems: 'center',
      }}>
      {title ? (
        <View
          style={{
            alignSelf: 'stretch',
            marginBottom: 10,
            backgroundColor: 'rgba(37,99,235,0.16)',
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}>
          <Text style={{ color: COLORS.soft, fontSize: 12, fontWeight: '700', textAlign: 'center' }}>{title}</Text>
        </View>
      ) : null}
      {children}
      {note ? (
        <View style={{ alignSelf: 'stretch', marginTop: 10, borderTopWidth: 1, borderTopColor: '#1E293B', paddingTop: 8 }}>
          <Text style={{ color: COLORS.muted, fontSize: 11, lineHeight: 16, textAlign: 'center' }}>{note}</Text>
        </View>
      ) : null}
    </View>
  );
}

function RightTriangleFigure({ spec }: { spec: GeometrySpec }) {
  const width = spec.width ?? 280;
  const height = spec.height ?? 170;
  const left = 42;
  const bottom = height - 28;
  const top = 24;
  const right = width - 34;

  return (
    <FigureContainer title={spec.title} note={spec.note}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Polygon points={`${left},${bottom} ${left},${top} ${right},${bottom}`} fill="rgba(37,99,235,0.08)" stroke={COLORS.stroke} strokeWidth="2.5" />
        <Line x1={left} y1={bottom} x2={left + 18} y2={bottom} stroke={COLORS.highlight} strokeWidth="2" />
        <Line x1={left} y1={bottom} x2={left} y2={bottom - 18} stroke={COLORS.highlight} strokeWidth="2" />
        <Line x1={left + 32} y1={bottom} x2={left + 32} y2={bottom - 42} stroke={COLORS.muted} strokeDasharray="5 5" strokeWidth="1.5" />

        <Circle cx={left} cy={bottom} r="3.5" fill={COLORS.point} />
        <Circle cx={left} cy={top} r="3.5" fill={COLORS.point} />
        <Circle cx={right} cy={bottom} r="3.5" fill={COLORS.point} />

        <SvgText x={left - 12} y={bottom + 16} fill={COLORS.point} fontSize="13" fontWeight="700">{spec.vertexLeftLabel ?? 'A'}</SvgText>
        <SvgText x={left - 12} y={top - 8} fill={COLORS.point} fontSize="13" fontWeight="700">{spec.vertexTopLabel ?? 'C'}</SvgText>
        <SvgText x={right + 8} y={bottom + 16} fill={COLORS.point} fontSize="13" fontWeight="700">{spec.vertexRightLabel ?? 'B'}</SvgText>

        {spec.heightLabel ? (
          <SvgText x={left - 6} y={(top + bottom) / 2} fill={COLORS.success} fontSize="13" fontWeight="700" textAnchor="end">
            {spec.heightLabel}
          </SvgText>
        ) : null}
        {spec.baseLabel ? (
          <SvgText x={(left + right) / 2} y={bottom + 24} fill={COLORS.success} fontSize="13" fontWeight="700" textAnchor="middle">
            {spec.baseLabel}
          </SvgText>
        ) : null}
        {spec.hypotenuseLabel ? (
          <SvgText x={(left + right) / 2 + 22} y={(top + bottom) / 2 - 8} fill={COLORS.soft} fontSize="13" fontWeight="700" textAnchor="middle">
            {spec.hypotenuseLabel}
          </SvgText>
        ) : null}
        {spec.angleLabel ? (
          <SvgText x={left + 18} y={bottom - 8} fill={COLORS.highlight} fontSize="13" fontWeight="700">
            {spec.angleLabel}
          </SvgText>
        ) : null}
      </Svg>
    </FigureContainer>
  );
}

function ConeSectionFigure({ spec }: { spec: GeometrySpec }) {
  const width = spec.width ?? 280;
  const height = spec.height ?? 180;
  const apexX = width / 2;
  const apexY = 22;
  const baseY = height - 34;
  const baseLeft = 58;
  const baseRight = width - 58;
  const centerX = width / 2;

  return (
    <FigureContainer title={spec.title} note={spec.note}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Polygon points={`${apexX},${apexY} ${baseLeft},${baseY} ${baseRight},${baseY}`} fill="rgba(37,99,235,0.08)" stroke={COLORS.stroke} strokeWidth="2.5" />
        <Ellipse cx={centerX} cy={baseY} rx={(baseRight - baseLeft) / 2} ry="10" fill="rgba(37,99,235,0.06)" stroke={COLORS.muted} strokeWidth="1.5" />
        <Line x1={apexX} y1={apexY} x2={centerX} y2={baseY} stroke={COLORS.highlight} strokeWidth="2" strokeDasharray="6 5" />

        <Circle cx={apexX} cy={apexY} r="3.5" fill={COLORS.point} />
        <Circle cx={baseLeft} cy={baseY} r="3.5" fill={COLORS.point} />
        <Circle cx={baseRight} cy={baseY} r="3.5" fill={COLORS.point} />

        <SvgText x={apexX + 10} y={apexY + 2} fill={COLORS.point} fontSize="13" fontWeight="700">{spec.vertexTopLabel ?? 'V'}</SvgText>
        {spec.heightLabel ? (
          <SvgText x={centerX + 10} y={(apexY + baseY) / 2} fill={COLORS.highlight} fontSize="13" fontWeight="700">
            {spec.heightLabel}
          </SvgText>
        ) : null}
        {spec.baseLabel ? (
          <SvgText x={centerX} y={baseY + 28} fill={COLORS.success} fontSize="13" fontWeight="700" textAnchor="middle">
            {spec.baseLabel}
          </SvgText>
        ) : null}
        {spec.hypotenuseLabel ? (
          <SvgText x={baseRight - 4} y={(apexY + baseY) / 2} fill={COLORS.soft} fontSize="13" fontWeight="700" textAnchor="start">
            {spec.hypotenuseLabel}
          </SvgText>
        ) : null}
      </Svg>
    </FigureContainer>
  );
}

function ParabolaFigure({ spec }: { spec: GeometrySpec }) {
  const width = spec.width ?? 280;
  const height = spec.height ?? 180;
  const axisX = width / 2;
  const axisY = height - 28;
  const curve = `M 32 ${axisY} Q ${axisX} 24 ${width - 32} ${axisY}`;

  return (
    <FigureContainer title={spec.title} note={spec.note}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Line x1="18" y1={axisY} x2={width - 16} y2={axisY} stroke={COLORS.muted} strokeWidth="1.5" />
        <Line x1={axisX} y1="12" x2={axisX} y2={height - 12} stroke={COLORS.muted} strokeWidth="1.5" strokeDasharray="5 5" />
        <Path d={curve} fill="none" stroke={COLORS.stroke} strokeWidth="3" />
        <Circle cx={axisX} cy="38" r="4" fill={COLORS.point} />

        {spec.axisXLabel ? (
          <SvgText x={width - 10} y={axisY - 6} fill={COLORS.soft} fontSize="12" fontWeight="700" textAnchor="end">
            {spec.axisXLabel}
          </SvgText>
        ) : null}
        {spec.axisYLabel ? (
          <SvgText x={axisX + 10} y="20" fill={COLORS.soft} fontSize="12" fontWeight="700">
            {spec.axisYLabel}
          </SvgText>
        ) : null}
        {spec.pointLabel ? (
          <SvgText x={axisX + 10} y="42" fill={COLORS.highlight} fontSize="13" fontWeight="700">
            {spec.pointLabel}
          </SvgText>
        ) : null}
      </Svg>
    </FigureContainer>
  );
}

function CaseSplitFigure({ spec }: { spec: GeometrySpec }) {
  const width = spec.width ?? 300;
  const height = spec.height ?? 188;
  const cards = [spec.caseOneLabel ?? '3 mulheres + 2 homens', spec.caseTwoLabel ?? '4 mulheres + 1 homem', spec.caseThreeLabel ?? '5 mulheres + 0 homens'];
  const cardWidth = 84;
  const gap = 12;
  const startX = (width - cardWidth * 3 - gap * 2) / 2;

  return (
    <FigureContainer title={spec.title} note={spec.note}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {cards.map((label, index) => {
          const x = startX + index * (cardWidth + gap);
          const y = 34;
          const womenCount = 3 + index;
          const menCount = Math.max(0, 2 - index);

          return (
            <View key={label}>
              <Rect x={x} y={y} width={cardWidth} height="112" rx="16" fill="rgba(15,23,42,0.92)" stroke={index === 1 ? COLORS.accent : COLORS.stroke} strokeWidth="1.5" />
              <SvgText x={x + cardWidth / 2} y={y + 20} fill={COLORS.point} fontSize="11" fontWeight="700" textAnchor="middle">
                Caso {index + 1}
              </SvgText>
              {Array.from({ length: womenCount }).map((_, circleIndex) => (
                <Circle
                  key={`w-${index}-${circleIndex}`}
                  cx={x + 18 + (circleIndex % 3) * 18}
                  cy={y + 44 + Math.floor(circleIndex / 3) * 18}
                  r="6"
                  fill="#F472B6"
                />
              ))}
              {Array.from({ length: menCount }).map((_, circleIndex) => (
                <Circle
                  key={`m-${index}-${circleIndex}`}
                  cx={x + 18 + ((circleIndex + womenCount) % 3) * 18}
                  cy={y + 44 + Math.floor((circleIndex + womenCount) / 3) * 18}
                  r="6"
                  fill={COLORS.accent}
                />
              ))}
              <SvgText x={x + cardWidth / 2} y={y + 100} fill={COLORS.soft} fontSize="9.5" fontWeight="700" textAnchor="middle">
                {label}
              </SvgText>
            </View>
          );
        })}
      </Svg>
    </FigureContainer>
  );
}

function NumberLineFigure({ spec }: { spec: GeometrySpec }) {
  const width = spec.width ?? 300;
  const height = spec.height ?? 132;
  const left = 46;
  const right = width - 34;
  const y = 66;
  const startX = left + (right - left) * 0.24;
  const endX = left + (right - left) * 0.76;

  return (
    <FigureContainer title={spec.title} note={spec.note}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Line x1={left} y1={y} x2={right} y2={y} stroke={COLORS.muted} strokeWidth="2" />
        <Line x1={startX} y1={y} x2={endX} y2={y} stroke={COLORS.accent} strokeWidth="5" strokeLinecap="round" />
        <Circle cx={startX} cy={y} r="7" fill="#0B1220" stroke={COLORS.highlight} strokeWidth="2.5" />
        <Circle cx={endX} cy={y} r="7" fill="#0B1220" stroke={COLORS.highlight} strokeWidth="2.5" />
        <Line x1={startX} y1={y - 18} x2={startX} y2={y + 18} stroke={COLORS.muted} strokeWidth="1.5" />
        <Line x1={endX} y1={y - 18} x2={endX} y2={y + 18} stroke={COLORS.muted} strokeWidth="1.5" />
        <SvgText x={startX} y={y + 32} fill={COLORS.point} fontSize="13" fontWeight="700" textAnchor="middle">
          {spec.startLabel ?? '-1'}
        </SvgText>
        <SvgText x={endX} y={y + 32} fill={COLORS.point} fontSize="13" fontWeight="700" textAnchor="middle">
          {spec.endLabel ?? '9'}
        </SvgText>
        {spec.intervalLabel ? (
          <SvgText x={width / 2} y={30} fill={COLORS.success} fontSize="13" fontWeight="700" textAnchor="middle">
            {spec.intervalLabel}
          </SvgText>
        ) : null}
      </Svg>
    </FigureContainer>
  );
}

function UrnProbabilityFigure({ spec }: { spec: GeometrySpec }) {
  const width = spec.width ?? 300;
  const height = spec.height ?? 190;
  const totalBalls = (spec.redCount ?? 5) + (spec.blueCount ?? 3);
  const urnCenterX = 86;

  return (
    <FigureContainer title={spec.title} note={spec.note}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Path d="M 46 48 Q 86 28 126 48 L 114 136 Q 86 154 58 136 Z" fill="rgba(37,99,235,0.08)" stroke={COLORS.stroke} strokeWidth="2.5" />
        {Array.from({ length: totalBalls }).map((_, index) => {
          const isRed = index < (spec.redCount ?? 5);
          const row = Math.floor(index / 4);
          const column = index % 4;
          return (
            <Circle
              key={index}
              cx={62 + column * 16}
              cy={76 + row * 18}
              r="6"
              fill={isRed ? '#EF4444' : '#38BDF8'}
            />
          );
        })}
        <Path d="M 140 84 C 168 84 172 70 194 70" fill="none" stroke={COLORS.highlight} strokeWidth="2.5" strokeDasharray="5 4" />
        <Path d="M 140 112 C 172 112 180 126 208 126" fill="none" stroke={COLORS.accent} strokeWidth="2.5" strokeDasharray="5 4" />
        <Circle cx="216" cy="70" r="10" fill="#EF4444" />
        <Circle cx="228" cy="126" r="10" fill="#38BDF8" />
        <SvgText x={216} y="46" fill={COLORS.point} fontSize="11" fontWeight="700" textAnchor="middle">
          {spec.firstPickLabel ?? '1ª: vermelha'}
        </SvgText>
        <SvgText x={228} y="156" fill={COLORS.point} fontSize="11" fontWeight="700" textAnchor="middle">
          {spec.secondPickLabel ?? '2ª: azul'}
        </SvgText>
        <SvgText x={urnCenterX} y="166" fill={COLORS.soft} fontSize="11" fontWeight="700" textAnchor="middle">
          {(spec.redCount ?? 5) + ' vermelhas e ' + (spec.blueCount ?? 3) + ' azuis'}
        </SvgText>
        <SvgText x={urnCenterX} y="182" fill={COLORS.muted} fontSize="10" fontWeight="700" textAnchor="middle">
          sem reposição
        </SvgText>
      </Svg>
    </FigureContainer>
  );
}

function GrowthComparisonFigure({ spec }: { spec: GeometrySpec }) {
  const width = spec.width ?? 300;
  const height = spec.height ?? 190;
  const baseY = height - 34;
  const simpleTop = 72;
  const compoundTop = 50;

  return (
    <FigureContainer title={spec.title} note={spec.note}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Line x1="34" y1={baseY} x2={width - 24} y2={baseY} stroke={COLORS.muted} strokeWidth="2" />
        <Line x1="34" y1="46" x2={width - 24} y2="46" stroke={COLORS.muted} strokeWidth="1" strokeDasharray="5 5" />
        <Rect x="78" y={simpleTop} width="52" height={baseY - simpleTop} rx="12" fill="rgba(56,189,248,0.28)" stroke={COLORS.accent} strokeWidth="2" />
        <Rect x="174" y={compoundTop} width="52" height={baseY - compoundTop} rx="12" fill="rgba(34,197,94,0.28)" stroke={COLORS.success} strokeWidth="2" />
        <SvgText x="104" y={simpleTop - 8} fill={COLORS.point} fontSize="11" fontWeight="700" textAnchor="middle">
          {spec.simpleLabel ?? 'R$ 12.400,00'}
        </SvgText>
        <SvgText x="200" y={compoundTop - 8} fill={COLORS.point} fontSize="11" fontWeight="700" textAnchor="middle">
          {spec.compoundLabel ?? 'R$ 12.682,42'}
        </SvgText>
        <SvgText x="104" y={baseY + 22} fill={COLORS.soft} fontSize="11" fontWeight="700" textAnchor="middle">
          simples
        </SvgText>
        <SvgText x="200" y={baseY + 22} fill={COLORS.soft} fontSize="11" fontWeight="700" textAnchor="middle">
          compostos
        </SvgText>
        {spec.finalLabel ? (
          <SvgText x={width / 2} y="24" fill={COLORS.highlight} fontSize="12" fontWeight="700" textAnchor="middle">
            {spec.finalLabel}
          </SvgText>
        ) : null}
      </Svg>
    </FigureContainer>
  );
}

function TruthTableFigure({ spec }: { spec: GeometrySpec }) {
  const width = spec.width ?? 312;
  const height = spec.height ?? 188;
  const columns = [40, 40, 62, 68, 82];
  const headers = ['p', 'q', 'p→q', '¬q→¬p', '↔'];
  const rows = [
    ['V', 'V', 'V', 'V', 'V'],
    ['V', 'F', 'F', 'F', 'V'],
    ['F', 'V', 'V', 'V', 'V'],
    ['F', 'F', 'V', 'V', 'V'],
  ];

  let currentX = 22;
  return (
    <FigureContainer title={spec.title} note={spec.note}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {headers.map((header, columnIndex) => {
          const x = currentX;
          const columnWidth = columns[columnIndex];
          currentX += columnWidth;
          return (
            <View key={header}>
              <Rect x={x} y="20" width={columnWidth} height="30" fill="rgba(37,99,235,0.18)" stroke={COLORS.stroke} strokeWidth="1" />
              <SvgText x={x + columnWidth / 2} y="39" fill={COLORS.point} fontSize="12" fontWeight="700" textAnchor="middle">
                {header}
              </SvgText>
              {rows.map((row, rowIndex) => (
                <View key={`${header}-${rowIndex}`}>
                  <Rect
                    x={x}
                    y={50 + rowIndex * 28}
                    width={columnWidth}
                    height="28"
                    fill={columnIndex === 4 ? 'rgba(34,197,94,0.18)' : 'rgba(15,23,42,0.92)'}
                    stroke={COLORS.muted}
                    strokeWidth="1"
                  />
                  <SvgText x={x + columnWidth / 2} y={68 + rowIndex * 28} fill={COLORS.point} fontSize="12" fontWeight="700" textAnchor="middle">
                    {row[columnIndex]}
                  </SvgText>
                </View>
              ))}
            </View>
          );
        })}
      </Svg>
    </FigureContainer>
  );
}

function SarrusGridFigure({ spec }: { spec: GeometrySpec }) {
  const width = spec.width ?? 320;
  const height = spec.height ?? 206;
  const rows = [splitCells(spec.row1, ['2', '1', '3', '2', '1']), splitCells(spec.row2, ['4', '-1', '2', '4', '-1']), splitCells(spec.row3, ['1', '0', '1', '1', '0'])];
  const cellSize = 44;
  const startX = 34;
  const startY = 34;

  return (
    <FigureContainer title={spec.title} note={spec.note}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {rows.map((row, rowIndex) =>
          row.map((cell, columnIndex) => {
            const x = startX + columnIndex * cellSize;
            const y = startY + rowIndex * cellSize;
            const fill = columnIndex >= 3 ? 'rgba(30,41,59,0.72)' : 'rgba(15,23,42,0.92)';
            return (
              <View key={`${rowIndex}-${columnIndex}`}>
                <Rect x={x} y={y} width={cellSize} height={cellSize} fill={fill} stroke={COLORS.stroke} strokeWidth="1" />
                <SvgText x={x + cellSize / 2} y={y + 26} fill={COLORS.point} fontSize="12" fontWeight="700" textAnchor="middle">
                  {cell}
                </SvgText>
              </View>
            );
          }),
        )}
        <Path d={`M ${startX + 10} ${startY + 10} L ${startX + cellSize + 22} ${startY + cellSize + 22} L ${startX + cellSize * 2 + 34} ${startY + cellSize * 2 + 34}`} fill="none" stroke={COLORS.success} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <Path d={`M ${startX + cellSize + 10} ${startY + 10} L ${startX + cellSize * 2 + 22} ${startY + cellSize + 22} L ${startX + cellSize * 3 + 34} ${startY + cellSize * 2 + 34}`} fill="none" stroke={COLORS.success} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
        <Path d={`M ${startX + cellSize * 4 - 10} ${startY + 10} L ${startX + cellSize * 3 - 22} ${startY + cellSize + 22} L ${startX + cellSize * 2 - 34} ${startY + cellSize * 2 + 34}`} fill="none" stroke={COLORS.highlight} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <Path d={`M ${startX + cellSize * 3 - 10} ${startY + 10} L ${startX + cellSize * 2 - 22} ${startY + cellSize + 22} L ${startX + cellSize - 34} ${startY + cellSize * 2 + 34}`} fill="none" stroke={COLORS.highlight} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      </Svg>
    </FigureContainer>
  );
}

function PercentageFlowFigure({ spec }: { spec: GeometrySpec }) {
  const width = spec.width ?? 320;
  const height = spec.height ?? 148;
  const boxes = [spec.stepOneLabel ?? 'R$ 80,00', spec.stepTwoLabel ?? 'R$ 100,00', spec.stepThreeLabel ?? 'R$ 80,00'];

  return (
    <FigureContainer title={spec.title} note={spec.note}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {boxes.map((label, index) => {
          const x = 24 + index * 96;
          return (
            <View key={label}>
              <Rect x={x} y="42" width="78" height="44" rx="12" fill="rgba(15,23,42,0.92)" stroke={index === 1 ? COLORS.highlight : COLORS.stroke} strokeWidth="1.8" />
              <SvgText x={x + 39} y="68" fill={COLORS.point} fontSize="11" fontWeight="700" textAnchor="middle">
                {label}
              </SvgText>
              {index < boxes.length - 1 ? <Path d={`M ${x + 84} 64 L ${x + 98} 64`} stroke={COLORS.accent} strokeWidth="3" strokeLinecap="round" /> : null}
              {index === 0 ? <SvgText x={x + 39} y="28" fill={COLORS.success} fontSize="11" fontWeight="700" textAnchor="middle">+25%</SvgText> : null}
              {index === 1 ? <SvgText x={x + 39} y="28" fill={COLORS.highlight} fontSize="11" fontWeight="700" textAnchor="middle">-20%</SvgText> : null}
            </View>
          );
        })}
      </Svg>
    </FigureContainer>
  );
}

function BounceSequenceFigure({ spec }: { spec: GeometrySpec }) {
  const width = spec.width ?? 320;
  const height = spec.height ?? 178;
  const heights = [108, 82, 62, 46];
  const labels = [spec.levelOneLabel ?? '16 m', spec.levelTwoLabel ?? '12 m', spec.levelThreeLabel ?? '9 m', spec.levelFourLabel ?? '6,75 m'];

  return (
    <FigureContainer title={spec.title} note={spec.note}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Line x1="22" y1="142" x2={width - 18} y2="142" stroke={COLORS.muted} strokeWidth="2" />
        {heights.map((barHeight, index) => {
          const x = 42 + index * 62;
          const y = 142 - barHeight;
          return (
            <View key={labels[index]}>
              <Rect x={x} y={y} width="34" height={barHeight} rx="10" fill={`rgba(59,130,246,${0.16 + index * 0.06})`} stroke={COLORS.stroke} strokeWidth="1.5" />
              <SvgText x={x + 17} y={y - 8} fill={COLORS.point} fontSize="11" fontWeight="700" textAnchor="middle">
                {labels[index]}
              </SvgText>
            </View>
          );
        })}
      </Svg>
    </FigureContainer>
  );
}

function RatioBarsFigure({ spec }: { spec: GeometrySpec }) {
  const width = spec.width ?? 320;
  const height = spec.height ?? 164;
  const ratios = [spec.ratioA ?? 2, spec.ratioB ?? 3, spec.ratioC ?? 5];
  const labels = [spec.labelA ?? 'Ana', spec.labelB ?? 'Bruno', spec.labelC ?? 'Carlos'];
  const colors = ['#38BDF8', '#A78BFA', '#34D399'];
  const total = ratios.reduce((sum, value) => sum + value, 0);
  let x = 26;

  return (
    <FigureContainer title={spec.title} note={spec.note}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {ratios.map((ratio, index) => {
          const segmentWidth = (width - 52) * (ratio / total);
          const currentX = x;
          x += segmentWidth;
          return (
            <View key={labels[index]}>
              <Rect x={currentX} y="48" width={segmentWidth} height="46" fill={colors[index]} opacity="0.3" stroke={colors[index]} strokeWidth="1.5" />
              <SvgText x={currentX + segmentWidth / 2} y="66" fill={COLORS.point} fontSize="11" fontWeight="700" textAnchor="middle">
                {labels[index]}
              </SvgText>
              <SvgText x={currentX + segmentWidth / 2} y="84" fill={COLORS.point} fontSize="12" fontWeight="700" textAnchor="middle">
                {ratio} partes
              </SvgText>
            </View>
          );
        })}
        <SvgText x={width / 2} y="120" fill={COLORS.soft} fontSize="11" fontWeight="700" textAnchor="middle">
          total de {total} partes proporcionais
        </SvgText>
      </Svg>
    </FigureContainer>
  );
}

export function MathGeometry({ text }: { text: string }) {
  const spec = parseGeometryBlock(text);
  if (!spec) return null;

  if (spec.type === 'right-triangle') {
    return <RightTriangleFigure spec={spec} />;
  }

  if (spec.type === 'cone-section') {
    return <ConeSectionFigure spec={spec} />;
  }

  if (spec.type === 'case-split') {
    return <CaseSplitFigure spec={spec} />;
  }

  if (spec.type === 'number-line') {
    return <NumberLineFigure spec={spec} />;
  }

  if (spec.type === 'urn-probability') {
    return <UrnProbabilityFigure spec={spec} />;
  }

  if (spec.type === 'growth-comparison') {
    return <GrowthComparisonFigure spec={spec} />;
  }

  if (spec.type === 'truth-table') {
    return <TruthTableFigure spec={spec} />;
  }

  if (spec.type === 'sarrus-grid') {
    return <SarrusGridFigure spec={spec} />;
  }

  if (spec.type === 'percentage-flow') {
    return <PercentageFlowFigure spec={spec} />;
  }

  if (spec.type === 'bounce-sequence') {
    return <BounceSequenceFigure spec={spec} />;
  }

  if (spec.type === 'ratio-bars') {
    return <RatioBarsFigure spec={spec} />;
  }

  return <ParabolaFigure spec={spec} />;
}
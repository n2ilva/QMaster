import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { InteractiveCard } from '@/components/quiz/interactive-card';
import { type TrackIcon } from '@/constants/track-styles';

export type QuizTrackItem = {
  key: string;
  label: string;
  icon: TrackIcon;
  color: string;
};

type QuizTrackCardProps = {
  item: QuizTrackItem;
  height?: number;
  fontSize?: number;
};

export function QuizTrackCard({ item, height = 80, fontSize = 16 }: QuizTrackCardProps) {
  const router = useRouter();

  return (
    <InteractiveCard
      accentColor={item.color}
      hoverAccentColor={item.color}
      onPress={() => router.push(`/track/${encodeURIComponent(item.key)}`)}
      outerRadius={14}
      innerRadius={12}
      innerPadding={0}
      scaleTo={1.06}>
      <View
        style={{
          width: '100%',
          height,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          paddingHorizontal: 4,
        }}>
        <Text
          style={{ color: '#ECEDEE', fontSize, fontWeight: '700', textAlign: 'center', padding: 10 }}
          numberOfLines={2}>
          {item.label}
        </Text>
      </View>
    </InteractiveCard>
  );
}

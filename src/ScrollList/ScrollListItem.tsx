import React, {FC, useMemo} from 'react';
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

export interface ScrollListItemData {
  value: string | number;
  label: string;
}

export interface ScrollListItemProps {
  item: ScrollListItemData;
  value?: string | number;
  animated: boolean;
  index: number;
  y: Animated.Value;
  listHeight: number;
  paddingItems: number;
  onPress?(e: GestureResponderEvent, item: ScrollListItemData): void;
}

export const ScrollListItem: FC<ScrollListItemProps> = props => {
  const {item, value, index, y, listHeight, onPress} = props;

  const isActive = useMemo(() => item.value === value, [item.value, value]);

  const position = Animated.subtract(index * 44, y);

  const disappearing = -44;
  const top = 0;
  const bottom = listHeight - 44;
  const appearing = listHeight;

  // const translateY = Animated.add(
  //   Animated.add(
  //     y,
  //     y.interpolate({
  //       inputRange: [0, 0.00001 + index * 44],
  //       outputRange: [0, -index * 44],
  //     }),
  //   ),
  //   position.interpolate({
  //     inputRange: [bottom, appearing],
  //     outputRange: [0, -11],
  //     extrapolate: 'clamp',
  //   }),
  // );
  // console.log(index, 'position', position);
  // const scale = position.interpolate({
  //   inputRange: [disappearing, top, 44 * paddingItems, bottom, appearing],
  //   outputRange: [0.4, 0.7, 1, 0.7, 0.4],
  //   extrapolate: 'clamp',
  // });

  const opacity = position.interpolate({
    inputRange: [disappearing, top, bottom, appearing],
    outputRange: [0.5, 1, 1, 0.5],
  });

  const handlePress = (e: GestureResponderEvent) => {
    onPress?.(e, item);
  };

  return (
    <Animated.View
      style={{
        opacity,
        // ...(animated && {transform: [{scale}]}),
      }}>
      <Pressable style={styles.item} onPress={handlePress}>
        <Text style={[styles.text, isActive && styles.textActive]}>
          {item.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export const styles = StyleSheet.create({
  animated: {
    height: 44,
    width: '100%',
  },
  item: {
    width: '100%',
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
  },
  textActive: {
    color: 'red',
  },
});

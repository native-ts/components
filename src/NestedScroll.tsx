import React, {PropsWithChildren, forwardRef, useState} from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';

export interface NestedScrollProps {
  horizontal?: boolean;
}

export const NestedScroll = forwardRef<
  FlatList<null>,
  PropsWithChildren<NestedScrollProps>
>(function NestedScroll(props, ref) {
  const {children, horizontal} = props;
  const [listSize, setListSize] = useState<{
    width?: number;
    height?: number;
  }>({width: 0, height: 0});

  const renderItem: ListRenderItem<null> = () => (
    <View
      style={[
        styles.item,
        {
          width: listSize.width,
          height: listSize.height,
        },
      ]}>
      {children}
    </View>
  );

  const handleLayout = (e: LayoutChangeEvent) => {
    const {width, height} = e.nativeEvent.layout;
    (width !== listSize.width || height !== listSize.height) &&
      setListSize({width, height});
  };

  return (
    <FlatList
      {...props}
      horizontal={horizontal}
      data={[null]}
      ref={ref}
      renderItem={renderItem}
      onLayout={handleLayout}
    />
  );
});

const styles = StyleSheet.create({
  list: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

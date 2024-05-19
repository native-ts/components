import React, {
  Fragment,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  FlatList,
  GestureResponderEvent,
  ListRenderItem,
  NativeScrollEvent,
  NativeScrollPoint,
  NativeSyntheticEvent,
  StyleSheet,
} from 'react-native';
import {NestedScroll} from '../NestedScroll';
import {ScrollListItem, ScrollListItemData} from './ScrollListItem';

export interface ScrollListProps {
  nested?: boolean;
  data: ScrollListItemData[];
  value?: number | string;
  centered?: boolean;
  paddingItems?: number;
  animated?: boolean;
  onPressItem?(e: GestureResponderEvent, item: ScrollListItemData): void;
}

interface ItemData extends ScrollListItemData {
  isItem: boolean;
}

export const DEFAULT_PADDING_ITEMS = 2;

export const AnimatedScroll = Animated.createAnimatedComponent(
  FlatList<ItemData>,
);

export const ScrollList = forwardRef<FlatList<ItemData>, ScrollListProps>(
  function ScrollList(props, ref) {
    const {
      nested = true,
      data,
      value,
      centered,
      paddingItems = DEFAULT_PADDING_ITEMS,
      animated = true,
      onPressItem,
      ...rest
    } = props;

    const listRef = useRef<FlatList<ItemData>>(null);
    const offset = useRef<NativeScrollPoint>();
    const timer = useRef<ReturnType<typeof setTimeout>>();

    const isBeginDrag = useRef(false);
    const isEndDrag = useRef(false);
    const isEndScroll = useRef(false);

    const [currentValue, setCurrentValue] = useState<number | string>(
      value ?? data[0]?.value,
    );

    const initialYOffset = useMemo(() => {
      let index = data.findIndex(i => i.value === currentValue);
      index = index === -1 ? 0 : index;

      if (centered) {
        index += paddingItems;
      }

      return (index - 1) * 44;
    }, [currentValue, data, centered, paddingItems]);

    const y = new Animated.Value(initialYOffset);

    useImperativeHandle(ref, () => listRef.current!);

    const dataList = useMemo(() => {
      if (!centered) {
        return data;
      }

      return [
        ...Array(paddingItems).fill({...{label: '', value: '', isItem: false}}),
        ...data.map(item => ({...item, isItem: true})),
        ...Array(paddingItems).fill({...{label: '', value: '', isItem: false}}),
      ];
    }, [data, centered, paddingItems]);

    const handlePressItem = (e: GestureResponderEvent, item: ItemData) => {
      if (!item.isItem) {
        return;
      }

      if (item.value !== currentValue) {
        listRef.current?.scrollToIndex({
          index: dataList.indexOf(item) - paddingItems,
          animated: true,
        });
        setCurrentValue(item.value);
      }

      onPressItem?.(e, item);
    };

    const listHeight = (paddingItems + 1) * 44;

    const renderItem: ListRenderItem<ItemData> = ({item, index}) => (
      <ScrollListItem
        item={item}
        value={currentValue}
        animated={animated}
        onPress={handlePressItem}
        y={y}
        index={index}
        listHeight={listHeight}
        paddingItems={paddingItems}
      />
    );

    const handleFixPosition = () => {
      // If the scroll is not staeted by a drag, do nothing
      if (!offset.current || !isBeginDrag.current) {
        return;
      }

      // If the scroll is not ended or the drag is not ended, do nothing
      if (!isEndScroll.current || (isEndDrag.current && !isEndScroll.current)) {
        return;
      }

      isBeginDrag.current = false;
      isEndDrag.current = false;
      isEndScroll.current = false;

      const index = Math.round(offset.current.y / 44);
      const item = dataList[index + (centered ? paddingItems : 0)];

      if (item.value !== currentValue) {
        setCurrentValue(item.value);
      }

      listRef.current?.scrollToIndex({
        index,
        animated: true,
      });
    };

    const handleScrollBeginDrag = () => {
      isBeginDrag.current = true;
    };

    const handleScrollEndDrag = () => {
      isEndDrag.current = true;
      isEndScroll.current && handleFixPosition();
    };

    const handleScrollEnd = () => {
      if (!isBeginDrag.current) {
        return;
      }

      isEndScroll.current = true;
      handleFixPosition();
    };

    const _handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      offset.current = e.nativeEvent.contentOffset;
      timer.current && clearTimeout(timer.current);
      timer.current = setTimeout(handleScrollEnd, 100);
    };

    const handleScroll = Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              y,
            },
          },
        },
      ],
      {
        useNativeDriver: true,
        listener: _handleScroll,
      },
    );

    const Container = nested ? NestedScroll : Fragment;
    const containerProps = nested ? {horizontal: true} : {};

    return (
      <Container {...containerProps}>
        <AnimatedScroll
          {...rest}
          ref={listRef}
          style={[styles.list, {height: listHeight}]}
          data={dataList}
          renderItem={renderItem}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          onScroll={handleScroll}
          showsVerticalScrollIndicator={false}
        />
      </Container>
    );
  },
);

const styles = StyleSheet.create({
  list: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 200, 200, 0.1)',
  },
});

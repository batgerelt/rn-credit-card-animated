/**
 * Copyright (c) 2023 Batgerelt
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React, {Fragment, useState, useRef, useEffect} from 'react';
import * as Native from 'react-native';

import ConditionalRender from 'react-native-conditional-render';
// {
//   bankcd: "1599993",
//   banknm: "Голомт банк 3",
//   cardholder: "Otgonjargal Myagmar",
//   cardno: "420733******4839",
//   id: 1603,
//   insymd: "2023-07-28T13:08:26",
//   isenable: 1,
// },

interface DataTypeProps {
  name: string;
  title: string;
  bgColor: string;
  onPress: Function;
}

interface Props {
  name: string;
  data: DataTypeProps[];
  timingDuration: Number;
}

/**
 * Барааны баркод унших, бичих component
 *
 * @param name barcode scannered boloh ved
 * @param data barcode scannered boloh ved
 * @returns React-Native component
 */
const CardStack = (props: Props) => {
  const list = props?.data || [];

  //
  const [values, setValues] = useState({
    cardsPan: new Native.Animated.ValueXY(),
    cardsStackedAnim: new Native.Animated.Value(0),
    currentIndex: 0,
    items: list,
  });

  //
  const items = values.items;

  //
  const AnimatedTouchable = Native.Animated.createAnimatedComponent(
    Native.TouchableOpacity,
  );

  //
  const [cardsStackedAnim, setCardsStackedAnim] = useState(
    new Native.Animated.Value(0),
  );

  const cardsPanResponder = useRef(
    Native.PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onPanResponderMove: (event, gestureState) => {
        setValues(current => ({
          ...current,
          cardsPan: {
            x: gestureState.dx,
            y: 0,
          },
        }));
      },
      onPanResponderRelease: (event, gestureState) => {
        Native.Animated.timing(values.cardsPan, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();

        Native.Animated.timing(cardsStackedAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          const temp = items;
          const shifted = temp.shift?.();
          temp.push?.(shifted);

          cardsStackedAnim.setValue(0);

          setValues(current => ({
            ...current,
            items: temp,
            cardsPan: new Native.Animated.ValueXY(0),
            currentIndex:
              current.currentIndex < items.length - 1
                ? current.currentIndex + 1
                : 0,
          }));
        });
      },
    }),
  ).current;

  const cardWidth = Native.Dimensions.get('window').width;

  const defaultStyles = {
    borderRadius: 10,
    width: cardWidth - 40,
    position: 'absolute',
    height: cardWidth / 2,
  };

  const CardContent = ({name}) => {
    return (
      <Native.View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 4,
        }}>
        <Native.TouchableOpacity
          onPress={() => {}}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Native.Text
            style={{
              color: '#fff',
              fontSize: 20,
            }}>
            {name || ''}
          </Native.Text>
        </Native.TouchableOpacity>
      </Native.View>
    );
  };

  return (
    <Native.View>
      <Native.View
        style={{
          height: cardWidth,
          width: cardWidth,
          margin: 20,
        }}>
        {items?.map((item, index) => {
          const n = items.length;

          if (index == 0) {
            return (
              <Native.Animated.View
                key={`indexItems${index}`}
                {...cardsPanResponder.panHandlers}
                style={{
                  ...defaultStyles,
                  zIndex: items.length + 1,
                  bottom: cardsStackedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20],
                  }),
                  opacity: cardsStackedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.3],
                  }),
                  transform: [
                    {translateX: values.cardsPan.x},
                    {translateY: 0},
                    {
                      scale: cardsStackedAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.8],
                      }),
                    },
                  ],
                  backgroundColor: item.bgColor,
                }}
                children={<CardContent {...item} />}
              />
            );
          }

          return (
            <Native.Animated.View
              key={`indexItems${index}`}
              style={{
                zIndex: n - index,
                ...defaultStyles,
                backgroundColor: item.bgColor,
                bottom: cardsStackedAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20 * index, 19 * index - 20],
                }),
                opacity: cardsStackedAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9 - index / 10, 1.0 - index / 10],
                }),
              }}
              children={<CardContent {...item} />}
            />
          );
        })}

        {/* <Native.FlatList
          data={items}
          style={{
            height: cardWidth,
            width: cardWidth,
            position: 'relative',
            margin: 20,
          }}
          contentContainerStyle={{
            height: cardWidth,
            width: cardWidth,
            margin: 20,
          }}
          scrollEnabled={false}
          renderItem={({item, index}) => {
            const n = items.length;

            if (index == 0) {
              return (
                <Native.Animated.View
                  key={`indexItems${index}`}
                  {...cardsPanResponder.panHandlers}
                  style={{
                    ...defaultStyles,
                    zIndex: items.length + 1,
                    bottom: cardsStackedAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 20],
                    }),
                    opacity: cardsStackedAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.3],
                    }),
                    transform: [
                      {translateX: values.cardsPan.x},
                      {translateY: 0},
                      {
                        scale: cardsStackedAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0.8],
                        }),
                      },
                    ],
                    backgroundColor: item.bgColor,
                  }}
                  children={<CardContent {...item} />}
                />
              );
            }

            return (
              <Native.Animated.View
                key={`indexItems${index}`}
                style={{
                  zIndex: n - index,
                  ...defaultStyles,
                  backgroundColor: item.bgColor,
                  bottom: cardsStackedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20 * index, 19 * index - 20],
                  }),
                  opacity: cardsStackedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9 - index / 10, 1.0 - index / 10],
                  }),
                }}
                children={<CardContent {...item} />}
              />
            );
          }}
        /> */}
      </Native.View>
    </Native.View>
  );
};

export default () => {
  return (
    <Native.SafeAreaView>
      <Native.View>
        <ConditionalRender condition />
        <CardStack
          data={[
            {name: 'Hello1', bgColor: '#21cda8'},
            {name: 'Hello2', bgColor: '#0082da'},
            {name: 'Hello3', bgColor: '#f47322'},
            {name: 'Hello4', bgColor: '#024e31'},
            {name: 'Hello4', bgColor: '#05357e'},
            {name: 'Hello4', bgColor: '#32a1f3'},
            {name: 'Hello4', bgColor: '#248b45'},
          ]}
        />
      </Native.View>
    </Native.SafeAreaView>
  );
};

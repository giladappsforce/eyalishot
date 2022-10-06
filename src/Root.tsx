import { Dimensions, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type Props = {};

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const CARD_HEIGHT = 500;

const Root = (props: Props) => {
  const offsetY = useSharedValue<number>(0);
  const start = useSharedValue<number>(0);
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
        transform: [{translateY: offsetY.value}]
    }
  })
  const snapPoints = useMemo(() => [3/10, 6/10], []);
  useEffect(() => {
    // console.log(offsetY.value)
  }, [offsetY])
  const gesture = useMemo(
    () =>
      Gesture.Pan().onStart((event) => {
      }).onUpdate((event) => {
        offsetY.value = event.translationY + start.value;
      }).onEnd((event) => {
        let min = Infinity;
        snapPoints.forEach(p => {
            const pixelValue = p * SCREEN_HEIGHT;
            const distFromPoint = Math.abs(event.absoluteY - p);
            if(distFromPoint < min){
                min = p * SCREEN_HEIGHT;
            }
        })
        const finalValue = min * -1 + CARD_HEIGHT / 2
        offsetY.value = withSpring(finalValue, {mass: 0.2});
        start.value = finalValue;
      }),
    []
  );
  return (
    <View style={{flex: 1, marginTop: 70}}>
            <View style={styles.indicatorLine}/>
        <View style={{flex: 1}}>
      <Text>Root</Text>
        </View>
        <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.cardContainer, cardAnimatedStyle]}>
        <Text>Bottom content</Text>
      </Animated.View>
        </GestureDetector>
    </View>
  );
};

export default Root;

const styles = StyleSheet.create({
  cardContainer: {
    height: CARD_HEIGHT,
    backgroundColor: "red",
    borderTopEndRadius: 16,
    borderTopStartRadius: 16,
    padding: 10,
    flex: 1
  },
  indicatorLine: {
    width: SCREEN_WIDTH,
    height: 1,
    backgroundColor: 'black',
    position: 'absolute',
    zIndex: 10,
    bottom: SCREEN_HEIGHT * 0.66
  }
});

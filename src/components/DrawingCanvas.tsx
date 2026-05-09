import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, PanResponder, Animated, Dimensions } from 'react-native';
import { Colors } from '../utils/theme';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
}

interface DrawingCanvasProps {
  onTextRecognized: (text: string) => void;
  darkMode?: boolean;
}

export function DrawingCanvas({ onTextRecognized, darkMode = false }: DrawingCanvasProps) {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentStroke([{ x: locationX, y: locationY }]);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentStroke(prev => [...prev, { x: locationX, y: locationY }]);
      },
      onPanResponderRelease: () => {
        if (currentStroke.length > 0) {
          setStrokes(prev => [...prev, { points: currentStroke }]);
        }
        setCurrentStroke([]);
      },
    })
  ).current;

  const clearCanvas = useCallback(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setStrokes([]);
    setCurrentStroke([]);
  }, [fadeAnim]);

  const submitText = useCallback((text: string) => {
    if (text.trim()) {
      onTextRecognized(text);
      clearCanvas();
    }
  }, [onTextRecognized, clearCanvas]);

  const renderStroke = (stroke: Stroke, index: number) => {
    const pathD = stroke.points.reduce((path, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      return `${path} L ${point.x} ${point.y}`;
    }, '');

    return (
      <View key={index} style={StyleSheet.absoluteFill}>
        {stroke.points.map((point, i) => (
          <View
            key={i}
            style={[
              styles.point,
              {
                left: point.x - 2,
                top: point.y - 2,
                backgroundColor: darkMode ? Colors.dark.primary : Colors.light.primary,
              },
            ]}
          />
        ))}
        {stroke.points.length > 1 && (
          <View style={StyleSheet.absoluteFill}>
            {stroke.points.slice(0, -1).map((point, i) => {
              const nextPoint = stroke.points[i + 1];
              const dx = nextPoint.x - point.x;
              const dy = nextPoint.y - point.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);

              return (
                <View
                  key={i}
                  style={[
                    styles.line,
                    {
                      left: point.x,
                      top: point.y - 1.5,
                      width: length,
                      backgroundColor: darkMode ? Colors.dark.primary : Colors.light.primary,
                      transform: [{ rotate: `${angle}deg` }],
                    },
                  ]}
                />
              );
            })}
          </View>
        )}
      </View>
    );
  };

  const renderCurrentStroke = () => {
    if (currentStroke.length === 0) return null;

    return (
      <View style={StyleSheet.absoluteFill}>
        {currentStroke.slice(0, -1).map((point, i) => {
          const nextPoint = currentStroke[i + 1];
          const dx = nextPoint.x - point.x;
          const dy = nextPoint.y - point.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);

          return (
            <View
              key={i}
              style={[
                styles.line,
                {
                  left: point.x,
                  top: point.y - 1.5,
                  width: length,
                  backgroundColor: darkMode ? Colors.dark.primary : Colors.light.primary,
                  transform: [{ rotate: `${angle}deg` }],
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim },
        { backgroundColor: darkMode ? Colors.dark.surface : Colors.light.surface },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.canvas} />
      {strokes.map(renderStroke)}
      {renderCurrentStroke()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 40,
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0D5C7',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
  point: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  line: {
    position: 'absolute',
    height: 3,
    borderRadius: 1.5,
    transformOrigin: 'left center',
  },
});

export default DrawingCanvas;

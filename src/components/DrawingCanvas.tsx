import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, PanResponder, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Colors } from '../utils/theme';

interface Point {
  x: number;
  y: number;
}

interface DrawingCanvasProps {
  onTextRecognized: (text: string) => void;
  darkMode?: boolean;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onTextRecognized, darkMode = false }) => {
  const [paths, setPaths] = useState<string[]>([]);
  const currentPath = useRef<string>('');
  const strokeColor = darkMode ? Colors.dark.primary : Colors.light.primary;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPath.current = `M ${locationX} ${locationY}`;
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPath.current += ` L ${locationX} ${locationY}`;
        setPaths((prev) => [...prev.slice(0, -1), currentPath.current]);
      },
      onPanResponderRelease: () => {
        if (currentPath.current) {
          setPaths((prev) => [...prev.slice(0, -1), currentPath.current]);
        }
      },
    })
  ).current;

  const clearCanvas = useCallback(() => {
    currentPath.current = '';
    setPaths([]);
  }, []);

  const screenWidth = Dimensions.get('window').width - 40;
  const gridSize = screenWidth / 4;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          { backgroundColor: darkMode ? Colors.dark.surface : '#FFFEF9' },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.gridContainer}>
          <View style={[styles.horizontalLine, { top: gridSize }]} />
          <View style={[styles.horizontalLine, { top: gridSize * 2 }]} />
          <View style={[styles.horizontalLine, { top: gridSize * 3 }]} />
          <View style={[styles.verticalLine, { left: gridSize }]} />
          <View style={[styles.verticalLine, { left: gridSize * 2 }]} />
          <View style={[styles.verticalLine, { left: gridSize * 3 }]} />
        </View>

        {paths.map((pathData, index) => (
          <View
            key={index}
            style={[
              styles.pathContainer,
              { borderBottomColor: strokeColor },
            ]}
          >
            {pathData.split(' ').filter(p => p.startsWith('L')).map((segment, i) => {
              const coords = segment.substring(2).split(',');
              if (coords.length === 2) {
                return (
                  <View
                    key={i}
                    style={[
                      styles.drawPoint,
                      {
                        left: parseFloat(coords[0]) - 1,
                        top: parseFloat(coords[1]) - 1,
                        backgroundColor: strokeColor,
                      },
                    ]}
                  />
                );
              }
              return null;
            })}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.clearButton} onPress={clearCanvas}>
        <Text style={styles.clearButtonText}>🗑️ 清除</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    width: Dimensions.get('window').width - 40,
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0D5C7',
    overflow: 'hidden',
    position: 'relative',
  },
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  horizontalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(139, 0, 0, 0.2)',
  },
  verticalLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(139, 0, 0, 0.2)',
  },
  pathContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  drawPoint: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  clearButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#FFE4C4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8B0000',
  },
  clearButtonText: {
    color: '#8B0000',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DrawingCanvas;

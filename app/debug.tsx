import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { generateDictationExample, synthesizeSpeech } from '../src/services/doubaoService';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

export default function DebugPage() {
  const [inputText, setInputText] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const addLog = (message: string) => {
    setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const clearLog = () => {
    setLog([]);
  };

  const testChatAPI = async () => {
    if (!inputText.trim()) {
      Alert.alert('请输入要测试的汉字');
      return;
    }

    setIsTesting(true);
    addLog(`=== 开始测试豆包Chat API ===`);
    addLog(`输入: ${inputText}`);

    try {
      addLog('正在调用豆包API...');
      const result = await generateDictationExample(inputText, 1);
      addLog(`成功! 结果: ${result}`);
      Alert.alert('成功', `生成的例句: ${result}`);
    } catch (error) {
      addLog(`失败! 错误: ${error}`);
      Alert.alert('失败', `错误: ${error}`);
    } finally {
      setIsTesting(false);
    }
  };

  const testTTSAPI = async () => {
    if (!inputText.trim()) {
      Alert.alert('请输入要测试的文字');
      return;
    }

    setIsTesting(true);
    addLog(`=== 开始测试豆包TTS API ===`);
    addLog(`输入: ${inputText}`);

    try {
      addLog('正在调用豆包TTS API...');
      const audioBuffer = await synthesizeSpeech(inputText);
      
      if (audioBuffer) {
        addLog(`成功! 音频大小: ${audioBuffer.byteLength} bytes`);
        
        addLog('正在播放音频...');
        const blob = new Blob([audioBuffer], { type: 'audio/mp3' });
        const uri = URL.createObjectURL(blob);
        
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true }
        );
        
        await new Promise<void>((resolve) => {
          sound.setOnPlaybackStatusUpdate((status: any) => {
            if (status.didJustFinish) {
              sound.unloadAsync();
              URL.revokeObjectURL(uri);
              addLog('音频播放完成');
              resolve();
            }
          });
        });
        
        Alert.alert('成功', 'TTS测试成功，音频已播放（豆包语音）');
      } else {
        addLog('豆包TTS失败，尝试系统语音...');
        Alert.alert('豆包TTS失败', '尝试使用系统语音播放...');
        
        addLog('使用系统语音播放...');
        Speech.speak(inputText, {
          language: 'zh-CN',
          rate: 0.7,
        });
        
        addLog('系统语音播放完成');
        Alert.alert('成功', '系统语音播放成功');
      }
    } catch (error) {
      addLog(`失败! 错误: ${error}`);
      Alert.alert('失败', `错误: ${error}`);
    } finally {
      setIsTesting(false);
    }
  };

  const testFullDictation = async () => {
    if (!inputText.trim()) {
      Alert.alert('请输入要测试的汉字');
      return;
    }

    setIsTesting(true);
    addLog(`=== 开始测试完整听写流程 ===`);
    addLog(`输入: ${inputText}`);

    try {
      addLog('步骤1: 生成例句...');
      const example = await generateDictationExample(inputText, 1);
      addLog(`例句: ${example}`);

      addLog('步骤2: 合成语音...');
      const audioBuffer = await synthesizeSpeech(example);
      
      if (audioBuffer) {
        addLog(`音频生成成功，大小: ${audioBuffer.byteLength} bytes`);
        
        addLog('步骤3: 播放音频...');
        const blob = new Blob([audioBuffer], { type: 'audio/mp3' });
        const uri = URL.createObjectURL(blob);
        
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true }
        );
        
        await new Promise<void>((resolve) => {
          sound.setOnPlaybackStatusUpdate((status: any) => {
            if (status.didJustFinish) {
              sound.unloadAsync();
              URL.revokeObjectURL(uri);
              addLog('音频播放完成');
              resolve();
            }
          });
        });
        
        Alert.alert('成功', `完整流程测试成功!\n例句: ${example}\n使用豆包语音`);
      } else {
        addLog('豆包TTS失败，使用系统语音');
        
        addLog('步骤3: 使用系统语音播放...');
        Speech.speak(example, {
          language: 'zh-CN',
          rate: 0.7,
        });
        
        Alert.alert('部分成功', `例句生成成功: ${example}\n使用系统语音播放`);
      }
    } catch (error) {
      addLog(`失败! 错误: ${error}`);
      Alert.alert('失败', `错误: ${error}`);
    } finally {
      setIsTesting(false);
    }
  };

  const testSystemSpeech = async () => {
    if (!inputText.trim()) {
      Alert.alert('请输入要测试的文字');
      return;
    }

    setIsTesting(true);
    addLog(`=== 开始测试系统语音 ===`);
    addLog(`输入: ${inputText}`);

    try {
      addLog('正在使用系统语音播放...');
      Speech.speak(inputText, {
        language: 'zh-CN',
        rate: 0.7,
      });
      
      addLog('系统语音播放完成');
      Alert.alert('成功', '系统语音测试成功');
    } catch (error) {
      addLog(`失败! 错误: ${error}`);
      Alert.alert('失败', `错误: ${error}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>豆包API调试工具</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>输入测试文字:</Text>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="请输入汉字或词语，如：美丽"
          disabled={isTesting}
        />
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.buttonChat]}
          onPress={testChatAPI}
          disabled={isTesting}
        >
          <Text style={styles.buttonText}>测试Chat API</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.buttonTTS]}
          onPress={testTTSAPI}
          disabled={isTesting}
        >
          <Text style={styles.buttonText}>测试TTS API</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.buttonFull]}
          onPress={testFullDictation}
          disabled={isTesting}
        >
          <Text style={styles.buttonText}>测试完整流程</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.buttonSystem]}
          onPress={testSystemSpeech}
          disabled={isTesting}
        >
          <Text style={styles.buttonText}>测试系统语音</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.buttonClear]}
          onPress={clearLog}
          disabled={isTesting}
        >
          <Text style={styles.buttonText}>清空日志</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ 说明</Text>
        <Text style={styles.infoText}>• Chat API: 用于生成听写例句，测试结果显示正常</Text>
        <Text style={styles.infoText}>• TTS API: 用于语音合成，若失败会自动使用系统语音</Text>
        <Text style={styles.infoText}>• 系统语音: 使用设备自带的语音合成功能</Text>
        <Text style={styles.infoText}>• 如果TTS失败，可能是API密钥没有开通TTS权限</Text>
      </View>

      <View style={styles.logSection}>
        <Text style={styles.label}>调试日志:</Text>
        <ScrollView style={styles.log}>
          {log.map((item, index) => (
            <Text key={index} style={styles.logItem}>{item}</Text>
          ))}
          {log.length === 0 && (
            <Text style={styles.logEmpty}>点击上方按钮开始测试...</Text>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF8E7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B0000',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: '#8B0000',
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  buttons: {
    gap: 12,
    marginBottom: 20,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#8B0000',
  },
  buttonChat: {
    backgroundColor: '#8B0000',
  },
  buttonTTS: {
    backgroundColor: '#8B4513',
  },
  buttonFull: {
    backgroundColor: '#2E8B57',
  },
  buttonSystem: {
    backgroundColor: '#4169E1',
  },
  buttonClear: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B0000',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  logSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: '#8B0000',
  },
  log: {
    maxHeight: 400,
  },
  logItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  logEmpty: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

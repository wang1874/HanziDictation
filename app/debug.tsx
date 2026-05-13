import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { generateDictationExample, synthesizeSpeech } from '../src/services/doubaoService';
import { Audio } from 'expo-av';

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
        
        Alert.alert('成功', 'TTS测试成功，音频已播放');
      } else {
        addLog('失败! 返回null');
        Alert.alert('失败', 'TTS返回null，可能API密钥无效或网络问题');
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
        
        Alert.alert('成功', `完整流程测试成功!\n例句: ${example}`);
      } else {
        addLog('TTS失败，使用系统语音');
        Alert.alert('部分成功', `例句生成成功: ${example}\n但TTS失败，使用系统语音`);
      }
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
          placeholder="请输入汉字或词语，如：国"
          disabled={isTesting}
        />
      </View>

      <View style={styles.buttons}>
        <Button
          title="测试Chat API"
          onPress={testChatAPI}
          disabled={isTesting}
          color="#8B0000"
        />
        <Button
          title="测试TTS API"
          onPress={testTTSAPI}
          disabled={isTesting}
          color="#8B0000"
        />
        <Button
          title="测试完整流程"
          onPress={testFullDictation}
          disabled={isTesting}
          color="#008B00"
        />
        <Button
          title="清空日志"
          onPress={clearLog}
          disabled={isTesting}
          color="#666"
        />
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
    borderWidth: 1,
    borderColor: '#8B0000',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  buttons: {
    gap: 10,
    marginBottom: 20,
  },
  logSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
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

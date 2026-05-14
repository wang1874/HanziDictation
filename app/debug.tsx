import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { generateDictationExample, synthesizeSpeech, getCurrentConfig } from '../src/services/doubaoService';
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
      addLog('正在调用豆包Chat API...');
      const result = await generateDictationExample(inputText, 1);
      
      if (result.includes('怎么写')) {
        addLog(`⚠️ 结果: ${result} (这是本地回退例句，豆包API可能未正常工作)`);
        Alert.alert('注意', `生成的例句: ${result}\n\n⚠️ 这是本地回退例句，豆包API可能未正常工作。请检查API密钥配置。`);
      } else {
        addLog(`✅ 成功! 结果: ${result}`);
        Alert.alert('成功', `生成的例句: ${result}`);
      }
    } catch (error: any) {
      addLog(`❌ 失败! 错误: ${error.message || error}`);
      Alert.alert('失败', `错误: ${error.message || error}`);
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
      const result = await synthesizeSpeech(inputText);
      
      if (result.success && result.buffer) {
        addLog(`✅ 成功! 音频大小: ${result.buffer.byteLength} bytes`);
        
        addLog('正在播放音频...');
        const blob = new Blob([result.buffer], { type: 'audio/mp3' });
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
        addLog(`❌ 豆包TTS失败: ${result.error}`);
        if (result.details) {
          addLog(`详细信息: ${JSON.stringify(result.details, null, 2)}`);
        }
        
        addLog('使用系统语音播放...');
        Speech.speak(inputText, {
          language: 'zh-CN',
          rate: 0.7,
        });
        
        addLog('系统语音播放完成');
        Alert.alert('豆包TTS失败', `错误: ${result.error}\n\n请查看日志获取详细信息`);
      }
    } catch (error: any) {
      addLog(`❌ 失败! 错误: ${error.message || error}`);
      Alert.alert('失败', `错误: ${error.message || error}`);
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
      
      if (example.includes('怎么写')) {
        addLog(`例句: ${example} (本地回退)`);
      } else {
        addLog(`例句: ${example} (豆包生成)`);
      }

      addLog('步骤2: 合成语音...');
      const result = await synthesizeSpeech(example);
      
      if (result.success && result.buffer) {
        addLog(`✅ 音频生成成功，大小: ${result.buffer.byteLength} bytes`);
        
        addLog('步骤3: 播放音频(豆包语音)...');
        const blob = new Blob([result.buffer], { type: 'audio/mp3' });
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
        addLog(`❌ 豆包TTS失败: ${result.error}`);
        if (result.details) {
          addLog(`详细信息: ${JSON.stringify(result.details, null, 2)}`);
        }
        
        addLog('步骤3: 使用系统语音播放...');
        Speech.speak(example, {
          language: 'zh-CN',
          rate: 0.7,
        });
        
        Alert.alert('部分成功', `例句生成: ${example}\n使用系统语音播放`);
      }
    } catch (error: any) {
      addLog(`❌ 失败! 错误: ${error.message || error}`);
      Alert.alert('失败', `错误: ${error.message || error}`);
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
    } catch (error: any) {
      addLog(`❌ 失败! 错误: ${error.message || error}`);
      Alert.alert('失败', `错误: ${error.message || error}`);
    } finally {
      setIsTesting(false);
    }
  };

  const showConfig = () => {
    const config = getCurrentConfig();
    Alert.alert(
      '当前配置',
      `API密钥: ${config.apiKey ? '已配置' : '未配置'}\n` +
      `模型: ${config.model}\n` +
      `Chat API: ${config.chatUrl}\n` +
      `TTS API: ${config.ttsUrl}\n` +
      `TTS Access Token: ${config.ttsAccessToken ? '已配置' : '未配置'}\n` +
      `TTS App ID: ${config.ttsAppId}\n` +
      `TTS Resource ID: ${config.ttsResourceId}`,
      [{ text: '确定' }]
    );
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
          style={[styles.button, styles.buttonConfig]}
          onPress={showConfig}
          disabled={isTesting}
        >
          <Text style={styles.buttonText}>查看配置</Text>
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
        <Text style={styles.infoTitle}>ℹ️ 豆包TTS V3 配置说明</Text>
        <Text style={styles.infoText}>• API版本：V3 (HTTP Chunked单向流式)</Text>
        <Text style={styles.infoText}>• 需要在火山引擎控制台获取：</Text>
        <Text style={styles.infoText}>  1. App ID (应用标识)</Text>
        <Text style={styles.infoText}>  2. Access Token (应用令牌)</Text>
        <Text style={styles.infoText}>  3. Resource ID (资源ID：seed-tts-1.0/2.0)</Text>
        <Text style={styles.infoText}>• 鉴权方式：X-Api-App-Id + X-Api-Access-Key + X-Api-Resource-Id</Text>
        <Text style={styles.infoText}>• 免费音色：BV001_streaming, BV002_streaming</Text>
        <Text style={styles.infoText}>• 需确保TTS服务已开通且有配额</Text>
        <Text style={styles.infoTitle}>ℹ️ 常见问题</Text>
        <Text style={styles.infoText}>• 错误码0表示成功</Text>
        <Text style={styles.infoText}>• 鉴权失败检查AppId和Access Token是否正确</Text>
        <Text style={styles.infoText}>• "quota exceeded"表示配额用完了</Text>
      </View>

      <View style={styles.logSection}>
        <Text style={styles.label}>调试日志:</Text>
        <ScrollView 
          style={styles.log}
          ref={(ref: any) => {
            if (ref) {
              setTimeout(() => ref.scrollToEnd({ animated: false }), 100);
            }
          }}
        >
          {log.map((item, index) => (
            <Text key={index} style={[
              styles.logItem,
              item.includes('✅') ? styles.logSuccess : 
              item.includes('❌') ? styles.logError : 
              item.includes('⚠️') ? styles.logWarning : styles.logItem
            ]}>
              {item}
            </Text>
          ))}
          {log.length === 0 && (
            <Text style={styles.logEmpty}>点击上方按钮开始测试...</Text>
          )}
          <View style={styles.bottomPadding} />
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
  buttonConfig: {
    backgroundColor: '#666',
  },
  buttonClear: {
    backgroundColor: '#888',
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
  logSuccess: {
    color: '#2E8B57',
  },
  logError: {
    color: '#DC143C',
  },
  logWarning: {
    color: '#FF8C00',
  },
  logEmpty: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  bottomPadding: {
    height: 100,
  },
});

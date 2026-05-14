import * as FileSystem from 'expo-file-system';

const AUDIO_CACHE_DIR = `${FileSystem.documentDirectory}audio_cache/`;

export const audioCache = {
  async init(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(AUDIO_CACHE_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(AUDIO_CACHE_DIR, { intermediates: true });
        console.log('[音频缓存] 创建缓存目录成功');
      }
    } catch (error) {
      console.error('[音频缓存] 初始化缓存目录失败:', error);
    }
  },

  generateCacheKey(text: string): string {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const positiveHash = Math.abs(hash);
    return `audio_${positiveHash.toString(16)}.mp3`;
  },

  getCachePath(text: string): string {
    const fileName = this.generateCacheKey(text);
    return `${AUDIO_CACHE_DIR}${fileName}`;
  },

  async hasCache(text: string): Promise<boolean> {
    try {
      const cachePath = this.getCachePath(text);
      const fileInfo = await FileSystem.getInfoAsync(cachePath);
      return fileInfo.exists;
    } catch (error) {
      console.error('[音频缓存] 检查缓存失败:', error);
      return false;
    }
  },

  async saveAudio(text: string, audioBuffer: ArrayBuffer): Promise<string | null> {
    try {
      await this.init();
      const cachePath = this.getCachePath(text);
      
      const uint8Array = new Uint8Array(audioBuffer);
      const base64 = this.uint8ArrayToBase64(uint8Array);
      
      await FileSystem.writeAsStringAsync(cachePath, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      console.log('[音频缓存] 保存成功:', cachePath);
      return cachePath;
    } catch (error) {
      console.error('[音频缓存] 保存失败:', error);
      return null;
    }
  },

  async getAudio(text: string): Promise<string | null> {
    try {
      const cachePath = this.getCachePath(text);
      const fileInfo = await FileSystem.getInfoAsync(cachePath);
      
      if (fileInfo.exists) {
        console.log('[音频缓存] 命中缓存:', cachePath);
        return cachePath;
      }
      
      return null;
    } catch (error) {
      console.error('[音频缓存] 读取失败:', error);
      return null;
    }
  },

  async clearCache(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(AUDIO_CACHE_DIR);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(AUDIO_CACHE_DIR, { idempotent: true });
        console.log('[音频缓存] 清理缓存成功');
      }
    } catch (error) {
      console.error('[音频缓存] 清理缓存失败:', error);
    }
  },

  async getCacheSize(): Promise<number> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(AUDIO_CACHE_DIR);
      if (!dirInfo.exists) {
        return 0;
      }
      
      const files = await FileSystem.readDirectoryAsync(AUDIO_CACHE_DIR);
      let totalSize = 0;
      
      for (const file of files) {
        const fileInfo = await FileSystem.getInfoAsync(`${AUDIO_CACHE_DIR}${file}`);
        if (fileInfo.exists && 'size' in fileInfo) {
          totalSize += fileInfo.size;
        }
      }
      
      return totalSize;
    } catch (error) {
      console.error('[音频缓存] 获取缓存大小失败:', error);
      return 0;
    }
  },

  uint8ArrayToBase64(uint8Array: Uint8Array): string {
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  },
};

export default audioCache;

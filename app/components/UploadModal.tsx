import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
  onStart: (galleryName: string) => void;
  uploading: boolean;
  progress: number; // 0-1
  speed: number; // KB/s
  remain: number; // 秒
  galleryNameDefault: string;
  cancelable?: boolean;
  onCancel?: () => void;
  message?: string;
}

export default function UploadModal({
  visible,
  onClose,
  onStart,
  uploading,
  progress,
  speed,
  remain,
  galleryNameDefault,
  cancelable,
  onCancel,
  message,
}: UploadModalProps) {
  const [galleryName, setGalleryName] = useState(galleryNameDefault);

  useEffect(() => {
    setGalleryName(galleryNameDefault);
  }, [galleryNameDefault, visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.mask}>
        <View style={styles.panel}>
          <View style={styles.header}>
            <Text style={styles.title}>上传到图库</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#888" />
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>图库名称</Text>
          <TextInput
            style={styles.input}
            value={galleryName}
            onChangeText={setGalleryName}
            editable={!uploading}
            placeholder="请输入目标图库名"
          />
          {uploading ? (
            <View style={{ marginTop: 24 }}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBar, { width: `${Math.round(progress * 100)}%` }]} />
              </View>
              <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
              <Text style={styles.speedText}>
                速率：{speed > 1024 ? (speed / 1024).toFixed(1) + ' MB/s' : speed.toFixed(0) + ' KB/s'}
                {'  '}剩余：{remain > 60 ? Math.ceil(remain / 60) + ' 分' : remain + ' 秒'}
              </Text>
              <ActivityIndicator style={{ marginTop: 12 }} size="small" color="#00bcd4" />
              {cancelable && (
                <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                  <Ionicons name="close-circle-outline" size={20} color="#00bcd4" />
                  <Text style={styles.cancelBtnText}>取消上传</Text>
                </TouchableOpacity>
              )}
              {!!message && <Text style={styles.messageText}>{message}</Text>}
            </View>
          ) : (
            <TouchableOpacity style={styles.startBtn} onPress={() => onStart(galleryName)}>
              <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
              <Text style={styles.startBtnText}>开始上传</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panel: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  closeBtn: {
    padding: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 8,
    backgroundColor: '#fafbfc',
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00bcd4',
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    alignSelf: 'center',
    marginTop: 24,
  },
  startBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#00bcd4',
    borderRadius: 6,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#00bcd4',
    marginTop: 8,
    fontWeight: 'bold',
  },
  speedText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e0f7fa',
  },
  cancelBtnText: {
    color: '#00bcd4',
    fontSize: 15,
    marginLeft: 6,
    fontWeight: 'bold',
  },
  messageText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 15,
    marginTop: 10,
  },
}); 
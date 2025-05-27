import { fetchPhotosInGallery } from '@/src/services/galleryService';
import { uploadPhotoToNAS } from '@/src/services/uploadPhoto';
import { webdavStore } from '@/src/store/webdavStore';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { clearUploadNotification, initNotificationChannel, showOrUpdateUploadNotification } from '../utils/notification';
import UploadModal from './UploadModal';

export default observer(function GalleryDetailScreen({ route }: any) {
  const { galleryName } = route.params;
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const webdavConfig = webdavStore.selectedConfig;
  const [uploadVisible, setUploadVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [uploadRemain, setUploadRemain] = useState(0);
  const [uploadList, setUploadList] = useState<any[]>([]);
  const [uploadStartTime, setUploadStartTime] = useState<number>(0);
  const [uploadGalleryName, setUploadGalleryName] = useState('');
  const [uploadCancel, setUploadCancel] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    if (!webdavConfig) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        setSelected(new Set());
        setSelectMode(false);
        const data = await fetchPhotosInGallery(galleryName, webdavConfig);
        setPhotos(data);
      } catch (e: any) {
        setError(e.message || '加载失败');
      } finally {
        setLoading(false);
      }
    })();
  }, [galleryName, webdavConfig]);

  // 计算图片宽度
  const numColumns = 3;
  const screenWidth = Dimensions.get('window').width;
  const imageSize = (screenWidth - 4 * numColumns) / numColumns;

  const toggleSelect = (filename: string) => {
    setSelectMode(true);
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(filename)) next.delete(filename);
      else next.add(filename);
      return next;
    });
  };

  const handleLongPress = (filename: string) => {
    setSelectMode(true);
    setSelected(new Set([filename]));
  };

  const handleSelectAll = () => {
    if (selected.size === photos.length) setSelected(new Set());
    else setSelected(new Set(photos.map((p: any) => p.filename)));
  };

  const handleCancelSelect = () => {
    setSelectMode(false);
    setSelected(new Set());
  };

  // 上传逻辑
  const handleUpload = (galleryName: string) => {
    if (!webdavConfig) return;
    initNotificationChannel();
    setUploadGalleryName(galleryName);
    setUploadVisible(true);
    setUploading(true);
    setUploadCancel(false);
    setUploadMessage('');
    const list = photos.filter((p: any) => selected.has(p.filename));
    setUploadList(list);
    setUploadStartTime(Date.now());
    let uploaded = 0;
    let lastTime = Date.now();
    let lastBytes = 0;
    let totalBytes = 0;
    let bytesUploaded = 0;
    list.forEach(p => { totalBytes += p.size || 0; });
    (async () => {
      for (let i = 0; i < list.length; i++) {
        if (uploadCancel) {
          setUploadMessage('已取消');
          break;
        }
        const photo = list[i];
        const t0 = Date.now();
        await uploadPhotoToNAS(photo, galleryName, webdavConfig);
        uploaded++;
        bytesUploaded += photo.size || 0;
        const t1 = Date.now();
        const elapsed = (t1 - uploadStartTime) / 1000;
        const speed = bytesUploaded / elapsed / 1024; // KB/s
        setUploadProgress(uploaded / list.length);
        setUploadSpeed(speed);
        setUploadRemain(speed > 0 ? (totalBytes - bytesUploaded) / 1024 / speed : 0);
        lastTime = t1;
        lastBytes = bytesUploaded;
        showOrUpdateUploadNotification(uploaded, list.length);
      }
      setUploading(false);
      clearUploadNotification();
      if (!uploadCancel) {
        setUploadMessage('上传完成');
        setTimeout(() => setUploadVisible(false), 1200);
        // 自动刷新
        setTimeout(() => {
          setSelected(new Set());
          setSelectMode(false);
          (async () => {
            const data = await fetchPhotosInGallery(galleryName, webdavConfig);
            setPhotos(data);
          })();
        }, 1500);
      }
    })();
  };

  // 取消上传
  const handleCancelUpload = () => {
    setUploadCancel(true);
    setUploading(false);
    setUploadMessage('已取消');
    clearUploadNotification();
    setTimeout(() => setUploadVisible(false), 1000);
  };

  // 顶部操作栏
  const renderHeader = () => (
    <View style={styles.headerBar}>
      {selectMode ? (
        <>
          <TouchableOpacity onPress={handleCancelSelect} style={styles.headerBtn}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>已选 {selected.size} 张</Text>
          <TouchableOpacity onPress={handleSelectAll} style={styles.headerBtn}>
            <Ionicons name="checkmark-done" size={24} color="#333" />
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.headerTitle}>{galleryName}</Text>
      )}
    </View>
  );

  if (!webdavConfig) return <Text style={{ padding: 20 }}>请先选择 WebDAV 连接</Text>;
  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (error) return <Text style={{ color: 'red', padding: 20 }}>{error}</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {renderHeader()}
      <FlashList
        data={photos}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.imageWrapper, selectMode && selected.has(item.filename) && styles.selectedCard]}
            onPress={() => selectMode ? toggleSelect(item.filename) : null}
            onLongPress={() => handleLongPress(item.filename)}
          >
            <FastImage
              style={{ width: imageSize, height: imageSize, borderRadius: 10 }}
              source={{
                uri: webdavConfig.url + item.filename,
                headers: { Authorization: 'Basic ' + btoa(webdavConfig.username + ':' + webdavConfig.password) },
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            {selectMode && (
              <View style={styles.checkbox}>
                {selected.has(item.filename) ? (
                  <Ionicons name="checkbox" size={22} color="#00bcd4" />
                ) : (
                  <Ionicons name="square-outline" size={22} color="#bbb" />
                )}
              </View>
            )}
            <Text style={styles.dateText}>{item.lastmod?.slice(0, 10)}</Text>
          </Pressable>
        )}
        estimatedItemSize={imageSize + 40}
        numColumns={numColumns}
        keyExtractor={item => item.filename}
        contentContainerStyle={{ padding: 4, paddingBottom: 80 }}
      />
      {selectMode && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.uploadBtn} onPress={() => handleUpload(galleryName)}>
            <Ionicons name="cloud-upload-outline" size={22} color="#fff" />
            <Text style={styles.uploadBtnText}>上传已选（{selected.size}）</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.uploadBtn, { marginLeft: 12, backgroundColor: '#009688' }]} onPress={() => handleUpload(galleryName)}>
            <Ionicons name="cloud-upload" size={22} color="#fff" />
            <Text style={styles.uploadBtnText}>上传整个图库</Text>
          </TouchableOpacity>
        </View>
      )}
      <UploadModal
        visible={uploadVisible}
        onClose={() => { if (!uploading) setUploadVisible(false); }}
        onStart={name => handleUpload(name)}
        uploading={uploading}
        progress={uploadProgress}
        speed={uploadSpeed}
        remain={uploadRemain}
        galleryNameDefault={uploadGalleryName || galleryName}
        cancelable={uploading}
        onCancel={handleCancelUpload}
        message={uploadMessage}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    paddingHorizontal: 12,
    marginBottom: 2,
  },
  headerBtn: {
    padding: 6,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  imageWrapper: {
    margin: 4,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    position: 'relative',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#00bcd4',
  },
  checkbox: {
    position: 'absolute',
    left: 8,
    top: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 1,
    zIndex: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    marginBottom: 4,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00bcd4',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 10,
    shadowColor: '#00bcd4',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  uploadBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 
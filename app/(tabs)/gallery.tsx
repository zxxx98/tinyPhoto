import { fetchGalleries } from '@/src/services/galleryService';
import { webdavStore } from '@/src/store/webdavStore';
import { FlashList } from '@shopify/flash-list';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default observer(function GalleryListScreen({ navigation }: any) {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const webdavConfig = webdavStore.selectedConfig;

  useEffect(() => {
    if (!webdavConfig) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGalleries(webdavConfig);
        setGalleries(data);
      } catch (e: any) {
        setError(e.message || '加载失败');
      } finally {
        setLoading(false);
      }
    })();
  }, [webdavConfig]);

  if (!webdavConfig) return <Text style={{ padding: 20 }}>请先选择 WebDAV 连接</Text>;
  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (error) return <Text style={{ color: 'red', padding: 20 }}>{error}</Text>;

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={galleries}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('galleryDetail', { galleryName: item.basename })}
          >
            <Text style={styles.text}>{item.basename}</Text>
          </TouchableOpacity>
        )}
        estimatedItemSize={60}
        keyExtractor={item => item.basename}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  item: {
    padding: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  text: {
    fontSize: 18,
  },
}); 
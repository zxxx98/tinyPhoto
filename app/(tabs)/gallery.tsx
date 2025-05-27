import { fetchGalleries } from '@/src/services/galleryService';
import { webdavStore } from '@/src/store/webdavStore';
import { Card, Icon, Text, useTheme } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default observer(function GalleryListScreen({ navigation }: any) {
  const { theme } = useTheme();
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

  if (!webdavConfig) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card containerStyle={[styles.card, { backgroundColor: theme.colors.white }]}>
          <Card.Title style={{ color: theme.colors.primary }}>提示</Card.Title>
          <Card.Divider />
          <Text style={[styles.message, { color: theme.colors.grey2 }]}>
            请先在WebDAV页面选择或添加连接
          </Text>
        </Card>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card containerStyle={[styles.card, { backgroundColor: theme.colors.white }]}>
          <Card.Title style={{ color: theme.colors.primary }}>加载中</Card.Title>
          <Card.Divider />
          <Icon
            name="hourglass-empty"
            type="material"
            color={theme.colors.primary}
            size={48}
          />
        </Card>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card containerStyle={[styles.card, { backgroundColor: theme.colors.white }]}>
          <Card.Title style={{ color: theme.colors.error }}>错误</Card.Title>
          <Card.Divider />
          <Text style={[styles.message, { color: theme.colors.error }]}>{error}</Text>
        </Card>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlashList
        data={galleries}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('galleryDetail', { galleryName: item.basename })}
          >
            <Card containerStyle={[styles.galleryCard, { backgroundColor: theme.colors.white }]}>
              <View style={styles.galleryItem}>
                <Icon
                  name="folder"
                  type="material"
                  color={theme.colors.primary}
                  size={24}
                  style={styles.icon}
                />
                <Text style={[styles.galleryName, { color: theme.colors.grey0 }]}>
                  {item.basename}
                </Text>
                <Icon
                  name="chevron-right"
                  type="material"
                  color={theme.colors.grey2}
                  size={24}
                />
              </View>
            </Card>
          </TouchableOpacity>
        )}
        estimatedItemSize={80}
        keyExtractor={item => item.basename}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 10,
    marginHorizontal: 0,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    padding: 16,
  },
  galleryCard: {
    borderRadius: 10,
    marginHorizontal: 0,
    marginBottom: 8,
    padding: 12,
  },
  galleryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  galleryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
}); 
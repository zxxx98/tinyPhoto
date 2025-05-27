import { webdavStore } from '@/src/store/webdavStore';
import { Button, Card, Input, Text, useTheme } from '@rneui/themed';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

// 简单本地存储，可替换为更安全的存储方案
const defaultConnections = [
  { name: '示例NAS', url: 'https://your-nas/webdav', username: 'your-username', password: 'your-password' },
];

export default observer(function WebDAVManager({ navigation }: any) {
  const { theme } = useTheme();
  const [form, setForm] = useState({ name: '', url: '', username: '', password: '' });

  // 选择已有连接
  const handleSelect = async (idx: number) => {
    await webdavStore.selectConnection(idx);
    Alert.alert('已选择', `当前连接：${webdavStore.connections[idx].name}`);
    // navigation.navigate('gallery');
  };

  // 新增连接
  const handleAdd = async () => {
    if (!form.name || !form.url || !form.username || !form.password) {
      Alert.alert('请填写完整信息');
      return;
    }
    await webdavStore.addConnection({ ...form });
    setForm({ name: '', url: '', username: '', password: '' });
    Alert.alert('添加成功');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card containerStyle={[styles.card, { backgroundColor: theme.colors.white }]}>
        <Card.Title style={{ color: theme.colors.primary }}>选择 WebDAV 连接</Card.Title>
        <Card.Divider />
        <FlatList
          data={webdavStore.connections}
          keyExtractor={item => item.name}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.connItem,
                { backgroundColor: theme.colors.white },
                webdavStore.selected === index && { backgroundColor: theme.colors.primary + '20' }
              ]}
              onPress={() => handleSelect(index)}
            >
              <Text style={[styles.connText, { color: theme.colors.grey0 }]}>
                {item.name}
              </Text>
              <Text style={[styles.connUrl, { color: theme.colors.grey2 }]}>
                {item.url}
              </Text>
            </TouchableOpacity>
          )}
          style={styles.list}
        />
      </Card>

      <Card containerStyle={[styles.card, { backgroundColor: theme.colors.white }]}>
        <Card.Title style={{ color: theme.colors.primary }}>新增 WebDAV 连接</Card.Title>
        <Card.Divider />
        <Input
          placeholder="名称"
          value={form.name}
          onChangeText={v => setForm(f => ({ ...f, name: v }))}
          leftIcon={{ type: 'material', name: 'label', color: theme.colors.grey2 }}
        />
        <Input
          placeholder="WebDAV 地址"
          value={form.url}
          onChangeText={v => setForm(f => ({ ...f, url: v }))}
          leftIcon={{ type: 'material', name: 'link', color: theme.colors.grey2 }}
        />
        <Input
          placeholder="用户名"
          value={form.username}
          onChangeText={v => setForm(f => ({ ...f, username: v }))}
          leftIcon={{ type: 'material', name: 'person', color: theme.colors.grey2 }}
        />
        <Input
          placeholder="密码"
          value={form.password}
          secureTextEntry
          onChangeText={v => setForm(f => ({ ...f, password: v }))}
          leftIcon={{ type: 'material', name: 'lock', color: theme.colors.grey2 }}
        />
        <Button
          title="添加连接"
          onPress={handleAdd}
          buttonStyle={{ backgroundColor: theme.colors.primary }}
          containerStyle={styles.buttonContainer}
        />
      </Card>
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
  list: {
    marginBottom: 8,
  },
  connItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  connText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  connUrl: {
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 16,
    borderRadius: 8,
  },
}); 
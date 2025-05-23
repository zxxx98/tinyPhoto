import React, { useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { webdavStore } from '@/src/store/webdavStore';

// 简单本地存储，可替换为更安全的存储方案
const defaultConnections = [
  { name: '示例NAS', url: 'https://your-nas/webdav', username: 'your-username', password: 'your-password' },
];

export default observer(function WebDAVManager({ navigation }: any) {
  const [form, setForm] = useState({ name: '', url: '', username: '', password: '' });

  // 选择已有连接
  const handleSelect = async (idx: number) => {
    await webdavStore.selectConnection(idx);
    Alert.alert('已选择', `当前连接：${webdavStore.connections[idx].name}`);
    navigation.navigate('gallery');
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
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>选择 WebDAV 连接</Text>
      <FlatList
        data={webdavStore.connections}
        keyExtractor={item => item.name}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.connItem, webdavStore.selected === index && styles.selected]}
            onPress={() => handleSelect(index)}
          >
            <Text style={styles.connText}>{item.name} ({item.url})</Text>
          </TouchableOpacity>
        )}
        style={{ marginBottom: 24 }}
      />
      <Text style={styles.title}>新增 WebDAV 连接</Text>
      <TextInput
        style={styles.input}
        placeholder="名称"
        value={form.name}
        onChangeText={v => setForm(f => ({ ...f, name: v }))}
      />
      <TextInput
        style={styles.input}
        placeholder="WebDAV 地址"
        value={form.url}
        onChangeText={v => setForm(f => ({ ...f, url: v }))}
      />
      <TextInput
        style={styles.input}
        placeholder="用户名"
        value={form.username}
        onChangeText={v => setForm(f => ({ ...f, username: v }))}
      />
      <TextInput
        style={styles.input}
        placeholder="密码"
        value={form.password}
        secureTextEntry
        onChangeText={v => setForm(f => ({ ...f, password: v }))}
      />
      <Button title="添加连接" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  connItem: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 8,
  },
  selected: {
    backgroundColor: '#e0f7fa',
    borderColor: '#00bcd4',
  },
  connText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
}); 
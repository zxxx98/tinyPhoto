import { Card, Text, useTheme } from '@rneui/themed';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.logo}
        />
        <Text h1 style={[styles.title, { color: theme.colors.primary }]}>
          TinyPhoto
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.grey2 }]}>
          您的照片管理助手
        </Text>
      </View>

      <Card containerStyle={[styles.card, { backgroundColor: theme.colors.white }]}>
        <Card.Title style={{ color: theme.colors.primary }}>快速开始</Card.Title>
        <Card.Divider />
        <Text style={{ color: theme.colors.grey2 }}>
          1. 在WebDAV页面配置您的WebDAV服务器信息
        </Text>
        <Text style={{ color: theme.colors.grey2 }}>
          2. 浏览和管理您的照片
        </Text>
        <Text style={{ color: theme.colors.grey2 }}>
          3. 享受便捷的照片管理体验
        </Text>
      </Card>

      <Card containerStyle={[styles.card, { backgroundColor: theme.colors.white }]}>
        <Card.Title style={{ color: theme.colors.primary }}>功能特点</Card.Title>
        <Card.Divider />
        <Text style={{ color: theme.colors.grey2 }}>
          • 支持WebDAV协议
        </Text>
        <Text style={{ color: theme.colors.grey2 }}>
          • 照片预览和管理
        </Text>
        <Text style={{ color: theme.colors.grey2 }}>
          • 深色模式支持
        </Text>
        <Text style={{ color: theme.colors.grey2 }}>
          • 流畅的用户体验
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    height: 120,
    width: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
  },
  card: {
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

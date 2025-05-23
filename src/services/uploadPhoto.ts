import * as FileSystem from 'expo-file-system';
import { getWebDAVClient } from './webdavClient';

/**
 * 上传单张照片到NAS，按图库名/年/月/日归档
 * @param photo 照片对象，需包含 uri、filename、creationTime
 * @param galleryName 图库名（一级文件夹）
 * @param webdavConfig WebDAV配置
 */
export async function uploadPhotoToNAS(
  photo: { uri: string; filename: string; creationTime: number },
  galleryName: string,
  webdavConfig: { url: string; username: string; password: string }
) {
  const client = getWebDAVClient(webdavConfig);

  // 获取照片创建时间
  const date = new Date(photo.creationTime * 1000);
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);

  // 构建 NAS 路径
  const remotePath = `/${galleryName}/${year}/${month}/${day}/${photo.filename}`;

  // 读取本地文件为二进制
  const fileData = await FileSystem.readAsStringAsync(photo.uri, { encoding: FileSystem.EncodingType.Base64 });
  const buffer = Buffer.from(fileData, 'base64');

  // 上传到 NAS
  await client.putFileContents(remotePath, buffer);
} 
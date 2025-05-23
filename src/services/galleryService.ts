import { getWebDAVClient } from './webdavClient';

/**
 * 获取远端图库列表（一级文件夹）
 */
export async function fetchGalleries(webdavConfig: { url: string; username: string; password: string }) {
  const client = getWebDAVClient(webdavConfig);
  const itemsRaw = await client.getDirectoryContents('/');
  const items = Array.isArray(itemsRaw) ? itemsRaw : itemsRaw.data;
  return items.filter((item: any) => item.type === 'directory');
}

/**
 * 获取指定图库下所有照片（递归，按时间排序）
 */
export async function fetchPhotosInGallery(
  galleryName: string,
  webdavConfig: { url: string; username: string; password: string }
) {
  const client = getWebDAVClient(webdavConfig);
  const itemsRaw = await client.getDirectoryContents(`/${galleryName}`, { deep: true });
  const items = Array.isArray(itemsRaw) ? itemsRaw : itemsRaw.data;
  const images = items.filter((item: any) => item.type === 'file');
  // 按文件名（路径）中的年月日排序
  images.sort((a: any, b: any) => a.filename.localeCompare(b.filename));
  return images;
} 
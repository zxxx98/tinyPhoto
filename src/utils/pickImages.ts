import * as MediaLibrary from 'expo-media-library';

/**
 * 获取所有相册（文件夹）
 */
export async function getAlbums() {
  const albums = await MediaLibrary.getAlbumsAsync();
  return albums;
}

/**
 * 获取指定相册中的照片
 * @param albumId 相册ID
 */
export async function getPhotosFromAlbum(albumId: string) {
  const photos = await MediaLibrary.getAssetsAsync({
    album: albumId,
    mediaType: 'photo',
    first: 1000, // 可根据需要调整
  });
  return photos.assets;
} 
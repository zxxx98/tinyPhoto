import PushNotification from 'react-native-push-notification';

let uploadNotificationId: number | null = null;

export function initNotificationChannel() {
  PushNotification.createChannel(
    {
      channelId: 'upload',
      channelName: '上传进度',
      channelDescription: '显示上传进度的通知',
      importance: 4,
      vibrate: false,
    },
    (created) => {}
  );
}

export function showOrUpdateUploadNotification(current: number, total: number) {
  const percent = Math.round((current / total) * 100);
  if (uploadNotificationId == null) {
    uploadNotificationId = Math.floor(Math.random() * 1000000);
  }
  PushNotification.localNotification({
    channelId: 'upload',
    id: String(uploadNotificationId),
    title: '照片正在上传',
    message: `已完成 ${current}/${total} (${percent}%)`,
    progress: percent,
    onlyAlertOnce: true,
    ongoing: true,
    importance: 'high',
    priority: 'high',
    allowWhileIdle: true,
    visibility: 'public',
    playSound: false,
    soundName: 'default',
    autoCancel: false,
  });
}

export function clearUploadNotification() {
  if (uploadNotificationId != null) {
    PushNotification.cancelLocalNotifications({ id: String(uploadNotificationId) });
    uploadNotificationId = null;
  }
} 
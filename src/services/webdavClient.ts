import { createClient } from 'webdav';

/**
 * 创建 WebDAV 客户端实例
 * @param config WebDAV 配置，包括 url、用户名、密码
 */
export function getWebDAVClient(config: { url: string; username: string; password: string }) {
  return createClient(config.url, {
    username: config.username,
    password: config.password,
  });
} 
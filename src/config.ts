export interface EnvironmentConfig {
  baseUrl: string;
  accessKey: string;
}

export const CONFIG: Record<'live' | 'sandbox', EnvironmentConfig> = {
  live: {
    baseUrl: 'https://carbonapisecure.getcarbon.co/baas/api',
    accessKey: 'key-auth',
  },
  sandbox: {
    baseUrl: 'https://carbonapistagingsecure.getcarbon.co/baas/api',
    accessKey: 'baas-consumers',
  },
};
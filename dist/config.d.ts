export interface EnvironmentConfig {
    baseUrl: string;
    accessKey: string;
}
export declare const CONFIG: Record<'live' | 'sandbox', EnvironmentConfig>;

interface UpdateWebhookRequest {
    url: string;
}
export declare function fetchWebhook(): Promise<any>;
export declare function updateWebhook(data: UpdateWebhookRequest): Promise<any>;
export declare function fetchWebhookHistory(page?: number, limit?: number): Promise<any>;
export declare function resendWebhookEvent(eventId: string): Promise<any>;
export {};

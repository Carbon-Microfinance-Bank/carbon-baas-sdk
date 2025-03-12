import { getInstance } from './index';
import { handleError } from './util';

interface UpdateWebhookRequest {
  url: string;
}

interface WebhookResponse {
  status: string;
  message: string;
  data: {
    url: string;
    signature_secret: string | null;
    status: string;
    mode: string;
  };
}

interface WebhookHistoryResponse {
  status: string;
  message: string;
  data: Array<{
    event_id: string;
    event_type: string;
    data: {
      event: string;
      data: {
        id: string;
        amount: number;
        currency: string;
        transactionType: string;
        entryDate: string;
        uniqueRef: string;
        account: {
          id: string;
          bankAccount: {
            accountName: string;
            accountNumber: string;
            bank: {
              code: string;
              name: string;
            };
          };
          static: boolean;
          currency: string;
          clientId: string;
        };
      };
    };
    created_at: string;
    updated_at: string;
  }>;
  total: number;
}

export async function fetchWebhook() {
  try {
    const response = await getInstance().get('/v1/webhook');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function updateWebhook(data: UpdateWebhookRequest) {
  try {
    const response = await getInstance().put('/v1/webhook', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function fetchWebhookHistory(page: number = 0, limit: number = 10) {
  try {
    const response = await getInstance().get('/v1/webhook/history', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function resendWebhookEvent(eventId: string) {
  try {
    const response = await getInstance().post('/v1/webhook/resend-webhook-event', {
      event_id: eventId,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}
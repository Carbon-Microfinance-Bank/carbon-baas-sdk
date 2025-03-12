import { fetchWebhook, updateWebhook, fetchWebhookHistory, resendWebhookEvent } from '../src/webhook';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import axios from 'axios';

jest.mock('../src/index', () => ({
  getInstance: () => axios,
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Webhook API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch webhook configuration', async () => {
    const responseData = {
      status: 'success',
      message: 'webhook fetched successfully',
      data: {
        url: 'https://webhook.site/example',
        signature_secret: null,
        status: 'active',
        mode: 'sandbox'
      }
    };

    mockedAxios.get.mockResolvedValueOnce({ data: responseData });

    const result = await fetchWebhook();
    expect(result).toEqual(responseData);
    expect(mockedAxios.get).toHaveBeenCalledWith('/v1/webhook');
  });

  it('should update webhook configuration', async () => {
    const webhookData = {
      url: 'https://webhook.site/new-example'
    };

    const responseData = {
      status: 'success',
      message: 'successfully updated webhook',
      data: {
        url: webhookData.url,
        signature_secret: null,
        status: 'active',
        mode: 'sandbox'
      }
    };

    mockedAxios.put.mockResolvedValueOnce({ data: responseData });

    const result = await updateWebhook(webhookData);
    expect(result).toEqual(responseData);
    expect(mockedAxios.put).toHaveBeenCalledWith('/v1/webhook', webhookData);
  });

  it('should fetch webhook history', async () => {
    const responseData = {
      status: 'success',
      message: 'data fetched successfully',
      data: [],
      total: 0
    };

    mockedAxios.get.mockResolvedValueOnce({ data: responseData });

    const result = await fetchWebhookHistory();
    expect(result).toEqual(responseData);
    expect(mockedAxios.get).toHaveBeenCalledWith('/v1/webhook/history', {
      params: { page: 0, limit: 10 }
    });
  });

  it('should resend webhook event', async () => {
    const eventId = 'test-event-id';
    const responseData = {
      status: 'success',
      message: 'webhook event resent successfully'
    };

    mockedAxios.post.mockResolvedValueOnce({ data: responseData });

    const result = await resendWebhookEvent(eventId);
    expect(result).toEqual(responseData);
    expect(mockedAxios.post).toHaveBeenCalledWith('/v1/webhook/resend-webhook-event', {
      event_id: eventId
    });
  });
});

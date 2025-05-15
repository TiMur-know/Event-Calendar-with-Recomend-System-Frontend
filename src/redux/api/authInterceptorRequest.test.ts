import axios from 'axios';
import authApi from './authInterceptorRequest';
import store from '../store';
import { vi } from 'vitest';

vi.mock('../store', () => ({
  default: {
    getState: vi.fn(),
  },
}));

describe('authApi interceptor', () => {
  const mockToken = 'mocked-token';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add Authorization header if token exists', async () => {
    (store.getState as vi.Mock).mockReturnValue({ auth: { token: mockToken } });

    const config = await authApi.interceptors.request.handlers[0].fulfilled({
      headers: {},
    });

    expect(config.headers.Authorization).toBe(`Bearer ${mockToken}`);
  });

  it('should not add Authorization header if no token', async () => {
    (store.getState as vi.Mock).mockReturnValue({ auth: { token: null } });

    const config = await authApi.interceptors.request.handlers[0].fulfilled({
      headers: {},
    });

    expect(config.headers.Authorization).toBeUndefined();
  });

  it('should handle response normally', async () => {
    const response = { data: 'success' };
    const result = await authApi.interceptors.response.handlers[0].fulfilled(response);
    expect(result).toBe(response);
  });

  it('should redirect to login on 403 with error code 40304', async () => {
    const locationSpy = vi.spyOn(window, 'location', 'get');
    locationSpy.mockReturnValue({ hash: '' } as any);

    const error = {
      response: {
        status: 403,
        data: { error: 40304 },
      },
    };

    await authApi.interceptors.response.handlers[0].rejected(error).catch(() => {});

    expect(window.location.hash).toBe('#/login');
  });

  it('should not redirect for other errors', async () => {
    const locationSpy = vi.spyOn(window, 'location', 'get');
    locationSpy.mockReturnValue({ hash: '' } as any);

    const error = {
      response: {
        status: 500,
        data: { error: 999 },
      },
    };

    await authApi.interceptors.response.handlers[0].rejected(error).catch(() => {});

    expect(window.location.hash).not.toBe('#/login');
  });
});

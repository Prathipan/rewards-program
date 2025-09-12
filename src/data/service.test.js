import { fetchTransactions } from './service';

describe('fetchTransactions', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('fetches from extended json and returns data', async () => {
    const mockData = [{ id: 1 }];
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const data = await fetchTransactions();
    expect(mockFetch).toHaveBeenCalledWith('/transactions.json', { cache: 'no-store' });
    expect(data).toEqual(mockData);
  });

  test('throws on non-ok response', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({ ok: false, status: 500 });
    await expect(fetchTransactions()).rejects.toThrow('HTTP 500');
  });
});





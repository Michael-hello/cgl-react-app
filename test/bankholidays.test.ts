import { getBankHolidays } from '@lib_framework';
import { vi, expect, beforeEach, describe, it } from 'vitest';
import { bankHolidayResponse } from './bh_result';

const mockFetch = vi.fn();

window.fetch = mockFetch;


describe('getBankHolidays test series', () => { 

  beforeEach(() => {
    // Clear any previous mock calls and implementations before each test
    mockFetch.mockClear();
  });


  it('fetch successfully parses data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(bankHolidayResponse),
    });

    const result = await getBankHolidays('England', [2026]);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(8);
  });


  it('fetch handles ok: false', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve(bankHolidayResponse),
    });

    const result = await getBankHolidays('England', [2026]);
    expect(result).toBeNull();
  });

  
});
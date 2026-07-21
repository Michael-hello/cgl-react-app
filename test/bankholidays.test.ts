import { filterBankHolidays, getBankHolidays } from '@lib_framework';
import { vi, expect, beforeEach, describe, it } from 'vitest';
import { bankHolidayResponse } from './bh_result';

const mockFetch = vi.fn();

window.fetch = mockFetch;


describe('getBankHolidays fetch api', () => { 

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

    const result = await getBankHolidays('England');
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(83);
  });


  it('fetch handles ok: false', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve(bankHolidayResponse),
    });

    const result = await getBankHolidays('England');
    expect(result).toBeNull();
  });
});


describe('getBankHolidays helper functions', () => {

  it('correctly filters dates', async () => {

    let from = new Date("2026-05-05");
    let days = from.getDate() + 14;
    let to = new Date(from);  //2026-05-19
    to.setDate(days);
    let result = filterBankHolidays(from, to, [new Date("2026-05-05"), new Date("2026-05-19"), new Date("2026-05-11")]);
    expect(result).toHaveLength(3);
  });

});


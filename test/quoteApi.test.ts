import test from 'node:test';
import assert from 'node:assert/strict';
import { requestSlicedQuote } from '../src/lib/quoteApi.ts';
const file = new File(['solid test'], 'test.stl');
const options = { infill: 20, layer_height: '0.20mm', filament_color: 'black', finish: 'Standard Raw Print', quantity: 2 };
const result = { success: true, cached: false, metrics: { filament_grams: 5, print_time_seconds: 3600, print_time_hours: 1, print_time_formatted: '1h 0m' },
  pricing: { currency: 'INR', policy_version: 'website-v1', unit_price: 133, subtotal: 266, shipping: 79, total: 345 } };

test('uploads file and exact API fields without setting the multipart boundary manually', async t => {
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    assert.equal(url, 'https://quote.example/api/quote/slice');
    assert.equal(init.method, 'POST');
    assert.equal(init.headers, undefined);
    assert.equal(init.body.get('file').name, file.name);
    for (const [key, value] of Object.entries(options)) assert.equal(init.body.get(key), String(value));
    return Response.json(result);
  });
  assert.deepEqual(await requestSlicedQuote('https://quote.example/', file, options, new AbortController().signal), result);
});

test('validates returned metrics and quantity pricing before displaying a quote', async t => {
  for (const changed of [
    { ...result, metrics: { ...result.metrics, filament_grams: 0 } },
    { ...result, pricing: { ...result.pricing, total: 1 } },
    { ...result, pricing: { ...result.pricing, subtotal: 133 } },
  ]) {
    const mock = t.mock.method(globalThis, 'fetch', async () => Response.json(changed));
    await assert.rejects(requestSlicedQuote('https://quote.example', file, options, new AbortController().signal), /invalid result/);
    mock.mock.restore();
  }
});

test('maps slice failure into a user-facing review message', async t => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ success: false, error: { code: 'SLICE_FAILED', message: 'Internal diagnostic' } }, { status: 422 }));
  await assert.rejects(requestSlicedQuote('https://quote.example', file, options, new AbortController().signal), /needs review/);
});

test('retries busy capacity without resubmitting unsupported fields', async t => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => ++calls === 1
    ? Response.json({ success: false }, { status: 429, headers: { 'Retry-After': '1' } })
    : Response.json(result));
  assert.deepEqual(await requestSlicedQuote('https://quote.example', file, options, new AbortController().signal), result);
  assert.equal(calls, 2);
});

test('stops busy retries when options change or the caller cancels', async t => {
  const controller = new AbortController();
  t.mock.method(globalThis, 'fetch', async () => {
    setTimeout(() => controller.abort(), 10);
    return Response.json({ success: false }, { status: 429 });
  });
  await assert.rejects(requestSlicedQuote('https://quote.example', file, options, controller.signal), { name: 'AbortError' });
});

export interface SliceOptions {
  infill: number;
  layer_height: string;
  filament_color: string;
  finish: string;
  quantity: number;
}

export interface SlicedQuote {
  success: true;
  cached: boolean;
  metrics: {
    filament_grams: number;
    print_time_seconds: number;
    print_time_hours: number;
    print_time_formatted: string;
  };
  pricing: {
    currency: "INR";
    policy_version: string;
    unit_price: number;
    subtotal: number;
    shipping: number;
    total: number;
  };
}

function abortableDelay(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const cancel = () => { clearTimeout(timer); reject(signal.reason ?? new DOMException("Aborted", "AbortError")); };
    const timer = setTimeout(() => { signal.removeEventListener("abort", cancel); resolve(); }, ms);
    signal.addEventListener("abort", cancel, { once: true });
    if (signal.aborted) cancel();
  });
}

export async function requestSlicedQuote(baseUrl: string, file: File, options: SliceOptions, signal: AbortSignal): Promise<SlicedQuote> {
  const deadline = Date.now() + 180_000;
  while (true) {
    signal.throwIfAborted();
    const body = new FormData();
    body.set("file", file);
    for (const [key, value] of Object.entries(options)) body.set(key, String(value));
    const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/api/quote/slice`, {
      method: "POST", body,
      signal: AbortSignal.any([signal, AbortSignal.timeout(150_000)]),
    });
    if (response.status === 429 && Date.now() < deadline) {
      const requestedDelay = Number(response.headers.get("Retry-After") ?? 5);
      const delay = Number.isFinite(requestedDelay) ? Math.min(10, Math.max(1, requestedDelay)) : 5;
      await abortableDelay(delay * 1000, signal);
      continue;
    }
    const data = await response.json();
    if (!response.ok || data.success !== true) {
      const messages: Record<string, string> = {
        SERVICE_BUSY: "Quote service is busy. Showing an estimate until you retry.",
        SLICE_TIMEOUT: "This model took too long to process. Final pricing needs review.",
        PRESETS_NOT_CONFIGURED: "Quote service is being configured. Showing an estimate.",
        SLICE_FAILED: "This model needs review before we can confirm its price.",
      };
      throw new Error(messages[data.error?.code] ?? "Could not calculate a sliced quote. Showing an estimate.");
    }
    const values = [data.metrics?.filament_grams, data.metrics?.print_time_seconds, data.metrics?.print_time_hours,
      data.pricing?.unit_price, data.pricing?.subtotal, data.pricing?.shipping, data.pricing?.total];
    if (values.some(value => typeof value !== "number" || !Number.isFinite(value) || value < 0)
        || data.metrics.filament_grams <= 0 || data.metrics.print_time_seconds <= 0
        || data.pricing.currency !== "INR" || data.pricing.subtotal !== data.pricing.unit_price * options.quantity
        || data.pricing.total !== data.pricing.subtotal + data.pricing.shipping) {
      throw new Error("The quote service returned an invalid result. Showing an estimate.");
    }
    return data;
  }
}

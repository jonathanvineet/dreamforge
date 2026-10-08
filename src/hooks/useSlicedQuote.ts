"use client";

import { useEffect, useState } from "react";
import { requestSlicedQuote, type SliceOptions, type SlicedQuote } from "../lib/quoteApi";

const API_URL = process.env.NEXT_PUBLIC_QUOTE_API_URL?.trim() ?? "";
type State = { file: File | null; signature: string; result: SlicedQuote | null; loading: boolean; error: string | null };

export function useSlicedQuote(file: File | null, options: SliceOptions, enabled: boolean) {
  const { infill, layer_height, filament_color, finish, quantity } = options;
  const signature = JSON.stringify([infill, layer_height, filament_color, finish, quantity]);
  const supported = !!file?.name.toLowerCase().endsWith(".stl");
  const canSlice = enabled && !!file && supported && !!API_URL;
  const [retry, setRetry] = useState(0);
  const [state, setState] = useState<State>({ file: null, signature: "", result: null, loading: false, error: null });

  useEffect(() => {
    if (!canSlice || !file) return;
    const controller = new AbortController();
    setState({ file, signature, result: null, loading: true, error: null });
    const timer = setTimeout(async () => {
      try {
        const result = await requestSlicedQuote(API_URL, file, { infill, layer_height, filament_color, finish, quantity }, controller.signal);
        if (!controller.signal.aborted) setState({ file, signature, result, loading: false, error: null });
      } catch (error) {
        if (!controller.signal.aborted) setState({ file, signature, result: null, loading: false,
          error: error instanceof Error && error.name !== "TimeoutError" && error.name !== "TypeError"
            ? error.message : "Quote service is unavailable. Showing an estimate; final price will be confirmed." });
      }
    }, 750);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [file, infill, layer_height, filament_color, finish, quantity, signature, canSlice, retry]);

  const current = state.file === file && state.signature === signature;
  return {
    result: canSlice && current ? state.result : null,
    loading: canSlice && (!current || state.loading),
    error: canSlice && current ? state.error : null,
    configured: !!API_URL,
    supported,
    retry: () => setRetry(value => value + 1),
  };
}

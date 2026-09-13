import { useEffect, useState } from "react";
import { supabase } from "./supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProductCategory =
  | "Gaming & Anime"
  | "Pop Culture & Sports"
  | "Desk & Functional"
  | "Sculptures & Decor"
  | "Custom Gifts & Wearables";

export interface CatalogueProduct {
  id: string;
  title: string;
  category: ProductCategory;
  image_url: string | null;
  base_price: number | null; // ₹ INR
  dimensions: string | null;
  description: string | null;
  span_class: string;
  featured: boolean;
  sort_order: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Returns all available products, with real-time updates via Supabase Realtime.
 * Optional category filter.
 */
export function useProducts(category?: ProductCategory) {
  const [products, setProducts] = useState<CatalogueProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let query = supabase
      .from("dreamforge_products")
      .select("*")
      .eq("is_available", true)
      .order("sort_order", { ascending: true });

    if (category) {
      query = query.eq("category", category);
    }

    // Initial fetch
    query.then(({ data, error: err }) => {
      if (err) {
        setError(err.message);
      } else {
        setProducts((data as CatalogueProduct[]) ?? []);
      }
      setLoading(false);
    });

    // Real-time subscription
    const channel = supabase
      .channel("dreamforge_products_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "dreamforge_products",
        },
        () => {
          // Re-fetch on any change (insert/update/delete)
          query.then(({ data }) => {
            setProducts((data as CatalogueProduct[]) ?? []);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [category]);

  return { products, loading, error };
}

/**
 * Returns only featured products (for home page BentoShowcase).
 * Also real-time.
 */
export function useFeaturedProducts() {
  const [products, setProducts] = useState<CatalogueProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data, error: err } = await supabase
        .from("dreamforge_products")
        .select("*")
        .eq("is_available", true)
        .eq("featured", true)
        .order("sort_order", { ascending: true })
        .limit(8);

      if (err) setError(err.message);
      else setProducts((data as CatalogueProduct[]) ?? []);
      setLoading(false);
    };

    fetchFeatured();

    const channel = supabase
      .channel("dreamforge_featured_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dreamforge_products" },
        fetchFeatured
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { products, loading, error };
}

// ─── Seed Data (for ERP to run once) ─────────────────────────────────────────
// Run this from your ERP to bootstrap all 38 prints into the DB.

export const SEED_PRODUCTS = [
  // Keychains / Wearables — ₹199
  { title: "Film Camera Keychain", category: "Custom Gifts & Wearables", image_url: null, base_price: 199, dimensions: "5cm × 3cm × 1cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 30, is_available: true },
  { title: "Iron Man Keychain", category: "Custom Gifts & Wearables", image_url: null, base_price: 199, dimensions: "5cm × 3cm × 1cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 31, is_available: true },
  { title: "Slayer Mark Keychain", category: "Custom Gifts & Wearables", image_url: null, base_price: 199, dimensions: "5cm × 3cm × 1cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 32, is_available: true },
  { title: "Kawaii Keychain", category: "Custom Gifts & Wearables", image_url: null, base_price: 199, dimensions: "5cm × 3cm × 1cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 33, is_available: true },
  { title: "Geometric Earrings", category: "Custom Gifts & Wearables", image_url: null, base_price: 199, dimensions: "3cm × 1.5cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 34, is_available: true },
  { title: "Spiral Earrings", category: "Custom Gifts & Wearables", image_url: null, base_price: 199, dimensions: "3cm × 1.5cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 35, is_available: true },
  // Busts — ₹699
  { title: "Lionel Messi Bust", category: "Pop Culture & Sports", image_url: null, base_price: 699, dimensions: "18cm × 12cm × 10cm", span_class: "col-span-1 row-span-1", featured: true, sort_order: 3, is_available: true },
  { title: "Cristiano Ronaldo Bust", category: "Pop Culture & Sports", image_url: null, base_price: 699, dimensions: "18cm × 12cm × 10cm", span_class: "col-span-2 row-span-2", featured: false, sort_order: 7, is_available: true },
  { title: "Neymar Jr. Statue", category: "Pop Culture & Sports", image_url: null, base_price: 699, dimensions: "18cm × 12cm × 10cm", span_class: "col-span-2 row-span-1", featured: false, sort_order: 21, is_available: true },
  { title: "Batman Bust", category: "Pop Culture & Sports", image_url: null, base_price: 699, dimensions: "16cm × 12cm × 10cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 19, is_available: true },
  { title: "Tactical Batman", category: "Pop Culture & Sports", image_url: null, base_price: 699, dimensions: "16cm × 12cm × 10cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 20, is_available: true },
  { title: "Harry Potter Bust", category: "Pop Culture & Sports", image_url: null, base_price: 699, dimensions: "16cm × 10cm × 10cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 16, is_available: true },
  // Standard Figurines — ₹899
  { title: "Grogu Statue", category: "Gaming & Anime", image_url: null, base_price: 899, dimensions: "14cm × 10cm × 12cm", span_class: "col-span-1 row-span-2", featured: true, sort_order: 2, is_available: true },
  { title: "Monkey D. Luffy", category: "Gaming & Anime", image_url: null, base_price: 899, dimensions: "18cm × 10cm × 8cm", span_class: "col-span-2 row-span-1", featured: true, sort_order: 5, is_available: true },
  { title: "Spider-Man Figurine", category: "Pop Culture & Sports", image_url: null, base_price: 899, dimensions: "20cm × 12cm × 10cm", span_class: "col-span-2 row-span-2", featured: true, sort_order: 6, is_available: true },
  { title: "Spider-Man Wall Pose", category: "Pop Culture & Sports", image_url: null, base_price: 899, dimensions: "18cm × 12cm × 10cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 17, is_available: true },
  { title: "Charmander Statue", category: "Gaming & Anime", image_url: null, base_price: 899, dimensions: "12cm × 8cm × 8cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 14, is_available: true },
  { title: "Pikachu Statue", category: "Gaming & Anime", image_url: null, base_price: 899, dimensions: "12cm × 8cm × 8cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 15, is_available: true },
  { title: "Mewtwo Figurine", category: "Gaming & Anime", image_url: null, base_price: 899, dimensions: "16cm × 10cm × 10cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 9, is_available: true },
  { title: "Minion Figurine", category: "Pop Culture & Sports", image_url: null, base_price: 899, dimensions: "14cm × 8cm × 8cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 25, is_available: true },
  { title: "Chibi Collectible", category: "Pop Culture & Sports", image_url: null, base_price: 899, dimensions: "12cm × 8cm × 8cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 23, is_available: true },
  { title: "Luffy Action Figure", category: "Gaming & Anime", image_url: null, base_price: 899, dimensions: "18cm × 10cm × 8cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 24, is_available: true },
  // Large Figurines / Dioramas — ₹1199
  { title: "Batman & Spidey Diorama", category: "Pop Culture & Sports", image_url: null, base_price: 1199, dimensions: "25cm × 18cm × 15cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 18, is_available: true },
  { title: "Zekrom Statue", category: "Gaming & Anime", image_url: null, base_price: 1199, dimensions: "22cm × 15cm × 12cm", span_class: "col-span-2 row-span-1", featured: false, sort_order: 22, is_available: true },
  { title: "Project Hail Mary Ship", category: "Gaming & Anime", image_url: null, base_price: 1199, dimensions: "28cm × 10cm × 10cm", span_class: "col-span-1 row-span-2", featured: false, sort_order: 10, is_available: true },
  // Desk Functional — ₹549
  { title: "Controller Mount", category: "Desk & Functional", image_url: null, base_price: 549, dimensions: "20cm × 12cm × 8cm", span_class: "col-span-2 row-span-1", featured: false, sort_order: 11, is_available: true },
  { title: "Headphone Stand", category: "Desk & Functional", image_url: null, base_price: 549, dimensions: "25cm × 12cm × 12cm", span_class: "col-span-2 row-span-1", featured: false, sort_order: 12, is_available: true },
  { title: "Dual Headphone Hook", category: "Desk & Functional", image_url: null, base_price: 549, dimensions: "22cm × 10cm × 8cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 36, is_available: true },
  { title: "Key Organizer", category: "Desk & Functional", image_url: null, base_price: 549, dimensions: "15cm × 8cm × 4cm", span_class: "col-span-2 row-span-1", featured: false, sort_order: 28, is_available: true },
  { title: "Wood Key Holder", category: "Desk & Functional", image_url: null, base_price: 549, dimensions: "15cm × 8cm × 4cm", span_class: "col-span-2 row-span-1", featured: false, sort_order: 29, is_available: true },
  { title: "Film Clapperboard", category: "Desk & Functional", image_url: null, base_price: 549, dimensions: "18cm × 14cm × 2cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 26, is_available: true },
  { title: "Earring Tree Display", category: "Desk & Functional", image_url: null, base_price: 549, dimensions: "20cm × 10cm × 10cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 27, is_available: true },
  // Display / Decor — ₹799
  { title: "Cyberpunk Concept Car", category: "Desk & Functional", image_url: null, base_price: 799, dimensions: "22cm × 10cm × 7cm", span_class: "col-span-2 row-span-2", featured: true, sort_order: 1, is_available: true },
  { title: "Low-Poly Lion", category: "Sculptures & Decor", image_url: null, base_price: 799, dimensions: "15cm × 12cm × 10cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 8, is_available: true },
  { title: "Faceted Cat Statue", category: "Sculptures & Decor", image_url: null, base_price: 799, dimensions: "14cm × 8cm × 8cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 13, is_available: true },
  { title: "Canine Statue", category: "Sculptures & Decor", image_url: null, base_price: 799, dimensions: "15cm × 10cm × 8cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 27, is_available: true },
  // Gift / Lithophane — ₹999
  { title: "Custom Lithophane", category: "Custom Gifts & Wearables", image_url: null, base_price: 999, dimensions: "15cm × 10cm × 0.5cm", span_class: "col-span-2 row-span-1", featured: false, sort_order: 36, is_available: true },
  { title: "Father's Day Plaque", category: "Custom Gifts & Wearables", image_url: null, base_price: 999, dimensions: "18cm × 12cm × 1cm", span_class: "col-span-2 row-span-1", featured: false, sort_order: 37, is_available: true },
  { title: "Dad Desk Trophy", category: "Custom Gifts & Wearables", image_url: null, base_price: 999, dimensions: "15cm × 8cm × 8cm", span_class: "col-span-1 row-span-1", featured: false, sort_order: 38, is_available: true },
  // Special — ₹1499
  { title: "Iron Man Helmet", category: "Pop Culture & Sports", image_url: null, base_price: 1499, dimensions: "28cm × 22cm × 28cm", span_class: "col-span-1 row-span-1", featured: true, sort_order: 4, is_available: true },
] as const;

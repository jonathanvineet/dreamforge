"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import {
  Upload,
  FileCheck,
  Sparkles,
  MessageSquare,
  Send,
  Trash2,
  PenTool,
  ShoppingCart,
} from "lucide-react";
import { BRAND_CONFIG } from "../data/mockData";
import { validate3DFile, ValidationResult } from "../lib/fileValidator";
import { ModelViewer3D, ModelMetrics } from "./ModelViewer3D";
import { useCart } from "../context/CartContext";

type OrderMode = "upload" | "custom_design" | "cart";
type FilamentColor = "black" | "white" | "grey" | "special";

const MATERIAL_PLA = {
  name: "PLA High Precision",
  density: 1.24,
  ratePerGram: 6.5,
};

const FILAMENT_COLORS: { id: FilamentColor; label: string; bg: string; ring: string }[] = [
  { id: "black",   label: "Black",  bg: "#111111", ring: "#555" },
  { id: "white",   label: "White",  bg: "#f4f4f4", ring: "#aaa" },
  { id: "grey",    label: "Grey",   bg: "#717171", ring: "#888" },
  { id: "special", label: "Custom", bg: "conic",   ring: "#aaa" },
];

const INFILL_PRESETS = [
  { label: "15%",  value: 15  },
  { label: "20%",  value: 20  },
  { label: "50%",  value: 50  },
  { label: "100%", value: 100 },
];

const LAYER_HEIGHTS = [
  { label: "Standard", sub: "0.20mm", value: "0.20mm", costMult: 1.0  },
  { label: "Fine",     sub: "0.12mm", value: "0.12mm", costMult: 1.25 },
  { label: "Draft",    sub: "0.28mm", value: "0.28mm", costMult: 0.85 },
];

const POST_FINISHES = [
  { value: "Standard Raw Print",             label: "Raw",    sub: "Support cleaned" },
  { value: "Hand-Sanded & Smoothed",          label: "Sanded", sub: "+ ₹90" },
  { value: "Primer Coated & Ready to Paint",  label: "Primed", sub: "+ ₹160" },
];

export function Order() {
  const [mode, setMode] = useState<OrderMode>("upload");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items: cartItems, subtotal: cartSubtotal, removeItem } = useCart();

  // Uploaded 3D File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileValidation, setFileValidation] = useState<ValidationResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filament Color State
  const [filamentColor, setFilamentColor] = useState<FilamentColor>("black");
  const [specialColorNote, setSpecialColorNote] = useState("");

  // Slicing & Engineering State (PLA Only)
  const [infill, setInfill] = useState<number>(20);
  const [layerHeight, setLayerHeight] = useState<string>("0.20mm");
  const [quantity, setQuantity] = useState<number>(1);
  const [postFinish, setPostFinish] = useState<string>("Standard Raw Print");

  // Model Dimensions & Telemetry State
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);

  // Customer & Delivery Address Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [cityState, setCityState] = useState("");
  const [pincode, setPincode] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Custom Design Mode Form State
  const [customBrief, setCustomBrief] = useState("");
  const [customDimensions, setCustomDimensions] = useState("");
  const [customUse, setCustomUse] = useState("Figurine / Collectible");

  // EmailJS Configuration
  const EMAILJS_CONFIG = {
    SERVICE_ID:
      (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_EMAILJS_SERVICE_ID) ||
      (import.meta as any).env?.VITE_EMAILJS_SERVICE_ID ||
      "",
    TEMPLATE_ID:
      (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID) ||
      (import.meta as any).env?.VITE_EMAILJS_TEMPLATE_ID ||
      "",
    PUBLIC_KEY:
      (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) ||
      (import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY ||
      "",
  };

  useEffect(() => {
    if (EMAILJS_CONFIG.PUBLIC_KEY) {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }
  }, [EMAILJS_CONFIG.PUBLIC_KEY]);

  useEffect(() => {
    const handleOpenCart = () => setMode("cart");
    window.addEventListener("dreamforge:open-cart-tab", handleOpenCart);
    return () => window.removeEventListener("dreamforge:open-cart-tab", handleOpenCart);
  }, []);

  const handleFileSelect = (file: File) => {
    const result = validate3DFile(file);
    setFileValidation(result);

    if (!result.valid) {
      toast.error(result.error || "Unsupported file format.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    toast.success(`Loaded ${result.sanitizedName}`);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setFileValidation(null);
    setMetrics(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Real-Time Dynamic Quote Calculation for PLA (in ₹ INR)
  const calculateQuote = () => {
    const baseVolume = metrics?.volumeCm3 || 32.0;
    const effectiveInfill = infill / 100;
    const shellOverhead = 0.16;
    const totalVolumeFraction = effectiveInfill * 0.84 + shellOverhead;

    const estGrams = Math.max(6, Math.round(baseVolume * MATERIAL_PLA.density * totalVolumeFraction));
    const materialCost = estGrams * MATERIAL_PLA.ratePerGram;

    const layerObj = LAYER_HEIGHTS.find((l) => l.value === layerHeight);
    const qualityMult = layerObj?.costMult || 1.0;

    const machinePrepFee = 75;
    const machineHourRate = 25;
    const estPrintHours = Math.max(1.0, (baseVolume * totalVolumeFraction * qualityMult) / 14);
    const machineCost = estPrintHours * machineHourRate;

    let postFee = 0;
    if (postFinish.includes("Hand-Sanded")) postFee = 90;
    if (postFinish.includes("Primer")) postFee = 160;

    const colorSurcharge = filamentColor === "special" ? 60 : 0;

    const unitPrice = Math.round((materialCost + machineCost + machinePrepFee + postFee + colorSurcharge) * qualityMult);
    const subtotal = unitPrice * quantity;
    const estimatedShipping = subtotal > 1200 ? 0 : 79;
    const total = subtotal + estimatedShipping;

    return {
      estGrams,
      estPrintHours: parseFloat(estPrintHours.toFixed(1)),
      unitPrice,
      subtotal,
      estimatedShipping,
      total,
    };
  };

  const quote = calculateQuote();

  const getActiveFilamentLabel = () => {
    if (filamentColor === "special") {
      return specialColorNote ? `Special: ${specialColorNote}` : "Special Request";
    }
    return FILAMENT_COLORS.find((c) => c.id === filamentColor)?.label || "Black";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "upload" && !selectedFile) {
      toast.error("Please upload a 3D file (.stl, .3mf, .obj, .step) first.");
      return;
    }
    
    if (mode === "cart" && cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!customerName || !customerPhone || !streetAddress || !pincode) {
      toast.error("Please provide your name, phone number, and delivery address.");
      return;
    }

    setIsSubmitting(true);

    const payload = mode === "cart" 
      ? {
          order_mode: "cart",
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail || "N/A",
          delivery_address: `${streetAddress}, ${cityState} - PIN: ${pincode}`,
          items: cartItems.map(i => `${i.quantity}x ${i.title} - ₹${i.lineTotal}`).join("\n"),
          quote_total: `₹${(cartSubtotal + (cartSubtotal > 500 || cartSubtotal === 0 ? 0 : 79)).toLocaleString("en-IN")}`,
          notes: specialInstructions || "None",
          timestamp: new Date().toISOString(),
        }
      : {
          order_mode: mode,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail || "N/A",
          delivery_address: `${streetAddress}, ${cityState} - PIN: ${pincode}`,
          file_name: selectedFile ? fileValidation?.sanitizedName : "Custom 3D Design",
          file_size: selectedFile ? fileValidation?.sizeFormatted : "N/A",
          material: MATERIAL_PLA.name,
          filament_color: getActiveFilamentLabel(),
          infill: `${infill}%`,
          layer_height: layerHeight,
          finish: postFinish,
          quantity: quantity,
          estimated_weight: `${quote.estGrams * quantity}g`,
          quote_total: `₹${quote.total.toLocaleString("en-IN")}`,
          notes: specialInstructions || customBrief || "None",
          timestamp: new Date().toISOString(),
        };

    try {
      if (EMAILJS_CONFIG.SERVICE_ID && EMAILJS_CONFIG.TEMPLATE_ID) {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          {
            from_name: customerName,
            phone: customerPhone,
            email: customerEmail,
            message: JSON.stringify(payload, null, 2),
            projectType: `3D Print [PLA - ${payload.filament_color}]`,
            to_email: "rehaanrafael.john@gmail.com",
          },
          { publicKey: EMAILJS_CONFIG.PUBLIC_KEY }
        );
      }

      toast.success("Order dispatched! We will reach out on WhatsApp/Phone shortly.");
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setStreetAddress("");
      setCityState("");
      setPincode("");
      setSpecialInstructions("");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Order noted! You can also tap 'Instant WhatsApp Dispatch' below.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppUrl = () => {
    const msg = mode === "cart"
      ? [
          `*New Showcase Order — DreamForge*`,
          `*Customer:* ${customerName || "Customer"} (${customerPhone || "N/A"})`,
          `*Address:* ${streetAddress ? `${streetAddress}, ${cityState} - ${pincode}` : "Pending"}`,
          `---------------------------------`,
          `*Items:*`,
          ...cartItems.map(i => `- ${i.quantity}x ${i.title}`),
          `*Est. Total:* ₹${(cartSubtotal + (cartSubtotal > 500 || cartSubtotal === 0 ? 0 : 79)).toLocaleString("en-IN")}`,
          specialInstructions ? `*Notes:* ${specialInstructions}` : "",
          `---------------------------------`,
          `Hi DreamForge! I'd like to confirm this order.`,
        ].filter(Boolean).join("\n")
      : [
          `*New 3D Print Order — DreamForge*`,
          `*Customer:* ${customerName || "Customer"} (${customerPhone || "N/A"})`,
          `*Address:* ${streetAddress ? `${streetAddress}, ${cityState} - ${pincode}` : "Pending"}`,
          `---------------------------------`,
          `*File:* ${selectedFile ? fileValidation?.sanitizedName : "Custom 3D Design"}`,
          `*Material:* PLA High Precision`,
          `*Color:* ${getActiveFilamentLabel()}`,
          `*Infill:* ${infill}% (Custom) | *Layer:* ${layerHeight}`,
          `*Finish:* ${postFinish}`,
          `*Quantity:* ${quantity}`,
          `*Est. Total:* ₹${quote.total.toLocaleString("en-IN")}`,
          specialInstructions ? `*Notes:* ${specialInstructions}` : "",
          customBrief ? `*Brief:* ${customBrief}` : "",
          `---------------------------------`,
          `Hi DreamForge! I'd like to confirm this 3D print request.`,
        ].filter(Boolean).join("\n");

    return `https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  /* shared input style */
  const inputCls =
    "w-full bg-transparent border-b border-white/[0.12] py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/40 focus:outline-none transition-colors";

  return (
    <section id="order" className="relative py-28 md:py-40 bg-zinc-950 text-white overflow-hidden">
      {/* Ambient dot grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.018] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/[0.04] blur-[160px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">

        {/* ── Section Header ─────────────────────────────────────── */}
        <div className="mb-16 max-w-xl">
          <p className="text-[11px] tracking-[0.22em] text-zinc-500 uppercase mb-4">
            Fabrication &amp; Instant Quote
          </p>
          <h2
            className="text-4xl sm:text-5xl md:text-[3.4rem] font-normal leading-[1.08] tracking-tight text-white"
            style={{ fontFamily: "'Fraunces', ui-serif, Georgia, serif" }}
          >
            Tell us what<br />
            <em className="not-italic text-zinc-400">you&apos;d like to make.</em>
          </h2>
          <p className="mt-5 text-sm text-zinc-500 leading-relaxed max-w-sm">
            Upload your CAD file for instant 3D inspection and a real-time PLA quote, or describe a model for us to design from scratch.
          </p>

          {/* Underline mode tabs */}
          <div className="mt-8 flex items-center gap-6 border-b border-white/[0.08]">
            {[
              { id: "upload" as OrderMode, icon: <Upload className="w-3.5 h-3.5" />, label: "Upload File" },
              { id: "custom_design" as OrderMode, icon: <PenTool className="w-3.5 h-3.5" />, label: "Custom Design" },
              { id: "cart" as OrderMode, icon: <ShoppingCart className="w-3.5 h-3.5" />, label: `Showcase Cart (${cartItems.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMode(tab.id)}
                className={`flex items-center gap-2 pb-3 text-xs font-medium transition-all border-b-2 -mb-px ${
                  mode === tab.id
                    ? "border-white text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Form Grid ──────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-8">

            {mode === "cart" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-5 border-b border-white/[0.06]">
                  <ShoppingCart className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-zinc-300">Your Showcase Items</span>
                </div>
                {cartItems.length === 0 ? (
                  <div className="py-12 text-center border border-dashed border-white/[0.1] rounded-xl text-zinc-500 text-sm">
                    Your cart is empty. Browse the showcase to add items.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex gap-4 p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover bg-zinc-900" />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-zinc-900 flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-zinc-700" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{item.title}</p>
                          <p className="text-xs font-mono text-zinc-400 mt-1">
                            {item.quantity}x
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs font-mono font-semibold text-white">₹{item.lineTotal.toLocaleString("en-IN")}</p>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              className="text-xs text-zinc-500 hover:text-rose-400"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : mode === "upload" ? (
              <>
                {/* File Drop Zone / 3D Viewer */}
                {!selectedFile ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative rounded-2xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[260px] text-center ${
                      isDragging
                        ? "bg-cyan-950/20 border border-cyan-400/50"
                        : "bg-white/[0.015] border border-dashed border-white/[0.12] hover:border-white/25 hover:bg-white/[0.025]"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".stl,.3mf,.obj,.step,.stp"
                      className="hidden"
                      onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
                    />
                    <div className="mb-5 w-10 h-10 rounded-full border border-white/[0.12] bg-white/[0.03] flex items-center justify-center text-zinc-400">
                      <Upload className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-white font-medium mb-1">Drop your CAD file here</p>
                    <p className="text-xs text-zinc-500 mb-5">or click to browse</p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
                      {[".STL", ".3MF", ".OBJ", ".STEP"].map((ext, i, arr) => (
                        <React.Fragment key={ext}>
                          <span>{ext}</span>
                          {i < arr.length - 1 && <span className="text-zinc-700">·</span>}
                        </React.Fragment>
                      ))}
                      <span className="text-zinc-700 ml-1">/ 50 MB</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="text-xs font-mono text-white truncate">{fileValidation?.sanitizedName}</span>
                        <span className="text-[11px] font-mono text-zinc-500 shrink-0">{fileValidation?.sizeFormatted}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearFile}
                        className="text-zinc-500 hover:text-rose-400 transition-colors ml-3"
                        aria-label="Remove file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <ModelViewer3D
                      file={selectedFile}
                      materialDensity={MATERIAL_PLA.density}
                      infillPercent={infill}
                      filamentColor={filamentColor}
                      onMetricsComputed={(m) => setMetrics(m)}
                    />
                  </div>
                )}

                {/* PLA Slicing Controls */}
                <div className="space-y-7">

                  {/* Material line */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300 font-medium">PLA High Precision</span>
                    <span className="text-xs font-mono text-zinc-500">₹{MATERIAL_PLA.ratePerGram}/g · 1.24 g/cm³</span>
                  </div>

                  {/* Filament Color */}
                  <div>
                    <p className="text-[11px] text-zinc-500 uppercase tracking-[0.15em] mb-3">Filament Color</p>
                    <div className="flex items-center gap-4 flex-wrap">
                      {FILAMENT_COLORS.map((col) => (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => setFilamentColor(col.id)}
                          title={col.label}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <span
                            className={`block w-7 h-7 rounded-full transition-all duration-200 ${
                              filamentColor === col.id
                                ? "ring-2 ring-offset-2 ring-offset-zinc-950 ring-white scale-110"
                                : "opacity-60 hover:opacity-90"
                            }`}
                            style={
                              col.id === "special"
                                ? { background: "conic-gradient(from 0deg, #facc15, #f87171, #38bdf8, #4ade80, #facc15)" }
                                : { background: col.bg, boxShadow: `0 0 0 1px ${col.ring}` }
                            }
                          />
                          <span className={`text-[10px] font-mono transition-colors ${filamentColor === col.id ? "text-white" : "text-zinc-600"}`}>
                            {col.label}
                          </span>
                        </button>
                      ))}
                    </div>
                    {filamentColor === "special" && (
                      <input
                        type="text"
                        value={specialColorNote}
                        onChange={(e) => setSpecialColorNote(e.target.value)}
                        placeholder="Describe your color (e.g. Silk Gold, Matte Navy, Glow-in-dark…)"
                        className={`${inputCls} mt-4 text-xs`}
                      />
                    )}
                  </div>

                  <div className="border-t border-white/[0.06]" />

                  {/* Infill Density */}
                  <div>
                    <div className="flex items-baseline justify-between mb-3">
                      <p className="text-[11px] text-zinc-500 uppercase tracking-[0.15em]">Infill</p>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="5" max="100"
                          value={infill}
                          onChange={(e) => {
                            const v = parseInt(e.target.value);
                            if (!isNaN(v)) setInfill(Math.min(100, Math.max(5, v)));
                          }}
                          className="w-12 bg-transparent border-b border-white/[0.15] text-right text-sm font-mono text-white focus:border-white/40 focus:outline-none"
                        />
                        <span className="text-sm font-mono text-zinc-500">%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="5" max="100" step="1"
                      value={infill}
                      onChange={(e) => setInfill(Math.min(100, Math.max(5, parseInt(e.target.value) || 5)))}
                      className="w-full cursor-pointer h-px bg-zinc-800 rounded-full appearance-none mb-3"
                      style={{ accentColor: "rgba(255,255,255,0.85)" }}
                    />
                    <div className="flex items-center gap-2">
                      {INFILL_PRESETS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setInfill(opt.value)}
                          className={`flex-1 py-1.5 rounded-lg border text-[11px] font-mono transition-all text-center ${
                            infill === opt.value
                              ? "bg-white/[0.07] border-white/25 text-white"
                              : "border-white/[0.06] text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/[0.06]" />

                  {/* Layer Height & Surface Finish */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[11px] text-zinc-500 uppercase tracking-[0.15em] mb-3">Layer Quality</p>
                      <div className="flex flex-col gap-1.5">
                        {LAYER_HEIGHTS.map((layer) => (
                          <button
                            key={layer.value}
                            type="button"
                            onClick={() => setLayerHeight(layer.value)}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all ${
                              layerHeight === layer.value
                                ? "bg-white/[0.06] border-white/20 text-white"
                                : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                            }`}
                          >
                            <span className="text-xs">{layer.label}</span>
                            <span className="text-[10px] font-mono text-zinc-600">{layer.sub}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-zinc-500 uppercase tracking-[0.15em] mb-3">Surface Finish</p>
                      <div className="flex flex-col gap-1.5">
                        {POST_FINISHES.map((fin) => (
                          <button
                            key={fin.value}
                            type="button"
                            onClick={() => setPostFinish(fin.value)}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all ${
                              postFinish === fin.value
                                ? "bg-white/[0.06] border-white/20 text-white"
                                : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                            }`}
                          >
                            <span className="text-xs">{fin.label}</span>
                            <span className="text-[10px] font-mono text-zinc-600">{fin.sub}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/[0.06]" />

                  {/* Quantity */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-400">Quantity</p>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-white/[0.1] text-zinc-400 hover:text-white hover:border-white/30 transition-all"
                      >−</button>
                      <span className="font-mono text-sm text-white w-5 text-center">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-white/[0.1] text-zinc-400 hover:text-white hover:border-white/30 transition-all"
                      >+</button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Custom Design Mode */
              <div className="space-y-8">
                <div className="flex items-center gap-3 pb-5 border-b border-white/[0.06]">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-zinc-300">Custom Sculpting &amp; CAD Modeling</span>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-500 uppercase tracking-[0.15em] block mb-2">Category</label>
                  <select
                    value={customUse}
                    onChange={(e) => setCustomUse(e.target.value)}
                    className="w-full bg-transparent border-b border-white/[0.12] py-2.5 text-sm text-white focus:border-white/40 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="Figurine / Anime / Pop Culture" className="bg-zinc-900">Figurine / Anime / Pop Culture</option>
                    <option value="Mechanical / Functional Bracket" className="bg-zinc-900">Mechanical / Functional Bracket</option>
                    <option value="Architectural Decor / Display" className="bg-zinc-900">Architectural Decor / Display</option>
                    <option value="Custom Gift / Lithophane" className="bg-zinc-900">Custom Gift / Lithophane</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-500 uppercase tracking-[0.15em] block mb-2">Approximate Dimensions</label>
                  <input
                    type="text"
                    value={customDimensions}
                    onChange={(e) => setCustomDimensions(e.target.value)}
                    placeholder="e.g. 15cm height, or 80mm × 50mm × 40mm"
                    className={`${inputCls} font-mono text-sm`}
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-500 uppercase tracking-[0.15em] block mb-2">Design Brief</label>
                  <textarea
                    rows={5}
                    value={customBrief}
                    onChange={(e) => setCustomBrief(e.target.value)}
                    required
                    placeholder="Describe what you want — character name, posture, tolerances, reference links…"
                    className="w-full bg-transparent border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-white/25 focus:outline-none resize-none leading-relaxed transition-colors"
                  />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — Quote & Checkout */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl p-7 space-y-7">

              {/* Quote Header */}
              <div className="pb-6 border-b border-white/[0.06]">
                <p className="text-[11px] text-zinc-500 uppercase tracking-[0.15em] mb-3">Estimated Total</p>
                <div
                  className="text-[2.8rem] font-light leading-none tracking-tight text-white mb-3"
                  style={{ fontFamily: "'Fraunces', ui-serif, Georgia, serif" }}
                >
                  ₹{(mode === "cart" 
                      ? cartSubtotal + (cartSubtotal > 500 || cartSubtotal === 0 ? 0 : 79)
                      : (mode === "upload" && !selectedFile) || mode === "custom_design"
                        ? 0
                        : quote.total).toLocaleString("en-IN")}
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-zinc-500 font-mono">
                  {mode === "cart" ? (
                    <>
                      <span>{cartItems.length} {cartItems.length === 1 ? "item" : "items"}</span>
                      {cartSubtotal > 500 || cartSubtotal === 0 ? (
                        <><span>·</span><span className="text-emerald-400">Free shipping</span></>
                      ) : (
                        <><span>·</span><span>+ ₹79 courier</span></>
                      )}
                    </>
                  ) : (mode === "upload" && !selectedFile) || mode === "custom_design" ? (
                    <span>Awaiting details</span>
                  ) : (
                    <>
                      <span>PLA</span>
                      <span>·</span>
                      <span className="capitalize">{getActiveFilamentLabel()}</span>
                      <span>·</span>
                      <span>~{quote.estGrams * quantity}g</span>
                      <span>·</span>
                      <span>{quantity} {quantity > 1 ? "units" : "unit"}</span>
                      {quote.estimatedShipping === 0 ? (
                        <><span>·</span><span className="text-emerald-400">Free shipping</span></>
                      ) : (
                        <><span>·</span><span>+ ₹79 courier</span></>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Delivery & Contact Fields */}
              <div className="space-y-5">
                <p className="text-[11px] text-zinc-500 uppercase tracking-[0.15em]">Delivery Details</p>

                <input
                  type="text" required
                  value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full name *"
                  className={inputCls}
                />

                <div className="grid grid-cols-2 gap-5">
                  <input
                    type="tel" required
                    value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="WhatsApp *"
                    className={`${inputCls} font-mono`}
                  />
                  <input
                    type="email"
                    value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Email (optional)"
                    className={inputCls}
                  />
                </div>

                <input
                  type="text" required
                  value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Street address / Flat no. *"
                  className={inputCls}
                />

                <div className="grid grid-cols-2 gap-5">
                  <input
                    type="text" required
                    value={cityState} onChange={(e) => setCityState(e.target.value)}
                    placeholder="City, State *"
                    className={inputCls}
                  />
                  <input
                    type="text" required
                    value={pincode} onChange={(e) => setPincode(e.target.value)}
                    placeholder="PIN Code *"
                    className={`${inputCls} font-mono`}
                  />
                </div>

                <textarea
                  rows={2}
                  value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Notes — tolerances, deadline, special requests…"
                  className="w-full bg-transparent border-b border-white/[0.12] py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/40 focus:outline-none resize-none transition-colors leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-white text-black text-sm font-medium py-3.5 hover:bg-zinc-100 active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? "Sending…" : "Submit Order"}
                </button>

                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-white/[0.08] text-sm text-zinc-400 py-3 hover:text-white hover:border-white/20 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  WhatsApp Dispatch
                </a>
              </div>
            </div>
          </div>

        </form>
      </div>
    </section>
  );
}



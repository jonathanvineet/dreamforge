"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import {
  Upload,
  FileCheck,
  Cpu,
  Layers,
  Sparkles,
  MessageSquare,
  Send,
  MapPin,
  User,
  Phone,
  Mail,
  Trash2,
  PenTool,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { BRAND_CONFIG } from "../data/mockData";
import { validate3DFile, ValidationResult, ALLOWED_EXTENSIONS } from "../lib/fileValidator";
import { ModelViewer3D, ModelMetrics } from "./ModelViewer3D";

type OrderMode = "upload" | "custom_design";
type PrintTech = "fdm" | "sla";

interface MaterialOption {
  id: string;
  name: string;
  density: number; // g/cm3
  ratePerGram: number; // ₹ INR
  tech: PrintTech;
  desc: string;
}

const MATERIALS: MaterialOption[] = [
  // FDM
  { id: "pla_plus", name: "PLA+", density: 1.24, ratePerGram: 6.5, tech: "fdm", desc: "Precision detail for figures & models" },
  { id: "petg", name: "PETG", density: 1.27, ratePerGram: 8.5, tech: "fdm", desc: "Impact & heat resistant functional parts" },
  { id: "abs", name: "ABS", density: 1.05, ratePerGram: 9.5, tech: "fdm", desc: "High tensile engineering components" },
  { id: "carbon_tpu", name: "Carbon / TPU", density: 1.21, ratePerGram: 14.0, tech: "fdm", desc: "Extreme durability & composite strength" },

  // SLA
  { id: "standard_resin", name: "Standard Resin", density: 1.15, ratePerGram: 11.0, tech: "sla", desc: "Ultra-fine finish, invisible layer lines" },
  { id: "tough_resin", name: "Tough ABS-Like", density: 1.18, ratePerGram: 14.5, tech: "sla", desc: "Shock resistant engineering SLA" },
  { id: "clear_resin", name: "Optical Clear", density: 1.14, ratePerGram: 16.0, tech: "sla", desc: "High transparency polished acrylic finish" },
];

const INFILL_OPTIONS = [
  { label: "15%", value: 15, hint: "Display" },
  { label: "20%", value: 20, hint: "Standard" },
  { label: "40%", value: 40, hint: "Functional" },
  { label: "100%", value: 100, hint: "Solid" },
];

const LAYER_HEIGHTS = [
  { label: "0.20mm Standard", value: "0.20mm", costMult: 1.0 },
  { label: "0.12mm Fine", value: "0.12mm", costMult: 1.25 },
  { label: "0.05mm Ultra-SLA", value: "0.05mm", costMult: 1.6 },
];

export function Order() {
  const [mode, setMode] = useState<OrderMode>("upload");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Uploaded 3D File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileValidation, setFileValidation] = useState<ValidationResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Slicing & Engineering State
  const [printTech, setPrintTech] = useState<PrintTech>("fdm");
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOption>(MATERIALS[0]);
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

  const handleTechChange = (tech: PrintTech) => {
    setPrintTech(tech);
    const available = MATERIALS.filter((m) => m.tech === tech);
    if (available.length > 0) {
      setSelectedMaterial(available[0]);
    }
    if (tech === "sla") {
      setLayerHeight("0.05mm");
    } else {
      setLayerHeight("0.20mm");
    }
  };

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

  // Real-Time Dynamic Quote Calculation (in ₹ INR)
  const calculateQuote = () => {
    const baseVolume = metrics?.volumeCm3 || 32.0;
    const effectiveInfill = infill / 100;
    const shellOverhead = 0.16;
    const totalVolumeFraction = effectiveInfill * 0.84 + shellOverhead;

    const estGrams = Math.max(6, Math.round(baseVolume * selectedMaterial.density * totalVolumeFraction));
    const materialCost = estGrams * selectedMaterial.ratePerGram;

    const layerObj = LAYER_HEIGHTS.find((l) => l.value === layerHeight);
    const qualityMult = layerObj?.costMult || 1.0;

    const machinePrepFee = printTech === "sla" ? 140 : 75;
    const machineHourRate = printTech === "sla" ? 40 : 25;
    const estPrintHours = Math.max(1.2, (baseVolume * totalVolumeFraction * qualityMult) / 14);
    const machineCost = estPrintHours * machineHourRate;

    let postFee = 0;
    if (postFinish.includes("Hand-Sanded")) postFee = 90;
    if (postFinish.includes("Primer")) postFee = 160;

    const unitPrice = Math.round((materialCost + machineCost + machinePrepFee + postFee) * qualityMult);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "upload" && !selectedFile) {
      toast.error("Please upload a 3D file (.stl, .3mf, .obj, .step) first.");
      return;
    }

    if (!customerName || !customerPhone || !streetAddress || !pincode) {
      toast.error("Please provide your name, phone number, and delivery address.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      order_mode: mode,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail || "N/A",
      delivery_address: `${streetAddress}, ${cityState} - PIN: ${pincode}`,
      file_name: selectedFile ? fileValidation?.sanitizedName : "Custom 3D Design",
      file_size: selectedFile ? fileValidation?.sizeFormatted : "N/A",
      technology: printTech.toUpperCase(),
      material: selectedMaterial.name,
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
            projectType: `3D Print [${payload.technology} - ${payload.material}]`,
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
    const msg = [
      `*New 3D Print Order — DreamForge*`,
      `*Customer:* ${customerName || "Customer"} (${customerPhone || "N/A"})`,
      `*Address:* ${streetAddress ? `${streetAddress}, ${cityState} - ${pincode}` : "Pending"}`,
      `---------------------------------`,
      `*File:* ${selectedFile ? fileValidation?.sanitizedName : "Custom 3D Design"}`,
      `*Process:* ${printTech.toUpperCase()} | *Material:* ${selectedMaterial.name}`,
      `*Infill:* ${infill}% | *Layer:* ${layerHeight}`,
      `*Finish:* ${postFinish}`,
      `*Quantity:* ${quantity}`,
      `*Est. Total:* ₹${quote.total.toLocaleString("en-IN")}`,
      specialInstructions ? `*Notes:* ${specialInstructions}` : "",
      customBrief ? `*Brief:* ${customBrief}` : "",
      `---------------------------------`,
      `Hi DreamForge! I'd like to confirm this 3D print request.`,
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <section id="order" className="relative py-24 md:py-36 bg-zinc-950 text-white">
      {/* Delicate background gradient glow */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/[0.03] blur-[140px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Minimalist Section Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
            Fabrication & Instant Quote
          </span>

          <h2
            className="mt-2 text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight leading-tight"
            style={{ fontFamily: "'Fraunces', ui-serif, Georgia, serif" }}
          >
            Tell us what <br />
            <span className="italic text-zinc-400">you&apos;d like to make.</span>
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Upload your CAD file for real-time 3D inspection and instant quote calculation, or request a bespoke model designed from scratch.
          </p>

          {/* Minimalist Segmented Mode Switcher */}
          <div className="mt-7 inline-flex p-1 rounded-full bg-zinc-900/80 border border-white/[0.08] backdrop-blur-md">
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium transition-all ${
                mode === "upload"
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload 3D CAD File</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("custom_design")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium transition-all ${
                mode === "custom_design"
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Custom 3D Design</span>
            </button>
          </div>
        </div>

        {/* Main Grid Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================= */}
          {/* LEFT: 3D Stage & Fabrication Specs                        */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-5">
            {mode === "upload" ? (
              <>
                {/* 1. File Upload / 3D Model Stage */}
                {!selectedFile ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative rounded-2xl border border-dashed p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[260px] bg-zinc-950/40 ${
                      isDragging
                        ? "border-cyan-400 bg-cyan-950/20"
                        : "border-white/15 hover:border-white/30 hover:bg-white/[0.02]"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".stl,.3mf,.obj,.step,.stp"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileSelect(e.target.files[0]);
                        }
                      }}
                    />

                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-300 mb-3">
                      <Upload className="w-5 h-5" />
                    </div>

                    <div className="text-sm font-medium text-white mb-1">
                      Drop your 3D CAD file here
                    </div>
                    <div className="text-xs text-zinc-400 mb-3">
                      or click to browse your desktop
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                      <span>.STL</span>
                      <span>•</span>
                      <span>.3MF</span>
                      <span>•</span>
                      <span>.OBJ</span>
                      <span>•</span>
                      <span>.STEP</span>
                      <span className="text-zinc-600">| Max 50MB</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Compact File Header */}
                    <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-zinc-900/60 border border-white/[0.08]">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="text-xs font-mono text-white truncate">
                          {fileValidation?.sanitizedName}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500 shrink-0">
                          {fileValidation?.sizeFormatted}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleClearFile}
                        className="text-xs text-zinc-400 hover:text-rose-400 transition-colors font-mono px-2 py-1"
                      >
                        Change
                      </button>
                    </div>

                    {/* Three.js 3D Viewer */}
                    <ModelViewer3D
                      file={selectedFile}
                      materialDensity={selectedMaterial.density}
                      infillPercent={infill}
                      onMetricsComputed={(m) => setMetrics(m)}
                    />
                  </div>
                )}

                {/* 2. Streamlined Slicing Controls */}
                <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 backdrop-blur-md p-5 sm:p-6 space-y-5">
                  {/* Manufacturing Process */}
                  <div>
                    <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                      Process
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleTechChange("fdm")}
                        className={`py-2.5 px-4 rounded-xl border text-xs font-mono transition-all text-left ${
                          printTech === "fdm"
                            ? "bg-white/[0.08] border-cyan-400/80 text-white"
                            : "bg-transparent border-white/[0.08] text-zinc-400 hover:text-white"
                        }`}
                      >
                        <div className="font-semibold">FDM Filament</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">Durable & functional</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTechChange("sla")}
                        className={`py-2.5 px-4 rounded-xl border text-xs font-mono transition-all text-left ${
                          printTech === "sla"
                            ? "bg-white/[0.08] border-cyan-400/80 text-white"
                            : "bg-transparent border-white/[0.08] text-zinc-400 hover:text-white"
                        }`}
                      >
                        <div className="font-semibold">SLA Resin</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">Ultra-smooth 0.05mm</div>
                      </button>
                    </div>
                  </div>

                  {/* Material Selector */}
                  <div>
                    <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                      Material Grade
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {MATERIALS.filter((m) => m.tech === printTech).map((mat) => (
                        <button
                          key={mat.id}
                          type="button"
                          onClick={() => setSelectedMaterial(mat)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            selectedMaterial.id === mat.id
                              ? "bg-white/[0.08] border-cyan-400/80 text-white"
                              : "bg-transparent border-white/[0.06] text-zinc-400 hover:text-white"
                          }`}
                        >
                          <div className="text-xs font-medium truncate">{mat.name}</div>
                          <div className="text-[10px] font-mono text-cyan-300 mt-0.5">
                            ₹{mat.ratePerGram}/g
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Infill & Layer Quality */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Infill */}
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                        <span>Infill Density</span>
                        <span className="text-white">{infill}%</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {INFILL_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setInfill(opt.value)}
                            className={`py-1.5 rounded-lg border text-xs font-mono transition-all text-center ${
                              infill === opt.value
                                ? "bg-white/[0.08] border-cyan-400/80 text-cyan-200"
                                : "border-white/[0.06] text-zinc-400 hover:text-white"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Layer Quality */}
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                        <span>Layer Quality</span>
                        <span className="text-white">{layerHeight}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {LAYER_HEIGHTS.map((layer) => (
                          <button
                            key={layer.value}
                            type="button"
                            onClick={() => setLayerHeight(layer.value)}
                            className={`py-1.5 px-1 rounded-lg border text-[11px] font-mono transition-all text-center truncate ${
                              layerHeight === layer.value
                                ? "bg-white/[0.08] border-cyan-400/80 text-cyan-200"
                                : "border-white/[0.06] text-zinc-400 hover:text-white"
                            }`}
                          >
                            {layer.value}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Surface Finish & Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/[0.06]">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1 block">
                        Surface Finish
                      </label>
                      <select
                        value={postFinish}
                        onChange={(e) => setPostFinish(e.target.value)}
                        className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/90 px-3 py-2 text-xs text-white focus:border-white/30 focus:outline-none"
                      >
                        <option value="Standard Raw Print">Standard Raw Print (Support Cleaned)</option>
                        <option value="UV Cured & Hand-Sanded">UV Cured & Hand-Sanded</option>
                        <option value="Primer Coated & Ready to Paint">Primer Coated (Ready to Paint)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1 block">
                        Quantity
                      </label>
                      <div className="flex items-center rounded-xl border border-white/[0.08] bg-zinc-900/90 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-2 text-zinc-400 hover:text-white text-xs font-mono"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-mono text-xs font-medium text-white">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3 py-2 text-zinc-400 hover:text-white text-xs font-mono"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Custom 3D Design Request
              <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 backdrop-blur-md p-6 space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono text-zinc-300 uppercase tracking-wider">
                    Custom 3D Sculpting & CAD
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1 block">
                    Category
                  </label>
                  <select
                    value={customUse}
                    onChange={(e) => setCustomUse(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/90 px-3 py-2.5 text-xs text-white focus:border-white/30 focus:outline-none"
                  >
                    <option value="Figurine / Anime / Pop Culture">Figurine / Anime / Pop Culture</option>
                    <option value="Mechanical / Functional Bracket">Mechanical / Functional Bracket</option>
                    <option value="Architectural Decor / Display">Architectural Decor / Display</option>
                    <option value="Custom Gift / Lithophane">Custom Gift / Lithophane</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1 block">
                    Approximate Dimensions
                  </label>
                  <input
                    type="text"
                    value={customDimensions}
                    onChange={(e) => setCustomDimensions(e.target.value)}
                    placeholder="e.g. 15cm height, or 80mm × 50mm × 40mm"
                    className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/90 px-3 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1 block">
                    Design Concept & Brief
                  </label>
                  <textarea
                    rows={4}
                    value={customBrief}
                    onChange={(e) => setCustomBrief(e.target.value)}
                    required
                    placeholder="Describe what you want sculpted or modeled. Character name, posture, functional tolerances, or links to reference photos."
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-zinc-900/90 px-3 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* RIGHT: Unified Minimalist Quote & Checkout               */}
          {/* ========================================================= */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl p-6 space-y-5">
              {/* Quote Overview Header */}
              <div className="pb-4 border-b border-white/[0.06]">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Estimated Quote
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">
                    {quote.estimatedShipping === 0 ? "Free Shipping" : "+ ₹79 Courier"}
                  </span>
                </div>

                <div className="mt-2 text-3xl font-bold font-mono text-white tracking-tight">
                  ₹{quote.total.toLocaleString("en-IN")}
                </div>

                <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-3">
                  <span>~{quote.estGrams * quantity}g total</span>
                  <span>•</span>
                  <span>{quantity} unit{quantity > 1 ? "s" : ""}</span>
                  <span>•</span>
                  <span>Taxes included</span>
                </div>
              </div>

              {/* Delivery & Contact Details */}
              <div className="space-y-3 pt-1">
                <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  Delivery Details
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Full Name *"
                    className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/80 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="WhatsApp Phone *"
                    className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/80 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none font-mono transition-colors"
                  />

                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Email (optional)"
                    className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/80 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="Street Address / Flat No. *"
                    className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/80 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    value={cityState}
                    onChange={(e) => setCityState(e.target.value)}
                    placeholder="City, State *"
                    className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/80 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none transition-colors"
                  />

                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="PIN Code *"
                    className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/80 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none font-mono transition-colors"
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Notes (color preference, critical tolerances...)"
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-zinc-900/80 px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-semibold text-black transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Submitting..." : "Submit Order Request"}</span>
                </button>

                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-zinc-900/60 px-5 py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Direct WhatsApp Dispatch</span>
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

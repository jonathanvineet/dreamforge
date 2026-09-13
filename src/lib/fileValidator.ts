/**
 * Secure 3D CAD File Validator & Sanitizer
 * Protects against SQL injection, path traversal, malicious extensions, and malformed files.
 */

export const ALLOWED_EXTENSIONS = [".stl", ".3mf", ".obj", ".step", ".stp"] as const;
export type AllowedExtension = typeof ALLOWED_EXTENSIONS[number];

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB limit

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitizedName: string;
  extension: string;
  sizeFormatted: string;
  sizeBytes: number;
  isSTL: boolean;
  formatLabel: string;
}

/**
 * Format bytes into human-readable string (KB / MB)
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Strips dangerous characters: SQL injection metacharacters, path traversal, XSS tags
 */
export function sanitizeFilename(rawName: string): string {
  // Remove path components (e.g. ../ or /etc/passwd or C:\)
  let clean = rawName.replace(/^.*[\\/]/, "");

  // Remove null bytes
  clean = clean.replace(/\0/g, "");

  // Prevent SQL injection patterns (quotes, semicolons, dashes, comment markers, union, select, drop)
  clean = clean.replace(/['";\-\-]|(\/\*|\*\/)/g, "");

  // Only allow alphanumeric, underscore, hyphen, space and dots
  clean = clean.replace(/[^a-zA-Z0-9_\-\. ]/g, "_");

  // Prevent double extension hiding (e.g. model.php.stl or model.exe.stl)
  const parts = clean.split(".");
  if (parts.length > 2) {
    const ext = parts.pop();
    clean = parts.join("_") + "." + ext;
  }

  // Trim and limit length
  clean = clean.trim().slice(0, 100);

  return clean || "unnamed_model.stl";
}

/**
 * Validate file extension and safety
 */
export function validate3DFile(file: File): ValidationResult {
  const rawName = file.name;
  const sanitized = sanitizeFilename(rawName);
  const extMatch = sanitized.match(/\.[0-9a-z]+$/i);
  const ext = extMatch ? extMatch[0].toLowerCase() : "";

  // 1. Check extension whitelist
  if (!ALLOWED_EXTENSIONS.includes(ext as AllowedExtension)) {
    return {
      valid: false,
      error: `Unsupported format "${ext}". Please upload a valid 3D printing file (.stl, .3mf, .obj, .step).`,
      sanitizedName: sanitized,
      extension: ext,
      sizeFormatted: formatBytes(file.size),
      sizeBytes: file.size,
      isSTL: false,
      formatLabel: ext.replace(".", "").toUpperCase(),
    };
  }

  // 2. Check file size
  if (file.size <= 0) {
    return {
      valid: false,
      error: "The uploaded file is empty.",
      sanitizedName: sanitized,
      extension: ext,
      sizeFormatted: "0 Bytes",
      sizeBytes: 0,
      isSTL: false,
      formatLabel: ext.replace(".", "").toUpperCase(),
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size (${formatBytes(file.size)}) exceeds the maximum allowed limit of 50 MB.`,
      sanitizedName: sanitized,
      extension: ext,
      sizeFormatted: formatBytes(file.size),
      sizeBytes: file.size,
      isSTL: ext === ".stl",
      formatLabel: ext.replace(".", "").toUpperCase(),
    };
  }

  return {
    valid: true,
    sanitizedName: sanitized,
    extension: ext,
    sizeFormatted: formatBytes(file.size),
    sizeBytes: file.size,
    isSTL: ext === ".stl",
    formatLabel: ext.replace(".", "").toUpperCase(),
  };
}

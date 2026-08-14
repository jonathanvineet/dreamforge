import { useState, DragEvent, useEffect } from "react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

export function Order() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const EMAILJS_CONFIG = {
    SERVICE_ID: (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_EMAILJS_SERVICE_ID) || (import.meta as any).env?.VITE_EMAILJS_SERVICE_ID || "",
    TEMPLATE_ID: (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID) || (import.meta as any).env?.VITE_EMAILJS_TEMPLATE_ID || "",
    PUBLIC_KEY: (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) || (import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY || "",
  };

  useEffect(() => {
    if (EMAILJS_CONFIG.PUBLIC_KEY) {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }
  }, [EMAILJS_CONFIG.PUBLIC_KEY]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const templateParams = {
        from_name: formData.get("name")?.toString() || "",
        firstName: formData.get("name")?.toString() || "",
        email: formData.get("email")?.toString() || "",
        projectType: formData.get("project")?.toString() || "Not specified",
        message: formData.get("brief")?.toString() || "",
        to_email: "rehaanrafael.john@gmail.com",
      };

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        {
          publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
        }
      );

      toast.success("Thank you. We'll be in touch within 48 hours.");
      form.reset();
    } catch (error: unknown) {
      console.error("Form submission error:", error);
      const err = error as { text?: string };
      const errorMsg = err?.text || "Failed to send enquiry. Please try again later.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-14 text-center">
          <p className="eyebrow reveal mb-5">Start a project</p>
          <h2 className="display reveal reveal-delay-1 text-4xl leading-[1.05] md:text-6xl">
            Tell us what<br /><span className="italic text-foreground-soft">you'd like to make.</span>
          </h2>
          <p className="reveal reveal-delay-2 mx-auto mt-6 max-w-md text-sm text-muted-foreground">
            Share a brief, a sketch, or a 3D file. We'll respond personally with a plan and a quote.
          </p>
        </div>

        <form onSubmit={onSubmit} className="reveal reveal-delay-3 rounded-3xl glass-strong p-8 shadow-lift md:p-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Name" name="name" placeholder="Your name" />
            <Field label="Email" name="email" type="email" placeholder="you@studio.com" />
          </div>
          <div className="mt-6">
            <Field label="Project" name="project" placeholder="Anime figure, custom decor, etc." />
          </div>
          <div className="mt-6">
            <label className="eyebrow mb-3 block">Brief</label>
            <textarea
              name="brief"
              rows={4}
              required
              placeholder="Describe the piece, the size, and the feeling you're after."
              className="w-full resize-none rounded-xl border border-foreground/10 bg-background/60 px-4 py-3 text-sm placeholder:text-muted-foreground/70 focus:border-foreground/30 focus:outline-none focus:ring-0 transition-colors duration-300"
            />
          </div>



          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-foreground/10 pt-8 md:flex-row">
            <p className="text-xs text-muted-foreground">We reply within 48 hours.</p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-transform duration-500 ease-out-soft hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
            >
              {isSubmitting ? "Sending..." : "Send brief"}
              {!isSubmitting && <span className="transition-transform duration-500 ease-out-soft group-hover:translate-x-0.5">→</span>}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow mb-3 block">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-foreground/10 bg-background/60 px-4 py-3 text-sm placeholder:text-muted-foreground/70 focus:border-foreground/30 focus:outline-none focus:ring-0 transition-colors duration-300"
      />
    </div>
  );
}

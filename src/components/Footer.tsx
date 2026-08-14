import React from "react";
import { DreamForgeLogo } from "./DreamForgeLogo";
import { ArrowUp, Mail, MessageSquare } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/10 bg-black pt-12 pb-8 text-white/70">
      <div className="mx-auto max-w-6xl px-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-3">
            <a href="#" className="flex items-center gap-2.5 group inline-flex">
              <DreamForgeLogo className="w-6 h-6 transition-transform duration-300 group-hover:scale-105" />
              <span className="text-base font-bold tracking-tight text-white">
                DreamForge
              </span>
            </a>
            <p className="text-xs text-white/60 leading-relaxed max-w-sm">
              Custom 3D printing, high-precision resin modeling, and rapid prototyping studio.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Explore
            </div>
            <ul className="space-y-2 text-white/60">
              <li>
                <a href="/#about" className="hover:text-white transition-colors">About Studio</a>
              </li>
              <li>
                <a href="/projects" className="hover:text-white transition-colors">Project Gallery</a>
              </li>
              <li>
                <a href="/#categories" className="hover:text-white transition-colors">Services & Materials</a>
              </li>
              <li>
                <a href="/#order" className="hover:text-white transition-colors">Start a Project</a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-4 space-y-3 text-xs">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Contact
            </div>
            <ul className="space-y-2.5 text-white/60">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <a href="mailto:dreamforge3dprint@gmail.com" className="hover:text-white transition-colors">
                  dreamforge3dprint@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/918122714827"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp Direct
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs text-white/40">
          <span>© {new Date().getFullYear()} DreamForge. All rights reserved.</span>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useState } from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

type FormData = {
  // Business basics
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  websiteGoals: string;
  // Design
  brandColors: string;
  brandFonts: string;
  hasLogo: string;
  inspirationLikes: string;
  inspirationDislikes: string;
  // Content
  pages: string[];
  copyProvider: string;
  imagesProvider: string;
  // Technical
  hasDomain: string;
  domainName: string;
  hostingPreference: string;
  integrations: string[];
  otherIntegrations: string;
};

const PAGE_OPTIONS = [
  "Home",
  "About",
  "Services",
  "Portfolio / Gallery",
  "Blog",
  "Contact",
  "FAQ",
  "Testimonials",
  "Shop / E-commerce",
];

const INTEGRATION_OPTIONS = [
  "Online booking / scheduling",
  "Payment processing",
  "Email newsletter",
  "Social media feeds",
  "Live chat",
  "Analytics",
];

const STEPS = ["Business", "Design", "Content", "Technical"];

export default function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    websiteGoals: "",
    brandColors: "",
    brandFonts: "",
    hasLogo: "",
    inspirationLikes: "",
    inspirationDislikes: "",
    pages: [],
    copyProvider: "",
    imagesProvider: "",
    hasDomain: "",
    domainName: "",
    hostingPreference: "",
    integrations: [],
    otherIntegrations: "",
  });

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleList(field: "pages" | "integrations", value: string) {
    setForm((prev) => {
      const list = prev[field] as string[];
      return {
        ...prev,
        [field]: list.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value],
      };
    });
  }

  async function handleSubmit() {
    setError("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(JSON.stringify(data));
      }
    } catch (e) {
      setError(String(e));
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl p-10 text-center" style={{ background: "rgba(10,5,5,0.75)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2 text-white">All done!</h2>
        <p className="text-white/60">
          Thanks, {form.contactName}. We&apos;ve received your info and will be in touch at{" "}
          <span className="font-medium text-white">{form.email}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(10,5,5,0.75)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
      {/* Progress bar */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => i < step && setStep(i)}
                className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors"
                style={{
                  background: i <= step ? "var(--accent)" : "var(--border)",
                  color: i <= step ? "#fff" : "var(--muted)",
                  cursor: i < step ? "pointer" : "default",
                }}
              >
                {i < step ? "✓" : i + 1}
              </button>
              <span
                className="text-sm font-medium hidden sm:block"
                style={{ color: i === step ? "#fff" : "rgba(255,255,255,0.4)" }}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 h-0.5"
                  style={{ background: i < step ? "#8b1a1a" : "rgba(255,255,255,0.15)" }}
                />
              )}
            </div>
          ))}
        </div>
        <h2 className="text-xl font-semibold text-white">
          {step === 0 && "Business Basics"}
          {step === 1 && "Design Preferences"}
          {step === 2 && "Content"}
          {step === 3 && "Technical Details"}
        </h2>
      </div>

      <div className="px-8 pb-8 space-y-5">
        {/* Step 0: Business */}
        {step === 0 && (
          <>
            <Field label="Business name" required>
              <Input value={form.businessName} onChange={(v) => set("businessName", v)} placeholder="Acme Inc." />
            </Field>
            <Field label="Your name" required>
              <Input value={form.contactName} onChange={(v) => set("contactName", v)} placeholder="Joel Schwartz" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Email" required>
                <Input type="email" value={form.email} onChange={(v) => set("email", v)} placeholder="joel@example.com" />
              </Field>
              <Field label="Phone">
                <Input type="tel" value={form.phone} onChange={(v) => set("phone", v)} placeholder="(555) 000-0000" />
              </Field>
            </div>
            <Field label="What are your goals for this website?" required>
              <Textarea
                value={form.websiteGoals}
                onChange={(v) => set("websiteGoals", v)}
                placeholder="e.g. Generate leads, showcase portfolio, sell products online…"
              />
            </Field>
          </>
        )}

        {/* Step 1: Design */}
        {step === 1 && (
          <>
            <Field label="Brand colors" hint="List hex codes or describe them (e.g. navy blue, gold)">
              <Input value={form.brandColors} onChange={(v) => set("brandColors", v)} placeholder="#1A3C6E, #C9A84C" />
            </Field>
            <Field label="Preferred fonts" hint="Leave blank if you don't have a preference">
              <Input value={form.brandFonts} onChange={(v) => set("brandFonts", v)} placeholder="e.g. Helvetica, Georgia" />
            </Field>
            <Field label="Do you have an existing logo?">
              <RadioGroup
                value={form.hasLogo}
                onChange={(v) => set("hasLogo", v)}
                options={[
                  { value: "yes", label: "Yes, I'll provide the file" },
                  { value: "no", label: "No, I need one designed" },
                  { value: "maybe", label: "I have something rough / in progress" },
                ]}
              />
            </Field>
            <Field label="Websites you like (and why)" hint="Share links or names of sites whose style appeals to you">
              <Textarea
                value={form.inspirationLikes}
                onChange={(v) => set("inspirationLikes", v)}
                placeholder="e.g. stripe.com — clean, minimal, professional"
              />
            </Field>
            <Field label="Websites you dislike (and why)" hint="Helps us know what to avoid">
              <Textarea
                value={form.inspirationDislikes}
                onChange={(v) => set("inspirationDislikes", v)}
                placeholder="e.g. sites with auto-play video, too many popups…"
              />
            </Field>
          </>
        )}

        {/* Step 2: Content */}
        {step === 2 && (
          <>
            <Field label="Which pages do you need?" hint="Select all that apply">
              <CheckboxGroup
                options={PAGE_OPTIONS}
                selected={form.pages}
                onToggle={(v) => toggleList("pages", v)}
              />
            </Field>
            <Field label="Who will provide the written copy (text)?">
              <RadioGroup
                value={form.copyProvider}
                onChange={(v) => set("copyProvider", v)}
                options={[
                  { value: "client", label: "I'll write it myself" },
                  { value: "you", label: "I need you to write it" },
                  { value: "both", label: "Collaboration — I'll provide drafts for you to polish" },
                ]}
              />
            </Field>
            <Field label="Who will provide the images / photos?">
              <RadioGroup
                value={form.imagesProvider}
                onChange={(v) => set("imagesProvider", v)}
                options={[
                  { value: "client", label: "I have my own photos / assets" },
                  { value: "stock", label: "Use stock photos" },
                  { value: "photographer", label: "I need a photographer" },
                ]}
              />
            </Field>
          </>
        )}

        {/* Step 3: Technical */}
        {step === 3 && (
          <>
            <Field label="Do you already have a domain name?">
              <RadioGroup
                value={form.hasDomain}
                onChange={(v) => set("hasDomain", v)}
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No, I need one" },
                  { value: "unsure", label: "Not sure" },
                ]}
              />
            </Field>
            {form.hasDomain === "yes" && (
              <Field label="What's your domain name?">
                <Input value={form.domainName} onChange={(v) => set("domainName", v)} placeholder="mywebsite.com" />
              </Field>
            )}
            <Field label="Hosting preference">
              <RadioGroup
                value={form.hostingPreference}
                onChange={(v) => set("hostingPreference", v)}
                options={[
                  { value: "managed", label: "Managed hosting (you handle it)" },
                  { value: "existing", label: "I have existing hosting" },
                  { value: "unsure", label: "No preference / not sure" },
                ]}
              />
            </Field>
            <Field label="Integrations needed" hint="Select all that apply">
              <CheckboxGroup
                options={INTEGRATION_OPTIONS}
                selected={form.integrations}
                onToggle={(v) => toggleList("integrations", v)}
              />
            </Field>
            <Field label="Any other integrations or special requirements?">
              <Textarea
                value={form.otherIntegrations}
                onChange={(v) => set("otherIntegrations", v)}
                placeholder="e.g. CRM sync, membership portal, custom search…"
              />
            </Field>
          </>
        )}

        {error && (
          <p className="text-sm text-red-400 bg-red-950/40 border border-red-900/50 rounded-lg px-4 py-2">{error}</p>
        )}
        {/* Navigation */}
        <div className="flex justify-between pt-2">
          {step > 0 ? (
            <LiquidButton size="lg" onClick={() => setStep((s) => s - 1)} className="text-white/70 border border-white/20">
              Back
            </LiquidButton>
          ) : (
            <div />
          )}
          {step < STEPS.length - 1 ? (
            <LiquidButton size="lg" onClick={() => setStep((s) => s + 1)} disabled={!stepIsValid(step, form)} className="text-white border border-white/30">
              Next
            </LiquidButton>
          ) : (
            <LiquidButton size="lg" onClick={handleSubmit} disabled={!stepIsValid(step, form)} className="text-white border border-white/30">
              Submit
            </LiquidButton>
          )}
        </div>
      </div>
    </div>
  );
}

function stepIsValid(step: number, form: FormData): boolean {
  if (step === 0) return !!(form.businessName && form.contactName && form.email && form.websiteGoals);
  if (step === 2) return !!(form.pages.length > 0 && form.copyProvider && form.imagesProvider);
  return true;
}

// --- Sub-components ---

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-white/90">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {hint && <p className="text-xs text-white/40">{hint}</p>}
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/60 placeholder:text-white/20 text-white"
      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
    />
  );
}

function Textarea({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/60 placeholder:text-white/20 text-white resize-none"
      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
    />
  );
}

function RadioGroup({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
          <div
            className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors"
            style={{
              borderColor: value === opt.value ? "#8b1a1a" : "rgba(255,255,255,0.25)",
              background: value === opt.value ? "#8b1a1a" : "transparent",
            }}
            onClick={() => onChange(opt.value)}
          >
            {value === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
          <span className="text-sm text-white/80">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function CheckboxGroup({ options, selected, onToggle }: {
  options: string[]; selected: string[]; onToggle: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
          <div
            className="w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors"
            style={{
              borderColor: selected.includes(opt) ? "#8b1a1a" : "rgba(255,255,255,0.25)",
              background: selected.includes(opt) ? "#8b1a1a" : "transparent",
            }}
            onClick={() => onToggle(opt)}
          >
            {selected.includes(opt) && (
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="text-sm text-white/80">{opt}</span>
        </label>
      ))}
    </div>
  );
}

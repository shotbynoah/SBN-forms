import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const data = await req.json();

  const html = `
    <h2>New Website Onboarding: ${data.businessName}</h2>

    <h3>Business Basics</h3>
    <p><strong>Business:</strong> ${data.businessName}</p>
    <p><strong>Contact:</strong> ${data.contactName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone || "—"}</p>
    <p><strong>Goals:</strong> ${data.websiteGoals}</p>

    <h3>Design</h3>
    <p><strong>Brand colors:</strong> ${data.brandColors || "—"}</p>
    <p><strong>Fonts:</strong> ${data.brandFonts || "—"}</p>
    <p><strong>Logo:</strong> ${data.hasLogo || "—"}</p>
    <p><strong>Likes:</strong> ${data.inspirationLikes || "—"}</p>
    <p><strong>Dislikes:</strong> ${data.inspirationDislikes || "—"}</p>

    <h3>Content</h3>
    <p><strong>Pages:</strong> ${data.pages?.join(", ") || "—"}</p>
    <p><strong>Copy:</strong> ${data.copyProvider || "—"}</p>
    <p><strong>Images:</strong> ${data.imagesProvider || "—"}</p>

    <h3>Technical</h3>
    <p><strong>Has domain:</strong> ${data.hasDomain || "—"}${data.domainName ? ` — ${data.domainName}` : ""}</p>
    <p><strong>Hosting:</strong> ${data.hostingPreference || "—"}</p>
    <p><strong>Integrations:</strong> ${data.integrations?.join(", ") || "—"}</p>
    <p><strong>Other:</strong> ${data.otherIntegrations || "—"}</p>
  `;

  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "noah.kissinger24@gmail.com",
    subject: `New onboarding form: ${data.businessName}`,
    html,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

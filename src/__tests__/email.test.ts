import { describe, it, expect } from "vitest";
import {
  EMAIL_TEMPLATES,
  renderTemplate,
  templateCategory,
} from "@/lib/email/templates";
import {
  unsubscribeSignature,
  verifyUnsubscribeSignature,
} from "@/lib/email/send";

describe("email templates", () => {
  it("every template renders subject, html, and text", () => {
    for (const key of Object.keys(EMAIL_TEMPLATES)) {
      const rendered = renderTemplate(key, {
        name: "Jane",
        rfpTitle: "Test RFP",
        rfpId: "abc123",
        proposalTitle: "Test Proposal",
        proposalId: "p1",
        used: "2",
        limit: "3",
        plan: "Free",
        count: "12",
        deadline: "2026-07-15",
        email: "jane@example.com",
        searchName: "janitorial TX",
        targetIndustry: "IT services",
        chars: "12,345",
      });
      expect(rendered, `template ${key} failed to render`).not.toBeNull();
      expect(rendered!.subject.length).toBeGreaterThan(5);
      expect(rendered!.html).toContain("GovBidWriter");
      expect(rendered!.text.length).toBeGreaterThan(20);
    }
  });

  it("escapes HTML in user-controlled payload fields", () => {
    const rendered = renderTemplate("rfp_uploaded", {
      rfpTitle: `<script>alert("x")</script>`,
      rfpId: "1",
      chars: "100",
    });
    expect(rendered!.html).not.toContain("<script>");
    expect(rendered!.html).toContain("&lt;script&gt;");
  });

  it("includes the unsubscribe link when provided", () => {
    const url = "https://example.com/unsub";
    const rendered = renderTemplate("nurture_upgrade", {}, url);
    expect(rendered!.html).toContain(url);
    expect(rendered!.text).toContain(url);
  });

  it("classifies templates into known categories", () => {
    expect(templateCategory("welcome")).toBe("transactional");
    expect(templateCategory("nurture_upgrade")).toBe("marketing");
    expect(templateCategory("deadline_reminder")).toBe("deadline");
    expect(templateCategory("does_not_exist")).toBeNull();
  });
});

describe("unsubscribe signatures", () => {
  it("verifies its own signatures", () => {
    const sig = unsubscribeSignature("user_1", "marketing");
    expect(verifyUnsubscribeSignature("user_1", "marketing", sig)).toBe(true);
  });

  it("rejects tampered uid, category, or signature", () => {
    const sig = unsubscribeSignature("user_1", "marketing");
    expect(verifyUnsubscribeSignature("user_2", "marketing", sig)).toBe(false);
    expect(verifyUnsubscribeSignature("user_1", "product", sig)).toBe(false);
    expect(verifyUnsubscribeSignature("user_1", "marketing", "bogus")).toBe(false);
  });
});

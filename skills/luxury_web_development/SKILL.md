---
name: Luxury Web Development (Pro Max)
description: Master guidelines for creating ultra-luxury, high-end construction and remodeling websites based on the JC Milian success model. Use this skill when asked to build premium websites.
---

# Luxury Web Development Instructions (Pro Max)

When tasked with building or designing a premium, luxury, or high-end website, you **MUST** adhere to the following strict guidelines. These rules were forged through iterative success in the JC Milian Construction project.

## 1. Asset & Image Management (CRITICAL)
**Never rely on external image URLs (Unsplash, Placeholder, etc.) in production code.** 
External URLs frequently break, are blocked by ad-blockers, or redirect unexpectedly.
*   **Rule 1:** Always create a local `images` directory (e.g., `[project-root]/images/`).
*   **Rule 2:** Use the `generate_image` tool to create required assets (or ask the user to provide them) and save them directly into the `/images` folder.
*   **Rule 3:** All HTML `<img src="">` and CSS `background-image` references MUST point to local relative paths (e.g., `src="images/hero.png"`).

## 2. Forms & Lead Generation (Web3Forms Integration)
When creating contact or lead forms using the Web3Forms API, follow these precise patterns to avoid spamming the site owner or duplicating emails:

### Basic Contact Form payload template:
```javascript
const payload = {
    access_key: 'YOUR_ACCESS_KEY', // Ask user for this
    subject: 'New Consultation Request',
    from_name: 'Website Name',
    botcheck: '', // MUST ALWAYS REMAIN EMPTY
    email: clientEmail,
    replyto: clientEmail, // Allows the owner to hit "reply" directly
    // Add custom fields here (name, phone, projectType, etc.)
};
```

### Lead Magnet / Digital Product payload template:
If the user fills a form to receive a guide/product:
1.  **Do NOT include the guide link directly in the email sent to the owner.** The owner just needs the lead's contact info.
2.  Send a simple notification to the owner: `"New lead: ${email}"`.
3.  **Deliver the product instantly on-screen** via JavaScript (show a success `div` with the download link/button). Don't rely solely on email delivery if you don't have an autoresponder service like EmailJS set up.

## 3. Core Aesthetic Rules ("Silent Elegance")
To achieve a $10M+ luxury look, strictly enforce these design principles:
*   **Typography:** Use a sophisticated pairing. e.g., `Playfair Display` (headings) and `Inter` or `Noto Sans` (body). Never rely on browser defaults.
*   **Color Theory:** Avoid neon, pure black (#000000), or pure white (#FFFFFF). 
    *   *Backgrounds:* `#F9F9F9` (Cream) or `#0D0E15` (Obsidian)
    *   *Text:* `#333333` (Charcoal) or `#A3A6AE` (Smoke)
    *   *Accents:* Earthy, muted tones like Rust (`#A45D3D`), deep Sage, or brushed Gold. Never primary red/blue/green.
*   **Structure:** Maximize negative space. Sections should breathe. Elements must never feel crowded.
*   **Micro-animations:** Elements should gently fade in and slide up (`ag-reveal` pattern) as they scroll into view.

## 4. Workflows & Vercel Deployments
When transitioning code to production via Vercel:
1.  Ensure you have read the token from the user's `vercel-mcp-settings.json` or `.env` if provided.
2.  Deploy using `vercel deploy --token <TOKEN> --yes --prod`.
3.  **Mandatory:** After deployment, always use `browser_subagent` to visually verify the live production URL. Do not assume the deployment worked just because the CLI returned success. Check for broken images or layout shifts on the live site.

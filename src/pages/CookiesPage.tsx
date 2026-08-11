import { Link } from "react-router-dom"

import { LegalLayout } from "@/components/legal/LegalLayout"
import { LegalSection } from "@/components/legal/LegalSection"

export function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Use"
      updated="August 11, 2026"
      intro="This policy explains how Therabridge uses cookies and similar local storage technologies to keep you signed in, remember your preferences, and deliver features like web push notifications."
    >
      <LegalSection title="1. What are cookies?">
        <p>
          Cookies are small text files stored on your device by your browser.
          Along with other browser storage technologies like localStorage and
          sessionStorage, they allow a website to remember information between
          visits.
        </p>
      </LegalSection>

      <LegalSection title="2. Cookies we use">
        <p>
          Therabridge uses cookies and storage strictly for features you use —
          we do not use advertising or cross-site tracking cookies.
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Essential session cookies.</strong> To keep you signed in,
            we set HTTP-only cookies for your access token (short-lived) and a
            rotating refresh token. Because they are HTTP-only, JavaScript on
            the page cannot read them, which helps protect your session.
          </li>
          <li>
            <strong>Preference storage.</strong> We use localStorage to save
            your choices, such as theme (light, dark, or calm mode), font size,
            message previews, notification sounds, and other settings.
          </li>
          <li>
            <strong>Functionality storage.</strong> We use sessionStorage for
            transient state, such as remembering that you have acknowledged the
            AI companion disclosure during a visit.
          </li>
          <li>
            <strong>Service worker.</strong> When you enable web push
            notifications, your browser registers a service worker and a push
            subscription so notifications can be delivered to you.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Local storage & similar technologies">
        <p>
          In addition to cookies, we use browser local storage to persist
          non-sensitive preferences (listed above). Unlike cookies, localStorage
          data is not automatically sent to our servers; it stays on your
          device and is used to customize your experience.
        </p>
      </LegalSection>

      <LegalSection title="4. Third-party cookies">
        <p>
          Therabridge currently does not set advertising, analytics, or
          social-media tracking cookies. If we ever introduce non-essential
          third-party cookies, we will update this policy and ask for your
          consent before they are used.
        </p>
      </LegalSection>

      <LegalSection title="5. Managing cookies">
        <p>
          You can control cookies through your browser settings, including
          blocking or deleting cookies and clearing site data. You can also:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Sign out of your account, which clears your session cookies.</li>
          <li>
            Disable web push notifications from your browser and from within
            the app.
          </li>
          <li>
            Clear therabridge&apos;s site data to reset stored preferences.
          </li>
        </ul>
        <p>
          Please note that some cookies are essential to the Service. If you
          block them, you may not be able to sign in or use key features.
        </p>
      </LegalSection>

      <LegalSection title="6. Changes to this policy">
        <p>
          We may update this Cookie Use policy from time to time. Material
          changes will be reflected on this page with an updated date.
        </p>
      </LegalSection>

      <LegalSection title="7. Contact us">
        <p>
          If you have questions about cookies or storage, please reach out
          through the in-app support channels or visit therabridge.vercel.app.
          You can also review our{" "}
          <Link
            to="/privacy"
            className="text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Privacy Policy
          </Link>{" "}
          for more about how we handle your data.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}

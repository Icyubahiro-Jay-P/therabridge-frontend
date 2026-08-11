import { Link } from "react-router-dom"

import { LegalLayout } from "@/components/legal/LegalLayout"
import { LegalSection } from "@/components/legal/LegalSection"

export function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Use"
      updated="August 11, 2026"
      intro="Cookies and small pieces of saved data are how Therabridge remembers you — like keeping you signed in and remembering your preferences. This page explains, in plain language, how that works."
    >
      <LegalSection title="1. What are cookies?">
        <p>
          Cookies are tiny files your browser saves on your device so websites
          can remember you between visits. We also use similar, simple storage
          your browser offers — like saving your preferences.
        </p>
      </LegalSection>

      <LegalSection title="2. What we use them for">
        <p>
          Therabridge only uses cookies and saved data to make the app work for
          you. We don&rsquo;t use them for advertising or to track you across
          other sites.
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Keeping you signed in.</strong> We use secure sign-in
            cookies so you stay logged in as you move around the app. They&rsquo;re
            protected in a way that keeps them safe.
          </li>
          <li>
            <strong>Remembering your preferences.</strong> We save small things
            on your device, like your theme (light, dark, or calm mode), text
            size, and whether you want sound on.
          </li>
          <li>
            <strong>Remembering little things during a visit.</strong> During a
            single visit, we may remember things like whether you&rsquo;ve
            already seen our notice about Therry.
          </li>
          <li>
            <strong>Browser notifications.</strong> If you turn on
            notifications, your browser remembers that choice and can let us
            know when to send you a gentle ping.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Saved data on your device">
        <p>
          Beyond cookies, we save a few non-sensitive preferences on your
          device (listed above). These stay on your device and are used only to
          make the app feel right for you.
        </p>
      </LegalSection>

      <LegalSection title="4. Do we use third-party cookies?">
        <p>
          No — not today. Therabridge doesn&rsquo;t use advertising, analytics,
          or social-media tracking cookies. If we ever decide to, we&rsquo;ll
          update this page and ask your permission first.
        </p>
      </LegalSection>

      <LegalSection title="5. Managing cookies">
        <p>
          You&rsquo;re always in control. You can sign out, which clears your
          sign-in cookies. You can turn browser notifications off from your
          device. And you can clear the app&rsquo;s saved data through your
          browser settings anytime.
        </p>
        <p>
          A gentle note: a few cookies are essential to signing in. If you
          block all cookies, you may not be able to use the app.
        </p>
      </LegalSection>

      <LegalSection title="6. Changes to this policy">
        <p>
          We may update this Cookie Use page from time to time. When we make
          important changes, we&rsquo;ll post them here with a new date.
        </p>
      </LegalSection>

      <LegalSection title="7. Getting in touch">
        <p>
          Questions about cookies or saved data? Reach out through the support
          options in the app, or visit therabridge.vercel.app. You can also
          read our{" "}
          <Link
            to="/privacy"
            className="text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Privacy Policy
          </Link>{" "}
          for more about how we handle your information.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}

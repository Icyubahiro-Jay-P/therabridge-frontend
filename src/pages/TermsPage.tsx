import { Link } from "react-router-dom"

import { LegalLayout } from "@/components/legal/LegalLayout"
import { LegalSection } from "@/components/legal/LegalSection"

export function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated="August 11, 2026"
      intro="These Terms explain what you can expect from Therabridge and what we ask of you in return. Please read them — by creating an account or using the app, you agree to them."
    >
      <LegalSection title="1. Your agreement">
        <p>
          By creating an account, signing in, or using Therabridge (the
          &ldquo;Service&rdquo;), you agree to these Terms, our{" "}
          <Link
            to="/privacy-policy"
            className="text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Privacy Policy
          </Link>
          , and our{" "}
          <Link
            to="/cookie-use"
            className="text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Cookie Use
          </Link>{" "}
          policy. If any of this doesn&rsquo;t work for you, that&rsquo;s okay —
          please just don&rsquo;t use the app.
        </p>
      </LegalSection>

      <LegalSection title="2. Who can use Therabridge">
        <p>
          Therabridge is for people 18 and older. When you create an account,
          you confirm you&rsquo;re at least 18 and that the details you share
          about yourself are accurate.
        </p>
      </LegalSection>

      <LegalSection title="3. What Therabridge offers">
        <p>One calm place for your mental wellness, including:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Private, one-to-one chats with your therapist or people you trust</li>
          <li>Community rooms you can join by invite, with friendly moderators</li>
          <li>Therry, our 24/7 AI companion who&rsquo;s always there to listen</li>
          <li>Mood tracking so you can see how you&rsquo;re doing over time</li>
          <li>Gentle wellness exercises and small ways to keep going</li>
          <li>Crisis support, safety plans, and quick help when you need it most</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Therabridge is not a doctor">
        <p>
          We&rsquo;re here to support you, not to diagnose, treat, or replace
          professional care. Therry is a caring companion, not a therapist or
          clinician, and their words are informational — not medical advice.
        </p>
        <p>
          If you&rsquo;re in danger or having a medical emergency, please call
          your local emergency number right away. If you&rsquo;re in crisis,
          use the hotlines shown in the app or reach out to someone you trust.
          The crisis tools in Therabridge are an extra layer of support — never
          a replacement for emergency care.
        </p>
      </LegalSection>

      <LegalSection title="5. Your account">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Keep your password to yourself and protect your account.</li>
          <li>Don&rsquo;t let anyone else use your account, and don&rsquo;t log in for others.</li>
          <li>
            Let us know right away if you think someone else has gotten into
            your account.
          </li>
          <li>
            If we think your account has been misused or compromised, we may
            temporarily pause it to keep you safe.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Being a good member of the community">
        <p>Please use Therabridge kindly. Don&rsquo;t use it to:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Bully, harass, or threaten anyone</li>
          <li>Share content that&rsquo;s harmful, hateful, or breaks the law</li>
          <li>Spam people or flood conversations</li>
          <li>Try to access accounts or data that aren&rsquo;t yours</li>
          <li>Copy or download the app&rsquo;s content at scale</li>
          <li>Use the app for anything unlawful</li>
        </ul>
        <p>
          We may remove content that breaks these rules, and we may restrict
          accounts that keep breaking them.
        </p>
      </LegalSection>

      <LegalSection title="7. What you share stays yours">
        <p>
          Your messages, mood entries, safety plans, and everything else you
          create belong to you. We only use them to run the app — like storing
          them securely and showing them back to you where they belong.
        </p>
        <p>
          You&rsquo;re responsible for what you share and for making sure it
          doesn&rsquo;t break these Terms.
        </p>
      </LegalSection>

      <LegalSection title="8. About Therry">
        <p>
          Therry is here to listen and help you sort through your feelings.
          Because Therry is an AI, they can sometimes be wrong or miss the
          mark. Please don&rsquo;t rely on them for professional or emergency
          care.
        </p>
        <p>
          To help keep you safe, we may look at conversations for signs of
          crisis. If we think you might be in crisis, we may tell your
          therapist — or, if you don&rsquo;t have one, a member of our team — so
          someone can check in on you. We explain all of this in our{" "}
          <Link
            to="/privacy-policy"
            className="text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="9. Therapists and community rooms">
        <p>
          Therapists and professionals on Therabridge are independent — they
          aren&rsquo;t employees of ours. Community rooms are by invitation
          only, and the people who run them may approve or remove members to
          keep the space safe and friendly.
        </p>
      </LegalSection>

      <LegalSection title="10. Leaving Therabridge">
        <p>
          You can delete your account whenever you like from your settings.
          When you do, we permanently remove your information, as described in
          our Privacy Policy.
        </p>
        <p>
          We may pause or end your access if you break these Terms or if we
          believe keeping your account active would harm you or others.
        </p>
      </LegalSection>

      <LegalSection title="11. What we promise (and don&rsquo;t)">
        <p>
          We work hard to make Therabridge dependable and safe, but no app is
          perfect. We can&rsquo;t guarantee the Service will always be up,
          error-free, or exactly what you expect.
        </p>
      </LegalSection>

      <LegalSection title="12. Our responsibility">
        <p>
          To the fullest extent the law allows, Therabridge and the people
          behind it aren&rsquo;t liable for losses that come from using the
          Service. Nothing here limits liability where the law doesn&rsquo;t
          allow it to be limited.
        </p>
      </LegalSection>

      <LegalSection title="13. Changes to these Terms">
        <p>
          We may update these Terms from time to time. When we make important
          changes, we&rsquo;ll update the &ldquo;Last updated&rdquo; date above
          and post the new version here. If you keep using Therabridge after
          that, it means you accept the updated Terms.
        </p>
      </LegalSection>

      <LegalSection title="14. Getting in touch">
        <p>
          Questions about these Terms? Reach out through the support options in
          the app, or visit therabridge.vercel.app.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}

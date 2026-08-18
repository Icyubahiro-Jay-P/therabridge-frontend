import { Link } from "react-router-dom"

import { LegalLayout } from "@/components/legal/LegalLayout"
import { LegalSection } from "@/components/legal/LegalSection"

export function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="August 11, 2026"
      intro="What you share here is personal, especially when it comes to your wellbeing. This policy explains what we collect, how we use it, and how we keep it safe. If you ever have questions, we&rsquo;re here to answer them."
    >
      <LegalSection title="1. What we collect">
        <p>
          <strong>About you.</strong> Your first and last name, username, email
          address, date of birth, an optional profile photo, and an optional
          bio. Your password is never stored in a way anyone, including us,
          can read.
        </p>
        <p>
          <strong>Your conversations.</strong> Direct messages, community
          messages, and your chats with Therry.
        </p>
        <p>
          <strong>Your wellness information.</strong> Mood entries and notes,
          wellness activity, streaks, crisis reports, safety plans, and your
          preferences.
        </p>
        <p>
          <strong>A little about your device.</strong> Basic technical details
          we use to send you notifications and to keep your account secure.
        </p>
      </LegalSection>

      <LegalSection title="2. How we use it">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>To run the app, messaging, communities, Therry, and everything in between</li>
          <li>To connect you with your therapist and make sure help reaches you when needed</li>
          <li>To send the notifications you&rsquo;ve asked for</li>
          <li>To protect your account and keep the community safe</li>
          <li>To understand how people use the app so we can make it better</li>
          <li>To meet legal requirements and enforce our Terms</li>
        </ul>
        <p>
          We never sell your personal information. Ever.
        </p>
      </LegalSection>

      <LegalSection title="3. How we keep it safe">
        <p>We take your privacy seriously. Here&rsquo;s what that looks like:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Encryption.</strong> Sensitive things, your messages, mood
            notes, crisis descriptions, safety plan, and chats with Therry,
            are scrambled with strong encryption so they can only be read where
            they&rsquo;re meant to be.
          </li>
          <li>
            <strong>Secure sign-in.</strong> Your password is stored in a
            scrambled form, and your sign-in cookies are protected so they
            can&rsquo;t be read by scripts.
          </li>
          <li>
            <strong>Safe connections.</strong> All communication between your
            device and Therabridge is encrypted.
          </li>
          <li>
            <strong>Keeping the community healthy.</strong> We watch for spam
            and abuse and gently filter it out.
          </li>
        </ul>
        <p>
          No system is completely foolproof, but we put real effort into
          protecting what you share.
        </p>
      </LegalSection>

      <LegalSection title="4. Therry and getting you help">
        <p>
          When you talk to Therry, we may look for signs that you might be in
          crisis. If we find them, we may let your therapist know, or if you
          don&rsquo;t have one, a member of our team, and we&rsquo;ll show you
          hotlines for your area right in the app. We do this to help keep you
          safe, and we&rsquo;re always upfront about it.
        </p>
      </LegalSection>

      <LegalSection title="5. Who we share things with">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Your therapist.</strong> If a therapist is assigned to you,
            they can see what they need to support you, like your mood and
            crisis activity.
          </li>
          <li>
            <strong>Your communities.</strong> People in a community room you
            join can see your profile and messages there.
          </li>
          <li>
            <strong>Our service providers.</strong> We rely on a small number
            of trusted companies to run the app, like hosting and email, and
            they only handle data to do that job.
          </li>
          <li>
            <strong>For legal or safety reasons.</strong> We may share
            information if the law requires it, or to protect someone&rsquo;s
            safety.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. How long we keep things">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Your account and what you create are kept while your account is
            active.
          </li>
          <li>
            Crisis and safety records are kept for about six months, then
            identifying details are removed.
          </li>
          <li>
            When you delete your account, we permanently remove your profile,
            messages, communities, moods, crises, safety plan, Therry history,
            and more, everything connected to your account goes with it.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Your choices">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Edit your information.</strong> Update your profile, bio,
            and privacy choices anytime from your settings.
          </li>
          <li>
            <strong>Download your data.</strong> Grab a readable copy of
            everything you&rsquo;ve shared with us, whenever you want.
          </li>
          <li>
            <strong>Delete your account.</strong> Remove your account and all
            the data connected to it from your settings.
          </li>
          <li>
            <strong>Manage notifications.</strong> Choose which notifications
            you receive, including browser notifications.
          </li>
          <li>
            <strong>Control cookies.</strong> See our{" "}
            <Link
              to="/cookie-use"
              className="text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Cookie Use
            </Link>{" "}
            policy for how to manage them.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="8. A note about young people">
        <p>
          Therabridge is for people 18 and older, and we don&rsquo;t knowingly
          collect information from anyone younger. If you believe a young
          person has shared information with us, please reach out so we can
          remove it.
        </p>
      </LegalSection>

      <LegalSection title="9. Where your data lives">
        <p>
          Your data may be stored where our trusted service providers operate.
          By using Therabridge, you agree to that.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. When we make
          important changes, we&rsquo;ll post them here with a new date. If you
          keep using Therabridge after that, it means you accept the updated
          policy.
        </p>
      </LegalSection>

      <LegalSection title="11. Getting in touch">
        <p>
          Questions about your privacy or your data? Reach out through the
          support options in the app, or visit therabridge.vercel.app.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}

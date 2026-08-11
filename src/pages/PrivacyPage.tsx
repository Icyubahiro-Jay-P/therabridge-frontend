import { Link } from "react-router-dom"

import { LegalLayout } from "@/components/legal/LegalLayout"
import { LegalSection } from "@/components/legal/LegalSection"

export function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="August 11, 2026"
      intro="This Privacy Policy explains what information Therabridge collects, how we use and protect it, and the choices you have. Protecting your privacy — especially around sensitive mental health data — is core to what we do."
    >
      <LegalSection title="1. Information we collect">
        <p>
          <strong>Account information.</strong> First and last name, username,
          email address, date of birth, password (stored as a secure hash), an
          optional avatar, and an optional bio.
        </p>
        <p>
          <strong>Communications.</strong> Direct messages, community messages,
          and conversations with Therry, including edit history and unsent
          messages.
        </p>
        <p>
          <strong>Wellness data.</strong> Mood entries and notes, intensity and
          factors, wellness exercise activity and scores, streaks, crisis
          reports, safety plans, and preferences.
        </p>
        <p>
          <strong>Technical information.</strong> Browser and device details
          needed to deliver web push notifications, IP addresses and
          user-agents used in our security audit log, and information about how
          you use the Service.
        </p>
      </LegalSection>

      <LegalSection title="2. How we use your information">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>To provide and operate the Service, including messaging, communities, and Therry</li>
          <li>To connect you with your assigned therapist and support escalation</li>
          <li>To deliver in-app and push notifications you have enabled</li>
          <li>To keep the Service secure and prevent abuse</li>
          <li>To understand usage patterns and improve the Service</li>
          <li>To comply with legal obligations and enforce our Terms</li>
        </ul>
        <p>
          We do not sell your personal information.
        </p>
      </LegalSection>

      <LegalSection title="3. How we protect your information">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Encryption at rest.</strong> Sensitive fields — including
            messages, mood notes, crisis descriptions, safety plan items, Therry
            conversations, and notification bodies — are encrypted at rest using
            AES-256-GCM field-level encryption.
          </li>
          <li>
            <strong>Encryption in transit.</strong> All traffic is served over
            HTTPS/TLS.
          </li>
          <li>
            <strong>Secure authentication.</strong> Passwords are hashed with
            bcrypt, and sessions use short-lived access tokens and rotating
            refresh tokens stored in HTTP-only cookies.
          </li>
          <li>
            <strong>Abuse prevention.</strong> We use rate limiting, input
            validation, and spam filtering to protect the platform.
          </li>
        </ul>
        <p>
          While we take strong measures to protect your data, no method of
          transmission or storage is completely secure.
        </p>
      </LegalSection>

      <LegalSection title="4. AI companion & crisis escalation">
        <p>
          When you chat with Therry, your conversation may be analyzed to
          detect signs of crisis. If a crisis is detected, we may notify your
          assigned therapist, or platform administrators if you have no
          therapist, and we will surface region-appropriate crisis hotlines in
          the app. These actions are designed to help keep you safe and are
          described in the app before they happen.
        </p>
      </LegalSection>

      <LegalSection title="5. How we share information">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>With your therapist.</strong> If a therapist is assigned to
            you, they can see your profile, mood and crisis activity, and other
            information needed to support you.
          </li>
          <li>
            <strong>Within communities.</strong> Your messages and profile are
            visible to other members and moderators of communities you join.
          </li>
          <li>
            <strong>With service providers.</strong> We use hosting, email, and
            infrastructure providers that process data on our behalf and only as
            needed to operate the Service.
          </li>
          <li>
            <strong>For legal and safety reasons.</strong> We may disclose
            information where required by law, to protect the safety of users or
            the public, or to enforce our Terms.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Data retention">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Your account and the data you create are retained while your account
            is active.
          </li>
          <li>
            Crisis and audit logs are retained for approximately six months,
            after which identity fields are anonymized.
          </li>
          <li>
            When you delete your account, your profile, messages, communities,
            moods, crises, safety plan, Therry history, notifications, exercise
            logs, and related records are permanently deleted as part of a
            cascade, while audit history is retained with identifying
            references removed.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Your rights and choices">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Edit your information.</strong> Update your profile, bio,
            chat settings, and privacy visibility from your settings.
          </li>
          <li>
            <strong>Export your data.</strong> Download a complete, decrypted
            copy of all the data we hold about you at any time.
          </li>
          <li>
            <strong>Delete your account.</strong> Permanently delete your
            account and all associated data from your settings.
          </li>
          <li>
            <strong>Manage notifications.</strong> Control in-app and push
            notifications, including web push subscriptions.
          </li>
          <li>
            <strong>Control cookies and local storage.</strong> See our{" "}
            <Link
              to="/cookies"
              className="text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Cookie Use
            </Link>{" "}
            policy for details on how to manage them.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Children's privacy">
        <p>
          The Service is not directed to children under 18, and we do not
          knowingly collect personal information from anyone under 18. If you
          believe a child has provided us with personal information, please
          contact us so we can delete it.
        </p>
      </LegalSection>

      <LegalSection title="9. International data">
        <p>
          Therabridge may process data in locations where our infrastructure
          providers operate. By using the Service, you consent to this
          processing.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. Material changes
          will be reflected on this page with an updated date. Your continued
          use of the Service after changes take effect constitutes acceptance
          of the revised policy.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact us">
        <p>
          If you have questions about this Privacy Policy or your data, please
          reach out through the in-app support channels or visit
          therabridge.vercel.app.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}

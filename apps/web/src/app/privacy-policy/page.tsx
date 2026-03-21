import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | APCD OEM Empanelment Portal',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Privacy Policy</h1>

        <div className="space-y-6 rounded-lg bg-white p-8 shadow">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-800">1. Introduction</h2>
            <p className="text-gray-600">
              The APCD OEM Empanelment Portal (&quot;Portal&quot;) is operated by the National
              Productivity Council (NPC) under the Central Pollution Control Board (CPCB),
              Government of India. This Privacy Policy explains how we collect, use, store, and
              protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-800">2. Information We Collect</h2>
            <ul className="ml-6 list-disc space-y-2 text-gray-600">
              <li>Registration details: name, email, phone number, mobile number</li>
              <li>Company details: company name, address, GST, PAN, firm type</li>
              <li>Application documents: uploaded certificates, reports, photographs</li>
              <li>Payment information: transaction IDs, payment status (processed via Razorpay)</li>
              <li>Usage data: login timestamps, IP addresses (for security and audit)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-800">
              3. How We Use Your Information
            </h2>
            <ul className="ml-6 list-disc space-y-2 text-gray-600">
              <li>Processing your OEM empanelment application</li>
              <li>Communicating application status updates</li>
              <li>Generating empanelment certificates</li>
              <li>Compliance with regulatory requirements</li>
              <li>Audit trail maintenance as per government guidelines</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-800">4. Data Storage & Security</h2>
            <p className="text-gray-600">
              All data is stored on Government of India infrastructure (NICSI servers). We implement
              encryption in transit (HTTPS/TLS), password hashing (bcrypt), and role-based access
              controls. Audit logs are maintained with SHA-256 hash chain verification for tamper
              detection.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-800">5. Data Sharing</h2>
            <p className="text-gray-600">
              Your information is shared only with authorized NPC officers, CPCB officials, and
              committee members involved in the empanelment process. We do not sell or share data
              with third parties except as required by law or court order.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-800">6. Data Retention</h2>
            <p className="text-gray-600">
              Application data and certificates are retained for the duration of the empanelment
              period plus 5 years. Audit logs are retained permanently as per government archival
              policies. You may request deletion of your account by contacting the NPC office.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-800">7. Your Rights</h2>
            <p className="text-gray-600">
              Under applicable laws, you have the right to access, correct, or request deletion of
              your personal data. For any privacy-related queries, contact:{' '}
              <a href="mailto:apcd@npcindia.gov.in" className="text-blue-600 hover:underline">
                apcd@npcindia.gov.in
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-800">8. Cookies</h2>
            <p className="text-gray-600">
              This portal uses essential cookies for session management and authentication only. No
              third-party tracking cookies are used.
            </p>
          </section>

          <p className="mt-8 text-sm text-gray-400">Last updated: March 2026</p>
        </div>
      </div>
    </div>
  );
}

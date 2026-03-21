import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use | APCD OEM Empanelment Portal',
};

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Terms of Use</h1>

        <div className="space-y-6 rounded-lg bg-white p-8 shadow">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-800">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using the APCD OEM Empanelment Portal, you agree to comply with these
              Terms of Use. This portal is an official service of the National Productivity Council
              (NPC) for the Central Pollution Control Board (CPCB), Government of India.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-800">2. Eligibility</h2>
            <p className="text-gray-600">
              This portal is intended for Air Pollution Control Device (APCD) manufacturers seeking
              empanelment with CPCB. Users must be authorized representatives of their respective
              organizations.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-800">3. User Responsibilities</h2>
            <ul className="ml-6 list-disc space-y-2 text-gray-600">
              <li>Provide accurate and truthful information in all submissions</li>
              <li>Maintain confidentiality of login credentials</li>
              <li>Upload only genuine documents and certificates</li>
              <li>Report any unauthorized access immediately</li>
              <li>Not attempt to bypass security measures or rate limits</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-800">4. Prohibited Activities</h2>
            <ul className="ml-6 list-disc space-y-2 text-gray-600">
              <li>Submitting fraudulent or misleading documents</li>
              <li>Attempting to access other users&apos; accounts or data</li>
              <li>Using automated tools to submit applications or scrape data</li>
              <li>Interfering with portal operations or security</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-800">5. Intellectual Property</h2>
            <p className="text-gray-600">
              The portal content, design, and branding are the property of NPC and the Government of
              India. Documents uploaded by users remain their property but are licensed to NPC for
              the purposes of empanelment evaluation.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-800">6. Fees & Payments</h2>
            <p className="text-gray-600">
              Application fees are non-refundable. Empanelment fees are charged per APCD model type.
              All fees are inclusive of applicable GST. Fee schedule is published on the portal and
              may be revised by NPC from time to time.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-800">7. Limitation of Liability</h2>
            <p className="text-gray-600">
              NPC and CPCB shall not be liable for any loss arising from portal downtime, data loss
              due to force majeure, or decisions made based on information submitted through this
              portal.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-800">8. Governing Law</h2>
            <p className="text-gray-600">
              These terms are governed by the laws of the Republic of India. Any disputes shall be
              subject to the exclusive jurisdiction of the courts in New Delhi.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-800">9. Contact</h2>
            <p className="text-gray-600">
              For queries related to these terms, contact NPC at:{' '}
              <a href="mailto:apcd@npcindia.gov.in" className="text-blue-600 hover:underline">
                apcd@npcindia.gov.in
              </a>
            </p>
          </section>

          <p className="mt-8 text-sm text-gray-400">Last updated: March 2026</p>
        </div>
      </div>
    </div>
  );
}

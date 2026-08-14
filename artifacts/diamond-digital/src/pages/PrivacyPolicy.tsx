import { motion } from "framer-motion";
import { useSeo } from "@/hooks/useSeo";

export default function PrivacyPolicy() {
  useSeo({
    title: "Privacy Policy | Diamond Digital",
    description: "Read Diamond Digital's privacy policy to understand how we collect, use, and protect your personal information.",
    canonical: "/privacy-policy",
  });
  return (
    <div className="pt-[60px] pb-32 px-6">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs font-mono text-primary tracking-widest mb-4 uppercase">Legal</p>
          <h1 className="text-5xl md:text-6xl font-display font-black text-white mb-4">Privacy Policy</h1>
          <p className="text-sm font-mono text-muted-foreground mb-12">Last Updated: August 14, 2026</p>

          <div className="prose-legal space-y-10 text-muted-foreground text-sm leading-relaxed">

            <section>
              <p>
                Diamond Digital ("we," "us," or "our") is a subsidiary of The Titan Media. This Privacy Policy explains how Diamond Digital collects, uses, discloses, and protects information when you visit <strong className="text-white">thediamonddigital.com</strong> (the "Site") or engage with our digital marketing and software development services.
              </p>
              <p className="mt-4">
                By using this Site, you agree to the practices described in this Privacy Policy. If you do not agree, please do not use the Site.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">1. Information We Collect</h2>
              <p className="mb-3"><strong className="text-white">Information you voluntarily provide.</strong> When you fill out a contact form, request a quote, or otherwise communicate with us, we may collect:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Company name</li>
                <li>Project description and other messages you send us</li>
                <li>Budget and timeline information</li>
              </ul>
              <p className="mt-4"><strong className="text-white">Technical and usage information.</strong> When you visit the Site, we may automatically collect:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>IP address and general geographic location</li>
                <li>Browser type and version</li>
                <li>Device type and operating system</li>
                <li>Pages visited and time spent on the Site</li>
                <li>Referring URLs and search terms</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">2. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies, pixel tags, and similar technologies to operate the Site and understand how visitors interact with it. These may include:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong className="text-white">Essential cookies</strong> — required for basic site functionality.</li>
                <li><strong className="text-white">Analytics cookies</strong> — used to measure traffic and usage patterns (e.g., Google Analytics).</li>
                <li><strong className="text-white">Advertising and marketing technologies</strong> — used by our clients or partners to measure campaign effectiveness. These may include Meta Pixel, Google Ads tags, and similar tools.</li>
              </ul>
              <p className="mt-3">Most browsers allow you to control cookies through their settings. Disabling certain cookies may affect Site functionality.</p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Respond to your inquiries and quote requests</li>
                <li>Provide digital marketing and software development services</li>
                <li>Send marketing communications (you may opt out at any time)</li>
                <li>Improve our Site, services, and overall performance</li>
                <li>Comply with legal obligations</li>
                <li>Detect and prevent fraud or security incidents</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">4. Third-Party Service Providers</h2>
              <p>
                We may share your information with trusted third-party service providers who help us operate our business, including:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Advertising and analytics providers (e.g., Google, Meta)</li>
                <li>Email and CRM platforms</li>
                <li>Payment processors where applicable</li>
                <li>Hosting and infrastructure providers</li>
              </ul>
              <p className="mt-3">
                These providers are contractually required to handle your data securely and only for the purposes we specify. We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">5. Data Retention</h2>
              <p>
                We retain personal information for as long as necessary to fulfill the purposes described in this Privacy Policy, maintain our business records, and comply with legal requirements. Contact and inquiry data is typically retained for up to 3 years unless a client relationship is established, in which case longer retention may apply.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">6. Data Security</h2>
              <p>
                We implement reasonable technical and organizational measures to protect your information against unauthorized access, loss, or misuse. However, no transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">7. Your Privacy Choices</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-white">Email communications.</strong> You may unsubscribe from marketing emails at any time by clicking the unsubscribe link in any email or contacting us directly.</li>
                <li><strong className="text-white">Access and correction.</strong> You may contact us to request access to, correction of, or deletion of personal information we hold about you, subject to applicable law.</li>
                <li><strong className="text-white">Cookies.</strong> You may adjust your browser settings to refuse certain cookies.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">8. Children's Privacy</h2>
              <p>
                Our Site is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us and we will delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">9. Third-Party Links</h2>
              <p>
                The Site may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">10. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date at the top of this page. Continued use of the Site after changes constitutes your acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">11. Contact Us</h2>
              <p>
                Diamond Digital is a subsidiary of The Titan Media. If you have questions about this Privacy Policy or how we handle your information, please contact us at:
              </p>
              <p className="mt-3 font-mono text-white">
                <a href="mailto:info@thediamonddigital.com" className="text-primary hover:underline">info@thediamonddigital.com</a>
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}

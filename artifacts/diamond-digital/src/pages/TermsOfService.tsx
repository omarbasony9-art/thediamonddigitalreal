import { motion } from "framer-motion";

export default function TermsOfService() {
  return (
    <div className="pt-[60px] pb-32 px-6">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs font-mono text-primary tracking-widest mb-4 uppercase">Legal</p>
          <h1 className="text-5xl md:text-6xl font-display font-black text-white mb-4">Terms of Service</h1>
          <p className="text-sm font-mono text-muted-foreground mb-12">Last Updated: August 14, 2026</p>

          <div className="space-y-10 text-muted-foreground text-sm leading-relaxed">

            <section>
              <p>
                Diamond Digital ("Diamond Digital," "we," "us," or "our") is a subsidiary of The Titan Media. These Terms of Service ("Terms") govern your access to and use of <strong className="text-white">thediamonddigital.com</strong> (the "Site") and any digital marketing or software development services we provide.
              </p>
              <p className="mt-4">
                By accessing the Site or engaging our services, you agree to be bound by these Terms. If you do not agree, please do not use the Site or engage our services.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">1. Acceptance of Terms</h2>
              <p>
                These Terms constitute a legally binding agreement between you (the "Client" or "User") and Diamond Digital, operating under its parent company, The Titan Media. We reserve the right to update these Terms at any time. Continued use of the Site or services after changes constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">2. Use of This Website</h2>
              <p>You agree to use this Site only for lawful purposes and in a manner that does not infringe the rights of others. You may not:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Transmit any unlawful, harmful, or fraudulent content</li>
                <li>Attempt to gain unauthorized access to any part of the Site or its systems</li>
                <li>Use automated means to scrape, crawl, or extract content from the Site without written permission</li>
                <li>Impersonate Diamond Digital, its employees, or any third party</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">3. Digital Marketing Services</h2>
              <p>
                Diamond Digital provides digital marketing services including but not limited to paid advertising, social media management, content creation, influencer marketing, email marketing, lead generation, search engine optimization, and marketing analytics.
              </p>
              <p className="mt-3">
                <strong className="text-white">Marketing results are not guaranteed.</strong> All performance projections, estimates, and expected outcomes are illustrative only. Actual results may vary depending on market conditions, client-provided assets, budget, competition, and other factors outside our control. We make no warranty that any campaign will achieve specific results.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">4. Software Development Services</h2>
              <p>
                Diamond Digital provides software development services including websites, web applications, mobile applications, custom software, internal tools, dashboards, integrations, and automation.
              </p>
              <p className="mt-3">
                <strong className="text-white">Software results and performance are not guaranteed beyond the scope of a written client agreement.</strong> Specific deliverables, timelines, performance standards, and warranty terms are defined in individual project agreements. Nothing in these Terms constitutes a performance guarantee beyond what is expressly stated in a signed agreement.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">5. Quotes, Proposals, and Client Agreements</h2>
              <p>
                Quotes and proposals submitted through this Site or by email are non-binding estimates. A project does not commence until both parties have executed a written client agreement or statement of work. Quotes are valid for 30 days from the date of issuance unless otherwise stated.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">6. Payment and Billing</h2>
              <p>
                Payment terms, amounts, and schedules are defined in the applicable client agreement. Unless otherwise agreed in writing:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>A deposit may be required before work commences</li>
                <li>Invoices are due within the timeframe specified on the invoice</li>
                <li>Late payments may result in work being paused until payment is received</li>
                <li>All fees are non-refundable unless otherwise stated in the client agreement</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">7. Project Scope and Scope Changes</h2>
              <p>
                All work is performed based on the scope defined in the client agreement. Requests for additions or changes to the agreed scope ("scope changes") will be evaluated separately and may require a change order with adjusted pricing and timelines. We are not obligated to perform out-of-scope work without a written amendment.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">8. Client Responsibilities</h2>
              <p>Clients agree to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Provide accurate, complete, and timely information required for the project</li>
                <li>Designate a point of contact with authority to make decisions</li>
                <li>Provide timely feedback and approvals as requested</li>
                <li>Ensure they have the right to use any content, images, or materials provided to us</li>
              </ul>
              <p className="mt-3">Delays caused by the client's failure to fulfill these responsibilities may affect project timelines at no liability to Diamond Digital.</p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">9. Intellectual Property</h2>
              <p>
                Unless otherwise specified in a written client agreement, upon receipt of full payment for a project, the client receives ownership of the custom deliverables created for them under that project. Diamond Digital retains the right to display the work in its portfolio unless the client requests otherwise in writing.
              </p>
              <p className="mt-3">
                Diamond Digital retains all rights to its pre-existing tools, frameworks, templates, methodologies, and proprietary technologies used in delivering services. Third-party software, libraries, or services included in a project remain subject to their respective licenses.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">10. Third-Party Services and Software</h2>
              <p>
                Our services may involve or recommend third-party platforms, software, or services (e.g., advertising platforms, CRMs, hosting providers). Diamond Digital is not responsible for the availability, performance, pricing changes, or terms of third-party services. Client use of third-party services is subject to those providers' terms.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">11. Confidentiality</h2>
              <p>
                Both parties agree to treat as confidential any non-public business information shared during the engagement. This obligation does not apply to information that is publicly known, independently developed, or required to be disclosed by law. Confidentiality obligations survive termination of the engagement.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">12. Disclaimer of Warranties</h2>
              <p>
                THE SITE AND ALL CONTENT, SERVICES, AND MATERIALS PROVIDED BY DIAMOND DIGITAL ARE OFFERED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">13. Limitation of Liability</h2>
              <p>
                TO THE FULLEST EXTENT PERMITTED BY LAW, DIAMOND DIGITAL AND ITS PARENT COMPANY, THE TITAN MEDIA, SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SITE OR OUR SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY IN CONNECTION WITH ANY CLAIM ARISING FROM THESE TERMS OR OUR SERVICES SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE NINETY (90) DAYS PRECEDING THE CLAIM.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">14. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Diamond Digital and The Titan Media, and their respective officers, employees, and agents, from any claims, damages, losses, or expenses (including reasonable legal fees) arising from your use of the Site, your violation of these Terms, or your violation of any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">15. Termination</h2>
              <p>
                Either party may terminate a client engagement in accordance with the terms of the applicable client agreement. Diamond Digital reserves the right to terminate access to the Site and refuse service to anyone at any time for any reason. Termination does not relieve the client of outstanding payment obligations.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">16. Changes to These Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will indicate the date of the most recent revision at the top of this page. Your continued use of the Site after any changes constitutes your acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-white text-xl mb-3">17. Contact Us</h2>
              <p>
                Diamond Digital is a subsidiary of The Titan Media. For questions about these Terms, please contact us at:
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

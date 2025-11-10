import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground">
              Last updated: October 11, 2025
            </p>
          </div>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-muted-foreground mb-4">
                Welcome to Verify Social (“we”, “our”, or “us”). Your privacy
                matters to us. This Privacy Policy explains how we collect, use,
                and protect your personal information when you use our platform
                — a trust and discovery service that helps customers find
                verified and credible vendors from social media platforms such
                as Instagram.
              </p>
              <p className="text-muted-foreground">
                By using Verify Social, you agree to the practices described in
                this policy.
              </p>
            </section>

            <section>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold">
                  1. Information We Collect
                </h2>

                <p className="text-muted-foreground">
                  We may collect and process the following types of information
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    a. User Information
                  </h3>

                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Name, email address, and contact details</li>
                    <li>
                      Account login credentials (if you create an account)
                    </li>
                    <li>
                      Search activity, favorites, and reviews posted on our
                      platform
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    b. Vendor Information
                  </h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>
                      Business name, social media handle(s), website, and
                      contact information
                    </li>
                    <li>
                      Verification documents (e.g. business registration, ID, or
                      proof of authenticity)
                    </li>
                    <li>Ratings, reviews, and verification status</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    c. Automatically Collected Data
                  </h2>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>IP address, browser type, and device information</li>
                    <li>
                      Usage statistics and analytics (via cookies or tracking
                      tools)
                    </li>
                    <li>Referring website or social media link</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. How We Collect Information
              </h2>
              <p className="text-muted-foreground mb-4">
                We collect information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  Directly from you when you register, submit a review, or
                  request verification
                </li>
                <li>Automatically when you browse our site or app</li>
                <li>
                  From public sources (e.g., social media pages, websites)
                </li>
                <li>
                  From third-party partners that assist with identity
                  verification or analytics
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect to:
              </p>

              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Verify vendor authenticity and credibility</li>
                <li>Help customers find trustworthy social media vendors</li>
                <li>Improve our platform and personalize your experience</li>
                <li>Communicate updates, offers, or policy changes</li>
                <li>Detect and prevent fraudulent or deceptive activity</li>
                <li>Comply with applicable legal or regulatory requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                4. Legal Basis for Processing
              </h2>
              <p className="text-muted-foreground mb-4">
                We process your data based on:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  Your <b>consent</b> (e.g., when you sign up or submit
                  information)
                </li>
                <li>
                  Our <b>legitimate business interests</b> in maintaining a safe
                  and reliable platform
                </li>
                <li>
                  <b>Legal obligations</b>, such as fraud prevention or law
                  enforcement requests
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We use strong security measures to protect your information,
                including:
              </p>

              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Encryption and secure data storage</li>
                <li>Limited access to authorized personnel only</li>
                <li>
                  Regular audits and monitoring against unauthorized access or
                  misuse
                </li>
              </ul>
              <p className="mt-2 text-muted-foreground">
                However, please note that no method of transmission over the
                internet is 100% secure. We encourage users to take precautions
                when sharing information online.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                6. Sharing of Information
              </h2>
              <p className="text-muted-foreground mb-4">
                We may share information with:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <b>Verification partners</b> (to confirm vendor authenticity)
                </li>
                <li>
                  <b>Analytics and hosting providers</b> (for platform
                  maintenance)
                </li>
                <li>
                  <b>Law enforcement</b> or regulators (when required by law)
                </li>
              </ul>

              <p className="mt-2 text-muted-foreground">
                We do not sell or rent personal data to any third party.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                7. Cookies and Tracking
              </h2>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar technologies to:
              </p>

              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Analyze site usage and improve performance</li>
                <li>Remember user preferences</li>
                <li>Deliver relevant content and recommendations</li>
              </ul>

              <p className="mt-2 text-muted-foreground">
                You can modify your browser settings to refuse cookies, though
                this may affect some platform features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                Depending on your location, you may have the right to:
              </p>

              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Access and receive a copy of your data</li>
                <li>Request correction or deletion of your data</li>
                <li>Withdraw consent at any time</li>
                <li>
                  Object to or restrict certain data processing activities
                </li>
              </ul>

              <p className="mt-2 text-muted-foreground">
                To exercise these rights, contact us at info@verifysocial.com.ng
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Data Retention</h2>
              <p className="text-muted-foreground mb-4">
                We retain your information only as long as necessary to:
              </p>

              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide our services</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes or enforce agreements</li>
              </ul>

              <p className="mt-2 text-muted-foreground">
                Once data is no longer required, it will be securely deleted or
                anonymized.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                10. Updates to This Policy
              </h2>
              <p className="text-muted-foreground mb-4">
                We may update this Privacy Policy periodically to reflect
                changes in our practices or legal obligations. Any updates will
                be posted on this page with a new “Last Updated” date. We
                encourage you to review it regularly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions or concerns about this Privacy Policy
                or our data practices, please contact us at:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <a href="mailto:info@verifysocial.com.ng">
                    info@verifysocial.com.ng
                  </a>
                </li>
                <li>
                  <a href="https://verifysocial.com.ng">verifysocial.com.ng</a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;

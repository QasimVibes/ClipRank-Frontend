import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-primary font-sans">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-invert prose-purple max-w-none"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">Privacy Policy</h1>
          <p className="text-muted mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-muted leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">1. Introduction</h2>
              <p>
                Welcome to ClipRank ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data.
                This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">2. Data We Collect</h2>
              <p>
                When you use our services, we may collect information such as your email address, username, and public profile information if you choose to authenticate using third-party services like Google or Meta (Facebook and Instagram). 
                We also temporarily process video URLs, media content, and associated metadata you submit or allow us to fetch from these connected accounts to generate AI-ranked clips. We do not store this data longer than necessary to provide the clipping functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">3. Third-Party API Services</h2>
              <p>
                ClipRank integrates with several third-party platforms to provide our services. By connecting these platforms, you agree to their respective terms and policies:
              </p>
              <p className="mt-4">
                Specifically regarding our supported platforms:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  We use YouTube API Services (specifically <code>youtube.readonly</code> and <code>youtube.upload</code> scopes) to authenticate users, fetch public channel information for verification, and upload user-selected videos directly to their YouTube channels. By using our service, you agree to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer" className="text-accent hover:underline">YouTube Terms of Service</a>. Users can revoke access via the <a href="https://security.google.com/settings/security/permissions" target="_blank" rel="noreferrer" className="text-accent hover:underline">Google Security Settings page</a>.
                </li>
                <li>
                  We use Instagram and Facebook Graph APIs to fetch video URLs and metadata. By using these features, you agree to be bound by the <a href="https://help.instagram.com/581066165581870" target="_blank" rel="noreferrer" className="text-accent hover:underline">Instagram Terms of Use</a> and <a href="https://www.facebook.com/terms.php" target="_blank" rel="noreferrer" className="text-accent hover:underline">Facebook Terms of Service</a>.
                </li>
                <li>
                  We only use your data to perform the core functions of the application (e.g., retrieving channel details and publishing user-initiated clips). We do not sell or share this data with third parties for advertising or any unapproved purposes.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">4. How We Use Your Data</h2>
              <p>
                We use your information strictly to provide, maintain, and improve our services (such as generating social media clips from your linked accounts). We do not sell your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">5. Data Protection</h2>
              <p>
                We implement a variety of security measures to maintain the safety of your personal information. All sensitive data exchanged between your browser and our servers is transmitted over a secure SSL/TLS encrypted connection. Authentication tokens, such as those provided by Google and Meta, are stored securely using industry-standard encryption and database access control practices to protect against unauthorized access, alteration, disclosure, or destruction of your personal data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">6. Data Retention and Deletion</h2>
              <p>
                We retain your user data (such as authentication tokens and channel/profile identifiers) only for as long as necessary to provide you with our services.
                OAuth access and refresh tokens are retained while your account connection is active and are securely deleted when you disconnect your account or log out.
                Video metadata and generated clip information are retained temporarily to facilitate processing and are periodically purged.
              </p>
              
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">6.1 Meta (Facebook/Instagram) Data Deletion</h3>
                  <p>
                    In compliance with Meta Platform rules, you have the right to request the deletion of your personal data at any time. To remove our app's access to your Facebook/Instagram account:
                  </p>
                  <ol className="list-decimal pl-6 mt-2 space-y-2">
                    <li>Go to your Facebook profile and click on <strong>Settings &amp; Privacy</strong> &gt; <strong>Settings</strong>.</li>
                    <li>Navigate to <strong>Apps and Websites</strong>.</li>
                    <li>Find <strong>ClipRank</strong> in the list of active apps, click "Remove", and confirm.</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">6.2 Google (YouTube) Data Deletion</h3>
                  <p>
                    You can revoke our access to your Google account at any time via the <a href="https://security.google.com/settings/security/permissions" target="_blank" rel="noreferrer" className="text-accent hover:underline">Google Security Settings page</a>. Doing so will immediately cease any further data collection from your YouTube account.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">6.3 Complete Data Deletion Request</h3>
                  <p>
                    To request the complete deletion of any data we might have stored on our servers (including both Meta and Google associated data), please email us directly at <a href="mailto:privacy@clipers.xyz" className="text-accent hover:underline">privacy@clipers.xyz</a> with the subject "Data Deletion Request". We will process your request within 7 business days.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">7. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or wish to submit a data deletion request, please contact us at: <a href="mailto:privacy@clipers.xyz" className="text-accent hover:underline">privacy@clipers.xyz</a>.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
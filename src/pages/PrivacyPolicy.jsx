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
          <p className="text-muted mb-8">Last updated: August 16, 2025</p>
          
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
                When you use our services, we may collect information such as your email address, username, and profile information if you choose to authenticate using third-party services like Google. 
                We also temporarily process video URLs and content you submit to generate AI-ranked clips.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">3. Third-Party API Services</h2>
              <p>
                ClipRank's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer" className="text-accent hover:underline">Google API Services User Data Policy</a>, including the Limited Use requirements.
              </p>
              <p className="mt-4">
                Specifically regarding our supported platforms:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>We use YouTube API Services to authenticate users and fetch videos. By using our service, you are agreeing to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer" className="text-accent hover:underline">YouTube Terms of Service</a>. Users can revoke access via the <a href="https://security.google.com/settings/security/permissions" target="_blank" rel="noreferrer" className="text-accent hover:underline">Google Security Settings page</a>.</li>
                <li>We use Instagram and Facebook Graph APIs to fetch video URLs and metadata. By using these features, you agree to be bound by the <a href="https://help.instagram.com/581066165581870" target="_blank" rel="noreferrer" className="text-accent hover:underline">Instagram Terms of Use</a> and <a href="https://www.facebook.com/terms.php" target="_blank" rel="noreferrer" className="text-accent hover:underline">Facebook Terms of Service</a>.</li>
                <li>We only use your data to perform the core functions of the application (e.g., retrieving video information to generate clips). We do not sell or share this data with third parties for advertising or any other unapproved purposes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">4. How We Use Your Data</h2>
              <p>
                We use your information strictly to provide, maintain, and improve our services. We do not sell your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">5. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy, please contact us at: <a href="mailto:privacy@cliprank.app" className="text-accent hover:underline">privacy@cliprank.app</a>.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

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
              <ul className="list-disc pl-6 mt-4 space-y-4">
                <li>
                  <strong>Google & YouTube:</strong> ClipRank's use and transfer of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer" className="text-accent hover:underline">Google API Services User Data Policy</a>, including the Limited Use requirements. By connecting YouTube, you agree to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer" className="text-accent hover:underline">YouTube Terms of Service</a>. You can revoke this access at any time via the <a href="https://security.google.com/settings/security/permissions" target="_blank" rel="noreferrer" className="text-accent hover:underline">Google Security Settings page</a>.
                </li>
                <li>
                  <strong>Meta (Facebook & Instagram):</strong> We use Meta Platform APIs to authenticate users and fetch public video URLs/metadata necessary for clip generation. By using these features, you agree to the <a href="https://help.instagram.com/581066165581870" target="_blank" rel="noreferrer" className="text-accent hover:underline">Instagram Terms of Use</a>, <a href="https://www.facebook.com/terms.php" target="_blank" rel="noreferrer" className="text-accent hover:underline">Facebook Terms of Service</a>, and the Meta Platform Terms. Data retrieved from Meta is used strictly for the core function of the application and is never sold to third parties or used for advertising.
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
              <h2 className="text-2xl font-bold text-primary mb-4">5. Data Deletion Instructions</h2>
              <p>
                In compliance with Meta Platform rules and privacy regulations, you have the right to request the deletion of your personal data at any time. If you wish to delete your data or remove our app's access to your Facebook/Instagram account, you can do so by following these steps:
              </p>
              <ol className="list-decimal pl-6 mt-2 space-y-2">
                <li>Go to your Facebook profile and click on <strong>Settings &amp; Privacy</strong> &gt; <strong>Settings</strong>.</li>
                <li>Navigate to <strong>Apps and Websites</strong>.</li>
                <li>Find <strong>ClipRank</strong> in the list of active apps, click "Remove", and confirm.</li>
                <li>To request complete deletion of any data we might have stored, please email us directly at <a href="mailto:privacy@cliprank.app" className="text-accent hover:underline">privacy@cliprank.app</a> with the subject "Data Deletion Request". We will process your request within 7 business days.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">6. Contact Us</h2>
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

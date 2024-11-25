import { useState } from 'react';
import UpdatesSection from './UpdatesSection';
import toast, { Toaster } from 'react-hot-toast';
import { useAdminStore } from '../store/adminStore';
import { Sun, Moon } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { WaitlistEmailData } from '../types';

// Initialize EmailJS
emailjs.init(import.meta.env.VITE_EMAIL_PUBLIC_KEY);

export default function LandingPage() {
  const { isDark, toggleTheme } = useAdminStore();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendWelcomeEmail = async (userEmail: string) => {
    try {
      const templateParams = {
        to_email: userEmail,
        from_name: "TagFlow Team",
        to_name: userEmail.split('@')[0],
        subject: "Welcome to TagFlow!",
        message: `
          Thank you for joining our waitlist! 
          
          We're excited to have you on board and will keep you updated on our progress.
          You'll be among the first to know when we launch.
          
          Feel free to check our website for regular updates and leave comments on our posts.
        `,
        website_url: window.location.origin,
        user_email: userEmail
      };

      console.log('Sending welcome email with params:', templateParams);

      const response = await emailjs.send(
        import.meta.env.VITE_EMAIL_SERVICE_ID,
        import.meta.env.VITE_WELCOME_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        console.log('Welcome email sent successfully to:', userEmail);
        return true;
      }
      throw new Error(`Failed to send welcome email: ${response.text}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  };

  const handleJoinWaitlist = async (emailInput: string) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const trimmedEmail = emailInput.trim();

      if (!trimmedEmail) {
        toast.error('Please enter your email address');
        return;
      }

      if (!validateEmail(trimmedEmail)) {
        toast.error('Please enter a valid email address');
        return;
      }

      const waitlistData = localStorage.getItem('waitlist');
      const waitlist: WaitlistEmailData[] = waitlistData ? JSON.parse(waitlistData) : [];

      if (waitlist.some(item => 
        typeof item === 'string' ? item === trimmedEmail : item.email === trimmedEmail
      )) {
        toast.error('You are already on the waitlist!');
        return;
      }
      
      const newWaitlistItem: WaitlistEmailData = {
        email: trimmedEmail,
        joinedAt: new Date().toISOString(),
        feedback: ''
      };
      
      const updatedWaitlist = [...waitlist, newWaitlistItem];
      localStorage.setItem('waitlist', JSON.stringify(updatedWaitlist));
      
      const emailSent = await sendWelcomeEmail(trimmedEmail);
      
      if (emailSent) {
        toast.success('Successfully joined the waitlist! Check your email for confirmation.');
      } else {
        toast.success('Successfully joined the waitlist!');
        toast.error('Failed to send welcome email');
      }
      
      setEmail('');
    } catch (error) {
      console.error('Error joining waitlist:', error);
      toast.error('Failed to join waitlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <Toaster position="top-right" />
      
      {/* Theme Toggle Button with animation */}
      <div className="fixed top-4 right-4 z-50 animate-fadeIn">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transform hover:scale-110 transition-all duration-300 ${
            isDark 
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
              : 'bg-white text-gray-900 hover:bg-gray-100'
          } shadow-lg`}
          aria-label="Toggle theme"
        >
          {isDark ? 
            <Sun className="h-6 w-6 animate-spin-slow" /> : 
            <Moon className="h-6 w-6 animate-float" />
          }
        </button>
      </div>
      
      {/* Hero Section with animations */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center animate-slideIn">
            <h1 className={`text-4xl font-extrabold ${
              isDark ? 'text-white' : 'text-gray-900'
            } sm:text-5xl sm:tracking-tight lg:text-6xl transition-colors duration-300`}>
              Welcome to TagFlow
            </h1>
            <p className={`mt-4 text-xl ${
              isDark ? 'text-gray-300' : 'text-gray-500'
            } transition-colors duration-300`}>
              Join our waitlist to be the first to know when we launch!
            </p>
            
            {/* Animated Waitlist Form */}
            <div className="mt-8 flex justify-center animate-fadeIn">
              <div className="inline-flex rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`px-5 py-3 border border-transparent text-base font-medium rounded-l-md 
                    ${isDark 
                      ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-300'
                    } transition-colors duration-300 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleJoinWaitlist(email);
                    }
                  }}
                />
                <button
                  onClick={() => handleJoinWaitlist(email)}
                  disabled={isSubmitting}
                  className={`px-5 py-3 border border-transparent text-base font-medium rounded-r-md text-white 
                    ${isDark 
                      ? 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400' 
                      : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300'
                    } transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Joining...
                    </span>
                  ) : (
                    'Join Waitlist'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Updates Section with animation */}
      <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} animate-fadeIn`}>
        <UpdatesSection />
      </div>
    </div>
  );
}
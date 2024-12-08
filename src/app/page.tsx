'use client';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    };

    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(reveal => observer.observe(reveal));

    return () => observer.disconnect();
  }, []);

  const handleGetStarted = () => {
    window.location.href = '/auth/signup';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
            alt="Mentorship"
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-up [--animation-delay:200ms]">
            Unlock Your Full Potential with Expert Mentorship
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-up [--animation-delay:400ms] max-w-3xl mx-auto">
            Connect with industry-leading mentors who've walked the path you aspire to take. Get personalized guidance, actionable insights, and the support you need to accelerate your career growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up [--animation-delay:600ms]">
            <button 
              onClick={handleGetStarted}
              className="group relative px-8 py-4 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl glow-on-hover"
            >
              <span className="relative z-10">Get Started Now</span>
            </button>
            <Link 
              href="/mentors"
              className="px-8 py-4 font-bold text-white border-2 border-white/30 hover:border-white/60 rounded-full glass-effect transition-all duration-300 hover:bg-white/10"
            >
              Browse Mentors
            </Link>
          </div>
          <div className="mt-12 flex justify-center gap-8 animate-fade-up [--animation-delay:800ms]">
            <div className="text-center animate-float [--animation-delay:0ms]">
              <div className="text-3xl font-bold text-blue-400">500+</div>
              <div className="text-gray-400">Expert Mentors</div>
            </div>
            <div className="text-center animate-float [--animation-delay:200ms]">
              <div className="text-3xl font-bold text-blue-400">10k+</div>
              <div className="text-gray-400">Success Stories</div>
            </div>
            <div className="text-center animate-float [--animation-delay:400ms]">
              <div className="text-3xl font-bold text-blue-400">95%</div>
              <div className="text-gray-400">Satisfaction Rate</div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 bg-grid relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 reveal">
          <h2 className="text-4xl font-bold text-center mb-16 text-gradient">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="card-gradient p-8 rounded-2xl card-shadow-hover hover-lift">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-soft">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Expert Mentors</h3>
              <p className="text-gray-600 text-center">Connect with verified industry professionals who are passionate about sharing their knowledge</p>
            </div>
            <div className="card-gradient p-8 rounded-2xl card-shadow-hover hover-lift [--animation-delay:200ms]">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-soft">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Personalized Matching</h3>
              <p className="text-gray-600 text-center">Our smart algorithm ensures you find the perfect mentor based on your goals and interests</p>
            </div>
            <div className="card-gradient p-8 rounded-2xl card-shadow-hover hover-lift [--animation-delay:400ms]">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-soft">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Fast Progress</h3>
              <p className="text-gray-600 text-center">Accelerate your career growth with structured mentorship programs and regular feedback</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-dots relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 reveal">
          <h2 className="text-4xl font-bold text-center mb-16 text-gradient">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="group">
              <img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Mentorship process"
                className="rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-8">
              <div className="flex gap-4 hover:translate-x-2 transition-transform duration-300 card-gradient p-6 rounded-xl card-shadow-hover">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold animate-pulse-soft">1</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                  <p className="text-gray-600">Sign up and tell us about your goals, interests, and what you're looking to achieve</p>
                </div>
              </div>
              <div className="flex gap-4 hover:translate-x-2 transition-transform duration-300 card-gradient p-6 rounded-xl card-shadow-hover">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold animate-pulse-soft">2</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Browse Mentors</h3>
                  <p className="text-gray-600">Explore our diverse pool of mentors and find those who align with your goals</p>
                </div>
              </div>
              <div className="flex gap-4 hover:translate-x-2 transition-transform duration-300 card-gradient p-6 rounded-xl card-shadow-hover">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold animate-pulse-soft">3</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Connect and Grow</h3>
                  <p className="text-gray-600">Schedule sessions, set goals, and start your journey towards success</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 bg-grid relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 reveal">
          <h2 className="text-4xl font-bold text-center mb-16 text-gradient">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-gradient p-8 rounded-2xl card-shadow-hover hover-lift">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-blue-500 ring-offset-2"
                />
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-600">Software Developer</p>
                </div>
              </div>
              <p className="text-gray-600">"Finding a mentor here completely changed my career trajectory. The guidance I received was invaluable."</p>
            </div>
            <div className="card-gradient p-8 rounded-2xl card-shadow-hover hover-lift [--animation-delay:200ms]">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-blue-500 ring-offset-2"
                />
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-gray-600">Product Manager</p>
                </div>
              </div>
              <p className="text-gray-600">"The mentorship I received helped me transition into product management smoothly. Highly recommended!"</p>
            </div>
            <div className="card-gradient p-8 rounded-2xl card-shadow-hover hover-lift [--animation-delay:400ms]">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-blue-500 ring-offset-2"
                />
                <div>
                  <h4 className="font-semibold">Emily Rodriguez</h4>
                  <p className="text-gray-600">UX Designer</p>
                </div>
              </div>
              <p className="text-gray-600">"The platform made it easy to find a mentor who understood my goals and helped me achieve them."</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 reveal">
          <h2 className="text-4xl font-bold text-white mb-8">Ready to Start Your Journey?</h2>
          <p className="text-xl text-white/90 mb-8">Join thousands of professionals who have already transformed their careers through mentorship</p>
          <button 
            onClick={handleGetStarted}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-blue-600 bg-white rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl glow-on-hover"
          >
            <span className="relative z-10">Find Your Mentor Today</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 py-16 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="reveal">
              <h3 className="text-xl font-bold mb-4">MentorMatch</h3>
              <p className="text-gray-400 mb-4">Connecting ambitious professionals with experienced mentors to accelerate career growth.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="reveal [--animation-delay:200ms]">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">About Us</Link></li>
                <li><Link href="/mentors" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Find a Mentor</Link></li>
                <li><Link href="/auth/signup" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Become a Mentor</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Blog</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="reveal [--animation-delay:400ms]">
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">FAQ</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Support</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="reveal [--animation-delay:600ms]">
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">
                  <span className="block">Email:</span>
                  <a href="mailto:contact@mentormatch.com" className="hover:text-white transition-colors duration-300">contact@mentormatch.com</a>
                </li>
                <li className="text-gray-400">
                  <span className="block">Phone:</span>
                  <a href="tel:+1234567890" className="hover:text-white transition-colors duration-300">+1 (234) 567-890</a>
                </li>
                <li className="text-gray-400">
                  <span className="block">Address:</span>
                  <address className="not-italic">
                    123 Mentorship Street<br />
                    San Francisco, CA 94105
                  </address>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} MentorMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

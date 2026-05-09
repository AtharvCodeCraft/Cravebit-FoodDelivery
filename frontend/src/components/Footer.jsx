import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Utensils } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[var(--card)] border-t border-[var(--border)] pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600 tracking-tight mb-4">
              <Utensils className="w-6 h-6 text-orange-500" />
              CraveBite
            </Link>
            <p className="text-[var(--muted-foreground)] mb-6 text-sm leading-relaxed">
              Delivering happiness, one meal at a time. The fastest and most reliable food delivery platform in the city.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] hover:bg-orange-500 hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] hover:bg-orange-500 hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] hover:bg-orange-500 hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-[var(--foreground)]">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-[var(--muted-foreground)] hover:text-orange-500 transition-colors text-sm">About Us</Link></li>
              <li><Link to="/careers" className="text-[var(--muted-foreground)] hover:text-orange-500 transition-colors text-sm">Careers</Link></li>
              <li><Link to="/blog" className="text-[var(--muted-foreground)] hover:text-orange-500 transition-colors text-sm">Blog</Link></li>
              <li><Link to="/contact" className="text-[var(--muted-foreground)] hover:text-orange-500 transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-[var(--foreground)]">For Users</h3>
            <ul className="space-y-3">
              <li><Link to="/login" className="text-[var(--muted-foreground)] hover:text-orange-500 transition-colors text-sm">Login</Link></li>
              <li><Link to="/register" className="text-[var(--muted-foreground)] hover:text-orange-500 transition-colors text-sm">Sign Up</Link></li>
              <li><Link to="/faq" className="text-[var(--muted-foreground)] hover:text-orange-500 transition-colors text-sm">FAQs</Link></li>
              <li><Link to="/support" className="text-[var(--muted-foreground)] hover:text-orange-500 transition-colors text-sm">Help & Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-[var(--foreground)]">Contact Us</h3>
            <ul className="space-y-3 text-[var(--muted-foreground)] text-sm">
              <li>123 Food Street, Culinary District</li>
              <li>Mumbai, Maharashtra 400001</li>
              <li className="pt-2">Email: support@cravebite.com</li>
              <li>Phone: +91 98765 43210</li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--muted-foreground)] text-sm">
            © {new Date().getFullYear()} CraveBite. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-[var(--muted-foreground)] hover:text-orange-500 transition-colors text-sm">Privacy Policy</Link>
            <Link to="/terms" className="text-[var(--muted-foreground)] hover:text-orange-500 transition-colors text-sm">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

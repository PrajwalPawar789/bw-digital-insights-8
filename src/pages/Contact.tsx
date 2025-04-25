
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Clock, 
  Send, 
  CheckCircle,
  ChevronDown
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState({
    form: false,
    info: false,
    map: false,
    faq: false
  });

  const faqs = [
    {
      question: "What services does InsightsBW offer?",
      answer: "InsightsBW provides business intelligence consulting, market research, data analytics, strategic advisory services, and thought leadership content through our magazine and research publications."
    },
    {
      question: "How quickly can I expect a response to my inquiry?",
      answer: "We aim to respond to all inquiries within 24-48 business hours. For urgent matters, please indicate this in your message or contact us directly by phone."
    },
    {
      question: "Do you offer services internationally?",
      answer: "Yes, InsightsBW works with clients globally. Our team has experience across various markets and can provide localized insights for different regions."
    },
    {
      question: "How can I subscribe to your magazine or newsletters?",
      answer: "You can subscribe to our publications through the Magazine section of our website. We offer both free and premium subscription options."
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    setFormStatus('submitting');
    
    setTimeout(() => {
      setFormStatus('success');
      toast({
        title: "Message sent!",
        description: "Thank you for your message. We will get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset status after a delay
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1500);
  };

  const toggleFaq = (index: number) => {
    setActiveSection(activeSection === `faq-${index}` ? null : `faq-${index}`);
  };

  useEffect(() => {
    // Set up intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setIsVisible(prev => ({ ...prev, [sectionId]: true }));
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe all sections
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-insightBlack text-white py-20">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1551038247-3d9af20df552?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Get in Touch</h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-200">
            Have a question or want to work with us? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <section id="form" className={`${isVisible.form ? 'animate-fade-in' : 'opacity-0'}`} style={{transitionDelay: '200ms'}}>
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-2xl font-bold text-insightBlack mb-6 flex items-center">
                <Send className="h-5 w-5 text-insightRed mr-2" /> Send Us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name <span className="text-insightRed">*</span>
                    </label>
                    <Input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name" 
                      className="w-full bg-gray-50 focus:bg-white transition-colors"
                      required 
                      disabled={formStatus === 'submitting' || formStatus === 'success'}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-insightRed">*</span>
                    </label>
                    <Input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com" 
                      className="w-full bg-gray-50 focus:bg-white transition-colors"
                      required 
                      disabled={formStatus === 'submitting' || formStatus === 'success'}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone (Optional)
                    </label>
                    <Input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(123) 456-7890" 
                      className="w-full bg-gray-50 focus:bg-white transition-colors"
                      disabled={formStatus === 'submitting' || formStatus === 'success'}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-gray-50 focus:bg-white border border-gray-200 rounded-md h-10 px-3"
                      disabled={formStatus === 'submitting' || formStatus === 'success'}
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Partnership">Partnership Opportunity</option>
                      <option value="Magazine">Magazine Subscription</option>
                      <option value="Services">Professional Services</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-insightRed">*</span>
                  </label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?" 
                    className="w-full bg-gray-50 focus:bg-white transition-colors"
                    required 
                    rows={5}
                    disabled={formStatus === 'submitting' || formStatus === 'success'}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className={`w-full transition-all ${
                    formStatus === 'success' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-insightRed hover:bg-insightBlack'
                  }`}
                  disabled={formStatus === 'submitting' || formStatus === 'success'}
                >
                  {formStatus === 'idle' && 'Send Message'}
                  {formStatus === 'submitting' && (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                      Sending...
                    </>
                  )}
                  {formStatus === 'success' && (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" /> Message Sent
                    </>
                  )}
                </Button>
              </form>
            </div>
          </section>
          
          {/* Contact Info */}
          <section id="info" className={`${isVisible.info ? 'animate-fade-in' : 'opacity-0'}`} style={{transitionDelay: '400ms'}}>
            <div className="bg-gray-50 p-8 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-bold text-insightBlack mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start hover:bg-gray-100 p-3 rounded-md transition-colors">
                  <Mail className="text-insightRed h-6 w-6 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-insightBlack">Email</h3>
                    <p className="text-gray-600 mb-1">For general inquiries:</p>
                    <a href="mailto:info@insightsbw.com" className="text-insightRed hover:underline">info@insightsbw.com</a>
                    <p className="text-gray-600 mt-2 mb-1">For media relations:</p>
                    <a href="mailto:media@insightsbw.com" className="text-insightRed hover:underline">media@insightsbw.com</a>
                  </div>
                </div>
                
                <div className="flex items-start hover:bg-gray-100 p-3 rounded-md transition-colors">
                  <Phone className="text-insightRed h-6 w-6 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-insightBlack">Phone</h3>
                    <p className="text-gray-600 mb-1">Main Office:</p>
                    <p className="text-insightBlack font-medium">(555) 123-4567</p>
                    <p className="text-gray-600 mt-2 mb-1">Customer Support:</p>
                    <p className="text-insightBlack font-medium">(555) 765-4321</p>
                  </div>
                </div>
                
                <div className="flex items-start hover:bg-gray-100 p-3 rounded-md transition-colors">
                  <MapPin className="text-insightRed h-6 w-6 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-insightBlack">Address</h3>
                    <p className="text-gray-600 mb-1">Global Headquarters:</p>
                    <p className="text-insightBlack">123 Innovation Drive</p>
                    <p className="text-insightBlack">Tech City, ST 12345</p>
                    <p className="text-insightBlack">United States</p>
                  </div>
                </div>
                
                <div className="flex items-start hover:bg-gray-100 p-3 rounded-md transition-colors">
                  <Clock className="text-insightRed h-6 w-6 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-insightBlack">Business Hours</h3>
                    <p className="text-gray-600 mb-1">Monday - Friday:</p>
                    <p className="text-insightBlack">9:00 AM - 6:00 PM EST</p>
                    <p className="text-gray-500 text-sm mt-2">Closed on weekends and major holidays</p>
                  </div>
                </div>
                
                <div className="flex items-start hover:bg-gray-100 p-3 rounded-md transition-colors">
                  <Globe className="text-insightRed h-6 w-6 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-insightBlack">Social Media</h3>
                    <div className="flex space-x-3 mt-2">
                      <a href="#" className="text-gray-600 hover:text-insightRed transition-colors">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                        </svg>
                      </a>
                      <a href="#" className="text-gray-600 hover:text-insightRed transition-colors">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                        </svg>
                      </a>
                      <a href="#" className="text-gray-600 hover:text-insightRed transition-colors">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                        </svg>
                      </a>
                      <a href="#" className="text-gray-600 hover:text-insightRed transition-colors">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        {/* Google Maps Embed */}
        <section id="map" className={`py-12 ${isVisible.map ? 'animate-fade-in' : 'opacity-0'}`} style={{transitionDelay: '600ms'}}>
          <h2 className="text-2xl font-bold text-insightBlack mb-6 text-center">Find Us</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-96">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095912456!2d-74.0066351842904!3d40.71275807933106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a1635a483dd%3A0x8e454c34e23e297!2sOne%20World%20Trade%20Center!5e0!3m2!1sen!2sus!4v1617745309772!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              loading="lazy"
              title="InsightsBW Location"
            ></iframe>
          </div>
        </section>
        
        {/* FAQs Section */}
        <section id="faq" className={`py-12 ${isVisible.faq ? 'animate-fade-in' : 'opacity-0'}`} style={{transitionDelay: '800ms'}}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-insightBlack mb-6 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <button
                    className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-medium text-insightBlack">{faq.question}</span>
                    <ChevronDown 
                      className={`h-5 w-5 text-insightRed transition-transform ${
                        activeSection === `faq-${index}` ? 'transform rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  <div 
                    className={`px-6 pb-4 transition-all duration-300 ease-in-out ${
                      activeSection === `faq-${index}` ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;


import { useEffect, useState } from 'react';
import { teamData } from '../data/teamData';
import { 
  Users, 
  Target, 
  Award, 
  TrendingUp, 
  Globe, 
  Briefcase, 
  Calendar, 
  Mail 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  const [activeTeamMember, setActiveTeamMember] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState({
    mission: false,
    vision: false,
    values: false,
    team: false,
    history: false
  });

  // Timeline data for company history
  const timeline = [
    { year: 2015, title: "Company Founded", description: "InsightsBW was founded with a vision to transform business intelligence." },
    { year: 2017, title: "Global Expansion", description: "Opened offices in Europe and Asia, expanding our international presence." },
    { year: 2019, title: "Technology Innovation", description: "Launched our proprietary analytics platform revolutionizing data insights." },
    { year: 2021, title: "Industry Recognition", description: "Received multiple awards for thought leadership and innovation." },
    { year: 2023, title: "Strategic Partnerships", description: "Formed key partnerships with Fortune 500 companies." },
    { year: 2025, title: "Sustainability Initiative", description: "Committed to carbon neutrality and sustainable business practices." }
  ];

  // Company values
  const values = [
    { icon: <Target className="h-6 w-6 text-insightRed" />, title: "Innovation", description: "We challenge conventions and embrace change to drive progress." },
    { icon: <Award className="h-6 w-6 text-insightRed" />, title: "Excellence", description: "We are committed to the highest standards in all our work." },
    { icon: <TrendingUp className="h-6 w-6 text-insightRed" />, title: "Growth", description: "We foster continuous learning and development." },
    { icon: <Globe className="h-6 w-6 text-insightRed" />, title: "Integrity", description: "We operate with honesty, transparency, and ethical conduct." }
  ];

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
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-gray-900 to-insightBlack text-white py-20">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About InsightsBW</h1>
            <p className="max-w-3xl mx-auto text-lg text-gray-200 mb-8">
              Transforming complex business data into actionable intelligence for forward-thinking leaders.
            </p>
            <Button className="bg-insightRed hover:bg-red-700 text-white">
              <Link to="/contact">Connect With Us</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mission and Vision Section with Animation */}
      <section id="mission" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid md:grid-cols-2 gap-12 ${isVisible.mission ? 'animate-fade-in' : 'opacity-0'}`} style={{transitionDelay: '200ms'}}>
            <div className="bg-white rounded-lg shadow-xl p-8 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="inline-block p-3 bg-red-100 rounded-lg mb-4">
                <Target className="h-8 w-8 text-insightRed" />
              </div>
              <h2 className="text-2xl font-bold text-insightBlack mb-4">Our Mission</h2>
              <p className="text-gray-600">
                At InsightsBW, we are dedicated to providing cutting-edge insights and thought leadership 
                in the technology and business landscape. Our mission is to empower leaders with actionable 
                intelligence, innovative perspectives, and in-depth analysis that drives strategic decision-making.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-xl p-8 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="inline-block p-3 bg-red-100 rounded-lg mb-4">
                <TrendingUp className="h-8 w-8 text-insightRed" />
              </div>
              <h2 className="text-2xl font-bold text-insightBlack mb-4">Our Vision</h2>
              <p className="text-gray-600">
                We envision a world where business leaders are equipped with transformative knowledge that 
                enables them to navigate complexity, foster innovation, and create sustainable growth. 
                Through our comprehensive research, interviews, and expert insights, we aim to be the 
                premier platform for forward-thinking leaders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="values" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-insightBlack mb-4">Our Core Values</h2>
            <p className="max-w-3xl mx-auto text-gray-600">
              These principles guide everything we do at InsightsBW.
            </p>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${isVisible.values ? 'animate-fade-in' : 'opacity-0'}`} style={{transitionDelay: '400ms'}}>
            {values.map((value, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
                style={{animationDelay: `${index * 100}ms`}}
              >
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-red-50 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-insightBlack mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company History Timeline */}
      <section id="history" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-insightBlack mb-4">Our Journey</h2>
            <p className="max-w-3xl mx-auto text-gray-600">
              Tracing our path from startup to industry leader.
            </p>
          </div>
          
          <div className={`relative ${isVisible.history ? 'animate-fade-in' : 'opacity-0'}`} style={{transitionDelay: '600ms'}}>
            {/* Timeline center line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>
            
            {/* Timeline events */}
            <div className="space-y-12">
              {timeline.map((event, index) => (
                <div 
                  key={index} 
                  className={`relative flex ${index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                >
                  <div className="flex items-center justify-center w-full md:w-1/2">
                    <div className="w-full md:w-3/4 lg:w-2/3 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-insightRed rounded-md mb-2">
                        {event.year}
                      </span>
                      <h3 className="text-xl font-bold text-insightBlack mb-2">{event.title}</h3>
                      <p className="text-gray-600">{event.description}</p>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                    <div className="h-6 w-6 rounded-full bg-insightRed z-10"></div>
                  </div>
                  
                  <div className="md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section with Interactivity */}
      <section id="team" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-insightRed mr-2" />
              <h2 className="text-3xl font-bold text-insightBlack">Our Leadership Team</h2>
            </div>
            <p className="max-w-3xl mx-auto text-gray-600">
              Meet the experts driving our vision and innovation.
            </p>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${isVisible.team ? 'animate-fade-in' : 'opacity-0'}`} style={{transitionDelay: '800ms'}}>
            {teamData.map((member) => (
              <div 
                key={member.id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 ${activeTeamMember === member.id ? 'ring-2 ring-insightRed' : ''}`}
                onMouseEnter={() => setActiveTeamMember(member.id)}
                onMouseLeave={() => setActiveTeamMember(null)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className={`w-full h-full object-cover object-center transition-transform duration-500 ${activeTeamMember === member.id ? 'scale-110' : ''}`}
                  />
                  {activeTeamMember === member.id && (
                    <div className="absolute inset-0 bg-gradient-to-t from-insightBlack to-transparent opacity-70 flex items-end p-4">
                      <div className="text-white space-y-1">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          <p className="text-sm">10+ years experience</p>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          <p className="text-sm">{member.name.toLowerCase().replace(' ', '.')}@insightsbw.com</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-insightBlack mb-1">{member.name}</h3>
                  <p className="text-insightRed font-medium mb-3">{member.title}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-insightBlack text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="max-w-3xl mx-auto text-gray-300 mb-8">
            Discover how InsightsBW can help your organization navigate complexity and drive innovation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-insightRed hover:bg-red-700 text-white">
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-insightBlack">
              <Link to="/magazine">Explore Our Magazine</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

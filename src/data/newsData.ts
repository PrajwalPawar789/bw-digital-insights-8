
export interface NewsItem {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  isFeatured: boolean;
}

export const newsData: NewsItem[] = [
  {
    id: 1,
    title: "The Future of Digital Marketing in 2025",
    category: "Business",
    excerpt: "Experts predict AI-driven personalization will dominate digital marketing strategies in the coming years.",
    content: "As we approach 2025, the digital marketing landscape continues to evolve at an unprecedented pace. Industry leaders are increasingly focused on leveraging artificial intelligence to create hyper-personalized customer experiences. According to recent studies, companies that implement AI-driven marketing strategies see a 40% increase in customer engagement and a 25% boost in conversion rates. The future of digital marketing will be characterized by predictive analytics, voice search optimization, and immersive AR/VR experiences.",
    author: "Jane Smith",
    date: "2025-04-01",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRpZ2l0YWwlMjBtYXJrZXRpbmd8ZW58MHx8MHx8fDA%3D",
    isFeatured: true
  },
  {
    id: 2,
    title: "Tech Giants Announce Collaboration on Quantum Computing",
    category: "Technology",
    excerpt: "Leading tech companies form alliance to accelerate quantum computing development for business applications.",
    content: "In a groundbreaking announcement, five of the world's largest technology companies have formed a strategic alliance to advance quantum computing research and applications. The collaboration aims to overcome current limitations in quantum technology and develop practical business solutions within the next decade. Industry analysts suggest this partnership could accelerate quantum computing development by at least five years, potentially revolutionizing fields from cryptography to drug discovery.",
    author: "Michael Chen",
    date: "2025-03-28",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVjaHxlbnwwfHwwfHx8MA%3D%3D",
    isFeatured: true
  },
  {
    id: 3,
    title: "Sustainable Business Practices Drive Profit Growth",
    category: "Business",
    excerpt: "New study reveals companies with strong ESG commitments outperform competitors financially.",
    content: "A comprehensive five-year study has confirmed that businesses implementing robust environmental, social, and governance (ESG) practices consistently outperform their competitors financially. The research, which analyzed over 500 global companies across diverse sectors, found that organizations with strong sustainability commitments achieved 18% higher return on investment compared to industry averages. This correlation between sustainability and financial performance has accelerated investor interest in ESG-focused businesses.",
    author: "Sarah Johnson",
    date: "2025-03-25",
    image: "https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JlZW4lMjBidXNpbmVzc3xlbnwwfHwwfHx8MA%3D%3D",
    isFeatured: false
  },
  {
    id: 4,
    title: "Global E-commerce Growth Reaches Double Digits",
    category: "Business",
    excerpt: "Online retail continues explosive expansion as consumer habits permanently shift toward digital shopping.",
    content: "The global e-commerce sector has maintained double-digit growth for the fifth consecutive year, according to new market analysis. Post-pandemic consumer behavior changes have become permanent, with digital shopping now representing over 35% of total retail sales worldwide. Mobile commerce leads this expansion, accounting for nearly 70% of all online transactions. Retailers with omnichannel strategies that seamlessly integrate online and offline experiences report the strongest performance metrics.",
    author: "David Williams",
    date: "2025-03-22",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGVjb21tZXJjZXxlbnwwfHwwfHx8MA%3D%3D",
    isFeatured: false
  },
  {
    id: 5,
    title: "AI Revolutionizes Healthcare Diagnosis",
    category: "Technology",
    excerpt: "New artificial intelligence system demonstrates superior accuracy in detecting early-stage diseases.",
    content: "A revolutionary artificial intelligence system has demonstrated unprecedented accuracy in detecting early-stage diseases, potentially transforming medical diagnostics. In clinical trials, the AI diagnostic tool achieved a 94% accuracy rate in identifying multiple conditions from medical imaging—significantly outperforming experienced human radiologists. The system, which can analyze thousands of images in minutes, is expected to receive regulatory approval by year-end. Healthcare providers implementing the technology could drastically reduce diagnostic delays while improving treatment outcomes.",
    author: "Robert Kim",
    date: "2025-03-20",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhbHRoY2FyZSUyMHRlY2h8ZW58MHx8MHx8fDA%3D",
    isFeatured: true
  },
  {
    id: 6,
    title: "Remote Work Drives Corporate Real Estate Revolution",
    category: "Business",
    excerpt: "Companies reimagine office spaces as collaborative hubs while embracing permanent hybrid work models.",
    content: "The corporate real estate sector is undergoing a fundamental transformation as businesses permanently adopt hybrid work models. Major companies are downsizing traditional office footprints by up to 40% while redesigning remaining spaces as collaboration hubs. This shift has sparked innovation in workplace technology and office design, with a focus on creating environments that facilitate teamwork, creativity, and organizational culture. Real estate developers are rapidly adapting to this new paradigm by converting former office buildings into mixed-use spaces.",
    author: "Jennifer Lopez",
    date: "2025-03-18",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVtb3RlJTIwd29ya3xlbnwwfHwwfHx8MA%3D%3D",
    isFeatured: false
  },
  {
    id: 7,
    title: "Blockchain Adoption Accelerates in Finance",
    category: "Technology",
    excerpt: "Financial institutions implement blockchain solutions for faster, more secure transactions.",
    content: "Blockchain technology is experiencing widespread adoption in the financial sector, with over 70% of major institutions now implementing distributed ledger solutions. These implementations are reducing transaction processing times by up to 80% while significantly enhancing security and reducing operational costs. Central banks across 15 countries have launched pilot programs for blockchain-based digital currencies, signaling a major shift in the global financial infrastructure. Industry experts predict blockchain will become the standard for financial transactions within five years.",
    author: "Thomas Anderson",
    date: "2025-03-15",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmxvY2tjaGFpbnxlbnwwfHwwfHx8MA%3D%3D",
    isFeatured: true
  },
  {
    id: 8,
    title: "Startup Funding Reaches Historic Heights",
    category: "Business",
    excerpt: "Venture capital investments break records as innovation economy thrives post-pandemic.",
    content: "Global venture capital funding has reached unprecedented levels, with investments totaling $750 billion in the past 12 months—a 35% increase year-over-year. This surge in funding has been particularly pronounced in healthcare innovation, sustainable technology, and enterprise software sectors. Early-stage valuations have increased across all major markets, reflecting investor confidence in the innovation economy. The trend has also expanded geographically, with emerging markets in Southeast Asia and Africa seeing triple-digit growth in venture funding.",
    author: "Maria Garcia",
    date: "2025-03-12",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3RhcnR1cHxlbnwwfHwwfHx8MA%3D%3D",
    isFeatured: false
  },
  {
    id: 9,
    title: "5G Enables Next-Generation IoT Applications",
    category: "Technology",
    excerpt: "Widespread 5G deployment creates opportunity for revolutionary Internet of Things systems.",
    content: "The widespread deployment of 5G networks is enabling a new generation of Internet of Things (IoT) applications that were previously impossible due to connectivity limitations. With latency reduced to milliseconds and bandwidth increased tenfold, industrial IoT systems are achieving unprecedented efficiency gains across manufacturing, logistics, and energy sectors. Smart city implementations leveraging 5G-connected sensors have demonstrated 30% reductions in energy consumption and significant improvements in traffic management. Analysts predict the 5G IoT market will grow to $550 billion by 2028.",
    author: "James Wilson",
    date: "2025-03-10",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8NWd8ZW58MHx8MHx8fDA%3D",
    isFeatured: true
  },
  {
    id: 10,
    title: "Luxury Brands Embrace Digital Transformation",
    category: "Business",
    excerpt: "High-end retailers pivot to omnichannel strategies while maintaining exclusivity.",
    content: "Luxury retail brands are successfully navigating digital transformation while preserving their exclusive brand positioning. Leading luxury conglomerates have reported 45% growth in online sales following strategic digital initiatives that blend personalized virtual experiences with traditional high-touch service. Virtual showrooms using advanced augmented reality allow customers to experience products remotely with remarkable detail. Rather than diluting brand value, these digital approaches have expanded luxury markets to younger demographics and geographic regions previously underserved by physical retail.",
    author: "Elizabeth Taylor",
    date: "2025-03-08",
    image: "https://images.unsplash.com/photo-1493252712637-e9cb4681971f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bHV4dXJ5fGVufDB8fDB8fHww",
    isFeatured: false
  },
  {
    id: 11,
    title: "Cybersecurity Threats Evolve With AI",
    category: "Technology",
    excerpt: "Organizations face increasingly sophisticated attacks powered by artificial intelligence.",
    content: "Cybersecurity professionals are confronting a new generation of threats leveraging artificial intelligence to execute increasingly sophisticated attacks. These AI-powered threats can adapt to defensive measures in real-time and exploit vulnerabilities with minimal human direction. In response, leading security firms are developing defensive AI systems that can predict and counteract attacks before they succeed. The escalating sophistication of cyber threats has prompted a 60% increase in cybersecurity spending among Fortune 500 companies, with particular emphasis on machine learning security solutions.",
    author: "Daniel Lee",
    date: "2025-03-05",
    image: "https://images.unsplash.com/photo-1480160734175-e2209654c0c1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGN5YmVyc2VjdXJpdHl8ZW58MHx8MHx8fDA%3D",
    isFeatured: false
  },
  {
    id: 12,
    title: "Supply Chain Visibility Becomes Competitive Advantage",
    category: "Business",
    excerpt: "Companies investing in end-to-end supply chain transparency outperform competitors.",
    content: "End-to-end supply chain visibility has emerged as a crucial competitive advantage in the post-pandemic business landscape. Organizations implementing advanced tracking technologies and analytics throughout their supply networks can respond to disruptions 75% faster than competitors. This enhanced responsiveness has translated into measurable business outcomes, including 18% lower inventory costs and 23% fewer stockouts. Leading manufacturers are now providing customers with complete transparency into product sourcing, manufacturing conditions, and delivery timelines—a feature increasingly valued by conscious consumers.",
    author: "Patricia Rodriguez",
    date: "2025-03-02",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3VwcGx5JTIwY2hhaW58ZW58MHx8MHx8fDA%3D",
    isFeatured: false
  },
  {
    id: 13,
    title: "Climate Tech Investment Surge Continues",
    category: "Technology",
    excerpt: "Funding for climate technologies reaches new heights as sustainability becomes business priority.",
    content: "Investment in climate technologies has maintained exponential growth, with funding exceeding $250 billion over the past year—triple the amount from just three years ago. This surge reflects both the urgency of addressing climate challenges and the enormous market opportunity in sustainable solutions. Carbon capture and storage technologies have attracted particular interest, with breakthrough approaches demonstrating 80% cost reductions. Renewable energy storage solutions have also seen major advances, with new battery technologies extending capacity while reducing dependence on rare materials.",
    author: "Christopher Green",
    date: "2025-02-28",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xpbWF0ZXxlbnwwfHwwfHx8MA%3D%3D",
    isFeatured: true
  },
  {
    id: 14,
    title: "Digital Nomad Lifestyle Reshapes Global Workforce",
    category: "Trending",
    excerpt: "Remote work evolution creates new class of location-independent professionals.",
    content: "The global workforce is being transformed by the rise of digital nomads—professionals who leverage remote work policies to maintain careers while regularly changing geographical locations. This growing segment, now estimated at 35 million workers worldwide, is influencing everything from corporate talent strategies to visa policies and real estate markets. Countries including Portugal, Croatia, and Thailand have implemented special visa programs specifically targeting this high-value demographic. Companies embracing digital nomad-friendly policies report 28% improvements in talent retention and access to previously untapped talent pools.",
    author: "Michelle Robinson",
    date: "2025-02-25",
    image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlnaXRhbCUyMG5vbWFkfGVufDB8fDB8fHww",
    isFeatured: false
  },
  {
    id: 15,
    title: "Personalized Medicine Approaches Mainstream",
    category: "Trending",
    excerpt: "Genetic testing and AI analytics make individualized treatment plans increasingly accessible.",
    content: "Personalized medicine is rapidly transitioning from experimental approach to standard care protocol, with genetic testing and AI-powered analytics making individualized treatments increasingly accessible. Major health systems have reported 35% improvements in treatment efficacy when using personalized protocols based on genetic profiles and biomarker analysis. The cost of comprehensive genetic sequencing has fallen below $200, making it viable for routine clinical use. Pharmaceutical companies are responding by developing medications designed for specific genetic profiles, creating more effective treatments with fewer side effects.",
    author: "Jonathan Baker",
    date: "2025-02-22",
    image: "https://images.unsplash.com/photo-1579154392429-0e6b39421cf3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
    isFeatured: false
  },
  {
    id: 16,
    title: "Metaverse Evolves Beyond Gaming",
    category: "Trending",
    excerpt: "Virtual worlds gain traction for business applications and social experiences.",
    content: "The metaverse concept is evolving beyond its gaming origins to encompass business applications and social experiences with tangible value. Leading technology companies have invested over $50 billion in metaverse development, creating increasingly immersive virtual environments. Major retailers have launched virtual showrooms generating actual sales conversion rates 15% higher than traditional e-commerce. Educational institutions are utilizing metaverse environments for immersive learning experiences that improve information retention by 28% compared to traditional methods. As the technology matures, analysts predict the metaverse economy will reach $800 billion by 2030.",
    author: "Sophia Chen",
    date: "2025-02-20",
    image: "https://images.unsplash.com/photo-1634634198083-0578e3921212?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWV0YXZlcnNlfGVufDB8fDB8fHww",
    isFeatured: true
  }
];

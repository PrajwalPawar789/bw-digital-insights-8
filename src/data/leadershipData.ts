
export interface LeaderProfile {
  id: number;
  name: string;
  title: string;
  company: string;
  bio: string;
  image: string;
}

export interface LeadershipArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  type: 'philosophy' | 'interview' | 'feature';
  url?: string;
}

export const leaderProfiles: LeaderProfile[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Chief Information Officer",
    company: "Global Tech Innovations",
    bio: "Sarah Johnson is a pioneering technology executive with over 20 years of experience transforming enterprise IT operations. At Global Tech Innovations, she leads digital transformation initiatives that have revolutionized the company's operational efficiency and customer experience. Sarah is recognized for her expertise in AI implementation and secure cloud migration strategies.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2Zlc3Npb25hbCUyMHdvbWFufGVufDB8fDB8fHww"
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Chief Information Officer",
    company: "Nexus Financial Group",
    bio: "Michael Chen brings a unique blend of financial acumen and technological innovation to his role at Nexus Financial Group. His leadership has been instrumental in developing proprietary fintech solutions that have positioned the company as an industry leader. Michael previously held senior positions at major technology companies before transitioning to financial services.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2Zlc3Npb25hbCUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    title: "Chief Information Officer",
    company: "Healthcare Innovations",
    bio: "Elena Rodriguez is transforming healthcare delivery through strategic technology initiatives. Her focus on interoperable systems and patient data security has established new industry standards. Elena's background in both clinical practice and information technology gives her a comprehensive understanding of healthcare's unique challenges and opportunities.",
    image: "https://images.unsplash.com/photo-1605664041952-4a803269b2c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2Zlc3Npb25hbCUyMGxhdGluYXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 4,
    name: "David Williams",
    title: "Chief Information Officer",
    company: "Retail Evolution Corp",
    bio: "David Williams is leading the digital transformation of retail through innovative omnichannel strategies and data analytics. His implementation of AI-driven inventory management and personalized shopping experiences has set new benchmarks in the industry. David is a frequent speaker on retail technology and customer experience innovation.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZmVzc2lvbmFsJTIwbWFufGVufDB8fDB8fHww"
  },
  {
    id: 5,
    name: "Priya Sharma",
    title: "Chief Information Officer",
    company: "Global Manufacturing Solutions",
    bio: "Priya Sharma is revolutionizing manufacturing through Industry 4.0 implementations that connect smart factories and supply chains. Her expertise in IoT, robotics, and predictive analytics has delivered significant operational efficiencies and quality improvements. Priya is recognized for her ability to align technology investments with strategic business objectives.",
    image: "https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmVzc2lvbmFsJTIwaW5kaWFuJTIwd29tYW58ZW58MHx8MHx8fDA%3D"
  },
  {
    id: 6,
    name: "James Wilson",
    title: "Chief Information Officer",
    company: "Energy Innovations",
    bio: "James Wilson is leading digital transformation in the energy sector, implementing smart grid technologies and advanced analytics solutions. His initiatives have significantly improved operational efficiency while supporting sustainability goals. James brings extensive experience in both traditional and renewable energy technology integration.",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHByb2Zlc3Npb25hbCUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D"
  }
];

export const leadershipArticles: LeadershipArticle[] = [
  {
    id: 1,
    title: "Technology Leadership in Volatile Times",
    excerpt: "Strategies for CIOs navigating uncertainty while driving innovation and maintaining operational resilience.",
    content: "In today's rapidly changing business environment, technology leaders face unprecedented challenges. This article examines proven approaches for maintaining strategic focus amid volatility, with insights on prioritizing investments, building adaptive teams, and developing robust business continuity frameworks. Drawing on interviews with successful CIOs who navigated recent global disruptions, we present a blueprint for technology leadership that balances innovation with operational stability. Key topics include flexible architecture decisions, vendor management during uncertainty, and talent strategies for retaining critical skills during challenging periods.",
    author: "Sarah Johnson",
    date: "2025-03-15",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxlYWRlcnNoaXB8ZW58MHx8MHx8fDA%3D",
    type: "philosophy"
  },
  {
    id: 2,
    title: "Building Digital-First Organizations",
    excerpt: "How leading CIOs are restructuring teams and processes to create truly digital-native enterprises.",
    content: "The transition from traditional to digital-first business models requires fundamental changes in organizational structure, culture, and leadership approaches. This comprehensive analysis explores how successful CIOs are reimagining their functions to enable enterprise-wide digital transformation. Topics include evolving governance models, creating product-oriented technology teams, implementing agile methodologies at scale, and developing digital fluency across the organization. The article features case studies from multiple industries, highlighting both successful transformations and lessons learned from common challenges encountered during these complex organizational changes.",
    author: "Michael Chen",
    date: "2025-03-10",
    image: "https://images.unsplash.com/photo-1484156818044-c040038b0719?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8b3JnYW5pemF0aW9ufGVufDB8fDB8fHww",
    type: "philosophy"
  },
  {
    id: 3,
    title: "The Evolving CIO-CEO Relationship",
    excerpt: "As technology becomes central to business strategy, how the partnership between CIOs and CEOs is being redefined.",
    content: "The relationship between Chief Information Officers and Chief Executive Officers has undergone a profound transformation as technology has become inseparable from business strategy. This article examines how successful CIO-CEO partnerships are navigating this evolution, creating alignment between technology initiatives and strategic business objectives. Drawing on interviews with executive pairs from leading organizations, we explore communication strategies, collaborative decision-making frameworks, and approaches for managing the tension between innovation and risk management. The piece offers practical guidance for technology leaders seeking to strengthen their strategic influence and build productive relationships with their executive colleagues.",
    author: "Elena Rodriguez",
    date: "2025-03-05",
    image: "https://images.unsplash.com/photo-1454923634634-bd1614719a7b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2VvfGVufDB8fDB8fHww",
    type: "philosophy"
  },
  {
    id: 4,
    title: "Data as a Strategic Asset: The CIO's Guide",
    excerpt: "Frameworks for developing data governance, analytics capabilities, and a data-driven decision culture.",
    content: "While most organizations recognize data as a critical asset, few have successfully implemented the governance structures and analytical capabilities needed to deliver on this potential. This comprehensive guide explores how forward-thinking CIOs are building the technical foundations, organizational capabilities, and cultural elements required for data-driven transformation. Topics include modern data architecture approaches, balancing centralized and federated analytics models, developing data literacy across the enterprise, and ethical considerations in data strategy. The article provides practical frameworks and implementation roadmaps adaptable to different organizational contexts and maturity levels.",
    author: "David Williams",
    date: "2025-02-28",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGRhdGElMjBhbmFseXRpY3N8ZW58MHx8MHx8fDA%3D",
    type: "philosophy"
  },
  {
    id: 5,
    title: "Transforming Manufacturing Through Industry 4.0",
    excerpt: "Interview with Priya Sharma on implementing connected factory initiatives and digital supply chains.",
    content: "In this exclusive interview, Priya Sharma discusses her groundbreaking work implementing Industry 4.0 technologies across global manufacturing operations. She shares insights on connecting factory systems with digital supply chains, implementing predictive maintenance programs that have reduced downtime by 35%, and developing digital twins that optimize production processes in real-time. Priya also addresses the human side of digital transformation, describing approaches for workforce upskilling and change management that have been critical to her success. The conversation concludes with her perspective on emerging manufacturing technologies and their potential impact on global production models.",
    author: "InsightsBW Editorial Team",
    date: "2025-02-22",
    image: "https://images.unsplash.com/photo-1581091196737-a4e3c335efa8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1hbnVmYWN0dXJpbmd8ZW58MHx8MHx8fDA%3D",
    type: "interview"
  },
  {
    id: 6,
    title: "Technology Leadership in Healthcare Transformation",
    excerpt: "How Elena Rodriguez is revolutionizing patient care through strategic technology initiatives.",
    content: "This in-depth profile examines Elena Rodriguez's transformative work as CIO of Healthcare Innovations. Under her leadership, the organization has implemented an integrated health information system that connects disparate care settings, developed advanced analytics capabilities that identify at-risk patients before conditions worsen, and deployed telehealth solutions that have expanded access to specialized care in underserved regions. Elena shares her philosophy on healthcare technology design, emphasizing patient-centered approaches and clinical workflow integration. The article also explores how her background in both clinical practice and information technology has shaped her unique approach to digital healthcare transformation.",
    author: "InsightsBW Editorial Team",
    date: "2025-02-18",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGhlYWx0aGNhcmUlMjB0ZWNofGVufDB8fDB8fHww",
    type: "feature"
  },
  {
    id: 7,
    title: "Leading Digital Transformation in Financial Services",
    excerpt: "Michael Chen discusses balancing innovation with security in the rapidly evolving fintech landscape.",
    content: "In this exclusive interview, Michael Chen describes his approach to digital transformation in the heavily regulated financial services industry. He shares strategies for accelerating innovation while maintaining robust security and compliance frameworks, including the development of API-based architectures, implementation of advanced fraud detection systems, and creation of fintech partnership models that extend capabilities while managing risk. Michael also discusses the changing competitive landscape in financial services and how traditional institutions can leverage their scale and customer relationships while adopting the agility of fintech startups. The conversation concludes with his perspective on emerging technologies that will shape the future of financial services.",
    author: "InsightsBW Editorial Team",
    date: "2025-02-12",
    image: "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZmludGVjaHxlbnwwfHwwfHx8MA%3D%3D",
    type: "interview"
  },
  {
    id: 8,
    title: "The Future of Retail Technology",
    excerpt: "David Williams featured in exclusive CNN Business segment on omnichannel innovation.",
    content: "David Williams was recently featured in CNN Business's 'Future Forward' series, discussing the technological transformation of retail experiences. In the 15-minute segment, he demonstrated how Retail Evolution Corp is implementing technologies that seamlessly blend physical and digital shopping experiences, including augmented reality product visualization, computer vision-powered checkout systems, and personalized in-store experiences driven by customer data. David emphasized how these innovations are not just technological showcases but strategic responses to changing consumer expectations and competitive pressures. The segment has garnered significant attention within the retail industry and highlights David's position as a thought leader in retail technology innovation.",
    author: "InsightsBW Editorial Team",
    date: "2025-02-08",
    image: "https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHJldGFpbCUyMHRlY2h8ZW58MHx8MHx8fDA%3D",
    type: "feature",
    url: "https://example.com/cnn-business-interview"
  },
  {
    id: 9,
    title: "Sustainable Energy Through Digital Transformation",
    excerpt: "James Wilson shares how technology is accelerating the transition to renewable energy systems.",
    content: "In this comprehensive industry report, James Wilson outlines how Energy Innovations is leveraging digital technologies to accelerate the transition to sustainable energy systems. He details the implementation of advanced grid management solutions that integrate renewable energy sources, the development of energy consumption optimization algorithms that reduce waste, and the creation of digital platforms that enable new business models such as virtual power plants and peer-to-peer energy trading. James also addresses the challenges of this transition, including legacy infrastructure integration and cybersecurity considerations for critical energy systems. The report concludes with his vision for a fully digitalized, decarbonized energy ecosystem enabled by emerging technologies.",
    author: "InsightsBW Editorial Team",
    date: "2025-02-04",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xpbWF0ZXxlbnwwfHwwfHx8MA%3D%3D",
    type: "feature"
  }
];


export interface Magazine {
  id: number;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  publicationDate: string;
  pdfUrl: string;
  articles: MagazineArticle[];
}

export interface MagazineArticle {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  thumbnailImage: string;
  pageNumber: number;
}

export const magazineData: Magazine[] = [
  {
    id: 1,
    title: "InsightsBW Business Intelligence - April 2025",
    category: "Business",
    description: "Our latest edition explores emerging business trends, featuring exclusive interviews with industry leaders and in-depth analysis of market transformations driving the global economy.",
    coverImage: "https://images.unsplash.com/photo-1616248304589-6a3d8d60ad6d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1hZ2F6aW5lJTIwY292ZXJ8ZW58MHx8MHx8fDA%3D",
    publicationDate: "2025-04-01",
    pdfUrl: "/sample-magazine.pdf",
    articles: [
      {
        id: 101,
        title: "The Rise of Decentralized Finance",
        excerpt: "How DeFi is reshaping traditional banking and creating new opportunities for businesses and consumers alike.",
        author: "Alexandra Morrison",
        thumbnailImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmxvY2tjaGFpbnxlbnwwfHwwfHx8MA%3D%3D",
        pageNumber: 14
      },
      {
        id: 102,
        title: "Sustainable Supply Chains: The New Competitive Advantage",
        excerpt: "Leading companies are transforming their supply chains to meet environmental goals while improving operational efficiency.",
        author: "Marcus Johnson",
        thumbnailImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3VwcGx5JTIwY2hhaW58ZW58MHx8MHx8fDA%3D",
        pageNumber: 28
      },
      {
        id: 103,
        title: "Leadership in the Age of Remote Work",
        excerpt: "New management strategies for building cohesive teams and maintaining company culture in distributed organizations.",
        author: "Sophia Chen",
        thumbnailImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVtb3RlJTIwd29ya3xlbnwwfHwwfHx8MA%3D%3D",
        pageNumber: 42
      }
    ]
  },
  {
    id: 2,
    title: "InsightsBW Tech Innovations - March 2025",
    category: "Technology",
    description: "Discover the breakthrough technologies reshaping industries, with special focus on artificial intelligence, quantum computing, and next-generation cybersecurity solutions.",
    coverImage: "https://images.unsplash.com/photo-1565373679579-96c6767666b5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGVjaCUyMG1hZ2F6aW5lfGVufDB8fDB8fHww",
    publicationDate: "2025-03-01",
    pdfUrl: "/sample-magazine.pdf",
    articles: [
      {
        id: 201,
        title: "Quantum Computing Reaches Commercial Viability",
        excerpt: "The race to quantum advantage has been won, with practical business applications now emerging across multiple industries.",
        author: "Dr. James Wilson",
        thumbnailImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cXVhbnR1bSUyMGNvbXB1dGVyfGVufDB8fDB8fHww",
        pageNumber: 12
      },
      {
        id: 202,
        title: "AI Ethics: Balancing Innovation and Responsibility",
        excerpt: "How leading organizations are establishing frameworks to ensure ethical AI development and deployment.",
        author: "Priya Sharma",
        thumbnailImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWklMjByb2JvdHxlbnwwfHwwfHx8MA%3D%3D",
        pageNumber: 24
      },
      {
        id: 203,
        title: "The New Cybersecurity Landscape",
        excerpt: "As threats evolve with unprecedented sophistication, cybersecurity strategies must adapt to protect critical assets.",
        author: "Michael Torres",
        thumbnailImage: "https://images.unsplash.com/photo-1480160734175-e2209654c0c1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGN5YmVyc2VjdXJpdHl8ZW58MHx8MHx8fDA%3D",
        pageNumber: 36
      }
    ]
  },
  {
    id: 3,
    title: "InsightsBW Digital Marketing Trends - February 2025",
    category: "Marketing",
    description: "Explore cutting-edge marketing strategies and consumer insights shaping the digital landscape, featuring case studies from breakthrough campaigns and expert analysis.",
    coverImage: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFya2V0aW5nfGVufDB8fDB8fHww",
    publicationDate: "2025-02-01",
    pdfUrl: "/sample-magazine.pdf",
    articles: [
      {
        id: 301,
        title: "The End of Third-Party Cookies: New Marketing Paradigms",
        excerpt: "How innovative companies are adapting their strategies in a privacy-first digital ecosystem.",
        author: "Emma Rodriguez",
        thumbnailImage: "https://images.unsplash.com/photo-1555421689-3f034debb7a6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29va2llc3xlbnwwfHwwfHx8MA%3D%3D",
        pageNumber: 10
      },
      {
        id: 302,
        title: "Voice Search Optimization: Preparing for the Audio Revolution",
        excerpt: "Voice-activated technology is changing how consumers interact with brands—is your marketing strategy ready?",
        author: "David Thompson",
        thumbnailImage: "https://images.unsplash.com/photo-1622282577773-e0f9b24cceb5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dm9pY2UlMjBzZWFyY2h8ZW58MHx8MHx8fDA%3D",
        pageNumber: 22
      },
      {
        id: 303,
        title: "Social Commerce: When Entertainment Meets Shopping",
        excerpt: "The integration of shopping experiences into social platforms is creating new revenue channels for forward-thinking brands.",
        author: "Jennifer Lee",
        thumbnailImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29jaWFsJTIwbWVkaWElMjBzaG9wcGluZ3xlbnwwfHwwfHx8MA%3D%3D",
        pageNumber: 34
      }
    ]
  },
  {
    id: 4,
    title: "InsightsBW Sustainability Report - January 2025",
    category: "Business",
    description: "Our comprehensive analysis of sustainable business practices and ESG innovations driving corporate responsibility and long-term value creation across global industries.",
    coverImage: "https://images.unsplash.com/photo-1535025639604-9a804c092faa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3VzdGFpbmFiaWxpdHl8ZW58MHx8MHx8fDA%3D",
    publicationDate: "2025-01-01",
    pdfUrl: "/sample-magazine.pdf",
    articles: [
      {
        id: 401,
        title: "Circular Economy Business Models That Work",
        excerpt: "Case studies of companies successfully implementing circular principles to reduce waste and increase profits.",
        author: "Jason Miller",
        thumbnailImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVjeWNsZXxlbnwwfHwwfHx8MA%3D%3D",
        pageNumber: 18
      },
      {
        id: 402,
        title: "ESG Reporting: Beyond Compliance to Strategic Advantage",
        excerpt: "How leading organizations are leveraging ESG transparency to attract investment and build consumer trust.",
        author: "Sarah Johnson",
        thumbnailImage: "https://images.unsplash.com/photo-1562157404-6fe5826bf9ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZXNnfGVufDB8fDB8fHww",
        pageNumber: 30
      },
      {
        id: 403,
        title: "Renewable Energy: The Business Case Gets Stronger",
        excerpt: "Dropping costs and technological advances are making renewable energy the economical choice across industries.",
        author: "Christopher Green",
        thumbnailImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c29sYXIlMjBwYW5lbHN8ZW58MHx8MHx8fDA%3D",
        pageNumber: 44
      }
    ]
  },
  {
    id: 5,
    title: "InsightsBW Leadership Excellence - December 2024",
    category: "Leadership",
    description: "Discover transformative leadership strategies with exclusive interviews from global business leaders who are redefining organizational success in challenging times.",
    coverImage: "https://images.unsplash.com/photo-1570126618953-d437176e8c79?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGVhZGVyc2hpcHxlbnwwfHwwfHx8MA%3D",
    publicationDate: "2024-12-01",
    pdfUrl: "/sample-magazine.pdf",
    articles: [
      {
        id: 501,
        title: "Adaptive Leadership for Uncertain Times",
        excerpt: "How executives are building resilient organizations capable of thriving amid constant change and disruption.",
        author: "Elizabeth Clark",
        thumbnailImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxlYWRlcnNoaXB8ZW58MHx8MHx8fDA%3D",
        pageNumber: 16
      },
      {
        id: 502,
        title: "The Science of High-Performance Teams",
        excerpt: "Research-backed approaches to building and sustaining teams that consistently achieve extraordinary results.",
        author: "Robert Anderson",
        thumbnailImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVhbXxlbnwwfHwwfHx8MA%3D%3D",
        pageNumber: 28
      },
      {
        id: 503,
        title: "Executive Presence in the Digital Age",
        excerpt: "Developing and projecting authentic leadership presence across virtual and hybrid work environments.",
        author: "Michelle Kim",
        thumbnailImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZXhlY3V0aXZlfGVufDB8fDB8fHww",
        pageNumber: 42
      }
    ]
  },
  {
    id: 6,
    title: "InsightsBW Financial Strategies - November 2024",
    category: "Business",
    description: "Expert financial insights and strategic investment guidance for businesses navigating complex global markets and economic transformations.",
    coverImage: "https://images.unsplash.com/photo-1638913665258-ddd2bceafb30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZpbmFuY2V8ZW58MHx8MHx8fDA%3D",
    publicationDate: "2024-11-01",
    pdfUrl: "/sample-magazine.pdf",
    articles: [
      {
        id: 601,
        title: "Strategic Asset Allocation in Volatile Markets",
        excerpt: "Investment strategies that protect capital while capitalizing on emerging opportunities during market turbulence.",
        author: "William Zhang",
        thumbnailImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGludmVzdG1lbnR8ZW58MHx8MHx8fDA%3D",
        pageNumber: 14
      },
      {
        id: 602,
        title: "Fintech Disruption: Opportunity or Threat?",
        excerpt: "How traditional financial institutions are responding to fintech innovation through partnerships and digital transformation.",
        author: "Rachel Morgan",
        thumbnailImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmludGVjaHxlbnwwfHwwfHx8MA%3D%3D",
        pageNumber: 26
      },
      {
        id: 603,
        title: "Corporate Treasury Management in the Digital Age",
        excerpt: "New approaches to liquidity, risk, and cash flow management leveraging data analytics and automation.",
        author: "Jonathan Edwards",
        thumbnailImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZpbmFuY2V8ZW58MHx8MHx8fDA%3D",
        pageNumber: 38
      }
    ]
  }
];


export interface Magazine {
  id: number;
  title: string;
  description: string;
  category: string;
  publicationDate: string;
  coverImage: string;
  pdfUrl: string;
  articles: MagazineArticle[];
}

export interface MagazineArticle {
    id: number;
    title: string;
    author: string;
    excerpt: string;
    pageNumber: number;
    thumbnailImage: string;
}

export const magazineData: Magazine[] = [
  {
    id: 1,
    title: "The Future of Digital Transformation",
    description: "Explore how companies are leveraging artificial intelligence, IoT, and cloud computing to revolutionize their operations and customer experiences. This issue features insights from top technology leaders and case studies of successful digital transformations.",
    category: "technology",
    publicationDate: "April 2025",
    coverImage: "https://thecioworld.com/wp-content/uploads/2024/12/The-Most-Successful-Chief-Growth-Officer-You-Should-Know.jpg",
    pdfUrl: "http://www.africau.edu/images/default/sample.pdf",
    articles: [
      {
        id: 101,
        title: "AI-Driven Business Strategies",
        author: "Dr. Emily Carter",
        excerpt: "How artificial intelligence is transforming business decision-making processes.",
        pageNumber: 4,
        thumbnailImage: "https://images.unsplash.com/photo-1519389950473-47a0f98a952a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaG5vbG9neXxlbnwwfHwwfHw%3D&w=1000&q=80"
      },
      {
        id: 102,
        title: "The Role of IoT in Smart Cities",
        author: "Michael Lee",
        excerpt: "Exploring the impact of the Internet of Things on urban development and sustainability.",
        pageNumber: 12,
        thumbnailImage: "https://media.istockphoto.com/id/1166475400/photo/abstract-image-visual-internet-of-things-concept.jpg?s=612x612&w=0&k=20&c=egKt_qEwjhYI_zsX-vjtjLumeK1xG-1wJS2m-Lhx_lc="
      },
      {
        id: 103,
        title: "Cloud Computing Trends",
        author: "Sarah Johnson",
        excerpt: "An overview of the latest trends and innovations in cloud computing technology.",
        pageNumber: 20,
        thumbnailImage: "https://www.simplilearn.com/ice9/free_resources_article_thumb/cloud-computing-an-overview-article.jpg"
      }
    ]
  },
  {
    id: 2,
    title: "Sustainable Business Practices",
    description: "Discover how leading organizations are implementing sustainable practices that benefit both the environment and their bottom line. This issue examines innovative approaches to reducing carbon footprints, ethical supply chain management, and corporate social responsibility initiatives.",
    category: "sustainability",
    publicationDate: "March 2025",
    coverImage: "https://thecioworld.com/wp-content/uploads/2024/12/Most-Influential-Leaders-in-Aerospace-Aviation-Industry-to-Watch.jpg",
    pdfUrl: "http://www.africau.edu/images/default/sample.pdf",
    articles: [
      {
        id: 201,
        title: "Reducing Carbon Footprints",
        author: "Dr. James Wilson",
        excerpt: "Strategies for businesses to minimize their environmental impact and reduce carbon emissions.",
        pageNumber: 6,
        thumbnailImage: "https://www.shutterstock.com/image-photo/concept-ecological-footprint-260nw-1909740918.jpg"
      },
      {
        id: 202,
        title: "Ethical Supply Chain Management",
        author: "Maria Rodriguez",
        excerpt: "Ensuring fair labor practices and environmental responsibility in global supply chains.",
        pageNumber: 15,
        thumbnailImage: "https://www.supplychaindive.com/imgproxy/SjxrZl9vdUqAWK42Ejw-V5_1tj1GyysjCa9KpEQC6_A/g:ce/rs:fill:770:364:0/bG9jYWw6Ly8vZGl2ZWltYWdlL0dldHR5SW1hZ2VzLTExNzY2MzQ4MzguanBn.jpg"
      },
      {
        id: 203,
        title: "Corporate Social Responsibility",
        author: "David Brown",
        excerpt: "The importance of CSR initiatives in building a positive brand image and community relations.",
        pageNumber: 22,
        thumbnailImage: "https://www.investopedia.com/thmb/QV-I2gMrGfxKJJwV0iwEaQ-ekME=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-1284994248-dbdfa5a8df1c45f5a594b799e3c04c24.jpg"
      }
    ]
  },
  {
    id: 3,
    title: "Global Market Trends",
    description: "Analysis of emerging market trends and opportunities across different regions and industries. Our experts provide forecasts and strategic recommendations to help your business navigate the evolving global economic landscape.",
    category: "finance",
    publicationDate: "February 2025",
    coverImage: "https://thecioworld.com/wp-content/uploads/2024/12/Breaking-Barriers-with-Style-Rethink-Your-Brand-Approach-By-Ana-Maria-Ciubota.jpg",
    pdfUrl: "http://www.africau.edu/images/default/sample.pdf",
    articles: [
      {
        id: 301,
        title: "Emerging Market Opportunities",
        author: "Alexandra Morrison",
        excerpt: "Identifying high-growth potential markets for business expansion.",
        pageNumber: 5,
        thumbnailImage: "https://www.trade.gov/sites/default/files/styles/opengraph_image/public/2023-03/emergingmarkets.jpg?itok=RjG5Kq4j"
      },
      {
        id: 302,
        title: "Economic Forecasts for 2025",
        author: "Marcus Johnson",
        excerpt: "Expert predictions on the global economic outlook and key factors influencing market performance.",
        pageNumber: 14,
        thumbnailImage: "https://images.moneycontrol.com/static-mcnews/2023/01/Budget-Session-economic-survey-770x433.jpg"
      },
      {
        id: 303,
        title: "Strategic Investment Recommendations",
        author: "Sophia Chen",
        excerpt: "Guidance on making informed investment decisions in a dynamic economic environment.",
        pageNumber: 21,
        thumbnailImage: "https://www.fidelity.com/binaries/content/gallery/mobile/insights/how-to-invest-during-a-recession.jpg"
      }
    ]
  },
  {
    id: 4,
    title: "Leadership in Crisis",
    description: "Learn effective strategies for leading organizations through times of uncertainty and disruption. This issue features interviews with executives who successfully navigated recent global challenges and expert advice on building resilient teams and adaptive business models.",
    category: "leadership",
    publicationDate: "January 2025",
    coverImage: "https://thecioworld.com/wp-content/uploads/2024/12/The-Most-Visionary-Leaders-Pioneering-Digital-Transformation-in-2024-December2024.jpg",
    pdfUrl: "http://www.africau.edu/images/default/sample.pdf",
    articles: [
      {
        id: 401,
        title: "Leading Through Uncertainty",
        author: "Dr. James Wilson",
        excerpt: "Effective leadership strategies for navigating times of crisis and change.",
        pageNumber: 7,
        thumbnailImage: "https://miro.medium.com/v2/resize:fit/1400/1*bJESdzWJu9joKqq9G9Jv9Q.jpeg"
      },
      {
        id: 402,
        title: "Building Resilient Teams",
        author: "Maria Rodriguez",
        excerpt: "Creating strong, adaptable teams that can withstand challenges and setbacks.",
        pageNumber: 16,
        thumbnailImage: "https://www.aihr.com/wp-content/uploads/Building-a-resilient-team.png"
      },
      {
        id: 403,
        title: "Adaptive Business Models",
        author: "David Brown",
        excerpt: "Designing flexible business models that can quickly adapt to changing market conditions.",
        pageNumber: 23,
        thumbnailImage: "https://www.strategy-business.com/media/image/19301-Quick-Read-Adaptable-Business-Models.jpg?w=1920"
      }
    ]
  },
  {
    id: 5,
    title: "Innovation Ecosystems",
    description: "Explore how companies are creating collaborative networks to accelerate innovation. This issue examines successful partnerships between corporations, startups, academic institutions, and government agencies, providing insights into building effective innovation ecosystems.",
    category: "innovation",
    publicationDate: "December 2024",
    coverImage: "https://thecioworld.com/wp-content/uploads/2024/12/Middle-Easts-Top-Managing-Directors-Revolutionizing-Business.jpg",
    pdfUrl: "http://www.africau.edu/images/default/sample.pdf",
    articles: [
      {
        id: 501,
        title: "Collaborative Innovation Networks",
        author: "Alexandra Morrison",
        excerpt: "Building partnerships between corporations, startups, and academic institutions.",
        pageNumber: 8,
        thumbnailImage: "https://www.daglobal.com/wp-content/uploads/2023/02/Innovation-ecosystem.jpg"
      },
      {
        id: 502,
        title: "Accelerating Innovation",
        author: "Marcus Johnson",
        excerpt: "Strategies for speeding up the innovation process and bringing new products to market faster.",
        pageNumber: 17,
        thumbnailImage: "https://www.innosight.com/wp-content/uploads/2017/08/Exhibit-3-New-model-for-corporate-innovation-ecosystem.jpg"
      },
      {
        id: 503,
        title: "Effective Innovation Ecosystems",
        author: "Sophia Chen",
        excerpt: "Insights into creating innovation ecosystems that drive growth and competitive advantage.",
        pageNumber: 24,
        thumbnailImage: "https://www.mckinsey.com/~/media/mckinsey/industries/high%20tech/our%20insights/building%20innovation%20ecosystems/svgz-building-innovation-ecosystems-ex1a.svg"
      }
    ]
  }
];

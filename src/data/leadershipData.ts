
import { slugify } from "../lib/slugify";

export interface Leader {
  id: number;
  name: string;
  title: string;
  company: string;
  bio: string;
  image: string;
  slug: string;
  expertise: string[];
  linkedin?: string;
  twitter?: string;
  email?: string;
  website?: string;
  education?: {
    degree: string;
    institution: string;
    year?: string;
  }[];
  awards?: {
    title: string;
    year: string;
  }[];
  quotes?: {
    text: string;
    source?: string;
  }[];
  articles?: {
    title: string;
    date: string;
    slug: string;
  }[];
}

export const leadershipData: Leader[] = [
  {
    id: 1,
    name: "Maria Rodriguez",
    title: "Chief Executive Officer",
    company: "InsightsBW",
    bio: "Maria Rodriguez is a visionary business leader with over 20 years of experience in market intelligence and business strategy. As the CEO of InsightsBW, she has transformed the company from a traditional market research firm into a global leader in business intelligence and strategic insights.\n\nUnder her leadership, InsightsBW has expanded its global footprint to 15 countries and developed innovative data analytics platforms that serve Fortune 500 clients across industries. Maria is particularly passionate about helping organizations leverage data to drive strategic decision-making and sustainable growth.\n\nPrior to joining InsightsBW, Maria held executive positions at Global Strategy Partners and Insight Ventures. She began her career as a management consultant at McKinsey & Company, where she advised clients on corporate strategy and organizational transformation.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    slug: "maria-rodriguez",
    expertise: ["Business Strategy", "Market Intelligence", "Organizational Leadership", "Digital Transformation"],
    linkedin: "https://linkedin.com/in/mariarodriguez",
    twitter: "https://twitter.com/mariarodriguez",
    email: "maria.rodriguez@insightsbw.com",
    education: [
      {
        degree: "MBA",
        institution: "Harvard Business School",
        year: "2005"
      },
      {
        degree: "Bachelor of Science in Economics",
        institution: "University of Pennsylvania",
        year: "1999"
      }
    ],
    awards: [
      {
        title: "Business Intelligence Leader of the Year",
        year: "2024"
      },
      {
        title: "Top 50 Women in Business",
        year: "2022"
      },
      {
        title: "Innovation in Data Analytics Award",
        year: "2020"
      }
    ],
    quotes: [
      {
        text: "In today's data-rich environment, the competitive advantage lies not in having information, but in extracting meaningful insights from it.",
        source: "InsightsBW Annual Conference, 2024"
      },
      {
        text: "The most successful organizations are those that align their data strategy with their business strategy, creating a feedback loop that continuously informs decision-making.",
        source: "Harvard Business Review Interview"
      }
    ],
    articles: [
      {
        title: "The Future of Business Intelligence",
        date: "February 15, 2025",
        slug: "future-of-business-intelligence"
      },
      {
        title: "Data-Driven Decision Making for Executive Teams",
        date: "November 8, 2024",
        slug: "data-driven-decision-making-executive-teams"
      }
    ]
  },
  {
    id: 2,
    name: "James Wilson",
    title: "Chief Technology Officer",
    company: "InsightsBW",
    bio: "James Wilson leads the technological innovation at InsightsBW, overseeing the development of advanced analytics platforms and data intelligence solutions. With a background in computer science and artificial intelligence, James has pioneered the integration of machine learning algorithms into business intelligence applications.\n\nSince joining InsightsBW in 2018, James has built a world-class engineering team and led the development of the company's flagship InsightIQ platform, which has transformed how clients access and utilize market intelligence. His focus on user experience and practical application of complex technologies has been instrumental in making sophisticated data analysis accessible to business users.\n\nBefore InsightsBW, James was the founder and CTO of DataVision Analytics, a startup acquired by Google in 2017. He also held senior engineering roles at Microsoft and Amazon, where he worked on cloud computing and machine learning initiatives.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    slug: "james-wilson",
    expertise: ["Artificial Intelligence", "Machine Learning", "Data Engineering", "Product Development"],
    linkedin: "https://linkedin.com/in/jameswilson",
    twitter: "https://twitter.com/jameswilson",
    website: "https://jameswilson.tech",
    education: [
      {
        degree: "Ph.D. in Computer Science",
        institution: "Stanford University",
        year: "2011"
      },
      {
        degree: "Master of Science in Artificial Intelligence",
        institution: "Massachusetts Institute of Technology",
        year: "2007"
      },
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "Carnegie Mellon University",
        year: "2005"
      }
    ],
    awards: [
      {
        title: "Technology Innovator of the Year",
        year: "2023"
      },
      {
        title: "AI Breakthrough Award",
        year: "2021"
      }
    ],
    quotes: [
      {
        text: "The future of business intelligence isn't about more data—it's about smarter analysis and actionable insights delivered at the right moment.",
        source: "Tech Summit 2024"
      }
    ],
    articles: [
      {
        title: "AI and Machine Learning Transforming Business Operations",
        date: "April 12, 2025",
        slug: "ai-machine-learning-transforming-business-operations"
      },
      {
        title: "Practical Applications of NLP in Business Intelligence",
        date: "January 22, 2025",
        slug: "practical-applications-nlp-business-intelligence"
      }
    ]
  },
  {
    id: 3,
    name: "Sarah Johnson",
    title: "Chief Research Officer",
    company: "InsightsBW",
    bio: "Sarah Johnson oversees InsightsBW's global research operations, ensuring methodological rigor and analytical excellence across all industry sectors. With a background in economics and statistical methods, Sarah has established InsightsBW as a trusted source for business insights based on robust data analysis and thoughtful interpretation.\n\nSarah joined InsightsBW in 2015 and has transformed the research department by implementing advanced statistical modeling techniques and establishing partnerships with academic institutions to enhance the company's research capabilities. Her team of analysts produces over 200 in-depth industry reports annually, covering emerging trends and strategic opportunities across global markets.\n\nPreviously, Sarah served as the Director of Economic Research at the Federal Reserve Bank of San Francisco and held senior positions at leading economic consulting firms. She is widely published in academic journals and is a frequent speaker at industry conferences on topics related to market forecasting and economic trends.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    slug: "sarah-johnson",
    expertise: ["Economic Analysis", "Market Research", "Statistical Methods", "Industry Forecasting"],
    linkedin: "https://linkedin.com/in/sarahjohnson",
    email: "sarah.johnson@insightsbw.com",
    education: [
      {
        degree: "Ph.D. in Economics",
        institution: "University of Chicago",
        year: "2008"
      },
      {
        degree: "Master of Science in Statistics",
        institution: "University of California, Berkeley",
        year: "2004"
      },
      {
        degree: "Bachelor of Arts in Economics",
        institution: "Yale University",
        year: "2002"
      }
    ],
    awards: [
      {
        title: "Research Excellence Award",
        year: "2023"
      },
      {
        title: "Women in Economics Leadership Award",
        year: "2020"
      }
    ],
    quotes: [
      {
        text: "Good research isn't just about finding answers—it's about asking the right questions in the first place.",
        source: "Research Methodology Conference 2024"
      },
      {
        text: "The most valuable insights often emerge at the intersection of quantitative analysis and qualitative understanding.",
        source: "Market Research Quarterly"
      }
    ],
    articles: [
      {
        title: "Global Market Trends for 2025",
        date: "March 5, 2025",
        slug: "global-market-trends-2025"
      },
      {
        title: "Emerging Economies: Opportunities and Challenges",
        date: "October 15, 2024",
        slug: "emerging-economies-opportunities-challenges"
      }
    ]
  },
  {
    id: 4,
    name: "Michael Chen",
    title: "Chief Strategy Officer",
    company: "InsightsBW",
    bio: "Michael Chen leads strategic planning and business development at InsightsBW, guiding the company's expansion into new markets and service offerings. With expertise in corporate strategy and international business, Michael has been instrumental in growing InsightsBW's global presence and diversifying its portfolio of solutions.\n\nSince joining the executive team in 2019, Michael has orchestrated several strategic acquisitions that have strengthened the company's capabilities in specific industry verticals and geographic regions. He has also established key strategic partnerships with technology providers and consulting firms that have created new revenue streams and enhanced the value proposition for clients.\n\nPrior to InsightsBW, Michael was a Partner at Bain & Company, where he led the firm's Strategy practice in Asia-Pacific. He began his career in investment banking at Goldman Sachs before transitioning to management consulting. Michael serves on the boards of several technology startups and is an advisor to venture capital firms focused on business intelligence and analytics.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    slug: "michael-chen",
    expertise: ["Corporate Strategy", "Mergers & Acquisitions", "Business Development", "International Expansion"],
    linkedin: "https://linkedin.com/in/michaelchen",
    twitter: "https://twitter.com/michaelchen",
    email: "michael.chen@insightsbw.com",
    education: [
      {
        degree: "MBA",
        institution: "INSEAD",
        year: "2010"
      },
      {
        degree: "Master of International Business",
        institution: "The Fletcher School, Tufts University",
        year: "2006"
      },
      {
        degree: "Bachelor of Science in Economics",
        institution: "London School of Economics",
        year: "2004"
      }
    ],
    awards: [
      {
        title: "Global Strategy Leader Award",
        year: "2024"
      },
      {
        title: "Asia-Pacific Business Innovator",
        year: "2021"
      }
    ],
    quotes: [
      {
        text: "Strategic advantage in today's business environment comes from seeing connections others miss and acting decisively on those insights.",
        source: "Strategic Leadership Forum 2024"
      }
    ],
    articles: [
      {
        title: "Supply Chain Resilience: Lessons from Global Disruptions",
        date: "April 5, 2025",
        slug: "supply-chain-resilience-lessons-from-global-disruptions"
      },
      {
        title: "Strategic Partnerships in the Digital Economy",
        date: "December 10, 2024",
        slug: "strategic-partnerships-digital-economy"
      }
    ]
  },
  {
    id: 5,
    name: "Emily Brown",
    title: "Chief People Officer",
    company: "InsightsBW",
    bio: "Emily Brown oversees human resources and talent development at InsightsBW, fostering a culture of innovation, inclusion, and continuous learning. With a background in organizational psychology and leadership development, Emily has implemented progressive people practices that have made InsightsBW a recognized employer of choice in the business intelligence industry.\n\nSince joining the company in 2020, Emily has transformed InsightsBW's approach to talent management, implementing data-driven recruitment strategies, comprehensive leadership development programs, and innovative performance management systems. Her initiatives have reduced employee turnover by 35% and increased employee engagement scores to industry-leading levels.\n\nBefore joining InsightsBW, Emily was the Global Head of Leadership Development at LinkedIn and previously held senior HR roles at Deloitte and Google. She is a certified executive coach and speaks regularly at conferences on the future of work, organizational culture, and talent strategy.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    slug: "emily-brown",
    expertise: ["Organizational Development", "Talent Management", "Leadership Coaching", "Workplace Culture"],
    linkedin: "https://linkedin.com/in/emilybrown",
    twitter: "https://twitter.com/emilybrown",
    email: "emily.brown@insightsbw.com",
    education: [
      {
        degree: "Ph.D. in Organizational Psychology",
        institution: "Columbia University",
        year: "2012"
      },
      {
        degree: "Master of Science in Human Resources Management",
        institution: "Cornell University",
        year: "2007"
      },
      {
        degree: "Bachelor of Arts in Psychology",
        institution: "University of Michigan",
        year: "2005"
      }
    ],
    awards: [
      {
        title: "HR Executive of the Year",
        year: "2023"
      },
      {
        title: "Most Innovative People Practices",
        year: "2022"
      }
    ],
    quotes: [
      {
        text: "The organizations that will thrive in the future are those that recognize talent as their most strategic asset and culture as their most sustainable competitive advantage.",
        source: "Future of Work Summit 2024"
      },
      {
        text: "Leadership development isn't about creating better managers—it's about cultivating individuals who can navigate complexity, inspire others, and drive meaningful change.",
        source: "Harvard Business Review Interview"
      }
    ],
    articles: [
      {
        title: "Remote Work Revolution: Building Effective Virtual Teams",
        date: "March 15, 2025",
        slug: "remote-work-revolution-building-effective-virtual-teams"
      },
      {
        title: "The Evolution of Performance Management",
        date: "September 28, 2024",
        slug: "evolution-of-performance-management"
      }
    ]
  },
  {
    id: 6,
    name: "David Patel",
    title: "Chief Financial Officer",
    company: "InsightsBW",
    bio: "David Patel leads financial strategy and operations at InsightsBW, ensuring the company's sustainable growth and financial health. With expertise in financial planning, investment analysis, and corporate finance, David has played a critical role in scaling the company while maintaining strong profitability and shareholder value.\n\nSince joining InsightsBW in 2017, David has modernized the company's financial infrastructure, implemented sophisticated forecasting models, and secured strategic funding for global expansion initiatives. His prudent financial management enabled the company to navigate market volatility while continuing to invest in innovation and talent development.\n\nPrior to InsightsBW, David was the Finance Director at Salesforce and previously held senior finance positions at Oracle and PwC. He began his career in investment banking at Morgan Stanley, specializing in technology and software sectors. David serves on the audit committee of several nonprofit organizations and is a frequent speaker on financial strategy for high-growth companies.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    slug: "david-patel",
    expertise: ["Financial Strategy", "Investment Analysis", "Risk Management", "Corporate Finance"],
    linkedin: "https://linkedin.com/in/davidpatel",
    email: "david.patel@insightsbw.com",
    education: [
      {
        degree: "MBA, Finance",
        institution: "Wharton School, University of Pennsylvania",
        year: "2008"
      },
      {
        degree: "Master of Accounting",
        institution: "University of Michigan",
        year: "2004"
      },
      {
        degree: "Bachelor of Science in Finance",
        institution: "New York University",
        year: "2002"
      }
    ],
    awards: [
      {
        title: "CFO of the Year, Technology Sector",
        year: "2023"
      },
      {
        title: "Financial Excellence Award",
        year: "2021"
      }
    ],
    quotes: [
      {
        text: "Financial strategy is no longer just about managing costs and capital—it's about enabling innovation and creating long-term value in a rapidly changing business landscape.",
        source: "CFO Summit 2024"
      }
    ],
    articles: [
      {
        title: "Emerging Markets: Growth Opportunities and Strategic Considerations",
        date: "March 8, 2025",
        slug: "emerging-markets-growth-opportunities-strategic-considerations"
      },
      {
        title: "Financial Strategies for Global Expansion",
        date: "August 15, 2024",
        slug: "financial-strategies-global-expansion"
      }
    ]
  }
];

// Use the slugify function to generate slugs for each leader if needed
// This is just a utility function for data maintenance
export function regenerateSlugsForLeaders(): Leader[] {
  return leadershipData.map(leader => ({
    ...leader,
    slug: slugify(leader.name)
  }));
}

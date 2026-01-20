export interface PressRelease {
  id: string; // Changed from number to string to match Supabase UUID
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  category: string;
  slug: string;
  author?: string; // Made optional since it might not always be present
}

export const pressReleaseData: PressRelease[] = [
  {
    id: "1", // Changed to string
    title: "The CIO Vision Launches Advanced Analytics Platform for Business Intelligence",
    excerpt: "New cloud-based solution provides enterprises with real-time market insights and predictive trend analysis.",
    content: "BOSTON, April 15, 2025 — The CIO Vision today announced the launch of The CIO Vision Analytics, an advanced cloud-based platform designed to provide enterprises with real-time market intelligence and predictive trend analysis. The new offering combines proprietary data models with artificial intelligence to deliver actionable insights across industries.\n\nThe platform offers interactive dashboards, customizable alerts, and integration capabilities with major enterprise systems. Early adopters report significant improvements in strategic decision-making and market responsiveness.\n\n\"In today's fast-paced business environment, having access to timely, accurate market intelligence is not just advantageous—it's essential,\" said Maria Rodriguez, CEO of The CIO Vision. \"Our new analytics platform transforms raw data into strategic insights that drive business value.\"\n\nThe platform is available immediately through a subscription model, with industry-specific packages for financial services, healthcare, retail, and technology sectors. The CIO Vision will be hosting a virtual demonstration event on April 30 for interested organizations.",
    date: "2025-04-15",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGRhdGElMjBhbmFseXRpY3N8ZW58MHx8MHx8fDA%3D",
    category: "Product Launch",
    slug: "the-cio-vision-launches-advanced-analytics-platform",
    author: "Maria Rodriguez"
  },
  {
    id: "2",
    title: "The CIO Vision Expands Leadership Advisory Services with Executive Coaching Program",
    excerpt: "New offering pairs C-suite executives with experienced coaches to enhance leadership effectiveness and strategic thinking.",
    content: "NEW YORK, April 8, 2025 — The CIO Vision today announced the expansion of its leadership advisory services with the launch of an executive coaching program designed specifically for C-suite leaders navigating complex business transformations.\n\nThe program pairs executives with coaches who have extensive leadership experience across diverse industries and specializations. Coaching engagements are structured around personalized development plans with measurable outcomes aligned to organizational goals.\n\n\"Effective leadership has never been more challenging or more critical to business success,\" said James Wilson, Director of Leadership Services at The CIO Vision. \"Our coaching program supports executives in developing the adaptive leadership capabilities needed to thrive in today's business environment.\"\n\nThe coaching methodology integrates The CIO Vision's research on high-performing leadership behaviors with practical implementation strategies. Initial participants report significant improvements in strategic decision-making, team effectiveness, and change management capabilities.\n\nThe program will be available starting May 1, with both in-person and virtual coaching options to accommodate global client bases.",
    date: "2025-04-08",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGV4ZWN1dGl2ZSUyMG1lZXRpbmd8ZW58MHx8MHx8fDA%3D",
    category: "Service Expansion",
    slug: "executive-coaching-program-launch",
    author: "James Wilson"
  },
  {
    id: "3",
    title: "The CIO Vision Annual Technology Impact Report Identifies Emerging Trends Reshaping Industries",
    excerpt: "Comprehensive research highlights artificial intelligence, quantum computing, and sustainable technology as primary transformation drivers.",
    content: "SAN FRANCISCO, March 30, 2025 — The CIO Vision has released its 2025 Technology Impact Report, a comprehensive analysis of how emerging technologies are reshaping business models and market dynamics across major industries.\n\nThe extensively researched report identifies several key trends expected to drive significant business transformation over the next three to five years, including mainstream adoption of generative AI in enterprise processes, commercial applications of quantum computing, and technology-enabled sustainability solutions.\n\n\"This year's report goes beyond identifying technologies to watch—it provides a detailed roadmap for how organizations can strategically implement these innovations to create competitive advantage,\" said Thomas Anderson, Chief Research Officer at The CIO Vision.\n\nThe report features case studies from early adopters across financial services, healthcare, manufacturing, and retail sectors, along with implementation frameworks and risk assessment models.\n\nThe 2025 Technology Impact Report is available now through the The CIO Vision Research Portal, with an executive summary accessible to the public. The CIO Vision will host a virtual conference on April 12 to discuss the findings with industry leaders and technology experts.",
    date: "2025-03-30",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D",
    category: "Research Publication",
    slug: "technology-impact-report-2025",
    author: "Thomas Anderson"
  },
  {
    id: "4",
    title: "The CIO Vision Partners with Global Sustainability Alliance to Advance ESG Reporting Standards",
    excerpt: "Collaboration aims to develop comprehensive framework for measuring and reporting environmental and social impact.",
    content: "LONDON, March 22, 2025 — The CIO Vision announced today a strategic partnership with the Global Sustainability Alliance (GSA) to develop enhanced standards for environmental, social, and governance (ESG) measurement and reporting.\n\nThe collaboration will leverage The CIO Vision's data analytics capabilities and industry expertise alongside GSA's sustainability frameworks to create practical tools for businesses implementing ESG initiatives. The partnership's first deliverable will be a comprehensive guide to ESG metrics that align with emerging regulatory requirements while providing actionable insights for business leaders.\n\n\"As ESG considerations become increasingly central to business strategy and investment decisions, organizations need robust, consistent approaches to measuring and reporting their impact,\" said Sarah Johnson, Sustainability Practice Leader at The CIO Vision. \"Our partnership with GSA addresses this critical need.\"\n\nMichael Green, Executive Director of GSA, added: \"Combining The CIO Vision's analytical rigor with our sustainability expertise will accelerate the development of standardized approaches that work for both businesses and their stakeholders.\"\n\nThe initial framework is scheduled for release in June 2025, with pilot implementations planned with select organizations across multiple industries.",
    date: "2025-03-22",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3VzdGFpbmFiaWxpdHl8ZW58MHx8MHx8fDA%3D",
    category: "Partnership",
    slug: "global-sustainability-alliance-partnership",
    author: "Sarah Johnson"
  },
  {
    id: "5",
    title: "The CIO Vision Appoints Dr. Maya Patel as Chief Research Officer",
    excerpt: "Renowned technology strategist and former university professor joins leadership team to drive research innovation.",
    content: "CHICAGO, March 15, 2025 — The CIO Vision announced today the appointment of Dr. Maya Patel as Chief Research Officer, effective April 1. Dr. Patel will lead the company's research organization, overseeing market analysis, thought leadership development, and the expansion of The CIO Vision's research methodologies.\n\nDr. Patel joins The CIO Vision from Stanford University, where she served as Professor of Technology Strategy at the School of Business. Her academic research on digital transformation and emerging technologies has been widely published and recognized with multiple awards. Prior to her academic career, Dr. Patel held leadership positions at major technology companies and advised Fortune 500 organizations on innovation strategy.\n\n\"Dr. Patel brings an extraordinary combination of academic rigor, industry expertise, and strategic vision to our research function,\" said Maria Rodriguez, CEO of The CIO Vision. \"Her leadership will be instrumental as we continue to expand the depth and breadth of insights we provide to our clients.\"\n\nIn her new role, Dr. Patel will focus on enhancing The CIO Vision's predictive analytics capabilities, developing new research methodologies, and building strategic partnerships with academic institutions and industry associations.\n\n\"I'm thrilled to join The CIO Vision at this pivotal time when organizations face unprecedented complexity and opportunity,\" said Dr. Patel. \"I look forward to working with the talented research team to deliver insights that help leaders navigate transformation successfully.\"",
    date: "2025-03-15",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHByb2Zlc3Npb25hbCUyMGluZGlhbiUyMHdvbWFufGVufDB8fDB8fHww",
    category: "Leadership Appointment",
    slug: "dr-maya-patel-appointed-chief-research-officer",
    author: "Maria Rodriguez"
  },
  {
    id: "6",
    title: "The CIO Vision Announces Global Expansion with New Offices in Singapore and Dubai",
    excerpt: "Strategic growth extends the company's presence in rapidly developing markets across Asia and the Middle East.",
    content: "NEW YORK, March 8, 2025 — The CIO Vision today announced the opening of new offices in Singapore and Dubai, extending the company's global presence to better serve clients in the Asia-Pacific and Middle East markets.\n\nThe expansion reflects The CIO Vision's commitment to providing localized market intelligence and advisory services to organizations navigating these dynamic regional economies. Both offices will offer the company's full suite of research, advisory, and leadership development services, with teams comprising local market experts and global practice specialists.\n\n\"Asia-Pacific and the Middle East represent critical growth regions for our clients and for The CIO Vision,\" said Maria Rodriguez, CEO. \"Our new offices will enable us to deliver deeper insights into these markets while strengthening relationships with our expanding client base in these regions.\"\n\nThe Singapore office will serve as the hub for Southeast Asia operations, while the Dubai location will cover the Middle East and North Africa. Both offices are staffed with senior research analysts, industry specialists, and client advisory professionals.\n\n\"Our regional expansion strategy is driven by client demand for on-the-ground expertise combined with global perspective,\" said Robert Kim, Vice President of Global Markets. \"These new offices significantly enhance our ability to provide timely, relevant insights to organizations operating in or expanding to these regions.\"\n\nThe new offices are fully operational as of March 1, with official opening events scheduled for April in both locations.",
    date: "2025-03-08",
    image: "https://images.unsplash.com/photo-1575503802870-45de6a6217c8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2luZ2Fwb3JlfGVufDB8fDB8fHww",
    category: "Company Expansion",
    slug: "global-expansion-singapore-dubai",
    author: "Robert Kim"
  },
  {
    id: "7",
    title: "The CIO Vision Foundation Launches $5 Million Initiative to Support Business Education in Underserved Communities",
    excerpt: "Three-year program will provide scholarships, mentoring, and resources to develop next generation of business leaders.",
    content: "WASHINGTON, D.C., March 1, 2025 — The The CIO Vision Foundation today announced a $5 million initiative to expand business education opportunities in underserved communities across the United States and select international markets.\n\nThe three-year program will provide scholarships, mentoring, educational resources, and internship opportunities to students from underrepresented backgrounds pursuing business and technology education. The initiative aims to support 500 students through direct scholarships while reaching thousands more through digital learning resources and community programs.\n\n\"Creating pathways to opportunity is central to our foundation's mission,\" said Elizabeth Taylor, President of the The CIO Vision Foundation. \"This initiative represents our commitment to developing diverse talent and ensuring that future business leadership reflects the communities these organizations serve.\"\n\nThe program includes partnerships with 15 universities and community colleges, along with online learning platforms to extend reach. In addition to financial support, scholarship recipients will participate in leadership development workshops and be matched with executive mentors from The CIO Vision's professional network.\n\n\"By combining financial support with mentorship and practical learning experiences, we're building a comprehensive program that addresses the multiple barriers facing many talented students,\" said David Williams, Education Program Director at the The CIO Vision Foundation.\n\nApplications for the first cohort of scholarship recipients will open on April 15, with selections to be announced in June for the upcoming academic year.",
    date: "2025-03-01",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob2xhcnNoaXB8ZW58MHx8MHx8fDA%3D",
    category: "Corporate Responsibility",
    slug: "business-education-initiative-underserved-communities",
    author: "Elizabeth Taylor"
  },
  {
    id: "8",
    title: "The CIO Vision Releases 2025 Global Business Leaders Survey Results",
    excerpt: "Annual research reveals shifting priorities with increased focus on technological transformation and sustainability.",
    content: "LONDON, February 22, 2025 — The CIO Vision today released the results of its 2025 Global Business Leaders Survey, providing a comprehensive view of executive priorities, challenges, and strategic focus areas across industries and regions.\n\nThe annual research, which surveyed over 3,500 C-suite executives from 45 countries, reveals significant shifts in leadership priorities compared to previous years. Technology-enabled business transformation emerged as the top strategic priority (cited by 68% of respondents), followed by sustainability and ESG initiatives (61%), and workforce transformation (57%).\n\n\"This year's survey results reflect the complex, interconnected challenges facing business leaders in a rapidly evolving global landscape,\" said Thomas Anderson, Chief Research Officer at The CIO Vision. \"We're seeing a notable convergence of technology strategy with sustainability objectives, as organizations recognize the role of digital innovation in achieving environmental and social goals.\"\n\nThe survey also identified significant concerns, with 72% of executives expressing worry about the pace of technological change, 65% citing cybersecurity risks, and 58% highlighting talent shortages in critical areas.\n\nRegional variations were pronounced in some areas, with European leaders placing higher emphasis on sustainability initiatives, while North American executives prioritized technological innovation, and Asia-Pacific leaders focused more intensely on supply chain resilience.\n\n\"The insights from this year's survey provide a valuable roadmap for organizations as they navigate uncertainty and capitalize on emerging opportunities,\" added Anderson. \"We're making the detailed findings available to help inform strategic planning and investment decisions.\"\n\nThe complete 2025 Global Business Leaders Survey report is available through the The CIO Vision Research Portal, with an executive summary accessible to the public.",
    date: "2025-02-22",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZpbmFuY2V8ZW58MHx8MHx8fDA%3D",
    category: "Research Publication",
    slug: "global-business-leaders-survey-2025",
    author: "Thomas Anderson"
  }
];

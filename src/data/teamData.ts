
export interface TeamMember {
  id: number;
  name: string;
  title: string;
  bio: string;
  image: string;
}

export const teamData: TeamMember[] = [
  {
    id: 1,
    name: "Maria Rodriguez",
    title: "Chief Executive Officer",
    bio: "Maria brings over 20 years of leadership experience in business intelligence and market research. Under her vision, InsightsBW has grown to become a leading source of business insights across global markets.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHByb2Zlc3Npb25hbCUyMGluZGlhbiUyMHdvbWFufGVufDB8fDB8fHww"
  },
  {
    id: 2,
    name: "Thomas Anderson",
    title: "Chief Research Officer",
    bio: "Thomas oversees InsightsBW's comprehensive research methodologies and ensures the highest standards of analytical rigor across all publications and advisory services.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2Zlc3Npb25hbCUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 3,
    name: "Jennifer Kumar",
    title: "Chief Content Officer",
    bio: "Jennifer leads the development of InsightsBW's editorial strategy across digital and print platforms, ensuring our content delivers actionable value to business leaders worldwide.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2Zlc3Npb25hbCUyMHdvbWFufGVufDB8fDB8fHww"
  },
  {
    id: 4,
    name: "Michael Chen",
    title: "Chief Technology Officer",
    bio: "Michael drives InsightsBW's digital transformation, implementing advanced analytics platforms that power our research insights and client delivery systems.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZmVzc2lvbmFsJTIwbWFufGVufDB8fDB8fHww"
  },
  {
    id: 5,
    name: "Sarah Johnson",
    title: "Sustainability Practice Leader",
    bio: "Sarah directs InsightsBW's research and advisory services related to environmental, social, and governance (ESG) strategies across global markets and industries.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmVzc2lvbmFsJTIwd29tYW58ZW58MHx8MHx8fDA%3D"
  },
  {
    id: 6,
    name: "David Williams",
    title: "Technology Sector Lead",
    bio: "David leads InsightsBW's technology industry practice, analyzing emerging trends and their business implications for technology providers and enterprise technology leaders.",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHByb2Zlc3Npb25hbCUyMGluZGlhbiUyMHdvbWFufGVufDB8fDB8fHww"
  },
  {
    id: 7,
    name: "James Wilson",
    title: "Director of Leadership Services",
    bio: "James oversees InsightsBW's executive development programs, bringing extensive experience in leadership coaching and organizational transformation.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHByb2Zlc3Npb25hbCUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 8,
    name: "Robert Kim",
    title: "Vice President of Global Markets",
    bio: "Robert leads InsightsBW's international expansion, developing market-specific research capabilities and client relationships across Asia, Europe, and emerging markets.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZmVzc2lvbmFsJTIwbWFufGVufDB8fDB8fHww"
  }
];

export const companyInfo = {
  mission: "To provide business leaders with actionable intelligence that drives innovation, sustainability, and growth in a rapidly changing global landscape.",
  vision: "To be the most trusted source of insights guiding business transformation and leadership excellence worldwide.",
  about: "InsightsBW is a premier business intelligence and market research firm dedicated to helping organizations navigate complex challenges and capitalize on emerging opportunities. Our team of experienced analysts, researchers, and industry experts delivers proprietary insights through our publications, advisory services, and leadership development programs.\n\nFounded in 2015, InsightsBW has grown to serve clients in over 40 countries, with specialized practices in technology, financial services, healthcare, manufacturing, and retail sectors. Our unique approach combines rigorous data analysis with deep industry expertise to deliver actionable intelligence that drives business impact.\n\nOur headquarters in New York is complemented by offices in London, Singapore, Dubai, and São Paulo, allowing us to provide global perspective with regional expertise. What sets us apart is our commitment to not just identify trends, but to provide practical frameworks for implementing change and measuring outcomes.",
  values: [
    "Intelligence with Impact: We deliver insights that lead to meaningful action and measurable results.",
    "Rigorous Analysis: Our research methodologies meet the highest standards of analytical excellence.",
    "Forward-Looking Perspective: We focus on emerging trends that will shape the future business landscape.",
    "Client-Centered Approach: Our success is measured by the value we create for the organizations we serve.",
    "Diversity of Thought: We bring together diverse experiences and perspectives to develop richer insights."
  ]
};

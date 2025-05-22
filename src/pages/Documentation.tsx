
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Copy, Check, Code, FileJson, BookOpen } from "lucide-react";

const Documentation = () => {
  // Track which items are expanded
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Code block for syntax highlighting
  const CodeBlock = ({ language = "json", children }: { language?: string; children: React.ReactNode }) => {
    const [copied, setCopied] = useState(false);
    
    const copyToClipboard = () => {
      const text = children?.toString() || "";
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    
    return (
      <div className="relative mt-4 mb-8">
        <div className="absolute right-4 top-4">
          <button 
            onClick={copyToClipboard} 
            className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        </div>
        <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto">
          <code className={`language-${language}`}>{children}</code>
        </pre>
      </div>
    );
  };

  // Expandable section component
  const ExpandableSection = ({ 
    id,
    title, 
    children,
    defaultExpanded = false,
    className
  }: { 
    id: string;
    title: string; 
    children: React.ReactNode;
    defaultExpanded?: boolean;
    className?: string;
  }) => {
    // Use the id to track expansion state
    const isExpanded = expandedItems[id] === undefined ? defaultExpanded : expandedItems[id];
    
    return (
      <div className={cn("border border-gray-200 rounded-lg mb-4", className)}>
        <button
          onClick={() => toggleItem(id)}
          className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 rounded-t-lg transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {isExpanded && (
          <div className="p-4 pt-0 border-t border-gray-200">
            {children}
          </div>
        )}
      </div>
    );
  };

  // Renders API parameter table
  const ParameterTable = ({ parameters }: { parameters: { name: string; type: string; description: string; required?: boolean }[] }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b">Parameter</th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b">Type</th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b">Required</th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b">Description</th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((param, i) => (
            <tr key={i} className="border-b">
              <td className="px-4 py-2 font-medium text-gray-900">{param.name}</td>
              <td className="px-4 py-2 text-gray-700 font-mono text-sm">{param.type}</td>
              <td className="px-4 py-2 text-gray-700">{param.required === false ? "No" : "Yes"}</td>
              <td className="px-4 py-2 text-gray-700">{param.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">InsightsBW Documentation</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive documentation for developers working with the InsightsBW platform, 
            API, and components.
          </p>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BookOpen size={16} /> Overview
              </TabsTrigger>
              <TabsTrigger value="architecture" className="flex items-center gap-2">
                <FileJson size={16} /> Architecture
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-2">
                <Code size={16} /> API Reference
              </TabsTrigger>
              <TabsTrigger value="components" className="flex items-center gap-2">
                <FileJson size={16} /> Components
              </TabsTrigger>
              <TabsTrigger value="guidelines" className="flex items-center gap-2">
                <BookOpen size={16} /> Guidelines
              </TabsTrigger>
            </TabsList>
          </div>
        
          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">InsightsBW Platform Overview</h2>
              <p className="text-gray-700 mb-6">
                InsightsBW is a comprehensive business intelligence and insights platform designed for C-suite executives, 
                business leaders, and industry professionals seeking data-driven insights and strategic guidance.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Core Features</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Digital magazines with exclusive executive interviews and industry insights</li>
                <li>News and analysis articles covering emerging business trends</li>
                <li>Leadership profiles and thought-leader content</li>
                <li>Press releases and corporate communications</li>
                <li>Research reports and white papers</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">Technology Stack</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><span className="font-medium">Frontend:</span> React, TypeScript, Tailwind CSS</li>
                <li><span className="font-medium">UI Components:</span> shadcn/ui, Lucide Icons</li>
                <li><span className="font-medium">State Management:</span> React Query</li>
                <li><span className="font-medium">Routing:</span> React Router</li>
                <li><span className="font-medium">PDF Handling:</span> react-pdf</li>
                <li><span className="font-medium">Data Visualization:</span> Recharts</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Structure and Flow</h2>
              <p className="text-gray-700 mb-6">
                The InsightsBW platform consists of several key sections, each serving a specific purpose within the overall user experience.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Main Sections</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-md">
                  <h4 className="font-medium text-gray-900">Home Page</h4>
                  <p className="text-gray-700">Entry point featuring latest content, featured articles, and section navigation.</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-md">
                  <h4 className="font-medium text-gray-900">Magazine Section</h4>
                  <p className="text-gray-700">Collection of digital publications with industry insights, categorized by topic.</p>
                  <p className="text-gray-600 text-sm mt-2">URL Pattern: /magazine and /magazine/:slug</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-md">
                  <h4 className="font-medium text-gray-900">Articles</h4>
                  <p className="text-gray-700">Individual insight pieces on specific business topics and trends.</p>
                  <p className="text-gray-600 text-sm mt-2">URL Pattern: /article/:slug</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-md">
                  <h4 className="font-medium text-gray-900">Leadership Profiles</h4>
                  <p className="text-gray-700">Profiles of business leaders and industry experts with their insights and experiences.</p>
                  <p className="text-gray-600 text-sm mt-2">URL Pattern: /leadership and /leadership/:slug</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-md">
                  <h4 className="font-medium text-gray-900">Press Releases</h4>
                  <p className="text-gray-700">Corporate announcements, news, and updates.</p>
                  <p className="text-gray-600 text-sm mt-2">URL Pattern: /press-releases and /press-releases/:slug</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-md">
                  <h4 className="font-medium text-gray-900">About & Contact</h4>
                  <p className="text-gray-700">Company information and contact methods.</p>
                  <p className="text-gray-600 text-sm mt-2">URL Pattern: /about and /contact</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-md">
                  <h4 className="font-medium text-gray-900">Documentation</h4>
                  <p className="text-gray-700">Technical documentation for developers and integrators.</p>
                  <p className="text-gray-600 text-sm mt-2">URL Pattern: /documentation</p>
                </div>
              </div>
            </div>
          </TabsContent>
        
          {/* ARCHITECTURE TAB */}
          <TabsContent value="architecture" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Architecture</h2>
              <p className="text-gray-700 mb-6">
                InsightsBW follows a modern React component-based architecture with a focus on reusability, 
                maintainability, and performance.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Directory Structure</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 overflow-x-auto">
<pre className="text-sm">
{`src/
├── components/
│   ├── layout/         # Core layout components
│   │   ├── Layout.tsx  # Main application layout
│   │   ├── Navbar.tsx  # Navigation bar
│   │   └── Footer.tsx  # Footer component
│   ├── ui/             # UI component library (shadcn/ui)
│   └── chat/           # Chat and interactive components
├── pages/              # Page components
│   ├── Home.tsx        # Home page
│   ├── Magazine.tsx    # Magazine listing page
│   ├── MagazineDetail.tsx  # Single magazine view
│   └── ...             # Other page components
├── data/               # Data models and static data
│   ├── magazineData.ts # Magazine content
│   ├── newsData.ts     # Articles and news
│   └── ...             # Other data sources
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
└── App.tsx             # Main application component with routing`}
</pre>
              </div>
              
              <h3 className="text-xl font-semibold mb-3">Data Flow</h3>
              <p className="text-gray-700 mb-4">
                The application follows a unidirectional data flow pattern:
              </p>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 p-4 border border-gray-200 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">Data Sources</h4>
                  <p className="text-gray-700">Static data files for development, API endpoints in production.</p>
                </div>
                <div className="flex-1 p-4 border border-gray-200 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">State Management</h4>
                  <p className="text-gray-700">React Query for server state, React hooks for local UI state.</p>
                </div>
                <div className="flex-1 p-4 border border-gray-200 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">UI Components</h4>
                  <p className="text-gray-700">Render data and handle user interactions.</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3">Component Architecture</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li><span className="font-medium">Page Components:</span> High-level components with their own routes</li>
                <li><span className="font-medium">Feature Components:</span> Complex UI elements with business logic</li>
                <li><span className="font-medium">UI Components:</span> Reusable presentational components</li>
                <li><span className="font-medium">Layout Components:</span> Structure and organize the UI</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">Routing</h3>
              <p className="text-gray-700 mb-4">
                The application uses React Router for client-side routing with the following pattern:
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
<pre className="text-sm">
{`// Primary routes
/                           # Home page
/magazine                   # Magazine listing
/magazine/:slug             # Magazine detail page by slug
/article/:slug              # Article detail page by slug
/leadership                 # Leadership listing page
/leadership/:slug           # Leadership profile page by slug
/press-releases             # Press releases listing
/press-releases/:slug       # Press release detail page by slug
/about                      # About page
/contact                    # Contact page
/documentation              # Documentation page`}
</pre>
              </div>
            </div>
          </TabsContent>
        
          {/* API REFERENCE TAB */}
          <TabsContent value="api" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">API Reference</h2>
              <p className="text-gray-700 mb-8">
                The InsightsBW API provides access to magazines, articles, leadership profiles, 
                and press releases. All endpoints return JSON responses and support standard HTTP methods.
              </p>
              
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Base URL</h3>
                  <p className="font-mono bg-white p-2 rounded border border-blue-100">
                    https://api.insightsbw.com/v1
                  </p>
                  <p className="text-sm text-blue-700 mt-2">
                    All API requests must use HTTPS and include the base URL.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Authentication</h3>
                  <p className="text-green-700 mb-2">
                    All API requests require an API key passed in the header.
                  </p>
                  <div className="font-mono bg-white p-2 rounded border border-green-100">
                    <p>Authorization: Bearer YOUR_API_KEY</p>
                  </div>
                </div>
                
                {/* Articles Endpoints */}
                <ExpandableSection id="articles-endpoints" title="Articles Endpoints">
                  <p className="text-gray-700 mb-4">
                    Access and retrieve article content with the following endpoints.
                  </p>
                  
                  <ExpandableSection 
                    id="articles-get-params"
                    title="GET /articles"
                    className="ml-4 border-gray-100"
                  >
                    <p className="text-gray-700 mb-3">
                      Returns a paginated list of articles that can be filtered by category.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Query Parameters</h4>
                    <ParameterTable parameters={[
                      { name: "page", type: "number", description: "Page number for pagination", required: false },
                      { name: "limit", type: "number", description: "Number of items per page (max: 50)", required: false },
                      { name: "category", type: "string", description: "Filter by article category", required: false },
                      { name: "sort", type: "string", description: "Sort field (date, title)", required: false },
                      { name: "order", type: "string", description: "Sort order (asc, desc)", required: false }
                    ]} />
                    
                    <h4 className="font-semibold text-gray-800 mt-4 mb-2">Example Request</h4>
                    <CodeBlock language="javascript">
{`fetch("https://api.insightsbw.com/v1/articles?page=1&limit=10&category=technology", {
  method: "GET",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  }
})`}
                    </CodeBlock>
                  </ExpandableSection>
                  
                  <ExpandableSection 
                    id="articles-get-response"
                    title="GET /articles Response"
                    className="ml-4 border-gray-100"
                  >
                    <h4 className="font-semibold text-gray-800 mb-2">Response Example</h4>
                    <CodeBlock language="json">
{`{
  "status": "success",
  "data": {
    "articles": [
      {
        "id": 1,
        "title": "AI-Driven Business Strategies",
        "slug": "ai-driven-business-strategies",
        "author": "Dr. Emily Carter",
        "date": "2025-04-01",
        "category": "technology",
        "excerpt": "How artificial intelligence is transforming business decision-making processes.",
        "image": "https://example.com/images/ai-business.jpg"
      },
      {
        "id": 2,
        "title": "The Role of IoT in Smart Cities",
        "slug": "role-of-iot-in-smart-cities",
        "author": "Michael Lee",
        "date": "2025-03-28",
        "category": "technology",
        "excerpt": "Exploring the impact of the Internet of Things on urban development and sustainability.",
        "image": "https://example.com/images/iot-cities.jpg"
      }
      // More articles...
    ],
    "pagination": {
      "total": 42,
      "pages": 5,
      "current_page": 1,
      "limit": 10
    }
  }
}`}
                    </CodeBlock>
                  </ExpandableSection>
                  
                  <ExpandableSection 
                    id="article-get-response" 
                    title="GET /articles/:slug"
                    className="ml-4 border-gray-100"
                  >
                    <p className="text-gray-700 mb-3">
                      Returns detailed information for a specific article by its slug.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Path Parameters</h4>
                    <ParameterTable parameters={[
                      { name: "slug", type: "string", description: "Unique article slug identifier", required: true }
                    ]} />
                    
                    <h4 className="font-semibold text-gray-800 mt-4 mb-2">Example Request</h4>
                    <CodeBlock language="javascript">
{`fetch("https://api.insightsbw.com/v1/articles/ai-driven-business-strategies", {
  method: "GET",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  }
})`}
                    </CodeBlock>
                    
                    <h4 className="font-semibold text-gray-800 mt-4 mb-2">Response Example</h4>
                    <CodeBlock language="json">
{`{
  "status": "success",
  "data": {
    "article": {
      "id": 1,
      "title": "AI-Driven Business Strategies",
      "slug": "ai-driven-business-strategies",
      "author": "Dr. Emily Carter",
      "date": "2025-04-01",
      "category": "technology",
      "excerpt": "How artificial intelligence is transforming business decision-making processes.",
      "content": "Artificial intelligence is fundamentally changing how businesses operate and make decisions. In this article, we explore...",
      "image": "https://example.com/images/ai-business.jpg",
      "read_time": 5,
      "tags": ["AI", "Business Strategy", "Technology"],
      "related_articles": [
        {
          "id": 5,
          "title": "Machine Learning for Business Forecasting",
          "slug": "machine-learning-business-forecasting",
          "excerpt": "How predictive analytics are revolutionizing business planning."
        }
        // More related articles...
      ]
    }
  }
}`}
                    </CodeBlock>
                  </ExpandableSection>
                </ExpandableSection>
                
                {/* Magazines Endpoints */}
                <ExpandableSection id="magazines-endpoints" title="Magazines Endpoints">
                  <p className="text-gray-700 mb-4">
                    Access and retrieve magazine content with the following endpoints.
                  </p>
                  
                  <ExpandableSection 
                    id="magazines-get-response"
                    title="GET /magazines"
                    className="ml-4 border-gray-100"
                  >
                    <p className="text-gray-700 mb-3">
                      Returns a paginated list of magazines that can be filtered by category.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Query Parameters</h4>
                    <ParameterTable parameters={[
                      { name: "page", type: "number", description: "Page number for pagination", required: false },
                      { name: "limit", type: "number", description: "Number of items per page (max: 20)", required: false },
                      { name: "category", type: "string", description: "Filter by magazine category", required: false },
                      { name: "sort", type: "string", description: "Sort field (publicationDate, title)", required: false },
                      { name: "order", type: "string", description: "Sort order (asc, desc)", required: false }
                    ]} />
                    
                    <h4 className="font-semibold text-gray-800 mt-4 mb-2">Response Example</h4>
                    <CodeBlock language="json">
{`{
  "status": "success",
  "data": {
    "magazines": [
      {
        "id": 1,
        "title": "The Future of Digital Transformation",
        "slug": "future-of-digital-transformation",
        "description": "Explore how companies are leveraging artificial intelligence, IoT, and cloud computing...",
        "category": "technology",
        "publicationDate": "April 2025",
        "coverImage": "https://example.com/covers/digital-transformation.jpg",
        "articlesCount": 3
      },
      {
        "id": 2,
        "title": "Sustainable Business Practices",
        "slug": "sustainable-business-practices",
        "description": "Discover how leading organizations are implementing sustainable practices...",
        "category": "sustainability",
        "publicationDate": "March 2025",
        "coverImage": "https://example.com/covers/sustainability.jpg",
        "articlesCount": 3
      }
      // More magazines...
    ],
    "pagination": {
      "total": 8,
      "pages": 1,
      "current_page": 1,
      "limit": 20
    }
  }
}`}
                    </CodeBlock>
                  </ExpandableSection>
                  
                  <ExpandableSection 
                    id="magazine-get-response"
                    title="GET /magazines/:slug"
                    className="ml-4 border-gray-100"
                  >
                    <p className="text-gray-700 mb-3">
                      Returns detailed information for a specific magazine by its slug.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Path Parameters</h4>
                    <ParameterTable parameters={[
                      { name: "slug", type: "string", description: "Unique magazine slug identifier", required: true }
                    ]} />
                    
                    <h4 className="font-semibold text-gray-800 mt-4 mb-2">Response Example</h4>
                    <CodeBlock language="json">
{`{
  "status": "success",
  "data": {
    "magazine": {
      "id": 1,
      "title": "The Future of Digital Transformation",
      "slug": "future-of-digital-transformation",
      "description": "Explore how companies are leveraging artificial intelligence, IoT, and cloud computing...",
      "category": "technology",
      "publicationDate": "April 2025",
      "coverImage": "https://example.com/covers/digital-transformation.jpg",
      "pdfUrl": "https://example.com/magazines/digital-transformation.pdf",
      "articles": [
        {
          "id": 101,
          "title": "AI-Driven Business Strategies",
          "slug": "ai-driven-business-strategies",
          "author": "Dr. Emily Carter",
          "excerpt": "How artificial intelligence is transforming business decision-making processes.",
          "pageNumber": 4,
          "thumbnailImage": "https://example.com/articles/ai-business-thumb.jpg"
        },
        {
          "id": 102,
          "title": "The Role of IoT in Smart Cities",
          "slug": "role-of-iot-in-smart-cities",
          "author": "Michael Lee",
          "excerpt": "Exploring the impact of the Internet of Things on urban development and sustainability.",
          "pageNumber": 12,
          "thumbnailImage": "https://example.com/articles/iot-cities-thumb.jpg"
        }
        // More articles...
      ]
    }
  }
}`}
                    </CodeBlock>
                  </ExpandableSection>
                </ExpandableSection>
                
                {/* Leadership Endpoints */}
                <ExpandableSection id="leadership-endpoints" title="Leadership Endpoints">
                  <p className="text-gray-700 mb-4">
                    Access and retrieve leadership profiles with the following endpoints.
                  </p>
                  
                  <ExpandableSection 
                    id="leaders-get-response"
                    title="GET /leaders"
                    className="ml-4 border-gray-100"
                  >
                    <p className="text-gray-700 mb-3">
                      Returns a paginated list of leadership profiles.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Query Parameters</h4>
                    <ParameterTable parameters={[
                      { name: "page", type: "number", description: "Page number for pagination", required: false },
                      { name: "limit", type: "number", description: "Number of items per page (max: 50)", required: false },
                      { name: "industry", type: "string", description: "Filter by industry", required: false },
                      { name: "role", type: "string", description: "Filter by role (CEO, CTO, etc.)", required: false }
                    ]} />
                    
                    <h4 className="font-semibold text-gray-800 mt-4 mb-2">Response Example</h4>
                    <CodeBlock language="json">
{`{
  "status": "success",
  "data": {
    "leaders": [
      {
        "id": 1,
        "name": "Maria Rodriguez",
        "slug": "maria-rodriguez",
        "title": "CEO, InsightsBW",
        "company": "InsightsBW",
        "industry": "Business Intelligence",
        "summary": "Over 20 years of experience in business intelligence and market analysis.",
        "image": "https://example.com/leaders/maria-rodriguez.jpg"
      },
      {
        "id": 2,
        "name": "James Wilson",
        "slug": "james-wilson",
        "title": "CTO, TechVision",
        "company": "TechVision Inc.",
        "industry": "Technology",
        "summary": "Leading technology innovation with a focus on AI and machine learning.",
        "image": "https://example.com/leaders/james-wilson.jpg"
      }
      // More leaders...
    ],
    "pagination": {
      "total": 28,
      "pages": 3,
      "current_page": 1,
      "limit": 10
    }
  }
}`}
                    </CodeBlock>
                  </ExpandableSection>
                  
                  <ExpandableSection 
                    id="leader-get-response"
                    title="GET /leaders/:slug"
                    className="ml-4 border-gray-100"
                  >
                    <p className="text-gray-700 mb-3">
                      Returns detailed information for a specific leadership profile by slug.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Path Parameters</h4>
                    <ParameterTable parameters={[
                      { name: "slug", type: "string", description: "Unique leader slug identifier", required: true }
                    ]} />
                    
                    <h4 className="font-semibold text-gray-800 mt-4 mb-2">Response Example</h4>
                    <CodeBlock language="json">
{`{
  "status": "success",
  "data": {
    "leader": {
      "id": 1,
      "name": "Maria Rodriguez",
      "slug": "maria-rodriguez",
      "title": "CEO",
      "company": "InsightsBW",
      "industry": "Business Intelligence",
      "bio": "Maria Rodriguez has over 20 years of experience in business intelligence and market analysis...",
      "image": "https://example.com/leaders/maria-rodriguez.jpg",
      "expertise": ["Business Strategy", "Market Analysis", "Executive Leadership"],
      "education": [
        {
          "degree": "MBA",
          "institution": "Harvard Business School",
          "year": "2005"
        },
        {
          "degree": "Bachelor of Science in Economics",
          "institution": "University of Pennsylvania",
          "year": "1999"
        }
      ],
      "articles": [
        {
          "id": 42,
          "title": "The Future of Business Intelligence",
          "slug": "future-of-business-intelligence",
          "date": "2025-02-15"
        }
        // More articles...
      ],
      "quotes": [
        {
          "text": "In today's data-rich environment, the competitive advantage lies not in having information, but in extracting meaningful insights from it.",
          "source": "InsightsBW Annual Conference, 2024"
        }
        // More quotes...
      ]
    }
  }
}`}
                    </CodeBlock>
                  </ExpandableSection>
                </ExpandableSection>
                
                {/* Press Releases Endpoints */}
                <ExpandableSection id="press-endpoints" title="Press Releases Endpoints">
                  <p className="text-gray-700 mb-4">
                    Access and retrieve press releases with the following endpoints.
                  </p>
                  
                  <ExpandableSection 
                    id="press-get-params"
                    title="GET /press-releases"
                    className="ml-4 border-gray-100"
                  >
                    <p className="text-gray-700 mb-3">
                      Returns a paginated list of press releases that can be filtered by category.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Query Parameters</h4>
                    <ParameterTable parameters={[
                      { name: "page", type: "number", description: "Page number for pagination", required: false },
                      { name: "limit", type: "number", description: "Number of items per page (max: 50)", required: false },
                      { name: "category", type: "string", description: "Filter by press release category", required: false },
                      { name: "startDate", type: "string", description: "Filter by date range start (YYYY-MM-DD)", required: false },
                      { name: "endDate", type: "string", description: "Filter by date range end (YYYY-MM-DD)", required: false }
                    ]} />
                    
                    <h4 className="font-semibold text-gray-800 mt-4 mb-2">Example Request</h4>
                    <CodeBlock language="javascript">
{`fetch("https://api.insightsbw.com/v1/press-releases?category=Partnership&limit=5", {
  method: "GET",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  }
})`}
                    </CodeBlock>
                  </ExpandableSection>
                  
                  <ExpandableSection 
                    id="press-get-response"
                    title="GET /press-releases Response"
                    className="ml-4 border-gray-100"
                  >
                    <h4 className="font-semibold text-gray-800 mb-2">Response Example</h4>
                    <CodeBlock language="json">
{`{
  "status": "success",
  "data": {
    "pressReleases": [
      {
        "id": 1,
        "title": "InsightsBW Launches Advanced Analytics Platform for Business Intelligence",
        "slug": "insightsbw-launches-advanced-analytics-platform",
        "date": "2025-04-15",
        "category": "Product Launch",
        "excerpt": "New cloud-based solution provides enterprises with real-time market insights and predictive trend analysis.",
        "image": "https://example.com/press/analytics-platform.jpg"
      },
      {
        "id": 4,
        "title": "InsightsBW Partners with Global Sustainability Alliance to Advance ESG Reporting Standards",
        "slug": "global-sustainability-alliance-partnership",
        "date": "2025-03-22",
        "category": "Partnership",
        "excerpt": "Collaboration aims to develop comprehensive framework for measuring and reporting environmental and social impact.",
        "image": "https://example.com/press/sustainability-partnership.jpg"
      }
      // More press releases...
    ],
    "pagination": {
      "total": 8,
      "pages": 2,
      "current_page": 1,
      "limit": 5
    }
  }
}`}
                    </CodeBlock>
                  </ExpandableSection>
                  
                  <ExpandableSection 
                    id="press-single-response"
                    title="GET /press-releases/:slug"
                    className="ml-4 border-gray-100"
                  >
                    <p className="text-gray-700 mb-3">
                      Returns detailed information for a specific press release by its slug.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Path Parameters</h4>
                    <ParameterTable parameters={[
                      { name: "slug", type: "string", description: "Unique press release slug identifier", required: true }
                    ]} />
                    
                    <h4 className="font-semibold text-gray-800 mt-4 mb-2">Response Example</h4>
                    <CodeBlock language="json">
{`{
  "status": "success",
  "data": {
    "pressRelease": {
      "id": 1,
      "title": "InsightsBW Launches Advanced Analytics Platform for Business Intelligence",
      "slug": "insightsbw-launches-advanced-analytics-platform",
      "date": "2025-04-15",
      "category": "Product Launch",
      "excerpt": "New cloud-based solution provides enterprises with real-time market insights and predictive trend analysis.",
      "content": "BOSTON, April 15, 2025 — InsightsBW today announced the launch of InsightsBW Analytics, an advanced cloud-based platform designed to provide enterprises with real-time market intelligence and predictive trend analysis. The new offering combines proprietary data models with artificial intelligence to deliver actionable insights across industries...",
      "image": "https://example.com/press/analytics-platform.jpg",
      "relatedPressReleases": [
        {
          "id": 3,
          "title": "InsightsBW Annual Technology Impact Report Identifies Emerging Trends Reshaping Industries",
          "slug": "technology-impact-report-2025",
          "date": "2025-03-30"
        }
        // More related press releases...
      ]
    }
  }
}`}
                    </CodeBlock>
                  </ExpandableSection>
                </ExpandableSection>
                
                {/* Error Handling */}
                <ExpandableSection id="error-handling" title="Error Handling">
                  <p className="text-gray-700 mb-3">
                    The API uses standard HTTP status codes and returns error objects with details 
                    when something goes wrong.
                  </p>
                  
                  <h4 className="font-semibold text-gray-800 mb-2">Common Error Codes</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b">Status Code</th>
                          <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b">Description</th>
                          <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b">Example Cause</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-2 font-medium text-gray-900">400 Bad Request</td>
                          <td className="px-4 py-2 text-gray-700">Invalid request parameters</td>
                          <td className="px-4 py-2 text-gray-700">Invalid date format, missing required field</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2 font-medium text-gray-900">401 Unauthorized</td>
                          <td className="px-4 py-2 text-gray-700">Authentication failure</td>
                          <td className="px-4 py-2 text-gray-700">Invalid or missing API key</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2 font-medium text-gray-900">403 Forbidden</td>
                          <td className="px-4 py-2 text-gray-700">Insufficient permissions</td>
                          <td className="px-4 py-2 text-gray-700">API key doesn't have access to the resource</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2 font-medium text-gray-900">404 Not Found</td>
                          <td className="px-4 py-2 text-gray-700">Resource not found</td>
                          <td className="px-4 py-2 text-gray-700">Invalid slug or ID</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2 font-medium text-gray-900">429 Too Many Requests</td>
                          <td className="px-4 py-2 text-gray-700">Rate limit exceeded</td>
                          <td className="px-4 py-2 text-gray-700">Too many requests in a given time period</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2 font-medium text-gray-900">500 Internal Server Error</td>
                          <td className="px-4 py-2 text-gray-700">Server-side error</td>
                          <td className="px-4 py-2 text-gray-700">Unexpected server condition</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <h4 className="font-semibold text-gray-800 mt-4 mb-2">Error Response Example</h4>
                  <CodeBlock language="json">
{`{
  "status": "error",
  "error": {
    "code": "resource_not_found",
    "message": "The requested press release could not be found",
    "details": {
      "slug": "invalid-press-release-slug"
    }
  }
}`}
                  </CodeBlock>
                </ExpandableSection>
              </div>
            </div>
          </TabsContent>
        
          {/* COMPONENTS TAB */}
          <TabsContent value="components" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Component Library</h2>
              <p className="text-gray-700 mb-6">
                InsightsBW uses a consistent set of UI components based on the shadcn/ui library to 
                create a cohesive and accessible user interface.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Layout Components</h3>
                  <ul className="space-y-1 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-green-100 border border-green-400 mr-2"></span>
                      Layout.tsx
                    </li>
                    <li className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-green-100 border border-green-400 mr-2"></span>
                      Navbar.tsx
                    </li>
                    <li className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-green-100 border border-green-400 mr-2"></span>
                      Footer.tsx
                    </li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Interactive Components</h3>
                  <ul className="space-y-1 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-blue-100 border border-blue-400 mr-2"></span>
                      Button
                    </li>
                    <li className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-blue-100 border border-blue-400 mr-2"></span>
                      Tabs
                    </li>
                    <li className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-blue-100 border border-blue-400 mr-2"></span>
                      Pagination
                    </li>
                    <li className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-blue-100 border border-blue-400 mr-2"></span>
                      ChatBot
                    </li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Display Components</h3>
                  <ul className="space-y-1 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-purple-100 border border-purple-400 mr-2"></span>
                      Card
                    </li>
                    <li className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-purple-100 border border-purple-400 mr-2"></span>
                      Carousel
                    </li>
                    <li className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-purple-100 border border-purple-400 mr-2"></span>
                      Table
                    </li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Feedback Components</h3>
                  <ul className="space-y-1 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-yellow-100 border border-yellow-400 mr-2"></span>
                      Toast
                    </li>
                    <li className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-yellow-100 border border-yellow-400 mr-2"></span>
                      Alert
                    </li>
                    <li className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-yellow-100 border border-yellow-400 mr-2"></span>
                      Dialog
                    </li>
                  </ul>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Component Usage Example</h3>
              <CodeBlock language="typescript">
{`import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Share2 } from 'lucide-react';

const ShareButton = () => {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Article link copied to clipboard",
      duration: 3000,
    });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="h-4 w-4 mr-1" /> Share
    </Button>
  );
};`}
              </CodeBlock>
            </div>
          </TabsContent>
        
          {/* GUIDELINES TAB */}
          <TabsContent value="guidelines" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Development Guidelines</h2>
              <p className="text-gray-700 mb-6">
                Follow these guidelines when working with the InsightsBW codebase to maintain 
                consistency and quality.
              </p>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Code Style</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Use TypeScript for all new components and features</li>
                    <li>Follow the ESLint configuration present in the project</li>
                    <li>Use proper typing for components, props, and functions</li>
                    <li>Organize imports alphabetically</li>
                    <li>Use named exports for components</li>
                    <li>Keep components focused and single-purpose</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Component Structure</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>One component per file</li>
                    <li>Use functional components with hooks</li>
                    <li>Place related components in the same directory</li>
                    <li>Use explicit prop typing with interfaces</li>
                    <li>Include proper comments for complex logic</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">State Management</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Use React Query for server state management</li>
                    <li>Keep local UI state close to where it's used</li>
                    <li>Extract complex state logic into custom hooks</li>
                    <li>Avoid prop drilling by using context where appropriate</li>
                    <li>Implement proper error handling and loading states</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Performance</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Memoize expensive calculations and renders with useMemo and useCallback</li>
                    <li>Implement virtualization for long lists</li>
                    <li>Use proper image optimization</li>
                    <li>Implement code-splitting for large components</li>
                    <li>Minimize re-renders by managing state efficiently</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Accessibility</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Use semantic HTML elements</li>
                    <li>Include proper ARIA attributes</li>
                    <li>Ensure keyboard navigation works</li>
                    <li>Maintain sufficient color contrast</li>
                    <li>Test with screen readers</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ</h2>
              
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I create a new page?</h3>
                  <p className="text-gray-700">
                    Create a new component in the <code className="text-sm bg-gray-100 px-1 py-0.5 rounded">pages</code> directory and add its route to <code className="text-sm bg-gray-100 px-1 py-0.5 rounded">App.tsx</code>.
                  </p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">How should I handle API calls?</h3>
                  <p className="text-gray-700">
                    Use React Query hooks in the component or create custom hooks in the <code className="text-sm bg-gray-100 px-1 py-0.5 rounded">hooks</code> directory.
                  </p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Where should I add new data models?</h3>
                  <p className="text-gray-700">
                    Add new interfaces and types to the appropriate file in the <code className="text-sm bg-gray-100 px-1 py-0.5 rounded">data</code> directory.
                  </p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I create a new UI component?</h3>
                  <p className="text-gray-700">
                    Follow the shadcn/ui pattern by creating a new component in the <code className="text-sm bg-gray-100 px-1 py-0.5 rounded">components/ui</code> directory.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I contribute to the documentation?</h3>
                  <p className="text-gray-700">
                    Update the <code className="text-sm bg-gray-100 px-1 py-0.5 rounded">Documentation.tsx</code> component with any new features or changes.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Documentation;


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, ExternalLink, FileCode, FileText, HelpCircle, Layout, Layers, Server } from 'lucide-react';

const Documentation = () => {
  const [activeSection, setActiveSection] = useState<string | null>('overview');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };
  
  const toggleItem = (item: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">InsightsBW Documentation</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive guide to the InsightsBW business magazine website, including architecture, page functionality, and API documentation.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-8 bg-gray-50 rounded-lg shadow p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveSection('overview')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeSection === 'overview' ? 'bg-insightRed text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Layout className="mr-3 h-5 w-5" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveSection('architecture')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeSection === 'architecture' ? 'bg-insightRed text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Layers className="mr-3 h-5 w-5" />
                  Architecture
                </button>
                <button
                  onClick={() => setActiveSection('pageFlow')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeSection === 'pageFlow' ? 'bg-insightRed text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="mr-3 h-5 w-5" />
                  Page Flow & Functionality
                </button>
                <button
                  onClick={() => setActiveSection('api')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeSection === 'api' ? 'bg-insightRed text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Server className="mr-3 h-5 w-5" />
                  API Documentation
                </button>
                <button
                  onClick={() => setActiveSection('components')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeSection === 'components' ? 'bg-insightRed text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileCode className="mr-3 h-5 w-5" />
                  Component Library
                </button>
                <button
                  onClick={() => setActiveSection('faq')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeSection === 'faq' ? 'bg-insightRed text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <HelpCircle className="mr-3 h-5 w-5" />
                  FAQ
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-md">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">InsightsBW Website Overview</h2>
                <p className="mb-4">
                  InsightsBW is a business magazine website built with React, TypeScript, and Tailwind CSS. It provides 
                  a platform for business professionals to access articles, leadership profiles, magazine issues, 
                  and press releases. The website has several key sections:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Home Page</h3>
                    <p>Landing page featuring highlights, featured articles, and navigation to other sections.</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Magazine</h3>
                    <p>Current and archived magazine issues with digital viewing capability.</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Leadership</h3>
                    <p>Profiles of business leaders with their articles and insights.</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Press Releases</h3>
                    <p>Latest news and announcements from featured companies.</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Articles</h3>
                    <p>Detailed articles on business topics, industry trends, and thought leadership.</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">About & Contact</h3>
                    <p>Information about InsightsBW and ways to get in touch with the team.</p>
                  </div>
                </div>
                
                <div className="border-l-4 border-insightRed pl-4 italic bg-gray-50 p-4 my-6">
                  <p className="text-gray-700">
                    InsightsBW serves as a comprehensive business resource for executives, entrepreneurs, and business 
                    professionals looking to stay informed about industry trends, leadership strategies, and business insights.
                  </p>
                </div>
              </div>
            )}

            {/* Architecture Section */}
            {activeSection === 'architecture' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">System Architecture</h2>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Technology Stack</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-bold text-insightRed">Frontend</h4>
                      <ul className="mt-2 space-y-2 list-disc list-inside">
                        <li>React 18.3.x (UI library)</li>
                        <li>TypeScript (Type safety)</li>
                        <li>React Router 6.x (Routing)</li>
                        <li>Tailwind CSS (Styling)</li>
                        <li>shadcn/ui (UI component library)</li>
                        <li>Lucide React (Icons)</li>
                        <li>Recharts (Data visualization)</li>
                        <li>TanStack React Query (Data fetching)</li>
                      </ul>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-bold text-insightRed">Build Tools</h4>
                      <ul className="mt-2 space-y-2 list-disc list-inside">
                        <li>Vite (Build tool)</li>
                        <li>PostCSS (CSS processing)</li>
                        <li>ESLint (Code linting)</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Application Architecture</h3>
                  <div className="bg-gray-50 p-5 rounded-lg mb-6">
                    <h4 className="font-bold mb-2 text-insightRed">Component Structure</h4>
                    <p className="mb-4">
                      The application follows a component-based architecture with the following folder structure:
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
{`insightsbw/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── chat/            # Chat components
│   │   ├── layout/          # Layout components (Navbar, Footer)
│   │   └── ui/              # UI components (shadcn/ui)
│   ├── data/                # Mock data for the application
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── pages/               # Page components for each route
└── public/                  # Static assets`}
                    </pre>
                  </div>
                  
                  <div className="bg-gray-50 p-5 rounded-lg mb-6">
                    <h4 className="font-bold mb-2 text-insightRed">Data Flow</h4>
                    <p>
                      The application currently uses static data imported from files in the <code>data/</code> directory.
                      This simulates API responses but could be replaced with actual API calls in the future.
                    </p>
                    <div className="mt-4 border border-gray-200 rounded-lg p-4">
                      <p className="font-semibold">Data Flow Process:</p>
                      <ol className="mt-2 space-y-2 list-decimal list-inside">
                        <li>Page component requests data</li>
                        <li>Data is imported from corresponding data files</li>
                        <li>Component state is updated with the data</li>
                        <li>UI renders based on the state</li>
                      </ol>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">State Management</h3>
                  <p className="mb-4">
                    The application primarily uses React's built-in state management (useState, useEffect) for component-level state.
                    For more complex data fetching and caching, TanStack React Query is available in the codebase.
                  </p>
                  
                  <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-50 p-4">
                    <h4 className="font-bold text-yellow-700">Future Enhancement</h4>
                    <p className="text-yellow-700">
                      For future development, consider implementing a global state management solution like Redux or Zustand
                      if the application complexity increases.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Page Flow Section */}
            {activeSection === 'pageFlow' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Page Flow & Functionality</h2>
                
                {/* Page Flow Diagram */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">User Flow Diagram</h3>
                  <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    <div className="min-w-[700px]">
                      <pre className="text-sm text-gray-700">
{`Home
  ├─► Magazine ──────┬─► Magazine Detail
  │                  └─► Article Detail
  │
  ├─► Leadership ────┬─► Leadership Profile
  │                  └─► Article Detail
  │
  ├─► Press Releases ─► Press Release Detail
  │
  ├─► Article Detail
  │
  ├─► About
  │
  └─► Contact`}
                      </pre>
                    </div>
                  </div>
                </div>
                
                {/* Page Descriptions */}
                <div className="space-y-8">
                  <div className="border-b pb-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold">Home Page</h3>
                      <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Route: /</span>
                    </div>
                    <p className="mt-2 text-gray-600">
                      The landing page showcases featured content, recent articles, and navigation to other sections of the website.
                    </p>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Key Features:</h4>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
                        <li>Hero section with featured article or magazine issue</li>
                        <li>Latest articles section</li>
                        <li>Leadership highlights</li>
                        <li>Magazine issue showcase</li>
                        <li>Client logos section</li>
                        <li>Newsletter subscription</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-b pb-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold">Magazine Page</h3>
                      <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Route: /magazine</span>
                    </div>
                    <p className="mt-2 text-gray-600">
                      Lists all magazine issues with cover images, publication dates, and brief descriptions.
                    </p>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Key Features:</h4>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
                        <li>Grid display of magazine issues</li>
                        <li>Filtering options by date or topic</li>
                        <li>Click to view detailed magazine information</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-b pb-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold">Magazine Detail Page</h3>
                      <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Route: /magazine/:id</span>
                    </div>
                    <p className="mt-2 text-gray-600">
                      Detailed view of a specific magazine issue with table of contents and PDF viewer.
                    </p>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Key Features:</h4>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
                        <li>Magazine cover display</li>
                        <li>Publication information</li>
                        <li>Table of contents</li>
                        <li>PDF viewer for reading the magazine</li>
                        <li>Links to featured articles</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-b pb-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold">Leadership Page</h3>
                      <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Route: /leadership</span>
                    </div>
                    <p className="mt-2 text-gray-600">
                      Showcases profiles of business leaders and executives with their contributions.
                    </p>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Key Features:</h4>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
                        <li>Featured technology leaders section</li>
                        <li>Leadership philosophy articles</li>
                        <li>Interviews and media coverage</li>
                        <li>Hover cards with brief bios</li>
                        <li>Statistics about featured leaders</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-b pb-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold">Leadership Profile Page</h3>
                      <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Route: /leadership/:id</span>
                    </div>
                    <p className="mt-2 text-gray-600">
                      Detailed profile of a specific business leader with their articles and insights.
                    </p>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Key Features:</h4>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
                        <li>Leader's bio and information</li>
                        <li>Image and company information</li>
                        <li>Articles written by the leader</li>
                        <li>Related leadership profiles</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-b pb-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold">Press Releases Page</h3>
                      <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Route: /press-releases</span>
                    </div>
                    <p className="mt-2 text-gray-600">
                      Collection of press releases from various companies, sorted by date.
                    </p>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Key Features:</h4>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
                        <li>List of press releases with images</li>
                        <li>Filtering by company or category</li>
                        <li>Date and category indicators</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-b pb-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold">Press Release Detail Page</h3>
                      <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Route: /press-releases/:id</span>
                    </div>
                    <p className="mt-2 text-gray-600">
                      Full content of a specific press release with company information.
                    </p>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Key Features:</h4>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
                        <li>Full press release content</li>
                        <li>Company information</li>
                        <li>Publication date and category</li>
                        <li>Featured image</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-b pb-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold">Article Detail Page</h3>
                      <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Route: /article/:id</span>
                    </div>
                    <p className="mt-2 text-gray-600">
                      Full content of an article with author information and related content.
                    </p>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Key Features:</h4>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
                        <li>Article title and featured image</li>
                        <li>Author information and publication date</li>
                        <li>Full article content</li>
                        <li>Social sharing options</li>
                        <li>Related articles section</li>
                        <li>Tags and categories</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-b pb-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold">About Page</h3>
                      <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Route: /about</span>
                    </div>
                    <p className="mt-2 text-gray-600">
                      Information about InsightsBW, its mission, and the team behind it.
                    </p>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Key Features:</h4>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
                        <li>Company mission and values</li>
                        <li>Team member profiles</li>
                        <li>Company history</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-b pb-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold">Contact Page</h3>
                      <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Route: /contact</span>
                    </div>
                    <p className="mt-2 text-gray-600">
                      Contact form and information for reaching out to InsightsBW.
                    </p>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Key Features:</h4>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
                        <li>Contact form</li>
                        <li>Office locations and contact information</li>
                        <li>Subscription options</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold">Chatbot</h3>
                      <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Global Component</span>
                    </div>
                    <p className="mt-2 text-gray-600">
                      Interactive chatbot available across all pages to assist users.
                    </p>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Key Features:</h4>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
                        <li>Fixed position button to open chat</li>
                        <li>Pre-defined prompt suggestions</li>
                        <li>Quick responses to common questions</li>
                        <li>Magazine subscription and information assistance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API Documentation */}
            {activeSection === 'api' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">API Documentation</h2>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
                  <h3 className="font-semibold text-yellow-800">Note:</h3>
                  <p className="text-yellow-700">
                    Currently, the application uses static mock data from local data files. This section outlines the expected API 
                    structure for future implementation of a backend API.
                  </p>
                </div>
                
                <div className="space-y-12">
                  {/* Articles API */}
                  <div className="border-b pb-8">
                    <div className="flex items-center mb-4">
                      <div className="bg-insightRed text-white p-2 rounded mr-3">
                        <FileText size={20} />
                      </div>
                      <h3 className="text-xl font-bold">Articles API</h3>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Get All Articles */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">GET</span>
                          <code className="text-sm font-semibold">/api/articles</code>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Retrieves a list of all articles with pagination support.</p>
                        
                        <div onClick={() => toggleItem('articles-get-params')} className="cursor-pointer flex items-center text-sm text-gray-700 font-semibold mt-3 mb-2">
                          <span>Query Parameters</span>
                          {expandedItems['articles-get-params'] ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                        </div>
                        
                        {expandedItems['articles-get-params'] && (
                          <div className="bg-white p-3 rounded border border-gray-200 text-sm mb-3">
                            <div className="grid grid-cols-3 gap-2">
                              <div className="font-medium">Parameter</div>
                              <div className="font-medium">Type</div>
                              <div className="font-medium">Description</div>
                            </div>
                            <div className="h-[1px] bg-gray-200 my-2"></div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>page</div>
                              <div>number</div>
                              <div>Page number for pagination (default: 1)</div>
                            </div>
                            <div className="h-[1px] bg-gray-100 my-2"></div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>limit</div>
                              <div>number</div>
                              <div>Number of articles per page (default: 10)</div>
                            </div>
                            <div className="h-[1px] bg-gray-100 my-2"></div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>category</div>
                              <div>string</div>
                              <div>Filter by category</div>
                            </div>
                          </div>
                        )}
                        
                        <div onClick={() => toggleItem('articles-get-response')} className="cursor-pointer flex items-center text-sm text-gray-700 font-semibold mt-3 mb-2">
                          <span>Response Format</span>
                          {expandedItems['articles-get-response'] ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                        </div>
                        
                        {expandedItems['articles-get-response'] && (
                          <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`{
  "data": [
    {
      "id": 1,
      "title": "The Future of Remote Work",
      "excerpt": "How companies are adapting to the new normal...",
      "content": "Full article content...",
      "author": "Jane Smith",
      "date": "May 15, 2023",
      "category": "Business Strategy",
      "image": "/path/to/image.jpg"
    },
    // More articles...
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}`}
                          </pre>
                        )}
                      </div>
                      
                      {/* Get Single Article */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">GET</span>
                          <code className="text-sm font-semibold">/api/articles/:id</code>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Retrieves a single article by ID.</p>
                        
                        <div onClick={() => toggleItem('article-get-response')} className="cursor-pointer flex items-center text-sm text-gray-700 font-semibold mt-3 mb-2">
                          <span>Response Format</span>
                          {expandedItems['article-get-response'] ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                        </div>
                        
                        {expandedItems['article-get-response'] && (
                          <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`{
  "data": {
    "id": 1,
    "title": "The Future of Remote Work",
    "excerpt": "How companies are adapting to the new normal...",
    "content": "Full article content...",
    "author": "Jane Smith",
    "date": "May 15, 2023",
    "category": "Business Strategy",
    "image": "/path/to/image.jpg",
    "relatedArticles": [
      {
        "id": 2,
        "title": "Hybrid Workplace Challenges",
        "excerpt": "Navigating the challenges of hybrid work...",
        "image": "/path/to/related-image.jpg"
      }
      // More related articles...
    ]
  }
}`}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Magazine API */}
                  <div className="border-b pb-8">
                    <div className="flex items-center mb-4">
                      <div className="bg-insightRed text-white p-2 rounded mr-3">
                        <FileText size={20} />
                      </div>
                      <h3 className="text-xl font-bold">Magazine API</h3>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Get All Magazines */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">GET</span>
                          <code className="text-sm font-semibold">/api/magazines</code>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Retrieves a list of all magazine issues.</p>
                        
                        <div onClick={() => toggleItem('magazines-get-response')} className="cursor-pointer flex items-center text-sm text-gray-700 font-semibold mt-3 mb-2">
                          <span>Response Format</span>
                          {expandedItems['magazines-get-response'] ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                        </div>
                        
                        {expandedItems['magazines-get-response'] && (
                          <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`{
  "data": [
    {
      "id": 1,
      "title": "The Innovation Issue",
      "description": "Exploring breakthrough technologies...",
      "coverImage": "/path/to/cover.jpg",
      "date": "May 2023",
      "pdfUrl": "/path/to/magazine.pdf",
      "featured": true
    },
    // More magazines...
  ]
}`}
                          </pre>
                        )}
                      </div>
                      
                      {/* Get Single Magazine */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">GET</span>
                          <code className="text-sm font-semibold">/api/magazines/:id</code>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Retrieves a single magazine issue by ID.</p>
                        
                        <div onClick={() => toggleItem('magazine-get-response')} className="cursor-pointer flex items-center text-sm text-gray-700 font-semibold mt-3 mb-2">
                          <span>Response Format</span>
                          {expandedItems['magazine-get-response'] ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                        </div>
                        
                        {expandedItems['magazine-get-response'] && (
                          <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`{
  "data": {
    "id": 1,
    "title": "The Innovation Issue",
    "description": "Exploring breakthrough technologies...",
    "coverImage": "/path/to/cover.jpg",
    "date": "May 2023",
    "pdfUrl": "/path/to/magazine.pdf",
    "featured": true,
    "tableOfContents": [
      {
        "title": "The AI Revolution",
        "page": 12
      },
      // More entries...
    ],
    "featuredArticles": [
      {
        "id": 5,
        "title": "Blockchain in Enterprise",
        "excerpt": "How blockchain is transforming business..."
      }
      // More featured articles...
    ]
  }
}`}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Leadership API */}
                  <div className="border-b pb-8">
                    <div className="flex items-center mb-4">
                      <div className="bg-insightRed text-white p-2 rounded mr-3">
                        <FileText size={20} />
                      </div>
                      <h3 className="text-xl font-bold">Leadership API</h3>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Get All Leaders */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">GET</span>
                          <code className="text-sm font-semibold">/api/leaders</code>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Retrieves a list of all featured leaders.</p>
                        
                        <div onClick={() => toggleItem('leaders-get-response')} className="cursor-pointer flex items-center text-sm text-gray-700 font-semibold mt-3 mb-2">
                          <span>Response Format</span>
                          {expandedItems['leaders-get-response'] ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                        </div>
                        
                        {expandedItems['leaders-get-response'] && (
                          <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`{
  "data": [
    {
      "id": 1,
      "name": "John Smith",
      "title": "Chief Executive Officer",
      "company": "TechCorp",
      "image": "/path/to/leader.jpg",
      "bio": "Brief biography..."
    },
    // More leaders...
  ]
}`}
                          </pre>
                        )}
                      </div>
                      
                      {/* Get Single Leader */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">GET</span>
                          <code className="text-sm font-semibold">/api/leaders/:id</code>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Retrieves a single leader profile by ID.</p>
                        
                        <div onClick={() => toggleItem('leader-get-response')} className="cursor-pointer flex items-center text-sm text-gray-700 font-semibold mt-3 mb-2">
                          <span>Response Format</span>
                          {expandedItems['leader-get-response'] ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                        </div>
                        
                        {expandedItems['leader-get-response'] && (
                          <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`{
  "data": {
    "id": 1,
    "name": "John Smith",
    "title": "Chief Executive Officer",
    "company": "TechCorp",
    "image": "/path/to/leader.jpg",
    "bio": "Full biography...",
    "articles": [
      {
        "id": 12,
        "title": "Leadership in Crisis",
        "excerpt": "How to lead during challenging times...",
        "date": "April 10, 2023",
        "image": "/path/to/article.jpg"
      }
      // More articles...
    ],
    "relatedLeaders": [
      {
        "id": 2,
        "name": "Jane Roberts",
        "title": "CTO",
        "company": "InnovateX",
        "image": "/path/to/related.jpg"
      }
      // More related leaders...
    ]
  }
}`}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Press Releases API */}
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="bg-insightRed text-white p-2 rounded mr-3">
                        <FileText size={20} />
                      </div>
                      <h3 className="text-xl font-bold">Press Releases API</h3>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Get All Press Releases */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">GET</span>
                          <code className="text-sm font-semibold">/api/press-releases</code>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Retrieves a list of all press releases.</p>
                        
                        <div onClick={() => toggleItem('press-get-params')} className="cursor-pointer flex items-center text-sm text-gray-700 font-semibold mt-3 mb-2">
                          <span>Query Parameters</span>
                          {expandedItems['press-get-params'] ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                        </div>
                        
                        {expandedItems['press-get-params'] && (
                          <div className="bg-white p-3 rounded border border-gray-200 text-sm mb-3">
                            <div className="grid grid-cols-3 gap-2">
                              <div className="font-medium">Parameter</div>
                              <div className="font-medium">Type</div>
                              <div className="font-medium">Description</div>
                            </div>
                            <div className="h-[1px] bg-gray-200 my-2"></div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>category</div>
                              <div>string</div>
                              <div>Filter by category</div>
                            </div>
                            <div className="h-[1px] bg-gray-100 my-2"></div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>company</div>
                              <div>string</div>
                              <div>Filter by company name</div>
                            </div>
                          </div>
                        )}
                        
                        <div onClick={() => toggleItem('press-get-response')} className="cursor-pointer flex items-center text-sm text-gray-700 font-semibold mt-3 mb-2">
                          <span>Response Format</span>
                          {expandedItems['press-get-response'] ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                        </div>
                        
                        {expandedItems['press-get-response'] && (
                          <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`{
  "data": [
    {
      "id": 1,
      "title": "TechCorp Announces New AI Platform",
      "date": "June 5, 2023",
      "company": "TechCorp",
      "category": "Product Launch",
      "image": "/path/to/press.jpg",
      "excerpt": "TechCorp unveils breakthrough AI platform..."
    },
    // More press releases...
  ]
}`}
                          </pre>
                        )}
                      </div>
                      
                      {/* Get Single Press Release */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">GET</span>
                          <code className="text-sm font-semibold">/api/press-releases/:id</code>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Retrieves a single press release by ID.</p>
                        
                        <div onClick={() => toggleItem('press-single-response')} className="cursor-pointer flex items-center text-sm text-gray-700 font-semibold mt-3 mb-2">
                          <span>Response Format</span>
                          {expandedItems['press-single-response'] ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                        </div>
                        
                        {expandedItems['press-single-response'] && (
                          <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`{
  "data": {
    "id": 1,
    "title": "TechCorp Announces New AI Platform",
    "date": "June 5, 2023",
    "company": "TechCorp",
    "category": "Product Launch",
    "image": "/path/to/press.jpg",
    "content": "Full press release content...",
    "contactInfo": {
      "name": "Media Relations",
      "email": "media@techcorp.com",
      "phone": "555-123-4567"
    }
  }
}`}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Component Library */}
            {activeSection === 'components' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Component Library</h2>
                
                <p className="mb-8 text-gray-600">
                  InsightsBW uses a combination of custom components and components from the shadcn/ui library.
                  This section documents the key components used throughout the application.
                </p>
                
                <div className="space-y-8">
                  <div className="border-b pb-6">
                    <h3 className="text-xl font-semibold mb-4">Layout Components</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-2">Layout</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Main layout wrapper that includes the Navbar, Footer, and ChatBot.
                        </p>
                        <code className="text-xs bg-gray-200 p-1 rounded block mb-2">
                          src/components/layout/Layout.tsx
                        </code>
                        <p className="text-sm text-gray-700">
                          Props: <span className="italic">{'{ children: ReactNode }'}</span>
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-2">Navbar</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Navigation bar component with responsive menu.
                        </p>
                        <code className="text-xs bg-gray-200 p-1 rounded block mb-2">
                          src/components/layout/Navbar.tsx
                        </code>
                        <p className="text-sm text-gray-700">
                          No props required.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-2">Footer</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Footer component with navigation links and subscription form.
                        </p>
                        <code className="text-xs bg-gray-200 p-1 rounded block mb-2">
                          src/components/layout/Footer.tsx
                        </code>
                        <p className="text-sm text-gray-700">
                          No props required.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-2">ChatBot</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Interactive chat assistant for user queries.
                        </p>
                        <code className="text-xs bg-gray-200 p-1 rounded block mb-2">
                          src/components/chat/ChatBot.tsx
                        </code>
                        <p className="text-sm text-gray-700">
                          No props required.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-b pb-6">
                    <h3 className="text-xl font-semibold mb-4">UI Components</h3>
                    
                    <p className="text-gray-600 mb-4">
                      The application uses shadcn/ui components for common UI elements. Here are some key components:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-2">Button</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Styled button component with variants.
                        </p>
                        <code className="text-xs bg-gray-200 p-1 rounded block mb-2">
                          src/components/ui/button.tsx
                        </code>
                        <p className="text-sm text-gray-700">
                          Props: variant, size, and standard button props
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-2">Input</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Styled input component.
                        </p>
                        <code className="text-xs bg-gray-200 p-1 rounded block mb-2">
                          src/components/ui/input.tsx
                        </code>
                        <p className="text-sm text-gray-700">
                          Standard input props
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-2">Dialog</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Modal dialog component used for the chatbot.
                        </p>
                        <code className="text-xs bg-gray-200 p-1 rounded block mb-2">
                          src/components/ui/dialog.tsx
                        </code>
                        <p className="text-sm text-gray-700">
                          Includes DialogContent, DialogHeader, etc.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-2">HoverCard</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Card that appears on hover, used for leadership profiles.
                        </p>
                        <code className="text-xs bg-gray-200 p-1 rounded block mb-2">
                          src/components/ui/hover-card.tsx
                        </code>
                        <p className="text-sm text-gray-700">
                          Includes HoverCardTrigger and HoverCardContent
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-blue-700">
                        For full component documentation, refer to the 
                        <a 
                          href="https://ui.shadcn.com/docs" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800 mx-1"
                        >
                          shadcn/ui documentation
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Custom Hooks</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-2">use-toast</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Hook for displaying toast notifications.
                        </p>
                        <code className="text-xs bg-gray-200 p-1 rounded block mb-2">
                          src/hooks/use-toast.ts
                        </code>
                        <p className="text-sm text-gray-700">
                          Provides toast() function to show notifications.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-2">use-mobile</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Hook for detecting mobile viewport.
                        </p>
                        <code className="text-xs bg-gray-200 p-1 rounded block mb-2">
                          src/hooks/use-mobile.tsx
                        </code>
                        <p className="text-sm text-gray-700">
                          Returns boolean indicating if viewport is mobile.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FAQ Section */}
            {activeSection === 'faq' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">How is data managed in the application?</h3>
                    <p className="text-gray-600">
                      Currently, the application uses static data imported from files in the <code>data/</code> directory. 
                      This approach simulates API responses, but in a production environment, these would be replaced with 
                      actual API calls to a backend service.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">How is routing handled?</h3>
                    <p className="text-gray-600">
                      Routing is handled using React Router v6, with routes defined in <code>App.tsx</code>. 
                      Each route maps to a specific page component in the <code>pages/</code> directory.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">How do I add a new page to the application?</h3>
                    <p className="text-gray-600">
                      To add a new page:
                    </p>
                    <ol className="list-decimal pl-5 mt-2 space-y-1 text-gray-600">
                      <li>Create a new component in the <code>pages/</code> directory</li>
                      <li>Add a new route in <code>App.tsx</code></li>
                      <li>Add navigation links in the Navbar or elsewhere as needed</li>
                    </ol>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">How is styling managed?</h3>
                    <p className="text-gray-600">
                      The application uses Tailwind CSS for styling, with custom colors defined in <code>tailwind.config.ts</code>.
                      Some components from shadcn/ui are also used, which come with their own styling that integrates with Tailwind.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">How does the chatbot work?</h3>
                    <p className="text-gray-600">
                      The chatbot currently uses pattern matching to respond to predefined user queries. It analyzes 
                      keywords in the user's input and provides relevant responses from a set of predefined answers.
                      In a production environment, this could be enhanced with a more sophisticated AI system.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">How can I extend the application?</h3>
                    <p className="text-gray-600">
                      The application is designed with modularity in mind. To extend:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                      <li>Create new components in appropriate directories</li>
                      <li>Add new routes in <code>App.tsx</code></li>
                      <li>Add or modify data models in <code>data/</code></li>
                      <li>Create new hooks for custom functionality</li>
                      <li>Integrate with backend services by replacing static data with API calls</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            InsightsBW Documentation • Last Updated: May 21, 2025
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link to="/" className="text-sm text-insightRed hover:text-insightBlack transition-colors">
              Back to Home
            </Link>
            <a 
              href="https://docs.example.com/insightsbw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-insightRed hover:text-insightBlack transition-colors inline-flex items-center"
            >
              External Docs <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;

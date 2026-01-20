import { Link } from 'react-router-dom';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Seo from "@/components/seo/Seo";
import { buildBreadcrumbSchema, getSiteOrigin } from "@/lib/seo";

const Documentation = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const siteOrigin = getSiteOrigin();
  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Documentation", url: `${siteOrigin}/documentation` },
      ])
    : undefined;

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const baseUrl = window.location.origin;

  const endpoints = [
    {
      id: "magazines",
      name: "Magazines",
      description: "Access magazine data including covers, articles, and publication details",
      routes: [
        {
          path: "/magazine",
          method: "GET",
          description: "Get all magazines",
          response: `[
  {
    "id": 1,
    "title": "Business Transformation Leaders",
    "coverImage": "https://example.com/cover1.jpg",
    "publicationDate": "April 2025",
    "slug": "business-transformation-leaders",
    "description": "Featuring executives driving digital innovation"
  },
  ...
]`,
        },
        {
          path: "/magazine/:slug",
          method: "GET",
          description: "Get a specific magazine by slug",
          parameters: [
            { name: "slug", description: "Magazine slug (e.g., business-transformation-leaders)", type: "string", required: true }
          ],
          response: `{
  "id": 1,
  "title": "Business Transformation Leaders",
  "coverImage": "https://example.com/cover1.jpg",
  "publicationDate": "April 2025", 
  "description": "Featuring executives driving digital innovation",
  "articles": [...]
}`
        }
      ]
    },
    {
      id: "articles",
      name: "Articles",
      description: "Browse, search and retrieve magazine articles",
      routes: [
        {
          path: "/article/:slug",
          method: "GET",
          description: "Get a specific article by slug",
          parameters: [
            { name: "slug", description: "Article slug (e.g., ai-machine-learning-transforming-business-operations)", type: "string", required: true }
          ],
          response: `{
  "id": 1,
  "title": "AI and Machine Learning Transforming Business Operations",
  "author": "Sarah Johnson",
  "date": "April 12, 2025",
  "image": "https://example.com/article1.jpg",
  "category": "Technology",
  "excerpt": "How artificial intelligence and machine learning...",
  "content": "Artificial intelligence and machine learning technologies...",
  "slug": "ai-machine-learning-transforming-business-operations"
}`
        },
        {
          path: "/category/:categoryName",
          method: "GET",
          description: "Get articles by category",
          parameters: [
            { name: "categoryName", description: "Category name (e.g., technology)", type: "string", required: true }
          ],
          response: `[
  {
    "id": 1,
    "title": "AI and Machine Learning Transforming Business Operations",
    "author": "Sarah Johnson",
    "date": "April 12, 2025",
    "image": "https://example.com/article1.jpg",
    "category": "Technology",
    "excerpt": "How artificial intelligence and machine learning...",
    "slug": "ai-machine-learning-transforming-business-operations"
  },
  ...
]`
        }
      ]
    },
    {
      id: "leadership",
      name: "Leadership Profiles",
      description: "Access profiles and articles about executive leaders",
      routes: [
        {
          path: "/leadership",
          method: "GET",
          description: "Get all leadership profiles",
          response: `[
  {
    "id": 1,
    "name": "Jennifer Miller",
    "title": "Chief Executive Officer",
    "company": "GreenTech Innovations",
    "avatar": "https://example.com/avatar1.jpg",
    "slug": "jennifer-miller",
    "bio": "Jennifer Miller is a visionary leader..."
  },
  ...
]`
        },
        {
          path: "/leadership/:slug",
          method: "GET",
          description: "Get a specific leader profile by slug",
          parameters: [
            { name: "slug", description: "Leader slug (e.g., jennifer-miller)", type: "string", required: true }
          ],
          response: `{
  "id": 1,
  "name": "Jennifer Miller",
  "title": "Chief Executive Officer",
  "company": "GreenTech Innovations",
  "avatar": "https://example.com/avatar1.jpg",
  "slug": "jennifer-miller",
  "bio": "Jennifer Miller is a visionary leader...",
  "articles": [...]
}`
        }
      ]
    },
    {
      id: "press",
      name: "Press Releases",
      description: "Access company press releases and announcements",
      routes: [
        {
          path: "/press-releases",
          method: "GET",
          description: "Get all press releases",
          response: `[
  {
    "id": 1,
    "title": "The CIO Vision Launches New Executive Magazine",
    "date": "April 15, 2025",
    "category": "Company News",
    "excerpt": "The CIO Vision announces the launch of...",
    "slug": "the-cio-vision-launches-new-executive-magazine"
  },
  ...
]`
        },
        {
          path: "/press-releases/:slug",
          method: "GET",
          description: "Get a specific press release by slug",
          parameters: [
            { name: "slug", description: "Press release slug (e.g., the-cio-vision-launches-new-executive-magazine)", type: "string", required: true }
          ],
          response: `{
  "id": 1,
  "title": "The CIO Vision Launches New Executive Magazine",
  "date": "April 15, 2025",
  "category": "Company News",
  "content": "The CIO Vision, a leading business media company...",
  "slug": "the-cio-vision-launches-new-executive-magazine"
}`
        }
      ]
    }
  ];

  return (
    <>
      <Seo
        title="Documentation"
        description="API documentation for accessing magazines, articles, leadership profiles, and press releases."
        schema={breadcrumbSchema ? [breadcrumbSchema] : undefined}
      />
      <div className="min-h-screen py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold text-insightBlack mb-4">API Documentation</h1>
          <p className="text-xl text-gray-600">
            Complete reference for The CIO Vision content API
          </p>
        </div>

        <div className="mb-12 p-6 bg-insightBlack text-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
          <p className="mb-4">
            The CIO Vision provides a RESTful API to access our magazine content, articles, leadership profiles, and press releases. All endpoints use slug-based URLs for consistent, SEO-friendly resource identification.
          </p>
          <div className="bg-gray-800 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300 text-sm">Base URL</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-gray-300 hover:text-white"
                onClick={() => copyToClipboard(baseUrl, "base-url")}
              >
                {copiedEndpoint === "base-url" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <code className="text-green-400">{baseUrl}</code>
          </div>
        </div>

        <Tabs defaultValue="endpoints" className="mb-12">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
            <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
            <TabsTrigger value="schemas">Data Models</TabsTrigger>
          </TabsList>
          
          <TabsContent value="endpoints" className="mt-8">
            <Accordion type="single" collapsible className="w-full">
              {endpoints.map((endpoint) => (
                <AccordionItem key={endpoint.id} value={endpoint.id}>
                  <AccordionTrigger className="text-xl font-semibold">
                    {endpoint.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-2 mb-4 text-gray-600">
                      {endpoint.description}
                    </div>

                    {endpoint.routes.map((route, index) => (
                      <Card key={index} className="mb-6 border border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md font-mono text-sm mr-3">
                                {route.method}
                              </span>
                              <code className="text-gray-700 font-mono">
                                {route.path}
                              </code>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => copyToClipboard(`${baseUrl}${route.path.replace(/:[^/]+/g, (m) => `{${m.substring(1)}}`)}`, `${endpoint.id}-${index}`)}
                            >
                              {copiedEndpoint === `${endpoint.id}-${index}` ? 
                                <><Check className="h-4 w-4 mr-1" /> Copied</> : 
                                <><Copy className="h-4 w-4 mr-1" /> Copy URL</>
                              }
                            </Button>
                          </div>

                          <p className="text-gray-600 mb-4">{route.description}</p>

                          {route.parameters && (
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Parameters</h4>
                              <div className="bg-gray-50 rounded-md p-4">
                                {route.parameters.map((param, i) => (
                                  <div key={i} className="grid grid-cols-5 gap-2 mb-2 text-sm">
                                    <div className="font-mono text-blue-600">{param.name}</div>
                                    <div className="text-gray-500">{param.type}</div>
                                    <div className="col-span-2">{param.description}</div>
                                    <div>{param.required ? <span className="text-red-500">Required</span> : <span className="text-gray-500">Optional</span>}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Example Response</h4>
                          <div className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto">
                            <pre className="text-xs">{route.response}</pre>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="schemas" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Magazine</h3>
                  <div className="bg-gray-50 p-4 rounded-md mb-2">
                    <pre className="text-sm">{`{
  id: number;
  title: string;
  coverImage: string;
  publicationDate: string;
  slug: string;
  description: string;
  articles?: Article[];
}`}</pre>
                  </div>
                  <p className="text-gray-600 text-sm">
                    The Magazine object represents individual magazine issues with publication details.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Article</h3>
                  <div className="bg-gray-50 p-4 rounded-md mb-2">
                    <pre className="text-sm">{`{
  id: number;
  title: string;
  author: string;
  date: string;
  image: string;
  category: string;
  excerpt: string;
  content: string;
  slug: string;
  isFeatured?: boolean;
}`}</pre>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Articles represent individual content pieces that may appear in magazines or as standalone content.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Leader Profile</h3>
                  <div className="bg-gray-50 p-4 rounded-md mb-2">
                    <pre className="text-sm">{`{
  id: number;
  name: string;
  title: string;
  company: string;
  avatar: string;
  slug: string;
  bio: string;
  articles?: Article[];
}`}</pre>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Leader profiles represent executive business leaders featured in articles or interviews.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Press Release</h3>
                  <div className="bg-gray-50 p-4 rounded-md mb-2">
                    <pre className="text-sm">{`{
  id: number;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  slug: string;
}`}</pre>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Press releases contain company announcements and news items.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-gray-50 rounded-lg p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">
            If you need additional support or have questions about our API, please don't hesitate to reach out.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/contact">
              <Button>Contact Support</Button>
            </Link>
            <Button variant="outline">
              Request API Access
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Documentation;

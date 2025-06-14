
import { useState } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  ArrowUp,
  ArrowDown,
  Code,
  FileJson,
  Copy,
  Check,
  Save
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Mock data for demo purposes
const mockEndpoints = [
  {
    id: 1,
    name: "Magazines",
    description: "Access magazine data including covers, articles, and publication details",
    category: "Content",
    routes: [
      { 
        path: "/magazine", 
        method: "GET", 
        description: "Get all magazines"
      },
      { 
        path: "/magazine/:slug", 
        method: "GET", 
        description: "Get a specific magazine by slug"
      }
    ]
  },
  {
    id: 2,
    name: "Articles",
    description: "Browse, search and retrieve magazine articles",
    category: "Content",
    routes: [
      { 
        path: "/article/:slug", 
        method: "GET", 
        description: "Get a specific article by slug"
      },
      { 
        path: "/category/:categoryName", 
        method: "GET", 
        description: "Get articles by category" 
      }
    ]
  },
  {
    id: 3,
    name: "Leadership Profiles",
    description: "Access profiles and articles about executive leaders",
    category: "People",
    routes: [
      { 
        path: "/leadership", 
        method: "GET", 
        description: "Get all leadership profiles" 
      },
      { 
        path: "/leadership/:slug", 
        method: "GET", 
        description: "Get a specific leader profile by slug" 
      }
    ]
  }
];

const endpointFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category is required")
});

const routeFormSchema = z.object({
  path: z.string().min(1, "Path is required"),
  method: z.string().min(1, "Method is required"),
  description: z.string().min(5, "Description must be at least 5 characters")
});

const DocumentationManager = () => {
  return (
    <Routes>
      <Route path="/" element={<EndpointList />} />
      <Route path="/create" element={<EndpointForm />} />
      <Route path="/edit/:id" element={<EndpointForm />} />
      <Route path="/routes/:endpointId" element={<RouteManager />} />
      <Route path="/routes/:endpointId/create" element={<RouteForm />} />
      <Route path="/routes/:endpointId/edit/:routeId" element={<RouteForm />} />
    </Routes>
  );
};

const EndpointList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  const filteredEndpoints = mockEndpoints
    .filter(endpoint => 
      endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const fieldA = a[sortField as keyof typeof a];
      const fieldB = b[sortField as keyof typeof b];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      
      return sortDirection === 'asc' 
        ? (fieldA > fieldB ? 1 : -1)
        : (fieldA < fieldB ? 1 : -1);
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = (id: number) => {
    // In a real app, this would call an API to delete the endpoint
    toast.success("Endpoint deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">API Documentation</h1>
        <Button onClick={() => navigate("/admin/docs/create")}>
          <Plus className="mr-2 h-4 w-4" /> Create Endpoint
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search endpoints..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">
                  <button 
                    onClick={() => handleSort("name")}
                    className="flex items-center"
                  >
                    Endpoint
                    {sortField === "name" && (
                      sortDirection === "asc" 
                        ? <ArrowUp className="ml-1 h-4 w-4" /> 
                        : <ArrowDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">
                  <button 
                    onClick={() => handleSort("category")}
                    className="flex items-center"
                  >
                    Category
                    {sortField === "category" && (
                      sortDirection === "asc" 
                        ? <ArrowUp className="ml-1 h-4 w-4" /> 
                        : <ArrowDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium text-center">Routes</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEndpoints.length > 0 ? (
                filteredEndpoints.map((endpoint) => (
                  <tr key={endpoint.id} className="border-b">
                    <td className="px-4 py-3 font-medium">{endpoint.name}</td>
                    <td className="px-4 py-3">{endpoint.description}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                        {endpoint.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-medium">
                        {endpoint.routes.length}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/admin/docs/routes/${endpoint.id}`)}
                        >
                          <Code className="mr-1 h-4 w-4" /> Routes
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/admin/docs/edit/${endpoint.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(endpoint.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No endpoints found. Try adjusting your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const EndpointForm = () => {
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof endpointFormSchema>>({
    resolver: zodResolver(endpointFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
    },
  });

  function onSubmit(values: z.infer<typeof endpointFormSchema>) {
    // In a real app, this would call an API to save the endpoint
    console.log(values);
    toast.success("Endpoint saved successfully");
    navigate("/admin/docs");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={() => navigate("/admin/docs")}>
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <h1 className="text-3xl font-bold">New API Endpoint</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Articles" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g. Access article data including content, authors, and publication details" 
                    className="h-20"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex items-center justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin/docs")}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit">Save Endpoint</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const RouteManager = () => {
  const navigate = useNavigate();
  const [endpointId, setEndpointId] = useState<number>(1); // Would get from params in a real app
  
  // Find the endpoint from mock data
  const endpoint = mockEndpoints.find(e => e.id === endpointId);
  
  if (!endpoint) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold">Endpoint not found</h2>
          <Button 
            className="mt-4" 
            variant="outline"
            onClick={() => navigate("/admin/docs")}
          >
            Return to Documentation
          </Button>
        </div>
      </div>
    );
  }
  
  const handleDelete = (routeId: number) => {
    // In a real app, this would call an API to delete the route
    toast.success("Route deleted successfully");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={() => navigate("/admin/docs")}>
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{endpoint.name} Routes</h1>
          <p className="text-muted-foreground">{endpoint.description}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-medium">API Endpoints</h2>
          <p className="text-sm text-muted-foreground">Manage routes for this API endpoint</p>
        </div>
        <Button onClick={() => navigate(`/admin/docs/routes/${endpointId}/create`)}>
          <Plus className="mr-2 h-4 w-4" /> Add Route
        </Button>
      </div>
      
      <div>
        {endpoint.routes.length > 0 ? (
          <div className="space-y-4">
            {endpoint.routes.map((route, index) => (
              <div 
                key={index} 
                className="flex flex-col overflow-hidden rounded-md border bg-white"
              >
                <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-3">
                  <div className="flex items-center">
                    <span className={`inline-flex h-6 items-center justify-center rounded px-2 text-xs font-medium ${
                      route.method === 'GET' ? 'bg-blue-100 text-blue-800' : 
                      route.method === 'POST' ? 'bg-green-100 text-green-800' :
                      route.method === 'PUT' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {route.method}
                    </span>
                    <code className="ml-3 font-mono text-sm">{route.path}</code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => navigate(`/admin/docs/routes/${endpointId}/edit/${index}`)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="text-sm font-medium">Description</h3>
                    <p className="text-sm">{route.description}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="text-sm font-medium">Example Response</h3>
                    <div className="mt-1 rounded-md bg-gray-900 p-3">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>JSON</span>
                        <button 
                          className="flex items-center text-gray-400 hover:text-gray-300"
                          onClick={() => {
                            // Simulate copying JSON to clipboard
                            toast.success("JSON copied to clipboard");
                          }}
                        >
                          <Copy className="mr-1 h-3 w-3" />
                          Copy
                        </button>
                      </div>
                      <pre className="mt-1 overflow-x-auto text-xs text-green-400">
                        {index === 0 ? 
                          `[
  {
    "id": 1,
    "title": "Example Title",
    "slug": "example-title"
  }
]` : 
                          `{
  "id": 1,
  "title": "Example Title",
  "slug": "example-title",
  "content": "Example content..."
}`}
                      </pre>
                    </div>
                  </div>
                  
                  {route.path.includes(':') && (
                    <div>
                      <h3 className="text-sm font-medium">Parameters</h3>
                      <div className="mt-1 overflow-hidden rounded-md border">
                        <div className="grid grid-cols-3 gap-2 bg-muted/50 px-3 py-2 text-xs font-medium">
                          <div>Name</div>
                          <div>Type</div>
                          <div>Description</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs">
                          <div className="font-mono text-blue-600">
                            {route.path.match(/:([^/]+)/g)?.[0].substring(1)}
                          </div>
                          <div>string</div>
                          <div>Required. Unique identifier for the resource.</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <p className="text-muted-foreground">No routes defined yet.</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => navigate(`/admin/docs/routes/${endpointId}/create`)}
              >
                Add your first route
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const RouteForm = () => {
  const navigate = useNavigate();
  const [endpointId, setEndpointId] = useState<number>(1); // Would get from params in a real app
  const [exampleResponse, setExampleResponse] = useState<string>(`{
  "id": 1,
  "title": "Example Title",
  "content": "Example content..."
}`);
  const [copiedJson, setCopiedJson] = useState(false);
  
  const form = useForm<z.infer<typeof routeFormSchema>>({
    resolver: zodResolver(routeFormSchema),
    defaultValues: {
      path: "",
      method: "GET",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof routeFormSchema>) {
    // In a real app, this would call an API to save the route
    console.log({...values, exampleResponse});
    toast.success("Route saved successfully");
    navigate(`/admin/docs/routes/${endpointId}`);
  }
  
  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(exampleResponse);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={() => navigate(`/admin/docs/routes/${endpointId}`)}>
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <h1 className="text-3xl font-bold">New API Route</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Path</FormLabel>
                  <FormControl>
                    <Input placeholder="/endpoint/:param" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HTTP Method</FormLabel>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe what this endpoint does" 
                    className="h-20"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Example Response</h3>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2"
                  onClick={copyJsonToClipboard}
                >
                  {copiedJson ? (
                    <><Check className="mr-1 h-3 w-3" /> Copied</>
                  ) : (
                    <><Copy className="mr-1 h-3 w-3" /> Copy</>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => {
                    try {
                      // Format JSON
                      const parsed = JSON.parse(exampleResponse);
                      setExampleResponse(JSON.stringify(parsed, null, 2));
                      toast.success("JSON formatted");
                    } catch (e) {
                      toast.error("Invalid JSON");
                    }
                  }}
                >
                  <FileJson className="mr-1 h-3 w-3" /> Format
                </Button>
              </div>
            </div>
            <Textarea
              placeholder="Provide a JSON example response"
              className="font-mono text-sm h-60"
              value={exampleResponse}
              onChange={(e) => setExampleResponse(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Parameters</h3>
            <p className="text-xs text-muted-foreground">
              Add details for URL parameters (automatically detected from path)
            </p>
            
            {form.watch("path").includes(':') ? (
              <div className="rounded-md border">
                <div className="grid grid-cols-3 gap-2 bg-muted/50 px-4 py-2 text-xs font-medium">
                  <div>Name</div>
                  <div>Type</div>
                  <div>Description</div>
                </div>
                {form.watch("path").match(/:([^/]+)/g)?.map((param, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 border-t px-4 py-2">
                    <div className="font-mono text-blue-600">
                      {param.substring(1)}
                    </div>
                    <select className="rounded-sm border border-input px-1 py-1 text-xs">
                      <option>string</option>
                      <option>number</option>
                      <option>boolean</option>
                      <option>object</option>
                      <option>array</option>
                    </select>
                    <Input 
                      size={1}
                      placeholder="Parameter description" 
                      className="h-6 min-w-0 text-xs"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-20 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                No parameters detected. Add a parameter using the ':param' syntax in the path.
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/admin/docs/routes/${endpointId}`)}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit">Save Route</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DocumentationManager;

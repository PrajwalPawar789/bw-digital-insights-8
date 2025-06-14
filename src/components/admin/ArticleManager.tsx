
import { useState } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  Calendar,
  ArrowUp,
  ArrowDown
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock data for demo purposes
const mockCategories = ["Technology", "Business", "Leadership", "Innovation", "Finance"];

const mockArticles = [
  {
    id: 1,
    title: "AI and Machine Learning Transforming Business Operations",
    author: "Sarah Johnson",
    date: "2025-04-12",
    category: "Technology",
    excerpt: "How artificial intelligence and machine learning are changing business operations",
    isFeatured: true,
    status: "published",
    slug: "ai-machine-learning-transforming-business-operations"
  },
  {
    id: 2,
    title: "The Future of Remote Work in Global Companies",
    author: "Michael Chen",
    date: "2025-04-10",
    category: "Business",
    excerpt: "Exploring how remote work is reshaping global business strategies",
    isFeatured: false,
    status: "published",
    slug: "future-remote-work-global-companies"
  },
  {
    id: 3,
    title: "Sustainable Business Practices for Modern Enterprises",
    author: "Jessica Williams",
    date: "2025-04-08",
    category: "Business",
    excerpt: "How companies can implement sustainable practices while maintaining growth",
    isFeatured: false,
    status: "draft",
    slug: "sustainable-business-practices-modern-enterprises"
  },
];

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  author: z.string().min(2, "Author name is required"),
  category: z.string().min(1, "Please select a category"),
  date: z.date({
    required_error: "Publication date is required",
  }),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  isFeatured: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

const ArticleManager = () => {
  return (
    <Routes>
      <Route path="/" element={<ArticleList />} />
      <Route path="/create" element={<ArticleForm />} />
      <Route path="/edit/:id" element={<ArticleForm />} />
    </Routes>
  );
};

const ArticleList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  const filteredArticles = mockArticles
    .filter(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase())
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
    // In a real app, this would call an API to delete the article
    toast.success("Article deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Button onClick={() => navigate("/admin/articles/create")}>
          <Plus className="mr-2 h-4 w-4" /> Create Article
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
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
                    onClick={() => handleSort("title")}
                    className="flex items-center"
                  >
                    Title
                    {sortField === "title" && (
                      sortDirection === "asc" 
                        ? <ArrowUp className="ml-1 h-4 w-4" /> 
                        : <ArrowDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">
                  <button 
                    onClick={() => handleSort("author")}
                    className="flex items-center"
                  >
                    Author
                    {sortField === "author" && (
                      sortDirection === "asc" 
                        ? <ArrowUp className="ml-1 h-4 w-4" /> 
                        : <ArrowDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </th>
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
                <th className="px-4 py-3 font-medium">
                  <button 
                    onClick={() => handleSort("date")}
                    className="flex items-center"
                  >
                    Date
                    {sortField === "date" && (
                      sortDirection === "asc" 
                        ? <ArrowUp className="ml-1 h-4 w-4" /> 
                        : <ArrowDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">
                  <button 
                    onClick={() => handleSort("status")}
                    className="flex items-center"
                  >
                    Status
                    {sortField === "status" && (
                      sortDirection === "asc" 
                        ? <ArrowUp className="ml-1 h-4 w-4" /> 
                        : <ArrowDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <tr key={article.id} className="border-b">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{article.title}</p>
                        <p className="text-xs text-muted-foreground">{article.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{article.author}</td>
                    <td className="px-4 py-3">{article.category}</td>
                    <td className="px-4 py-3">{format(new Date(article.date), "MMM d, yyyy")}</td>
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        article.status === 'published' ? 'bg-green-100 text-green-800' :
                        article.status === 'draft' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {article.status}
                      </div>
                      {article.isFeatured && (
                        <div className="ml-2 inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
                          Featured
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(article.id)}
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
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No articles found. Try adjusting your search.
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

const ArticleForm = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      category: "",
      excerpt: "",
      content: "",
      isFeatured: false,
      status: "draft",
      date: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would call an API to save the article
    console.log(values);
    toast.success("Article saved successfully");
    navigate("/admin/articles");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={() => navigate("/admin/articles")}>
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <h1 className="text-3xl font-bold">New Article</h1>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="content" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Article title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input placeholder="Author name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockCategories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Publication Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Short excerpt for article listings" 
                        className="h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Article content"
                        className="min-h-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-4">
              <div>
                <h2 className="text-lg font-medium">Search Engine Optimization</h2>
                <p className="text-sm text-muted-foreground">
                  Optimize your article for search engines.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Meta Title
                  </label>
                  <Input className="mt-1" placeholder="SEO title (if different from article title)" />
                </div>
                
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Meta Description
                  </label>
                  <Textarea 
                    className="mt-1 h-20" 
                    placeholder="Description for search engine results"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Keywords
                  </label>
                  <Input className="mt-1" placeholder="Comma separated keywords" />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <div>
                <h2 className="text-lg font-medium">Article Settings</h2>
                <p className="text-sm text-muted-foreground">
                  Configure additional settings for your article.
                </p>
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publication Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Feature this article on the homepage
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Related Articles
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select articles" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockArticles.map(article => (
                        <SelectItem key={article.id} value={article.id.toString()}>
                          {article.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <div className="flex items-center justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => navigate("/admin/articles")}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit">Save Article</Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default ArticleManager;

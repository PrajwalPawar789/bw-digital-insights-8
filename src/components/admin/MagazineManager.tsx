
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
  ArrowDown,
  Upload,
  FileText,
  Image as ImageIcon
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
import { format } from "date-fns";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Mock data for demo purposes
const mockMagazines = [
  {
    id: 1,
    title: "Business Transformation Leaders",
    publicationDate: "2025-04-01",
    coverImage: "https://example.com/cover1.jpg",
    description: "Featuring executives driving digital innovation",
    status: "published",
    pageCount: 42,
    slug: "business-transformation-leaders"
  },
  {
    id: 2,
    title: "Finance Innovation Quarterly",
    publicationDate: "2025-03-01",
    coverImage: "https://example.com/cover2.jpg",
    description: "The latest trends in financial technology",
    status: "published",
    pageCount: 38,
    slug: "finance-innovation-quarterly"
  },
  {
    id: 3,
    title: "AI Implementation Guide",
    publicationDate: "2025-05-01",
    coverImage: "https://example.com/cover3.jpg",
    description: "Practical strategies for AI adoption",
    status: "draft",
    pageCount: 56,
    slug: "ai-implementation-guide"
  }
];

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  publicationDate: z.date({
    required_error: "Publication date is required",
  }),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  pageCount: z.coerce.number().min(1, "Page count must be at least 1"),
});

const MagazineManager = () => {
  return (
    <Routes>
      <Route path="/" element={<MagazineList />} />
      <Route path="/create" element={<MagazineForm />} />
      <Route path="/edit/:id" element={<MagazineForm />} />
    </Routes>
  );
};

const MagazineList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("publicationDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  const filteredMagazines = mockMagazines
    .filter(magazine => 
      magazine.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      magazine.description.toLowerCase().includes(searchTerm.toLowerCase())
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
    // In a real app, this would call an API to delete the magazine
    toast.success("Magazine deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Magazines</h1>
        <Button onClick={() => navigate("/admin/magazines/create")}>
          <Plus className="mr-2 h-4 w-4" /> Create Magazine
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search magazines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMagazines.map(magazine => (
          <div 
            key={magazine.id} 
            className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm"
          >
            <div className="relative aspect-[4/5] bg-muted">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <ImageIcon className="h-10 w-10" />
              </div>
              {magazine.coverImage && (
                <img
                  src={magazine.coverImage}
                  alt={magazine.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div className="absolute right-2 top-2">
                <div className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  magazine.status === 'published' ? 'bg-green-100 text-green-800' :
                  magazine.status === 'draft' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {magazine.status}
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-lg font-semibold">{magazine.title}</h3>
              <p className="mb-2 text-sm text-muted-foreground">
                {format(new Date(magazine.publicationDate), "MMMM yyyy")} • {magazine.pageCount} pages
              </p>
              <p className="text-sm text-muted-foreground">{magazine.description}</p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/admin/magazines/edit/${magazine.id}`)}
                >
                  <Edit className="mr-1 h-4 w-4" /> Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-500" 
                  onClick={() => handleDelete(magazine.id)}
                >
                  <Trash className="mr-1 h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredMagazines.length === 0 && (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <p className="text-muted-foreground">No magazines found.</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => navigate("/admin/magazines/create")}
            >
              Create your first magazine
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const MagazineForm = () => {
  const navigate = useNavigate();
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [uploadedPdf, setUploadedPdf] = useState<string | null>(null);
  const [articles, setArticles] = useState<number[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "draft",
      pageCount: 1,
      publicationDate: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would call an API to save the magazine
    console.log(values);
    toast.success("Magazine saved successfully");
    navigate("/admin/magazines");
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would upload the image to a server
    // Here we just simulate setting the image URL
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCoverImage(e.target.result.toString());
          toast.success("Cover image uploaded");
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would upload the PDF to a server
    if (e.target.files && e.target.files[0]) {
      setUploadedPdf(e.target.files[0].name);
      toast.success("PDF uploaded successfully");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={() => navigate("/admin/magazines")}>
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <h1 className="text-3xl font-bold">New Magazine</h1>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
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
                        <Input placeholder="Magazine title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="publicationDate"
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
                                format(field.value, "MMMM yyyy")
                              ) : (
                                <span>Pick a month</span>
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Magazine description" 
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
                name="pageCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Count</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Number of pages"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  PDF Upload
                </label>
                <div className="mt-2 flex items-center space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('pdf-upload')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose PDF
                  </Button>
                  <input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handlePdfUpload}
                  />
                  {uploadedPdf && (
                    <span className="text-sm text-muted-foreground">
                      <FileText className="mr-1 inline h-4 w-4" />
                      {uploadedPdf}
                    </span>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="design" className="space-y-4">
              <div>
                <h2 className="text-lg font-medium">Cover Design</h2>
                <p className="text-sm text-muted-foreground">
                  Upload and customize your magazine cover.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Cover Image
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center justify-center border-2 border-dashed border-gray-300 px-6 py-6 rounded-md">
                      {coverImage ? (
                        <div className="relative">
                          <img 
                            src={coverImage}
                            alt="Cover preview" 
                            className="h-40 object-contain"
                          />
                          <Button 
                            type="button"
                            variant="destructive" 
                            size="icon"
                            className="absolute right-0 top-0"
                            onClick={() => setCoverImage(null)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-2 flex justify-center text-sm text-gray-600">
                            <Button 
                              type="button"
                              variant="outline" 
                              onClick={() => document.getElementById('cover-upload')?.click()}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Cover
                            </Button>
                            <input
                              id="cover-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Cover Design Options
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-muted-foreground">Title Position</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option>Top</option>
                        <option>Middle</option>
                        <option>Bottom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground">Text Color</label>
                      <div className="flex space-x-2">
                        <button type="button" className="h-8 w-8 rounded-full bg-white border"></button>
                        <button type="button" className="h-8 w-8 rounded-full bg-black"></button>
                        <button type="button" className="h-8 w-8 rounded-full bg-red-500"></button>
                        <button type="button" className="h-8 w-8 rounded-full bg-blue-500"></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="articles" className="space-y-4">
              <div>
                <h2 className="text-lg font-medium">Magazine Articles</h2>
                <p className="text-sm text-muted-foreground">
                  Select articles to include in this magazine issue.
                </p>
              </div>
              
              <div className="space-y-4 border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium">Selected Articles</h3>
                  <Button type="button" variant="outline" size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Article
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {mockMagazines[0].id && (
                    <div className="flex items-center justify-between rounded-md border bg-muted/50 px-4 py-2">
                      <span className="font-medium">AI and Machine Learning Transforming Business Operations</span>
                      <Button type="button" variant="ghost" size="sm">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  )}
                  {mockMagazines[1].id && (
                    <div className="flex items-center justify-between rounded-md border bg-muted/50 px-4 py-2">
                      <span className="font-medium">The Future of Remote Work in Global Companies</span>
                      <Button type="button" variant="ghost" size="sm">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Table of Contents Order
                  </label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Drag and drop to reorder articles in the table of contents.
                  </p>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center rounded-md border px-3 py-2 cursor-move">
                      <span>1.</span>
                      <span className="ml-2">AI and Machine Learning Transforming Business Operations</span>
                    </div>
                    <div className="flex items-center rounded-md border px-3 py-2 cursor-move">
                      <span>2.</span>
                      <span className="ml-2">The Future of Remote Work in Global Companies</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <div className="flex items-center justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => navigate("/admin/magazines")}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit">Save Magazine</Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default MagazineManager;

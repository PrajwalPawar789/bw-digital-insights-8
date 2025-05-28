
import { useState } from "react";
import { Route, Routes, Link, useNavigate, useParams } from "react-router-dom";
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
import { useArticles, useCreateArticle, useUpdateArticle, useDeleteArticle, useArticleBySlug } from "@/hooks/useArticles";
import { useImageUpload } from "@/hooks/useImageUpload";
import { slugify } from "@/lib/slugify";

const mockCategories = ["Technology", "Business", "Leadership", "Innovation", "Finance"];

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  author: z.string().min(2, "Author name is required"),
  category: z.string().min(1, "Please select a category"),
  date: z.date({
    required_error: "Publication date is required",
  }),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  featured: z.boolean().default(false),
});

const ArticleManager = () => {
  return (
    <Routes>
      <Route path="/" element={<ArticleList />} />
      <Route path="/create" element={<ArticleForm />} />
      <Route path="/edit/:id" element={<ArticleForm isEditing />} />
    </Routes>
  );
};

const ArticleList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  const { data: articles = [], isLoading } = useArticles();
  const deleteArticle = useDeleteArticle();
  
  const filteredArticles = articles
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

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      deleteArticle.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading articles...</div>;
  }

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
                <th className="px-4 py-3 font-medium">Status</th>
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
                      <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                        Published
                      </div>
                      {article.featured && (
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
                          disabled={deleteArticle.isPending}
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

const ArticleForm = ({ isEditing = false }: { isEditing?: boolean }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);

  const { data: existingArticle, isLoading } = useArticleBySlug(id || "");
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const { uploadImage, uploading } = useImageUpload();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      category: "",
      excerpt: "",
      content: "",
      featured: false,
      date: new Date(),
    },
  });

  // Set form values when editing
  useState(() => {
    if (isEditing && existingArticle) {
      form.reset({
        title: existingArticle.title,
        author: existingArticle.author,
        category: existingArticle.category,
        excerpt: existingArticle.excerpt || "",
        content: existingArticle.content,
        featured: existingArticle.featured || false,
        date: new Date(existingArticle.date),
      });
      setFeaturedImage(existingArticle.image_url);
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const imageUrl = await uploadImage(e.target.files[0], "articles");
        setFeaturedImage(imageUrl);
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const slug = slugify(values.title);
    const articleData = {
      ...values,
      slug,
      image_url: featuredImage,
      date: values.date.toISOString().split('T')[0],
    };

    if (isEditing && existingArticle) {
      updateArticle.mutate({ id: existingArticle.id, ...articleData }, {
        onSuccess: () => navigate("/admin/articles")
      });
    } else {
      createArticle.mutate(articleData, {
        onSuccess: () => navigate("/admin/articles")
      });
    }
  }

  if (isEditing && isLoading) {
    return <div className="flex items-center justify-center h-64">Loading article...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={() => navigate("/admin/articles")}>
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <h1 className="text-3xl font-bold">{isEditing ? "Edit Article" : "New Article"}</h1>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
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
                        value={field.value}
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

              <div>
                <label className="text-sm font-medium leading-none mb-2 block">
                  Featured Image
                </label>
                <div className="flex items-center space-x-4">
                  {featuredImage ? (
                    <div className="relative">
                      <img
                        src={featuredImage}
                        alt="Featured"
                        className="w-32 h-24 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => setFeaturedImage(null)}
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload Image"}
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
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
            
            <TabsContent value="settings" className="space-y-4">
              <div>
                <h2 className="text-lg font-medium">Article Settings</h2>
                <p className="text-sm text-muted-foreground">
                  Configure additional settings for your article.
                </p>
              </div>
              
              <FormField
                control={form.control}
                name="featured"
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
            </TabsContent>
            
            <div className="flex items-center justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => navigate("/admin/articles")}
                type="button"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createArticle.isPending || updateArticle.isPending}
              >
                {createArticle.isPending || updateArticle.isPending 
                  ? "Saving..." 
                  : isEditing ? "Update Article" : "Save Article"
                }
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default ArticleManager;

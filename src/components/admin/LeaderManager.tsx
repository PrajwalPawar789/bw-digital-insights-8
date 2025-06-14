
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
  Upload,
  Building,
  Briefcase,
  User as UserIcon
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
const mockLeaders = [
  {
    id: 1,
    name: "Jennifer Miller",
    title: "Chief Executive Officer",
    company: "GreenTech Innovations",
    avatar: "https://example.com/avatar1.jpg",
    bio: "Jennifer Miller is a visionary leader with over 20 years of experience in sustainable technology.",
    featured: true,
    slug: "jennifer-miller"
  },
  {
    id: 2,
    name: "David Chen",
    title: "Chief Technology Officer",
    company: "QuantumData Systems",
    avatar: "https://example.com/avatar2.jpg",
    bio: "David Chen leads product innovation with expertise in AI and machine learning technologies.",
    featured: true,
    slug: "david-chen"
  },
  {
    id: 3,
    name: "Sarah Johnson",
    title: "Chief Financial Officer",
    company: "Global Finance Partners",
    avatar: "https://example.com/avatar3.jpg",
    bio: "Sarah Johnson brings financial expertise to the evolving digital marketplace.",
    featured: false,
    slug: "sarah-johnson"
  }
];

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().min(2, "Job title is required"),
  company: z.string().min(2, "Company name is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  featured: z.boolean().default(false)
});

const LeaderManager = () => {
  return (
    <Routes>
      <Route path="/" element={<LeaderList />} />
      <Route path="/create" element={<LeaderForm />} />
      <Route path="/edit/:id" element={<LeaderForm />} />
    </Routes>
  );
};

const LeaderList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  const filteredLeaders = mockLeaders
    .filter(leader => 
      leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.company.toLowerCase().includes(searchTerm.toLowerCase())
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
    // In a real app, this would call an API to delete the leader profile
    toast.success("Profile deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leadership Profiles</h1>
        <Button onClick={() => navigate("/admin/leadership/create")}>
          <Plus className="mr-2 h-4 w-4" /> Create Profile
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search profiles..."
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
                <th className="px-4 py-3 font-medium">Profile</th>
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
                    onClick={() => handleSort("company")}
                    className="flex items-center"
                  >
                    Company
                    {sortField === "company" && (
                      sortDirection === "asc" 
                        ? <ArrowUp className="ml-1 h-4 w-4" /> 
                        : <ArrowDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaders.length > 0 ? (
                filteredLeaders.map((leader) => (
                  <tr key={leader.id} className="border-b">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="relative h-10 w-10 rounded-full bg-muted">
                          {leader.avatar ? (
                            <img
                              src={leader.avatar}
                              alt={leader.name}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-gray-500">
                              <UserIcon className="h-5 w-5" />
                            </span>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{leader.name}</p>
                          <p className="text-xs text-muted-foreground">{leader.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{leader.title}</td>
                    <td className="px-4 py-3">{leader.company}</td>
                    <td className="px-4 py-3">
                      {leader.featured ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          Regular
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/admin/leadership/edit/${leader.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(leader.id)}
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
                    No leadership profiles found. Try adjusting your search.
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

const LeaderForm = () => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [associatedArticles, setAssociatedArticles] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      title: "",
      company: "",
      bio: "",
      featured: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would call an API to save the leader profile
    console.log(values);
    toast.success("Profile saved successfully");
    navigate("/admin/leadership");
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would upload the image to a server
    // Here we just simulate setting the image URL
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatar(e.target.result.toString());
          toast.success("Avatar uploaded");
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={() => navigate("/admin/leadership")}>
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <h1 className="text-3xl font-bold">New Leadership Profile</h1>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="bio">Biography</TabsTrigger>
          <TabsTrigger value="content">Related Content</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="basic" className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative h-24 w-24 rounded-full bg-muted">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar preview"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-gray-500">
                      <UserIcon className="h-10 w-10" />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-medium">Profile Photo</h2>
                  <p className="text-sm text-muted-foreground">Upload a professional photo</p>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
                            <Briefcase className="h-4 w-4" />
                          </span>
                          <Input 
                            placeholder="Chief Executive Officer" 
                            className="rounded-l-none"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
                            <Building className="h-4 w-4" />
                          </span>
                          <Input 
                            placeholder="Company Name" 
                            className="rounded-l-none"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      Feature this profile on the leadership page
                    </FormLabel>
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="bio" className="space-y-4">
              <div>
                <h2 className="text-lg font-medium">Professional Biography</h2>
                <p className="text-sm text-muted-foreground">
                  Write a compelling biography for this leader.
                </p>
              </div>
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biography</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter the leader's professional biography and background" 
                        className="min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Additional Information</h3>
                
                <div>
                  <label className="text-sm font-medium leading-none mb-1 block">
                    Education
                  </label>
                  <Input placeholder="MBA, Harvard Business School" />
                </div>
                
                <div>
                  <label className="text-sm font-medium leading-none mb-1 block">
                    Areas of Expertise
                  </label>
                  <Input placeholder="Digital Transformation, Leadership, Innovation" />
                </div>
                
                <div>
                  <label className="text-sm font-medium leading-none mb-1 block">
                    LinkedIn Profile
                  </label>
                  <Input placeholder="https://linkedin.com/in/username" />
                </div>
                
                <div>
                  <label className="text-sm font-medium leading-none mb-1 block">
                    Twitter/X Handle
                  </label>
                  <Input placeholder="@username" />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4">
              <div>
                <h2 className="text-lg font-medium">Related Content</h2>
                <p className="text-sm text-muted-foreground">
                  Connect articles and content authored by this leader.
                </p>
              </div>
              
              <div className="space-y-4 border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium">Associated Articles</h3>
                  <Button type="button" variant="outline" size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Article
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="rounded-md border bg-muted/50 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">AI and Machine Learning Transforming Business Operations</h4>
                        <p className="text-sm text-muted-foreground">April 12, 2025</p>
                      </div>
                      <Button type="button" variant="ghost" size="sm">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="rounded-md border bg-muted/50 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Leadership Strategies for the Digital Age</h4>
                        <p className="text-sm text-muted-foreground">March 5, 2025</p>
                      </div>
                      <Button type="button" variant="ghost" size="sm">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-md font-medium mb-2">Interview Highlights</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium leading-none mb-1 block">
                      Key Quote
                    </label>
                    <Input placeholder='e.g. "Innovation is not just about technology..."' />
                  </div>
                  <div>
                    <label className="text-sm font-medium leading-none mb-1 block">
                      Featured Video URL
                    </label>
                    <Input placeholder="https://youtube.com/..." />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <div className="flex items-center justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => navigate("/admin/leadership")}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit">Save Profile</Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default LeaderManager;

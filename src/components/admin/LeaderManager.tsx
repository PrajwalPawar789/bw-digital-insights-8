
import { useState } from "react";
import { Route, Routes, Link, useNavigate, useParams } from "react-router-dom";
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
  User as UserIcon,
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
import { useLeadershipProfiles, useCreateLeadership, useUpdateLeadership, useDeleteLeadership } from "@/hooks/useLeadership";
import { useImageUpload } from "@/hooks/useImageUpload";
import { slugify } from "@/lib/slugify";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().min(2, "Job title is required"),
  company: z.string().min(2, "Company name is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  featured: z.boolean().default(false),
  linkedin_url: z.string().optional(),
  twitter_url: z.string().optional(),
});

const LeaderManager = () => {
  return (
    <Routes>
      <Route path="/" element={<LeaderList />} />
      <Route path="/create" element={<LeaderForm />} />
      <Route path="/edit/:id" element={<LeaderForm isEditing />} />
    </Routes>
  );
};

const LeaderList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  const { data: leaders = [], isLoading } = useLeadershipProfiles();
  const deleteLeader = useDeleteLeadership();
  
  const filteredLeaders = leaders
    .filter(leader => 
      leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (leader.company && leader.company.toLowerCase().includes(searchTerm.toLowerCase()))
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
    if (confirm("Are you sure you want to delete this profile?")) {
      deleteLeader.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading leadership profiles...</div>;
  }

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
                          {leader.image_url ? (
                            <img
                              src={leader.image_url}
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
                          disabled={deleteLeader.isPending}
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

const LeaderForm = ({ isEditing = false }: { isEditing?: boolean }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [avatar, setAvatar] = useState<string | null>(null);

  const { data: leaders = [] } = useLeadershipProfiles();
  const existingLeader = leaders.find(leader => leader.id === id);
  const createLeader = useCreateLeadership();
  const updateLeader = useUpdateLeadership();
  const { uploadImage, uploading } = useImageUpload();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      title: "",
      company: "",
      bio: "",
      featured: false,
      linkedin_url: "",
      twitter_url: "",
    },
  });

  // Set form values when editing
  useState(() => {
    if (isEditing && existingLeader) {
      form.reset({
        name: existingLeader.name,
        title: existingLeader.title,
        company: existingLeader.company || "",
        bio: existingLeader.bio,
        featured: existingLeader.featured || false,
        linkedin_url: existingLeader.linkedin_url || "",
        twitter_url: existingLeader.twitter_url || "",
      });
      setAvatar(existingLeader.image_url);
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const imageUrl = await uploadImage(e.target.files[0], "leadership");
        setAvatar(imageUrl);
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const slug = slugify(values.name);
    const leaderData = {
      ...values,
      slug,
      image_url: avatar,
    };

    if (isEditing && existingLeader) {
      updateLeader.mutate({ id: existingLeader.id, ...leaderData }, {
        onSuccess: () => navigate("/admin/leadership")
      });
    } else {
      createLeader.mutate(leaderData, {
        onSuccess: () => navigate("/admin/leadership")
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={() => navigate("/admin/leadership")}>
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <h1 className="text-3xl font-bold">{isEditing ? "Edit Leadership Profile" : "New Leadership Profile"}</h1>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="bio">Biography</TabsTrigger>
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
                    disabled={uploading}
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
                  <p className="text-sm text-muted-foreground">
                    {uploading ? "Uploading..." : "Upload a professional photo"}
                  </p>
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
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Social Links</h3>
                
                <FormField
                  control={form.control}
                  name="linkedin_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Profile</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/in/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="twitter_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter/X Handle</FormLabel>
                      <FormControl>
                        <Input placeholder="https://twitter.com/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              <Button 
                type="submit" 
                disabled={createLeader.isPending || updateLeader.isPending}
              >
                {createLeader.isPending || updateLeader.isPending 
                  ? "Saving..." 
                  : isEditing ? "Update Profile" : "Save Profile"
                }
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default LeaderManager;

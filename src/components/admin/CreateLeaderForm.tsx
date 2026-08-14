
import React, { useState } from 'react';
import { useCreateLeadership } from '@/hooks/useLeadership';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { slugify } from '@/lib/slugify';
import { Upload, X } from 'lucide-react';
import { LEADER_HOME_SECTIONS } from '@/lib/home-placements';
import ArticleContentEditor from '@/components/admin/ArticleContentEditor';

interface CreateLeaderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateLeaderForm = ({ open, onOpenChange }: CreateLeaderFormProps) => {
  const { mutate: createLeader, isPending } = useCreateLeadership();
  const { uploadImage, uploading } = useImageUpload();
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [areasOfExpertise, setAreasOfExpertise] = useState('');
  const [industryImpact, setIndustryImpact] = useState('');
  const [featured, setFeatured] = useState(false);
  const [homeSections, setHomeSections] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const toggleHomeSection = (value: string) => {
    setHomeSections((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const handleImageUpload = async (file: File) => {
    try {
      console.log('Starting image upload for leader...', file.name, file.type);
      setSelectedFile(file);
      const url = await uploadImage(file, "leadership");
      console.log('Leader image uploaded successfully:', url);
      setImageUrl(url);
    } catch (error) {
      console.error('Error uploading leader image:', error);
      setSelectedFile(null);
    }
  };

  const removeImage = () => {
    setImageUrl('');
    setSelectedFile(null);
  };

  const handleFeaturedImageUpload = async (file?: File) => {
    if (!file) return;
    try {
      const url = await uploadImage(file, "leadership/featured");
      setFeaturedImageUrl(url);
    } catch (error) {
      console.error('Error uploading leadership story image:', error);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Leader image file selected:', file.name, file.type, file.size);
      handleImageUpload(file);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('leader-image-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !title || !bio) {
      toast.error('Please fill in all required fields');
      return;
    }

    const leaderData = {
      name,
      slug: slug || slugify(name),
      title,
      company,
      article_title: articleTitle.trim() || null,
      bio,
      image_url: imageUrl,
      featured_image_url: featuredImageUrl || null,
      linkedin_url: linkedinUrl,
      twitter_url: twitterUrl,
      areas_of_expertise: areasOfExpertise,
      industry_impact: industryImpact,
      featured,
      home_sections: homeSections.length ? homeSections : null,
    };

    console.log('Creating leader with data:', leaderData);
    createLeader(leaderData, {
      onSuccess: () => {
        toast.success('Leadership profile created successfully');
        onOpenChange(false);
        resetForm();
      },
      onError: (error) => {
        console.error('Failed to create leadership profile:', error);
        toast.error('Failed to create leadership profile');
      }
    });
  };

  const resetForm = () => {
    setName('');
    setSlug('');
    setTitle('');
    setCompany('');
    setArticleTitle('');
    setBio('');
    setImageUrl('');
    setFeaturedImageUrl('');
    setLinkedinUrl('');
    setTwitterUrl('');
    setAreasOfExpertise('');
    setIndustryImpact('');
    setFeatured(false);
    setHomeSections([]);
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[960px]">
        <DialogHeader>
          <DialogTitle>Create Leadership Profile</DialogTitle>
          <DialogDescription>
            Add a new leadership profile to your website.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Auto-generated from name"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., CEO, CTO, Founder"
                required
              />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="article_title">Leadership Talks Headline</Label>
            <Input
              id="article_title"
              value={articleTitle}
              onChange={(e) => setArticleTitle(e.target.value)}
              placeholder="Inside Name’s Approach to Business and Leadership"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Optional. A matching headline is generated from the leader&apos;s name when blank.
            </p>
          </div>

          <div>
            <Label htmlFor="bio">Leadership Story *</Label>
            <ArticleContentEditor
              id="bio"
              value={bio}
              onChange={setBio}
              required
              uploadFolder="leadership/content"
              placeholder="Write the leadership story. Add section headings, links, lists, quotations, and inline images with the toolbar."
            />
          </div>

          <div>
            <Label htmlFor="areas_of_expertise">Areas of Expertise</Label>
            <Textarea
              id="areas_of_expertise"
              value={areasOfExpertise}
              onChange={(e) => setAreasOfExpertise(e.target.value)}
              rows={3}
              placeholder="Key areas of expertise and specialization"
            />
          </div>

          <div>
            <Label htmlFor="industry_impact">Industry Impact</Label>
            <Textarea
              id="industry_impact"
              value={industryImpact}
              onChange={(e) => setIndustryImpact(e.target.value)}
              rows={3}
              placeholder="Impact and contributions to the industry"
            />
          </div>

          <div>
            <Label htmlFor="image">Profile Image</Label>
            <div className="space-y-3">
              {!imageUrl ? (
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    id="leader-image-input"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={uploading} 
                    className="w-full"
                    onClick={triggerFileInput}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Profile Image'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Upload className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-800">Image uploaded successfully</p>
                        <p className="text-xs text-green-600">{selectedFile?.name || 'Image ready'}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {imageUrl && (
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                      <img src={imageUrl} alt="Profile preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="leader-featured-image">Wide Leadership Story Image</Label>
            <p className="mb-2 text-xs text-muted-foreground">
              Recommended ratio: 3:2 (for example 1200 × 800). The profile image is used as a fallback.
            </p>
            {!featuredImageUrl ? (
              <Input
                id="leader-featured-image"
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(event) => handleFeaturedImageUpload(event.target.files?.[0])}
              />
            ) : (
              <div className="space-y-3">
                <img
                  src={featuredImageUrl}
                  alt="Leadership story preview"
                  className="aspect-[3/2] w-full max-w-md border object-cover object-top"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFeaturedImageUrl('')}
                >
                  <X className="mr-2 h-4 w-4" /> Remove Story Image
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter URL</Label>
              <Input
                id="twitter"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>

          <div>
            <Label>Home Page Sections</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Choose which Home page sections this profile appears in.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {LEADER_HOME_SECTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={homeSections.includes(opt.value)}
                    onChange={() => toggleHomeSection(opt.value)}
                    className="h-4 w-4"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={featured}
              onCheckedChange={setFeatured}
            />
            <Label htmlFor="featured">Featured Leader</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={isPending || uploading}
            >
              {isPending ? 'Creating...' : 'Create Profile'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeaderForm;

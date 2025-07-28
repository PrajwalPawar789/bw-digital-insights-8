
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
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      bio,
      image_url: imageUrl,
      linkedin_url: linkedinUrl,
      twitter_url: twitterUrl,
      featured,
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
    setBio('');
    setImageUrl('');
    setLinkedinUrl('');
    setTwitterUrl('');
    setFeatured(false);
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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
            <Label htmlFor="bio">Biography *</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={6}
              placeholder="Professional biography and achievements"
              required
            />
          </div>

          <div>
            <Label htmlFor="image">Profile Image</Label>
            <div className="space-y-3">
              {!imageUrl ? (
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        console.log('Leader image file selected:', file.name, file.type, file.size);
                        handleImageUpload(file);
                      }
                    }}
                    className="hidden"
                  />
                  <Label htmlFor="image" className="cursor-pointer">
                    <Button type="button" variant="outline" disabled={uploading} className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Upload Profile Image'}
                    </Button>
                  </Label>
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

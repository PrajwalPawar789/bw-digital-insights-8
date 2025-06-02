
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
import { Upload } from 'lucide-react';

interface CreateLeaderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateLeaderForm = ({ open, onOpenChange }: CreateLeaderFormProps) => {
  const { mutate: createLeader } = useCreateLeadership();
  const { uploadImage, uploading } = useImageUpload();
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [featured, setFeatured] = useState(false);

  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadImage(file, "leadership");
      setImageUrl(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image");
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
      bio,
      image_url: imageUrl,
      featured,
    };

    createLeader(leaderData);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setSlug('');
    setTitle('');
    setCompany('');
    setBio('');
    setImageUrl('');
    setFeatured(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Leadership Profile</DialogTitle>
          <DialogDescription>
            Add a new leadership profile to your website.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., CEO, CTO, etc."
                required
              />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
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
              required
            />
          </div>

          <div>
            <Label htmlFor="image">Profile Image</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <Label htmlFor="image" className="cursor-pointer">
                <Button type="button" variant="outline" disabled={uploading}>
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </Label>
              {imageUrl && (
                <span className="text-sm text-green-600">Image uploaded</span>
              )}
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

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Create Profile
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeaderForm;

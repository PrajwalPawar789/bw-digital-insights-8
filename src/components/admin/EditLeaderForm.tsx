import React, { useState } from 'react';
import { useUpdateLeadership } from '@/hooks/useLeadership';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Upload, X } from 'lucide-react';
import { LEADER_HOME_SECTIONS } from '@/lib/home-placements';
import ArticleContentEditor from '@/components/admin/ArticleContentEditor';
import type { Database } from '@/integrations/supabase/types';

type LeadershipProfile = Database['public']['Tables']['leadership_profiles']['Row'];

interface EditLeaderFormProps {
  leader: LeadershipProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditLeaderForm = ({ leader, open, onOpenChange }: EditLeaderFormProps) => {
  const updateLeader = useUpdateLeadership();
  const { uploadImage, uploading } = useImageUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: leader?.name || '',
    title: leader?.title || '',
    company: leader?.company || '',
    article_title: leader?.article_title || '',
    bio: leader?.bio || '',
    image_url: leader?.image_url || '',
    featured_image_url: leader?.featured_image_url || '',
    linkedin_url: leader?.linkedin_url || '',
    twitter_url: leader?.twitter_url || '',
    areas_of_expertise: leader?.areas_of_expertise || '',
    industry_impact: leader?.industry_impact || '',
    featured: leader?.featured || false,
    home_sections: Array.isArray(leader?.home_sections) ? leader.home_sections : []
  });

  const toggleHomeSection = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      home_sections: prev.home_sections.includes(value)
        ? prev.home_sections.filter((s: string) => s !== value)
        : [...prev.home_sections, value],
    }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      console.log('Starting image upload for leader edit...', file.name, file.type);
      setSelectedFile(file);
      const url = await uploadImage(file, "leadership");
      console.log('Leader image uploaded successfully:', url);
      setFormData(prev => ({ ...prev, image_url: url }));
    } catch (error) {
      console.error('Error uploading leader image:', error);
      setSelectedFile(null);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
    setSelectedFile(null);
  };

  const handleFeaturedImageUpload = async (file?: File) => {
    if (!file) return;
    try {
      const url = await uploadImage(file, "leadership/featured");
      setFormData((prev) => ({ ...prev, featured_image_url: url }));
    } catch (error) {
      console.error('Error uploading leadership story image:', error);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Leader edit image file selected:', file.name, file.type, file.size);
      handleImageUpload(file);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('edit-leader-image-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateLeader.mutateAsync({
        id: leader.id,
        ...formData,
        article_title: formData.article_title.trim() || null,
        featured_image_url: formData.featured_image_url || null,
        home_sections: formData.home_sections.length ? formData.home_sections : null
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update leader:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[960px]">
        <DialogHeader>
          <DialogTitle>Edit Leadership Profile</DialogTitle>
          <DialogDescription>
            Update the leadership profile information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="article_title">Leadership Talks Headline</Label>
            <Input
              id="article_title"
              value={formData.article_title}
              onChange={(e) => setFormData({ ...formData, article_title: e.target.value })}
              placeholder="Inside Name's Approach to Business and Leadership"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Optional. A matching headline is generated from the leader&apos;s name when blank.
            </p>
          </div>

          <div>
            <Label htmlFor="bio">Leadership Story</Label>
            <ArticleContentEditor
              id="bio"
              value={formData.bio}
              onChange={(bio) => setFormData({ ...formData, bio })}
              required
              uploadFolder="leadership/content"
              placeholder="Write the leadership story. Add section headings, links, lists, quotations, and inline images with the toolbar."
            />
          </div>

          <div>
            <Label htmlFor="areas_of_expertise">Areas of Expertise</Label>
            <Textarea
              id="areas_of_expertise"
              value={formData.areas_of_expertise}
              onChange={(e) => setFormData({ ...formData, areas_of_expertise: e.target.value })}
              rows={3}
              placeholder="Key areas of expertise and specialization"
            />
          </div>

          <div>
            <Label htmlFor="industry_impact">Industry Impact</Label>
            <Textarea
              id="industry_impact"
              value={formData.industry_impact}
              onChange={(e) => setFormData({ ...formData, industry_impact: e.target.value })}
              rows={3}
              placeholder="Impact and contributions to the industry"
            />
          </div>

          <div>
            <Label htmlFor="image_url">Profile Image</Label>
            <div className="space-y-3">
              {!formData.image_url ? (
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    id="edit-leader-image-input"
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
                        <p className="text-sm font-medium text-green-800">
                          {selectedFile ? 'New image uploaded' : 'Current image'}
                        </p>
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
                  {formData.image_url && (
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                      <img src={formData.image_url} alt="Profile preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={triggerFileInput}
                    disabled={uploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Change Image'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="edit-leader-featured-image">Wide Leadership Story Image</Label>
            <p className="mb-2 text-xs text-muted-foreground">
              Recommended ratio: 3:2 (for example 1200 × 800). The profile image is used as a fallback.
            </p>
            {!formData.featured_image_url ? (
              <Input
                id="edit-leader-featured-image"
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(event) => handleFeaturedImageUpload(event.target.files?.[0])}
              />
            ) : (
              <div className="space-y-3">
                <img
                  src={formData.featured_image_url}
                  alt="Leadership story preview"
                  className="aspect-[3/2] w-full max-w-md border object-cover object-top"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData({ ...formData, featured_image_url: '' })
                  }
                >
                  <X className="mr-2 h-4 w-4" /> Remove Story Image
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <Label htmlFor="twitter_url">Twitter URL</Label>
              <Input
                id="twitter_url"
                value={formData.twitter_url}
                onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
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
                    checked={formData.home_sections.includes(opt.value)}
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
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            />
            <Label htmlFor="featured">Featured Leader</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateLeader.isPending || uploading}>
              {updateLeader.isPending || uploading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLeaderForm;

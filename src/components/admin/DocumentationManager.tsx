
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';

const DocumentationManager = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const docs = [
    {
      id: '1',
      title: 'API Documentation',
      description: 'Complete API reference and usage examples',
      category: 'Technical',
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      title: 'User Guide',
      description: 'Step-by-step guide for platform users',
      category: 'User',
      lastUpdated: '2024-01-10'
    },
    {
      id: '3',
      title: 'Admin Manual',
      description: 'Administrative functions and procedures',
      category: 'Admin',
      lastUpdated: '2024-01-05'
    }
  ];

  const handleEdit = (doc: any) => {
    setSelectedDoc(doc);
    setEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      console.log('Delete document:', id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Documentation Management</h2>
          <p className="text-gray-600">Manage your documentation and guides</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Document
        </Button>
      </div>

      <div className="grid gap-6">
        {docs.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <FileText className="h-8 w-8 text-insightRed mt-1" />
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{doc.title}</CardTitle>
                    <CardDescription className="mb-2">{doc.description}</CardDescription>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Category: {doc.category}</span>
                      <span>•</span>
                      <span>Updated: {new Date(doc.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(doc)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(doc.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Update the document information below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="doc-title">Title</Label>
              <Input id="doc-title" defaultValue={selectedDoc?.title} />
            </div>
            <div>
              <Label htmlFor="doc-description">Description</Label>
              <Textarea id="doc-description" defaultValue={selectedDoc?.description} />
            </div>
            <div>
              <Label htmlFor="doc-category">Category</Label>
              <Input id="doc-category" defaultValue={selectedDoc?.category} />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setEditDialogOpen(false)}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentationManager;

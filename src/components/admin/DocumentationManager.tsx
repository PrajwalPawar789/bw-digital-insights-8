
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';

const DocumentationManager = () => {
  // Mock data for now - you can replace with actual data fetching
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
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DocumentationManager;

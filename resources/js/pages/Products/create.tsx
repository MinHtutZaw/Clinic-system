import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BadgeAlert, AlertCircle, Check, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Products', href: '/products' },
  { title: 'Create Product', href: '/products/create' },
];



interface PageProps {
  
  errors: Record<string, string>;
}

export default function Create() {
 
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    price: '',
    duration: '',
    description: '',
   
  });

  const [open, setOpen] = useState(false);

 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('products.store'));
  };

  const hasErrors = Object.keys(errors).length > 0;
  

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add New Product" />

      <div className="m-4 p-4">
        <h1 className="text-xl font-semibold mb-4 flex justify-center">Add Product</h1>

        <div className="flex justify-center">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md w-full">
            {/* Error Alert */}
            {hasErrors && (
              <Alert variant="destructive" className="border-2 border-red-500 bg-red-50 dark:bg-red-950">
                <BadgeAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
                <AlertTitle className="text-red-800 dark:text-red-200 font-bold">
                  Please fix the following errors:
                </AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {Object.entries(errors).map(([key, message]) => (
                      <li key={key} className="text-red-700 dark:text-red-300 font-medium">
                        {message}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Enter product name"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={data.price}
                onChange={(e) => setData('price', e.target.value)}
                placeholder="Enter price"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={data.duration}
                onChange={(e) => setData('duration', e.target.value)}
                placeholder="Enter duration"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder="Enter description"
                rows={4}
              />
            </div>

            

            {/* Submit */}
            <Button
              type="submit"
              disabled={processing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                'Add Product'
              )}
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

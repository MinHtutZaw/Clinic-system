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
import { BadgeAlert, AlertCircle, Check, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Products', href: '/products' },
  { title: 'Update Product Information', href: '/products/{product}/edit' },
];

interface Service {
  id: number;
  name: string;
  service_price: string | number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  services: Service[];
  price: string;
  duration: number;
}

interface Props {
  product: Product;
  services: Service[];
}

export default function Edit({ product, services }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: product.name,
    description: product.description,
    price: product.price,
    duration: product.duration,
    service_ids: product.services.map((s) => s.id) || [],
  });

  const [open, setOpen] = useState(false);

  const handleCheckboxChange = (id: number) => {
    if (data.service_ids.includes(id)) {
      setData('service_ids', data.service_ids.filter((sid) => sid !== id));
    } else {
      setData('service_ids', [...data.service_ids, id]);
    }
  };


  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('products.update', product.id));
  };

  const isUnchanged =
    data.name === product.name &&
    data.description === product.description &&
    data.price === product.price &&
    data.duration === product.duration &&
    JSON.stringify(data.service_ids) === JSON.stringify(product.services.map((s) => s.id));

  const selectedServices = services.filter((s) => data.service_ids.includes(s.id));

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Update Product Information" />

      <div className="m-4 p-4">
        <h1 className="text-xl font-semibold mb-4 flex justify-center">Edit Product</h1>

        <div className="flex justify-center">
          <form onSubmit={handleUpdate} className="space-y-6 max-w-md w-full">
            {/* Error Alert */}
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive" className="border-2 border-red-500 bg-red-50 dark:bg-red-950">
                <BadgeAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
                <AlertTitle className="text-red-800 dark:text-red-200 font-bold">Error !!</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {Object.entries(errors).map(([key, message]) => (
                      <li key={key} className="text-red-700 dark:text-red-300 font-medium">
                        {message as string}
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
              <Label htmlFor="price">Price (MMK)</Label>
              <Input
                id="price"
                type="number"
                value={data.price}
                onChange={(e) => setData('price', e.target.value)}
                placeholder="Enter product price"
              />
              {errors.price && <p className="text-red-600 text-sm">{errors.price}</p>}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={data.duration}
                onChange={(e) => setData('duration', Number(e.target.value))}
                placeholder="Enter duration in minutes"
              />
              {errors.duration && <p className="text-red-600 text-sm">{errors.duration}</p>}
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

            {/* Services Popover */}
            <div className="space-y-2">
              <Label>Services</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between flex-wrap h-auto min-h-[42px]"
                  >
                    {selectedServices.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedServices.map((s) => (
                          <Badge
                            key={s.id}
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                          >
                            {s.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Select services...</span>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-60" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[300px] p-2 bg-white dark:bg-gray-900 shadow-lg rounded-lg border">
                  <div className="max-h-[200px] overflow-y-auto">
                    {services.map((service) => {
                      const selected = data.service_ids.includes(service.id);
                      return (
                        <div
                          key={service.id}
                          onClick={() => handleCheckboxChange(service.id)}
                          className={cn(
                            'flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors',
                            selected
                              ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                          )}
                        >
                          <span className="font-medium">{service.name}</span>
                          {selected && <Check className="h-4 w-4 text-blue-600" />}
                        </div>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>

              {errors.service_ids&& (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.service_ids}</span>
                </div>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" disabled={processing || isUnchanged} className="w-full">
              Update Product
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

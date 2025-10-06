import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { BadgeAlert, Terminal } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
    {
        title: 'Register Form for Products',
        href: '/products/create',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        price: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // console.log(data)
        post(route('products.store'));  // Laravel route to PatientController@store
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Register Form for Products" />

            <div className="m-4 p-4 ">
                <h1 className="text-xl font-semibold mb-4 flex  justify-center"> Products Information</h1>
                <div className="flex  justify-center ">

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full">
                        {Object.keys(errors).length > 0 && (
                            <Alert>
                                <BadgeAlert />
                                <AlertTitle>Error !!</AlertTitle>
                                <AlertDescription>
                                    <ul >
                                        {Object.entries(errors).map(([key, message]) => (
                                            <li key={key}>{message as string}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter product name"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>


                     
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Enter description"
                            />
                            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                        </div>

                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Saving...' : 'Add Product'}
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

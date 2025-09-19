import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import patients from '@/routes/patients';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { BadgeAlert, Terminal } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Update Product Information',
        href: '/products/{product}/edit',
    },
];

interface Product {
    id :number
    name: string,
    price: number,
    description: string,
};
interface Props{
    product : Product
}


export default function edit({product} : Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        price : product.price,
        description : product.description,
    });


    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        // console.log(data)
        put(route('products.update',product.id));  // Laravel route to PatientController@store
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="'Update Products Information" />

            <div className="m-4 p-4 ">
                <h1 className="text-xl font-semibold mb-4 flex  justify-center">Register Form</h1>
                <div className="flex  justify-center ">

                    {/* Register Form */}
                    <form onSubmit={handleUpdate} className="space-y-4 max-w-md w-full">
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
                                placeholder="Enter Product name"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>


                     
                        <div>
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', Number(e.target.value))}
                                placeholder="Enter price"
                            />
                            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
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
                            Update Product data
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

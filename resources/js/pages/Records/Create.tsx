import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { BadgeAlert } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Treatment Records', href: '/records/create' },
];

interface Patient {
    id: number;
    name: string;
    free_trials: number;
}

interface Product {
    id: number;
    name: string;
}

interface PageProps {
    patients: Patient[];
    products: Product[];
    errors: Record<string, string>;
}

export default function Create() {
    const { patients, products, errors } = usePage().props as unknown as PageProps;

    const { data, setData, post, processing } = useForm({
        patient_id: '',
        product_id: '',
        duration: '15', // default 15 min
        price: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('records.store')); // Laravel route to RecordController@store
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Treatment Record" />

            <div className="m-4 p-4">
                <h1 className="text-xl font-semibold mb-4 text-center">Add Treatment Record</h1>
                <div className="flex justify-center">
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full">

                        {/* Error messages */}
                        {Object.keys(errors).length > 0 && (
                            <Alert>
                                <BadgeAlert />
                                <AlertTitle>Error !!</AlertTitle>
                                <AlertDescription>
                                    <ul>
                                        {Object.entries(errors).map(([key, message]) => (
                                            <li key={key}>{message}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Patient Select */}
                        <div>
                            <Label htmlFor="patient_id">Select Patient</Label>
                            <select
                                id="patient_id"
                                value={data.patient_id}
                                onChange={(e) => setData('patient_id', e.target.value)}
                                className="w-full border rounded p-2 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="">-- Choose Patient --</option>
                                {patients.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                            {errors.patient_id && <p className="text-red-500 text-sm">{errors.patient_id}</p>}
                        </div>

                        {/* Product Select */}
                        <div>
                            <Label htmlFor="product_id">Select Product</Label>
                            <select
                                id="product_id"
                                value={data.product_id}
                                onChange={(e) => setData('product_id', e.target.value)}
                                className="w-full border rounded p-2 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="">-- Choose Product --</option>
                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                            {errors.product_id && <p className="text-red-500 text-sm">{errors.product_id}</p>}
                        </div>

                        {/* Duration Select */}
                        <div>
                            <Label htmlFor="duration">Duration</Label>
                            <select
                                id="duration"
                                value={data.duration}
                                onChange={(e) => setData('duration', e.target.value)}
                                className="w-full border rounded p-2 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="60">1 hour</option>
                            </select>
                            {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
                        </div>

                        {/* Price - only show if no free trials */}
                        {patients.find((p) => p.id.toString() === data.patient_id)?.free_trials === 0 && (
                            <div>
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="Enter price (MMK)"
                                />
                                {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                            </div>
                        )}
                        {/* Submit */}
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Saving...' : 'Save Record'}
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

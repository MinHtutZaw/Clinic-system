import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { BadgeAlert, Terminal } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Register Form for Patient',
        href: '/patients/create',
    },
];

export default function create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        town: '',
        age: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // console.log(data)
        post(route('patients.store'));  // Laravel route to PatientController@store
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Register Form for Patient" />

            <div className="m-4 p-4 ">
                <h1 className="text-xl font-semibold mb-4 flex  justify-center">Register Form</h1>
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
                                placeholder="Enter patient name"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="Enter phone number"
                            />
                            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                        </div>

                        <div>
                            <Label htmlFor="town">Town</Label>
                            <Input
                                id="town"
                                type="text"
                                value={data.town}
                                onChange={(e) => setData('town', e.target.value)}
                                placeholder="Enter town"
                            />
                            {errors.town && <p className="text-red-500 text-sm">{errors.town}</p>}
                        </div>

                        <div>
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                value={data.age}
                                onChange={(e) => setData('age', e.target.value)}
                                placeholder="Enter age"
                            />
                            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                        </div>

                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Saving...' : 'Add Patient'}
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

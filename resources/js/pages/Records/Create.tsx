import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { BadgeAlert } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Records',
        href: '/records',
    },
    { title: 'Treatment Records', href: '/records/create' },
];

interface Patient {
    id: number;
    name: string;
    free_trials: number;
    role: string;
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
        status: 'Trial', //
        voucher: null as File | null, //
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('records.store'), { forceFormData: true }); // Laravel route to RecordController@store
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Treatment Record" />

            <div className="m-4 p-4">
                <h1 className="mb-4 text-center text-xl font-semibold">Add Treatment Record</h1>
                <div className="flex justify-center">
                    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
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

                        {/* Patient Combobox */}
                        <div>
                            <Label htmlFor="patient_id">Search Patient</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" className="w-full justify-between">
                                        {data.patient_id
                                            ? (() => {
                                                  const selected = patients.find((p) => String(p.id) === data.patient_id);
                                                  return selected ? `${selected.name} (ID: ${selected.id})` : 'Enter patient name';
                                              })()
                                            : 'Select patient name'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search patient..." />
                                        <CommandEmpty>No patient found.</CommandEmpty>
                                        <CommandGroup>
                                            {patients.map((p) => (
                                                <CommandItem key={p.id} onSelect={() => setData('patient_id', String(p.id))}>
                                                    {p.name} (ID: {p.id})
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.patient_id && <p className="text-sm text-red-500">{errors.patient_id}</p>}
                        </div>

                        {/* Product Select */}
                        <div>
                            <Label htmlFor="product_id">Select Product</Label>
                            <Select value={data.product_id} onValueChange={(value) => setData('product_id', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder=" Choose Product " />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.product_id && <p className="text-sm text-red-500">{errors.product_id}</p>}
                        </div>

                        {/* Duration Select */}
                        <div>
                            <Label htmlFor="duration">Duration</Label>
                            <Select value={data.duration} onValueChange={(value) => setData('duration', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choose duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="15">15 minutes</SelectItem>
                                    <SelectItem value="30">30 minutes</SelectItem>
                                    <SelectItem value="60">1 hour</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
                        </div>

                        {/* Price - only show if no free trials AND not VVIP */}
                        {(() => {
                            const selectedPatient = patients.find((p) => p.id.toString() === data.patient_id);
                            if (!selectedPatient) return null;

                            // Only show price if patient is NOT vvip AND free_trials == 0
                            if (selectedPatient.role !== 'vvip' && selectedPatient.free_trials === 0) {
                                return (
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
                                        {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                                    </div>
                                );
                            }
                            return null;
                        })()}

                        {/* Voucher */}
                        <div>
                            <Label htmlFor="voucher">Voucher Upload</Label>
                            <Input
                                id="voucher"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('voucher', e.target.files ? e.target.files[0] : null)}
                            />
                            {errors.voucher && <p className="text-sm text-red-500">{errors.voucher}</p>}
                        </div>

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

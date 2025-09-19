import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { Megaphone, SquarePen, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Patients', href: '/patients' },
];

interface Patient {
    id: number;
    name: string;
    phone: string;
    town: string;
    age: number;
    free_trials: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedPatients {
    data: Patient[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface PageProps {
    flash: { message?: string };
    patients: PaginatedPatients;
}

export default function Index() {
    const { patients, flash, allTowns, allAges } = usePage().props as unknown as PageProps & {
        allTowns: string[];
        allAges: number[];
    };

    const { processing, delete: destroy } = useForm();

    // 🔎 Filters + Search states
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedTown, setSelectedTown] = useState<string>('');
    const [selectedAge, setSelectedAge] = useState<string>('');

    // Apply filters by sending request to backend
    const handleFilter = () => {
        router.get(route('patients.index'), {
            search: searchTerm,
            town: selectedTown,
            age: selectedAge
        }, { preserveState: true, replace: true });
    };

    // Clear filters
    const handleClear = () => {
        setSearchTerm('');
        setSelectedTown('');
        setSelectedAge('');
        router.get(route('patients.index'), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        destroy(route("patients.destroy", id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patients" />

            <div className='m-4 p-4 flex justify-between'>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Patients List</h1>
                <Link href={route('patients.create')}><Button>Add new Patient</Button></Link>
            </div>

            {/* Flash Notification */}
            {flash.message && (
                <div className="m-4">
                    <Alert className="flex items-center">
                        <Megaphone className="w-5 h-5 mr-2" />
                        <div>
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </div>
                    </Alert>
                </div>
            )}

            {/* 🔎 Search & Filter Controls */}
            <div className="m-4 grid gap-4 sm:grid-cols-1 md:grid-cols-5">
                <Input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                />

                <Select value={selectedTown} onValueChange={setSelectedTown}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Town" />
                    </SelectTrigger>
                    <SelectContent>
                        {allTowns.map((town) => (
                            <SelectItem key={town} value={town}>{town}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={selectedAge} onValueChange={setSelectedAge}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Age" />
                    </SelectTrigger>
                    <SelectContent>
                        {allAges.map((age) => (
                            <SelectItem key={age} value={String(age)}>{age}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button variant="outline" onClick={handleFilter}>
                    Apply Filters
                </Button>

                <Button variant="outline" onClick={handleClear}>
                    Clear Filters
                </Button>
            </div>

            {/* Patients Table */}
            <div className="m-4">
                {patients.data.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Town</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>Trials left</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {patients.data.map((patient) => (
                                <TableRow key={patient.id}>
                                    <TableCell>{patient.id}</TableCell>
                                    <TableCell>{patient.name}</TableCell>
                                    <TableCell>{patient.phone}</TableCell>
                                    <TableCell>{patient.town}</TableCell>
                                    <TableCell>{patient.age}</TableCell>
                                    <TableCell>{patient.free_trials}</TableCell>
                                    <TableCell>
                                        <Link href={route('patients.edit', patient.id)}>
                                            <button className='text-blue-400 hover:text-blue-800'>
                                                <SquarePen />
                                            </button>
                                        </Link>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button
                                                    className="text-red-400 hover:text-red-800 ml-2"
                                                    disabled={processing}
                                                >
                                                    <Trash2 />
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Patient</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete <b>{patient.name}</b>? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(patient.id)}
                                                        className="bg-red-700 text-white hover:bg-red-600"
                                                        disabled={processing}
                                                    >
                                                        Confirm
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">No patients found.</p>
                )}
            </div>

            {/* Pagination */}
            <Pagination>
                <PaginationContent>
                    {patients.links.map((link, i) => (
                        <PaginationItem key={i}>
                            {link.url ? (
                                <PaginationLink
                                    href={link.url}
                                    isActive={link.active}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <PaginationEllipsis />
                            )}
                        </PaginationItem>
                    ))}
                </PaginationContent>
            </Pagination>
        </AppLayout>
    );
}

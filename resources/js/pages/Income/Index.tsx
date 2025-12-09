import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';
import { route } from 'ziggy-js';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from '@/components/ui/pagination';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const breadcrumbs = [
    {
        title: 'Income',
        href: '/income',
    },
];

// Interfaces
interface Patient {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
}

interface Record {
    id: number;
    patient: Patient;
    product: Product;
    duration: number;
    price: string;
    status: 'Trial' | 'Paid' | 'VVIP';
    voucher_path?: string | null;
    voucher_url?: string | null;
    created_at: string;
}

interface PaginatedRecords {
    data: Record[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface PageProps {
    flash: { message?: string };
    records: PaginatedRecords;
    filters: { search?: string };
}

export default function Index() {
    const { records, flash, filters } = usePage().props as unknown as PageProps;
    const { delete: destroy } = useForm();

    // 🔍 Handle Search
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        router.get(route('income.index'), { search: formData.get('search') });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Records" />

            {/* 🔎 Header with Search */}
            <div className="m-4 flex flex-col items-center justify-between gap-4 p-4 md:flex-row">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Income List</h1>
            </div>
            <div className="m-4 flex justify-center">
                <form onSubmit={handleSearch} className="flex w-full max-w-3xl space-x-3">
                    <Input
                        type="text"
                        name="search"
                        placeholder="Search by patient name..."
                        defaultValue={filters.search ?? ''}
                        className="flex-grow"
                    />
                    <Button type="submit">Search</Button>
                    {filters.search && (
                        <Button type="button" variant="outline" onClick={() => router.get(route('income.index'))}>
                            Clear
                        </Button>
                    )}
                </form>
            </div>

            {/* ✅ Flash Notification */}
            {flash.message && (
                <div className="m-4">
                    <Alert className="flex items-center">
                        <Megaphone className="mr-2 h-5 w-5" />
                        <div>
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </div>
                    </Alert>
                </div>
            )}

            {/* 📋 Records Table */}
            <div className="m-4 border border-gray-200 dark:border-gray-700">
                {records.data.length > 0 ? (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Voucher</TableHead>
                                    <TableHead>Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.data.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell>{record.id}</TableCell>
                                        <TableCell>{record.patient?.name ?? 'Unknown'}</TableCell>
                                        <TableCell>
                                            {record.products.length > 0
                                                ? record.products.map(p => p.name).join(', ')
                                                : 'None'}
                                        </TableCell>

                                        <TableCell>{record.duration} min</TableCell>
                                        <TableCell>{record.price} MMK</TableCell>

                                        <TableCell>
                                            <span
                                                className={`rounded px-2 py-1 text-xs font-semibold ${record.status === 'VVIP'
                                                        ? 'bg-purple-200 text-purple-800'
                                                        : record.status === 'Paid'
                                                            ? 'bg-green-200 text-green-800'
                                                            : 'bg-gray-200 text-gray-800'
                                                    }`}
                                            >
                                                {record.status}
                                            </span>
                                        </TableCell>

                                        {/* ✅ Voucher column */}
                                        <TableCell>
                                            {record.voucher_url ? (
                                                <a
                                                    href={record.voucher_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    View Voucher
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">No voucher</span>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {new Intl.DateTimeFormat('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            }).format(new Date(record.created_at))}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </>
                ) : (
                    <div className="py-12 text-center">
                        <p className="text-lg text-gray-500 dark:text-gray-400">No records found.</p>
                    </div>
                )}
            </div>

            {/* 📑 Pagination */}
            <Pagination>
                <PaginationContent>
                    {records.links.map((link, i) => (
                        <PaginationItem key={i}>
                            {link.url ? (
                                <PaginationLink href={link.url} isActive={link.active} dangerouslySetInnerHTML={{ __html: link.label }} />
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

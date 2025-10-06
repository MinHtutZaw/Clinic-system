import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Megaphone } from "lucide-react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";

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
    PaginationItem,
    PaginationLink,
    PaginationEllipsis,
} from "@/components/ui/pagination";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const breadcrumbs = [
    {
        title: "Records",
        href: "/records",
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
    status: "Trial" | "Paid" | "VVIP";
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
        router.get(route("records.index"), { search: formData.get("search") });
    };

    const handleDelete = (id: number) => {
        destroy(route("records.destroy", id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Records" />

            {/* 🔎 Header with Search */}
            <div className="m-4 p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Records List
                </h1>
                <Link href={route("records.create")}>
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:opacity-90">
                        Add Record
                    </Button>
                </Link>
            </div>

            {/* Search Box */}
            <div className="m-4 flex justify-center">
                <form
                    onSubmit={handleSearch}
                    className="flex w-full max-w-3xl space-x-3"
                >
                    <Input
                        type="text"
                        name="search"
                        placeholder="Search by patient name..."
                        defaultValue={filters.search ?? ""}
                        className="flex-grow rounded-md"
                    />
                    <Button type="submit" className="shadow-md">Search</Button>
                    {filters.search && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.get(route("records.index"))}
                            className="border-gray-400"
                        >
                            Clear
                        </Button>
                    )}
                </form>
            </div>

            {/* Flash Notification */}
            {flash.message && (
                <div className="m-4 animate-fade-in">
                    <Alert className="flex items-center bg-green-50 border-l-4 border-green-500 rounded-md shadow">
                        <Megaphone className="w-6 h-6 text-green-600 mr-2" />
                        <div>
                            <AlertTitle className="font-bold text-green-800">Success!</AlertTitle>
                            <AlertDescription className="text-green-700">{flash.message}</AlertDescription>
                        </div>
                    </Alert>
                </div>
            )}

            {/* Table */}
            <div className="m-4 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
                <Table>
                    <TableHeader className="bg-gray-100 dark:bg-gray-800">
                        <TableRow>
                            <TableHead className="font-semibold">ID</TableHead>
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
                            <TableRow
                                key={record.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                                <TableCell>{record.id}</TableCell>
                                <TableCell>{record.patient?.name ?? "Unknown"}</TableCell>
                                <TableCell>{record.product?.name ?? "Unknown"}</TableCell>
                                <TableCell>{record.duration} min</TableCell>
                                <TableCell>{record.price} MMK</TableCell>

                                {/* Status Badge */}
                                <TableCell>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${record.status === "VVIP"
                                                ? "bg-purple-100 text-purple-700"
                                                : record.status === "Paid"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {record.status}
                                    </span>
                                </TableCell>

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
                                    {new Intl.DateTimeFormat("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }).format(new Date(record.created_at))}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <Pagination className="my-6">
                <PaginationContent className="space-x-2">
                    {records.links.map((link, i) => (
                        <PaginationItem key={i}>
                            {link.url ? (
                                <PaginationLink
                                    href={link.url}
                                    isActive={link.active}
                                    className="px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
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

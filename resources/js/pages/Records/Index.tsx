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
            <div className="m-4 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Records List
                </h1>
                <div className="flex items-center space-x-2">

                    <Link href={route("records.create")}>
                        <Button>Add Record</Button>
                    </Link>
                </div>
            </div>
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
                        className="flex-grow"
                    />
                    <Button type="submit">Search</Button>
                    {filters.search && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.get(route("records.index"))}
                        >
                            Clear
                        </Button>
                    )}
                </form>
            </div>



            {/* ✅ Flash Notification */}
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

            {/* 📋 Records Table */}
            <div className="m-4">
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
                                    <TableHead>Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.data.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell>{record.id}</TableCell>
                                        <TableCell>
                                            {record.patient?.name ?? "Unknown"}
                                        </TableCell>
                                        <TableCell>
                                            {record.product?.name ?? "Unknown"}
                                        </TableCell>
                                        <TableCell>{record.duration} min</TableCell>
                                        <TableCell>${record.price}</TableCell>
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
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No records found.
                        </p>
                    </div>
                )}
            </div>

            {/* 📑 Pagination */}
            <Pagination>
                <PaginationContent>
                    {records.links.map((link, i) => (
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

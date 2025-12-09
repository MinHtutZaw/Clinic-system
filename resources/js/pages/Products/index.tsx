import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
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

import { toast } from "sonner";
import { useEffect } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];


interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    duration: number;
   
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedProducts {
    data: Product[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface PageProps {
    flash: { message?: string };
    products: PaginatedProducts;
}

export default function Index() {
    const { products, flash } = usePage().props as unknown as PageProps;
    const { processing, delete: destroy } = useForm();

    // ✅ Toast when flash message exists
    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message, {
                icon: <Megaphone className="w-5 h-5" />,
                className: "text-white rounded-lg shadow-lg",
                style: { width: '30rem' },
            });
        }
    }, [flash?.message]);

    const handleDelete = (id: number) => {
        destroy(route('products.destroy', id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className='m-4 p-4 flex justify-between'>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Products List
                </h1>
                <Link href={route('products.create')}>
                    <Button>Add new Product</Button>
                </Link>
            </div>

            <div className="m-4">
                <div className="m-4">
                    {products.data.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Price </TableHead>
                                    <TableHead>Duration (min)</TableHead>
                                    
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {products.data.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>
                                            {product.description.length > 50
                                                ? product.description.substring(0, 50) + "..."
                                                : product.description}
                                        </TableCell>
                                        <TableCell>
                                            {parseFloat(product.price).toString()} MMK
                                        </TableCell>

                                        <TableCell>{product.duration} </TableCell>

                                      

                                        <TableCell className="space-x-2">
                                            <Link href={route('products.edit', product.id)}>
                                                <button className="text-blue-400 hover:text-blue-800">
                                                    <SquarePen />
                                                </button>
                                            </Link>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button
                                                        className="text-red-400 hover:text-red-800"
                                                        disabled={processing}
                                                    >
                                                        <Trash2 />
                                                    </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete{" "}
                                                            <span className="font-semibold">
                                                                {product.name}
                                                            </span>
                                                            ? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(product.id)}
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
                        <p className="text-center text-gray-500 dark:text-gray-300">
                            No products found.
                        </p>
                    )}
                </div>

                {/* ✅ Pagination */}
                <Pagination className='justify-center m-3'>
                    <PaginationContent>
                        {products.links.map((link, i) => (
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
            </div>
        </AppLayout>
    );
}

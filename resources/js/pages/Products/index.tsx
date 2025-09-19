import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BadgeAlert, Megaphone, SquarePen, Trash2 } from 'lucide-react';

import { route } from 'ziggy-js'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

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
} from "@/components/ui/alert-dialog"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];
interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
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

type AlertVariant = "default" | "destructive" | "success"; //  "success"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: AlertVariant;
}

export default function index() {

    const { products, flash } = usePage().props as unknown as PageProps;

    const { processing, delete: destroy } = useForm();


    const handleDelete = (id: number, name: string) => {

        destroy(route('products.destroy', id));

    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className='m-4 p-4 flex justify-between'>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Products List</h1>
                <Link href={route('products.create')}><Button>Add new Products</Button></Link>
            </div>

            {/* Flash  Notification*/}
            <div className="m-4 p-4 flex flex-col gap-4">

                {flash.message && (
                    <Alert className="flex items-center">
                        <Megaphone className="w-5 h-5 mr-2" />
                        <div>
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </div>
                    </Alert>
                )}


                <div className="m-4 ">
                    {products.data.length > 0 && (
                        <Table>

                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Price per sessions</TableHead>
                                    <TableHead>Description</TableHead>

                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {products.data.map(
                                    (product) => (
                                        <TableRow>
                                            <TableCell className="font-medium">{product.id} </TableCell>
                                            <TableCell>{product.name} </TableCell>
                                            <TableCell>{product.price} </TableCell>
                                            <TableCell>{product.description} </TableCell>

                                            <TableCell className="space-x-2">
                                                <Link href={route('products.edit', product.id)}> <button className='text-blue-400 hover:text-blue-800'>  <SquarePen /></button></Link>
                                                {/* Delete with AlertDialog */}
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
                                                            <AlertDialogTitle>
                                                                Delete product
                                                            </AlertDialogTitle>
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
                                                                onClick={() =>
                                                                    handleDelete(product.id, product.name)
                                                                }
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
                                    )
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>


                <Pagination>
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

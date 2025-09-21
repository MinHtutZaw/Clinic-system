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
import expenses from '@/routes/expenses';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'expenses', href: '/expenses' },
];

interface Expense {
    id: number;
    amount: string;
    created_at: string;
    remarks: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedExpenses {
    data: Expense[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface PageProps {
    flash: { message?: string };
    expenses: PaginatedExpenses;
}


interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedExpenses {
    data: Expense[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface PageProps {
    flash: { message?: string };
    expenses: PaginatedExpenses;
}

export default function Index() {
    const { expenses, flash, allTowns, allAges } = usePage().props as unknown as PageProps & {
        allTowns: string[];
        allAges: number[];
    };

    const { processing, delete: destroy } = useForm();



    const handleDelete = (id: number) => {
        destroy(route("expense.destroy", id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Expenses" />

            <div className='m-4 p-4 flex justify-between'>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Expenses Table</h1>
                <Link href={route('expenses.create')}><Button>Add new Expenses</Button></Link>
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



            {/* Expenses Table */}
            <div className="m-4">
                {expenses.data.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Remarks</TableHead>
                                {/* <TableHead>Action</TableHead> */}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {expenses.data.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell>{expense.id}</TableCell>
                                    <TableCell>{parseFloat(expense.amount).toFixed(0)} MMK</TableCell>


                                    <TableCell>
                                        {new Date(expense.created_at).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </TableCell>

                                    <TableCell>{expense.remarks}</TableCell>

                                    {/* <TableCell>
                                        <Link href={route('expense.edit', expense.id)}>
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
                                                    <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete ? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(expense.id)}
                                                        className="bg-red-700 text-white hover:bg-red-600"
                                                        disabled={processing}
                                                    >
                                                        Confirm
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">No Expenses History.</p>
                )}
            </div>

            {/* Pagination */}
            <Pagination>
                <PaginationContent>
                    {expenses.links.map((link, i) => (
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

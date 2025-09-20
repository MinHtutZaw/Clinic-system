import { Head, Link, router, usePage, useForm } from "@inertiajs/react";
import { Megaphone, SquarePen, Trash2 } from "lucide-react";
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

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const breadcrumbs = [
    {
        title: "Records",
        href: "/records",
    },
];

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
}

interface PageProps {
    flash: { message?: string };
    records: Record[];
}

export default function Index() {
    const { records, flash } = usePage().props as unknown as PageProps;
    const { processing, delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        destroy(route("records.destroy", id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Records" />

            <div className="m-4 p-4 flex justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Records List
                </h1>
                <Link href={route("records.create")}>
                    <Button>Add Record</Button>
                </Link>
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

            {/* Records Table */}
            <div className="m-4">
                {records.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* {records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{record.id}</TableCell>
                                    <TableCell>{record.patient?.id}</TableCell>
                                    <TableCell>{record.product?.id}</TableCell>
                                    <TableCell>{record.duration} min</TableCell>
                                    <TableCell>${record.price}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Link href={route("records.edit", record.id)}>
                                            <button className="text-blue-500 hover:text-blue-800">
                                                <SquarePen />
                                            </button>
                                        </Link>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button
                                                    className="text-red-500 hover:text-red-800"
                                                    disabled={processing}
                                                >
                                                    <Trash2 />
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Record</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete record{" "}
                                                        <span className="font-semibold">
                                                            #{record.id}
                                                        </span>
                                                        ? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(record.id)}
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
                            ))} */}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No records found.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

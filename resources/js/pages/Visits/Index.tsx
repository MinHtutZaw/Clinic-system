import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from "@/types";

interface Patient {
    id: number;
    name: string;
    phone: string;
    town: string;
    age: number;
    role: string;
}

interface Visit {
    id: number;
    visit_at: string;
    weight_kg: number | null;
    oxygen_saturation: number | null;
    bp_systolic: number | null;
    bp_diastolic: number | null;
    diabetes: number | null;
    notes: string | null;
}

interface VisitHistoryProps {
    patient: Patient;
    visits: Visit[];
}

export default function Index({ patient, visits }: VisitHistoryProps) {

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Patients", href: "/patients" },
        { title: patient.name, href: route("patients.edit", patient.id) },
        { title: "Visit History", href: route("patients.visits.index", patient.id) },
    ];

    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Visit History" />

            <div className="m-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-semibold">
                        Visit History for {patient.name}
                    </h1>

                    <Link href={route("patients.visits.create", patient.id)}>
                        <Button>Add New Visit</Button>
                    </Link>
                </div>

                {visits.length === 0 ? (
                    <p className="text-gray-500">No visits recorded yet.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Weight (kg)</TableHead>
                                <TableHead>Oxygen %</TableHead>
                                <TableHead>Blood Pressure</TableHead>
                                <TableHead>Diabetes</TableHead>
                                <TableHead>Notes</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {visits.map((v) => (
                                <TableRow key={v.id}>
                                    <TableCell>{new Date(v.visit_at).toLocaleString()}</TableCell>
                                    <TableCell>{v.weight_kg}</TableCell>
                                    <TableCell>{v.oxygen_saturation }</TableCell>
                                    <TableCell>
                                        {v.bp_systolic && v.bp_diastolic
                                            ? `${v.bp_systolic}/${v.bp_diastolic}`
                                            : "-"}
                                    </TableCell>
                                    <TableCell>{v.diabetes ?? "-"}</TableCell>
                                    <TableCell>{v.notes ?? "-"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </AppLayout>
    );
}

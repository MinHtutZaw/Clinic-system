import { Head, useForm, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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

interface CreateVisitProps {
    patient: Patient;
}

export default function Create({ patient }: CreateVisitProps) {

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Patients", href: "/patients" },
        { title: `Add Visit for ${patient.name}`, href: route("patients.visits.create", patient.id) },
    ];

    const { data, setData, post, processing, errors } = useForm({
        weight_kg: "",
        oxygen_saturation: "",
        bp_systolic: "",
        bp_diastolic: "",
        diabetes: "",
        notes: "",
    });
    const isFormValid =
        data.weight_kg.trim() !== "" &&
        data.oxygen_saturation.trim() !== "" &&
        data.bp_systolic.trim() !== "" &&
        data.bp_diastolic.trim() !== "";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("patients.visits.store", patient.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Visit" />

            <div className="m-4">

                <Card className="shadow-sm">
                    <CardContent className="p-6">
                        <h1 className="text-3xl font-semibold mb-6">
                            Add Visit - <span >{patient.name}</span>
                        </h1>

                        {/* Section Title */}
                        <h2 className="text-lg font-semibold mb-2 border-b pb-1">Vitals</h2>

                        <form onSubmit={handleSubmit} className="grid gap-6">

                            {/* Two-column layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Weight */}
                                <div>
                                    <Label>Weight (kg)</Label>
                                    <Input
                                        type="number"
                                    
                                        value={data.weight_kg}
                                        onChange={(e) => setData("weight_kg", e.target.value)}
                                        placeholder="Enter weight"
                                    />
                                </div>

                                {/* Oxygen */}
                                <div>
                                    <Label>Oxygen Saturation (%)</Label>
                                    <Input
                                        type="number"
                                        value={data.oxygen_saturation}
                                        onChange={(e) => setData("oxygen_saturation", e.target.value)}
                                        placeholder="Enter oxygen level"
                                    />
                                </div>

                                {/* BP Systolic */}
                                <div>
                                    <Label>BP Systolic</Label>
                                    <Input
                                        type="number"
                                        value={data.bp_systolic}
                                        onChange={(e) => setData("bp_systolic", e.target.value)}
                                        placeholder="Example: 120"
                                    />
                                </div>

                                {/* BP Diastolic */}
                                <div>
                                    <Label>BP Diastolic</Label>
                                    <Input
                                        type="number"
                                        value={data.bp_diastolic}
                                        onChange={(e) => setData("bp_diastolic", e.target.value)}
                                        placeholder="Example: 80"
                                    />
                                </div>

                                {/* Diabetes Test Result */}
                                <div className="md:col-span-2">
                                    <Label>Diabetes Test Result</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={data.diabetes}
                                        onChange={(e) => setData("diabetes", e.target.value)}
                                        placeholder="Enter test result (optional)"
                                    />
                                </div>

                            </div>

                            {/* Notes */}
                            <div>
                                <Label>Notes</Label>
                                <textarea
                                    className="border rounded-md w-full p-3"
                                    rows={3}
                                    value={data.notes}
                                    onChange={(e) => setData("notes", e.target.value)}
                                    placeholder="Add any visit notes..."
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex  mt-4">
                                {/* <Link href={route("patients.visits.index", patient.id)}>
                                    <Button variant="outline">Cancel</Button>
                                </Link> */}

                                <Button type="submit" disabled={processing || !isFormValid}>
                                    Save 
                                </Button>
                            </div>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

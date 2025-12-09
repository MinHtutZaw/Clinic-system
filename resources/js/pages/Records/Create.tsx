// @ts-nocheck
import { useState, useEffect } from "react";
import { Head, router, useForm, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Megaphone } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Card } from "@/components/ui/card";

const breadcrumbs = [
  { title: "Records", href: "/records" },
  { title: "Create Record", href: route("records.create") },
];

export default function Create({ patients, products, services, flash }) {
  // Form state
  const { data, setData, post, processing, errors } = useForm({
    patient_id: "",
    product_ids: [] as number[],
    service_ids: [] as number[],
    duration: "",
  });

  // Combobox state
  const [open, setOpen] = useState(false);

  // Total price
  const [totalPrice, setTotalPrice] = useState(0);

  // Calculate total price when products/services change
  useEffect(() => {
    const patient = patients.find((p) => String(p.id) === data.patient_id);

    // If patient is on free trial, total price is 0
    if (patient?.free_trials > 0) {
      setTotalPrice(0);
      return;
    }

    let price = 0;
    products.forEach((p) => {
      if (data.product_ids.includes(p.id)) price += Number(p.price);
    });
    services.forEach((s) => {
      if (data.service_ids.includes(s.id)) price += Number(s.service_price);
    });

    setTotalPrice(price);
  }, [data.patient_id, data.product_ids, data.service_ids, patients, products, services]);

  const handleSelectPatient = (id: string | number) => {
    setData("patient_id", id.toString());
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route("records.store"));
  };

  const selectedPatient = patients.find((p) => String(p.id) === data.patient_id);
  const isOnTrial = selectedPatient && selectedPatient.free_trials > 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Record" />

      {/* Page Header */}
      <div className="m-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Create Record
          </h1>
          
        </div>

        <Link href={route("records.index")}>
          <Button variant="outline">Back to Records</Button>
        </Link>
      </div>

      {/* Flash Message */}
      {flash?.message && (
        <div className="m-4">
          <Alert className="flex items-center bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-md shadow-sm">
            <Megaphone className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
            <div>
              <AlertTitle className="font-semibold text-green-800 dark:text-green-300">
                Success
              </AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-200">
                {flash.message}
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}

      {/* Main Card */}
      <div className="m-4">
        <Card className="p-6 shadow-sm">
          <form
            onSubmit={handleSubmit}
            className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]"
          >
            {/* Left: Form fields */}
            <div className="space-y-6">
              {/* Patient Combobox */}
              <div className="space-y-2">
                <Label htmlFor="patient_id">Search Patient</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {data.patient_id
                        ? selectedPatient
                          ? `${selectedPatient.name} (ID: ${selectedPatient.id})`
                          : "Select patient"
                        : "Select patient"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search patient..." />
                      <CommandEmpty>No patient found.</CommandEmpty>
                      <CommandGroup>
                        {patients.map((p) => (
                          <CommandItem
                            key={p.id}
                            onSelect={() => handleSelectPatient(p.id)}
                          >
                            {p.name} (ID: {p.id})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.patient_id && (
                  <p className="text-sm text-red-500">{errors.patient_id}</p>
                )}
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  type="number"
                  id="duration"
                  value={data.duration}
                  onChange={(e) => setData("duration", e.target.value)}
                  min={1}
                  placeholder="Enter duration in minutes"
                />
                {errors.duration && (
                  <p className="text-sm text-red-500">{errors.duration}</p>
                )}
              </div>

              {/* Products & Services */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Products */}
                <div className="space-y-2">
                  <Label>Products</Label>
                  <div className="space-y-2 rounded-md border p-3 bg-gray-50 dark:bg-gray-900/40">
                    {products.length === 0 ? (
                      <p className="text-sm text-gray-500">No products available.</p>
                    ) : (
                      products.map((product) => (
                        <label
                          key={product.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={data.product_ids.includes(product.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setData("product_ids", [...data.product_ids, product.id]);
                                } else {
                                  setData(
                                    "product_ids",
                                    data.product_ids.filter((id) => id !== product.id)
                                  );
                                }
                              }}
                            />
                            <span>{product.name}</span>
                          </div>
                          <span className="font-medium text-gray-800 dark:text-gray-100">
                            {Number(product.price).toLocaleString()} MMK
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                  {errors.product_ids && (
                    <p className="text-sm text-red-500">{errors.product_ids}</p>
                  )}
                </div>

                {/* Services */}
                <div className="space-y-2">
                  <Label>Services (Optional)</Label>
                  <div className="space-y-2 rounded-md border p-3 bg-gray-50 dark:bg-gray-900/40">
                    {services.length === 0 ? (
                      <p className="text-sm text-gray-500">No services available.</p>
                    ) : (
                      services.map((service) => (
                        <label
                          key={service.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={data.service_ids.includes(service.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setData("service_ids", [...data.service_ids, service.id]);
                                } else {
                                  setData(
                                    "service_ids",
                                    data.service_ids.filter((id) => id !== service.id)
                                  );
                                }
                              }}
                            />
                            <span>{service.name}</span>
                          </div>
                          <span className="font-medium text-gray-800 dark:text-gray-100">
                            {Number(service.service_price).toLocaleString()} MMK
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                  {errors.service_ids && (
                    <p className="text-sm text-red-500">{errors.service_ids}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Summary panel */}
            <div className="space-y-4 lg:border-l lg:pl-6 border-gray-200 dark:border-gray-800">
              <div className="rounded-lg bg-gray-50 dark:bg-gray-900/40 p-4 space-y-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Visit Summary
                </h2>

                <div className="text-sm space-y-1">
                  <p className="text-gray-500 dark:text-gray-400">Patient</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedPatient
                      ? `${selectedPatient.name} (ID: ${selectedPatient.id})`
                      : "Not selected"}
                  </p>
                  {selectedPatient && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Free trials left:{" "}
                      <span className="font-semibold">
                        {selectedPatient.free_trials ?? 0}
                      </span>
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Total Price
                  </p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {totalPrice.toLocaleString()} MMK
                  </p>
                  {isOnTrial && (
                    <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                      This patient still has a free trial, so today&apos;s record is free
                      (0 MMK).
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={processing}>
                  {processing ? "Saving..." : "Create Record"}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { BadgeAlert } from "lucide-react";
import { route } from "ziggy-js";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Add Expense",
    href: "/expenses/create",
  },
];

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    amount: "",
    remarks: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("expense.store")); // Laravel route to ExpenseController@store
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Expense" />

      <div className="m-4 p-4">
        <h1 className="text-xl font-semibold mb-4 flex justify-center">
          Add Expense
        </h1>

        <div className="flex justify-center">
          {/* Expense Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-md w-full"
          >
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <BadgeAlert className="h-4 w-4" />
                <AlertTitle>Error !!</AlertTitle>
                <AlertDescription>
                  <ul>
                    {Object.entries(errors).map(([key, message]) => (
                      <li key={key}>{message as string}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="amount">Amount (MMK)</Label>
              <Input
                id="amount"
                type="number"
                min="0"
               
                value={data.amount}
                onChange={(e) => setData("amount", e.target.value)}
                placeholder="Enter expense amount"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount}</p>
              )}
            </div>

            <div>
              <Label htmlFor="remarks">Remarks</Label>
              <Input
                id="remarks"
                type="text"
                value={data.remarks}
                onChange={(e) => setData("remarks", e.target.value)}
                placeholder="Optional description"
              />
              {errors.remarks && (
                <p className="text-red-500 text-sm">{errors.remarks}</p>
              )}
            </div>

            <Button type="submit" disabled={processing} className="w-full">
              {processing ? "Saving..." : "Save Expense"}
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::orderBy('id', 'desc')->paginate(10);
        return Inertia::render('Services/Index', [
            'services' => $services,
        ]);
    }

    public function create()
    {
        return Inertia::render('Services/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'service_price' => 'required|numeric|min:0',
        ]);

        Service::create($validated);

        return redirect()->route('services.index')
                         ->with('message', 'Service created successfully.');
    }

    public function edit(Service $service)
    {
        return Inertia::render('Services/Edit', [
            'service' => $service,
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'service_price' => 'required|numeric|min:0',
        ]);

        $service->update($validated);

        return redirect()->route('services.index')
                         ->with('message', 'Service updated successfully.');
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return redirect()->route('services.index')
                         ->with('message', 'Service deleted successfully.');
    }
}

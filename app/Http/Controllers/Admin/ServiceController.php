<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TypeOfService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        $services = TypeOfService::latest()->paginate(10);
        return Inertia::render('Admin/Service/Index', compact('services'));
    }

    public function create()
    {
        return Inertia::render('Admin/Service/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_name' => 'required|string|max:255',
            'price' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);
        TypeOfService::create($validated);
        return redirect()->route('admin.services.index')->with('success', 'Service created successfully.');
    }

    public function edit(TypeOfService $service)
    {
        return Inertia::render('Admin/Service/Form', compact('service'));
    }

    public function update(Request $request, TypeOfService $service)
    {
        $validated = $request->validate([
            'service_name' => 'required|string|max:255',
            'price' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);
        $service->update($validated);
        return redirect()->route('admin.services.index')->with('success', 'Service updated successfully.');
    }

    public function destroy(TypeOfService $service)
    {
        $service->delete();
        return redirect()->route('admin.services.index')->with('success', 'Service deleted successfully.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::orderBy('id', 'desc')->paginate(2); // 5 per page
        return Inertia::render('Products/index',compact('products'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Products/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $validated = $request->validate(
            [
                'name'    => 'required|string|max:255',
                'price'     => 'required|integer|min:0',
                'description'   => 'required|string',
            ]
        );
        Product::create($validated);
        return redirect()->route('products.index')->with('message', 'Data is added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        return Inertia::render('Products/edit',compact('product'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
          $validated = $request->validate(
            [
               'name'    => 'required|string|max:255',
                'price'     => 'required|integer|min:0',
                'description'   => 'required|string',
            ]
        );
         $product->update(
            [
                'name' =>$request ->input('name'),
                'price' =>$request ->input('price'),
                'description' =>$request ->input('description'),
                
            ]
            );

            return redirect()->route('products.index')->with('message', 'Data is updated successfully.');
    }

    public function destroy(Product $product){
        $product->delete();
        return redirect()->route('products.index')->with('message', 'Data is deleted successfully.');

    }

   
}

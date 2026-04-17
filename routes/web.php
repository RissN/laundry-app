<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\VoucherController as AdminVoucherController;
use App\Http\Controllers\Operator\TransactionController;
use App\Http\Controllers\Operator\PickupController;
use App\Http\Controllers\Operator\VoucherController;
use App\Http\Controllers\Pimpinan\ReportController;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Routes (id_level = 1)
    Route::middleware(['role:1'])->prefix('admin')->name('admin.')->group(function () {
        Route::resource('customers', CustomerController::class);
        Route::resource('users', UserController::class);
        Route::resource('services', ServiceController::class);
        Route::resource('voucher', AdminVoucherController::class);
    });

    // Operator Routes (id_level = 2 or 1)
    Route::middleware(['role:2'])->prefix('operator')->name('operator.')->group(function () {
        Route::get('transaction', [TransactionController::class, 'create'])->name('transaction.create');
        Route::post('transaction', [TransactionController::class, 'store'])->name('transaction.store');
        
        Route::get('pickup', [PickupController::class, 'index'])->name('pickup.index');
        Route::post('pickup/{order}', [PickupController::class, 'store'])->name('pickup.store');

        // Changed from resource to just validation for non-admins
        Route::post('voucher/validate', [VoucherController::class, 'validateCode'])->name('voucher.validate');
    });

    // Pimpinan Routes (id_level = 3)
    Route::middleware(['role:3'])->prefix('pimpinan')->name('pimpinan.')->group(function () {
        Route::get('report', [ReportController::class, 'index'])->name('report.index');
    });
});

require __DIR__.'/auth.php';

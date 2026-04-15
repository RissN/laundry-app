<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Customer;
use App\Models\TransOrder;
use App\Models\TransOrderDetail;
use App\Models\TypeOfService;
use Faker\Factory as Faker;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DummyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        // 1. Clean data (Truncate in order of dependencies)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('trans_order_details')->truncate();
        DB::table('trans_orders')->truncate();
        DB::table('customers')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->command->info('Database cleaned. Starting seeding...');

        // 2. Create 25 Customers
        $customers = [];
        for ($i = 0; $i < 25; $i++) {
            $customers[] = Customer::create([
                'customer_name' => $faker->name,
                'phone' => '08' . $faker->unique()->numerify('##########'),
                'address' => $faker->address,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 3. Create 174 Transactions
        $services = TypeOfService::all();
        
        for ($i = 1; $i <= 174; $i++) {
            $customer = $faker->randomElement($customers);
            $orderDate = Carbon::now()->subDays(rand(0, 30));
            // Higher chance of being "Selesai" (1) than "Diproses" (0)
            $status = $faker->randomElement([1, 1, 1, 0, 1]); 
            $orderCode = 'TRX-' . strtoupper(Str::random(8));

            $order = TransOrder::create([
                'id_customer' => $customer->id,
                'order_code' => $orderCode,
                'order_date' => $orderDate->format('Y-m-d'),
                'order_end_date' => $orderDate->copy()->addDays(rand(1, 3))->format('Y-m-d'),
                'order_status' => $status,
                'total' => 0, // Will update after details
                'created_at' => $orderDate,
                'updated_at' => $orderDate,
            ]);

            // Add 1-3 random services to each order
            $orderTotal = 0;
            $randomServices = $services->random(rand(1, 3));
            
            foreach ($randomServices as $service) {
                $qty = rand(1, 5);
                $subtotal = $service->price * $qty;
                
                TransOrderDetail::create([
                    'id_order' => $order->id,
                    'id_service' => $service->id,
                    'qty' => $qty,
                    'subtotal' => $subtotal,
                    'notes' => $faker->optional(0.3)->sentence(3),
                    'created_at' => $orderDate,
                    'updated_at' => $orderDate,
                ]);
                
                $orderTotal += $subtotal;
            }

            // Update order total
            $order->update(['total' => $orderTotal]);
        }

        $this->command->info('Seeding completed! 25 customers and 174 transactions created.');
    }
}

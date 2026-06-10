<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            OrganizationSeeder::class,
        ]);

        $admin = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
            ]
        );

        // Assign roles
        $admin->assignRole('Admin');

        $direktur = User::where('email', 'direktur@example.com')->first();
        if ($direktur) {
            $direktur->assignRole('Pimpinan');
        }

        $kasubdit = User::where('email', 'kasubdit@example.com')->first();
        if ($kasubdit) {
            $kasubdit->assignRole('Staf TU');
        }

        $staf = User::where('email', 'stafbudi@example.com')->first();
        if ($staf) {
            $staf->assignRole('Staf Pelaksana');
        }
    }
}

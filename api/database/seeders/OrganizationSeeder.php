<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class OrganizationSeeder extends Seeder
{
    public function run()
    {
        // Prevent duplicate seeding
        if (Organization::count() > 0) {
            return;
        }

        $org1 = Organization::create([
            'name' => 'Direktorat Jenderal (Level 1)',
            'level' => 1,
            'parent_id' => null,
            'weight' => 1,
        ]);
        
        $org2 = Organization::create([
            'name' => 'Direktorat A (Level 2)',
            'level' => 2,
            'parent_id' => $org1->id,
            'weight' => 1,
        ]);
        
        $org3 = Organization::create([
            'name' => 'Sub Direktorat A1 (Level 3)',
            'level' => 3,
            'parent_id' => $org2->id,
            'weight' => 1,
        ]);
        
        $org4 = Organization::create([
            'name' => 'Staf Pelaksana A1 (Level 4)',
            'level' => 4,
            'parent_id' => $org3->id,
            'weight' => 1,
        ]);

        // Assign Test User to level 1 so the system can route down to level 4
        $testUser = User::where('email', 'test@example.com')->first();
        if ($testUser) {
            $testUser->organization_id = $org1->id;
            $testUser->save();
        }

        // Create dummy users for each org level
        User::firstOrCreate(
            ['email' => 'direktur@example.com'],
            ['name' => 'Bapak Direktur', 'password' => Hash::make('password'), 'organization_id' => $org2->id]
        );
        
        User::firstOrCreate(
            ['email' => 'kasubdit@example.com'],
            ['name' => 'Ibu Kasubdit', 'password' => Hash::make('password'), 'organization_id' => $org3->id]
        );
        
        User::firstOrCreate(
            ['email' => 'stafbudi@example.com'],
            ['name' => 'Staf Budi', 'password' => Hash::make('password'), 'organization_id' => $org4->id]
        );
    }
}

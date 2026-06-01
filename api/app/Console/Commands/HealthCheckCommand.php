<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use App\Models\Letter;
use App\Models\Disposition;

class HealthCheckCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scribegov:health';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Periksa status kesehatan ScribeGov (DB, Queue, Metrik)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("========================================");
        $this->info("   ScribeGov Production Health Check    ");
        $this->info("========================================");
        
        $this->checkDatabase();
        $this->checkQueue();
        $this->printMetrics();

        $this->info("========================================");
    }

    private function checkDatabase()
    {
        $this->warn("\n[1] Database Connection:");
        try {
            DB::connection()->getPdo();
            $this->info("  [OK] Tersambung ke database (" . DB::connection()->getDatabaseName() . ")");
        } catch (\Exception $e) {
            $this->error("  [FAIL] Gagal tersambung ke database: " . $e->getMessage());
        }
    }

    private function checkQueue()
    {
        $this->warn("\n[2] Queue Status:");
        try {
            $redis = Redis::connection();
            $this->info("  [OK] Tersambung ke Redis");
            
            // Basic queue check
            $queueSize = Redis::llen('queues:default');
            $this->info("  -> Pekerjaan dalam antrean (default): $queueSize");
            
        } catch (\Exception $e) {
            $this->error("  [FAIL] Gagal memeriksa Redis/Queue: " . $e->getMessage());
        }
    }

    private function printMetrics()
    {
        $this->warn("\n[3] KPI & Application Metrics:");
        try {
            $totalLetters = Letter::count();
            $signedLetters = Letter::where('status', 'Signed')->count();
            $totalDispositions = Disposition::count();
            
            $this->line("  -> Total Surat Masuk: $totalLetters");
            $this->line("  -> Surat Ditandatangani: $signedLetters");
            $this->line("  -> Total Disposisi: $totalDispositions");
        } catch (\Exception $e) {
            $this->error("  [FAIL] Gagal mengambil metrik aplikasi.");
        }
    }
}

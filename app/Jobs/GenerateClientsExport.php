<?php

namespace App\Jobs;

use App\Exports\ClientsExport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class GenerateClientsExport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * @param  array{search?:string, company?:string, business_unit?:string}  $filters
     */
    public function __construct(
        public string $token,
        public array $filters = [],
    ) {}

    public function handle(): void
    {
        Cache::put(self::statusKey($this->token), 'processing', now()->addHours(2));

        Excel::store(new ClientsExport($this->filters), self::relativePath($this->token), 'local');

        Cache::put(self::statusKey($this->token), 'ready', now()->addHours(2));
    }

    public function failed(Throwable $exception): void
    {
        Cache::put(self::statusKey($this->token), 'failed', now()->addHours(2));
    }

    public static function statusKey(string $token): string
    {
        return 'client_export:'.$token;
    }

    public static function relativePath(string $token): string
    {
        return 'exports/clientes_'.$token.'.xlsx';
    }
}

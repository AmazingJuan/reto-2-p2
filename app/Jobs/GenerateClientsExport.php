<?php

namespace App\Jobs;

use App\Exports\ClientsExport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class GenerateClientsExport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public const RETENTION_HOURS = 2;

    /**
     * @param  array{search?:string, company?:string, business_unit?:string}  $filters
     */
    public function __construct(
        public string $token,
        public array $filters = [],
    ) {}

    public function handle(): void
    {
        $expiresAt = now()->addHours(self::RETENTION_HOURS);

        Cache::put(self::statusKey($this->token), 'processing', $expiresAt);

        Storage::disk('local')->makeDirectory('exports');

        Excel::store(new ClientsExport($this->filters), self::relativePath($this->token), 'local');

        self::ensureExportReadable(self::relativePath($this->token));

        Cache::put(self::statusKey($this->token), 'ready', $expiresAt);

        DeleteClientsExportFile::dispatch($this->token)->delay($expiresAt);
    }

    public function failed(Throwable $exception): void
    {
        Log::error('GenerateClientsExport failed', [
            'token' => $this->token,
            'message' => $exception->getMessage(),
            'exception' => $exception,
        ]);

        Cache::put(self::statusKey($this->token), 'failed', now()->addHours(self::RETENTION_HOURS));
    }

    public static function purge(string $token): void
    {
        $path = self::relativePath($token);

        if (Storage::disk('local')->exists($path)) {
            Storage::disk('local')->delete($path);
        }

        Cache::forget(self::statusKey($token));
    }

    public static function statusKey(string $token): string
    {
        return 'client_export:'.$token;
    }

    public static function relativePath(string $token): string
    {
        return 'exports/clientes_'.$token.'.xlsx';
    }

    public static function ensureExportReadable(string $relativePath): void
    {
        $disk = Storage::disk('local');

        $disk->makeDirectory('exports');

        $privateDir = storage_path('app/private');
        if (is_dir($privateDir)) {
            @chmod($privateDir, 0755);
        }

        $exportsDir = $disk->path('exports');
        if (is_dir($exportsDir)) {
            @chmod($exportsDir, 0775);
        }

        $fullPath = $disk->path($relativePath);
        if (is_file($fullPath)) {
            @chmod($fullPath, 0644);
        }
    }
}

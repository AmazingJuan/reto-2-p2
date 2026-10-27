<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * A document the client attached to a quotation request. The file lives on
 * the documents disk (config filesystems.documents); its own disk is kept so
 * files stored before a change of disk can still be downloaded.
 */
class QuotationDocument extends Model
{
    /** Files per request, size of each one (KB) and accepted extensions. Mirrored in quotation-wizard/documents.ts. */
    public const MAX_FILES = 5;

    public const MAX_KILOBYTES = 10240;

    public const EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'zip'];

    /**
     * Attributes:
     *
     * $this->attributes['id'] - int - Primary key identifier
     * $this->attributes['quotation_proposal_order_id'] - string - UUID of the request it was attached to
     * $this->attributes['question'] - string - Key of the answer (question) it was attached in
     * $this->attributes['disk'] - string - Filesystem disk that holds the file
     * $this->attributes['path'] - string - Path of the file on that disk
     * $this->attributes['original_name'] - string - Name of the file on the client's computer
     * $this->attributes['mime_type'] - string|null - MIME type detected on upload
     * $this->attributes['size'] - int - Size in bytes
     */

    /**
     * Mass assignable attributes.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'quotation_proposal_order_id',
        'question',
        'disk',
        'path',
        'original_name',
        'mime_type',
        'size',
    ];

    protected $hidden = ['disk', 'path'];

    protected $casts = [
        'size' => 'integer',
    ];

    /** Keep a file uploaded in a question of the request, under a folder of its own. */
    public static function store(QuotationProposalOrder $order, string $question, UploadedFile $file): self
    {
        $disk = config('filesystems.documents');

        return self::create([
            'quotation_proposal_order_id' => $order->getId(),
            'question' => $question,
            'disk' => $disk,
            'path' => $file->store('quotations/'.$order->getId(), $disk),
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(QuotationProposalOrder::class, 'quotation_proposal_order_id');
    }

    public function download(): StreamedResponse
    {
        return Storage::disk($this->getDisk())->download($this->getPath(), $this->getOriginalName());
    }

    /*
    |--------------------------------------------------------------------------
    | Getters
    |--------------------------------------------------------------------------
    */

    public function getId(): int
    {
        return $this->attributes['id'];
    }

    public function getQuestion(): string
    {
        return $this->attributes['question'];
    }

    public function getDisk(): string
    {
        return $this->attributes['disk'];
    }

    public function getPath(): string
    {
        return $this->attributes['path'];
    }

    public function getOriginalName(): string
    {
        return $this->attributes['original_name'];
    }

    public function getMimeType(): ?string
    {
        return $this->attributes['mime_type'] ?? null;
    }

    public function getSize(): int
    {
        return (int) $this->attributes['size'];
    }
}

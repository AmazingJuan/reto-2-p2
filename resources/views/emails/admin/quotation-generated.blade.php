@extends('emails.layouts.base')

@section('title', 'Cotización generada')

@section('heading', 'Cotización generada para el cliente')

@section('content')
  @php
    $contact = $quotationOrder->client;
  @endphp
  <p style="font-size:16px; margin:0 0 16px 0; text-align:left;">
    Se cargó la URL del documento y se notificó al cliente por correo.
  </p>

  <p style="margin:0 0 20px 0; text-align:left;">
    <span style="display:inline-block; background:#eef3ff; color:#1e3a8a; font-weight:600; padding:8px 16px; border-radius:6px; font-size:15px; font-family:Courier, monospace;">{{ $quotationOrder->getQuotationCode() ? $quotationOrder->getQuotationCode() : '#'.$quotationOrder->getId() }}</span>
  </p>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6; border-left:4px solid #10b981; padding:16px; border-radius:6px; text-align:left; margin:0 0 20px 0;">
    <tr>
      <td>
        <h3 style="margin:0 0 8px 0; font-size:15px; font-weight:bold; color:#065f46;">Cliente</h3>
        <p style="margin:4px 0; font-size:14px; color:#4b5563;"><strong>Nombre:</strong> {{ $contact?->name ?? '—' }}</p>
        <p style="margin:4px 0; font-size:14px; color:#4b5563;"><strong>Email:</strong> {{ $contact?->email ?? '—' }}</p>
        @if($quotationOrder->getQuotationUrl())
        <p style="margin:8px 0 0 0; font-size:14px; color:#4b5563;"><strong>Documento:</strong>
          <a href="{{ $quotationOrder->getQuotationUrl() }}" style="color:#2563eb;">Abrir enlace</a>
        </p>
        @endif
      </td>
    </tr>
  </table>
@endsection

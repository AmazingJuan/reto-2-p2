@extends('emails.layouts.base')

@section('title', 'Cotización generada')

@section('heading', 'Tu cotización está lista')

@section('content')
  <p style="font-size:16px; margin:0 0 16px 0;"><strong>Nos complace informarte que tu cotización ha sido generada correctamente.</strong></p>

  <p style="font-size:15px; margin:0 0 8px 0; color:#4b5563;">Referencia de cotización:</p>
  <p style="margin:0 0 20px 0;">
    <span style="display:inline-block; background:#eef3ff; color:#1e3a8a; font-weight:600; padding:8px 16px; border-radius:6px; font-size:15px; font-family:Courier, monospace;">{{ $order->getQuotationCode() ? $order->getQuotationCode() : '#'.$order->getId() }}</span>
  </p>

  @if($order->getQuotationUrl())
    <p style="font-size:15px; margin:0 0 16px 0; color:#4b5563;">Puedes descargar tu documento haciendo clic en el siguiente botón:</p>
    <a href="{{ $order->getQuotationUrl() }}" target="_blank" rel="noopener noreferrer" style="display:inline-block; background:#2563eb; color:#ffffff !important; text-decoration:none; padding:12px 28px; border-radius:8px; font-size:15px; font-weight:bold;">
      Descargar cotización
    </a>
  @else
    <p style="font-size:14px; margin:0; color:#6b7280; font-style:italic;">El documento aún no está disponible.</p>
  @endif

  @push('below_content')
    @include('emails.partials.company-contact')
  @endpush

@endsection



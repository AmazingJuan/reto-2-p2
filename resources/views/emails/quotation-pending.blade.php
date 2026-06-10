@extends('emails.layouts.base')

@section('title', 'Cotización en proceso')

@section('heading', 'Cotización en proceso')

@section('content')
  @php
    $contact = $quotationOrder->client;
  @endphp

  <p style="font-size:16px; margin:0 0 16px 0; font-weight:bold;">
    ¡Hola {{ $contact?->name ?? 'Usuario' }}!
  </p>
  <p style="font-size:16px; margin:0 0 16px 0; font-weight:bold;">
    Tu solicitud de cotización ha sido registrada exitosamente.
  </p>

  <p style="display:inline-block; background:#fef3c7; color:#92400e; font-weight:bold; padding:8px 16px; border-radius:8px; font-size:14px; margin:16px 0;">EN PROCESO DE GENERACIÓN</p>

  <p style="margin:16px 0;">
    <span style="display:inline-block; background:#eef3ff; color:#1e3a8a; font-weight:bold; padding:8px 16px; border-radius:6px; font-family:Courier, monospace; font-size:15px;">{{ $quotationOrder->getQuotationCode() ? $quotationOrder->getQuotationCode() : '#'.$quotationOrder->id }}</span>
  </p>

  @if($contact)
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6; border-left:4px solid #10b981; padding:16px; border-radius:6px; text-align:left; margin:24px 0;">
    <tr>
      <td>
        <h3 style="margin:0 0 8px 0; font-size:16px; font-weight:bold; color:#065f46;">Datos de contacto</h3>
        <p style="margin:4px 0; font-size:14px; color:#4b5563;"><strong>Nombre:</strong> {{ $contact->name ?? '' }}</p>
        @if(!empty($contact->company))
        <p style="margin:4px 0; font-size:14px; color:#4b5563;"><strong>Empresa:</strong> {{ $contact->company }}</p>
        @endif
        @if(!empty($contact->role))
        <p style="margin:4px 0; font-size:14px; color:#4b5563;"><strong>Cargo:</strong> {{ $contact->role }}</p>
        @endif
        <p style="margin:4px 0; font-size:14px; color:#4b5563;"><strong>Email:</strong> {{ $contact->email ?? '' }}</p>
        <p style="margin:4px 0; font-size:14px; color:#4b5563;"><strong>Teléfono:</strong> {{ $contact->phone ?? '' }}</p>
      </td>
    </tr>
  </table>
  @endif

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6; border-left:4px solid #2563eb; padding:16px; border-radius:6px; text-align:left; margin:24px 0;">
    <tr>
      <td>
        <h3 style="margin:0 0 8px 0; font-size:16px; font-weight:bold; color:#1f2937;">Detalles de la cotización</h3>
        <p style="margin:4px 0; font-size:14px; color:#4b5563;"><strong>Fecha de solicitud:</strong> {{ $quotationOrder->created_at?->format('d/m/Y H:i') ?? 'N/A' }}</p>
        <p style="margin:4px 0; font-size:14px; color:#4b5563;"><strong>Unidad de negocio:</strong> {{ $quotationOrder->business_unit ?? 'N/A' }}</p>
        @if(!empty($quotationOrder->gestion_line))
        <p style="margin:4px 0; font-size:14px; color:#4b5563;"><strong>Línea de gestión:</strong> {{ $quotationOrder->gestion_line }}</p>
        @endif
        @if(!empty($quotationOrder->professional_id))
        <p style="margin:4px 0; font-size:14px; color:#4b5563;"><strong>Profesional asignado:</strong> #{{ $quotationOrder->professional_id }}</p>
        @endif
      </td>
    </tr>
  </table>

  @if (!empty($quotationOrder->services))
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="text-align:left; margin:24px 0;">
    <tr>
      <td>
        <h3 style="font-size:15px; font-weight:bold; color:#1f2937; margin:0 0 8px 0;">Servicios solicitados</h3>
        <ul style="list-style:none; padding:8px; margin:0; background:#f9fafb; border-radius:6px;">
          @foreach ($quotationOrder->services as $service)
            <li style="font-size:14px; color:#374151; margin:4px 0;">• {{ is_array($service) ? ($service['name'] ?? json_encode($service)) : $service }}</li>
          @endforeach
        </ul>
      </td>
    </tr>
  </table>
  @endif

  @if (!empty($quotationOrder->answers))
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="text-align:left; margin:24px 0;">
    <tr>
      <td>
        <h3 style="font-size:15px; font-weight:bold; color:#1f2937; margin:0 0 8px 0;">Respuestas del formulario</h3>
        <ul style="list-style:none; padding:8px; margin:0; background:#f9fafb; border-radius:6px;">
          @foreach ($quotationOrder->answers as $key => $value)
            <li style="font-size:14px; color:#374151; margin:4px 0;">
              <strong>{{ $key }}:</strong> {{ is_array($value) ? implode(', ', $value) : $value }}
            </li>
          @endforeach
        </ul>
      </td>
    </tr>
  </table>
  @endif

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fef2f2; border-left:4px solid #dc2626; padding:16px; border-radius:6px; text-align:left; margin-top:24px;">
    <tr>
      <td>
        <h3 style="margin:0 0 8px 0; font-size:15px; font-weight:bold; color:#991b1b;">Tiempo estimado</h3>
        <p style="margin:4px 0; font-size:14px; color:#7f1d1d;">Tu cotización será generada y enviada a tu correo electrónico en las próximas <strong>2 a 4 horas hábiles</strong>.</p>
      </td>
    </tr>
  </table>


  @push('below_content')
    @include('emails.partials.company-contact')
  @endpush

@endsection

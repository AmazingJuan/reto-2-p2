@extends('emails.layouts.base')

@section('title', 'Nueva plataforma de cotización')

@section('heading', 'Nueva plataforma de cotización')

@section('content')
  <p style="font-size:16px; margin:0 0 16px 0; font-weight:bold;">
    ¡Hola {{ $userName ?? 'estimado cliente' }}!
  </p>
  <p style="font-size:16px; margin:0 0 16px 0; line-height:1.5;">
    Nos complace informarte que hemos lanzado una <strong>nueva plataforma de cotización</strong> completamente renovada.
    Ahora podrás solicitar tus cotizaciones de forma más rápida y sencilla.
  </p>

  <p style="display:inline-block; background:#dcfce7; color:#15803d; font-weight:bold; padding:8px 16px; border-radius:8px; font-size:14px; margin:16px 0;">
    ACCESO DISPONIBLE AHORA
  </p>

  <p style="margin:16px 0 0 0;">
    <a href="{{ $platformUrl }}" target="_blank" rel="noopener noreferrer" style="display:inline-block; background:#2563eb; color:#ffffff !important; text-decoration:none; padding:12px 24px; border-radius:8px; font-weight:bold; font-size:14px;">
      Ir a la plataforma
    </a>
  </p>

  @push('below_content')
    @include('emails.partials.company-contact')
  @endpush

@endsection

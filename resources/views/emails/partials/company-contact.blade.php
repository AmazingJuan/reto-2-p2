<p style="margin-top:24px; font-size:14px; color:#6b7280;">Si tienes dudas o necesitas asistencia, contáctanos:</p>
<p style="font-size:13px; color:#4b5563; line-height:1.6;">
  @if(!empty($companyContactEmail))
  <strong>Email:</strong> {{ $companyContactEmail }}<br>
  @endif
  @if(!empty($companyContactPhone))
  <strong>Teléfono:</strong> {{ $companyContactPhone }}<br>
  @endif
  @if(!empty($companyContactAddress))
  <strong>Dirección:</strong> {{ $companyContactAddress }}<br>
  @endif
  @if(!empty($companyWebsiteUrl))
  <strong>Sitio Web:</strong> <a href="{{ $companyWebsiteUrl }}" style="color:#2563eb; text-decoration:none;">{{ $companyWebsiteLabel ?: $companyWebsiteUrl }}</a>
  @endif
</p>

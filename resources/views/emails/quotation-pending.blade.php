<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cotización en Proceso</title>
</head>
<body style="margin:0; padding:0; background:#f4f6f9; font-family:Arial, sans-serif; color:#1f2937;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f6f9; padding:20px 0;">
    <tr>
      <td align="center">
        <!-- Contenedor principal -->
        <table width="620" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:12px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#1f2937" style="padding:32px; color:#ffffff;">
              <img src="https://www.trainingcorporation.com.co/wp-content/uploads/2020/11/Logo_white.png" alt="Logo" width="120" style="display:block; margin-bottom:16px;" />
              <h1 style="margin:0; font-size:22px; font-weight:bold;">Cotización en Proceso</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px; text-align:center;">
              @php
                $contact = $quotationOrder->contact_info ?? [];
              @endphp
              <!-- Saludo personalizado -->
              <p style="font-size:16px; margin:0 0 16px 0; font-weight:bold;">
                ¡Hola {{ $contact['name'] ?? 'Usuario' }}!
              </p>
              <p style="font-size:16px; margin:0 0 16px 0; font-weight:bold;">
                Tu solicitud de cotización ha sido registrada exitosamente.
              </p>

              <p style="display:inline-block; background:#fef3c7; color:#92400e; font-weight:bold; padding:8px 16px; border-radius:8px; font-size:14px; margin:16px 0;">⏳ EN PROCESO DE GENERACIÓN</p>

              <p style="background:#eef3ff; color:#1e3a8a; font-weight:bold; padding:8px 16px; border-radius:6px; font-family:Courier, monospace; display:inline-block; margin:16px 0;">#{{ $quotationOrder->id }}</p>

              <!-- Datos de contacto (contact_info del pedido) -->
              @if(!empty($contact))
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6; border-left:4px solid #10b981; padding:16px; border-radius:6px; text-align:left; margin:24px 0;">
                <tr>
                  <td>
                    <h3 style="margin:0 0 8px 0; font-size:16px; font-weight:bold; color:#065f46;">👤 Datos de contacto</h3>
                    <p style="margin:4px 0; font-size:14px; color:#4b5563;"><strong>Nombre:</strong> {{ $contact['name'] ?? '' }}</p>
                    @if(!empty($contact['company']))
                    <p style="margin:4px 0; font-size:14px; color:#4b5563;"><strong>Empresa:</strong> {{ $contact['company'] }}</p>
                    @endif
                    <p style="margin:4px 0; font-size:14px; color:#4b5563;"><strong>Cargo:</strong> {{ $contact['role'] ?? '' }}</p>
                    <p style="margin:4px 0; font-size:14px; color:#4b5563;"><strong>Email:</strong> {{ $contact['email'] ?? '' }}</p>
                    <p style="margin:4px 0; font-size:14px; color:#4b5563;"><strong>Teléfono:</strong> {{ $contact['phone'] ?? '' }}</p>
                  </td>
                </tr>
              </table>
              @endif

              <!-- Info Cotización -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6; border-left:4px solid #2563eb; padding:16px; border-radius:6px; text-align:left; margin:24px 0;">
                <tr>
                  <td>
                    <h3 style="margin:0 0 8px 0; font-size:16px; font-weight:bold; color:#1f2937;">📋 Detalles de la Cotización</h3>
                    <p style="margin:4px 0; font-size:14px; color:#4b5563;"><strong>Fecha de Solicitud:</strong> {{ $quotationOrder->created_at?->format('d/m/Y H:i') ?? 'N/A' }}</p>
                    <p style="margin:4px 0; font-size:14px; color:#4b5563;"><strong>Unidad de negocio:</strong> {{ $quotationOrder->business_unit ?? 'N/A' }}</p>
                    @if(!empty($quotationOrder->gestion_line))
                    <p style="margin:4px 0; font-size:14px; color:#4b5563;"><strong>Línea de gestión:</strong> {{ $quotationOrder->gestion_line }}</p>
                    @endif
                  </td>
                </tr>
              </table>

              <!-- Servicios -->
              @if (!empty($quotationOrder->services))
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="text-align:left; margin:24px 0;">
                <tr>
                  <td>
                    <h3 style="font-size:15px; font-weight:bold; color:#1f2937; margin-bottom:8px;">🛠️ Servicios Solicitados</h3>
                    <ul style="list-style:none; padding:8px; margin:0; background:#f9fafb; border-radius:6px;">
                      @foreach ($quotationOrder->services as $service)
                        <li style="font-size:14px; color:#374151; margin:4px 0;">• {{ is_array($service) ? ($service['name'] ?? json_encode($service)) : $service }}</li>
                      @endforeach
                    </ul>
                  </td>
                </tr>
              </table>
              @endif

              <!-- Respuestas del formulario (answers) -->
              @if (!empty($quotationOrder->answers))
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="text-align:left; margin:24px 0;">
                <tr>
                  <td>
                    <h3 style="font-size:15px; font-weight:bold; color:#1f2937; margin-bottom:8px;">⚙️ Respuestas del formulario</h3>
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

              <!-- Alert Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fef2f2; border-left:4px solid #dc2626; padding:16px; border-radius:6px; text-align:left; margin-top:24px;">
                <tr>
                  <td>
                    <h3 style="margin:0 0 8px 0; font-size:15px; font-weight:bold; color:#991b1b;">⏱️ Tiempo Estimado</h3>
                    <p style="margin:4px 0; font-size:14px; color:#7f1d1d;">Tu cotización será generada y enviada a tu correo electrónico en las próximas <strong>2 a 4 horas hábiles</strong>.</p>
                  </td>
                </tr>
              </table>

              <!-- Contact -->
              <p style="margin-top:24px; font-size:14px; color:#6b7280;">Si tienes dudas o necesitas asistencia, contáctanos:</p>
              <p style="font-size:13px; color:#4b5563; line-height:1.6;">
                <strong>Email:</strong> gerencia@trainingcorporation.com.co<br>
                <strong>Teléfono:</strong> +57 3217079467<br>
                <strong>Dirección:</strong> Carrera 43A No 1 A - Sur 29 Edificio Colmena, oficina 315. Medellín, Antioquia.<br>
                <strong>Sitio Web:</strong> <a href="https://www.trainingcorporation.com.co" style="color:#2563eb; text-decoration:none;">www.trainingcorporation.com.co</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#f3f4f6" style="padding:18px; text-align:center; font-size:13px; color:#6b7280;">
              <p style="margin:0;"><strong>Training Corporation © 2025</strong></p>
              <p style="margin:0;">Este correo fue generado automáticamente. No respondas a este mensaje.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nueva Plataforma de Cotización</title>
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
              <h1 style="margin:0; font-size:22px; font-weight:bold;">Nueva Plataforma de Cotización</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px; text-align:center;">

              <!-- Mensaje Personalizado -->
              <p style="font-size:16px; margin:0 0 16px 0; font-weight:bold;">
                ¡Hola {{ $userName ?? 'estimado cliente' }}!
              </p>
              <p style="font-size:16px; margin:0 0 16px 0;">
                Nos complace informarte que hemos lanzado una <strong>nueva plataforma de cotización</strong> completamente renovada.
                Ahora podrás solicitar tus cotizaciones de forma más rápida y sencilla.
              </p>

              <!-- Badge -->
              <p style="display:inline-block; background:#dcfce7; color:#15803d; font-weight:bold; padding:8px 16px; border-radius:8px; font-size:14px; margin:16px 0;">
                🚀 ACCESO DISPONIBLE AHORA
              </p>

              <!-- CTA -->
              <a href="{{ $platformUrl }}" target="_blank" style="display:inline-block; background:#2563eb; color:#ffffff; text-decoration:none; padding:8px 16px; border-radius:8px; font-weight:bold; font-size:14px; margin-top:8px;">
                Ir a la Plataforma
              </a>

              <!-- Contacto -->
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

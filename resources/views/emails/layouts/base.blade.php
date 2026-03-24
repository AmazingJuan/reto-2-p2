<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>@yield('title', 'Training Corporation')</title>
<style type="text/css">
  @media only screen and (max-width: 620px) {
    .email-body-cell { padding: 28px 20px !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background:#f4f6f9; font-family:Arial, Helvetica, sans-serif; color:#1f2937;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f6f9; padding:20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:12px; overflow:hidden; max-width:620px; width:100%;">
          <tr>
            <td align="center" bgcolor="#1f2937" style="padding:32px; color:#ffffff;">
              <img src="https://www.trainingcorporation.com.co/wp-content/uploads/2020/11/Logo_white.png" alt="Training Corporation" width="120" style="display:block; margin:0 auto 16px auto;" />
              <h1 style="margin:0; font-size:22px; font-weight:bold; color:#ffffff; line-height:1.3;">@yield('heading')</h1>
            </td>
          </tr>
          <tr>
            <td class="email-body-cell" style="padding:36px; text-align:center;">
              @yield('content')
              @stack('below_content')
            </td>
          </tr>
          <tr>
            <td bgcolor="#f3f4f6" style="padding:18px; text-align:center; font-size:13px; color:#6b7280;">
              <p style="margin:0 0 8px 0;"><strong>Training Corporation © {{ date('Y') }}</strong></p>
              <p style="margin:0;">@yield('footer_note', 'Este correo fue generado automáticamente. No respondas a este mensaje.')</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>

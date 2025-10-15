<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cotización Generada</title>
    <style>
        body { margin:0; padding:0; font-family: "Inter", sans-serif; background:#f4f6f9; color:#333; }
        .email-container { max-width:600px; margin:40px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 8px 20px rgba(0,0,0,0.08);}
        .email-header { background:#1f2937; color:#fff; text-align:center; padding:30px 20px;}
        .email-header img { height:70px; width:auto; margin-bottom:12px;}
        .email-header h1 { margin:0; font-size:22px; font-weight:600; letter-spacing:0.5px; color:#fff; }
        .email-body { padding:36px 40px; text-align:center; }
        .quotation-id { display:inline-block; background:#eef3ff; color:#1e3a8a; font-weight:600; padding:8px 16px; border-radius:6px; margin:14px 0; font-size:15px; }
        .cta-button { display:inline-block; background:#2563eb; color:#fff !important; text-decoration:none; padding:12px 28px; border-radius:6px; font-size:15px; font-weight:600; margin-top:20px; transition:background-color 0.2s ease;}
        .cta-button:hover { background:#1d4ed8; }
        .email-footer { background:#f3f4f6; text-align:center; padding:20px; font-size:13px; color:#6b7280; }
        @media (max-width:600px) { .email-body { padding:28px 20px; } }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <img src="https://www.trainingcorporation.com.co/wp-content/uploads/2020/11/Logo_white.png" alt="Training Corporation Logo" />
            <h1>Tu cotización está lista</h1>
        </div>

        <!-- Body -->
        <div class="email-body">
            <p><strong>Nos complace informarte que tu cotización ha sido generada correctamente.</strong></p>

            <p>ID de cotización:</p>
            <div class="quotation-id">
                #{{ $order->getId() }}
            </div>

            @if($order->getQuotationUrl())
                <p>Puedes descargar tu documento haciendo clic en el siguiente botón:</p>
                <a href="{{ $order->getQuotationUrl() }}" target="_blank" class="cta-button">
                    Descargar Cotización
                </a>
            @else
                <p class="text-gray-500 italic">El documento aún no está disponible.</p>
            @endif
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p><strong>Training Corporation © 2025</strong></p>
            <p>Este correo fue generado automáticamente. No respondas a este mensaje.</p>
        </div>
    </div>
</body>
</html>

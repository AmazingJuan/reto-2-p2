<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cotización Generada</title>
    <style>
        /* Estilos generales */
        body {
            margin: 0;
            padding: 0;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #f4f6f9;
            color: #333;
        }

        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        /* Encabezado */
        .email-header {
            background-color: #1f2937; /* Gris oscuro para contraste con el logo blanco */
            color: #ffffff;
            text-align: center;
            padding: 30px 20px;
        }

        .email-header img {
            height: 70px;
            width: auto;
            margin-bottom: 12px;
        }

        .email-header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 600;
            letter-spacing: 0.5px;
            color: #ffffff;
        }

        /* Cuerpo */
        .email-body {
            padding: 36px 40px;
            text-align: center;
        }

        .email-body p {
            margin: 0 0 16px;
            font-size: 16px;
            line-height: 1.6;
            color: #444;
        }

        .quotation-id {
            display: inline-block;
            background-color: #eef3ff;
            color: #1e3a8a;
            font-weight: 600;
            padding: 8px 16px;
            border-radius: 6px;
            margin: 14px 0;
            font-size: 15px;
        }

        .cta-button {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 6px;
            font-size: 15px;
            font-weight: 600;
            margin-top: 20px;
            transition: background-color 0.2s ease;
        }

        .cta-button:hover {
            background-color: #1d4ed8;
        }

        /* Pie de página */
        .email-footer {
            background-color: #f3f4f6;
            text-align: center;
            padding: 20px;
            font-size: 13px;
            color: #6b7280;
        }

        .email-footer p {
            margin: 8px 0;
            line-height: 1.4;
        }

        @media (max-width: 600px) {
            .email-body {
                padding: 28px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Encabezado con logo -->
        <div class="email-header">
            <img
                src="https://www.trainingcorporation.com.co/wp-content/uploads/2020/11/Logo_white.png"
                alt="Training Corporation Logo"
            />
            <h1>Tu cotización está lista</h1>
        </div>

        <!-- Contenido principal -->
        <div class="email-body">
            <p><strong>Nos complace informarte que tu cotización ha sido generada correctamente.</strong></p>

            <p>ID de cotización:</p>
            <div class="quotation-id">#{{ $quotationId }}</div>

            <p>Puedes descargar tu documento haciendo clic en el siguiente botón:</p>

            <a href="{{ $quotationUrl }}" target="_blank" class="cta-button">
                Descargar Cotización
            </a>
        </div>

        <!-- Pie -->
        <div class="email-footer">
            <p><strong>Training Corporation © 2025</strong></p>
            <p>Este correo fue generado automáticamente. No respondas a este mensaje.</p>
        </div>
    </div>
</body>
</html>

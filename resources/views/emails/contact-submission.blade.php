<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Submission</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
        }
        .header h1 {
            color: #007bff;
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .header p {
            color: #6c757d;
            margin: 5px 0 0 0;
            font-size: 14px;
        }
        .content {
            margin-bottom: 30px;
        }
        .field {
            margin-bottom: 20px;
        }
        .field-label {
            font-weight: 600;
            color: #495057;
            margin-bottom: 5px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .field-value {
            background-color: #f8f9fa;
            padding: 12px;
            border-radius: 4px;
            border-left: 4px solid #007bff;
            font-size: 16px;
        }
        .message-field {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            border-left: 4px solid #007bff;
            font-size: 16px;
            white-space: pre-wrap;
            line-height: 1.8;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 12px;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            font-size: 12px;
            font-weight: 600;
            border-radius: 4px;
            background-color: #28a745;
            color: white;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 New Contact Submission</h1>
            <p>Received via your portfolio website</p>
        </div>

        <div class="content">
            <div class="badge">NEW MESSAGE</div>

            <div class="field">
                <div class="field-label">From</div>
                <div class="field-value">
                    <strong>{{ $submission->name }}</strong> &lt;{{ $submission->email }}&gt;
                </div>
            </div>

            @if($submission->subject)
            <div class="field">
                <div class="field-label">Subject</div>
                <div class="field-value">{{ $submission->subject }}</div>
            </div>
            @endif

            <div class="field">
                <div class="field-label">Message</div>
                <div class="message-field">{{ $submission->message }}</div>
            </div>

            <div class="field">
                <div class="field-label">Submission Details</div>
                <div class="field-value">
                    <strong>Date:</strong> {{ $submission->created_at->format('M d, Y H:i A') }}<br>
                    <strong>IP Address:</strong> {{ $submission->ip_address ?? 'N/A' }}<br>
                    <strong>Status:</strong> {{ $submission->is_read ? 'Read' : 'Unread' }}
                </div>
            </div>
        </div>

        <div class="footer">
            <p>This message was sent from your portfolio contact form.</p>
            <p>Please respond to the sender at: {{ $submission->email }}</p>
        </div>
    </div>
</body>
</html>

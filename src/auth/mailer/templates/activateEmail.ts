export const ActivateEmailTemplate = (code: string) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Email Verification</title>
    <style>
      img { max-width: 100%; height: auto; }
      table { border-collapse: collapse; }
      .container {
        max-width: 600px;
        width: 100%;
        background: #fff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      }
      h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: #1d1d1f;
      }
      p {
        color: #515154;
        font-size: 16px;
        margin: 16px 0;
      }
      .code-box {
        display: inline-block;
        font-size: 32px;
        letter-spacing: 8px;
        font-weight: 700;
        color: #0071e3;
        background: #f0f8ff;
        padding: 16px 32px;
        border-radius: 12px;
      }
      /* Responsive */
      @media screen and (max-width: 600px) {
        .container {
          padding: 24px 16px !important;
        }
        h1 {
          font-size: 20px !important;
        }
        p {
          font-size: 14px !important;
        }
        .code-box {
          font-size: 24px !important;
          letter-spacing: 6px !important;
          padding: 12px 20px !important;
        }
      }
      /* Dark mode */
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #000 !important;
        }
        .container {
          background: #1c1c1e !important;
          box-shadow: none !important;
        }
        h1 {
          color: #f5f5f7 !important;
        }
        p {
          color: #d1d1d6 !important;
        }
        .code-box {
          background: #0a84ff !important;
          color: #fff !important;
        }
        .footer {
          color: #86868b !important;
        }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#f5f5f7; font-family:-apple-system, BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table class="container" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="padding:40px 30px; text-align:center;">
                <h1>Verify Your Account</h1>
                <p>
                  Welcome to <strong>Jink</strong>! To complete your signup, please enter the verification code below:
                </p>
                <div style="margin:30px 0;">
                  <span class="code-box">${code}</span>
                </div>
                <p style="font-size:14px; color:#86868b;">
                  This code will expire in <strong>10 minutes</strong>. If you didn’t request this, you can safely ignore this email.
                </p>
                <p class="footer" style="margin-top:40px; font-size:12px; color:#a1a1a6;">
                  — The Jink Team
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

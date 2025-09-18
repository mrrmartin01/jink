export const welcomeEmailTemplate = (username: string, homepage: string) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Welcome to Jink</title>
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
        font-size: 16px;
        margin: 16px 0;
        color: #515154;
      }
      .button {
        display: inline-block;
        background: #0071e3;
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        text-decoration: none;
        padding: 14px 28px;
        border-radius: 10px;
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
        .button {
          font-size: 14px !important;
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
        .button {
          background: #0a84ff !important;
          color: #fff !important;
        }
        .footer {
          color: #86868b !important;
        }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background:#f5f5f7; font-family:-apple-system, BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table class="container" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="padding:40px 30px; text-align:center;">
                <h1>Welcome to Jink, ${username} 🎉</h1>
                <p>
                  We’re excited to have you on board! Your account is all set up and ready to go.  
                </p>
                <p>
                  Here are a few things you can do next:
                </p>
                <ul style="text-align:left; max-width:400px; margin:20px auto; padding:0; list-style:disc; color:#515154; font-size:15px;">
                  <li>Explore services tailored to you</li>
                  <li>Connect with professionals in your field</li>
                  <li>Manage your profile and preferences</li>
                </ul>
                <div style="margin:30px 0;">
                  <a href="${homepage}" class="button">Explore Jink</a>
                </div>
                <p style="font-size:14px; color:#86868b;">
                  If you have any questions, our support team is here to help.
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

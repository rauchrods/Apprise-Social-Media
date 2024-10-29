export const signupOtpEmailTemplate = (otp, name) => {
  return `<div
        style="
          background-color: #1a1a1a;
          color: #ffffff;
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 40px;
          border-radius: 12px;
        "
      >
        <div style="text-align: left; margin-bottom: 40px">
          <h1
           style="
            background: linear-gradient(98.37deg, rgb(152, 184, 155) 0%, rgb(230, 195, 92) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 0;
            font-size: 42px;
          "
          >
           Apprise
          </h1>
        </div>
  
        <div
          style="
            background-color: #2a2a2a;
            padding: 30px;
            border-radius: 8px;
            border: 1px solid #333333;
          "
        >
          <h2 style="color: #98b89b; font-size: 24px; margin-bottom: 30px">
            Hello ${name}, Let's go.
          </h2>
  
          <p style="color: #999999; font-size: 16px; margin-bottom: 20px">
            Your verification code is:
          </p>
  
          <div
            style="
              background-color: #333333;
              padding: 20px;
              border-radius: 6px;
              text-align: center;
              margin-bottom: 30px;
            "
          >
            <h1
              style="
                color: #ffffff;
                font-size: 32px;
                letter-spacing: 5px;
                margin: 0;
              "
            >
              ${otp}
            </h1>
          </div>
  
          <p style="color: #999999; font-size: 14px; margin-top: 20px">
            This code will expire in 5 minutes.
          </p>
          <p style="color: #666666; font-size: 14px">
            If you didn't request this code, you can safely ignore this email.
          </p>
        </div>
  
        <div style="text-align: center; margin-top: 30px">
          <p style="color: #666666; font-size: 14px">
            © ${new Date().getFullYear()} Apprise. All rights reserved.
          </p>
          <p style="color: #666666; font-size: 14px; margin-top: 5px">
            A Rauch Rodrigues Product
          </p>
        </div>
      </div>`;
};

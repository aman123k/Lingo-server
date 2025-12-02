export const otpEmail = (user: { name?: string } | null, otp: string) => {
  return `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif">
    <div
      class="container"
      style="
        margin: auto;
        gap: 20px;
        background-color: #f0f2f5;
        width: 640px;
        height: 700px;
        margin-top: 100px;
        border-radius: 10px;
      "
    >
     <div class="header" style="padding: 30px 38px; text-align: center">
        <img src="https://res.cloudinary.com/dytcbjjlv/image/upload/v1763547739/Logomark_iwujhs.png" style="width: 50px" alt="Lingo App Logo" />
        <h2
          style="
            margin: 0;
            font-size: 24px;
            font-weight: bold;
            color: #1c398e;
            font-family: 'Nunito', sans-serif;
          "
        >
          Lingo
        </h2>
      </div>
      <div
        class="content-box"
        style="
          width: 480px;
          background-color: #fff;
          border-radius: 8px;
          gap: 16px;
          margin: 0 48px;
          padding: 30px 40px;
          margin-bottom: 40px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        "
      >
        <h2
          style="
            margin-top: 0;
            font-family: Helvetica;
            font-size: 24px;
            font-weight: bold;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.4;
            letter-spacing: normal;
            color: #121a26;
          "
        >
          Confirm and Update your password 🔒 !
        </h2>
        <p
          style="
            font-family: Arial;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: 0.2px;
            text-align: left;
            color: #384860;
            margin: 0;
            margin-bottom: 15px;
          "
        >
          Hey,${user?.name ?? ""}
        </p>
        <p
          style="
            font-family: Arial;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: 0.2px;
            text-align: left;
            color: #384860;
            margin: 0;
            margin-bottom: 15px;
          "
        >
          We have received a request to update the password for your Lingo
          account.
        </p>

        <p
          style="
            font-family: Arial;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: 0.2px;
            text-align: left;
            color: #384860;
            margin: 0;
            margin-bottom: 15px;
          "
        >
          Your verification code is:
          <span
            style="
              text-align: center;
              font-weight: bold;
              font-family: 'Nunito', sans-serif;
              font-size: 25px;
              margin-top: 1rem;
              color: #4caf50;
            "
          >${otp}</span>
        </p>

        <p
          style="
            font-family: Arial;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: 0.2px;
            text-align: left;
            color: #384860;
            margin: 0;
            margin-bottom: 15px;
          "
        >
          If you did not initiate this request, please disregard this message.
        </p>
        <p
          style="
            font-family: Arial;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: 0.2px;
            text-align: left;
            color: #384860;
            margin: 0;
            margin-bottom: 30px;
          "
        >
          Please note that this code is valid for 5 minutes.
        </p>

        <p
          style="
            font-family: Arial;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: 0.2px;
            text-align: left;
            color: #384860;
            margin: 0;
            margin-bottom: 30px;
          "
        >
          Best Wishes <br />
          The Lingo Team
        </p>
      </div>
      <div class="footer" style="text-align: center">
        <span style="color: #6c757d">© Lingo</span>
      </div>
    </div>
  </body>`;
};

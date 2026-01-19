import { User } from "../../model/userModel";

export const supportEmail = (
  userEmail: User,
  subject: string,
  problem: string
) => {
  return `
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f2f5;">
    <div
      class="container"
      style="
        margin: auto;
        background-color: #f0f2f5;
        width: 640px;
        min-height: 750px;
        margin-top: 100px;
        border-radius: 10px;
        padding: 20px;
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
            color: #1c398e;
          "
        >
          New Support Request
        </h2>

        <p
          style="
            font-family: Helvetica;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: normal;
            color: #4a5568;
            margin: 20px 0;
          "
        >
          A new support request has been submitted from the Lingo application.
        </p>

        <div style="margin: 20px 0;">
          <strong style="color: #1c398e;">User Name:</strong>
          <p style="margin: 5px 0; color: #4a5568;">${userEmail.name}</p>
        </div>
        <div style="margin: 20px 0;">
          <strong style="color: #1c398e;">User Email:</strong>
          <p style="margin: 5px 0; color: #4a5568;">${userEmail.email}</p>
        </div>

        <div style="margin: 20px 0;">
          <strong style="color: #1c398e;">Subject:</strong>
          <p style="margin: 5px 0; color: #4a5568;">${subject}</p>
        </div>

        <div style="margin: 20px 0;">
          <strong style="color: #1c398e;">Problem Description:</strong>
          <p style="margin: 5px 0; color: #4a5568; line-height: 1.6;">${problem}</p>
        </div>

        <div
          style="
            background-color: #f7fafc;
            padding: 20px;
            border-radius: 6px;
            margin: 30px 0;
            border-left: 4px solid #1c398e;
          "
        >
          <p
            style="
              margin: 0;
              font-family: Helvetica;
              font-size: 14px;
              font-weight: normal;
              color: #718096;
            "
          >
            Please review this support request and respond to the user as soon as possible.
          </p>
        </div>

        <p
          style="
            font-family: Helvetica;
            font-size: 14px;
            font-weight: normal;
            color: #a0aec0;
            margin-top: 30px;
          "
        >
          This is an automated notification from the Lingo Support System.
        </p>
      </div>
    </div>
  </body>`;
};

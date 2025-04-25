const TPO = require("../../models/tpo");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Add new TPO (admin-only access)
const addTPO = async (req, res) => {
  try {
    const { name, employeeId, email, phone, password } = req.body;

    // Check for existing TPO by email or employeeId
    const existingTPO = await TPO.findOne({ $or: [{ email }, { employeeId }] });
    if (existingTPO) {
      return res
        .status(400)
        .json({ message: "TPO already exists with this email or employee ID" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const mailOptions = {
      from: `<${process.env.SMTP_MAIL}>`,
      to: email,
      subject: "Your profile has been created",
      html: `
    <div style="font-family: Arial, sans-serif; background-color: #f0f8ff; padding: 40px; color: #333;">
      <table align="center" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <tr>
          <td style="text-align: center; padding: 20px 0;">
            <img src="https://example.com/logo.png" alt="Company Logo" width="120" style="display: block; margin: 0 auto;" />
          </td>
        </tr>
        <tr>
          <td>
            <h2 style="color: #4CAF50; font-size: 28px; font-weight: bold;">Welcome ${name}!</h2>
            <p style="font-size: 18px; color: #555;">We’re excited to let you know that your profile has been successfully created. You can now log in and start using our services.</p>
            
            <table cellpadding="0" cellspacing="0" width="100%" style="border-top: 3px solid #4CAF50; margin-top: 30px;">
              <tr>
                <td style="padding: 10px 0;">
                  <strong style="font-size: 18px; color: #333;">Email:</strong>
                  <p style="font-size: 16px; color: #555;">${email}</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0;">
                  <strong style="font-size: 18px; color: #333;">Password:</strong>
                  <p style="font-size: 16px; color: #555;">${password}</p>
                </td>
              </tr>
            </table>

            <p style="font-size: 16px; color: #555; margin-top: 20px;">If you did not create this profile or have any questions, please contact our support team immediately at <a href="mailto:support@example.com" style="color: #1a73e8; text-decoration: none;">support@example.com</a>.</p>

            <div style="margin-top: 40px; text-align: center; font-size: 14px; color: #888;">
              <p>&copy; ${new Date().getFullYear()} <strong style="color: #4CAF50;">Your Company Name</strong>. All rights reserved.</p>
            </div>
          </td>
        </tr>
      </table>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);


    // Create new TPO
    const newTPO = new TPO({
      name,
      employeeId,
      email,
      phone,
      password: hashedPassword,
      // department and role are auto-set by schema defaults
    });

    await newTPO.save();

    res.status(201).json({ message: "TPO created successfully", tpo: newTPO });
  } catch (error) {
    console.error("Error creating TPO:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {addTPO};
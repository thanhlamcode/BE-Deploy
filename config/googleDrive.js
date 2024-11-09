import { google } from "googleapis"; // Sửa import cho đúng
import dotenv from "dotenv";

dotenv.config();

// comment to push

async function authorize() {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    console.log("abc");

    return google.drive({ version: "v3", auth: oauth2Client });
  } catch (error) {
    console.error("Error during authorization:", error.message);
  }
}

export default authorize;

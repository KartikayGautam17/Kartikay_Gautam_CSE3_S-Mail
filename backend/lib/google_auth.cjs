const Router = require("express").Router;
const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const { get } = require("http");
const { v4: uuidv4 } = require("uuid");
// const prisma = require("./db.js");
require("dotenv").config();
// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd() + "/lib/", "token.json");
const CREDENTIALS_PATH = path.join(process.cwd() + "/lib/", "credentials.json");
const Client = { client: null };
/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);

    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: client.credentials.refresh_token,
  });

  await fs.writeFile(TOKEN_PATH, payload);
}

const uuid = {
  uuidv4: null,
  email: null,
};
/**
 * Load or request or authorization to call APIs.
 * @returns {OAuth2Client}
 */
async function authorize() {
  if (!uuid.uuidv4) {
    uuid.uuidv4 = uuidv4();
  }
  // console.log(uuid.uuidv4);
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
}

const assignInfo = (email) => {
  // This function takes the email from the Gmail API and assigns the subject and from fields to the email object
  // by extracting the subject and from fields from the { headers : {name : "subject", name: "from"}}
  try {
    let subject = email.payload.headers.find(
      (header) => header.name === "Subject"
    );
    let from = email.payload.headers.find((header) => header.name === "From");
    let date = email.payload.headers.find((header) => header.name === "Date");
    email.subject = subject ? subject.value : "";
    email.from = from ? from.value : "";
    email.date = date ? date.value : "";
    return email;
  } catch (error) {
    console.log(error);
    return email;
  }
};

const getAccessToken = async (client) => {
  const oAuth2client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oAuth2client.setCredentials({
    refresh_token: client.credentials.refresh_token,
  });
  const access_token = await oAuth2client.getAccessToken();

  return access_token;
};

async function fetchUserProfile(authClient) {
  const gmail = google.gmail({ version: "v1", auth: authClient });
  const people = google.people({ version: "v1", auth: authClient });

  try {
    // Fetch email from Gmail API
    const gmailProfile = await gmail.users.getProfile({ userId: "me" });
    const email = gmailProfile.data.emailAddress;
    uuid.email = email;
    // Fetch name and profile picture from People API
    const peopleProfile = await people.people.get({
      resourceName: "people/me",
      personFields: "names,photos",
    });

    const name = peopleProfile.data.names?.[0]?.displayName || "Unknown";
    const photo = peopleProfile.data.photos?.[0]?.url || null;

    return { email, name, photo };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
}

const getClient = async () => {
  return await authorize();
};

const GoogleAuthorize = async () => {
  try {
    const client = await getClient();
    Client.client = client;
    // const accessToken = await getAccessToken(client);
    const profile = await fetchUserProfile(client);
    return profile;
  } catch (e) {
    const client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
    const profile = await fetchUserProfile(client);
    return profile;
  }
};

const getAllEmails = async () => {
  const auth = await authorize();
  const gmail = google.gmail({ version: "v1", auth });
  const primaryMessages = [];
  const res = await gmail.users.messages.list({
    userId: "me",
    q: "category:primary",
    maxResults: 10,
  });

  for (const message of res.data.messages) {
    const msg = await gmail.users.messages.get({
      userId: "me",
      id: message.id,
    });

    primaryMessages.push(assignInfo(msg.data));
  }
  return primaryMessages;
};

const getPrimaryEmails = async () => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: "v1", auth });
    const primaryMessages = [];
    const res = await gmail.users.messages.list({
      userId: "me",
      q: "category:primary",
      maxResults: 10,
    });

    for (const message of res.data.messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });

      primaryMessages.push(assignInfo(msg.data));
    }
    return primaryMessages;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getSocialEmails = async () => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: "v1", auth });
    const primaryMessages = [];
    const res = await gmail.users.messages.list({
      userId: "me",
      q: "category:social",
      maxResults: 10,
    });

    for (const message of res.data.messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });

      primaryMessages.push(assignInfo(msg.data));
    }
    return primaryMessages;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getPromotionEmails = async () => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: "v1", auth });
    const primaryMessages = [];
    const res = await gmail.users.messages.list({
      userId: "me",
      q: "category:promotions",
      maxResults: 10,
    });

    for (const message of res.data.messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });

      primaryMessages.push(assignInfo(msg.data));
    }
    return primaryMessages;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getUpdatesEmails = async () => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: "v1", auth });
    const primaryMessages = [];
    const res = await gmail.users.messages.list({
      userId: "me",
      q: "category:updates",
      maxResults: 10,
    });

    for (const message of res.data.messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });

      primaryMessages.push(assignInfo(msg.data));
    }
    return primaryMessages;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getSpamEmails = async () => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: "v1", auth });
    const primaryMessages = [];
    const res = await gmail.users.messages.list({
      userId: "me",
      labelIds: "SPAM",
      maxResults: 10,
    });

    for (const message of res.data.messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });

      primaryMessages.push(assignInfo(msg.data));
    }
    return primaryMessages;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getSentEmails = async () => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: "v1", auth });
    const primaryMessages = [];
    const res = await gmail.users.messages.list({
      userId: "me",
      labelIds: "SENT",
      maxResults: 10,
    });

    for (const message of res.data.messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });

      primaryMessages.push(assignInfo(msg.data));
    }
    return primaryMessages;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getTrashEmails = async () => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: "v1", auth });
    const primaryMessages = [];
    const res = await gmail.users.messages.list({
      userId: "me",
      labelIds: "TRASH",
      maxResults: 10,
    });

    for (const message of res.data.messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });

      primaryMessages.push(assignInfo(msg.data));
    }
    return primaryMessages;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getDraftEmails = async () => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: "v1", auth });
    const primaryMessages = [];
    const res = await gmail.users.messages.list({
      userId: "me",
      labelIds: "DRAFT",
      maxResults: 10,
    });

    for (const message of res.data.messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });

      primaryMessages.push(assignInfo(msg.data));
    }
    return primaryMessages;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getSpecificEmail = async (id) => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: "v1", auth });
    const res = await gmail.users.messages.get({
      userId: "me",
      id: id,
    });
    return await assignInfo(res.data);
  } catch (error) {
    console.log(error);
    return [];
  }
};

const logout = async () => {
  await fs.unlink(TOKEN_PATH);
};

module.exports = {
  GoogleAuthorize,
  getAllEmails,
  getPrimaryEmails,
  getSocialEmails,
  getUpdatesEmails,
  getPromotionEmails,
  getSpamEmails,
  getSentEmails,
  getTrashEmails,
  getDraftEmails,
  getSpecificEmail,
  logout,
  uuid,
};

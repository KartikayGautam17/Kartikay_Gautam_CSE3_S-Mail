export const getBase64Data = (emails: EmailProps[]) => {
  return emails.map((email) => email.payload.body.data);
};

export interface EmailProps_Root {
  labelIds: string[];
  snippet: string;
  payload: EmailProps_Payload;
  sizeEstimate: number;
  from: string;
  id: string;
  historyId: string;
  internalDate: string;
  subject: string;
  date: string;
  threadId: string;
}

export interface EmailProps_Payload {
  partId: string;
  mimeType: string;
  filename: string;
  headers: EmailProps_Header[];
  body: EmailProps_Body;
}

export interface EmailProps_Header {
  name: string;
  value: string;
}

export interface EmailProps_Body {
  data: string;
  size: number;
}

export type EmailProps = EmailProps_Root;

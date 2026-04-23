type SendTransactionalEmailOptions = {
  text?: string;
  html?: string;
};

export async function sendTransactionalEmail(
  to: string,
  subject: string,
  options: SendTransactionalEmailOptions = {}
) {
  return {
    ok: true,
    to,
    subject,
    provider: process.env.RESEND_API_KEY ? "Resend" : "Postmark",
    text: options.text,
    html: options.html
  };
}

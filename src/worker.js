// Static files are served first by Cloudflare. This script only runs for
// requests that don't match a file, which in practice is /api/contact.

const LETTERMINT_URL = "https://api.lettermint.co/v1/send";
const FROM = "Website contact form <website@mail.pedrotavares.com>";

const LIMITS = { email: 254, message: 5000 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", {
          status: 405,
          headers: { Allow: "POST" },
        });
      }
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
  const thanks = redirect(request, "/contact/thanks/");
  const error = redirect(request, "/contact/error/");

  let form;
  try {
    form = await request.formData();
  } catch {
    return error;
  }

  // Honeypot: humans never see this field, bots tend to fill it in.
  // Pretend it worked so bots get no signal.
  if (field(form, "company") !== "") {
    return thanks;
  }

  const email = field(form, "email");
  const message = field(form, "message");

  const valid =
    email.length <= LIMITS.email &&
    EMAIL_PATTERN.test(email) &&
    message.length > 0 &&
    message.length <= LIMITS.message;

  if (!valid) {
    return error;
  }

  if (!env.LETTERMINT_TOKEN || !env.CONTACT_TO) {
    console.error("Missing LETTERMINT_TOKEN or CONTACT_TO secret");
    return error;
  }

  try {
    const response = await fetch(LETTERMINT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-lettermint-token": env.LETTERMINT_TOKEN,
      },
      body: JSON.stringify({
        from: FROM,
        to: [env.CONTACT_TO],
        reply_to: [email],
        subject: `Contact form: ${email}`,
        text: `From: ${email}\n\n${message}`,
      }),
    });

    if (!response.ok) {
      console.error("Lettermint error", response.status, await response.text());
      return error;
    }
  } catch (err) {
    console.error("Lettermint request failed", err);
    return error;
  }

  return thanks;
}

function field(form, key) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function redirect(request, path) {
  return Response.redirect(new URL(path, request.url).toString(), 303);
}

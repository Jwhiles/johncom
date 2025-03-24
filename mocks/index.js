import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const handlers = [
  http.post("https://api.eu.mailgun.net/v3/:domain/messages", async (req) => {
    const text = await req.request.text();
    console.log("🔶 mocked email text:", text);

    const randomId = "20210321210543.1.E01B8B612C44B41B";
    const id = `<${randomId}>@${req.params.domain}`;
    return HttpResponse.json({ id, message: "Queued. Thank you." });
  }),
];

const server = setupServer(...handlers);

server.listen({ onUnhandledRequest: "bypass" });
console.info("🔶 Mock server running");

process.once("SIGINT", () => server.close());
process.once("SIGTERM", () => server.close());

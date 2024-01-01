const { http, HttpResponse } = require("msw");
const { setupServer } = require("msw/node");
const { entry } = require("./contentfulReturn");

const handlers = [
  http.get(
    "https://cdn.contentful.com/spaces/:spaceid/entries",
    async () => {
      return HttpResponse.json(entry);
    }
  ),
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

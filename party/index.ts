import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  constructor(readonly party: Party.Party) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    const location = [
      ctx.request.cf?.city,
      ctx.request.cf?.country,
      ctx.request.cf?.postalCode,
    ].filter(Boolean);

    const connection = ctx.request.cf?.asOrganization;

    const message = `Someone else just connected to Johncom. They're in ${location.join(", ")}${
      connection ? ` and are connecting with ${connection}` : ""
    }`;

    // Also surface their latitude and longitude?
    this.party.broadcast(
      message,
      // ...except for the connection it came from
      [conn.id]
    );
  }
}

// Server satisfies Party.Worker;

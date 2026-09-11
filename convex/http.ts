import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

// CORS preflight handler for /api/state
http.route({
  path: "/api/state",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }),
});

// GET /api/state: Read cooperative state via HTTP
http.route({
  path: "/api/state",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const key = url.searchParams.get("key") || "main";

    const state = await ctx.runQuery("appData:getState" as any, { key });

    return new Response(JSON.stringify(state || { users: [], membres: [], collectes: [] }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        ...corsHeaders,
      },
    });
  }),
});

// POST /api/state: Save or update cooperative state via HTTP
http.route({
  path: "/api/state",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const result = await ctx.runMutation("appData:saveState" as any, body);

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "content-type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: err.message || "Failed to update state" }),
        {
          status: 400,
          headers: {
            "content-type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
  }),
});

// GET /api/ping: Health check on HTTP actions site
http.route({
  path: "/api/ping",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(
      JSON.stringify({
        status: "ok",
        cloud: "Convex Cloud EU-West-1 (giant-bison-526)",
        site: "https://giant-bison-526.eu-west-1.convex.site",
        timestamp: Date.now(),
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }),
});

export default http;

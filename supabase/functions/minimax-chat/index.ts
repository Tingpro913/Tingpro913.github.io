import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  let model: string;
  let messages: Message[];
  const options: Record<string, unknown> = {};

  try {
    const body = await req.json();
    model = body.model ?? "MiniMax-M2.5";
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("Missing or empty messages");
    }

    const {
      stream: _stream,
      max_completion_tokens,
      temperature,
      top_p,
    } = body;

    if (max_completion_tokens !== undefined) {
      options.max_completion_tokens = max_completion_tokens;
    }
    if (temperature !== undefined) {
      options.temperature = temperature;
    }
    if (top_p !== undefined) {
      options.top_p = top_p;
    }
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const apiKey = Deno.env.get("INTEGRATIONS_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  const upstream = await fetch(
    "https://app-duaapde1f1tt-api-Aa2PqMJnJGwL-gateway.appmiaoda.com/v1/text/chatcompletion_v2",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Gateway-Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, ...options }),
    }
  );

  if (upstream.status === 429 || upstream.status === 402) {
    const errText = await upstream.text();
    return new Response(errText, {
      status: upstream.status,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  if (!upstream.ok) {
    return new Response(
      JSON.stringify({ error: `Upstream error: ${upstream.status}` }),
      {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  const data = await upstream.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
});

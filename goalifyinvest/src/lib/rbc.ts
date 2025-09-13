type HttpMethod = "GET" | "POST";

interface RbcConfig {
  baseUrl: string;
  teamId: string;
  teamSecret: string;
}

interface JwtResponse {
  token: string;
  expiresInSeconds: number;
}

let cachedJwt: { token: string; expiresAtEpochMs: number } | null = null;

function getConfig(): RbcConfig {
  const baseUrl = process.env.RBC_BASE_URL ?? "";
  const teamId = process.env.RBC_TEAM_ID ?? "";
  const teamSecret = process.env.RBC_TEAM_SECRET ?? "";
  if (!baseUrl || !teamId || !teamSecret) {
    throw new Error("Missing RBC_* environment variables");
  }
  return { baseUrl, teamId, teamSecret };
}

async function fetchJwt(): Promise<string> {
  const now = Date.now();
  if (cachedJwt && cachedJwt.expiresAtEpochMs - now > 60_000) {
    return cachedJwt.token;
  }

  const { baseUrl, teamId, teamSecret } = getConfig();
  const response = await fetch(`${baseUrl}/teams/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ teamId, secret: teamSecret }),
    cache: "no-store",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`RBC register failed: ${response.status} ${text}`);
  }
  const body = (await response.json()) as JwtResponse;
  const expiresAtEpochMs = now + body.expiresInSeconds * 1000;
  cachedJwt = { token: body.token, expiresAtEpochMs };
  return body.token;
}

async function rbcFetch<T>(path: string, options?: { method?: HttpMethod; body?: unknown }): Promise<T> {
  const { baseUrl } = getConfig();
  const token = await fetchJwt();
  const response = await fetch(`${baseUrl}${path}`, {
    method: options?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`RBC request failed: ${response.status} ${text}`);
  }
  return (await response.json()) as T;
}

export const rbcApi = {
  registerTeam: fetchJwt,
  createClient: (payload: { name: string; email: string }) =>
    rbcFetch<{ clientId: string }>(`/clients`, { method: "POST", body: payload }),
  createPortfolio: (clientId: string, payload: { name: string; type: string }) =>
    rbcFetch<{ portfolioId: string }>(`/clients/${clientId}/portfolios`, { method: "POST", body: payload }),
  transferToPortfolio: (portfolioId: string, payload: { amountCents: number }) =>
    rbcFetch<{ success: boolean }>(`/portfolios/${portfolioId}/transfer`, { method: "POST", body: payload }),
  getPortfolio: (portfolioId: string) =>
    rbcFetch<{ id: string; current_value_cents: number; name: string }>(`/portfolios/${portfolioId}`),
  simulate: (clientId: string, payload: { months: number }) =>
    rbcFetch<{ projectedValueCents: number }>(`/client/${clientId}/simulate`, { method: "POST", body: payload }),
};



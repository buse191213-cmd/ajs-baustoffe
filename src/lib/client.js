// Tiny fetch wrapper. All calls are same-origin and credentials are included
// so the admin session cookie travels automatically.

async function req(method, url, body) {
  const res = await fetch(url, {
    method,
    credentials: "same-origin",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  get: (url) => req("GET", url),
  post: (url, body) => req("POST", url, body),
  put: (url, body) => req("PUT", url, body),
  patch: (url, body) => req("PATCH", url, body),
  del: (url) => req("DELETE", url),
};

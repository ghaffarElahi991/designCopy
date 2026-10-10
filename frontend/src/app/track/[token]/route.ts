export async function GET(_request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  const headers = { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow", "Content-Type": "text/html; charset=utf-8" };
  let status = 200;
  let title = "Preparing your order";
  let message = "Your lovely finds are being prepared. Your tracking details will be available here shortly. Please check back soon.";
  try {
    const api = process.env.API_URL || "http://127.0.0.1:4000/api";
    const result = await fetch(`${api}/orders/track/${encodeURIComponent(token)}`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (result.status === 404) {
      status = 404; title = "Tracking link not found"; message = "Please check the tracking link in your order confirmation email.";
    } else if (!result.ok) throw new Error();
    else {
      const data = await result.json();
      if (data.trackingUrl) {
        const url = new URL(data.trackingUrl);
        if (url.protocol !== "https:" || url.username || url.password) throw new Error();
        return new Response(null, { status: 302, headers: { ...headers, Location: url.href } });
      }
    }
  } catch { status = 503; title = "Tracking is temporarily unavailable"; message = "Please try again in a moment."; }
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Silk Shadow</title></head><body style="margin:0;background:#ead7de;color:#59434c;font-family:Arial,sans-serif"><main style="max-width:540px;margin:12vh auto;padding:40px 24px;background:#fffaf7;text-align:center;border-top:4px solid #d6b58a"><a href="/" style="font-family:Georgia,serif;font-size:26px;letter-spacing:4px;color:#2d1720;text-decoration:none">SILK SHADOW</a><p style="margin-top:36px;color:#8a5d35;letter-spacing:2px;font-size:12px">YOUR ORDER'S JOURNEY</p><h1 style="font-family:Georgia,serif;font-weight:normal;color:#9b4965;font-size:34px">${title}</h1><p style="line-height:1.8">${message}</p><a href="/shop" style="display:inline-block;margin-top:24px;background:#9b4965;color:white;padding:14px 24px;text-decoration:none">Continue shopping</a></main></body></html>`, { status, headers });
}

const CLIENT_ID = "1450641085385674853";
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://registroymir.vercel.app/api/discordAuth/callback";

export default async function handler(req, res) {
  const cookies = req.headers.cookie || "";
  const refreshToken = cookies.split("; ").find(c => c.startsWith("discordRefresh="))?.split("=")[1];

  if (!refreshToken) {
    return res.status(401).json({ error: "No hay refresh token" });
  }

  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();
    return res.json(tokenData);
  } catch (err) {
    return res.status(500).json({ error: "Error al refrescar token", detalle: err.message });
  }
}

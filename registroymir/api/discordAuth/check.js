// /api/discordAuth/check.js

const CLIENT_ID = "1450641085385674853";
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://registroymir.vercel.app/api/discordAuth/callback";

export default async function handler(req, res) {
  const cookies = req.headers.cookie || "";
  const refreshToken = cookies.split("; ").find(c => c.startsWith("discordRefresh="))?.split("=")[1];
  const discordUser = cookies.split("; ").find(c => c.startsWith("discordUser="))?.split("=")[1];

  // ✅ Si hay refresh_token, intentamos renovar sesión
  if (refreshToken) {
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

      if (tokenData.access_token) {
        return res.json({ ok: true, user: discordUser || null });
      }
    } catch (err) {
      console.error("Error al refrescar token:", err);
      return res.json({ ok: false });
    }
  }

  // ✅ Si no hay refresh_token pero sí cookie de usuario
  if (discordUser) {
    return res.json({ ok: true, user: discordUser });
  }

  // ❌ No hay sesión válida
  return res.json({ ok: false });
}

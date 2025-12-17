// /api/discordAuth/index.js

const CLIENT_ID = "1450641085385674853";
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://registroymir.vercel.app/api/discordAuth/callback";

export default async function handler(req, res) {
  const cookies = req.headers.cookie || "";
  const discordUser = cookies.split("; ").find(c => c.startsWith("discordUser="));
  const discordRefresh = cookies.split("; ").find(c => c.startsWith("discordRefresh="));

  // ✅ Si ya hay refresh_token, intentar renovar sesión sin pasar por Discord
  if (discordRefresh) {
    const refreshToken = discordRefresh.split("=")[1];
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
        // ✅ Sesión renovada → ir directo al panel
        return res.redirect("/panel.html");
      }
    } catch (err) {
      console.error("Error al refrescar token:", err);
      // Si falla, continuar con flujo normal
    }
  }

  // ✅ Si ya hay cookie de usuario, redirigir directo al panel
  if (discordUser) {
    return res.redirect("/panel.html");
  }

  // 🔄 Si no hay sesión ni refresh_token, iniciar flujo OAuth
  const discordAuthURL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20guilds&prompt=none`;

  return res.redirect(discordAuthURL);
}

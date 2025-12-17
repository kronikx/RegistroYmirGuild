const CLIENT_ID = "1450641085385674853";
const REDIRECT_URI = "https://registroymir.vercel.app/api/discordAuth/callback";

export default async function handler(req, res) {
  const cookies = req.headers.cookie || "";
  const discordUser = cookies.split("; ").find(c => c.startsWith("discordUser="));
  const discordRefresh = cookies.split("; ").find(c => c.startsWith("discordRefresh="));

  // ✅ Si ya hay refresh_token, intentar renovar sesión
  if (discordRefresh) {
    return res.redirect("/panel.html");
  }

  // ✅ Si ya hay cookie de usuario, redirigir directo al panel
  if (discordUser) {
    return res.redirect("/panel.html");
  }

  // 🔄 Si no hay sesión, iniciar flujo OAuth
  const discordAuthURL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20guilds&prompt=none`;
  return res.redirect(discordAuthURL);
}

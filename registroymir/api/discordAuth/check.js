export default async function handler(req, res) {
  const cookies = req.headers.cookie || "";

  const userId = cookies
    .split("; ")
    .find(c => c.startsWith("discordUser="))
    ?.split("=")[1];

  const refreshToken = cookies
    .split("; ")
    .find(c => c.startsWith("discordRefresh="))
    ?.split("=")[1];

  if (userId && refreshToken) {
    // ✅ Sesión válida: tenemos usuario y refresh token
    return res.status(200).json({ ok: true, userId });
  } else {
    // ❌ Falta alguna cookie → no hay sesión válida
    return res.status(200).json({ ok: false });
  }
}

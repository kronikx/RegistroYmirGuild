const CLIENT_ID = "1450641085385674853";
const CLIENT_SECRET = process.env.CLIENT_SECRET;

export default async function handler(req, res) {
  const cookies = req.headers.cookie || "";
  const refreshToken = cookies
    .split("; ")
    .find(c => c.startsWith("discordRefresh="))
    ?.split("=")[1];

  if (!refreshToken) {
    console.log("❌ No se encontró la cookie discordRefresh");
    return res.status(401).json({ error: "No hay refresh" });
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
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log("🔁 Respuesta de Discord:", tokenData);

    if (!tokenData.access_token) {
      return res.status(401).json({ error: "No se pudo renovar", detalle: tokenData });
    }

    return res.status(200).json({ access_token: tokenData.access_token });
  } catch (err) {
    console.error("🔥 Error al renovar:", err);
    return res.status(500).json({ error: "Error al renovar", detalle: err.message });
  }
}

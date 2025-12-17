import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // ajusta si tu firebase.js está en otro sitio

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Método no permitido" });
    }

    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ ok: false, error: "Usuario y contraseña requeridos" });
    }

    const exists = await getDoc(doc(db, "users", username));
    if (exists.exists()) {
      return res.status(409).json({ ok: false, error: "El usuario ya existe" });
    }

    await setDoc(doc(db, "users", username), {
      username,
      password,
      rol: "Miembro",
      createdAt: Date.now()
    });

    res.setHeader("Set-Cookie", `userId=${encodeURIComponent(username)}; Path=/; SameSite=Lax; Secure; Max-Age=604800`);
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Error interno del servidor" });
  }
}

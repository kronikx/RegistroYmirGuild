import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";


export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Método no permitido" });
    }

    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ ok: false, error: "Usuario y contraseña requeridos" });
    }

    await setDoc(doc(db, "users", username), {
      username,
      password,
      rol: "Miembro"
    });

    res.setHeader("Set-Cookie", `userId=${username}; Path=/; SameSite=Lax; Secure; Max-Age=604800`);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error en /api/register:", err);
    return res.status(500).json({ ok: false, error: "Error interno del servidor" });
  }
}

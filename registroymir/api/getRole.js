import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default async function handler(req, res) {
  try {
    const cookie = req.headers.cookie || "";
    const match = cookie.match(/userId=([^;]+)/);
    if (!match) {
      return res.status(401).json({ ok: false, error: "Sin sesión" });
    }

    const userId = decodeURIComponent(match[1]);
    const snap = await getDoc(doc(db, "users", userId));
    if (!snap.exists()) {
      return res.status(401).json({ ok: false, error: "Usuario no encontrado" });
    }

    const data = snap.data();
    return res.status(200).json({ ok: true, rol: data.rol || "Miembro", userId });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Error interno del servidor" });
  }
}

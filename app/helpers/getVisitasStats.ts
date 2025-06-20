import { db } from '@/lib/db/index';
import { visitas } from '@/lib/visitas/schema';
import { eq } from 'drizzle-orm';

const ipCountryCache: Record<string, { country: string, timestamp: number }> = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora

async function getCountryByIp(ip: string): Promise<string> {
  try {
    if (["127.0.0.1", "127:0:1", "::1", "unknown"].includes(ip)) return "Desconocido";

    const now = Date.now();
    if (ipCountryCache[ip] && (now - ipCountryCache[ip].timestamp < CACHE_DURATION)) {
      return ipCountryCache[ip].country;
    }

    const res = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await res.json();
    const country = data?.country || "Desconocido";

    ipCountryCache[ip] = { country, timestamp: now };
    return country;
  } catch {
    return "Desconocido";
  }
}

export async function getVisitasStats() {
  try {
    const all = await db.visitas.select().from(visitas);

    let total = 0;
    const rutasCount: Record<string, number> = {};
    const countryCount: Record<string, number> = {};

    const ipToVisits: Record<string, number> = {};
    const ipToRutas: Record<string, string[]> = {};

    for (const visita of all) {
      const visitCount = visita.visita || 1;
      total += visitCount;

      // Parsear rutas
      let rutas: string[] = [];
      try {
        rutas = visita.rutas ? JSON.parse(visita.rutas) : [];
      } catch {
        rutas = [];
      }

      // ✅ Si solo quieres contar productos: descomenta esta línea
      // rutas = rutas.filter(r => r.startsWith("/product/"));

      rutas.forEach(ruta => {
        rutasCount[ruta] = (rutasCount[ruta] || 0) + 1;
      });

      // Acumular IPs
      if (visita.ip) {
        ipToVisits[visita.ip] = (ipToVisits[visita.ip] || 0) + visitCount;
        ipToRutas[visita.ip] = [...(ipToRutas[visita.ip] || []), ...rutas];
      }
    }

    // Resolver países en paralelo
    const uniqueIps = Object.keys(ipToVisits);
    const ipToCountry = await Promise.all(uniqueIps.map(ip => getCountryByIp(ip)));

    uniqueIps.forEach((ip, idx) => {
      const country = ipToCountry[idx];
      const visits = ipToVisits[ip];
      countryCount[country] = (countryCount[country] || 0) + visits;
    });

    return {
      total,
      rutasCount,
      countryCount,
    };
  } catch (error) {
    console.error("[GET_VISITAS_STATS] Error:", error);
    throw new Error("Error al obtener estadísticas de visitas");
  }
}

// Iconos de línea para "Para quién es" (carrusel de industrias): mismo trazo y escala que
// LATAM_ICONS de la home (src/pages/home/HomePage.jsx) — 24×24, sin relleno, stroke-linecap round.
// Pictogramas concretos por industria, no ilustraciones abstractas genéricas ni fotos stock
// (regla cero, CLAUDE.md): esto cambia el día que haya un asset de marca mejor.
export const INDUSTRY_ICONS = {
  saas: (
    <g key="saas">
      <path d="M12 3 21 8 12 13 3 8z" />
      <path d="M3 13l9 5 9-5" />
      <path d="M3 18l9 5 9-5" />
    </g>
  ),
  logistica: (
    <g key="logistica">
      <path d="M3 16V6a1 1 0 0 1 1-1h8v11" />
      <path d="M12 9h4l4 4v3h-8" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </g>
  ),
  tresPl: (
    <g key="tresPl">
      <path d="M3 21V8l9-5 9 5v13" />
      <path d="M3 21h18" />
      <path d="M9 21v-7h6v7" />
    </g>
  ),
  ultimaMilla: (
    <g key="ultimaMilla">
      <path d="M12 21s7-7.58 7-12a7 7 0 0 0-14 0c0 4.42 7 12 7 12z" />
      <rect x="9.3" y="6.8" width="5.4" height="5.4" rx="1" />
    </g>
  ),
  staffing: (
    <g key="staffing">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-.5A5.5 5.5 0 0 1 8.5 14h1A5.5 5.5 0 0 1 15 19.5v.5" />
      <circle cx="17.5" cy="9.5" r="2.3" />
      <path d="M15.8 20v-.3a4.3 4.3 0 0 1 4.3-4.3h.2" />
    </g>
  ),
  contables: (
    <g key="contables">
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M15 3v3h3" />
      <path d="M9 11h6M9 14h6M9 17h4" />
    </g>
  ),
  seguridad: (
    <g key="seguridad">
      <path d="M12 3l7 3v6c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </g>
  ),
  maquinaria: (
    <g key="maquinaria">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 4.5v2.2M12 17.3v2.2M19.5 12h-2.2M6.7 12H4.5M17.3 6.7l-1.6 1.6M8.3 15.7l-1.6 1.6M17.3 17.3l-1.6-1.6M8.3 8.3 6.7 6.7" />
    </g>
  ),
}

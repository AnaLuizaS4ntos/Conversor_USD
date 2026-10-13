// Utilitário de bandeiras e ícones SVG para as moedas
export function getFlagSvg(countryCode) {
  const code = (countryCode || '').toUpperCase();
  
  // Mapeamento de bandeiras em SVG circular estilizado
  const flagMap = {
    US: `<svg viewBox="0 0 32 32" class="flag-icon"><defs><clipPath id="c-us"><circle cx="16" cy="16" r="16"/></clipPath></defs><g clip-path="url(#c-us)"><rect width="32" height="32" fill="#B22234"/><path d="M0,4.9h32M0,9.8h32M0,14.8h32M0,19.7h32M0,24.6h32M0,29.5h32" stroke="#FFFFFF" stroke-width="2.5"/><rect width="14" height="17" fill="#3C3B6E"/><circle cx="7" cy="8.5" r="4.5" fill="#FFFFFF"/></g></svg>`,
    EU: `<svg viewBox="0 0 32 32" class="flag-icon"><circle cx="16" cy="16" r="16" fill="#003399"/><circle cx="16" cy="7" r="1.2" fill="#FFCC00"/><circle cx="16" cy="25" r="1.2" fill="#FFCC00"/><circle cx="7" cy="16" r="1.2" fill="#FFCC00"/><circle cx="25" cy="16" r="1.2" fill="#FFCC00"/><circle cx="9.6" cy="9.6" r="1.2" fill="#FFCC00"/><circle cx="22.4" cy="9.6" r="1.2" fill="#FFCC00"/><circle cx="9.6" cy="22.4" r="1.2" fill="#FFCC00"/><circle cx="22.4" cy="22.4" r="1.2" fill="#FFCC00"/></svg>`,
    GB: `<svg viewBox="0 0 32 32" class="flag-icon"><defs><clipPath id="c-gb"><circle cx="16" cy="16" r="16"/></clipPath></defs><g clip-path="url(#c-gb)"><rect width="32" height="32" fill="#012169"/><path d="M0,0 L32,32 M32,0 L0,32" stroke="#FFFFFF" stroke-width="6"/><path d="M0,0 L32,32 M32,0 L0,32" stroke="#C8102E" stroke-width="3"/><path d="M16,0 V32 M0,16 H32" stroke="#FFFFFF" stroke-width="8"/><path d="M16,0 V32 M0,16 H32" stroke="#C8102E" stroke-width="4.8"/></g></svg>`,
    JP: `<svg viewBox="0 0 32 32" class="flag-icon"><circle cx="16" cy="16" r="16" fill="#FFFFFF"/><circle cx="16" cy="16" r="7" fill="#BC002D"/></svg>`,
    CH: `<svg viewBox="0 0 32 32" class="flag-icon"><circle cx="16" cy="16" r="16" fill="#D52B1E"/><rect x="13.5" y="8" width="5" height="16" fill="#FFFFFF"/><rect x="8" y="13.5" width="16" height="5" fill="#FFFFFF"/></svg>`,
    CA: `<svg viewBox="0 0 32 32" class="flag-icon"><defs><clipPath id="c-ca"><circle cx="16" cy="16" r="16"/></clipPath></defs><g clip-path="url(#c-ca)"><rect width="32" height="32" fill="#FF0000"/><rect x="8" width="16" height="32" fill="#FFFFFF"/><polygon points="16,8 19,16 17,16 20,21 16,19 12,21 15,16 13,16" fill="#FF0000"/></g></svg>`,
    AU: `<svg viewBox="0 0 32 32" class="flag-icon"><defs><clipPath id="c-au"><circle cx="16" cy="16" r="16"/></clipPath></defs><g clip-path="url(#c-au)"><rect width="32" height="32" fill="#00008B"/><circle cx="23" cy="10" r="1.5" fill="#FFFFFF"/><circle cx="25" cy="17" r="1.5" fill="#FFFFFF"/><circle cx="21" cy="22" r="1.5" fill="#FFFFFF"/><circle cx="18" cy="18" r="1.5" fill="#FFFFFF"/><circle cx="10" cy="22" r="2.5" fill="#FFFFFF"/></g></svg>`,
    IN: `<svg viewBox="0 0 32 32" class="flag-icon"><defs><clipPath id="c-in"><circle cx="16" cy="16" r="16"/></clipPath></defs><g clip-path="url(#c-in)"><rect width="32" height="10.6" fill="#FF9933"/><rect y="10.6" width="32" height="10.6" fill="#FFFFFF"/><rect y="21.3" width="32" height="10.7" fill="#138808"/><circle cx="16" cy="16" r="3.5" stroke="#000080" stroke-width="1" fill="none"/></g></svg>`,
    CN: `<svg viewBox="0 0 32 32" class="flag-icon"><circle cx="16" cy="16" r="16" fill="#DE2910"/><polygon points="8,7 9.5,11.5 6,8.5 10,8.5 6.5,11.5" fill="#FFDE00"/><circle cx="13" cy="6" r="0.8" fill="#FFDE00"/><circle cx="15" cy="8.5" r="0.8" fill="#FFDE00"/><circle cx="15" cy="11.5" r="0.8" fill="#FFDE00"/><circle cx="13" cy="14" r="0.8" fill="#FFDE00"/></svg>`,
    BD: `<svg viewBox="0 0 32 32" class="flag-icon"><circle cx="16" cy="16" r="16" fill="#006A4E"/><circle cx="14" cy="16" r="6" fill="#F42A41"/></svg>`,
    BR: `<svg viewBox="0 0 32 32" class="flag-icon"><circle cx="16" cy="16" r="16" fill="#009C3B"/><polygon points="16,6 27,16 16,26 5,16" fill="#FFDF00"/><circle cx="16" cy="16" r="5" fill="#002776"/></svg>`,
    AE: `<svg viewBox="0 0 32 32" class="flag-icon"><defs><clipPath id="c-ae"><circle cx="16" cy="16" r="16"/></clipPath></defs><g clip-path="url(#c-ae)"><rect width="32" height="10.6" fill="#00732F"/><rect y="10.6" width="32" height="10.6" fill="#FFFFFF"/><rect y="21.3" width="32" height="10.7" fill="#000000"/><rect width="8" height="32" fill="#FF0000"/></g></svg>`,
    AR: `<svg viewBox="0 0 32 32" class="flag-icon"><defs><clipPath id="c-ar"><circle cx="16" cy="16" r="16"/></clipPath></defs><g clip-path="url(#c-ar)"><rect width="32" height="10.6" fill="#74ACDF"/><rect y="10.6" width="32" height="10.6" fill="#FFFFFF"/><rect y="21.3" width="32" height="10.7" fill="#74ACDF"/><circle cx="16" cy="16" r="3" fill="#F6B40E"/></g></svg>`,
    TR: `<svg viewBox="0 0 32 32" class="flag-icon"><circle cx="16" cy="16" r="16" fill="#E30A17"/><circle cx="14" cy="16" r="5" fill="#FFFFFF"/><circle cx="15.5" cy="16" r="4" fill="#E30A17"/><polygon points="18,16 19.5,14.5 19.5,17.5" fill="#FFFFFF"/></svg>`,
    MX: `<svg viewBox="0 0 32 32" class="flag-icon"><defs><clipPath id="c-mx"><circle cx="16" cy="16" r="16"/></clipPath></defs><g clip-path="url(#c-mx)"><rect width="10.6" height="32" fill="#006847"/><rect x="10.6" width="10.6" height="32" fill="#FFFFFF"/><rect x="21.3" width="10.7" height="32" fill="#CE1126"/><circle cx="16" cy="16" r="2.5" fill="#7B4E28"/></g></svg>`
  };

  if (flagMap[code]) {
    return flagMap[code];
  }

  // Fallback elegante circular com as iniciais do país
  return `<svg viewBox="0 0 32 32" class="flag-icon flag-fallback"><circle cx="16" cy="16" r="16" fill="#25272D"/><text x="16" y="20" font-family="sans-serif" font-size="11" font-weight="bold" fill="#B6F02A" text-anchor="middle">${code.substring(0, 2)}</text></svg>`;
}

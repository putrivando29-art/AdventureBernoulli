/* Gambar SVG untuk karakter dan latar tiap tahap. Semua inline, tanpa aset luar. */
(function (root) {
  "use strict";

  function hero(gear) {
    const sword = gear.includes("sword");
    const armor = gear.includes("armor");
    const body = armor
      ? `<path d="M40 70 Q60 62 80 70 L82 108 Q60 116 38 108 Z" fill="#b8c2d6" stroke="#5d6782" stroke-width="2"/>
         <path d="M48 76 L72 76 L70 100 L50 100 Z" fill="#d7deeb"/>
         <ellipse cx="40" cy="72" rx="10" ry="7" fill="#9aa5bd" stroke="#5d6782" stroke-width="2"/>
         <ellipse cx="80" cy="72" rx="10" ry="7" fill="#9aa5bd" stroke="#5d6782" stroke-width="2"/>`
      : `<path d="M42 70 Q60 64 78 70 L80 108 Q60 114 40 108 Z" fill="#3f7fbf" stroke="#244c75" stroke-width="2"/>
         <rect x="42" y="94" width="38" height="6" fill="#7a4b2a"/>`;
    const head = armor
      ? `<circle cx="60" cy="48" r="17" fill="#f2c9a0"/>
         <path d="M42 48 Q42 26 60 26 Q78 26 78 48 L78 52 L70 52 L70 44 L50 44 L50 52 L42 52 Z" fill="#b8c2d6" stroke="#5d6782" stroke-width="2"/>
         <path d="M58 22 Q66 10 76 14 Q68 18 64 26 Z" fill="#d6453d"/>`
      : `<circle cx="60" cy="48" r="17" fill="#f2c9a0"/>
         <path d="M43 44 Q44 28 60 28 Q76 28 77 44 Q70 36 60 38 Q50 36 43 44 Z" fill="#5a3a22"/>`;
    const shield = armor
      ? `<path d="M22 78 L42 74 L42 98 Q32 110 22 98 Z" fill="#7d5ba6" stroke="#3f2d5a" stroke-width="2"/>
         <path d="M32 80 L32 102 M24 88 L40 86" stroke="#f6c453" stroke-width="3"/>`
      : `<circle cx="38" cy="90" r="6" fill="#f2c9a0"/>`;
    const weapon = sword
      ? `<g class="hero-weapon"><rect x="84" y="26" width="6" height="58" rx="2" fill="#e8eef7" stroke="#8792a8" stroke-width="1.5" transform="rotate(18 87 84)"/>
         <rect x="76" y="80" width="22" height="5" rx="2" fill="#c9962a" transform="rotate(18 87 84)"/>
         <circle cx="84" cy="90" r="6" fill="#f2c9a0"/></g>`
      : `<circle cx="84" cy="90" r="6" fill="#f2c9a0"/>`;
    return `<svg viewBox="0 0 120 160" class="sprite-svg" role="img" aria-label="Pahlawan${sword ? " dengan pedang" : ""}${armor ? " dan armor" : ""}">
      <ellipse cx="60" cy="152" rx="34" ry="6" fill="rgba(0,0,0,.35)"/>
      <rect x="46" y="106" width="11" height="40" rx="3" fill="${armor ? "#8b95ad" : "#33405c"}"/>
      <rect x="63" y="106" width="11" height="40" rx="3" fill="${armor ? "#8b95ad" : "#33405c"}"/>
      <rect x="43" y="142" width="16" height="8" rx="3" fill="#4a2f1c"/>
      <rect x="61" y="142" width="16" height="8" rx="3" fill="#4a2f1c"/>
      ${body}
      ${head}
      <circle cx="66" cy="50" r="2.4" fill="#1d1d2b"/>
      <path d="M62 58 Q66 60 70 57" stroke="#9a5a3c" stroke-width="2" fill="none"/>
      ${shield}
      ${weapon}
    </svg>`;
  }

  const enemies = {
    goblin: () => `<svg viewBox="0 0 160 160" class="sprite-svg" role="img" aria-label="Goblin Penjaga">
      <ellipse cx="80" cy="152" rx="38" ry="6" fill="rgba(0,0,0,.35)"/>
      <rect x="62" y="112" width="12" height="34" rx="4" fill="#4f7a2c"/>
      <rect x="84" y="112" width="12" height="34" rx="4" fill="#4f7a2c"/>
      <path d="M54 80 Q80 70 106 80 L104 118 Q80 126 56 118 Z" fill="#7a5a34" stroke="#4a361d" stroke-width="2"/>
      <path d="M38 52 L60 58 L56 66 Z M122 52 L100 58 L104 66 Z" fill="#78ad46"/>
      <circle cx="80" cy="60" r="24" fill="#78ad46" stroke="#4f7a2c" stroke-width="2"/>
      <ellipse cx="70" cy="58" rx="5" ry="6" fill="#fff6a8"/><ellipse cx="90" cy="58" rx="5" ry="6" fill="#fff6a8"/>
      <circle cx="69" cy="59" r="2.5" fill="#2a1a10"/><circle cx="89" cy="59" r="2.5" fill="#2a1a10"/>
      <path d="M68 72 Q80 80 92 72" stroke="#2a1a10" stroke-width="2.5" fill="none"/>
      <path d="M72 73 L74 78 L76 74 M84 74 L86 78 L88 73" fill="#fff"/>
      <g class="enemy-weapon"><rect x="28" y="64" width="9" height="52" rx="4" fill="#8a5a2b" transform="rotate(-20 32 116)"/>
      <circle cx="22" cy="68" r="11" fill="#6e4520" transform="rotate(-20 32 116)"/>
      <circle cx="46" cy="104" r="7" fill="#78ad46"/></g>
    </svg>`,

    wolf: () => `<svg viewBox="0 0 160 160" class="sprite-svg" role="img" aria-label="Serigala Bayangan">
      <ellipse cx="82" cy="152" rx="56" ry="6" fill="rgba(0,0,0,.35)"/>
      <path d="M140 92 Q156 70 150 56 Q144 78 128 86 Z" fill="#3b3560"/>
      <path d="M44 96 Q60 74 100 78 Q136 80 138 104 Q136 122 118 124 L50 124 Q36 116 44 96 Z" fill="#4b4378" stroke="#2a2547" stroke-width="2"/>
      <rect x="54" y="118" width="10" height="28" rx="4" fill="#3b3560"/>
      <rect x="72" y="120" width="10" height="26" rx="4" fill="#3b3560"/>
      <rect x="106" y="118" width="10" height="28" rx="4" fill="#3b3560"/>
      <rect x="122" y="116" width="10" height="30" rx="4" fill="#3b3560"/>
      <path d="M58 92 Q40 64 22 74 L12 86 Q20 98 36 98 L54 104 Z" fill="#4b4378" stroke="#2a2547" stroke-width="2"/>
      <path d="M40 70 L44 48 L54 72 Z M52 74 L62 54 L64 80 Z" fill="#3b3560"/>
      <path d="M12 86 L30 90 L14 94 Z" fill="#e8e6f4"/>
      <ellipse cx="34" cy="80" rx="5" ry="3" fill="#9df3ff" class="glow"/>
      <circle cx="12" cy="85" r="3" fill="#1b1830"/>
    </svg>`,

    skeleton: () => `<svg viewBox="0 0 160 160" class="sprite-svg" role="img" aria-label="Ksatria Tengkorak">
      <ellipse cx="80" cy="152" rx="40" ry="6" fill="rgba(0,0,0,.35)"/>
      <rect x="66" y="110" width="7" height="38" fill="#e7e2cf"/><rect x="88" y="110" width="7" height="38" fill="#e7e2cf"/>
      <rect x="60" y="142" width="16" height="7" rx="3" fill="#5b5f6e"/><rect x="85" y="142" width="16" height="7" rx="3" fill="#5b5f6e"/>
      <path d="M58 72 L104 72 L100 112 L62 112 Z" fill="#5b5f6e" stroke="#2f323d" stroke-width="2"/>
      <path d="M66 80 H96 M66 90 H96 M68 100 H94" stroke="#e7e2cf" stroke-width="3"/>
      <circle cx="81" cy="50" r="20" fill="#efeadb" stroke="#a49f88" stroke-width="2"/>
      <rect x="71" y="62" width="20" height="10" rx="2" fill="#efeadb" stroke="#a49f88" stroke-width="2"/>
      <path d="M75 64 V71 M81 64 V71 M87 64 V71" stroke="#a49f88" stroke-width="1.5"/>
      <ellipse cx="73" cy="50" rx="5" ry="6" fill="#1d1b26"/><ellipse cx="89" cy="50" rx="5" ry="6" fill="#1d1b26"/>
      <circle cx="73" cy="51" r="2" fill="#ff5a4e" class="glow"/><circle cx="89" cy="51" r="2" fill="#ff5a4e" class="glow"/>
      <path d="M60 36 Q81 18 102 36 L100 42 L62 42 Z" fill="#5b5f6e" stroke="#2f323d" stroke-width="2"/>
      <path d="M108 74 L130 78 L130 104 Q119 118 108 104 Z" fill="#7b2f2f" stroke="#3d1717" stroke-width="2"/>
      <g class="enemy-weapon"><rect x="26" y="44" width="6" height="56" rx="2" fill="#c9cfdb" stroke="#6e7486" stroke-width="1.5" transform="rotate(-24 29 100)"/>
      <rect x="18" y="96" width="22" height="5" rx="2" fill="#6e4520" transform="rotate(-24 29 100)"/>
      <circle cx="52" cy="96" r="6" fill="#efeadb"/></g>
      <path d="M58 78 L50 96" stroke="#efeadb" stroke-width="6" stroke-linecap="round"/>
    </svg>`,

    dragon: (rage) => {
      const c = rage
        ? { body: "#b3261e", dark: "#5e0f0b", belly: "#f6a04d", wing: "#7d1712", eye: "#fff36b" }
        : { body: "#3f8f5a", dark: "#1f4d30", belly: "#d9c37a", wing: "#2d6a43", eye: "#ffd34d" };
      const flames = rage
        ? `<g class="aura"><path d="M30 150 Q40 120 34 100 Q52 118 50 150 Z" fill="#ff7a1a" opacity=".85"/>
           <path d="M120 150 Q132 116 124 92 Q146 116 140 150 Z" fill="#ff7a1a" opacity=".85"/>
           <path d="M70 150 Q78 130 74 116 Q90 132 86 150 Z" fill="#ffc23d" opacity=".9"/></g>
           <path d="M14 66 Q0 60 2 70 Q-2 78 10 76 Q2 86 12 86 L26 72 Z" fill="#ffb02e" class="breath"/>`
        : "";
      return `<svg viewBox="0 0 160 160" class="sprite-svg" role="img" aria-label="${rage ? "Raja Naga dalam mode marah" : "Raja Naga"}">
        <ellipse cx="88" cy="152" rx="60" ry="7" fill="rgba(0,0,0,.4)"/>
        ${flames}
        <path d="M96 64 Q120 8 156 18 Q138 34 150 46 Q132 46 140 62 Q120 58 118 76 Z" fill="${c.wing}" stroke="${c.dark}" stroke-width="2" class="wing"/>
        <path d="M120 120 Q152 128 156 104 Q150 120 128 108 Z" fill="${c.body}" stroke="${c.dark}" stroke-width="2"/>
        <path d="M60 84 Q70 64 100 66 Q132 70 132 108 Q130 134 100 136 L70 136 Q50 128 52 106 Z" fill="${c.body}" stroke="${c.dark}" stroke-width="2"/>
        <path d="M68 96 Q80 84 100 90 Q110 112 98 130 L74 130 Q64 116 68 96 Z" fill="${c.belly}"/>
        <path d="M74 100 H98 M72 110 H100 M74 120 H98" stroke="${c.dark}" stroke-width="1.2" opacity=".5"/>
        <rect x="70" y="130" width="14" height="18" rx="4" fill="${c.body}" stroke="${c.dark}" stroke-width="2"/>
        <rect x="102" y="128" width="14" height="20" rx="4" fill="${c.body}" stroke="${c.dark}" stroke-width="2"/>
        <path d="M68 90 Q54 60 40 54 L22 58 Q10 64 14 74 L28 80 Q46 84 58 98 Z" fill="${c.body}" stroke="${c.dark}" stroke-width="2"/>
        <path d="M40 54 L46 34 L52 56 Z M50 58 L62 42 L60 64 Z" fill="${c.belly}" stroke="${c.dark}" stroke-width="1.5"/>
        <path d="M14 74 L28 76 L16 70" fill="#fff"/>
        <path d="M30 62 L40 60" stroke="${c.dark}" stroke-width="3" stroke-linecap="round"${rage ? ' transform="rotate(14 35 61)"' : ""}/>
        <ellipse cx="36" cy="66" rx="4.5" ry="3.5" fill="${c.eye}" class="glow"/>
        <circle cx="35" cy="66" r="1.8" fill="#1b1010"/>
        <circle cx="18" cy="64" r="1.6" fill="${c.dark}"/>
        <path d="M82 66 L86 54 L92 66 M100 66 L106 54 L110 68 M116 74 L124 64 L126 78" fill="${c.belly}" stroke="${c.dark}" stroke-width="1.5"/>
      </svg>`;
    },
  };

  function enemy(type) {
    if (type === "dragon-rage") return enemies.dragon(true);
    if (type === "dragon") return enemies.dragon(false);
    return (enemies[type] || enemies.goblin)();
  }

  // Latar per tema. Setiap tahap punya suasana sendiri.
  const backgrounds = {
    forest: `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMax slice">
      <circle cx="330" cy="46" r="22" fill="#fff4c2" opacity=".9"/>
      <path d="M0 170 Q80 140 160 160 Q260 186 400 150 L400 220 L0 220 Z" fill="#2e6b3a"/>
      <g fill="#1f4f2b">
        <polygon points="30,170 55,90 80,170"/><polygon points="70,175 100,70 130,175"/>
        <polygon points="300,165 330,80 360,165"/><polygon points="350,170 375,100 400,170"/>
      </g>
      <g fill="#174022"><polygon points="0,180 20,120 40,180"/><polygon points="250,175 272,110 294,175"/></g>
      <path d="M0 200 Q200 184 400 200 L400 220 L0 220 Z" fill="#3e8a48"/>
      <path d="M170 220 Q190 196 210 196 Q230 196 250 220 Z" fill="#b08a55" opacity=".7"/>
    </svg>`,
    cave: `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMax slice">
      <path d="M0 0 H400 V30 L380 60 L360 28 L330 70 L300 26 L270 52 L240 22 L200 64 L170 24 L140 56 L110 20 L80 66 L50 26 L20 54 L0 30 Z" fill="#141029"/>
      <g opacity=".9">
        <polygon points="40,190 52,140 64,190" fill="#7de3ff"/><polygon points="56,190 64,160 72,190" fill="#b292ff"/>
        <polygon points="330,190 344,130 358,190" fill="#b292ff"/><polygon points="350,190 360,156 370,190" fill="#7de3ff"/>
        <polygon points="190,40 196,70 202,40" fill="#7de3ff" opacity=".6"/>
      </g>
      <path d="M0 186 Q120 172 200 182 Q300 194 400 180 L400 220 L0 220 Z" fill="#2a2248"/>
    </svg>`,
    ruins: `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMax slice">
      <circle cx="80" cy="50" r="26" fill="#f7d7a8" opacity=".85"/>
      <g fill="#6b5f57">
        <rect x="20" y="70" width="28" height="120"/><rect x="14" y="62" width="40" height="10"/>
        <rect x="330" y="96" width="28" height="94"/><path d="M324 96 L364 96 L356 84 L340 90 L330 82 Z"/>
        <rect x="270" y="120" width="22" height="70"/>
      </g>
      <g fill="#574c45"><rect x="60" y="150" width="60" height="40"/><rect x="66" y="140" width="10" height="12"/><rect x="88" y="140" width="10" height="12"/></g>
      <path d="M0 186 Q200 176 400 188 L400 220 L0 220 Z" fill="#7c6a52"/>
      <g stroke="#3d342e" stroke-width="2"><path d="M24 100 H44 M24 130 H44 M334 130 H354"/></g>
    </svg>`,
    tower: `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMax slice">
      <circle cx="320" cy="44" r="20" fill="#e9e5ff"/><circle cx="312" cy="40" r="20" fill="#2a1f4d"/>
      <g fill="#ffffff" opacity=".7"><circle cx="40" cy="30" r="1.5"/><circle cx="120" cy="54" r="1.2"/><circle cx="200" cy="22" r="1.6"/><circle cx="260" cy="70" r="1.2"/><circle cx="370" cy="96" r="1.4"/></g>
      <g fill="#3a2f5e">
        <rect x="0" y="120" width="400" height="12"/>
        <rect x="0" y="108" width="20" height="14"/><rect x="40" y="108" width="20" height="14"/><rect x="80" y="108" width="20" height="14"/>
        <rect x="300" y="108" width="20" height="14"/><rect x="340" y="108" width="20" height="14"/><rect x="380" y="108" width="20" height="14"/>
      </g>
      <rect x="0" y="132" width="400" height="88" fill="#2c2449"/>
      <g stroke="#1e1836" stroke-width="2"><path d="M0 160 H400 M0 190 H400 M40 132 V160 M120 132 V160 M200 132 V160 M280 132 V160 M360 132 V160 M80 160 V190 M160 160 V190 M240 160 V190 M320 160 V190"/></g>
    </svg>`,
    lava: `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMax slice">
      <path d="M0 120 L60 70 L100 110 L160 50 L220 120 L280 60 L340 110 L400 80 L400 220 L0 220 Z" fill="#2b0f0c"/>
      <path d="M150 60 L160 50 L170 62 Z" fill="#ff7a1a"/>
      <path d="M0 176 Q60 160 120 176 T240 176 T400 170 L400 220 L0 220 Z" fill="#ff5a1a"/>
      <path d="M0 192 Q80 180 160 194 T400 188 L400 220 L0 220 Z" fill="#ffb02e" opacity=".9"/>
      <g fill="#ffd36b" class="embers"><circle cx="60" cy="150" r="2"/><circle cx="140" cy="130" r="1.6"/><circle cx="260" cy="140" r="2.2"/><circle cx="330" cy="120" r="1.6"/><circle cx="210" cy="100" r="1.4"/></g>
    </svg>`,
  };

  root.Art = { hero, enemy, background: (t) => backgrounds[t] || backgrounds.forest };
})(typeof self !== "undefined" ? self : this);

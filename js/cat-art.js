/* 用 SVG 畫的簡單貓咪插圖。
 * catSVG(art, uid) 依照 art 設定產生一隻貓臉:
 *   base:  底色
 *   ear:   "normal" | "fold" | "big"
 *   eye:   眼睛顏色
 *   pattern: "none" | "stripes" | "calico" | "tuxedo" | "points" | "wrinkles" | "fluffy"
 *   p1, p2: 花紋用色
 * uid 讓同一頁多隻貓的 clipPath id 不會撞名。
 */
(function () {
  function ears(type, base, p1) {
    var inner = "#F2B8A8";
    if (type === "fold") {
      // 折耳:貼著頭的小圓耳
      return (
        '<path d="M45 52 Q38 30 62 32 Q76 36 70 56 Z" fill="' + base + '"/>' +
        '<path d="M155 52 Q162 30 138 32 Q124 36 130 56 Z" fill="' + base + '"/>'
      );
    }
    var h = type === "big" ? 30 : 16; // big = 耳朵更高
    var earColor = p1 || base;
    return (
      '<path d="M40 62 L30 ' + (18 - h * 0.3) + ' L82 34 Z" fill="' + earColor + '"/>' +
      '<path d="M160 62 L170 ' + (18 - h * 0.3) + ' L118 34 Z" fill="' + earColor + '"/>' +
      '<path d="M46 56 L40 26 L74 40 Z" fill="' + inner + '"/>' +
      '<path d="M154 56 L160 26 L126 40 Z" fill="' + inner + '"/>'
    );
  }

  function pattern(art, clip) {
    var g = '<g clip-path="url(#' + clip + ')">';
    switch (art.pattern) {
      case "stripes":
        return g +
          '<rect x="88" y="40" width="9" height="26" rx="4.5" fill="' + art.p1 + '"/>' +
          '<rect x="103" y="40" width="9" height="26" rx="4.5" fill="' + art.p1 + '"/>' +
          '<rect x="73" y="46" width="9" height="20" rx="4.5" fill="' + art.p1 + '" opacity="0.7"/>' +
          '<rect x="118" y="46" width="9" height="20" rx="4.5" fill="' + art.p1 + '" opacity="0.7"/>' +
          "</g>";
      case "calico":
        return g +
          '<ellipse cx="58" cy="62" rx="34" ry="30" fill="' + art.p1 + '"/>' +
          '<ellipse cx="142" cy="60" rx="30" ry="28" fill="' + art.p2 + '"/>' +
          "</g>";
      case "tuxedo":
        // 頭頂深色、嘴巴周圍白
        return g +
          '<ellipse cx="100" cy="128" rx="46" ry="34" fill="#FFFDF8"/>' +
          "</g>";
      case "points":
        // 重點色:嘴巴周圍一圈深色
        return g +
          '<ellipse cx="100" cy="122" rx="34" ry="24" fill="' + art.p1 + '" opacity="0.55"/>' +
          "</g>";
      case "wrinkles":
        return g +
          '<path d="M78 52 Q100 44 122 52" stroke="' + art.p1 + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
          '<path d="M82 64 Q100 57 118 64" stroke="' + art.p1 + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
          "</g>";
      case "fluffy":
        // 蓬蓬的臉頰毛
        return (
          '<path d="M34 96 Q22 100 30 110 Q20 116 32 122" stroke="' + (art.p1 || art.base) + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
          '<path d="M166 96 Q178 100 170 110 Q180 116 168 122" stroke="' + (art.p1 || art.base) + '" stroke-width="6" fill="none" stroke-linecap="round"/>'
        );
      default:
        return "";
    }
  }

  window.catSVG = function (art, uid) {
    var clip = "cat-clip-" + (uid || Math.random().toString(36).slice(2, 7));
    var earColor = art.pattern === "points" ? art.p1 : null;
    return (
      '<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" role="img">' +
      "<defs><clipPath id=\"" + clip + '"><ellipse cx="100" cy="98" rx="72" ry="64"/></clipPath></defs>' +
      ears(art.ear || "normal", art.base, earColor) +
      '<ellipse cx="100" cy="98" rx="72" ry="64" fill="' + art.base + '"/>' +
      pattern(art, clip) +
      // 眼睛
      '<ellipse cx="74" cy="92" rx="9" ry="11" fill="' + (art.eye || "#5B4632") + '"/>' +
      '<ellipse cx="126" cy="92" rx="9" ry="11" fill="' + (art.eye || "#5B4632") + '"/>' +
      '<circle cx="77" cy="88" r="3" fill="#fff"/>' +
      '<circle cx="129" cy="88" r="3" fill="#fff"/>' +
      // 腮紅
      '<ellipse cx="58" cy="112" rx="10" ry="6" fill="#F2B8A8" opacity="0.55"/>' +
      '<ellipse cx="142" cy="112" rx="10" ry="6" fill="#F2B8A8" opacity="0.55"/>' +
      // 鼻子與嘴巴 (ω)
      '<path d="M94 108 L106 108 L100 116 Z" fill="#E08B75"/>' +
      '<path d="M100 116 Q100 124 90 124 M100 116 Q100 124 110 124" stroke="#8A6A4D" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      // 鬍鬚
      '<path d="M40 104 L14 100 M40 112 L16 116" stroke="#B99B78" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M160 104 L186 100 M160 112 L184 116" stroke="#B99B78" stroke-width="2.5" stroke-linecap="round"/>' +
      "</svg>"
    );
  };

  // 首頁 logo 用的預設小貓
  window.defaultCatArt = { base: "#F6A94A", ear: "normal", pattern: "stripes", p1: "#E08A2E", eye: "#5B4632" };
})();

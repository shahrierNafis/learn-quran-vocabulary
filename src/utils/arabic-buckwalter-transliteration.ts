// Arabic to Buckwalter translation mapping based on QAC website
// http://corpus.quran.com/java/buckwalter.jsp

const BUCKWALTER_EXTENDED_MAP: { [key: number]: string } = {
  1569: "'",
  1571: ">",
  1572: "&",
  1573: "<",
  1574: "}",
  1575: "A",
  1576: "b",
  1577: "p",
  1578: "t",
  1579: "v",
  1580: "j",
  1581: "H",
  1582: "x",
  1583: "d",
  1584: "*",
  1585: "r",
  1586: "z",
  1587: "s",
  1588: "$",
  1589: "S",
  1590: "D",
  1591: "T",
  1592: "Z",
  1593: "E",
  1594: "g",
  1600: "_",
  1601: "f",
  1602: "q",
  1603: "k",
  1604: "l",
  1605: "m",
  1606: "n",
  1607: "h",
  1608: "w",
  1609: "Y",
  1610: "y",
  1611: "F",
  1612: "N",
  1613: "K",
  1614: "a",
  1615: "u",
  1616: "i",
  1617: "~",
  1618: "o",
  1619: "^",
  1620: "#",
  1648: "`",
  1649: "{",
  1756: ":",
  1759: "@",
  1760: '"',
  1762: "[",
  1763: ";",
  1765: ",",
  1766: ".",
  1768: "!",
  1770: "-",
  1771: "+",
  1772: "%",
  1773: "]",
};

// Reverse lookup map for Buckwalter to Arabic conversion
const BUCKWALTER_REVERSE_MAP = Object.fromEntries(
  Object.entries(BUCKWALTER_EXTENDED_MAP).map(([k, v]) => [v, parseInt(k)])
);

/**
 * Converts Arabic text to Buckwalter transliteration
 * @param {string} arabicStr - The Arabic string to convert
 * @returns {string} The Buckwalter transliteration
 * @throws {Error} If the input contains invalid characters
 */
export function arabicToBuckwalter(arabicStr?: string): string {
  let buckwalterStr = "";
  if (!arabicStr) return "";

  for (let char of arabicStr) {
    const codePoint = char.codePointAt(0);

    // Skip space and number 2
    if (char === " " || char === "2") {
      buckwalterStr += char;
      continue;
    }

    // Check if character is valid
    if (!codePoint || !BUCKWALTER_EXTENDED_MAP[codePoint]) {
      continue;
    }

    buckwalterStr += BUCKWALTER_EXTENDED_MAP[codePoint];
  }

  return buckwalterStr;
}

/**
 * Converts Buckwalter transliteration back to Arabic text
 * @param {string} transliteratedStr - The Buckwalter transliterated string
 * @returns {string} The Arabic text
 * @throws {Error} If the input is not valid Buckwalter transliteration
 */
export function buckwalterToArabic(
  transliteratedStr?: string,
  hasMoreL?: boolean,
  hasMoreR?: boolean
): string {
  if (!transliteratedStr) return "";
  let arabicStr = "";
  let i = 0;
  while (i < transliteratedStr.length) {
    const char = transliteratedStr[i];

    // // Handle ' character with specific rules
    // if (char === "'") {
    //   if (
    //     (!hasMoreL &&
    //       (i === transliteratedStr.length - 1 ||
    //         i === transliteratedStr.length - 2)) ||
    //     (!hasMoreR && (i == 0 || i == 1))
    //   ) {
    //     arabicStr += String.fromCodePoint(1569); // 'ء'
    //   } else {
    //     arabicStr += "ـٰ";
    //   }
    //   i++;
    //   continue;
    // }

    // Skip space and number 2
    if (char === " " || char === "2") {
      arabicStr += char;
      i++;
      continue;
    }

    // Check if character is valid Buckwalter
    if (!BUCKWALTER_REVERSE_MAP[char]) {
      throw new Error(
        `Input string is not pure Buckwalter transliteration! [${char}]`
      );
    }

    // Convert the code point to a Unicode character
    arabicStr += String.fromCodePoint(BUCKWALTER_REVERSE_MAP[char]);
    i++;
  }

  return arabicStr;
}

// Example usage:
// console.log(buckwalterToArabic("ha'^&ulaA^'i")); // Should output: هَـٰٓؤُلَآءِ
// const arabic = 'السَّلامُ عَلَيْكُم';
// const buckwalter = arabicToBuckwalter(arabic);
// console.log(buckwalter);
// const backToArabic = buckwalterToArabic(buckwalter);
// console.log(backToArabic);

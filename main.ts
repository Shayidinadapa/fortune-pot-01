// fortune-pot-01: writes one kind, funny fortune for a houseplant to /output/entry.txt
// Gate: UTF-8 text, 1-120 characters, single line, not only whitespace.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FORTUNE =
  "This week a sunbeam will find your newest leaf, and your keeper will tell everyone it was all their doing.";

function validate(text: string): void {
  if (text.length < 1 || text.length > 120) {
    throw new Error(`entry must be 1-120 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("entry must have no leading or trailing whitespace");
  }
  for (const ch of text) {
    if (ch.charCodeAt(0) < 0x20) {
      throw new Error("entry must not contain control characters");
    }
  }
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");

validate(FORTUNE);
writeFileSync(outPath, FORTUNE, "utf8");

// Read back and verify byte-for-byte.
const back = readFileSync(outPath, "utf8");
if (back !== FORTUNE) {
  throw new Error("entry.txt read-back mismatch");
}
validate(back);
console.log(`wrote ${outPath} (${FORTUNE.length} chars)`);

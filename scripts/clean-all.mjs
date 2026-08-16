import { readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir, removed) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".turbo") {
      const target = join(dir, entry);
      rmSync(target, { recursive: true, force: true });
      removed.push(target);
      continue;
    }
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, removed);
    }
  }
}

const removed = [];
walk(process.cwd(), removed);
for (const path of removed) {
  console.log(`removed ${path}`);
}
console.log(`cleaned ${removed.length} directories`);

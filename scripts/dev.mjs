// Runs `turbo run dev` (extra args are passed through, e.g. --filter=web)
// and opens the store in the browser as soon as it responds.
// Set NO_OPEN=1 to skip opening the browser.
import { spawn } from "node:child_process";

const STORE_URL = "http://localhost:3000";

const turbo = spawn(["turbo run dev", ...process.argv.slice(2)].join(" "), {
  stdio: "inherit",
  shell: true,
});
turbo.on("exit", (code) => process.exit(code ?? 0));

const openCommand = {
  darwin: `open ${STORE_URL}`,
  win32: `start "" ${STORE_URL}`,
}[process.platform] ?? `xdg-open ${STORE_URL}`;

async function openWhenReady() {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    try {
      await fetch(STORE_URL);
      spawn(openCommand, { shell: true, stdio: "ignore" });
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}

if (!process.env.NO_OPEN) openWhenReady();

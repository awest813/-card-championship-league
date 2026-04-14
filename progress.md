Original prompt: work on v2

- 2026-04-13: Began live v2 test loop using the develop-web-game workflow.
- 2026-04-13: Goal for this pass is to verify deck selection, battle UI readability updates, and post-battle story continuation in a real browser session.
- TODO: Launch local server, run Playwright interaction pass, inspect screenshots, and fix the first runtime issue found.
- 2026-04-13: Installed local Playwright dependency so the live browser test can run from this workspace.
- 2026-04-13: Chromium browser binary installed for Playwright-driven live testing.
- 2026-04-13: Ran the develop-web-game Playwright client against the main menu and captured screenshots under output/web-game.
- 2026-04-13: Live test exposed a MutationObserver prompt-sync loop in js/main.js; patched renderDeckStatus to avoid rewriting unchanged DOM state.
- 2026-04-13: Re-ran the live browser flow after the observer fix; successfully reached the battle prompt, changed to Starter Tide, and opened the duel overlay.
- 2026-04-13: Replaced inline prompt onclick handlers with delegated document click handling because Monogatari CSP blocks inline event handlers in live runs.
- 2026-04-13: Deck selection still launched Starter Blaze in live play, so the bridge now caches preferredDeckId locally instead of relying on an immediate storage readback.
- 2026-04-13: Final live rerun confirmed Starter Tide now propagates into battle launch; energy selector reflects water/wind instead of fire/electric.
- 2026-04-13: Updated index.html CSP to allow blob: script/worker sources because Monogatari generates AudioWorklet modules from Blob URLs at runtime.
- 2026-04-13: Audio worklet retest passed after the CSP update; the prior bitcrusher/envelope-follower console errors no longer reproduced in the live browser flow.

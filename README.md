# GeoffOS

Personal operations dashboard. Installable web app (PWA), backed by a Google
Sheet via Google Apps Script.

**Live:** https://geoff-os.github.io/geoffos/

---

## What's here

| File | Purpose |
|---|---|
| `index.html` | The entire app — markup, styles, logic. No build step. |
| `sw.js` | Service worker. App-shell cache so it opens offline. |
| `manifest.webmanifest` | Makes it installable to the home screen. |
| `icon-192.png` / `icon-512.png` | App icons. |

The backend is **not** in this repo. It lives as an Apps Script bound to the
"GeoffOS Enquiry Register" sheet. See `GeoffOS_Backend.gs` in local notes.

## Nothing secret is in this repository

No credentials, no client data, no messages. The Apps Script URL and its token
are entered once on the device and stored in that browser's `localStorage`.
That's why a public repo is safe here — and why the token, not repo visibility,
is what actually protects the data.

**Never commit the Apps Script URL, the token, or an API key to this repo.**

## Phase 1 — what works

- **Triage** — Instagram enquiries from the sheet. Read their last message,
  edit the suggested reply, approve it or ask for a redraft.
- **Inbox** — unread Gmail threads from the last 7 days, read-only.
- **Voice** — push to talk. Commands: brief, sync, triage, inbox, home,
  high priority. Pattern matching, not conversation.
- **Offline** — approvals queue locally and push when signal returns.
- **Daylight mode** — CFG screen. Drops the glass blur and glow; readable in
  sun, and easier on the battery.

## Important: approving is not sending

This app cannot send Instagram DMs — no usable API exists for personal DMs, and
a web page can't drive a browser. Approving writes to `Approved Reply` and puts
the enquiry in the **Ready to send** bucket. Actual sending happens in a
separate Claude session driving Instagram through Chrome, which then owns
`Status` and `Sent`.

## Making a change

1. Edit the file here on GitHub (pencil icon) or upload a new version
2. Commit
3. Bump `VERSION` in `sw.js` — otherwise phones keep serving the cached old copy
4. Wait ~1 minute for Pages to rebuild, then reopen the app

Step 3 is the one that catches you out.

## Backend changes

After editing the Apps Script, you must **Deploy → Manage deployments → Edit →
Version: New version**. Saving alone does not update the live URL.

## Not built yet

Tasks, Bills, Habits, and Shared appear as "module offline" placeholders.
Next up: shared household calendar, notes and reminders, with a daily email
digest.

# 🛰️ ORBITAL SENTINEL
### Global Crisis Monitoring Platform · Low Earth Orbit

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Leaflet](https://img.shields.io/badge/Leaflet.js-199900?style=flat-square&logo=leaflet&logoColor=white)
![Version](https://img.shields.io/badge/version-1.0-00e5ff?style=flat-square)

> A browser-based global crisis monitoring application that simulates real-time surveillance of Earth from low orbit. Track active war zones, typhoon systems, and seismic events — and deploy orbital strikes — all from a space-operator HUD.

---

## 📁 File Structure

```
orbital-sentinel/
├── index.html    — App markup: auth screen, HUD, map, panels, console
├── style.css     — All styling: auth, topbar, map, panels, animations
└── script.js     — All logic: auth, map, GeoJSON, wars, storms, quakes, audio
```

No build step. No package manager. No server required.

---

## 🚀 How to Run

**Option A — Open directly in browser**

Place all three files in the same folder and open `index.html` in Chrome or Firefox.

**Option B — Local dev server (avoids CORS on GeoJSON fetch)**

```bash
npx serve .
# then visit http://localhost:3000
```

**Option C — VS Code Live Server**

Right-click `index.html` → *Open with Live Server*

---

## 🔐 Getting Started

### 1. Create an Account
- Click **Register Operator** on the login screen
- Enter any username (minimum 3 characters)
- Password must be exactly: `password123`
- Confirm and click **CREATE ACCOUNT**

### 2. Log In
- Enter your username and password
- Press `Enter` or click **AUTHENTICATE**
- Your callsign appears in the top-right of the nav bar

### 3. Monitor the Map
- 🔴 **Red pulsing countries** → active war zones, click for details
- 🌀 **Spinning storm markers** → typhoon systems, click for category info
- 🌋 **Shaking markers** → earthquakes, click for magnitude + devastation data
- Zoom in to **level 3+** to see country name labels

### 4. Use the Strike Console (bottom bar)
| Button | Action |
|---|---|
| `🌀 SIMULATE TYPHOON` | Spawn a new storm system in the ocean |
| `🌋 SIMULATE QUAKE` | Trigger a seismic event at a fault zone |
| `☄ ORBITAL STRIKE MODE` | Arm/disarm — then click a country to fire |

### 5. Check Alerts
- Watch the 🔔 bell icon in the top-right nav for a red badge
- Click the bell to open the alert feed — newest on top
- Click **CLEAR ALL** to dismiss all alerts

---

## ✨ Features

### 🔐 Authentication
- Login / Signup with session-scoped account storage
- Password enforced as `password123`
- Animated satellite logo with orbiting planet on the login screen

### 🗺️ World Map
- Full-screen [Leaflet.js](https://leafletjs.com/) map with OpenStreetMap tiles
- Dark sci-fi tile filter (CSS invert + hue-rotate)
- No black gaps — horizontal world wrapping enabled
- Free zoom: scroll wheel, pinch-to-zoom, double-click
- Country name labels appear at zoom ≥ 3

### ⚔️ War Zone Monitoring (12 active conflicts)

| Level | Countries |
|---|---|
| 🔴 CRITICAL | Ukraine, Gaza/Palestine |
| 🟠 HIGH | Sudan, Somalia, Syria, Myanmar |
| 🟡 MED | Yemen, Ethiopia, DR Congo, Mali |
| 🟢 LOW | Iraq, Afghanistan |

- War countries pulse red on the map
- Bouncing ⚔️ marker at each conflict's coordinates
- Detail panel: threat level bar, situation report, coordinates

### 🌀 Typhoon System (Saffir-Simpson Scale)

| Category | Label | Wind Speed | Risk |
|---|---|---|---|
| TD | Tropical Depression | 0–62 km/h | Minimal |
| TS | Tropical Storm | 63–118 km/h | Moderate |
| CAT 1 | Category 1 | 119–153 km/h | Low–Moderate |
| CAT 2 | Category 2 | 154–177 km/h | Moderate |
| CAT 3 | Category 3 | 178–208 km/h | Severe ⚠️ |
| CAT 4 | Category 4 | 209–251 km/h | Extreme ⚠️ |
| CAT 5 | **Super Typhoon** | 252+ km/h | **CATASTROPHIC** 🚨 |

- Storms auto-spawn in ocean zones and drift across the map
- CAT 3+ triggers an alert in the nav bell
- Detail panel: wind speed bar, devastation assessment, affected radius, tsunami risk

### 🌋 Earthquake System (Richter Scale)

| Magnitude | Level | Damage |
|---|---|---|
| M < 4.0 | MINOR | No structural damage |
| M 4.0–5.0 | MODERATE | Minor cracks in walls |
| M 5.0–6.0 | STRONG | Moderate structural damage |
| M 6.0–7.0 | MAJOR | Serious damage + casualties ⚠️ |
| M 7.0–8.0 | GREAT | Mass destruction + tsunami risk 🚨 |
| M 8.0+ | MEGA | **CATASTROPHIC — National emergency** 🚨 |

- Spawns at 10 real fault zones (Pacific Ring of Fire, San Andreas, Anatolian, etc.)
- Ripple circles show epicenter and affected radius
- M6.0+ triggers an alert
- Events auto-expire after 50 seconds

### ☄️ Orbital Strike Mode
- Toggle **ARMED** in the console bar
- Click any country → explosion FX + boom sound + strike confirmation
- Struck country fades to ash color on the map
- Strike is logged in the alert feed

### 🔔 Alert Feed (Nav Bell — no blocking popups)
- All alerts queue silently in the 🔔 bell icon
- Red badge counter with pop animation on new alerts
- Bell shakes when there are unread alerts
- Dropdown feed: icon, title, level badge, description, timestamp
- **CLEAR ALL** to dismiss; closes on click-outside

### 🔊 Sound Effects (Web Audio API — no files needed)
| Sound | Trigger |
|---|---|
| 💥 Boom | Every map click + orbital strike |
| ⚡ Zap | Storm neutralization |
| 🌋 Rumble | Earthquake spawn |

Toggle with the 🔊 button in the nav bar.

---

## 🎮 Controls Reference

| Control | Action |
|---|---|
| Scroll wheel / Pinch | Zoom in and out |
| Click + drag | Pan the map |
| Click country | Name + conflict status popup |
| Click ⚔️ icon | Open war zone detail panel |
| Click 🌀 storm | Open typhoon detail panel |
| Click 🌋 quake | Open earthquake detail panel |
| `📋 EVENTS` button | Toggle left-side events list |
| `🔔` Bell | Open/close alert feed |
| `🔊` Sound | Toggle audio on/off |
| `⏏ LOGOUT` | Return to login screen |

---

## 🛠️ Tech Stack

| Dependency | Version | Purpose |
|---|---|---|
| [Leaflet.js](https://leafletjs.com/) | 1.9.4 | Map rendering, GeoJSON, markers |
| OpenStreetMap | Live CDN | Base tile layer |
| [geo-countries](https://github.com/datasets/geo-countries) | GitHub CDN | Real country polygons (Natural Earth) |
| Exo 2 | Google Fonts | HUD display headings |
| JetBrains Mono | Google Fonts | Code-style body text |
| Web Audio API | Browser native | Synthesized sound effects |

---

## ⚠️ Known Limitations

- **Accounts reset on refresh** — stored in memory only, no backend or `localStorage`
- **Data is simulated** — not connected to live APIs; does not reflect real-time conditions
- **Country labels** only show at zoom level ≥ 3
- **Audio may be muted** on first load in some browsers (Web Audio autoplay policy requires a user gesture first)
- **Offline fallback** — if the GeoJSON CDN is unreachable, a built-in dataset of ~35 countries is used automatically

---

## 📄 License

Built as a creative web application project. All crisis data is fictional and for simulation/educational purposes only.

---

*ORBITAL SENTINEL · Global Crisis Monitoring Platform · v1.0*  
*Stack: HTML5 · CSS3 · Vanilla JS · Leaflet.js · Web Audio API*

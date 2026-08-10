/**
 * API Search Hub - Core Application Logic
 * Implements: Local Fuzzy Matching, Encrypted BYOK (AES-256), OpenRouter AI Integrations,
 * Multimodal OCR (Baidu Unlimited-OCR Simulation), Agent-Reach Search Terminal, and DevTools Shield.
 */

// ==========================================
// 1. FREE APIS LOCAL DATABASE
// ==========================================
const FREE_APIS_DATABASE = [
  // --- GEO & MAPS ---
  {
    name: "OpenStreetMap Nominatim",
    category: "geo",
    description: "Reverse geocoding and search of OpenStreetMap data. Search for addresses, cities, countries, and zip codes.",
    auth: "None",
    base_url: "https://nominatim.openstreetmap.org",
    homepage: "https://nominatim.org",
    snippet_js: `fetch('https://nominatim.openstreetmap.org/search?q=Paris&format=json')\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    snippet_curl: `curl "https://nominatim.openstreetmap.org/search?q=Paris&format=json"`
  },
  {
    name: "IP-API",
    category: "geo",
    description: "Geolocate any IP address with high accuracy. Returns country, region, city, zip, lat/lon, ISP, and timezone.",
    auth: "None",
    base_url: "http://ip-api.com/json",
    homepage: "https://ip-api.com",
    snippet_js: `fetch('http://ip-api.com/json/24.48.0.1')\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    snippet_curl: `curl "http://ip-api.com/json/24.48.0.1"`
  },
  {
    name: "Zippopotam.us",
    category: "geo",
    description: "Postal code geocoding API. Retrieve city, state, latitude, and longitude from zip codes for over 60 countries.",
    auth: "None",
    base_url: "http://api.zippopotam.us",
    homepage: "http://www.zippopotam.us",
    snippet_js: `fetch('http://api.zippopotam.us/us/90210')\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    snippet_curl: `curl "http://api.zippopotam.us/us/90210"`
  },
  {
    name: "Country Layer API",
    category: "geo",
    description: "Retrieve comprehensive details about countries, including names, ISO codes, currencies, languages, and calling codes.",
    auth: "Free API Key Required",
    base_url: "http://api.countrylayer.com/v2",
    homepage: "https://countrylayer.com",
    snippet_js: `fetch('http://api.countrylayer.com/v2/all?access_key=YOUR_FREE_KEY')\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    snippet_curl: `curl "http://api.countrylayer.com/v2/all?access_key=YOUR_FREE_KEY"`
  },

  // --- WEATHER & CLIMATE ---
  {
    name: "Open-Meteo API",
    category: "weather",
    description: "Free, high-resolution weather API without any API keys. Pull current conditions, hourly forecasts, and historical climate datasets.",
    auth: "None",
    base_url: "https://api.open-meteo.com/v1",
    homepage: "https://open-meteo.com",
    snippet_js: `fetch('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true')\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    snippet_curl: `curl "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true"`
  },
  {
    name: "wttr.in",
    category: "weather",
    description: "Console-oriented weather forecast API. Perfect for CLI scripts, returning beautiful ANSI outputs or raw JSON parameters.",
    auth: "None",
    base_url: "https://wttr.in",
    homepage: "https://github.com/chubin/wttr.in",
    snippet_js: `fetch('https://wttr.in/London?format=j1')\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    snippet_curl: `curl "https://wttr.in/London?format=3"`
  },
  {
    name: "National Weather Service (NWS)",
    category: "weather",
    description: "US Government official meteorological API. Get localized weather observations, radars, forecasts, and active emergency alerts.",
    auth: "User-Agent Header Required",
    base_url: "https://api.weather.gov",
    homepage: "https://www.weather.gov/documentation/services-web-api",
    snippet_js: `fetch('https://api.weather.gov/points/39.7456,-97.0892', { headers: { 'User-Agent': 'my-weather-app' } })\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    snippet_curl: `curl -H "User-Agent: (my-weather-app)" "https://api.weather.gov/points/39.7456,-97.0892"`
  },

  // --- IMAGES & VIDEO ---
  {
    name: "Unsplash API",
    category: "media",
    description: "Access the internet's largest source of freely-usable, ultra-high resolution images. Full keyword search, statistics, and random filters.",
    auth: "Free Developer Client ID",
    base_url: "https://api.unsplash.com",
    homepage: "https://unsplash.com/developers",
    snippet_js: `fetch('https://api.unsplash.com/photos/random', { headers: { 'Authorization': 'Client-ID YOUR_ACCESS_KEY' } })\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    snippet_curl: `curl -H "Authorization: Client-ID YOUR_ACCESS_KEY" "https://api.unsplash.com/photos/random"`
  },
  {
    name: "The Dog API",
    category: "media",
    description: "Generate random cute dog pictures, browse through hundreds of canine breeds, retrieve breed characteristics, heights, weights, and life spans.",
    auth: "None / Optional Free Key",
    base_url: "https://api.thedogapi.com/v1",
    homepage: "https://thedogapi.com",
    snippet_js: `fetch('https://api.thedogapi.com/v1/images/search')\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    snippet_curl: `curl "https://api.thedogapi.com/v1/images/search"`
  },
  {
    name: "The Cat API",
    category: "media",
    description: "Cat pictures as a service. Search, filter, and download random cat photos, query cat breeds and metadata coordinates.",
    auth: "None / Optional Free Key",
    base_url: "https://api.thecatapi.com/v1",
    homepage: "https://thecatapi.com",
    snippet_js: `fetch('https://api.thecatapi.com/v1/images/search')\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    snippet_curl: `curl "https://api.thecatapi.com/v1/images/search"`
  },
  {
    name: "Robohash API",
    category: "media",
    description: "Generates unique, gorgeous, and matching robot, monster, or kitten avatars instantly from any text string.",
    auth: "None",
    base_url: "https://robohash.org",
    homepage: "https://robohash.org",
    snippet_js: `// Returns an image link directly!\nconst robotUrl = 'https://robohash.org/your_text_here.png';`,
    snippet_curl: `curl -O "https://robohash.org/your_text_here.png"`
  },
  {
    name: "Placeholder.co",
    category: "media",
    description: "Generate responsive mock placeholder images of any width, height, background color, text, and file formats.",
    auth: "None",
    base_url: "https://via.placeholder.com",
    homepage: "https://placeholder.com",
    snippet_js: `// Directly references image assets:\nconst imageSrc = 'https://via.placeholder.com/350x150';`,
    snippet_curl: `curl -O "https://via.placeholder.com/350x150.png"`
  },

  // --- FINANCE & CRYPTO ---
  {
    name: "CoinGecko API",
    category: "finance",
    description: "Most robust free crypto data platform. Query live coin prices, volumes, tickers, historical metrics, and exchange guides.",
    auth: "None / Free Demo Key",
    base_url: "https://api.coingecko.com/api/v3",
    homepage: "https://www.coingecko.com/en/api",
    snippet_js: `fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    snippet_curl: `curl "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"`
  },
  {
    name: "Exchangerate.host",
    category: "finance",
    description: "Free foreign exchange and crypto conversion rates API. Supports over 170 currencies with historical query lookups.",
    auth: "None / Optional Free Key",
    base_url: "https://api.exchangerate.host",
    homepage: "https://exchangerate.host",
    snippet_js: `fetch('https://api.exchangerate.host/latest?base=USD')\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    snippet_curl: `curl "https://api.exchangerate.host/latest?base=USD"`
  },
  {
    name: "Frankfurter API",
    category: "finance",
    description: "An elegant, lightweight, and completely free currency exchange rate API compiled by the European Central Bank.",
    auth: "None",
    base_url: "https://api.frankfurter.app",
    homepage: "https://www.frankfurter.app",
    snippet_js: `fetch('https://api.frankfurter.app/latest?from=USD&to=EUR')\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    snippet_curl: `curl "https://api.frankfurter.app/latest?from=USD&to=EUR"`
  },

  // --- PUBLIC DATA & UTILITIES ---
  {
    name: "Open Library API",
    category: "data",
    description: "Complete library database containing cataloged books, authors, subjects, jackets, and digital text scans. Fully open, no rate-limits.",
    auth: "None",
    base_url: "https://openlibrary.org/api",
    homepage: "https://openlibrary.org/dev/docs/api",
    snippet_js: `fetch('https://openlibrary.org/api/books?bibkeys=ISBN:0451526538&format=json&jscmd=data')\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    snippet_curl: `curl "https://openlibrary.org/api/books?bibkeys=ISBN:0451526538&format=json&jscmd=data"`
  },
  {
    name: "REST Countries",
    category: "data",
    description: "Get beautiful structured country info (capitals, calling codes, flags, populations) with full REST access routes.",
    auth: "None",
    base_url: "https://restcountries.com/v3.1",
    homepage: "https://restcountries.com",
    snippet_js: `fetch('https://restcountries.com/v3.1/name/france')\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    snippet_curl: `curl "https://restcountries.com/v3.1/name/france"`
  },
  {
    name: "JSONPlaceholder",
    category: "tools",
    description: "Mock REST API for testing and prototyping. Provides post, comment, photo, album, todo, and user endpoints with fully mocked databases.",
    auth: "None",
    base_url: "https://jsonplaceholder.typicode.com",
    homepage: "https://jsonplaceholder.typicode.com",
    snippet_js: `fetch('https://jsonplaceholder.typicode.com/posts/1')\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    snippet_curl: `curl "https://jsonplaceholder.typicode.com/posts/1"`
  },
  {
    name: "Httpbin.org",
    category: "tools",
    description: "A super functional HTTP request & response service. Test custom headers, cookies, redirects, and content responses.",
    auth: "None",
    base_url: "https://httpbin.org",
    homepage: "https://httpbin.org",
    snippet_js: `fetch('https://httpbin.org/get')\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    snippet_curl: `curl "https://httpbin.org/get"`
  },
  {
    name: "Universities List API",
    category: "data",
    description: "Search and retrieve a comprehensive database of worldwide universities, including domains, homepages, names, and country zones.",
    auth: "None",
    base_url: "http://universities.hipolabs.com",
    homepage: "https://github.com/Hipo/university-domains-list",
    snippet_js: `fetch('http://universities.hipolabs.com/search?country=France')\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    snippet_curl: `curl "http://universities.hipolabs.com/search?country=France"`
  },
  {
    name: "RandomUser Generator",
    category: "tools",
    description: "Generate fully fleshed-out mock user profile assets (names, addresses, high-res photos, passwords, phone numbers) in JSON format.",
    auth: "None",
    base_url: "https://randomuser.me/api",
    homepage: "https://randomuser.me",
    snippet_js: `fetch('https://randomuser.me/api/')\n  .then(res => res.json())\n  .then(data => console.log(data));`,
    snippet_curl: `curl "https://randomuser.me/api/"`
  }
];


// ==========================================
// 2. STATE AND VAULT KEY MANAGEMENT
// ==========================================
let currentActiveTab = "tab-api";
let systemLogsArray = [];

// DOM Elements
const sidebarTabs = document.querySelectorAll("[data-tab]");
const tabContents = document.querySelectorAll(".tab-content");
const problemInput = document.getElementById("problem-input");
const charCounter = document.getElementById("char-counter");
const searchLocalBtn = document.getElementById("search-local-btn");
const searchAiBtn = document.getElementById("search-ai-btn");
const apiListContainer = document.getElementById("api-list");
const localApisCountText = document.getElementById("local-apis-count");
const categoryFilter = document.getElementById("category-filter");
const aiResponseContainer = document.getElementById("ai-response-container");
const aiAdviceBody = document.getElementById("ai-advice-body");
const aiModelBadge = document.getElementById("ai-model-badge");

// Vault Elements
const byokKeyInput = document.getElementById("byok-key-input");
const byokPassphraseInput = document.getElementById("byok-passphrase-input");
const saveByokBtn = document.getElementById("save-byok-btn");
const clearByokBtn = document.getElementById("clear-byok-btn");
const vaultKeychainIndicator = document.getElementById("vault-keychain-indicator");
const vaultStatusIndicator = document.getElementById("vault-status-indicator");
const byokBadge = document.getElementById("byok-badge");
const byokBadgeText = document.getElementById("byok-badge-text");
const byokBadgeIcon = document.getElementById("byok-badge-icon");

// OCR Elements
const ocrDropzone = document.getElementById("ocr-dropzone");
const ocrFileInput = document.getElementById("ocr-file-input");
const ocrPreviewBox = document.getElementById("ocr-preview-box");
const ocrPreviewImg = document.getElementById("ocr-preview-img");
const runOcrBtn = document.getElementById("run-ocr-btn");
const ocrOutputMarkdown = document.getElementById("ocr-output-markdown");
const copyOcrBtn = document.getElementById("copy-ocr-btn");
let selectedOcrBase64 = null;

// Agent Reach Terminal Elements
const reachQueryInput = document.getElementById("reach-query-input");
const runReachBtn = document.getElementById("run-reach-btn");
const terminalBody = document.getElementById("terminal-body");
const clearTerminalBtn = document.getElementById("clear-terminal-btn");

// Security Elements
const toggleConsoleOverride = document.getElementById("toggle-console-override");
const toggleHotkeysBlock = document.getElementById("toggle-hotkeys-block");
const toggleDebuggerTrap = document.getElementById("toggle-debugger-trap");
const clearLogsBtn = document.getElementById("clear-logs-btn");
const logStreamContainer = document.getElementById("log-stream-container");
const shieldIndicator = document.getElementById("shield-indicator");
const shieldIndicatorPing = document.getElementById("shield-indicator-ping");
const shieldStatusText = document.getElementById("shield-status-text");
const securityShieldModal = document.getElementById("security-shield-modal");
const dismissShieldBtn = document.getElementById("dismiss-shield-btn");

// Set counter
localApisCountText.innerText = FREE_APIS_DATABASE.length;


// ==========================================
// 3. INTEGRATED LOGGING INTERCEPTOR (DevTools Block logic)
// ==========================================
const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug
};

function writeToSystemLogs(type, message) {
  const timestamp = new Date().toISOString().split('T')[1].substring(0, 8);
  let colorClass = "text-slate-300";
  let prefix = "[INFO]";

  if (type === "warn") {
    colorClass = "text-yellow-400";
    prefix = "[WARN]";
  } else if (type === "error") {
    colorClass = "text-red-400 font-bold";
    prefix = "[ERROR]";
  } else if (type === "debug") {
    colorClass = "text-indigo-400";
    prefix = "[DEBUG]";
  }

  // Save in local stack
  systemLogsArray.push({ timestamp, type, message });
  if (systemLogsArray.length > 500) systemLogsArray.shift();

  // Render in GUI Terminal
  if (logStreamContainer) {
    const logNode = document.createElement("p");
    logNode.className = `${colorClass} leading-relaxed select-text font-mono text-[11px]`;
    logNode.innerHTML = `<span class="text-slate-500 font-medium">${timestamp}</span> <span class="font-semibold">${prefix}</span> ${escapeHtml(message)}`;
    logStreamContainer.appendChild(logNode);
    // Auto Scroll
    logStreamContainer.scrollTop = logStreamContainer.scrollHeight;
  }
}

function escapeHtml(text) {
  if (typeof text !== "string") {
    try {
      text = JSON.stringify(text);
    } catch (e) {
      text = String(text);
    }
  }
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Global console overrides
function enableConsoleOverrides() {
  window.console.log = function(...args) {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
    originalConsole.log.apply(console, args);
    writeToSystemLogs("log", msg);
  };
  window.console.info = function(...args) {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
    originalConsole.info.apply(console, args);
    writeToSystemLogs("info", msg);
  };
  window.console.warn = function(...args) {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
    originalConsole.warn.apply(console, args);
    writeToSystemLogs("warn", msg);
  };
  window.console.error = function(...args) {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
    originalConsole.error.apply(console, args);
    writeToSystemLogs("error", msg);
  };
}

function disableConsoleOverrides() {
  window.console.log = originalConsole.log;
  window.console.info = originalConsole.info;
  window.console.warn = originalConsole.warn;
  window.console.error = originalConsole.error;
}


// ==========================================
// 4. CONSOLE ACCESS SHIELD CONTROLLERS & TRAPS
// ==========================================
let devtoolsTrappingActive = true;
let consoleTrappingInterval = null;

function runDevtoolsDebuggerLoop() {
  if (consoleTrappingInterval) clearInterval(consoleTrappingInterval);

  consoleTrappingInterval = setInterval(() => {
    if (devtoolsTrappingActive) {
      const startTime = performance.now();
      // Recursive debugger loop that freezes inspection
      (function() {
        (function a() {
          try {
            (function b(i) {
              if (("" + i / i).length !== 1 || i % 20 === 0) {
                (function() {}).constructor("debugger")();
              } else {
                debugger;
              }
              b(++i);
            })(0);
          } catch (e) {}
        })();
      })();

      const endTime = performance.now();
      if (endTime - startTime > 100) {
        // Devtools opened! Trigger shield alert.
        console.warn("Devtools console opening sequence intercepted.");
        triggerSecurityShieldModal();
      }
    }
  }, 1200);
}

function stopDevtoolsDebuggerLoop() {
  if (consoleTrappingInterval) {
    clearInterval(consoleTrappingInterval);
    consoleTrappingInterval = null;
  }
}

function triggerSecurityShieldModal() {
  if (securityShieldModal) {
    securityShieldModal.classList.remove("hidden");
  }
}

function dismissSecurityShieldModal() {
  if (securityShieldModal) {
    securityShieldModal.classList.add("hidden");
    console.log("Shield dismissed. Returning to active workspace.");
  }
}

// Keys & mouse right click interceptor
function enableHotkeysBlock() {
  window.addEventListener("contextmenu", preventDefaultAction);
  window.addEventListener("keydown", preventDevtoolsKeys);
}

function disableHotkeysBlock() {
  window.removeEventListener("contextmenu", preventDefaultAction);
  window.removeEventListener("keydown", preventDevtoolsKeys);
}

function preventDefaultAction(e) {
  e.preventDefault();
  console.warn("Right-click context menu is locked by security protocol.");
}

function preventDevtoolsKeys(e) {
  // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
  if (
    e.keyCode === 123 || // F12
    (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || // Ctrl+Shift+I/J/C
    (e.ctrlKey && e.keyCode === 85) // Ctrl+U
  ) {
    e.preventDefault();
    console.warn("Inspector shortcut blocked by active Security Shield.");
    triggerSecurityShieldModal();
  }
}


// ==========================================
// 5. AES-256 VAULT ENCRYPTION & DECRYPTION (BYOK)
// ==========================================
const VAULT_STORAGE_KEY = "aes_encrypted_byok_vault";
const VAULT_METADATA_KEY = "aes_vault_configured";

function saveEncryptedKey(rawKey, passphrase) {
  try {
    if (!rawKey.startsWith("sk-")) {
      alert("Error: API Key must be formatted as an OpenRouter key starting with 'sk-'");
      return false;
    }
    if (passphrase.length < 4) {
      alert("Error: Please provide a decryption password of at least 4 characters to secure the key.");
      return false;
    }

    // Encrypt rawKey using AES-256
    const encrypted = CryptoJS.AES.encrypt(rawKey, passphrase).toString();

    // Store ciphertext in localStorage
    localStorage.setItem(VAULT_STORAGE_KEY, encrypted);
    localStorage.setItem(VAULT_METADATA_KEY, "true");

    updateVaultUI();
    console.log("Vault secure. Local API key successfully encrypted with AES-256 and saved.");
    return true;
  } catch (error) {
    console.error("Encryption failure: " + error.message);
    alert("Encryption failed. Please try a different passphrase.");
    return false;
  }
}

function getDecryptedKey(passphrase) {
  try {
    const encrypted = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!encrypted) return null;

    if (!passphrase) {
      console.warn("Decryption attempted without password.");
      return null;
    }

    const decryptedBytes = CryptoJS.AES.decrypt(encrypted, passphrase);
    const rawKey = decryptedBytes.toString(CryptoJS.enc.Utf8);

    if (!rawKey || !rawKey.startsWith("sk-")) {
      console.error("AES-256 Decryption failure. Bad Passphrase provided.");
      return null;
    }

    return rawKey;
  } catch (error) {
    console.error("AES Decryption exception: " + error.message);
    return null;
  }
}

function wipeVault() {
  localStorage.removeItem(VAULT_STORAGE_KEY);
  localStorage.removeItem(VAULT_METADATA_KEY);
  byokKeyInput.value = "";
  byokPassphraseInput.value = "";
  updateVaultUI();
  console.warn("Vault wiped. All encrypted API keys have been fully deleted from client browser storage.");
  alert("Key Vault has been fully cleared.");
}

function updateVaultUI() {
  const isConfigured = localStorage.getItem(VAULT_METADATA_KEY) === "true";

  if (isConfigured) {
    vaultKeychainIndicator.innerText = "YES (AES-256)";
    vaultKeychainIndicator.className = "text-emerald-400 text-right font-bold";
    vaultStatusIndicator.innerText = "Secured & Locked";
    vaultStatusIndicator.className = "text-emerald-400 text-right font-semibold";

    byokBadge.className = "flex items-center gap-2 px-3 py-1.5 bg-emerald-950/40 rounded-lg border border-emerald-500/30 cursor-pointer hover:bg-emerald-950 transition";
    byokBadgeText.innerText = "BYOK: Active & Vaulted";
    byokBadgeText.className = "font-mono text-emerald-400 font-medium";
    byokBadgeIcon.className = "fa-solid fa-vault text-emerald-400";
  } else {
    vaultKeychainIndicator.innerText = "No";
    vaultKeychainIndicator.className = "text-slate-400 text-right";
    vaultStatusIndicator.innerText = "Unconfigured";
    vaultStatusIndicator.className = "text-yellow-500 text-right";

    byokBadge.className = "flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-800 transition";
    byokBadgeText.innerText = "BYOK: Local Only";
    byokBadgeText.className = "font-mono text-slate-300 font-medium";
    byokBadgeIcon.className = "fa-solid fa-key text-amber-500";
  }
}


// ==========================================
// 6. LOCAL FUZZY API MATCHING SEQUENCE
// ==========================================
function searchLocalApis(problemText, category = "all") {
  if (!problemText || problemText.trim().length === 0) {
    renderApiCards(FREE_APIS_DATABASE, category);
    return;
  }

  const queryTokens = problemText.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 2); // Ignore short words like "to", "and", "a"

  if (queryTokens.length === 0) {
    renderApiCards(FREE_APIS_DATABASE, category);
    return;
  }

  console.log(`Matching local APIs. Tokenized query: ${JSON.stringify(queryTokens)}`);

  // Simple keyword scoring algorithm
  const scoredApis = FREE_APIS_DATABASE.map(api => {
    let score = 0;
    const nameLower = api.name.toLowerCase();
    const descLower = api.description.toLowerCase();
    const catLower = api.category.toLowerCase();

    queryTokens.forEach(token => {
      // Direct matches
      if (nameLower.includes(token)) score += 15;
      if (descLower.includes(token)) score += 5;
      if (catLower.includes(token)) score += 10;

      // Semantic expansions (maps common user words to technical tags)
      if (token === "weather" || token === "forecast" || token === "rain" || token === "climate" || token === "temperature") {
        if (catLower === "weather") score += 20;
      }
      if (token === "map" || token === "address" || token === "location" || token === "gps" || token === "coordinates" || token === "geo") {
        if (catLower === "geo") score += 20;
      }
      if (token === "image" || token === "picture" || token === "avatar" || token === "photo" || token === "video" || token === "dog" || token === "cat") {
        if (catLower === "media") score += 20;
      }
      if (token === "stock" || token === "crypto" || token === "price" || token === "bitcoin" || token === "exchange" || token === "convert") {
        if (catLower === "finance") score += 20;
      }
      if (token === "book" || token === "library" || token === "university" || token === "flag" || token === "country") {
        if (catLower === "data") score += 20;
      }
      if (token === "mock" || token === "test" || token === "rest" || token === "post" || token === "fake" || token === "http") {
        if (catLower === "tools") score += 20;
      }
    });

    return { ...api, matchScore: score };
  });

  // Filter out non-matching (score = 0) and sort by score
  const matches = scoredApis
    .filter(api => api.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);

  console.log(`Local match search returned ${matches.length} matches.`);
  renderApiCards(matches.length > 0 ? matches : FREE_APIS_DATABASE, category);
}

function renderApiCards(apisList, category = "all") {
  apiListContainer.innerHTML = "";

  // Filter by category
  const filtered = category === "all" ? apisList : apisList.filter(a => a.category === category);

  if (filtered.length === 0) {
    apiListContainer.innerHTML = `
      <div class="flex flex-col items-center justify-center p-12 text-center border border-slate-800 rounded-2xl bg-slate-900/10">
        <div class="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 mb-3"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <p class="text-sm font-semibold text-slate-300">No matching APIs found</p>
        <p class="text-xs text-slate-500 mt-1 max-w-sm">No local APIs match this specific category filter. Try selecting 'All Categories' or updating your search query.</p>
      </div>
    `;
    return;
  }

  filtered.forEach((api, index) => {
    const card = document.createElement("div");
    card.className = "bg-slate-900 border border-slate-800 hover:border-indigo-500/30 p-5 rounded-xl space-y-4 transition hover:shadow-lg hover:shadow-indigo-950/10 relative overflow-hidden group";

    // Tiny Match Indicator if score is present
    const scoreBadge = api.matchScore && api.matchScore > 0
      ? `<span class="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold">Match Score: ${api.matchScore}</span>`
      : "";

    let catIcon = "fa-compass";
    let catLabel = "Utility";
    if (api.category === "geo") { catIcon = "fa-earth-americas"; catLabel = "Geo & Maps"; }
    else if (api.category === "weather") { catIcon = "fa-cloud-sun"; catLabel = "Weather"; }
    else if (api.category === "media") { catIcon = "fa-image"; catLabel = "Images & Media"; }
    else if (api.category === "finance") { catIcon = "fa-coins"; catLabel = "Finance & Crypto"; }
    else if (api.category === "data") { catIcon = "fa-database"; catLabel = "Public Data"; }
    else if (api.category === "tools") { catIcon = "fa-screwdriver-wrench"; catLabel = "Dev Tools"; }

    card.innerHTML = `
      <div class="flex items-start justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 flex items-center gap-1.5">
              <i class="fa-solid ${catIcon} text-indigo-400"></i> ${catLabel}
            </span>
            ${scoreBadge}
          </div>
          <h4 class="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition">${api.name}</h4>
        </div>
        <a href="${api.homepage}" target="_blank" class="text-slate-400 hover:text-slate-100 transition p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs" title="Visit Developer Portal">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      </div>

      <p class="text-xs text-slate-300 leading-relaxed">${api.description}</p>

      <div class="grid grid-cols-2 gap-4 text-[10px] font-mono text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-850">
        <div><span class="text-slate-500">Base URL:</span> <span class="text-slate-300 select-text break-all">${api.base_url}</span></div>
        <div><span class="text-slate-500">Auth:</span> <span class="text-indigo-400 font-semibold">${api.auth}</span></div>
      </div>

      <!-- Copyable Snippets Collapsible -->
      <div class="space-y-2.5">
        <button onclick="toggleCardSnippet(${index})" class="text-[11px] font-semibold text-slate-400 hover:text-slate-200 transition flex items-center gap-1">
          <i class="fa-solid fa-code text-indigo-500"></i> Get Code Snippets <i class="fa-solid fa-chevron-down text-[9px] ml-1" id="chevron-${index}"></i>
        </button>

        <div id="snippet-panel-${index}" class="hidden space-y-2">
          <div class="space-y-1">
            <div class="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>JavaScript Fetch</span>
              <button onclick="copyText('js-code-${index}')" class="hover:text-slate-200 transition">Copy</button>
            </div>
            <pre id="js-code-${index}" class="bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-[10px] text-indigo-300 overflow-x-auto custom-scrollbar select-text">${escapeHtml(api.snippet_js)}</pre>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>cURL command</span>
              <button onclick="copyText('curl-code-${index}')" class="hover:text-slate-200 transition">Copy</button>
            </div>
            <pre id="curl-code-${index}" class="bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-[10px] text-amber-300 overflow-x-auto custom-scrollbar select-text">${escapeHtml(api.snippet_curl)}</pre>
          </div>
        </div>
      </div>
    `;

    apiListContainer.appendChild(card);
  });
}

function toggleCardSnippet(index) {
  const panel = document.getElementById(`snippet-panel-${index}`);
  const chevron = document.getElementById(`chevron-${index}`);
  if (panel.classList.contains("hidden")) {
    panel.classList.remove("hidden");
    chevron.className = "fa-solid fa-chevron-up text-[9px] ml-1";
  } else {
    panel.classList.add("hidden");
    chevron.className = "fa-solid fa-chevron-down text-[9px] ml-1";
  }
}

function copyText(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    navigator.clipboard.writeText(el.innerText)
      .then(() => {
        console.log(`Copied code snippet: ${elementId}`);
        alert("Snippet copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy text: " + err.message);
      });
  }
}


// ==========================================
// 7. OPENROUTER AI CLIENT ROUTINES (BYOK)
// ==========================================
async function callOpenRouterAI(problemStatement, base64Image = null) {
  // Try to find key
  const passphrase = prompt("Verify AES-256 Vault: Enter your decryption password to decrypt OpenRouter API Key:");
  if (passphrase === null) return; // User cancelled

  const apiKey = getDecryptedKey(passphrase);
  if (!apiKey) {
    alert("Decryption Failed! Ensure you have saved an API Key under settings and typed the correct decryption passphrase.");
    return;
  }

  aiResponseContainer.classList.remove("hidden");
  aiAdviceBody.innerHTML = `
    <div class="flex items-center gap-2 text-slate-400">
      <i class="fa-solid fa-spinner animate-spin"></i>
      <span>Securing encrypted handshake... Querying OpenRouter Free API...</span>
    </div>
  `;
  aiAdviceBody.scrollIntoView({ behavior: 'smooth' });

  try {
    const messages = [];

    // Core prompt instructing model on how to suggest free APIs and integrate them
    const systemPrompt = `You are an expert AI Architect designed to analyze problem statements and suggest completely FREE, high-quality, real-world public APIs (with no credit cards required).
For the user's problem, recommend exactly 2 to 4 real-world free APIs.
For each API, provide:
1. Name and description.
2. The specific base URL and endpoint.
3. Complete request parameters and code snippets (JavaScript Fetch).
Format your entire output using clean markdown with headers, bold text, lists, and code blocks. Make it extremely direct, technical, and ready for developer usage.`;

    messages.push({ role: "system", content: systemPrompt });

    if (base64Image) {
      // Multimodal payload
      messages.push({
        role: "user",
        content: [
          { type: "text", text: `Here is my technical requirements document / screenshot parsing input. Extract API details and cross-reference them with free APIs to satisfy this challenge: "${problemStatement}"` },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
      });
    } else {
      messages.push({
        role: "user",
        content: `My development problem statement is:\n\n"${problemStatement}"\n\nSuggest the best free API stack to solve this problem.`
      });
    }

    console.log("Sending chat request to OpenRouter API (openrouter/free)...");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin || "https://github.com/baidu/Unlimited-OCR",
        "X-Title": "API Search Dashboard"
      },
      body: JSON.stringify({
        model: "openrouter/free", // Intelligently routes to current free models (Gemini-Flash, Llama, etc.)
        messages: messages,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`OpenRouter HTTP ${response.status}: ${errBody}`);
    }

    const resJson = await response.json();
    const adviceText = resJson.choices?.[0]?.message?.content;

    if (!adviceText) {
      throw new Error("Empty response returned from OpenRouter AI model.");
    }

    // Set model name in badge
    const modelUsed = resJson.model || "openrouter/free";
    aiModelBadge.innerText = modelUsed;

    // Render advice text
    aiAdviceBody.innerText = adviceText;
    console.log(`Successfully parsed AI recommendations from OpenRouter (${modelUsed})`);

  } catch (error) {
    console.error("OpenRouter AI Request failed: " + error.message);
    aiAdviceBody.innerHTML = `
      <div class="p-3 border border-red-500/30 bg-red-500/10 rounded-lg text-red-400 space-y-1">
        <p class="font-bold"><i class="fa-solid fa-triangle-exclamation"></i> AI Routing Sequence Failed</p>
        <p class="text-[11px] leading-relaxed select-text">${error.message}</p>
        <p class="text-[10px] text-slate-400 mt-2">Troubleshooting check: Is your key valid? Did you type the correct decryption password? Note that openrouter/free models may occasionally experience high concurrency limits.</p>
      </div>
    `;
  }
}


// ==========================================
// 8. MULTIMODAL INPUT & OCR SIMULATOR (Baidu Unlimited-OCR)
// ==========================================
function processOcrInput() {
  if (!selectedOcrBase64) {
    alert("Please upload or drag an image first before processing.");
    return;
  }

  ocrOutputMarkdown.innerText = "⏳ Initializing Baidu Unlimited-OCR deepseek-lineage parser...\nLoading Vision Stack: SAM-ViT-B + CLIP-L DeepEncoder...\nProcessing 32K context window...";

  // Check if OpenRouter BYOK is set, if so we can offer real AI-driven OCR
  const isConfigured = localStorage.getItem(VAULT_METADATA_KEY) === "true";

  setTimeout(async () => {
    if (isConfigured) {
      // Let's call OpenRouter for real OCR!
      const passphrase = prompt("Verify AES Vault: Enter your password to decrypt API Key for Real Multimodal OCR parsing:");
      if (passphrase === null) {
        runMockOcrSequence();
        return;
      }

      const apiKey = getDecryptedKey(passphrase);
      if (!apiKey) {
        alert("Decryption failed. Running local simulation matching instead.");
        runMockOcrSequence();
        return;
      }

      ocrOutputMarkdown.innerText = "⚡ Routing Base64 bytes directly to OpenRouter Multimodal Free model...\nParsing image document structures...";

      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "Baidu Unlimited OCR parser"
          },
          body: JSON.stringify({
            model: "openrouter/free", // Automatically chooses free vision models like Gemini Flash 2.5
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: "Parse this screenshot/image. If there is a table or lists of API endpoints, parameters, technical specs, or keys, extract them into beautiful and clean structured markdown tables. Be precise, exact, and do not summarize." },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:image/jpeg;base64,${selectedOcrBase64}`
                    }
                  }
                ]
              }
            ]
          })
        });

        if (!response.ok) {
          throw new Error("HTTP " + response.status);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (!text) throw new Error("Null content");

        ocrOutputMarkdown.innerText = text;
        console.log("Real Multimodal OCR parsing completed successfully via OpenRouter!");

        // Also feed this into the problem solver input
        problemInput.value = `[PARSED OCR DOCUMENT INPUT]:\n${text}\n\n[OBJECTIVE]: Suggest relevant free APIs to connect with this schema.`;
        charCounter.innerText = problemInput.value.length;

      } catch (err) {
        console.error("Real vision OCR failed: " + err.message + ". Falling back to local template parser.");
        runMockOcrSequence();
      }

    } else {
      // Offline local simulation
      runMockOcrSequence();
    }
  }, 1000);
}

function runMockOcrSequence() {
  const mockMarkdownResults = `## Parsed API Schema Document (Baidu Unlimited-OCR Simulation)

### Extracted Endpoint Specs:
| Endpoint | Method | Description | Content-Type | Rate-Limit |
| :--- | :--- | :--- | :--- | :--- |
| \`/v1/coordinates\` | \`GET\` | Geolocation resolver from query strings | \`application/json\` | 100 req/min |
| \`/v1/current-weather\`| \`GET\` | Current temperature and predictions | \`application/json\` | Unlimited |
| \`/v1/dog-pics\` | \`POST\`| Generate cute puppy image outputs | \`multipart/form-data\` | 10 req/sec |

### Document Parsing Meta-stats:
- **Active Parameters Engine:** SAM-ViT-B + CLIP-L DeepEncoder (500M Active parameters)
- **Model Window Context:** 32,768 tokens (One-shot, single-pass layout preservation)
- **Order Integrity:** 99.42% accuracy preservation across 12 layout blocks.

💡 *Baidu Unlimited-OCR has placed this parsed markdown into the API Problem Solver input! Toggle to the API Problem Solver tab to find matching free APIs!*`;

  ocrOutputMarkdown.innerText = mockMarkdownResults;
  console.log("Mock Multimodal OCR parsing sequence generated.");

  // Append to problem solver text automatically
  problemInput.value = `[PARSED DOCUMENT SCHEMA]:
- Geolocation coordinate parser endpoint.
- Live current weather forecasts endpoint.
- Dog image generation dataset.

Please find and coordinate free matching APIs to achieve this integration.`;
  charCounter.innerText = problemInput.value.length;
}

function clearOcrPreview() {
  selectedOcrBase64 = null;
  ocrPreviewBox.classList.add("hidden");
  ocrPreviewImg.src = "";
  runOcrBtn.disabled = true;
  ocrFileInput.value = "";
  ocrOutputMarkdown.innerText = "--- No image processed yet. Upload a screenshot of an API table or data schema, then trigger the processing sequence.";
  console.log("OCR workspace cleared.");
}

function copyPythonOcrSnippet() {
  const code = `from vllm import LLM
model_id = "baidu/Unlimited-OCR"
llm = LLM(model=model_id, trust_remote_code=True, max_model_len=32768)
outputs = llm.generate({"prompt": "<image>\\nParse API tables", "multi_modal_data": {"image": "./api_screenshot.png"}})
print(outputs[0].outputs[0].text)`;
  navigator.clipboard.writeText(code).then(() => {
    console.log("Python Unlimited-OCR recipe copied.");
    alert("Python vLLM recipe copied to clipboard!");
  });
}


// ==========================================
// 9. AGENT-REACH SEARCH TERMINAL (Free Social Search Simulator)
// ==========================================
async function dispatchAgentReachSearch() {
  const query = reachQueryInput.value.trim();
  if (query.length === 0) {
    alert("Please enter a search query for Agent-Reach.");
    return;
  }

  // Get active platforms
  const platforms = [];
  if (document.getElementById("platform-github").checked) platforms.push("GitHub");
  if (document.getElementById("platform-reddit").checked) platforms.push("Reddit");
  if (document.getElementById("platform-twitter").checked) platforms.push("Twitter/X");
  if (document.getElementById("platform-youtube").checked) platforms.push("YouTube");

  if (platforms.length === 0) {
    alert("Please check at least one target platform to search.");
    return;
  }

  console.log(`Dispatching Agent-Reach to platforms: ${platforms.join(', ')} with query: "${query}"`);

  // Print command to terminal
  appendTerminalLine("user@agent-reach:~#", `agent-reach search --query "${query}" --sources ${platforms.map(p => p.toLowerCase().replace('/x','')).join(',')}`, "text-brand-400 font-bold");
  appendTerminalLine("[SYSTEM]", `Searching the internet using no-key scraping protocols on: [${platforms.join(', ')}]`, "text-slate-500");

  // Show loaders
  const loaderId = appendTerminalLoader();

  // Wait 1.5 seconds to simulate search
  setTimeout(() => {
    removeTerminalLoader(loaderId);

    // Formulate a beautiful results output summarizing how agent-reach scrapes platforms
    appendTerminalLine("[AGENT-REACH]", `Successfully completed search. Scraped ${platforms.length} sources, compiling index cards...`, "text-emerald-400 font-bold");

    platforms.forEach(p => {
      if (p === "GitHub") {
        appendTerminalLine("[reach_github]", `Found 3 repositories matching "${query}":`, "text-amber-400 font-semibold mt-2");
        appendTerminalLine("  - https://github.com/public-apis/public-apis (152k stars) - Curated index of free public APIs", "text-slate-300");
        appendTerminalLine("  - https://github.com/toddmotto/public-apis (51k stars) - Free JSON APIs for developers", "text-slate-300");
        appendTerminalLine("  - https://github.com/nono-c/free-apis (1.2k stars) - Fully documented serverless API list", "text-slate-300");
      }
      if (p === "Reddit") {
        appendTerminalLine("[reach_reddit]", `Crawled r/webdev and r/selfhosted matching "${query}":`, "text-orange-400 font-semibold mt-2");
        appendTerminalLine("  - Reddit Post (Score: +242): 'Is there a completely free geocoding API? Nominatim is great but looking for alternatives.' Recommendations: IP-API.com, Frankfurter, Open-Meteo.", "text-slate-300");
        appendTerminalLine("  - Reddit Post (Score: +89): 'My curated list of 40 free APIs with zero key requirements in 2026.' Linked wttr.in and restcountries.", "text-slate-300");
      }
      if (p === "Twitter/X") {
        appendTerminalLine("[reach_twitter]", `X Scraper retrieved 2 viral tweets matching "${query}":`, "text-slate-300 font-semibold mt-2");
        appendTerminalLine("  - @tech_architect: 'PSA: Stop paying for Google Maps geocoder for simple hobbies. OpenStreetMap Nominatim + IP-API does 90% of the job entirely for free.' (1.2k likes)", "text-slate-400 italic");
        appendTerminalLine("  - @developer_tips: 'Build automated weather bots easily using open-meteo.com. No keys, no caps, extremely fast.' (850 likes)", "text-slate-400 italic");
      }
      if (p === "YouTube") {
        appendTerminalLine("[reach_youtube]", `YouTube Search Index crawled 2 relevant guides:`, "text-red-400 font-semibold mt-2");
        appendTerminalLine("  - 'How to Geocode Addresses with Free APIs in Python' by CodeCrafter (12k views) - Featured Nominatim API", "text-slate-300");
        appendTerminalLine("  - 'Build a Serverless Weather App under 5 Minutes' by DevFast (24k views) - Featured Open-Meteo", "text-slate-300");
      }
    });

    appendTerminalLine("[DONE]", `All sockets closed cleanly. Agent Reach is ready for another query.`, "text-emerald-500 font-semibold mt-2");

    // Scroll to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight;

    // Place the top-ranked API results in the problem statement
    if (problemInput.value.length < 5) {
      problemInput.value = `I found some free APIs from Agent-Reach searches for "${query}":\n- Nominatim (Geocoding)\n- Open-Meteo (Weather)\n- IP-API (IP location)\n\nRecommend integrations and sample codes.`;
      charCounter.innerText = problemInput.value.length;
    }

  }, 1800);
}

function appendTerminalLine(prefix, content, cssClass = "text-slate-300") {
  const line = document.createElement("p");
  line.className = `leading-relaxed select-text font-mono ${cssClass}`;
  line.innerHTML = `<span class="text-slate-500">${escapeHtml(prefix)}</span> ${escapeHtml(content)}`;

  // Insert before the working prompt
  const workingPrompt = document.getElementById("terminal-working-prompt");
  terminalBody.insertBefore(line, workingPrompt);
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

function appendTerminalLoader() {
  const id = "loader-" + Math.random().toString(36).substring(2, 9);
  const loader = document.createElement("div");
  loader.id = id;
  loader.className = "flex items-center gap-2 text-indigo-400 font-mono mt-1 mb-1";
  loader.innerHTML = `
    <i class="fa-solid fa-circle-notch animate-spin"></i>
    <span>Running agent-reach subprocess... Scrambling proxies... Scrapes in progress...</span>
  `;
  const workingPrompt = document.getElementById("terminal-working-prompt");
  terminalBody.insertBefore(loader, workingPrompt);
  terminalBody.scrollTop = terminalBody.scrollHeight;
  return id;
}

function removeTerminalLoader(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function clearTerminal() {
  terminalBody.innerHTML = `
    <p class="text-slate-500">Agent Reach Diagnostic Terminal. Initiating socket connection...</p>
    <p class="text-emerald-500">[INFO] agent-reach v2.4.0 is fully operational.</p>
    <p class="text-slate-400">Type a query in the probe configuration pane on the left or type directly inside the search bar, then click "Dispatch Agent-Reach Probe".</p>

    <div id="terminal-working-prompt" class="pt-2">
      <span class="text-brand-400">user@agent-reach:~#</span> <span class="terminal-pulse"></span>
    </div>
  `;
  console.log("Terminal screen cleared.");
}

function copyCliInstall() {
  navigator.clipboard.writeText("pip install agent-reach && agent-reach install").then(() => {
    console.log("Agent Reach CLI installation command copied.");
    alert("CLI installation command copied!");
  });
}


// ==========================================
// 10. TAB NAVIGATION CONTROLLER
// ==========================================
sidebarTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const targetTab = tab.getAttribute("data-tab");

    // Deactivate all buttons
    sidebarTabs.forEach(t => {
      t.className = "tab-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition";
    });

    // Activate selected button
    tab.className = "tab-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition bg-brand-600 text-white shadow-lg shadow-brand-900/10";

    // Toggle tab contents
    tabContents.forEach(content => {
      if (content.id === targetTab) {
        content.classList.remove("hidden");
      } else {
        content.classList.add("hidden");
      }
    });

    currentActiveTab = targetTab;
    console.log(`Workspace navigated to tab: ${targetTab}`);
  });
});

// Problem Statement Templates Helper
function applyTemplate(key) {
  let text = "";
  if (key === 'coordinates') {
    text = "I need to build a Discord bot where users enter geographic coordinates. The bot needs to reverse geocode them to a real street address and automatically fetch the live weekly weather forecast entirely with free, public APIs.";
  } else if (key === 'dogpics') {
    text = "I want to create a breed explorer web application where children can select different dog breeds, look up a detailed list of breed heights, weights, and typical lifespans, and generate random photos of that selected breed on-the-fly.";
  } else if (key === 'finance') {
    text = "I am designing a personal wealth dashboard. I want to fetch current prices for Bitcoin, Ethereum, and standard stock indices, convert their USD prices dynamically to Euros, and display currency exchanges without needing an expensive paid API.";
  } else if (key === 'ocr') {
    text = "Extract structured markdown schema from screenshots of long-context API document tables using Baidu Unlimited-OCR, and map coordinates models to Open-Meteo coordinates.";
  }

  problemInput.value = text;
  charCounter.innerText = text.length;
  console.log(`Applied problem template: "${key}"`);
}

function toggleKeyVisibility(inputId) {
  const input = document.getElementById(inputId);
  const eye = document.getElementById(`${inputId}-eye`);
  if (input.type === "password") {
    input.type = "text";
    eye.className = "fa-regular fa-eye-slash";
  } else {
    input.type = "password";
    eye.className = "fa-regular fa-eye";
  }
}


// ==========================================
// 11. INITIALIZATION & EVENT BINDINGS
// ==========================================

// Handle drag & drop uploader
if (ocrDropzone) {
  ocrDropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    ocrDropzone.classList.add("border-brand-500", "bg-brand-500/5");
  });

  ocrDropzone.addEventListener("dragleave", () => {
    ocrDropzone.classList.remove("border-brand-500", "bg-brand-500/5");
  });

  ocrDropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    ocrDropzone.classList.remove("border-brand-500", "bg-brand-500/5");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleOcrFileSelection(file);
    } else {
      alert("Please upload a valid image file.");
    }
  });

  ocrFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) handleOcrFileSelection(file);
  });
}

function handleOcrFileSelection(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    selectedOcrBase64 = e.target.result.split(',')[1];
    ocrPreviewImg.src = e.target.result;
    ocrPreviewBox.classList.remove("hidden");
    runOcrBtn.disabled = false;
    console.log(`OCR File loaded: "${file.name}" (Type: ${file.type}, Size: ${Math.round(file.size/1024)} KB)`);
  };
  reader.readAsDataURL(file);
}

// Bind main triggers
searchLocalBtn.addEventListener("click", () => {
  searchLocalApis(problemInput.value, categoryFilter.value);
});

searchAiBtn.addEventListener("click", () => {
  const query = problemInput.value.trim();
  if (query.length === 0) {
    alert("Please enter your problem statement before querying the AI Architect.");
    return;
  }
  callOpenRouterAI(query, selectedOcrBase64);
});

categoryFilter.addEventListener("change", () => {
  searchLocalApis(problemInput.value, categoryFilter.value);
});

problemInput.addEventListener("input", () => {
  charCounter.innerText = problemInput.value.length;
});

saveByokBtn.addEventListener("click", () => {
  const rawKey = byokKeyInput.value.trim();
  const passphrase = byokPassphraseInput.value.trim();
  if (saveEncryptedKey(rawKey, passphrase)) {
    byokKeyInput.value = "";
    byokPassphraseInput.value = "";
  }
});

clearByokBtn.addEventListener("click", wipeVault);

runOcrBtn.addEventListener("click", processOcrInput);

copyOcrBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(ocrOutputMarkdown.innerText).then(() => {
    console.log("OCR parsed markdown output copied.");
    alert("Markdown output copied!");
  });
});

runReachBtn.addEventListener("click", dispatchAgentReachSearch);

clearTerminalBtn.addEventListener("click", clearTerminal);

clearLogsBtn.addEventListener("click", () => {
  logStreamContainer.innerHTML = `
    <p class="text-slate-500">[LOGS SHIELD RESET] Intercepting all console signals. Browser logs redirected successfully.</p>
  `;
  systemLogsArray = [];
  console.log("Workspace logs console cleared.");
});

dismissShieldBtn.addEventListener("click", dismissSecurityShieldModal);

// Security switches triggers
toggleConsoleOverride.addEventListener("change", (e) => {
  if (e.target.checked) {
    enableConsoleOverrides();
    console.log("Console logger override activated.");
  } else {
    disableConsoleOverrides();
    originalConsole.log("Global Console override deactivated. Browser logging restored.");
  }
});

toggleHotkeysBlock.addEventListener("change", (e) => {
  if (e.target.checked) {
    enableHotkeysBlock();
    console.log("Shortcuts & Right-click interceptor activated.");
  } else {
    disableHotkeysBlock();
    console.log("Shortcuts & Right-click interceptor deactivated.");
  }
});

toggleDebuggerTrap.addEventListener("change", (e) => {
  devtoolsTrappingActive = e.target.checked;
  if (devtoolsTrappingActive) {
    runDevtoolsDebuggerLoop();
    shieldIndicator.className = "relative inline-flex rounded-full h-2 w-2 bg-emerald-500";
    shieldIndicatorPing.className = "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75";
    shieldStatusText.innerText = "Console Guard Active";
    console.log("Anti-debugging recursive worker loops initialized.");
  } else {
    stopDevtoolsDebuggerLoop();
    shieldIndicator.className = "relative inline-flex rounded-full h-2 w-2 bg-amber-500";
    shieldIndicatorPing.className = "animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75";
    shieldStatusText.innerText = "Console Guard Bypassed";
    console.warn("Devtools trap sequence deactivated. Security levels minimized.");
  }
});


// On Load Initializers
function initializeApp() {
  // 1. Initial Local API load
  renderApiCards(FREE_APIS_DATABASE, "all");

  // 2. Load settings indicators
  updateVaultUI();

  // 3. Initiate security guards
  enableConsoleOverrides();
  enableHotkeysBlock();
  runDevtoolsDebuggerLoop();

  console.log("API Search Hub initialization completed successfully. Session active.");
}

// Kickstart
document.addEventListener("DOMContentLoaded", initializeApp);

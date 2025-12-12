// Open ANY modal (Topic 3 Part 1 + Part 2) 
document.querySelectorAll("[data-modal]").forEach(trigger => {
  trigger.addEventListener("click", () => {
    const id = trigger.dataset.modal;
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = "flex";
    }
  });
});

// Close when clicking the dark overlay
document.querySelectorAll(".t3-modal").forEach(modal => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});


// Topic 5 flip cards – click to flip 
document.querySelectorAll(".t5-card").forEach(card => {
  card.addEventListener("click", () => {
    card.classList.toggle("is-flipped");
  });
});


// Topic 6 – expand
document.querySelectorAll(".t6-card").forEach(card => {
  const toggle = card.querySelector(".t6-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    card.classList.toggle("open");
  });
});


document.addEventListener("DOMContentLoaded", () => {
  // ---------- DATA ----------
  const topologyData = {
    star: {
      title: "Star Topology",
      desc: "All devices connect to a central device (like a switch). If one device fails, the rest usually keep working.",
      pros: ["Easy to manage and expand", "Stable: one device failure won’t affect others", "Good performance in small offices"],
      cons: ["Central device failure can bring the network down", "Requires more cable than bus"]
    },
    bus: {
      title: "Bus Topology",
      desc: "All devices share one main backbone cable. Data travels along the same line.",
      pros: ["Cheap and simple to set up", "Uses less cable"],
      cons: ["Backbone failure can shut down the network", "Performance drops as traffic increases"]
    },
    mesh: {
      title: "Mesh Topology",
      desc: "Devices connect to many (or all) other devices, creating multiple communication paths.",
      pros: ["Very reliable (multiple paths)", "Fault-tolerant: reroutes if one path fails"],
      cons: ["Expensive to set up", "Harder to manage at large scale"]
    },
    ring: {
      title: "Ring Topology",
      desc: "Devices form a loop. Data moves around the ring, device to device.",
      pros: ["Predictable performance", "Works well with steady traffic"],
      cons: ["One break can interrupt the entire ring", "Harder to troubleshoot"]
    }
  };

  const scopeData = {
    pan: { label: "PAN — a few meters (e.g., Bluetooth, phone hotspot)", fill: 25 },
    lan: { label: "LAN — a room/building (home Wi-Fi, office network)", fill: 50 },
    man: { label: "MAN — a city/campus (university or city backbone)", fill: 75 },
    wan: { label: "WAN — worldwide (the internet)", fill: 100 }
  };


  // ---------- ELEMENTS ----------
  const topoButtons = document.querySelectorAll(".t10-pill");
  const scopeButtons = document.querySelectorAll(".t10-chip");

  const topoDetails = document.getElementById("t10TopologyDetails");
  const diagramBox = document.getElementById("t10Diagram");

  const prosList = document.getElementById("t10Pros");
  const consList = document.getElementById("t10Cons");

  const scopeFill = document.getElementById("t10ScopeFill");
  const scopeLabel = document.getElementById("t10ScopeLabel");

  const toolButtons = document.querySelectorAll(".t10-tool");
  const toolTip = document.getElementById("t10ToolTip");

  const scenarioToggle = document.getElementById("t10ScenarioToggle");
  const scenarioBody = document.getElementById("t10ScenarioBody");
  const scenarioIcon = scenarioToggle.querySelector(".t10-acc-icon");


  // ---------- HELPERS ----------
  function setActive(buttons, activeBtn, activeClass = "is-active") {
    buttons.forEach(btn => btn.classList.remove(activeClass));
    activeBtn.classList.add(activeClass);
  }

  function renderList(ul, items) {
    ul.innerHTML = items.map(x => `<li>${x}</li>`).join("");
  }


  // SVG Diagram generator (simple white-line style)
  function diagramSVG(type) {
    // Common node style
    const node = (cx, cy, label) => `
      <circle cx="${cx}" cy="${cy}" r="18" fill="rgba(255,255,255,.10)" stroke="rgba(255,255,255,.65)" stroke-width="2"/>
      <text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="12" fill="rgba(255,255,255,.9)" font-family="system-ui, sans-serif">${label}</text>
    `;

    const line = (x1,y1,x2,y2) =>
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(255,255,255,.55)" stroke-width="2" />`;


    // Canvas size
    const W = 760, H = 360;

    if (type === "star") {
      return `
        <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Star topology diagram">
          ${line(380,180,160,90)} ${line(380,180,160,270)} ${line(380,180,600,90)} ${line(380,180,600,270)} ${line(380,180,380,310)}
          ${node(380,180,"SW")}
          ${node(160,90,"PC1")} ${node(160,270,"PC2")}
          ${node(600,90,"PC3")} ${node(600,270,"PC4")}
          ${node(380,310,"PRN")}
        </svg>
      `;
    }

    if (type === "bus") {
      return `
        <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Bus topology diagram">
          ${line(120,180,640,180)}
          ${line(200,180,200,110)} ${line(320,180,320,110)} ${line(440,180,440,110)} ${line(560,180,560,110)}
          ${node(200,90,"PC1")} ${node(320,90,"PC2")} ${node(440,90,"PC3")} ${node(560,90,"PC4")}
          <text x="380" y="220" text-anchor="middle" font-size="13" fill="rgba(255,255,255,.8)" font-family="system-ui, sans-serif">Backbone Cable</text>
          <circle cx="120" cy="180" r="6" fill="rgba(255,191,71,.8)" />
          <circle cx="640" cy="180" r="6" fill="rgba(255,191,71,.8)" />
        </svg>
      `;
    }

    if (type === "mesh") {
      // 4-node full mesh
      return `
        <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Mesh topology diagram">
          ${line(220,110,540,110)} ${line(220,110,220,270)} ${line(540,110,540,270)} ${line(220,270,540,270)}
          ${line(220,110,540,270)} ${line(540,110,220,270)}
          ${node(220,110,"A")} ${node(540,110,"B")}
          ${node(220,270,"C")} ${node(540,270,"D")}
          <text x="380" y="330" text-anchor="middle" font-size="13" fill="rgba(255,255,255,.8)" font-family="system-ui, sans-serif">Multiple Paths = High Reliability</text>
        </svg>
      `;
    }


    // ring
    return `
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Ring topology diagram">
        ${line(250,90,510,90)} ${line(510,90,600,180)} ${line(600,180,510,270)} ${line(510,270,250,270)} ${line(250,270,160,180)} ${line(160,180,250,90)}
        ${node(250,90,"N1")} ${node(510,90,"N2")}
        ${node(600,180,"N3")} ${node(510,270,"N4")}
        ${node(250,270,"N5")} ${node(160,180,"N6")}
        <text x="380" y="330" text-anchor="middle" font-size="13" fill="rgba(255,255,255,.8)" font-family="system-ui, sans-serif">Data moves around the loop</text>
      </svg>
    `;
  }

  function applyTopology(key) {
    const t = topologyData[key];
    topoDetails.innerHTML = `
      <strong>${t.title}</strong><br/>
      ${t.desc}
    `;
    diagramBox.innerHTML = diagramSVG(key);
    renderList(prosList, t.pros);
    renderList(consList, t.cons);
  }

  function applyScope(key) {
    const s = scopeData[key];
    scopeFill.style.width = `${s.fill}%`;
    scopeLabel.textContent = s.label;
  }


  // ---------- EVENTS ----------
  topoButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      setActive(topoButtons, btn);
      applyTopology(btn.dataset.topology);
    });
  });

  scopeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // aria-pressed handling
      scopeButtons.forEach(b => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");

      setActive(scopeButtons, btn);
      applyScope(btn.dataset.scope);
    });
  });

  toolButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      toolTip.textContent = btn.dataset.tip;
    });
  });

  scenarioToggle.addEventListener("click", () => {
    const expanded = scenarioToggle.getAttribute("aria-expanded") === "true";
    scenarioToggle.setAttribute("aria-expanded", String(!expanded));
    scenarioBody.hidden = expanded;
    scenarioIcon.textContent = expanded ? "+" : "–";
  });


  // ---------- INIT ----------
  applyTopology("star");
  applyScope("pan");
});


document.addEventListener("DOMContentLoaded", () => {
  // ---------- Principle Viewer Data ----------
  const principleData = {
    integrity: {
      title: "Integrity & Honesty",
      meaning: "Be truthful about your skills, system status, and results. Report mistakes instead of hiding them.",
      example: "An IT staff member should disclose an outage or error honestly and document what happened."
    },
    privacy: {
      title: "Confidentiality & Privacy",
      meaning: "Protect personal and sensitive information. Don’t access or share data unless authorized and needed for the job.",
      example: "An IT staff member must not browse a student’s personal files “out of curiosity.”"
    },
    competence: {
      title: "Professional Competence",
      meaning: "Keep skills updated, follow best practices, and don’t accept tasks you’re not qualified to handle without proper guidance.",
      example: "A junior dev should ask for supervision before deploying security-critical code."
    },
    accountability: {
      title: "Responsibility & Accountability",
      meaning: "Own your decisions, follow policies and laws, and keep clear records of actions taken.",
      example: "A network admin documents configuration changes so issues can be traced and fixed safely."
    },
    ip: {
      title: "Intellectual Property",
      meaning: "Respect ownership, licenses, and copyright. Don’t pirate software or claim others’ work as your own.",
      example: "A programmer should not copy another developer’s code and claim it as their own."
    },
    noharm: {
      title: "Non-Maleficence (Do No Harm)",
      meaning: "Avoid actions that could harm users, systems, or organizations. Security shortcuts can cause real damage.",
      example: "A network admin should not ignore security updates just to “save time.”"
    }
  };

  const principleButtons = document.querySelectorAll(".t11-item");
  const viewer = document.getElementById("t11Viewer");

  function setActive(buttons, activeBtn, cls = "is-active") {
    buttons.forEach(b => b.classList.remove(cls));
    activeBtn.classList.add(cls);
  }

  function renderPrinciple(key) {
    const p = principleData[key];
    viewer.innerHTML = `
      <strong style="font-size:15px; color: rgba(255,255,255,.92);">${p.title}</strong><br><br>
      <span style="color: rgba(255,255,255,.85);"><strong>Meaning:</strong> ${p.meaning}</span><br><br>
      <span style="color: rgba(255,255,255,.80);"><strong>Simple example:</strong> ${p.example}</span>
    `;
  }

  principleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      setActive(principleButtons, btn);
      renderPrinciple(btn.dataset.principle);
    });
  });


  // ---------- Dilemma Simulator ----------
  const choiceButtons = document.querySelectorAll(".t11-choice");
  const trail = document.getElementById("t11Trail");
  const result = document.getElementById("t11Result");
  const resetBtn = document.getElementById("t11Reset");

  const picked = new Set();

  const choiceSteps = {
    privacy: "Respect user privacy by default — disclose data only when justified and authorized.",
    safety: "Prioritize preventing serious harm to people (public safety can outweigh privacy in extreme cases).",
    law: "Follow legal procedures and company policy (valid requests, proper reporting channels).",
    minimal: "Share only what is necessary (minimal disclosure), not the user’s entire history."
  };

  function renderTrail() {
    const items = Array.from(picked);
    if (items.length === 0) {
      trail.innerHTML = `<li class="t11-trail-empty">No steps yet. Choose a priority above.</li>`;
      return;
    }
    trail.innerHTML = items.map(k => `<li>${choiceSteps[k]}</li>`).join("");
  }

  function renderResult() {
    if (picked.size === 0) {
      result.textContent = "Choose a priority to see a recommended action and ethical reasoning.";
      return;
    }


    // Recommended action logic (simple, but looks “smart”)
    const hasSafety = picked.has("safety");
    const hasLaw = picked.has("law");
    const hasMinimal = picked.has("minimal");
    const hasPrivacy = picked.has("privacy");

    let action = "Recommended action: ";
    let reason = "";

    if (hasSafety && hasLaw && hasMinimal) {
      action += "Report the threat through proper legal channels, disclose only necessary information, and document everything.";
      reason = "This balances public safety with privacy by using legal process + minimal disclosure + accountability.";
    } else if (hasSafety && hasLaw) {
      action += "Escalate to authorities using proper legal procedures, and document the disclosure.";
      reason = "This protects human life while avoiding abuse of access (accountability + lawful process).";
    } else if (hasSafety && hasMinimal) {
      action += "Escalate internally and prepare a limited report focused only on the threat details.";
      reason = "You’re prioritizing safety while still reducing privacy impact through minimal disclosure.";
    } else if (hasPrivacy && !hasSafety) {
      action += "Maintain confidentiality unless there is a valid legal basis or immediate risk of harm.";
      reason = "Privacy is essential — but in real threats, ethical codes usually prioritize preventing serious harm.";
    } else {
      action += "Combine policy, legal process, and harm prevention into a documented, minimal disclosure response.";
      reason = "Ethical decisions are strongest when they’re lawful, accountable, and reduce unnecessary exposure of data.";
    }

    result.innerHTML = `
      <strong>${action}</strong><br><br>
      <span style="color: rgba(255,255,255,.82);"><strong>Why:</strong> ${reason}</span><br>
      <span style="color: rgba(255,255,255,.78);"><strong>Reminder:</strong> document what was shared, with whom, and why.</span>
    `;
  }

  choiceButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.choice;

      if (picked.has(key)) {
        picked.delete(key);
        btn.classList.remove("is-picked");
      } else {
        picked.add(key);
        btn.classList.add("is-picked");
      }

      renderTrail();
      renderResult();
    });
  });

  resetBtn.addEventListener("click", () => {
    picked.clear();
    choiceButtons.forEach(b => b.classList.remove("is-picked"));
    renderTrail();
    renderResult();
  });


  // ---------- INIT ----------
  renderPrinciple("integrity");
  renderTrail();
  renderResult();
});


document.addEventListener("DOMContentLoaded", () => {
  const tagButtons = document.querySelectorAll(".t12-tag");
  const detailBox = document.getElementById("t12Detail");
  const preview = document.getElementById("t12Preview");

  const details = {
    doctype: {
      title: "<!DOCTYPE html>",
      text: "Tells the browser this is an HTML5 document. It helps the browser render the page in modern standards mode.",
      highlight: null
    },
    html: {
      title: "<html>",
      text: "The root element that wraps the entire HTML document (head + body).",
      highlight: null
    },
    head: {
      title: "<head>",
      text: "Contains page metadata (not shown on the page) like title, icons, and links to CSS files.",
      highlight: null
    },
    title: {
      title: "<title>",
      text: "Sets the title shown in the browser tab (not inside the page content).",
      highlight: null
    },
    meta: {
      title: "<meta>",
      text: "Provides metadata (example: character encoding). Helps browsers display text correctly.",
      highlight: null
    },
    link: {
      title: "<link>",
      text: "Links external resources like CSS files (used to style the page).",
      highlight: null
    },
    body: {
      title: "<body>",
      text: "Contains everything visible on the webpage — text, images, links, sections, and layout elements.",
      highlight: null
    },
    header: {
      title: "<header>",
      text: "A top section usually used for the page title, logo, and intro content.",
      highlight: "header"
    },
    nav: {
      title: "<nav>",
      text: "Contains navigation links (menus) that help users move around the site.",
      highlight: "nav"
    },
    section: {
      title: "<section>",
      text: "Groups related content into sections (About, Schedule, Highlights). Helps structure the page clearly.",
      highlight: "section"
    },
    footer: {
      title: "<footer>",
      text: "A bottom section for contact info, copyright, or extra links.",
      highlight: "footer"
    }
  };

  function setActive(activeBtn) {
    tagButtons.forEach(b => b.classList.remove("is-active"));
    activeBtn.classList.add("is-active");
  }

  function clearHighlights() {
    preview.querySelectorAll("[data-part]").forEach(el => el.classList.remove("t12-highlight"));
  }

  function highlightPart(part) {
    if (!part) return;
    const el = preview.querySelector(`[data-part="${part}"]`);
    if (!el) return;
    el.classList.add("t12-highlight");
    setTimeout(() => el.classList.remove("t12-highlight"), 900);
  }

  function renderDetail(key) {
    const d = details[key];
    detailBox.innerHTML = `
      <strong style="color: rgba(255,255,255,.92); font-size: 15px;">${d.title}</strong><br><br>
      <span style="color: rgba(255,255,255,.82);">${d.text}</span>
    `;
    clearHighlights();
    highlightPart(d.highlight);
  }

  tagButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.tag;
      setActive(btn);
      renderDetail(key);
    });
  });

  // init
  renderDetail("doctype");
});


document.addEventListener("DOMContentLoaded", () => {
  // ---------- CSS Method Tabs ----------
  const tabs = document.querySelectorAll(".t13-tab");
  const codeEl = document.getElementById("t13Code");
  const tipEl = document.getElementById("t13MethodTip");

  const methodData = {
    inline: {
      code:
`<!-- Inline CSS -->
<p style="color: blue; font-weight: bold;">
  Hello
</p>`,
      tip: "Inline CSS is written directly inside an HTML tag. Quick for small edits, but messy for big projects."
    },
    internal: {
      code:
`<!-- Internal CSS -->
<head>
  <style>
    p { color: blue; font-weight: bold; }
  </style>
</head>`,
      tip: "Internal CSS lives inside a <style> tag in the HTML file. Okay for single-page sites or demos."
    },
    external: {
      code:
`<!-- External CSS (Best Practice) -->
<head>
  <link rel="stylesheet" href="styles.css">
</head>

/* styles.css */
p { color: blue; font-weight: bold; }`,
      tip: "External CSS is stored in a separate .css file. Best for larger sites — reusable, maintainable, and consistent."
    }
  };

  function setActiveTab(key, btn) {
    tabs.forEach(t => {
      t.classList.remove("is-active");
      t.setAttribute("aria-selected", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-selected", "true");
    codeEl.textContent = methodData[key].code;
    tipEl.textContent = methodData[key].tip;
  }

  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      setActiveTab(btn.dataset.method, btn);
    });
  });


  // init tabs
  setActiveTab("external", document.querySelector('.t13-tab[data-method="external"]'));


  // ---------- Style Guide Builder ----------
  const page = document.getElementById("t13Page");
  const chipGroups = document.querySelectorAll(".t13-chips");

  const palette = {
    // Primary
    blueDark: "#123b7a",
    purple: "#5b2aa6",
    teal: "#0b5f6b",
    // Accent
    blueLight: "#4aa3ff",
    pink: "#ff4da6",
    lime: "#7bdc4a",
    // Backgrounds
    gray: "#f2f4f7",
    white: "#ffffff",
    softBlue: "#eef6ff"
  };

  const fonts = {
    sans: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace'
  };

  const shadows = {
    low: "0 8px 16px rgba(0,0,0,.08)",
    mid: "0 10px 24px rgba(0,0,0,.10)",
    high: "0 16px 34px rgba(0,0,0,.14)"
  };

  function setGroupActive(groupEl, activeBtn) {
    groupEl.querySelectorAll(".t13-chip").forEach(b => b.classList.remove("is-active"));
    activeBtn.classList.add("is-active");
  }

  function applyGuide(group, val) {
    if (group === "primary") page.style.setProperty("--primary", palette[val]);
    if (group === "accent") page.style.setProperty("--accent", palette[val]);
    if (group === "bg") page.style.setProperty("--bg", palette[val]);

    if (group === "font") page.style.setProperty("--font", fonts[val]);
    if (group === "radius") page.style.setProperty("--radius", `${val}px`);
    if (group === "shadow") page.style.setProperty("--shadow", shadows[val]);
  }

  chipGroups.forEach(groupEl => {
    groupEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".t13-chip");
      if (!btn) return;
      const group = groupEl.dataset.group;
      const val = btn.dataset.val;

      setGroupActive(groupEl, btn);
      applyGuide(group, val);
    });
  });


  // ---------- Before / After Toggle ----------
  const toggleBtn = document.getElementById("t13Switch");
  const toggleLabel = document.getElementById("t13ToggleLabel");

  function setToggle(isAfter) {
    if (isAfter) {
      page.classList.add("is-after");
      page.classList.remove("is-before");
      toggleBtn.classList.add("is-on");
      toggleBtn.classList.remove("is-off");
      toggleBtn.setAttribute("aria-pressed", "true");
      toggleLabel.textContent = "After (CSS Applied)";
    } else {
      page.classList.add("is-before");
      page.classList.remove("is-after");
      toggleBtn.classList.add("is-off");
      toggleBtn.classList.remove("is-on");
      toggleBtn.setAttribute("aria-pressed", "false");
      toggleLabel.textContent = "Before (Plain HTML)";
    }
  }

  toggleBtn.addEventListener("click", () => {
    const isAfter = page.classList.contains("is-before");
    setToggle(isAfter);
  });


  // init toggle on AFTER
  setToggle(true);
});

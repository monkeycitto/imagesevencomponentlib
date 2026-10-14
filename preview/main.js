const root = document.documentElement;
const toggle = document.querySelector("[data-theme-toggle]");

function syncThemeButton() {
  const dark = root.dataset.theme === "dark";
  toggle.setAttribute("aria-pressed", String(dark));
  toggle.textContent = dark ? "Light mode" : "Dark mode";
}

toggle.addEventListener("click", () => {
  if (root.dataset.theme === "dark") {
    root.removeAttribute("data-theme");
    localStorage.setItem("is-theme", "light");
  } else {
    root.dataset.theme = "dark";
    localStorage.setItem("is-theme", "dark");
  }
  syncThemeButton();
  refreshChartTheme();
});

syncThemeButton();

const navLinks = [...document.querySelectorAll(".docs-nav a.navlink")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.removeAttribute("aria-current"));
      const current = navLinks.find((link) => link.getAttribute("href") === `#${entry.target.id}`);
      if (current) current.setAttribute("aria-current", "true");
    });
  },
  { rootMargin: "-20% 0px -65% 0px", threshold: 0.01 }
);

sections.forEach((section) => spy.observe(section));

document.querySelectorAll(".m-burger").forEach((button) => {
  button.addEventListener("click", () => {
    const nav = button.closest(".m-nav");
    const open = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(open));
  });
});

document.querySelectorAll("[data-menu]").forEach((menu) => {
  const button = menu.querySelector("button");
  const pop = menu.querySelector(".menu-pop");
  button.addEventListener("click", () => {
    const willOpen = pop.hidden;
    document.querySelectorAll(".menu-pop").forEach((other) => {
      other.hidden = true;
    });
    pop.hidden = !willOpen;
    button.setAttribute("aria-expanded", String(willOpen));
  });
});

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-menu]")) return;
  document.querySelectorAll(".menu-pop").forEach((pop) => {
    pop.hidden = true;
  });
  document.querySelectorAll("[data-menu] button").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-tabs]").forEach((group) => {
  const tabs = [...group.querySelectorAll("[role='tab']")];
  const panels = [...group.querySelectorAll("[role='tabpanel']")];
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.setAttribute("aria-selected", "false"));
      tab.setAttribute("aria-selected", "true");
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== tab.dataset.tab;
      });
    });
  });
});

document.querySelectorAll("[data-segment]").forEach((group) => {
  const buttons = [...group.querySelectorAll("button")];
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.setAttribute("aria-selected", "false"));
      button.setAttribute("aria-selected", "true");
    });
  });
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const on = chip.classList.toggle("is-on");
    chip.setAttribute("aria-pressed", String(on));
  });
});

document.querySelectorAll(".switch").forEach((control) => {
  control.addEventListener("click", () => {
    const on = control.getAttribute("aria-pressed") !== "true";
    control.setAttribute("aria-pressed", String(on));
  });
});

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  document.querySelector(".toaster").appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function bindCommand(menu) {
  const input = menu.querySelector("[data-cmd-input]");
  const empty = menu.querySelector("[data-cmd-empty]");
  const items = () => [...menu.querySelectorAll("[data-cmd-item]")];
  const groups = () => [...menu.querySelectorAll("[data-cmd-group]")];

  function visibleItems() {
    return items().filter((item) => !item.hidden);
  }

  function selectItem(item) {
    items().forEach((entry) => entry.setAttribute("aria-selected", entry === item ? "true" : "false"));
  }

  function filterItems() {
    const query = (input?.value || "").trim().toLowerCase();
    items().forEach((item) => {
      const label = (item.dataset.label || item.textContent || "").toLowerCase();
      item.hidden = query.length > 0 && !label.includes(query);
    });
    groups().forEach((group) => {
      const anyVisible = [...group.querySelectorAll("[data-cmd-item]")].some((item) => !item.hidden);
      group.hidden = !anyVisible;
    });
    const visible = visibleItems();
    if (empty) empty.hidden = visible.length > 0;
    selectItem(visible[0] || null);
  }

  items().forEach((item) => {
    item.setAttribute("role", "option");
    item.addEventListener("mouseenter", () => selectItem(item));
    item.addEventListener("click", () => {
      showToast(item.dataset.toast || "Done");
      const overlay = menu.closest("[data-cmd-overlay]");
      if (overlay) overlay.hidden = true;
    });
  });

  input?.addEventListener("input", filterItems);
  menu.addEventListener("keydown", (event) => {
    const visible = visibleItems();
    if (!visible.length) return;
    const current = visible.findIndex((item) => item.getAttribute("aria-selected") === "true");
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = event.key === "ArrowDown"
        ? Math.min(visible.length - 1, current + 1)
        : Math.max(0, current - 1);
      selectItem(visible[nextIndex]);
      visible[nextIndex].scrollIntoView({ block: "nearest" });
    }
    if (event.key === "Enter") {
      event.preventDefault();
      (visible[current] || visible[0]).click();
    }
  });

  filterItems();
}

document.querySelectorAll("[data-cmd]").forEach(bindCommand);

const commandOverlay = document.querySelector("[data-cmd-overlay]");

function openCommandMenu() {
  commandOverlay.hidden = false;
  const input = commandOverlay.querySelector("[data-cmd-input]");
  input.value = "";
  input.dispatchEvent(new Event("input"));
  input.focus();
}

document.querySelector("[data-open-cmd]").addEventListener("click", openCommandMenu);
commandOverlay.addEventListener("click", (event) => {
  if (event.target === commandOverlay) commandOverlay.hidden = true;
});

const modal = document.querySelector("[data-modal]");
document.querySelector("[data-open-modal]").addEventListener("click", () => {
  modal.hidden = false;
  modal.querySelector("[data-close-modal]").focus();
});
modal.addEventListener("click", (event) => {
  if (event.target === modal || event.target.closest("[data-close-modal]")) modal.hidden = true;
});

document.querySelector("[data-toast]").addEventListener("click", () => {
  showToast("Meeting request saved.");
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (commandOverlay.hidden) openCommandMenu();
    else commandOverlay.hidden = true;
    return;
  }
  if (event.key !== "Escape") return;
  const openDate = document.querySelector(".date-pop:not([hidden])");
  if (openDate) {
    openDate.hidden = true;
    openDate.closest("[data-date]")?.querySelector("[data-date-trigger]")?.setAttribute("aria-expanded", "false");
    return;
  }
  const openLayer = document.querySelector("[data-layer]:not([hidden])");
  if (openLayer) {
    openLayer.hidden = true;
    return;
  }
  if (!commandOverlay.hidden) {
    commandOverlay.hidden = true;
    return;
  }
  modal.hidden = true;
  document.querySelectorAll(".menu-pop").forEach((pop) => {
    pop.hidden = true;
  });
});

const TODAY = new Date(2026, 9, 12);
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEK = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const SCHOOL_EVENTS = {
  "2026-10-06": ["Open morning"],
  "2026-10-12": ["Board pack due"],
  "2026-10-15": ["Parent tour", "Year 7 briefing"],
  "2026-10-21": ["Narrative review"],
  "2026-10-28": ["Enrolment evening"],
  "2026-11-04": ["Studio visit"],
};

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function iso(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function parseISO(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatAU(date) {
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return startOfDay(next);
}

function sameDay(a, b) {
  return Boolean(a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate());
}

function mondayOffset(date) {
  return (date.getDay() + 6) % 7;
}

function presetRange(name) {
  const year = TODAY.getFullYear();
  const month = TODAY.getMonth();
  switch (name) {
    case "today":
      return [TODAY, TODAY];
    case "last-7":
      return [addDays(TODAY, -6), TODAY];
    case "last-30":
      return [addDays(TODAY, -29), TODAY];
    case "this-month":
      return [new Date(year, month, 1), new Date(year, month + 1, 0)];
    case "last-month":
      return [new Date(year, month - 1, 1), new Date(year, month, 0)];
    case "this-quarter": {
      const quarter = Math.floor(month / 3) * 3;
      return [new Date(year, quarter, 1), new Date(year, quarter + 3, 0)];
    }
    default: {
      const unknown = name;
      throw new Error(`Unknown preset ${unknown}`);
    }
  }
}

function assertDateMode(mode) {
  switch (mode) {
    case "single":
    case "range":
    case "inline":
    case "month":
    case "week":
      return mode;
    default: {
      const unknown = mode;
      throw new Error(`Unknown date mode ${unknown}`);
    }
  }
}

function mountDate(root) {
  const mode = assertDateMode(root.dataset.date);
  const body = root.querySelector("[data-date-body]");
  const events = root.dataset.events === "school" ? SCHOOL_EVENTS : null;
  const state = {
    value: root.dataset.value ? parseISO(root.dataset.value.length === 7 ? `${root.dataset.value}-01` : root.dataset.value) : null,
    start: root.dataset.start ? parseISO(root.dataset.start) : null,
    end: root.dataset.end ? parseISO(root.dataset.end) : null,
    view: TODAY,
    min: root.dataset.min ? parseISO(root.dataset.min) : null,
    max: root.dataset.max ? parseISO(root.dataset.max) : null,
    preset: root.dataset.preset || "",
  };
  const anchor = state.value || state.start || TODAY;
  state.view = new Date(anchor.getFullYear(), anchor.getMonth(), 1);

  function orderedRange() {
    if (!state.start || !state.end) return [state.start, state.end];
    return state.start <= state.end ? [state.start, state.end] : [state.end, state.start];
  }

  function matchingPreset() {
    const [start, end] = orderedRange();
    if (!start || !end) return "";
    const names = ["today", "last-7", "last-30", "this-month", "last-month", "this-quarter"];
    return names.find((name) => {
      const [from, to] = presetRange(name);
      return sameDay(start, from) && sameDay(end, to);
    }) || "";
  }

  function writeLabel() {
    const label = root.querySelector("[data-date-label]");
    const trigger = root.querySelector(".date-trigger");
    if (!label) return;
    if (mode === "range") {
      const [start, end] = orderedRange();
      label.textContent = start && end ? `${formatAU(start)} – ${formatAU(end)}` : start ? formatAU(start) : "Choose a range";
      trigger?.classList.toggle("is-placeholder", !start);
      return;
    }
    if (mode === "month") {
      label.textContent = `${MONTHS[state.view.getMonth()]} ${state.view.getFullYear()}`;
      return;
    }
    label.textContent = state.value ? formatAU(state.value) : "Choose a day";
    trigger?.classList.toggle("is-placeholder", !state.value);
  }

  function writeAgenda() {
    const slot = root.querySelector("[data-date-agenda]");
    if (!slot) return;
    const day = state.value;
    if (!day) {
      slot.textContent = "";
      return;
    }
    const items = events?.[iso(day)] || [];
    slot.replaceChildren();
    const title = document.createElement("p");
    title.className = "ui-headline";
    title.textContent = formatAU(day);
    slot.appendChild(title);
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "ui-footnote";
      empty.style.color = "var(--muted)";
      empty.textContent = "Nothing scheduled.";
      slot.appendChild(empty);
      return;
    }
    items.forEach((item) => {
      const line = document.createElement("p");
      line.className = "ui-body";
      line.textContent = item;
      slot.appendChild(line);
    });
  }

  function dayButton(day, month) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cal-day";
    button.dataset.day = iso(day);
    button.textContent = String(day.getDate());
    if (month !== undefined && day.getMonth() !== month) button.classList.add("is-out");
    if (sameDay(day, TODAY)) button.classList.add("is-today");
    if ((state.min && day < state.min) || (state.max && day > state.max)) button.disabled = true;
    if (events?.[iso(day)]) {
      const dot = document.createElement("i");
      dot.className = "cal-dot";
      button.appendChild(dot);
    }
    if (mode === "range") {
      const [start, end] = orderedRange();
      if (start && end && day > start && day < end) button.classList.add("is-in");
      if (sameDay(day, start)) button.classList.add("is-selected", "is-start");
      if (sameDay(day, end) || (sameDay(day, start) && !end)) button.classList.add("is-selected", "is-end");
    } else if (sameDay(day, state.value)) {
      button.classList.add("is-selected");
    }
    return button;
  }

  function monthBlock(view) {
    const wrap = document.createElement("div");
    wrap.className = "cal";
    const head = document.createElement("div");
    head.className = "cal-head";
    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "cal-nav";
    prev.dataset.nav = "-1";
    prev.setAttribute("aria-label", "Previous month");
    prev.textContent = "‹";
    const title = document.createElement("p");
    title.className = "ui-headline";
    title.textContent = `${MONTHS[view.getMonth()]} ${view.getFullYear()}`;
    const next = document.createElement("button");
    next.type = "button";
    next.className = "cal-nav";
    next.dataset.nav = "1";
    next.setAttribute("aria-label", "Next month");
    next.textContent = "›";
    if (mode === "range") next.hidden = view.getMonth() !== state.view.getMonth() || view.getFullYear() !== state.view.getFullYear();
    if (mode === "range" && (view.getMonth() !== state.view.getMonth() || view.getFullYear() !== state.view.getFullYear())) prev.hidden = true;
    head.append(prev, title, next);
    const grid = document.createElement("div");
    grid.className = "cal-grid";
    WEEK.forEach((name) => {
      const cell = document.createElement("span");
      cell.className = "cal-dow";
      cell.textContent = name;
      grid.appendChild(cell);
    });
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const start = addDays(first, -mondayOffset(first));
    for (let index = 0; index < 42; index += 1) grid.appendChild(dayButton(addDays(start, index), view.getMonth()));
    wrap.append(head, grid);
    return wrap;
  }

  function render() {
    if (!body) return;
    body.replaceChildren();
    if (mode === "month") {
      const head = document.createElement("div");
      head.className = "cal-head";
      const prev = document.createElement("button");
      prev.type = "button";
      prev.className = "cal-nav";
      prev.dataset.year = "-1";
      prev.setAttribute("aria-label", "Previous year");
      prev.textContent = "‹";
      const title = document.createElement("p");
      title.className = "ui-headline";
      title.textContent = String(state.view.getFullYear());
      const next = document.createElement("button");
      next.type = "button";
      next.className = "cal-nav";
      next.dataset.year = "1";
      next.setAttribute("aria-label", "Next year");
      next.textContent = "›";
      head.append(prev, title, next);
      const grid = document.createElement("div");
      grid.className = "month-grid";
      MONTHS_SHORT.forEach((name, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "month-btn";
        button.dataset.month = String(index);
        button.textContent = name;
        if (index === state.view.getMonth()) button.classList.add("is-selected");
        grid.appendChild(button);
      });
      body.append(head, grid);
    } else if (mode === "week") {
      const current = state.value || TODAY;
      const monday = addDays(current, -mondayOffset(current));
      const head = document.createElement("div");
      head.className = "cal-head";
      const prev = document.createElement("button");
      prev.type = "button";
      prev.className = "cal-nav";
      prev.dataset.week = "-1";
      prev.setAttribute("aria-label", "Previous week");
      prev.textContent = "‹";
      const title = document.createElement("p");
      title.className = "ui-headline";
      title.textContent = `${formatAU(monday)} – ${formatAU(addDays(monday, 6))}`;
      const next = document.createElement("button");
      next.type = "button";
      next.className = "cal-nav";
      next.dataset.week = "1";
      next.setAttribute("aria-label", "Next week");
      next.textContent = "›";
      head.append(prev, title, next);
      const grid = document.createElement("div");
      grid.className = "week-grid";
      for (let index = 0; index < 7; index += 1) {
        const day = addDays(monday, index);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "week-day";
        button.dataset.day = iso(day);
        button.textContent = String(day.getDate());
        if (sameDay(day, TODAY)) button.classList.add("is-today");
        if (sameDay(day, state.value)) button.classList.add("is-selected");
        grid.appendChild(button);
      }
      body.append(head, grid);
    } else if (mode === "range") {
      const layout = document.createElement("div");
      layout.className = "date-range";
      const presets = document.createElement("div");
      presets.className = "date-presets";
      [
        ["today", "Today"],
        ["last-7", "Last 7 days"],
        ["last-30", "Last 30 days"],
        ["this-month", "This month"],
        ["last-month", "Last month"],
        ["this-quarter", "This quarter"],
      ].forEach(([name, text]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.preset = name;
        button.textContent = text;
        button.setAttribute("aria-pressed", matchingPreset() === name ? "true" : "false");
        presets.appendChild(button);
      });
      const months = document.createElement("div");
      months.className = "date-months";
      const right = new Date(state.view.getFullYear(), state.view.getMonth() + 1, 1);
      months.append(monthBlock(state.view), monthBlock(right));
      layout.append(presets, months);
      body.appendChild(layout);
    } else {
      body.appendChild(monthBlock(state.view));
    }
    writeLabel();
    writeAgenda();
    const error = root.querySelector(".err");
    const trigger = root.querySelector(".date-trigger");
    if (root.hasAttribute("data-required") && trigger) {
      const missing = mode === "range" ? !state.start : !state.value;
      trigger.classList.toggle("is-invalid", missing);
      trigger.setAttribute("aria-invalid", missing ? "true" : "false");
      if (error) error.hidden = !missing;
    }
  }

  function chooseDay(day) {
    if (mode === "range") {
      if (!state.start || state.end) {
        state.start = day;
        state.end = null;
      } else {
        state.end = day;
      }
      state.preset = matchingPreset();
    } else {
      state.value = day;
      state.view = new Date(day.getFullYear(), day.getMonth(), 1);
      const pop = root.querySelector(".date-pop");
      if (pop) {
        pop.hidden = true;
        root.querySelector("[data-date-trigger]")?.setAttribute("aria-expanded", "false");
      }
    }
    render();
  }

  body?.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target || !body.contains(target)) return;
    if (target.dataset.nav) {
      state.view = new Date(state.view.getFullYear(), state.view.getMonth() + Number(target.dataset.nav), 1);
      render();
      return;
    }
    if (target.dataset.year) {
      state.view = new Date(state.view.getFullYear() + Number(target.dataset.year), state.view.getMonth(), 1);
      render();
      return;
    }
    if (target.dataset.week) {
      state.value = addDays(state.value || TODAY, Number(target.dataset.week) * 7);
      render();
      return;
    }
    if (target.dataset.month) {
      state.view = new Date(state.view.getFullYear(), Number(target.dataset.month), 1);
      state.value = state.view;
      render();
      return;
    }
    if (target.dataset.preset) {
      const [start, end] = presetRange(target.dataset.preset);
      state.start = start;
      state.end = end;
      state.view = new Date(start.getFullYear(), start.getMonth(), 1);
      render();
      return;
    }
    if (target.dataset.day && !target.disabled) chooseDay(parseISO(target.dataset.day));
  });

  root.querySelector("[data-date-trigger]")?.addEventListener("click", () => {
    const pop = root.querySelector(".date-pop");
    if (!pop) return;
    const willOpen = pop.hidden;
    document.querySelectorAll(".date-pop").forEach((other) => {
      other.hidden = true;
    });
    pop.hidden = !willOpen;
    root.querySelector("[data-date-trigger]").setAttribute("aria-expanded", String(willOpen));
  });

  root.querySelector("[data-date-clear]")?.addEventListener("click", () => {
    state.value = null;
    state.start = null;
    state.end = null;
    render();
  });

  render();
}

document.querySelectorAll("[data-date]").forEach(mountDate);

document.addEventListener("click", (event) => {
  document.querySelectorAll("[data-date]").forEach((root) => {
    if (root.contains(event.target)) return;
    const pop = root.querySelector(".date-pop");
    if (!pop) return;
    pop.hidden = true;
    root.querySelector("[data-date-trigger]")?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const layer = document.querySelector(`[data-layer="${button.dataset.open}"]`);
    if (layer) layer.hidden = false;
  });
});

document.querySelectorAll("[data-layer]").forEach((layer) => {
  layer.addEventListener("click", (event) => {
    if (event.target === layer || event.target.closest("[data-close]")) layer.hidden = true;
  });
});

document.querySelectorAll("[data-tree]").forEach((button) => {
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    const list = button.parentElement.querySelector(":scope > ul");
    if (list) list.hidden = !open;
  });
});

document.querySelectorAll("[data-carousel]").forEach((root) => {
  const track = root.querySelector(".carousel-track");
  const slides = [...track.children];
  let index = 0;
  function go(next) {
    index = (next + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    root.querySelectorAll("[data-dot]").forEach((dot, dotIndex) => {
      dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
    });
  }
  root.querySelector("[data-carousel-prev]")?.addEventListener("click", () => go(index - 1));
  root.querySelector("[data-carousel-next]")?.addEventListener("click", () => go(index + 1));
  root.querySelectorAll("[data-dot]").forEach((dot) => {
    dot.addEventListener("click", () => go(Number(dot.dataset.dot)));
  });
});

document.querySelectorAll("[data-files]").forEach((input) => {
  const drop = input.closest(".drop");
  const list = drop.parentElement.querySelector("[data-file-list]");
  function add(file) {
    const row = document.createElement("div");
    row.className = "file-row";
    const name = document.createElement("span");
    name.className = "ui-body";
    name.textContent = file.name;
    const bar = document.createElement("span");
    bar.className = "file-bar";
    const fill = document.createElement("i");
    fill.style.setProperty("--w", "100%");
    bar.appendChild(fill);
    row.append(name, bar);
    list.appendChild(row);
  }
  input.addEventListener("change", () => {
    [...input.files].forEach(add);
    input.value = "";
  });
  ["dragenter", "dragover"].forEach((type) => drop.addEventListener(type, (event) => {
    event.preventDefault();
    drop.classList.add("is-over");
  }));
  ["dragleave", "drop"].forEach((type) => drop.addEventListener(type, (event) => {
    event.preventDefault();
    drop.classList.remove("is-over");
  }));
  drop.addEventListener("drop", (event) => {
    [...event.dataTransfer.files].forEach(add);
  });
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.parentElement.querySelector("code")?.textContent || "";
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied.");
    } catch (error) {
      showToast("Select the line to copy it.");
    }
  });
});

document.querySelectorAll("[data-colours]").forEach((root) => {
  const output = root.querySelector("[data-colour-value]");
  root.querySelectorAll("[data-colour]").forEach((button) => {
    button.addEventListener("click", () => {
      root.querySelectorAll("[data-colour]").forEach((item) => item.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");
      if (output) output.textContent = button.dataset.colour;
    });
  });
});

document.querySelectorAll("[data-thread]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    const text = input.value.trim();
    if (!text) return;
    const message = document.createElement("div");
    message.className = "msg is-mine";
    const bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    const line = document.createElement("p");
    line.className = "ui-body";
    line.textContent = text;
    bubble.appendChild(line);
    message.appendChild(bubble);
    form.before(message);
    input.value = "";
  });
});

document.querySelectorAll("[data-dismiss]").forEach((button) => {
  button.addEventListener("click", () => button.closest("[data-note-item]")?.remove());
});

document.querySelectorAll("[data-select-table] tbody tr").forEach((row) => {
  row.addEventListener("click", (event) => {
    const box = row.querySelector('input[type="checkbox"]');
    if (!box) return;
    if (event.target !== box) box.checked = !box.checked;
    row.classList.toggle("is-selected", box.checked);
  });
});

const studioCharts = [];

function chartToken(name) {
  return getComputedStyle(root).getPropertyValue(name).trim();
}

function chartTone() {
  return {
    text: chartToken("--muted"),
    grid: chartToken("--line"),
    surface: chartToken("--surface"),
    font: getComputedStyle(document.body).fontFamily,
  };
}

function fadeColour(hex, alpha) {
  const value = hex.replace("#", "");
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function secondaryColours() {
  return [
    chartToken("--turquoise"),
    chartToken("--chartreuse"),
    chartToken("--citrine"),
    chartToken("--magenta"),
    chartToken("--turmeric"),
    chartToken("--amethyst"),
  ];
}

function axisScale(beginAtZero) {
  const tone = chartTone();
  return {
    beginAtZero,
    ticks: { color: tone.text, font: { family: tone.font, size: 12 } },
    grid: { color: tone.grid },
    border: { display: false },
  };
}

function radialScale() {
  const tone = chartTone();
  return {
    r: {
      angleLines: { color: tone.grid },
      grid: { color: tone.grid },
      pointLabels: { color: tone.text, font: { family: tone.font, size: 12 } },
      ticks: { color: tone.text, backdropColor: "transparent" },
    },
  };
}

function chartOptions(scales, aspectRatio) {
  const tone = chartTone();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio,
    animation: reduce ? false : { duration: 1000, easing: "easeOutQuart" },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: tone.text,
          boxWidth: 12,
          boxHeight: 12,
          font: { family: tone.font, size: 12 },
        },
      },
    },
  };
  if (scales) options.scales = scales;
  return options;
}

function chartConfig(kind, colours) {
  const practices = ["Narrative", "Identity", "Enrolment", "Workshops", "Brand", "Alumni"];
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const tone = chartTone();
  const [turquoise, chartreuse, , magenta, turmeric, amethyst] = colours;

  switch (kind) {
    case "bar":
      return {
        type: "bar",
        data: {
          labels: practices,
          datasets: [
            {
              label: "Projects this term",
              data: [18, 12, 9, 14, 7, 5],
              backgroundColor: colours.map((colour) => fadeColour(colour, 0.75)),
              borderColor: colours,
              borderWidth: 1,
            },
          ],
        },
        options: chartOptions({ x: axisScale(false), y: axisScale(true) }, 1.6),
      };
    case "bubble":
      return {
        type: "bubble",
        data: {
          datasets: [
            {
              label: "Schools",
              data: [
                { x: 42, y: 38, r: 14, name: "Rangeview" },
                { x: 28, y: 52, r: 10, name: "Harbour" },
                { x: 61, y: 29, r: 18, name: "Northside" },
                { x: 19, y: 64, r: 8, name: "Westfield" },
                { x: 47, y: 44, r: 12, name: "Kings" },
                { x: 33, y: 57, r: 11, name: "Riverside" },
              ],
              backgroundColor: colours.map((colour) => fadeColour(colour, 0.7)),
              borderColor: colours,
              borderWidth: 1,
            },
          ],
        },
        options: {
          ...chartOptions(
            {
              x: { ...axisScale(true), title: { display: true, text: "Enquiries", color: tone.text } },
              y: { ...axisScale(true), title: { display: true, text: "Conversion %", color: tone.text } },
            },
            1.6
          ),
          plugins: {
            ...chartOptions().plugins,
            tooltip: {
              callbacks: {
                label(context) {
                  const point = context.raw;
                  return `${point.name}: ${point.x} enquiries, ${point.y}% conversion`;
                },
              },
            },
          },
        },
      };
    case "doughnut":
      return {
        type: "doughnut",
        data: {
          labels: practices,
          datasets: [
            {
              data: [28, 18, 14, 16, 12, 12],
              backgroundColor: colours,
              borderColor: tone.surface,
              borderWidth: 2,
              hoverOffset: 4,
            },
          ],
        },
        options: chartOptions(undefined, 1.15),
      };
    case "pie":
      return {
        type: "pie",
        data: {
          labels: practices,
          datasets: [
            {
              data: [28, 18, 14, 16, 12, 12],
              backgroundColor: colours,
              borderColor: tone.surface,
              borderWidth: 2,
              hoverOffset: 4,
            },
          ],
        },
        options: chartOptions(undefined, 1.15),
      };
    case "line":
      return {
        type: "line",
        data: {
          labels: months,
          datasets: [
            {
              label: "Enquiries",
              data: [42, 48, 51, 63, 70, 66],
              borderColor: turquoise,
              backgroundColor: turquoise,
              borderWidth: 2,
              tension: 0.1,
              fill: false,
              pointRadius: 3,
              pointHoverRadius: 6,
            },
            {
              label: "Visits",
              data: [18, 22, 20, 31, 38, 34],
              borderColor: magenta,
              backgroundColor: magenta,
              borderWidth: 2,
              tension: 0.1,
              fill: false,
              pointRadius: 3,
              pointHoverRadius: 6,
            },
          ],
        },
        options: chartOptions({ x: axisScale(false), y: axisScale(true) }, 1.6),
      };
    case "mixed":
      return {
        type: "bar",
        data: {
          labels: months,
          datasets: [
            {
              type: "bar",
              label: "Workshops",
              data: [32, 40, 36, 52, 44, 58],
              backgroundColor: fadeColour(turmeric, 0.65),
              borderColor: turmeric,
              borderWidth: 1,
              order: 2,
            },
            {
              type: "line",
              label: "Enquiries",
              data: [42, 48, 51, 63, 70, 66],
              borderColor: turquoise,
              backgroundColor: turquoise,
              borderWidth: 2,
              tension: 0.1,
              fill: false,
              pointRadius: 3,
              pointHoverRadius: 6,
              order: 1,
            },
          ],
        },
        options: chartOptions({ x: axisScale(false), y: axisScale(true) }, 1.6),
      };
    case "polarArea":
      return {
        type: "polarArea",
        data: {
          labels: practices,
          datasets: [
            {
              data: [12, 18, 9, 14, 7, 16],
              backgroundColor: colours.map((colour) => fadeColour(colour, 0.7)),
              borderColor: colours,
              borderWidth: 1,
            },
          ],
        },
        options: chartOptions(radialScale(), 1.15),
      };
    case "radar":
      return {
        type: "radar",
        data: {
          labels: practices,
          datasets: [
            {
              label: "Rangeview",
              data: [72, 64, 80, 58, 70, 66],
              fill: true,
              backgroundColor: fadeColour(turquoise, 0.2),
              borderColor: turquoise,
              pointBackgroundColor: turquoise,
              pointBorderColor: tone.surface,
              pointHoverBackgroundColor: tone.surface,
              pointHoverBorderColor: turquoise,
            },
            {
              label: "Harbour",
              data: [54, 78, 61, 74, 48, 82],
              fill: true,
              backgroundColor: fadeColour(magenta, 0.2),
              borderColor: magenta,
              pointBackgroundColor: magenta,
              pointBorderColor: tone.surface,
              pointHoverBackgroundColor: tone.surface,
              pointHoverBorderColor: magenta,
            },
          ],
        },
        options: chartOptions(radialScale(), 1.15),
      };
    case "scatter":
      return {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Primary",
              data: [
                { x: 14, y: 41 },
                { x: 22, y: 36 },
                { x: 18, y: 55 },
                { x: 27, y: 48 },
                { x: 11, y: 62 },
              ],
              backgroundColor: chartreuse,
              borderColor: chartreuse,
              pointRadius: 6,
              pointHoverRadius: 8,
            },
            {
              label: "Secondary",
              data: [
                { x: 31, y: 28 },
                { x: 44, y: 39 },
                { x: 38, y: 51 },
                { x: 52, y: 33 },
                { x: 47, y: 46 },
              ],
              backgroundColor: amethyst,
              borderColor: amethyst,
              pointRadius: 6,
              pointHoverRadius: 8,
            },
          ],
        },
        options: {
          ...chartOptions(
            {
              x: { ...axisScale(true), title: { display: true, text: "Enquiries", color: tone.text } },
              y: { ...axisScale(true), title: { display: true, text: "Conversion %", color: tone.text } },
            },
            1.6
          ),
        },
      };
    default: {
      throw new Error(`Unknown chart ${kind}`);
    }
  }
}

function refreshChartTheme() {
  const tone = chartTone();
  studioCharts.forEach((chart) => {
    chart.options.color = tone.text;
    if (chart.options.plugins?.legend?.labels) {
      chart.options.plugins.legend.labels.color = tone.text;
    }
    const scales = chart.options.scales || {};
    Object.values(scales).forEach((scale) => {
      if (!scale) return;
      if (scale.ticks) scale.ticks.color = tone.text;
      if (scale.grid) scale.grid.color = tone.grid;
      if (scale.border) scale.border.color = tone.grid;
      if (scale.pointLabels) scale.pointLabels.color = tone.text;
      if (scale.angleLines) scale.angleLines.color = tone.grid;
      if (scale.title) scale.title.color = tone.text;
    });
    if (chart.config.type === "doughnut" || chart.config.type === "pie") {
      chart.data.datasets.forEach((dataset) => {
        dataset.borderColor = tone.surface;
      });
    }
    if (chart.config.type === "radar") {
      chart.data.datasets.forEach((dataset) => {
        dataset.pointBorderColor = tone.surface;
        dataset.pointHoverBackgroundColor = tone.surface;
      });
    }
    chart.update("none");
  });
}

function mountCharts() {
  if (!window.Chart || studioCharts.length) return;
  const colours = secondaryColours();
  Chart.defaults.font.family = chartTone().font;
  Chart.defaults.color = chartTone().text;
  document.querySelectorAll("[data-chart]").forEach((canvas) => {
    studioCharts.push(new Chart(canvas, chartConfig(canvas.dataset.chart, colours)));
  });
}

const chartGrid = document.querySelector(".chart-grid");
if (chartGrid && window.Chart) {
  const chartWatch = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      mountCharts();
      chartWatch.disconnect();
    },
    { threshold: 0.01 }
  );
  chartWatch.observe(chartGrid);
}

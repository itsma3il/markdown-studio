const MAX_MERMAID_CACHE_ENTRIES = 80;

function getMermaidTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "default";
}

function createRenderId() {
  return "mmd-" + Math.random().toString(36).slice(2, 8);
}

function removeDetachedMermaidContainers() {
  document.querySelectorAll('[id^="dmmd-"], [id^="dmermaid-"]').forEach((el) => {
    if (el.parentElement === document.body) el.remove();
  });
}

function trimCache(cache) {
  while (cache.size > MAX_MERMAID_CACHE_ENTRIES) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
}

function getBlock(pre) {
  return pre.closest(".mermaid-block");
}

function clearBlock(block, pre) {
  block
    ?.querySelectorAll(".mermaid-rendered, .mermaid-error")
    .forEach((el) => el.remove());
  pre.classList.remove("mermaid-error");
}

function createErrorEntry(error) {
  return {
    type: "error",
    message: error?.message || "Unable to render this Mermaid diagram.",
  };
}

function renderEntry(pre, entry, key) {
  const block = getBlock(pre);
  clearBlock(block, pre);
  pre.hidden = true;
  pre.dataset.mermaidRenderKey = key;
  if (block) block.dataset.mermaidRenderKey = key;

  if (entry.type === "svg") {
    const div = document.createElement("div");
    div.className = "mermaid-rendered";
    div.innerHTML = entry.svg;
    block ? pre.insertAdjacentElement("afterend", div) : pre.replaceWith(div);
    return;
  }

  const err = document.createElement("div");
  err.className = "mermaid-error";
  const title = document.createElement("div");
  title.className = "mermaid-error-title";
  title.innerHTML = '<i class="ti ti-alert-triangle"></i><span>Mermaid syntax error</span>';
  const message = document.createElement("pre");
  message.className = "mermaid-error-message";
  message.textContent = entry.message;
  err.append(title, message);
  block ? pre.insertAdjacentElement("afterend", err) : pre.replaceWith(err);
}

export function createMermaidRenderer() {
  const cache = new Map();
  const pending = new Map();
  let initializedTheme = null;

  function initialize(theme) {
    if (!window.mermaid || initializedTheme === theme) return;
    if (typeof mermaid.initialize === "function") {
      mermaid.initialize({
        startOnLoad: false,
        theme,
        suppressErrorRendering: true,
      });
    }
    initializedTheme = theme;
  }

  async function getRenderedEntry(code, theme) {
    const key = `${theme}:${code}`;
    if (cache.has(key)) return { key, entry: cache.get(key) };
    if (pending.has(key)) return { key, entry: await pending.get(key) };

    const task = (async () => {
      try {
        const id = createRenderId();
        document.getElementById(`d${id}`)?.remove();
        if (typeof mermaid.parse === "function") {
          await mermaid.parse(code);
        }
        const { svg } = await mermaid.render(id, code);
        document.getElementById(`d${id}`)?.remove();
        removeDetachedMermaidContainers();
        return { type: "svg", svg };
      } catch (error) {
        removeDetachedMermaidContainers();
        return createErrorEntry(error);
      }
    })();

    pending.set(key, task);
    const entry = await task;
    pending.delete(key);
    cache.set(key, entry);
    trimCache(cache);
    return { key, entry };
  }

  async function render(container) {
    if (!window.mermaid || !container) return;
    const pres = container.querySelectorAll("pre.mermaid");
    if (!pres.length) return;

    const theme = getMermaidTheme();
    initialize(theme);

    for (const pre of pres) {
      const code = pre.textContent || "";
      const key = `${theme}:${code}`;
      const block = getBlock(pre);
      const hasRenderedOutput = block?.querySelector(".mermaid-rendered, .mermaid-error");
      if (
        hasRenderedOutput &&
        (block?.dataset.mermaidRenderKey === key || pre.dataset.mermaidRenderKey === key)
      ) {
        continue;
      }

      const rendered = await getRenderedEntry(code, theme);
      renderEntry(pre, rendered.entry, rendered.key);
    }
  }

  function clear() {
    cache.clear();
    pending.clear();
    initializedTheme = null;
  }

  return { render, clear };
}

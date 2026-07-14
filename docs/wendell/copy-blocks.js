/**
 * Classroom HTML helpers:
 * - copy-prompt only → 「複製」button
 * - worksheet → editable dashed answer fields (localStorage)
 */
(function () {
  function textOf(pre) {
    var code = pre.querySelector("code");
    return (code ? code.innerText : pre.innerText).replace(/\n$/, "");
  }

  function shouldCopy(pre) {
    return pre.classList.contains("copy-prompt");
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy") ? resolve() : reject(new Error("copy failed"));
      } catch (e) {
        reject(e);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  function enhanceCopy(pre) {
    if (!shouldCopy(pre)) return;
    if (pre.closest(".copy-block")) return;
    var wrap = document.createElement("div");
    wrap.className = "copy-block";
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "複製";
    btn.setAttribute("aria-label", "複製這段文字");
    wrap.appendChild(btn);

    btn.addEventListener("click", function () {
      var raw = textOf(pre);
      copy(raw).then(
        function () {
          btn.textContent = "已複製";
          btn.classList.add("copied");
          setTimeout(function () {
            btn.textContent = "複製";
            btn.classList.remove("copied");
          }, 1600);
        },
        function () {
          btn.textContent = "失敗";
          setTimeout(function () {
            btn.textContent = "複製";
          }, 1600);
        }
      );
    });
  }

  /** Leave handwriting space after label lines (…： or …？), not after every line. */
  function padTemplate(raw) {
    var lines = raw.replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n");
    if (!lines.length) return "\n\n\n";
    var out = [];
    var i = 0;
    while (i < lines.length) {
      var cur = lines[i];
      if (!cur.trim()) {
        i += 1;
        continue;
      }
      out.push(cur);
      var j = i + 1;
      while (j < lines.length && !lines[j].trim()) j += 1;
      var t = cur.trim();
      var isLabel = /[：:？?]$/.test(t) || /^（/.test(t);
      if (isLabel) {
        out.push("");
        out.push("");
      } else if (/^\d+\.\s*$/.test(t)) {
        out.push("");
      }
      i = j;
    }
    if (!out.length) return "\n\n\n";
    while (out.length && !out[out.length - 1]) out.pop();
    return out.join("\n") + "\n\n";
  }

  function storageKey(index) {
    return "wendell-worksheet:v2:" + location.pathname + "#" + index;
  }

  function autosize(ta) {
    ta.style.height = "auto";
    var min = 112;
    ta.style.height = Math.max(min, ta.scrollHeight) + "px";
  }

  function enhanceWorksheet(pre, index) {
    if (pre.closest(".worksheet-field")) return;
    var template = padTemplate(textOf(pre));
    var key = storageKey(index);
    var saved = null;
    try {
      saved = localStorage.getItem(key);
    } catch (e) {
      saved = null;
    }

    var wrap = document.createElement("div");
    wrap.className = "worksheet-field";

    var label = document.createElement("div");
    label.className = "worksheet-field-label";
    label.textContent = "作答區（可直接打字）";

    var ta = document.createElement("textarea");
    ta.className = "worksheet-input";
    ta.setAttribute("spellcheck", "true");
    ta.setAttribute("aria-label", "作答區");
    ta.placeholder = "在虛線框裡寫下你的問法、觀察或想法…";
    ta.value = saved != null && saved !== "" ? saved : template;
    ta.dataset.template = template;

    var actions = document.createElement("div");
    actions.className = "worksheet-actions";

    var resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "worksheet-reset";
    resetBtn.textContent = "清空重填";
    resetBtn.setAttribute("aria-label", "還原作答區模板");

    actions.appendChild(resetBtn);

    wrap.appendChild(label);
    wrap.appendChild(ta);
    wrap.appendChild(actions);
    pre.parentNode.insertBefore(wrap, pre);
    pre.remove();

    function persist() {
      try {
        localStorage.setItem(key, ta.value);
      } catch (e) {
        /* ignore quota / private mode */
      }
      autosize(ta);
    }

    ta.addEventListener("input", persist);
    resetBtn.addEventListener("click", function () {
      if (ta.value !== template && !window.confirm("確定清空並還原空白模板？已輸入的內容會消失。")) {
        return;
      }
      ta.value = template;
      persist();
      ta.focus();
    });

    autosize(ta);
  }

  document.querySelectorAll("pre").forEach(enhanceCopy);
  document.querySelectorAll("pre.worksheet").forEach(enhanceWorksheet);
})();

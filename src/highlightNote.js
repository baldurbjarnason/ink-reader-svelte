import textQuote from "dom-anchor-text-quote";
import seek from "dom-seek";
import { encode } from "universal-base64url";

export function highlightNote(selector, root, id, note) {
  const seeker = document.createNodeIterator(root, window.NodeFilter.SHOW_TEXT);
  function split(where) {
    const count = seek(seeker, where);
    if (count !== where) {
      // Split the text at the offset
      seeker.referenceNode.splitText(where - count);

      // Seek to the exact offset.
      seek(seeker, where - count);
    }
    return seeker.referenceNode;
  }
  const positions = textQuote.toTextPosition(root, selector);
  const start = split(positions.start);
  split(positions.end - positions.start);
  var nodes = [];
  while (seeker.referenceNode !== start) {
    const node = seeker.previousNode();
    if (node !== start) {
      nodes.push(node);
    }
  }
  for (var i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    // Is this the best class for this. We should probably use [data-somethingsomething]
    if (!node.parentElement.closest(".Highlight")) {
      const highlight = document.createElement("mark");
      highlight.dataset.noteId = id;
      highlight.classList.add("Highlight");
      // Needs to be updated to work with annotations model
      if (note.json.comment) {
        highlight.classList.add("Commented");
      }
      if (note && note.json && note.json.label) {
        highlight.dataset.highlightLabel = note.json.label;
      }
      highlight.root = root;
      // This is a sapper-specific hack.
      highlight.setAttribute("sapper-noscroll", "true");

      node.parentNode.replaceChild(highlight, node);
      highlight.appendChild(node);

      if (i === nodes.length - 1) {
        const span = document.createElement("span");
        span.id = "highlight-" + encode(id);
        span.classList.add("Highlight-anchor");
        highlight.insertAdjacentElement("afterbegin", span);
      }
      // Need to broadcast a custom event that a highlight has been clicked and a function that preprocesses event to get the annotation object
      // This needs to be an anchor that his hidden from view but made visible when focused.
      if (i === 0) {
        const a = document.createElement("a");
        a.href = `${window.location.pathname}#note-${encode(id)}`;
        a.classList.add("Highlight-return-link");
        // Sapper hack
        a.setAttribute("sapper-noscroll", "");
        a.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`;
        a.setAttribute("aria-label", "Go to note in sidebar");
        highlight.insertAdjacentElement("afterend", a);
      }
    }
  }
}
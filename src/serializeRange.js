export function serializeRange(range, note) {
  const placeholder = document.createElement("div");
  const fragment = range.cloneContents();
  fragment.querySelectorAll("[data-reader]").forEach(element => {
    element.parentElement.removeChild(element);
  });
  fragment.querySelectorAll("a.Highlight").forEach(element => {
    element.replaceWith(element.textContent);
  });
  fragment
    .querySelectorAll("[style]")
    .forEach(element => element.removeAttribute("style"));
  placeholder.appendChild(fragment);
  if (note) {
    highlightNote(note["oa:hasSelector"], placeholder, note.id, note);
  }
  return placeholder.innerHTML;
}
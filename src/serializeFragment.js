export function serializeFragment (fragment) {
  fragment.querySelectorAll("[data-reader]").forEach(element => {
    element.parentElement.removeChild(element);
  });
  fragment.querySelectorAll("a.Highlight").forEach(element => {
    element.replaceWith(element.textContent);
  });
  fragment
    .querySelectorAll("[style]")
    .forEach(element => element.removeAttribute("style"));
  const placeholder = document.createElement("div");
  placeholder.appendChild(fragment);
  return placeholder.innerHTML;
}
import textQuote from "dom-anchor-text-quote";
import { create } from "../../../api/create.js";
import { encode } from "universal-base64url";
import {highlightNote} from './highlightNote.js'
import {serializeRange} from './serializeRange.js'
// import { goto } from "@sapper/app";
import { stores } from "../../../stores";
const { updateNotes } = stores();

export function handleHighlight(range, root, chapter, chapterTitle, notesCollection) {
  if (range && root) {
    const selector = textQuote.fromRange(root, range);
    let startLocation;
    if (range.startContainer.nodeType === window.Node.TEXT_NODE) {
      startLocation = range.startContainer.parentElement.closest(
        "[data-location]"
      ).dataset.location;
    } else {
      startLocation = range.startContainer.closest("[data-location]").dataset
        .location;
    }
    let endLocation;
    if (range.endContainer.nodeType === window.Node.TEXT_NODE) {
      endLocation = range.endContainer.parentElement.closest("[data-location]")
        .dataset.location;
    } else {
      endLocation = range.endContainer.closest("[data-location]").dataset
        .location;
    }
    // How do we save the original quote using the annotation model?
    const html = serializeRange(range);
    const content = `<blockquote data-original-quote>${html}</blockquote>`;
    let common = range.commonAncestorContainer;
    if (!common.closest) {
      common = common.parentElement.closest("[data-location]");
    } else {
      common = common.closest("[data-location]");
    }
    const startOffset = common.textContent.indexOf(selector.exact);
    const note = {
      type: "Note",
      noteType: "reader:Highlight",
      inReplyTo: chapter.url,
      "oa:hasSelector": selector,
      json: {
        startOffset,
        startLocation,
        endLocation,
        chapterTitle
      },
      content
    };
    // try {
    //   const contentRange = document.createRange();
    //   console.log(document.querySelector(`[data-location="${startLocation}"]`), document.querySelector(`[data-location="${endLocation}"]`))
    //   contentRange.setStartBefore(
    //     document.querySelector(`[data-location="${startLocation}"]`)
    //   );
    //   contentRange.setEndAfter(
    //     document.querySelector(`[data-location="${endLocation}"]`)
    //   );
    //   // let html = serializeRange(contentRange, note);
    //   // note.content = `<blockquote data-original-quote>${html}</blockquote>`;
    //   console.log(note.content, contentRange)
    // } catch (err) {
    //   console.log(err)
    // }
    const tempId = "temp-" + Math.floor(Math.random() * 10000000000000);
    highlightNote(selector, root, tempId, note);
    // console.log(`${startLocation}–${endLocation}`);
    document.getSelection().collapse(root, 0);
    if (notesCollection) {
      note.json.collection = notesCollection
    }
    return create(note).then(activity => {
      document.querySelectorAll(`[data-note-id="${tempId}"]`).forEach(node => {
        node.dataset.noteId = activity.object.id;
      });
      document.getElementById("highlight-" + encode(tempId)).id =
        "highlight-" + encode(activity.object.id);
      updateNotes.set(activity.object.id);
      document.querySelector(
        `[href="${window.location.pathname}#note-${encode(tempId)}"]`
      ).href = `[href="${window.location.pathname}#note-${encode(
        activity.object.id
      )}"]`;
    });
  }
}

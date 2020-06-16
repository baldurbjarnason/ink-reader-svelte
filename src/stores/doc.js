
import { derived, writable } from 'svelte/store';

export const chapter = writable({type: "Loading", contents: "", stylesheets: []})

const loadingContents = ''
export const contents = derived(chapter, function ($chapter, set) {
  if ($chapter.contents) {
    return set($chapter.contents)
  } else {
    return set(loadingToc)
  }
}, loadingContents)

const loadingToc = {type: 'loading', children: []}
export const toc = derived(chapter, function ($chapter, set) {
  if ($chapter.toc) {
    return set($chapter.toc)
  } else {
    return set(loadingToc)
  }
}, loadingToc)

const loadingDoc =  {type: 'loading', readingOrder: []}
export const doc = derived(chapter, function ($chapter, set) {
  if ($chapter.book) {
    return set($chapter.book)
  } else {
    return set(loadingDoc)
  }
}, loadingDoc)

const loadingNotes =  []
export const notes = derived(chapter, function ($chapter, set) {
  if ($chapter.annotations) {
    return set($chapter.annotations)
  } else {
    return set(loadingNotes)
  }

}, loadingNotes)

export const url = writable('/')
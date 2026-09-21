/** Exact-text replacement, the same contract as a code editor's find/replace. */

export class EditError extends Error {}

function countOccurrences(haystack, needle) {
  let count = 0;
  let from = 0;
  for (;;) {
    const at = haystack.indexOf(needle, from);
    if (at === -1) return count;
    count += 1;
    from = at + needle.length;
  }
}

/**
 * Applies edits in order and returns the new text. Each old_text must match
 * exactly once unless replace_all is set, so an edit can never land on the
 * wrong occurrence.
 */
export function applyEdits(source, edits) {
  return edits.reduce((text, edit, i) => {
    const { old_text: oldText, new_text: newText, replace_all: replaceAll } = edit;
    if (!oldText) throw new EditError(`Edit ${i + 1}: old_text is empty.`);
    const count = countOccurrences(text, oldText);
    if (count === 0) {
      throw new EditError(
        `Edit ${i + 1}: text not found. Read the file again and copy old_text exactly, including whitespace.`,
      );
    }
    if (count > 1 && !replaceAll) {
      throw new EditError(
        `Edit ${i + 1}: text appears ${count} times. Include more surrounding text, or set replace_all.`,
      );
    }
    return text.split(oldText).join(newText);
  }, source);
}

import { describe, test, expect } from 'vitest';
import { applyEdits, EditError } from '../edits.js';

describe('applyEdits', () => {
  const source = 'const title = "Bookkeeping";\nconst cta = "Book a call";\n';

  test('replaces a unique match and leaves the input untouched', () => {
    const out = applyEdits(source, [{ old_text: 'Book a call', new_text: 'Get a quote' }]);
    expect(out).toBe('const title = "Bookkeeping";\nconst cta = "Get a quote";\n');
    expect(source).toContain('Book a call');
  });

  test('applies edits in order', () => {
    const out = applyEdits(source, [
      { old_text: '"Bookkeeping"', new_text: '"Accounting"' },
      { old_text: 'Accounting', new_text: 'UAE Accounting' },
    ]);
    expect(out).toContain('"UAE Accounting"');
  });

  test('fails when the text is not found', () => {
    expect(() => applyEdits(source, [{ old_text: 'nope', new_text: 'x' }])).toThrow(EditError);
  });

  test('fails on an ambiguous match unless replace_all is set', () => {
    const doubled = 'a-b a-b';
    expect(() => applyEdits(doubled, [{ old_text: 'a-b', new_text: 'c' }])).toThrow(/2 times/);
    expect(applyEdits(doubled, [{ old_text: 'a-b', new_text: 'c', replace_all: true }])).toBe('c c');
  });

  test('treats replacement text literally, including $ patterns', () => {
    expect(applyEdits('price', [{ old_text: 'price', new_text: 'AED $& 1,499' }])).toBe('AED $& 1,499');
  });
});

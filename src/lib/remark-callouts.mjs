import { visit } from 'unist-util-visit';

const TYPES = new Set(['note', 'info', 'tip', 'warning', 'important']);
const LABELS = { note: 'Note', info: 'Info', tip: 'Tip', warning: 'Warning', important: 'Important' };

// Turns `> [!warning]` blockquotes into labelled callout boxes.
export default function remarkCallouts() {
  return (tree) => {
    visit(tree, 'blockquote', (node) => {
      const first = node.children[0];
      const text = first?.type === 'paragraph' ? first.children[0] : null;
      if (text?.type !== 'text') return;
      const match = text.value.match(/^\[!(\w+)\]\s*/);
      if (!match) return;
      const type = match[1].toLowerCase();
      if (!TYPES.has(type)) return;

      text.value = text.value.slice(match[0].length);
      if (!text.value) first.children.shift();
      if (first.children.length === 0) node.children.shift();

      node.data = {
        hName: 'aside',
        hProperties: { className: ['callout', `callout-${type}`], role: 'note' },
      };
      node.children.unshift({
        type: 'paragraph',
        data: { hProperties: { className: ['callout-label'] } },
        children: [{ type: 'text', value: LABELS[type] }],
      });
    });
  };
}

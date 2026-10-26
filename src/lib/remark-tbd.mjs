import { visit, SKIP } from 'unist-util-visit';

// `{{TBD}}` marks a gap in the record; show it to readers as a muted "not recorded".
export default function remarkTbd() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === undefined || !node.value.includes('{{TBD}}')) return;
      const parts = node.value.split('{{TBD}}');
      const nodes = parts.flatMap((part, i) => [
        ...(part ? [{ type: 'text', value: part }] : []),
        ...(i < parts.length - 1 ? [{ type: 'html', value: '<span class="tbd">not recorded</span>' }] : []),
      ]);
      parent.children.splice(index, 1, ...nodes);
      return [SKIP, index + nodes.length];
    });
  };
}

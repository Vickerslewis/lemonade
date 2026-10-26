import { visit } from 'unist-util-visit';

// Markdown links like `/seizures/` are written site-relative; prefix them with the deploy base.
export default function remarkBaseLinks({ base = '/' } = {}) {
  const prefix = base.replace(/\/$/, '');
  return (tree) => {
    visit(tree, ['link', 'image'], (node) => {
      if (node.url.startsWith('/') && !node.url.startsWith('//') && !node.url.startsWith(prefix + '/')) {
        node.url = prefix + node.url;
      }
    });
  };
}

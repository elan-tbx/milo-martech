import { createTag } from '../../utils/utils.js';

function getMetadata(el) {
  const metadata = {};
  for (const child of el.children) {
    const key = child.children[0]?.textContent?.trim()?.toLowerCase();
    const value = child.children[1]?.textContent?.trim();
    if (key.match(/^image/)) {
      metadata[key] = child.querySelector('img').src.replace(/\?.*/, '');
    } else {
      metadata[key] = value;
    }
  }
  return metadata;
}

export default function init(el) {
  const metadata = getMetadata(el);

  const preview = createTag('div', {
    class: 'caas-marquee-preview',
    style: `background-image: url(${metadata.image});
            color: ${metadata.textcolor || '#fff'};
        `,
  });

  const title = createTag('h1', { class: 'caas-marquee-title' }, metadata.title);
  const detail = createTag('div', { class: 'caas-marquee-detail' }, metadata.detail);
  const description = createTag('div', { class: 'caas-marquee-description' }, metadata.description);
  const cta = createTag('a', { class: 'cta-link', href: metadata.ctaurl }, metadata.ctatext);
  preview.append(detail, title, description, cta);

  const section = document.querySelector('.section');
  section.prepend(preview);

  // degugging
  console.log(metadata); // eslint-disable-line no-console
}

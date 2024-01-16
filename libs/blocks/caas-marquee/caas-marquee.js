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
  // const marqueeSection = createTag('div', {
  //   class: 'caas-marquee-section',
  //   style: `background-image: url(${metadata.image});
  //           color: ${metadata.textcolor || '#fff'};
  //       `,
  // });

  const image = createTag('img', { class: 'background', src: metadata.image });
  const imageP = createTag('p', null, image);
  const background = createTag('div', { class: 'background' }, imageP);

  const title = createTag('h1', { class: 'heading' }, metadata.title);
  const description = createTag('p', { class: 'text' }, metadata.description);
  const foreground = createTag('div', { class: 'foreground' }, title, description);

  const section = createTag('div', { class: 'caas-marquee-section' });
  section.append(background, foreground);

  // const title = createTag('h1', { class: 'caas-marquee-title' }, metadata.title);
  // const detail = createTag('div', { class: 'caas-marquee-detail' }, metadata.detail);
  // const description = createTag('div', { class: 'caas-marquee-description' }, metadata.description);
  // const cta = createTag('a', { class: 'cta-link', href: metadata.ctaurl }, metadata.ctatext);
  // section.append(detail, title, description, cta);

  const pageSection = document.querySelector('.section');
  pageSection.prepend(section);

  // degugging
  console.log(metadata); // eslint-disable-line no-console
}

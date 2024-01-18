import { createTag } from '../../utils/utils.js';

export default async function init(a) {
  const res = await fetch(a.href);
  const json = await res.json();
  const text = json.tc[0]?.text;
  const UPTEl = createTag('div', { class: 'universal-promo-terms' });
  UPTEl.innerHTML = `<h1>Terms and Conditions</h1>${text}`;
  a.parentElement.replaceChild(UPTEl, a);
}

import { getConfig, loadStyle } from '../../utils/utils.js';
const defaultContext = '{\n\t"formattedPrice": "US$15.99 per month",\n\t"productName": "Photoshop",\n\t"productDescription": "Creative Cloud single-app membership for Photoshop",\n\t"promotionTermLength": 1,\n\t"promotionTermUnit": "Month"\n}';

window.MyNamespace = {};
window.MyNamespace.context = defaultContext;

export default async function init(el) {
  const { miloLibs, codeRoot } = getConfig();
  loadStyle(`${miloLibs || codeRoot}/ui/controls/copyBtn.css`);
  loadStyle(`${miloLibs || codeRoot}/ui/page/page.css`);

  const urls = [
    '/drafts/sarangi/hack/content.json',
    '/drafts/sarangi/hack/layout.json',
  ];
  const fetchPromises = urls.map((url) => fetch(url));

  Promise.all(fetchPromises)
    .then((responses) => {
      // Process the responses
      const dataPromises = responses.map((response) => {
        if (response.ok) {
          return response.json();
        }
        console.error('Error:', response.status);
        return null;
      });

      return Promise.all(dataPromises);
    })
    .then(dataArray => {
      window.dataArray = dataArray;
      window.MyNamespace.data = JSON.parse(dataArray[0].data[0].data);
      let index = 0;
      if(el.classList.contains('right')) {
        index = 1;
      }
      const lt = JSON.parse(dataArray[1].data[index].data);
      window.MyNamespace.layout = lt;
      import('/libs/deps/pandora-bundle.js');
      document.addEventListener('paywallLoaded', (data) => {
        setEditButtons();
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });

}

const setEditButtons = () => {
  const editButtons = document.querySelectorAll('.action-button');
  const handleClick = (e) => {
    const dform = document.querySelector('.dform');
    dform.classList.add('show-dform-edit');
    const pandoraElementType = e.target.parentElement.parentElement.nextElementSibling.getAttribute('data-testid').substring(8);
    const editPandoraEvent = new CustomEvent('editPandoraElement', {
        'detail' : { type: pandoraElementType }
    });
    document.dispatchEvent(editPandoraEvent);
  }
  editButtons.forEach(button => {
    button.addEventListener('click', handleClick);
  });
}

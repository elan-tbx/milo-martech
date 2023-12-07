/* global AdobeDC */

import { createTag, getConfig, loadScript } from '../../utils/utils.js';
// https://gist.github.com/LeverOne/1308368
const uuid = (a, b) => {
  // eslint-disable-next-line
  for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-');
  return b;
};
const API_SOURCE_URL = 'https://acrobatservices.adobe.com/view-sdk/viewer.js';
const PDF_RENDER_DIV_ID = 'adobe-dc-view';
const CLIENT_ID_LIVE = '96e41871f28349e08b3562747a72dc75';

export const getPdfConfig = () => {
  const { env, live } = getConfig();
  const { host, href } = window.location;
  const location = new URL(href);
  const query = location.searchParams.get('env');
  let clientId = 'b4d816cf63e5435b887fa238957786b5' || env.consumer?.pdfViewerClientId || env.pdfViewerClientId;
  let reportSuiteId = env.consumer?.pdfViewerReportSuite || env.pdfViewerReportSuite;

  if (host.includes('hlx.live') || query === 'live') {
    /* c8 ignore next 2 */
    clientId = live?.pdfViewerClientId || CLIENT_ID_LIVE;
    reportSuiteId = live?.pdfViewerReportSuite || env.pdfViewerReportSuite;
  }

  return { clientId, reportSuiteId };
};

const init = async (a) => {
  const url = a?.href;

  if (!url) return;

  const uniqueId = await uuid();
  const id = `${PDF_RENDER_DIV_ID}_${uniqueId}`;
  const pdfViewerDiv = createTag('div', { class: 'pdf-container', id });

  a?.insertAdjacentElement('afterend', pdfViewerDiv);
  a?.remove();

  await loadScript(API_SOURCE_URL);
  const fileName = decodeURI(url?.split('/').pop());
  const { clientId, reportSuiteId } = getPdfConfig();

  /* c8 ignore next 42 */
  const handleViewSdkReady = () => {
    const adobeDCView = new AdobeDC.View(
      {
        clientId,
        divId: id,
        reportSuiteId,
      },
    );
    adobeDCView.previewFile(
      {
        content: { location: { url } },
        metaData: { fileName },
      },
    );

    adobeDCView.registerCallback(
      AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
      (event) => {
        /* eslint-disable-next-line no-underscore-dangle */
        window._satellite?.track('event', {
          xdm: {},
          data: {
            web: { webInteraction: { name: event.type } },
            _adobe_corpnew: { digitalData: event.data },
          },
        });
      },
      {
        listenOn: [
          AdobeDC.View.Enum.PDFAnalyticsEvents.DOCUMENT_OPEN,
          AdobeDC.View.Enum.PDFAnalyticsEvents.PAGE_VIEW,
          AdobeDC.View.Enum.PDFAnalyticsEvents.BOOKMARK_ITEM_CLICK,
          AdobeDC.View.Enum.PDFAnalyticsEvents.DOCUMENT_DOWNLOAD,
          AdobeDC.View.Enum.PDFAnalyticsEvents.DOCUMENT_PRINT,
          AdobeDC.View.Enum.PDFAnalyticsEvents.TEXT_SEARCH,
          AdobeDC.View.Enum.PDFAnalyticsEvents.TEXT_COPY,
          AdobeDC.View.Enum.PDFAnalyticsEvents.ZOOM_LEVEL,
        ],
        enablePDFAnalytics: true,
      },
    );
    document.removeEventListener('adobe_dc_view_sdk.ready', handleViewSdkReady);
  };
  document.addEventListener('adobe_dc_view_sdk.ready', handleViewSdkReady);
};

export default init;

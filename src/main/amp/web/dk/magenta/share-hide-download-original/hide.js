(function () {
  var isQuickSharePage = window.location.pathname.indexOf(Alfresco.constants.QUICKSHARE_URL.replace("{sharedId}", "")) !== -1;

  var isDocumentDetails = window.location.pathname.indexOf("document-details") !== -1;

  if (isQuickSharePage || isDocumentDetails) {
    function handleWebPreview () {
      var preview = Alfresco.util.ComponentManager.findFirst("Alfresco.WebPreview");
      if (preview != null && preview.plugin != null) {
        if (preview.plugin instanceof Alfresco.WebPreview.prototype.Plugins.PdfJs) {
          var plugin = preview.plugin;
          if (!plugin.widgets.downloadButton) {
            return;
          }
          // Get rid of the menu
          plugin.widgets.downloadButton._setMenu([]);

          // Handle "Download PDF" button on non-quickshare (e.g.
          // document-details page).
          // The difference is that the filename must be appended to the URL.
          var nonQuickShareOnDownloadPDFClick = function () {
            var thumbUrl = this.wp.getThumbnailUrl(this.attributes.src);

            // Grab the name from the node header component.
            // Yes, it's an ugly hack, but the PdfJs component clobbers the
            // filename (this.wp.options.name), so we don't have much choice.
            var name = Alfresco.util.ComponentManager.findFirst("Alfresco.component.NodeHeader").options.displayName;

            // Convert the filename to a .pdf filename
            var nameParts = name.split('.');
            if (nameParts.length > 1) {
              nameParts = nameParts.slice(0, -1);
            }
            nameParts.push('pdf');
            var fileNameAsPDF = nameParts.join('.');

            // Append the PDF filename to the thumbnail URL
            thumbUrl = thumbUrl.replace('/pdf\?', '/pdf/' + encodeURIComponent(fileNameAsPDF) + '?');
            window.location.href = thumbUrl + "&a=true";
          };

          // If we are not on the quickshare page, then use a special
          // onDownloadPDFClick handler.
          var onDownloadPDFClick = isQuickSharePage ? Alfresco.WebPreview.prototype.Plugins.PdfJs.prototype.onDownloadPDFClick : nonQuickShareOnDownloadPDFClick;

          // Choose the onClick based on whether this is a PDF thumbnail or not.
          var onClick = plugin.attributes.src ? onDownloadPDFClick : Alfresco.WebPreview.prototype.Plugins.PdfJs.prototype.onDownloadClick;

          // Set the title of the button to "Download PDF"
          // Note that we have to include the icon here as setting the label
          // clears the innerHTML.
          plugin.widgets.downloadButton._setLabel('<img src="' + Alfresco.constants.URL_CONTEXT + 'res/components/documentlibrary/actions/document-download-16.png" align="top" height="16"/> ' + plugin.wp.msg("link.downloadPdf"));

          // Add a click handler
          plugin.widgets.downloadButton._setOnClick({
            fn: onClick,
            scope: plugin
          });

          // Override the click handler for Download PDF
        }
        clearInterval(intervalId);
      }
    }

    // Keep checking until the web preview component is loaded
    var intervalId = setInterval(handleWebPreview, 100);
  }
})();



(function () {
  // Redmine issue #15066
  // Override the previewer to set element height using !important style.
  // This is due to a problem with tablet.css where it specifies the CSS rule:
  /*
  .web-preview .previewer
  {
    height: auto !important;
  }
  */
  // That causes the PDF previewer's height to be too small on iPhone/Android.
  Alfresco.WebPreview.prototype.Plugins.PdfJs.prototype._setPreviewerElementHeight = function ()
  {
    // Is the viewer maximized?
    if (!this.maximized)
    {
      var dialogPane;
      if (this.inDashlet)
      {
        this.wp.getPreviewerElement().setAttribute('style', 'height: ' + (Dom.getClientHeight() - 64) + "px !important");
      }
      else if (dialogPane = Dom.getAncestorByClassName(this.wp.getPreviewerElement(), "dijitDialogPaneContent"))
      {
        var h = Dom.getStyle(dialogPane, "height");
        var previewHeight = (parseInt(h)-42) + "px";
        this.wp.getPreviewerElement().setAttribute('style', 'height: ' + previewHeight + " !important");
      }
      else
      {
        var sourceYuiEl = new YAHOO.util.Element(this.wp.getPreviewerElement()),
            docHeight = Dom.getDocumentHeight(),
            clientHeight = Dom.getClientHeight();
        // Take the smaller of the two
        var previewHeight = ((docHeight < clientHeight) ? docHeight : clientHeight) - 220;
        // Leave space for header etc.
        this.wp.getPreviewerElement().setAttribute('style', 'height: ' + previewHeight + "px !important");
      }
    }
    else if (this.fullscreen)
    {
      // Do nothing
    }
    else
    {
      this.wp.getPreviewerElement().setAttribute('style', 'height: ' + (window.innerHeight || Dom.getViewportHeight()).toString() + "px !important");
    }
  };
})();
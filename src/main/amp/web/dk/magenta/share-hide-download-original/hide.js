// Check if we are on the quickshare page
if (window.location.pathname.indexOf(Alfresco.constants.QUICKSHARE_URL.replace("{sharedId}", "")) !== -1) {
  // Keep checking until the web preview component is loaded
  var intervalId = setInterval(function () {
    var preview = Alfresco.util.ComponentManager.findFirst("Alfresco.WebPreview");
    if (preview != null && preview.plugin != null) {
      if (preview.plugin instanceof Alfresco.WebPreview.prototype.Plugins.PdfJs) {
        var plugin = preview.plugin;
        if (!plugin.widgets.downloadButton) {
          return;
        }
        // Get rid of the menu
        plugin.widgets.downloadButton._setMenu([]);

        // Choose the onClick based on whether this is a PDF thumbnail or not.
        var onClick = plugin.attributes.src ? Alfresco.WebPreview.prototype.Plugins.PdfJs.prototype.onDownloadPDFClick : Alfresco.WebPreview.prototype.Plugins.PdfJs.prototype.onDownloadClick;

        // Set the title of the button to "Download PDF"
        // Note that we have to include the icon here as setting the label
        // clears the innerHTML.
        plugin.widgets.downloadButton._setLabel('<img src="' + Alfresco.constants.URL_CONTEXT + 'res/components/documentlibrary/actions/document-download-16.png" align="top" height="16"/> ' + plugin.wp.msg("link.downloadPdf"));

        // Add a click handler
        plugin.widgets.downloadButton._setOnClick({
          fn: onClick,
          scope: plugin
        });
        clearInterval(intervalId);
      } else {
        clearInterval(intervalId);
      }
    }
  }, 50);
}
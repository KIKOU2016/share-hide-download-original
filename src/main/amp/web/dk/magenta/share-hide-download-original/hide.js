// Check if we are on the quickshare page
if (window.location.pathname.indexOf(Alfresco.constants.QUICKSHARE_URL.replace("{sharedId}", "")) !== -1) {
  var preview = Alfresco.util.ComponentManager.findFirst("Alfresco.WebPreview");
  if (preview != null && preview.plugin != null && preview.plugin instanceof Alfresco.WebPreview.prototype.Plugins.PdfJs) {
    var plugin = preview.plugin;
    items = plugin.widgets.downloadButton.getMenu().getItems();
    if (items.length == 2) {
      // Remove the first item from the menu if there are two items.
      plugin.widgets.downloadButton.getMenu().removeItem(items[0], 0);
    }
  }
}
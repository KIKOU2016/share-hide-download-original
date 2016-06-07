Alfresco Share module to hide the "Download Original" button from the Quickshare/Document details page
======================================================================================================

In fact, the "Download" button is replaced with a "Download PDF" button 
which immediately opens the PDF version when clicked, no matter if the 
document is originally a PDF or not.

Additionally, URLs to Download PDF on document-details are formed such
that the filename is included in the URL.

Use `mvn package` to build an AMP file in the target directory.

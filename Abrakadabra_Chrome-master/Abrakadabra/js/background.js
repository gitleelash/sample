function checkForValidUrl(tabId, changeInfo, tab) {
  var sites=new Array("vk.com","facebook.com","mail.google.com","imo.im");
  for(var i=0;i<4;i++){
	if(tab.url.indexOf(sites[i])>-1) chrome.pageAction.show(tabId);
  }
};

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (request.method == "getLocalStorage")
            {	
				sendResponse({ data: localStorage[request.key] });
            }
            else
             sendResponse({}); 
});

//chrome.tabs.onUpdated.addListener(checkForValidUrl);
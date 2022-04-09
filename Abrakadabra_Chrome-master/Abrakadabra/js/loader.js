
var run=false;
var checkselected=true;
var input_check=false;

var storage = {
    set: function (key, value) {
        localStorage[key] = value;
    },
    get: function (key) {
        return localStorage[key];
    }
};

function getPageLogClass(){
	var site=document.location.href;
	var log=new String();
	if(site.indexOf("vk.com")>-1) log=".fc_tab_log_msgs";
	else if(site.indexOf("mail.google.com")>-1) log=".Z8Dgfe";
	else if(site.indexOf("imo.im")>-1) log=".convlog-msgs";
	else if(site.indexOf("facebook.com")>-1) log=".conversation";
	return log;
}

function getStorageState(){
  chrome.extension.sendRequest({method: "getLocalStorage", key: "abra_check"}, function(response) {
	console.log("abra_check="+response.data);
	if(response.data=="true")run=true; else run=false;
  });
  chrome.extension.sendRequest({method: "getLocalStorage", key: "abra_check_input"}, function(response) {
  console.log("abra_check_input="+response.data);
    if(response.data=="true") input_check=true; else input_check=false;
  });
  chrome.extension.sendRequest({method: "getLocalStorage", key: "abra_old_hotkey"}, function(response) {
  	var h=response.data;
	console.log("abra_old="+response.data);
	if(h!=undefined&&h!=""){
		shortcut.remove(h);
	}	
  });
  chrome.extension.sendRequest({method: "getLocalStorage", key: "abra_hotkey"}, function(response) {
  console.log("abra_new="+response.data);
	shortcut.add(response.data,activeSelection);
  });
  chrome.extension.sendRequest({method: "getLocalStorage", key: "abra_check_selected"}, function(response) {
	var resp=response.data;
	console.log("abra_check_selected="+response.data);
	switch(resp){
		case "true":
			checkselected=true;
			break;
		case "false":
			checkselected=false;
			break;
		default:
			break;
	}
  });
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	switch(request.method){
		case "popupOldHotkey":
				var h=request.data;
				if(h!=undefined&&h!=""){
					shortcut.remove(h);
				};	
			break;
		case "popupNewHotkey":
			if(request.data!=undefined&&request.data!="")
				shortcut.add(request.data,activeSelection);
			break;
		case "changeInputCheck":
				var data=request.data;
				if(data=="false"){
					$("input").die("keyup",checkInput);
					$("textarea").die("keyup",checkInput);
				} else if(data=="true"){
					$("input").live("keyup",checkInput);
					$("textarea").live("keyup", checkInput);
					$("input").each(checkInput);
					$("textarea").each(checkInput);
				}
			break;
		case "changeSelectedCheck":
				var data=request.data;
				if(data=="false") checkselected=false; else checkselected=true;
			break;
		case "changeLogCheck":
				var data=request.data;
				var log=getPageLogClass();
				if(data=="false"){
					$(log).die('DOMNodeInserted DOMNodeRemoved DOMSubtreeModified',abrakadabra);
				} else if (data=="true"){
				    $(log).live('DOMNodeInserted DOMNodeRemoved DOMSubtreeModified', abrakadabra);
				    $(log).each(abrakadabra());
				}
			break;
		default: 
			sendResponse({});
	}
});

function checkText(){
	try{
		chrome.extension.sendRequest({method: "getLocalStorage", key: "abra_check_input"}, function(response) {
		if(response.data=="true"){
				input_check=true; 
				$("input").live("keyup",checkInput);
				$("textarea").live("keyup", checkInput);
				$("input").each(checkInput);
				$("textarea").each(checkInput);
			} else {
				$("input").die("keyup",checkInput);
				$("textarea").die("keyup",checkInput);
				input_check=false;
			}
		});
		  chrome.extension.sendRequest({method: "getLocalStorage", key: "abra_check"}, function(response) {
			if(response.data=="true"){
					run=true; 
					$(getPageLogClass()).live('DOMNodeInserted DOMNodeRemoved DOMSubtreeModified',abrakadabra);
					$(getPageLogClass()).each(abrakadabra());
				} else {
					$(getPageLogClass()).die('DOMNodeInserted DOMNodeRemoved DOMSubtreeModified',abrakadabra);
					run=false;
				}
		  });
		  chrome.extension.sendRequest({method: "getLocalStorage", key: "abra_old_hotkey"}, function(response) {
		var h=response.data;
		console.log("abra_old="+response.data);
		if(h!=undefined&&h!=""){
			shortcut.remove(h);
		}	
	  });
	  chrome.extension.sendRequest({method: "getLocalStorage", key: "abra_hotkey"}, function(response) {
		shortcut.add(response.data,activeSelection);
	  });
	  chrome.extension.sendRequest({method: "getLocalStorage", key: "abra_check_selected"}, function(response) {
		var resp=response.data;
		switch(resp){
			case "true":
				checkselected=true;
				break;
			case "false":
				checkselected=false;
				break;
			default:
				break;
		}
	  });
  } catch(e) {
   console.log("checkText");
  }
}

function checkInput(){
	try{
		$(this).die("keyup",checkInput);
		$(this).die("keyup", checkInput);
		var elem=this;
		if(elem==undefined) return;
		var t=elem.value;
		if(t.length==0) return;
		var ch=t.charAt(t.length-1);
		if(stop_symbols.indexOf(ch)==-1||ch==".") return;
		var res=transcript(t);
		$(this).val(res);
		$(this).live("keyup",checkInput);
		$(this).live("keyup", checkInput);
	}catch(e){
		console.log("checkInput");
	}
}
function activeSelection(){
	if(!checkselected){
		$(getPageLogClass()).each(abrakadabra());
		$("input").each(checkInput);
		$("textarea").each(checkInput);
		return;
	} 
	var start;
	var end;
	var seltag;
	var elem=getSelectedNode();
	var t=new String(getSelectedText());
	if(elem==undefined){
	  var elem=document.activeElement;
	  seltag=new String(elem.tagName);
	  if(seltag.indexOf("TEXT")==-1||seltag.indexOf("input")==-1) 
	  return;
	 }
	 var elem2=document.activeElement;
	 var seltag2=new String(elem2.tagName);
	 if(seltag2.indexOf("TEXT")>-1||seltag2.indexOf("input")>-1) elem=elem2;
	 seltag=new String(elem.tagName);
	 if(seltag.indexOf("TEXT")>-1||seltag.indexOf("input")>-1){
		elem.focus();
		var temp=elem.value;
		if(temp.indexOf(t)>-1){
			start=elem.selectionStart;
			end=elem.selectionEnd;
			t=temp.substring(start,end);
			var text=temp.substring(0,start)+transcript(t)+temp.substring(end);
			 elem.value=text;
		}
	 } else {
	 	if(t!=""){
		 var selection=getSelectedText();
		 var t=new String(selection);
		 var temp=elem.innerHTML;
		 start=selection.startOffset;
		 end=selection.endOffset;
		 if(temp.indexOf(t)>-1){
			 var text=temp.substring(0,start)+transcript(t)
			 if(start!=end) text+=temp.substring(end);
			 elem.innerHTML=text;
		}
	 }
	}
}
$(document).ready(checkText);
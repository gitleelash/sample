function getSelectedNode()
{
    if (document.selection)
        return document.selection.createRange().parentElement();
    else
    {
        var selection = window.getSelection();
        if (selection.rangeCount > 0)
                return selection.getRangeAt(0).startContainer.parentNode;
    }
}

function getSelectedText()
{
	if (document.selection)
        return document.selection.createRange();
    else
    {
        var selection = window.getSelection();
        if (selection.rangeCount > 0)
                return selection.getRangeAt(0);
    }
}

function setHotkey(elem){
	var formname = "selecthotkey";
	if(elem.value.indexOf("Set")==-1) formname+="_rus";
	var oForm = document.forms[formname];
	var first=oForm.elements["firstkey"].value;
	var second=oForm.elements["secondkey"].value;
	var third=oForm.elements["speckey"].value;
	var hot="";
	hot=first+"+";
	if(second!="none") hot+=second+"+";
	hot+=third;
	var h=storage.get('abra_hotkey');
	storage.set('abra_hotkey',hot);
	storage.set('abra_old_hotkey',h);
	loadCheckboxes();
	chrome.extension.getBackgroundPage().storage.set("abra_old_hotkey",h);
	chrome.extension.getBackgroundPage().storage.set("abra_hotkey",hot);
	chrome.tabs.getSelected(null, function(tab) {
	  chrome.tabs.sendRequest(tab.id, {method: "popupOldHotkey", tabid: tab.id, data: h}, function(response) { });
	  chrome.tabs.sendRequest(tab.id, {method: "popupNewHotkey", tabid: tab.id, data: hot}, function(response) { });
	});
};
var storage = {
	set: function(key, value) {
		localStorage[key] = value;
	},
	get: function(key) {
		return localStorage[key];
	}
};
function initStorage() {
	if(storage.get('abra_check_input') == undefined)
		storage.set('abra_check_input', false);
	if(storage.get('abra_check') == undefined)
		storage.set('abra_check', false);
	if(storage.get('abra_old_hotkey') == undefined)
		storage.set('abra_old_hotkey', "Ctrl+Shift+A");
	if(storage.get('abra_hotkey') == undefined)
		storage.set('abra_hotkey', "Ctrl+Shift+A");
	if(storage.get('abra_check_selected') == undefined)
		storage.set('abra_check_selected', "true");
};
function loadCheckboxes(){
	var first=storage.get("abra_check_input");
	var second=storage.get("abra_check");
	var third=storage.get("abra_check_selected");
	initStorage();
	if(first=="true") first=true; else first=false;
	if(second=="true") second=true; else second=false;
	if(third=="true") third=true; else third=false;
	$(".abracheck").attr("checked",second);
	$(".abracheckInput").attr("checked",first);
	$(".checkselected").attr("checked",third);
	var hotkey=storage.get("abra_hotkey");
	$(".currenthot").html("<i>"+hotkey+"</i>");
};

function changeLogCheck(){
	if(storage.get("abra_check")=="true"){
		storage.set("abra_check",false);
		$(".abracheck").attr("checked", false);
	}
	else {
		storage.set("abra_check",true);
		$(".abracheck").attr("checked", true);
	}
	var d=storage.get("abra_check");
	chrome.extension.getBackgroundPage().storage.set("abra_check",d);
	chrome.tabs.getSelected(null, function(tab) {
	  chrome.tabs.sendRequest(tab.id, {method: "changeLogCheck",  data: d}, function(response) { });
	});
};
function changecheckInput(){
	if(storage.get("abra_check_input")=="true"){
		storage.set("abra_check_input","false");
		$(".abracheckInput").attr("checked", false);
	}
	else {
		storage.set("abra_check_input","true");
		$(".abracheckInput").attr("checked", true);
	}
	var d=storage.get("abra_check_input");
	chrome.extension.getBackgroundPage().storage.set("abra_check_input",d);
	chrome.tabs.getSelected(null, function(tab) {
	  chrome.tabs.sendRequest(tab.id, {method: "changeInputCheck", data: d }, function(response) { });
	});
};

function changeHotkeyAction(){
	if(storage.get("abra_check_selected")=="true"){
		storage.set("abra_check_selected","false");
		$(".checkselected").attr("checked", false);
	}
	else {
		storage.set("abra_check_selected","true");
		$(".checkselected").attr("checked", true);
	}
	var d=storage.get("abra_check_selected");
	chrome.extension.getBackgroundPage().storage.set("abra_check_selected",d);
	chrome.tabs.getSelected(null, function(tab) {
	  chrome.tabs.sendRequest(tab.id, {method: "changeSelectedCheck", data: d }, function(response) { });
	});
}
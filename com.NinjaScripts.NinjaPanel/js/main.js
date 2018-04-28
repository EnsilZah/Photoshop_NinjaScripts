function main() {
    //'use strict';
    var csInterface = new CSInterface();
		
 
    function loadJSX (fileName) {
        var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
        csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
    }
 
    function init() {
		
       // themeManager.init();
		
        loadJSX("json2.js");

 
			
            csInterface.evalScript( 'function sendObjToHTML () {	var obj = {str: "Love your job!",num: 38,today: new Date(),nestedObj: {nestedStr: "Even if nothing works",nestedNum: 8,nestedDate: new Date()}}return JSON.stringify(obj);}sendObjToHTML();', 
				function(result) {alert(result);var o = JSON.parse(result);var o = result;var str = "";for (var prop in o) {str += prop + " [" + typeof o[prop] + "]: " + o[prop] + ".\n";} });
    }    

    init();
	
}
main();


function sendObjToHTML () {
	var obj = {
            str: "Love your job!",
            num: 38,
            today: new Date(),
            nestedObj: {
                nestedStr: "Even if nothing works",
                nestedNum: 8,
                nestedDate: new Date()
            }
        }
    return JSON.stringify(obj);
}//sendObjToHTML();




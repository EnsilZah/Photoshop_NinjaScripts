﻿eval("#include \""+Folder($.fileName).parent.parent.fullName + "/NS_LIB.jsxinc\"");
#target photoshop

var scriptName = "NinjaScripts ImportFolders";
var scriptVersion = "0004";

var listExtensions = ["jpg","tif","psd","bmp","gif","png","exr","pdf"]
var inExtensions = new RegExp (listToRegex(listExtensions), "i")
var iconsFolder = Folder($.fileName).parent.parent + "/_Data/Icons"


// don't show any Photoshop dialogs during execution
app.displayDialogs = DialogModes.NO;    


var prefs = new Object();
prefs.sourceFolder =  "~";
prefs.removeFileExtensions = true; // remove filename extensions for imported layers (default: true)
prefs.recursive = true;
prefs.groupFolders = true;
prefs.smartObjects = false;

main();
function main()
{
	// remember ruler units; switch to pixels
	var originalRulerUnits = preferences.rulerUnits;
	preferences.rulerUnits = Units.PIXELS;

	//try
   /// {
        app.bringToFront();
        OpenMainWindow();
//	}
//	catch(e) {// don't report error on user cancel
	//	if (e.number != 8007) {showError(e);}
	//}

	// restore original ruler unit
	preferences.rulerUnits = originalRulerUnits;
}

function RunImport(sourceFolder)
{          
    prefs.sourceFolder = sourceFolder;

	// create a new document
	var newDoc = documents.add(1, 1 , 72, 'Imported Layers', NewDocumentMode.RGB, DocumentFill.TRANSPARENT, 1,BitsPerChannelType.SIXTEEN);
	var newLayer = newDoc.activeLayer;


 
    var tmpFolder = importFolder( sourceFolder, newDoc, prefs);
    if ((tmpFolder != null)&& prefs.recursive && prefs.groupFolders)
    {
        activeDocument.activeLayer = tmpFolder;

        ungroup();
    }

	// delete empty layer; reveal and trim to fit all layers
	newLayer.remove();
	newDoc.revealAll(); 
 }

function importFolder(sourceFolder, destDoc, prefs)
{
    var listLayers = new Array();
    var folderContents = sourceFolder.getFiles().sort();
    var listGroups = new Array();

    for (var i = 0; i < folderContents.length; i++)
    {
        if (folderContents[i] instanceof File)
        {
            
            
            
                // if no search mask collect all files, otherwise only those that match mask   
                if (listExtensions.toString().indexOf(folderContents[i].fullName.substr(folderContents[i].fullName.length-3)) != -1)
                {
                    var newLayer = importFile (folderContents[i], destDoc, prefs);
                    listLayers.push(newLayer);
                }
        }
        else if (folderContents[i] instanceof Folder)
        {  
            if (prefs.recursive)
            {
                var returnedGroup = importFolder(folderContents[i], destDoc, prefs)
                if (returnedGroup != null) { listGroups.push(returnedGroup) };
            }
        }
    }      
    
    if ((listLayers.length != 0) && prefs.recursive && prefs.groupFolders)
    {
        
        currentLayerSet = destDoc.layerSets.add();
        currentLayerSet.name = sourceFolder.displayName;
        
        //Workaround, can't move layersets;
        tmpLayer = app.activeDocument.artLayers.add();
        tmpLayer.move (currentLayerSet, ElementPlacement.INSIDE)
       
        for (var i = listLayers.length-1; i>=0; i--)
        {
            listLayers[i].move (tmpLayer, ElementPlacement.PLACEAFTER)
        }
    
             for (var i = listGroups.length-1; i>=0; i--)
        {
            listGroups[i].move (tmpLayer, ElementPlacement.PLACEAFTER)
        }
    
        tmpLayer.remove();
        return currentLayerSet;
    }
    return null;
}

function importFile (sourceFile, destDocument, prefs)
{
    // open document
    var doc = open(sourceFile);
    
    // get document name (and remove file extension)
    var name = doc.name;   
    if (prefs.removeFileExtensions) { name = name.replace(/(?:\.[^.]*$|$)/, ''); }
    
    // convert to RGB; convert to 16-bpc; merge visible
    doc.changeMode(ChangeMode.RGB);
    doc.bitsPerChannel = BitsPerChannelType.SIXTEEN;
    
    if (prefs.smartObjects)
    {
        activeDocument.artLayers[activeDocument.artLayers.length-1].isBackgroundLayer = false;  
        selectAllLayers();
        convertToSmartObject();

    }
    else
    {
        doc.artLayers.add();
        doc.mergeVisibleLayers();
    }
    
    // rename layer; duplicate to new document
    var layer = doc.activeLayer;
    layer.name = name;
    layer.duplicate(destDocument, ElementPlacement.PLACEATBEGINNING);
 
    // close imported document
    doc.close(SaveOptions.DONOTSAVECHANGES);
    return destDocument.activeLayer;
}

function OpenMainWindow()
{
    var MainWindow = new Window("dialog", scriptName + " v" + scriptVersion);
    
    MainWindow.orientation = 'column';
    MainWindow.alignChildren = 'center';
 
     OptionsGroup = MainWindow.add("group");
        OptionsGroup.orientation = 'row';   
 
        var CheckSubFolders = OptionsGroup.add("checkbox");
        CheckSubFolders.value = prefs.recursive;
        OptionsGroup.add("statictext",undefined,"Include Subfolders      ");
        CheckSubFolders.enabled = true;
        CheckSubFolders.onClick = function()
        {
            prefs.groupFolders = CheckFolderGroups.value = prefs.groupFolders = TextFolderGroups.enabled = CheckFolderGroups.enabled = prefs.recursive = CheckSubFolders.value;
        }
        
        grpCheckGrouping = OptionsGroup.add("group");
        var CheckFolderGroups = grpCheckGrouping.add("checkbox");
        CheckFolderGroups.value = prefs.groupFolders;
        var TextFolderGroups = OptionsGroup.add("statictext",undefined,"Folders as Groups      ");
        CheckFolderGroups.onClick = function()  {prefs.groupFolders = CheckFolderGroups.value;}
        
        
        var CheckSmartObj = OptionsGroup.add("checkbox");
        CheckSmartObj.value = prefs.smartObjects;
        OptionsGroup.add("statictext",undefined,"As Smart Objects      ");
        CheckSmartObj.onClick = function()  {prefs.smartObjects = CheckSmartObj.value;}

 
 
 
    IntoGroup = MainWindow.add("group");
        IntoGroup.orientation = 'row';  
        IntoGroup.add("statictext", undefined, "Document:");
        var DocumentDropdown = IntoGroup.add("dropdownlist");
        DocumentDropdown.preferredSize.width = 200;
        DocumentDropdown.add("item","New");
        DocumentDropdown.selection = 0;
        DocumentDropdown.enabled = false;
        
    
    PathGroup = MainWindow.add("group");
    PathGroup.orientation = 'row';
        PathEdit = PathGroup.add("edittext",undefined, "")
        PathEdit.preferredSize.width = 550;
        

    bttnBrowse = PathGroup.add("iconbutton", undefined, File(iconsFolder + "/FolderIcon.png"));
        bttnBrowse.preferredSize.height = 20
        bttnBrowse.onClick = function()
        {
            var myFolder = Folder.selectDialog("Please select the folder to be imported:");
            if (myFolder != null) {PathEdit.text = myFolder.fsName;}
        }   
    
    
    ConfirmGroup = MainWindow.add("group");
    ConfirmGroup.orientation = 'row';
        OkButton = ConfirmGroup.add("button", undefined, "Ok");
        OkButton.onClick = function()
        {
            	if ((PathEdit.text == "") || (!Folder(PathEdit.text).exists))    { alert("Folder not found");	return;}
                
                RunImport(Folder(PathEdit.text));
                MainWindow.close();
        }
        
        
        CancelButton = ConfirmGroup.add("button", undefined, "Cancel"); 
        
        
    MainWindow.center();
	var result = MainWindow.show();

}

function listToRegex(inList)
{
    var tmpRegex = "\.(";
    for (var i = 0; i < inList.length; i++)    {tmpRegex += inList[i] + "|"} 
    tmpRegex += ")$"

}

///////////////////////////////////////////////////////////////////////////////
// showError - display error message if something goes wrong
///////////////////////////////////////////////////////////////////////////////
function showError(err) {
	if (confirm('An unknown error has occurred.\n' +
		'Would you like to see more information?', true, 'Unknown Error')) {
			alert(err + ': on line ' + err.line, 'Script Error', true);
	}
}


#target photoshop

var scriptName = "NinjaScript ImportFolder";
var scriptVersion = "0002";
var inExtensions = /\.(jpg|tif|psd|bmp|gif|png|exr|)$/i;
    
function main() 
{
    // bring application forward for double-click events
    app.bringToFront();
	// user settings
	var prefs = new Object();
	prefs.sourceFolder         = '~';  // default browse location (default: '~')
	prefs.removeFileExtensions = true; // remove filename extensions for imported layers (default: true)
	prefs.savePrompt           = false; // display save prompt after import is complete (default: false)
	prefs.closeAfterSave       = false; // close import document after saving (default: false)

	// prompt for source folder
	var sourceFolder = Folder.selectDialog('Please select the folder to be imported:', Folder(prefs.sourceFolder));

	// ensure the source folder is valid
	if (!sourceFolder)    {	return;}
	else if (!sourceFolder.exists) {    alert('Source folder not found.', 'Script Stopped', true); return;}

	// add source folder to user settings
	prefs.sourceFolder = sourceFolder;

 
    var topFolder = prefs.sourceFolder; 
    
    fileArray = scanSubFolders(topFolder,inExtensions)[0];

    
    
    

	// if files were found, proceed with import
	if (fileArray.length) {
		importFolderAsLayers(fileArray, prefs);
	}
	// otherwise, diplay message
	else {
		alert("The selected folder doesn't contain any recognized images.", 'No Files Found', false);
	}

//alert(folderArray);
}

function scanSubFolders(tFolder, mask) // folder object, RegExp or string
{
    var sFolders = new Array();   
    var allFiles = new Array();   
    sFolders[0] = tFolder;   
    
    for (var j = 0; j < sFolders.length; j++) // loop through folders               
    {
        var procFiles = sFolders[j].getFiles();   
        for (var i=0;i<procFiles.length;i++)// loop through this folder contents   
        { 
            if (procFiles[i] instanceof File )
            {  
                if(mask==undefined) allFiles.push(procFiles[i]);// if no search mask collect all files  
                if (procFiles[i].fullName.search(mask) != -1) allFiles.push(procFiles[i]); // otherwise only those that match mask  
            }
            else if (procFiles[i] instanceof Folder)
            {  
                sFolders.push(procFiles[i]);// store the subfolder  
                scanSubFolders(procFiles[i], mask);// search the subfolder  
            }  
        }   
   }   
   return [allFiles,sFolders];   
};  


///////////////////////////////////////////////////////////////////////////////
// importFolderAsLayers - imports a folder of images as named layers
///////////////////////////////////////////////////////////////////////////////
function importFolderAsLayers(fileArray, prefs) {
	// create a new document
	var newDoc = documents.add(300, 300, 72, 'Imported Layers', NewDocumentMode.RGB, DocumentFill.TRANSPARENT, 1,BitsPerChannelType.SIXTEEN);
	var newLayer = newDoc.activeLayer;

	// loop through all files in the source folder
	for (var i = 0; i < fileArray.length; i++) {
		// open document
		var doc = open(fileArray[i]);

		// get document name (and remove file extension)
		var name = doc.name;
		if (prefs.removeFileExtensions) {
			name = name.replace(/(?:\.[^.]*$|$)/, '');
		}

		// convert to RGB; convert to 8-bpc; merge visible
		doc.changeMode(ChangeMode.RGB);
		doc.bitsPerChannel = BitsPerChannelType.SIXTEEN;
		doc.artLayers.add();
		doc.mergeVisibleLayers();

		// rename layer; duplicate to new document
		var layer = doc.activeLayer;
		layer.name = name;
		layer.duplicate(newDoc, ElementPlacement.PLACEATBEGINNING);

		// close imported document
		doc.close(SaveOptions.DONOTSAVECHANGES);
	}	

	// delete empty layer; reveal and trim to fit all layers
	newLayer.remove();
	newDoc.revealAll();
	//newDoc.trim(TrimType.TRANSPARENT, true, true, true, true);

	// save the final document
	if (prefs.savePrompt) {
		// PSD save options
		var saveOptions = new PhotoshopSaveOptions();
		saveOptions.layers = true;
		saveOptions.embedColorProfile = true;

		// prompt for save name and location
		var saveFile = File.saveDialog('Save the new document as:');
		if (saveFile) {
			newDoc.saveAs(saveFile, saveOptions, false, Extension.LOWERCASE);
		}

		// close import document
		if (prefs.closeAfterSave) {
			newDoc.close(SaveOptions.DONOTSAVECHANGES);
		}
	}
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


// test initial conditions prior to running main function
{
	// remember ruler units; switch to pixels
	var originalRulerUnits = preferences.rulerUnits;
	preferences.rulerUnits = Units.PIXELS;

	try {
		main();
	}
	catch(e) {
		// don't report error on user cancel
		if (e.number != 8007) {
			showError(e);
		}
	}

	// restore original ruler unit
	preferences.rulerUnits = originalRulerUnits;
}

function MainWindow()
{
    

}
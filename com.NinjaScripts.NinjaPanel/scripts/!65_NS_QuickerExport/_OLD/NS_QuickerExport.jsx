// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

function px (inVal) {return UnitValue(inVal,"px")}
function cID (inVal) { return charIDToTypeID(inVal);}
function sID (inVal) { return stringIDToTypeID(inVal);}


var ScriptPath = Folder($.fileName).parent
var OpenSettings = readXML(File(ScriptPath + "/Data/Settings.xml" ))
function Settings()
{
    this.Trim = OpenSettings.Settings.Trim == 'true';
    this.Reveal = OpenSettings.Settings.Reveal == 'true';
    this.FolderName = OpenSettings.Settings.FolderName;
    this.FileType = OpenSettings.Settings.FileType;
    this.ShowErrors = OpenSettings.Settings.ShowErrors == 'true';
}
CurrentSettings = new Settings();



// in case we double clicked the file
app.bringToFront();

// don't show any Photoshop dialogs during execution
app.displayDialogs = DialogModes.NO;

//Globals
    var scriptName = "NS Quicker Export";
    var scriptVersion = "0003";

    var saveAlpha = true;
    var hasAlpha = false;       
    var NS_TempDoc;
    
    var SavePath = "";
    var SaveName = ""


main();
function main()
{
    return exportFromShots();
}

function exportFromShots()
{
    if (documents.length == 0)
    { if (CurrentSettings.ShowErrors) { alert ("Error: No documents are open")};return false;}
    SavePath = app.activeDocument.fullName.parent;    
    
    if ((SavePath == null)||(SavePath == "")) {alert("Error, you must first save the file"); return false;}
    
    SaveName = prompt("Enter file name:", "", "Enter file name");   
    if ((SaveName == null)||(SaveName == "")) {if (CurrentSettings.ShowErrors) { alert ("Error: No legal name entered")} return false;};
 //   alert(SavePath);

    
    if (!createCompFromLayers()) {    alert("No layers selected.") ;return false;}
       
    NS_TempDoc = activeDocument;
    prepareDoc();

    SavePNGDest(SavePath + "/Export", SaveName, true)

    NS_TempDoc.close(SaveOptions.DONOTSAVECHANGES);
}

//Duplicate selected layers to new document
function createCompFromLayers()
{
    var desc12 = new ActionDescriptor();
    var ref15 = new ActionReference();
    ref15.putClass( cID( "Dcmn" ) );
    desc12.putReference( cID( "null" ), ref15 );
    desc12.putString( cID( "Nm  " ), "NS_LayerComp" );
    var ref16 = new ActionReference();
    ref16.putEnumerated( cID( "Lyr " ), cID( "Ordn" ), cID( "Trgt" ) );
    desc12.putReference( cID( "Usng" ), ref16 );
    var idVrsn = cID( "Vrsn" );
    desc12.putInteger( idVrsn, 5 );

    try
    {
        executeAction( cID( "Mk  " ), desc12, DialogModes.NO );
        return true;
    } catch (e) { return false;}
 }

//Saves a Targa to destination
function SaveTGAFile(inPath, inFilename)
{
    convRGBBit(8);  
      
    if(!inPath.exists) 
    { inPath.create();}    
    
    tgaFile = new File( inPath+ "/" + inFilename +".tga");
    if (tgaFile.exists) {if (!confirm ("Warning: File already exists, Overwrite?" , false , "Overwrite" )) return false;}
    tgaSaveOptions = new TargaSaveOptions()
    
    tgaSaveOptions.alphaChannels = saveAlpha && hasAlpha;
    if (saveAlpha && hasAlpha){  tgaSaveOptions.resolution = TargaBitsPerPixels.THIRTYTWO}
    else{   tgaSaveOptions.resolution = TargaBitsPerPixels.TWENTYFOUR}

    tgaSaveOptions.rleCompression = true;

    try{app.activeDocument.saveAs(tgaFile, tgaSaveOptions, true,Extension.LOWERCASE);}
    catch(e){    alert("ERROR: An error occured while trying to save the file."); return false;    }
    return true;
}

function SaveTIFFFile(inPath, inFilename)
{
    convRGBBit(16)  

    if(!inPath.exists) 
    { inPath.create();}    
    
    tiffFile = new File( inPath+ "/" + inFilename +".tif");
    if (tiffFile.exists) {if (!confirm ("Warning: File already exists, Overwrite?" , false , "Overwrite" )) return false;}

    
    tiffSaveOptions = new TiffSaveOptions()
    
     tiffSaveOptions.annotations = false;
     tiffSaveOptions.byteOrder = ByteOrder.IBM;
     tiffSaveOptions.imageCompression = TIFFEncoding.TIFFLZW;
     tiffSaveOptions.layers = false;     
    tiffSaveOptions.alphaChannels = saveAlpha && hasAlpha;

    
    
    try{ app.activeDocument.saveAs(tiffFile, tiffSaveOptions, true,Extension.LOWERCASE)}
    catch(e){    alert("ERROR: An error occured while trying to save the file."); return false;    }
    return true;
}

function prepareDoc()
{
    GroupLayers();
    app.activeDocument.activeLayer.name = "NS_MainLayer";
    if (CurrentSettings.Reveal) {activeDocument.revealAll();}
    if (CurrentSettings.Trim) {activeDocument.trim (TrimType.TRANSPARENT);}
}

 function GroupLayers()
 {
    var desc27 = new ActionDescriptor();
    var ref18 = new ActionReference();
    ref18.putClass( sID( "layerSection" ) );
    desc27.putReference( cID( "null" ), ref18 );
    var ref19 = new ActionReference();
    ref19.putEnumerated( cID( "Lyr " ), cID( "Ordn" ), cID( "Trgt" ) );
    desc27.putReference( cID( "From" ), ref19 );
    executeAction( cID( "Mk  " ), desc27, DialogModes.NO );
    return activeDocument.activeLayer;
}

function SavePNGDest(inDestPath, inDestName, inCreateFolder)
{
    if (inCreateFolder)
    {if (!Folder(inDestPath).exists)  Folder(inDestPath).create();}
    
    pngFile = new File( inDestPath + "/" + inDestName);
    pngSaveOptions = new PNGSaveOptions();
    pngSaveOptions.compression = 9;
    pngSaveOptions.interlaced = false;
    
    
    activeDocument.saveAs(pngFile, pngSaveOptions, true,Extension.LOWERCASE)
}

function readXML (file) {
  var content;
  try {
    file.open('r');
    content = file.read();
    file.close();
    return new XML(content);
  } catch (e) {
    alert("" + e.message + "\nError opening list.");
    return false;
  }
  return true;
};
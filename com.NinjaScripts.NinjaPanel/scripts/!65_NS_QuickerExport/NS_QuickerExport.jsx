// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
// in case we double clicked the file
app.bringToFront();
// don't show any Photoshop dialogs during execution
app.displayDialogs = DialogModes.NO;


function px (inVal) {return UnitValue(inVal,"px")}
function cID (inVal) { return charIDToTypeID(inVal);}
function sID (inVal) { return stringIDToTypeID(inVal);}

var defaultXML = <NS_Export_Settings>
</NS_Export_Settings>;

var scriptName = "NS Quicker Export Options";
var scriptVersion = "0004";

//Globals
var NS_TempDoc;
var SavePath = "";
var SaveName = ""

var ScriptPath = Folder($.fileName).parent
var OpenSettings = readXML(File(ScriptPath + "/Data/Settings.xml" ))

function Settings()
{
    this.Trim = OpenSettings.Settings.Trim == 'true';
    this.Reveal = OpenSettings.Settings.Reveal == 'true';
    this.FolderName = OpenSettings.Settings.FolderName;
    this.FileType = OpenSettings.Settings.FileType;
    this.ShowErrors = true;//OpenSettings.Settings.ShowErrors == 'true';
}

CurrentSettings = new Settings();

main();
function main()
{
    optionsDialog();
}

function optionsDialog()
{
    var MainWindow = new Window("dialog", scriptName + " v" + scriptVersion);
    
    MainWindow.orientation = 'column';
    MainWindow.alignChildren = 'center';
    

    
    OptionsGroup = MainWindow.add("group");
    OptionsGroup.orientation = 'column'; 
    OptionsGroup.alignChildren = 'left';
    
    
    NameGroup = OptionsGroup.add("group");
    NameGroup.orientation = 'row';    
    NameGroup.add("statictext",undefined,"File name:        ");
    NameEdit = NameGroup.add("edittext",undefined,"");
    NameEdit.preferredSize.width = 220
    NameEdit.active = true;

    Check02 = OptionsGroup.add("group");
    Check02.orientation = 'row'; 
    Check02.add("statictext",undefined,"Export Folder: ");
    var ExportFolderEdit = Check02.add("edittext",undefined,"");
    ExportFolderEdit.text = CurrentSettings.FolderName;  
    ExportFolderEdit.preferredSize.width = 220
    
        OptionsGroup.add("statictext",undefined," ");  
     OptionsGroup.alignChildren = 'center';
     
    Check01 = OptionsGroup.add("group");
    Check01.orientation = 'row'; 
    var TrimChk = Check01.add("checkbox");
        TrimChk.value = CurrentSettings.Trim;
    Check01.add("statictext",undefined,"Trim            ");
    
    
    var RevealChk = Check01.add("checkbox");
    RevealChk.value = CurrentSettings.Reveal;
    Check01.add("statictext",undefined,"Reveal All");
    
 

    Check01.add("statictext",undefined,"         As:");
    var FileDropdown = Check01.add("dropdownlist");
    FileDropdown.preferredSize.width = 60
    FileDropdown.add("item","PNG");
    FileDropdown.selection = 0;
    FileDropdown.enabled = false;
  

    Check04 = OptionsGroup.add("group");
    Check04.orientation = 'row'; 
 

    var ButtonsGroup = OptionsGroup.add("group");
    var ExportBttn = ButtonsGroup .add("button",undefined,"Export",{name: "ok"});
        ExportBttn.onClick = function()
    {
        CurrentSettings.Trim = TrimChk.value;
        CurrentSettings.Reveal =  RevealChk.value;
        CurrentSettings.FolderName = ExportFolderEdit.text;
        CurrentSettings.FileType = "PNG";
        var ExportFileName = NameEdit.text;
        
        defaultXML.appendChild(createXMLSettings());
        writeXML(File(ScriptPath + "/Data/Settings.xml" )); 
        exportLayers(ExportFileName)
        MainWindow.close();
    }

    ButtonsGroup .add("button",undefined,"Cancel");

    MainWindow.center();
	var result = MainWindow.show();

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

function writeXML(file) 
{
    try 
    {
        file.open("w");
        file.write(defaultXML);
        file.close();
    } catch (e) {
        alert("" + e.message + "\nError saving list.");
        return false;
    }
    return true;
};


function createXMLSettings()
{
    return <Settings>
                <Trim>{CurrentSettings.Trim}</Trim>
                <Reveal>{CurrentSettings.Reveal}</Reveal>
                <FolderName>{CurrentSettings.FolderName}</FolderName>
                <FileType>{CurrentSettings.FileType}</FileType>
                <ShowErrors>{CurrentSettings.ShowErrors}</ShowErrors>
            </Settings>;
};









////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Execute section //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function exportLayers(SaveName)
{
    if (documents.length == 0)
    { if (CurrentSettings.ShowErrors) { alert ("Error: No documents are open")};return false;}
    SavePath = app.activeDocument.fullName.parent;    
    
    if ((SavePath == null)||(SavePath == "")) {alert("Error, you must first save the file"); return false;}
    
    if ((SaveName == null)||(SaveName == "")) {if (CurrentSettings.ShowErrors) { alert ("Error: No legal name entered")} return false;};
    if (!createCompFromLayers()) {    alert("No layers selected.") ;return false;}
       
    NS_TempDoc = activeDocument;
    prepareDoc();
    SavePNGDest(SavePath +"/" + CurrentSettings.FolderName, SaveName, true)
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




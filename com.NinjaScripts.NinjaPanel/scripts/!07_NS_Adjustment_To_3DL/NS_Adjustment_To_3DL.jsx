#include "../NS_LIB.jsxinc"
//Saves selected adjustment layers as a 3DL LUT file.

//Globals
var scriptName = "NinjaScript Save3DL";
var scriptVersion = "0.2";

//3DL Header
var TDLHeader =  "#Created by Tammuz Kay using " + scriptName + " " + scriptVersion +"\n"
TDLHeader += "0 64 128 192 256 320 384 448 512 576 640 704 768 832 896 960 1023\n"

function main()
{   
    if(!checkOpenDocument()) {return;}
    
    lutFile = (new File(activeDocument.activeLayer.name)).saveDlg ("Select file save location.", "*.3dl")
    if (lutFile == null) {return;}
        
    WorkDoc = activeDocument;

    //Open LUT template file
    openRAWPath (Folder($.fileName).parent + "/Data/3DLUTBase.raw")     
    curvesDoc = activeDocument;
    activeDocument = WorkDoc; 
    
    //Apply adjustments to template file and save an intermediary file.
    WorkDoc.activeLayer.duplicate (curvesDoc);
    activeDocument = curvesDoc;
    saveRAWPath (Folder.temp+"/Save3DLTemp.raw");
    curvesDoc.close(SaveOptions.DONOTSAVECHANGES);
    
    //Convert intermediary file to 3DL
    create3DLut(Folder.temp+"/Save3DLTemp.raw");
}

main();

//Remap 8 bit value to 12 bit space
function conform8to12(inValue)
{
    return String(Math.round( (inValue * 16) * (256*16 - 1) / (255*16)))
}

//Read raw LUT data and write as 3DL
function create3DLut(inPath)
{
    RAW_3DLFile = File (inPath)
    RAW_3DLFile.encoding = 'BINARY'
    RAW_3DLFile.open("r" );

    binRed = RAW_3DLFile.read(4913);
    binGreen = RAW_3DLFile.read(4913);
    binBlue = RAW_3DLFile.read(4913);
    
    RAW_3DLFile.close();
    RAW_3DLFile.remove();
    lutData = TDLHeader

    for(i=0; i < 4913; i++)
    {
        lutData += conform8to12(binRed.charCodeAt(i)) + " " +conform8to12(binGreen.charCodeAt(i)) + " " + conform8to12(binBlue.charCodeAt(i)) + "\n";
    }

    lutFile.encoding = 'BINARY'
    lutFile.open ("w")
    lutFile.write(lutData);
    lutFile.close();
 }

function openRAWPath (inPath)
{
    RAWOpen = new RawFormatOpenOptions();
    RAWOpen.bitsPerChannel = 8;
    RAWOpen.channelNumber = 3;
    RAWOpen.height = 289
    RAWOpen.width = 17;
    RAWOpen.interleaveChannels = false;
    RAWOpen.headerSize = 0

    app.open(File(inPath), RAWOpen);
}

function saveRAWPath( inPath )
{
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    desc3.putBoolean( cID( "ChnI" ), false );
    desc2.putObject( cID( "As  " ), cID( "Rw  " ), desc3 );
    desc2.putPath( cID( "In  " ), new File( inPath ) );
    desc2.putInteger(  cID( "DocI" ), 40 );
    desc2.putBoolean( cID( "Cpy " ), true );
    desc2.putEnumerated( sID( "saveStage" ), sID( "saveStageType" ), sID( "saveBegin" ) );
    executeAction( cID( "save" ), desc2, DialogModes.NO );
 }
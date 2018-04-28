#include "../NS_LIB.jsxinc"

//Works on Invert, Curves, Levels, Exposure, Color Balance

//Globals
    var scriptName = "NinjaScript MergeAdjustmentLayers";
    var scriptVersion = "0.10";
    

activeDocument.suspendHistory("TS_MergeAdjust", "main()")
    
function main()
{
    WorkDoc = activeDocument;
    originalLayers = GroupLayers();
    activeDocument.activeLayer.name = "Original Adjustments";
    if (activeDocument.activeLayer.layerSets.length > 0) {alert ("Error, selection must not contain groups."); unGroup(); return;}
    
    DummyLayer = app.activeDocument.artLayers.add();
    DummyLayer.name = "NS_DummyLayer";
    DummyLayer.move (originalLayers, ElementPlacement.PLACEATBEGINNING);
        
    findMergableSubsetTail(originalLayers.artLayers, originalLayers.artLayers.length-1);    
  
    if (originalLayers.layerSets.length > 0)
    {
        openRAWPath (Folder($.fileName).parent + "/Data/3CurveDefault.raw")
        curvesDoc = activeDocument;
        activeDocument = WorkDoc; 

        while (originalLayers.layerSets.length > 0)
        {    
            originalLayers.layerSets[0].duplicate (curvesDoc);
            activeDocument = curvesDoc;   

            clearOldRAW();
            saveRAWPath (Folder.temp+"/TEMP.raw");
            File (Folder.temp+"/TEMP.raw").rename("TEMP.amp");
            
            curvesDoc.activeHistoryState = curvesDoc.historyStates[0]


            activeDocument = WorkDoc;
            createCurves();
            NewAdjLayer = app.activeDocument.activeLayer;
            NewAdjLayer.name = originalLayers.layerSets[0].name;
            NewAdjLayer.move (originalLayers.layerSets[0],ElementPlacement.PLACEBEFORE);
            setCurvesAMP(Folder.temp+"/TEMP.amp")
            originalLayers.layerSets[0].remove();
          }
  
        curvesDoc.close(SaveOptions.DONOTSAVECHANGES);
    }

    activeDocument.activeLayer = originalLayers
    DummyLayer.remove();
    unGroup();
}

function findMergableSubsetTail (inLayerSet, inEndIndex)
{
    var i = inEndIndex
    if (i <= 0) {/*alert("End"); */return;}
 
    for (; i >= 0; i--)
    {
        if(!isAdjMergable(inLayerSet[i])) break;
    }

    if ((inEndIndex - i) > 1) 
    {
        var newLayerSet = activeDocument.layerSets.add();
        newLayerSet.name = "Merged_" + (i+1)+"_"+inEndIndex;
       
        for (j = inEndIndex - i ; j > 0; j-- )    inLayerSet[i+1].move(newLayerSet, ElementPlacement.PLACEATEND)
        if (i >= 0)        newLayerSet.move (inLayerSet[i],ElementPlacement.PLACEAFTER);
        else newLayerSet.move (inLayerSet,ElementPlacement.INSIDE);
    }
    findMergableSubsetTail (inLayerSet, i-1);
 }

function isAdjMergable(inLayer)
{
    switch(inLayer.kind)
    {
        case LayerKind.BRIGHTNESSCONTRAST:
        case LayerKind.COLORBALANCE:
        case LayerKind.CURVES:
        case LayerKind.EXPOSURE:
        case LayerKind.INVERSION:
        case LayerKind.LEVELS:
        case LayerKind.SOLIDFILL:
            return true;
        default:
            return false;
    }
}

function clearOldRAW()
{
    File (Folder.temp+"/TEMP.raw").remove();
    File (Folder.temp+"/TEMP.amp").remove();
}

function openRAWPath (inPath)
{
    RAWOpen = new RawFormatOpenOptions();
    RAWOpen.bitsPerChannel = 8;
    RAWOpen.channelNumber = 3;
    RAWOpen.height = 1
    RAWOpen.width = 256;
    RAWOpen.interleaveChannels = false;
    RAWOpen.headerSize = 0

    app.open(File(inPath), RAWOpen);
}

function createCurves()
{
    var desc3 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass( cID( "AdjL" ) );
    desc3.putReference( cID( "null" ), ref1 );
    var desc4 = new ActionDescriptor();
    var desc5 = new ActionDescriptor();
    desc5.putEnumerated( sID( "presetKind" ), sID( "presetKindType" ), sID( "presetKindDefault" ) );
    desc4.putObject( cID( "Type" ), cID( "Crvs" ), desc5 );
    desc3.putObject( cID( "Usng" ), cID( "AdjL" ), desc4 );
    executeAction( cID( "Mk  " ), desc3, DialogModes.NO );
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

function setCurvesAMP( inSource )
{
    var desc6 = new ActionDescriptor();
    var ref2 = new ActionReference();
    ref2.putEnumerated( cID( "AdjL" ), cID( "Ordn" ), cID( "Trgt" ) );
    desc6.putReference( cID( "null" ), ref2 );
    var desc7 = new ActionDescriptor();
    desc7.putEnumerated( sID( "presetKind" ), sID( "presetKindType" ), sID( "presetKindUserDefined" ) );
    desc7.putPath( cID( "Usng" ), new File( inSource ) );
    desc6.putObject( cID( "T   " ), cID( "Crvs" ), desc7 );
    executeAction( cID( "setd" ), desc6, DialogModes.NO );
}
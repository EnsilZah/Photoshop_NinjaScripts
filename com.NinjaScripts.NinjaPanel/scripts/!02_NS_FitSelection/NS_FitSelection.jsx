app.preferences.rulerUnits = Units.PIXELS
app.preferences.typeUnits = TypeUnits.PIXELS

#include "../layers.jsxinc"



var scriptName = "NinjaScript FitSelection";
var scriptVersion = "0.1";


activeDocument.suspendHistory("NS_FitSelection", "main();")

function main()
{
    if (!selectionPixels.hasSelection())
    { alert ("Error, no selection made"); return;}

    curRatio = rectOps.ratio(activeDocument.selection.bounds, activeDocument.activeLayer.bounds)

    sizeAL = rectOps.size(activeDocument.activeLayer.bounds);
    sizeSL = rectOps.size(activeDocument.selection.bounds);
    
    pivotAL = rectOps.center(activeDocument.activeLayer.bounds);
    pivotSL = rectOps.center(activeDocument.selection.bounds);
    
    dialogFitSelection();
}

function dialogFitSelection()
{
    var thisDialog = new Window("dialog", scriptName + " v" + scriptVersion);
    thisDialog.orientation = 'column';
    thisDialog.alignChildren = 'center';
    thisDialog.alignment = 'center';
    
    var groupOptions = thisDialog.add("group");
        var radioFitInside = groupOptions.add("radiobutton", undefined, "Fit Inside");
        radioFitInside.value = true;
        var radioFitScale = groupOptions.add("radiobutton", undefined, "Fit Stretch");
        var radioFitHeight = groupOptions.add("radiobutton", undefined, "Fit Height");
        var radioFitWidth = groupOptions.add("radiobutton", undefined, "Fit Width");
    
     var groupButtons = thisDialog.add("group");
        myOkButton = groupButtons.add("button", undefined, "Ok",{name: "ok"});
        myOkButton.onClick = function()
        {
            layerOps.moveCenter(activeDocument.activeLayer, pivotSL)

            if (radioFitInside.value) fitInside();
            if (radioFitScale.value) fitScale();
            if (radioFitWidth.value) fitWidth();        
            if (radioFitHeight.value) fitHeight(); 
            thisDialog.close();
        }

        myCancelButton = groupButtons.add("button", undefined, "Cancel",{name: "cancel"});
        myCancelButton.onClick = function()
        {
            thisDialog.close();
        }
    
    	thisDialog.center();
        var result = thisDialog.show();
}


function fitScale()
{
    activeDocument.activeLayer.resize(curRatio[0] * 100, curRatio[1] * 100)
}

function fitWidth()
{
    activeDocument.activeLayer.resize(curRatio[0] * 100, curRatio[0] * 100)
}

function fitHeight()
{
    activeDocument.activeLayer.resize(curRatio[1] * 100, curRatio[1] * 100)
}

function fitInside()
{
    var inSize = Math.min(curRatio[0], curRatio[1]) * 100;
    activeDocument.activeLayer.resize(inSize, inSize)
}
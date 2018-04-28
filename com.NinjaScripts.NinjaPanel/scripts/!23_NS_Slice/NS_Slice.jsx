#include "../NS_LIB.jsxinc"
#include "../smartobjects.jsxinc"

#target photoshop

var scriptName = "TitleScript Slice";
var scriptVersion = "0.04";

activeDocument.suspendHistory("TS_Slice", "Main()") //Run as one history state.

function Main()
{

    if (getSelectedLayersIdx().length != 1){ alert("Please select only the layer you would like to slice."); return;} 
    
    var SourceLayer = activeDocument.activeLayer;
    var HorizontalG = new Array
    var VerticalG = new Array

    HorizontalG.push(0);
    HorizontalG.push(activeDocument.height.as("px"));

    VerticalG.push(0);
    VerticalG.push(activeDocument.width.as("px"));

    for (var i = 0; i < activeDocument.guides.length; i++)
    {   
        if (activeDocument.guides[i].direction == Direction.HORIZONTAL)
        {HorizontalG.push(activeDocument.guides[i].coordinate.as("px"));}
        else
        {VerticalG.push(activeDocument.guides[i].coordinate.as("px"));}
        
        }
 
    HorizontalG.sort(function(a, b) {return a - b})
    VerticalG.sort(function(a, b) {return a - b})

    for (var i = 0 ; i < (HorizontalG.length -1); i++)
    {
        for (var j = 0 ; j < (VerticalG.length -1); j++)
        {
            activeDocument.activeLayer = SourceLayer
            selectionPixels.selectSquare([VerticalG[j], HorizontalG[i], VerticalG[j+1], HorizontalG[i+1]])
    try {app.activeDocument.selection.copy();pasteInPlace();convertToSmartObject();}
    catch(Err){}           
        
        }
    }

    app.activeDocument.guides.removeAll();
    SourceLayer.remove();
}
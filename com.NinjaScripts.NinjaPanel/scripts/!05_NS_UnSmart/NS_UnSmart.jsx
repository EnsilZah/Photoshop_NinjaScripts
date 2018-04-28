#include "../NS_LIB.jsxinc"
#include "../smartobjects.jsxinc"

#target photoshop
app.bringToFront();
app.displayDialogs = DialogModes.NO;

//Globals
    var scriptName = "NinjaScript UnsmartObject";
    var scriptVersion = "0.01";


duplicateTo = function (dest)
{
    activeDocument.activeLayer.duplicate(dest, ElementPlacement.PLACEAFTER);
}


try
{
    main();
}
catch(e)
{
    alert(e)
}


function main()
{
    if (!smartobject.isSO(activeDocument.activeLayer)) return;

    OriginalLayer = activeDocument.activeLayer;
    ObjectDoc = smartobject.open(activeDocument.activeLayer);

    curDoc.ensureNoBG()

    selectionLayers.selectAll();
    activeLayers.group()
    duplicateTo(OriginalLayer)

    ObjectDoc.close(SaveOptions.DONOTSAVECHANGES);
    activeDocument.activeLayer.name = OriginalLayer.name;
    layerOps.matchCenter(OriginalLayer,activeDocument.activeLayer);
    OriginalLayer.remove();
}


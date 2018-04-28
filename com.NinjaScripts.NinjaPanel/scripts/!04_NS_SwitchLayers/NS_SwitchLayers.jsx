#include "../layers.jsxinc"


//activeDocument.suspendHistory("TS_Switch", "main()")


main();
function main()
{
    var LayerIDXs = selectionLayers.getIndex();
    var Layers = selectionLayers.getLayers();
    
    if (Layers.length != 2)
    {
        alert("Please select excatly 2 layers")
    }
    else
    {
        var DistLayers = vectOps.difference(layerOps.center(Layers[1]), layerOps.center(Layers[0]));
        Layers[1].translate(DistLayers[0],DistLayers[1]);
        Layers[0].translate(-DistLayers[0],-DistLayers[1]);
    }

    selectionLayers.addIndices(LayerIDXs)

    return;
 }
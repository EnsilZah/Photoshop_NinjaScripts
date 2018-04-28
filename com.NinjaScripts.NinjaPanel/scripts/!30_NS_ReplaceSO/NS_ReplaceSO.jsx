#include "../smartobjects.jsxinc"
#target photoshop

var scriptName = "NinjaScripts Replace Smart Object";
var scriptVersion = "0001";

main();
function main()
{
    var inFile = File.openDialog("Please select file:");
    if (inFile != null)
    {
        switch(activeDocument.activeLayer.kind)
        {
            default:
                smartobject.make();
            case smartobject.kind:
                smartobject.replaceContents(inFile);
                break;
        }
    }
        
}
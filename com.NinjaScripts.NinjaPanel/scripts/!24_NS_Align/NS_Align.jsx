eval("#include \""+Folder($.fileName).parent.parent.fullName + "/NS_LIB.jsxinc\"");
//#include "NS_LIB.jsxinc" 
#target photoshop

var scriptName = "TitleScript Align"
var scriptVersion = "0.0.5"

app.preferences.rulerUnits = Units.PIXELS
app.preferences.typeUnits = TypeUnits.PIXELS

Resolutions = [[px(1024),px(576)], [px(1280),px(720)], [px(1920),px(1080)]]
DefaultResolution = 2;

function Main()
{
    activeDocument.suspendHistory("TS_Align", "openAlignDialog()");
}
Main();


function openAlignDialog()
{
    var AlignDialog = new Window("dialog", scriptName + " v" + scriptVersion);
    var inputGroup = AlignDialog.add("group");
    
    var ResolutionButtons = new Array;
    
    for( var i = 0; i < Resolutions.length; i++)
    {
        ResolutionButtons[i] = inputGroup.add("radiobutton", undefined, Resolutions[i][0].as("px") + "x" + Resolutions[i][1].as("px") )
    }
    ResolutionButtons[DefaultResolution].value = true;
    
    var confirmGroup = AlignDialog.add("group");
    OKButton = confirmGroup.add("button", undefined, "OK");
	OKButton.onClick = function()
    {
        for(var i = 0; i< ResolutionButtons.length; i++)
        {if (ResolutionButtons[i].value) {CenterCrop();activeDocument.resizeImage(Resolutions[i][0],Resolutions[i][1]);convRGBBit(8);break;}}
        AlignDialog.close();
	}

	CancelButton = confirmGroup.add("button", undefined, "Cancel");
	CancelButton.onClick = function()
    {
        AlignDialog.close();
	}
    
    AlignDialog.center();
    AlignDialog.show();
}
   
function CenterCrop()
{
    //Delete BG Layer
    if(activeDocument.layers[activeDocument.layers.length-1].isBackgroundLayer)
    {activeDocument.layers[activeDocument.layers.length-1].remove();}
    
    //Center all
    for (var i = 0; i <activeDocument.layers.length; i++)
    {
        activeDocument.activeLayer = activeDocument.layers[i]
        alignToDocCenterThreshhold(activeDocument.layers[i], 40)
        }
    
     //Resize
    activeDocument.trim(TrimType.TRANSPARENT)
    if(!(activeDocument.width/activeDocument.height == 16/9))
    {
        if (activeDocument.width/activeDocument.height < 16/9)  //TALL IMAGE
        {
                activeDocument.resizeCanvas((activeDocument.height/9*16),activeDocument.height)
        }
        else //Wide image
        {
                activeDocument.resizeCanvas(activeDocument.width,(activeDocument.width/16*9))
        }
    }

    selectAllLayers();
    activeDocument.activeLayer.resize(90,90);
}
    

#target photoshop

var cID = charIDToTypeID
var sID = stringIDToTypeID


#include "../tools.jsxinc"
#include "../smartobjects.jsxinc"
#include "../layers.jsxinc"



var scriptName = "NinjaScripts Instancer";
var scriptVersion = "0004";

var sequentialNum = 0;
//Suspends history while running script to undo results in one step.
activeDocument.suspendHistory("NS_Instancer", "main()")

function main()
{
    if (activeDocument.countItems.length == 0) {alert ("Please use the Count Tool to designate instance positions"); return;}
    if (activeDocument.layerSets.length == 0) {alert ("Error, document doesn't contain any layer groups"); return;}
    OpenMainWindow();
}

//Iterates over count items list and places a random layer from the srcLayerset at its location
function runInstancerFaster(srcLayerset, destLayerset,distributionFunction,rotationRandom,scaleRandom)
{

    
    for (var i = 0; i < activeDocument.countItems.length; i++)
    {
        Randoms.push(Math.random());
        var randomIndex = distributionFunction(srcLayerset.artLayers.length);
        
        var layerPivot = layerOps.center(srcLayerset.artLayers[randomIndex]);
             
        var offsetX = -(layerPivot[0] - activeDocument.countItems[i].position[0]);
        var offsetY = -(layerPivot[1] - activeDocument.countItems[i].position[1]);
        var scaleX = 100 + (Math.random()*scaleRandom*getRandomSign())
        var scaleY =scaleX
        var rot = rotationRandom*Math.random()*getRandomSign();
        var theID = getLayerID(srcLayerset.artLayers[randomIndex]);
        
        var newLayer = duplicateMoveRotateScale (theID, offsetX, offsetY, scaleX, scaleY, rot) 
        newLayer.move (destLayerset, ElementPlacement.INSIDE)

    }
    alert (Randoms);
}

//Iterates over count items list and places a random layer from the srcLayerset at its location
function runInstancerFasterRandom(srcLayerset, destLayerset,distributionFunction,rotationRandom,scaleRandomX, scaleRandomY, FlipX, FlipY, uniformScale, randomHSL, randomH, randomS, randomL)//checkFlipX.value, checkFlipY.value, checkUniformScale.value);
{
    var indexRand = new Array;
    var scaleRandX = new Array;
    var scaleSignRandX = new Array;
    var scaleRandY = new Array;
    var scaleSignRandY = new Array;
    var rotRand = new Array;
    var rotSignRand = new Array;
    var RandFlipX = new Array;
    var RandFlipY = new Array;
 
    var RandHue = new Array;
    var RandSat = new Array;
    var RandLight = new Array;
    
    for (var i = 0; i < activeDocument.countItems.length; i++)
    {
         indexRand.push(distributionFunction(srcLayerset.artLayers.length));
         scaleRandX.push(Math.random());
         scaleRandY.push(Math.random());
         scaleSignRandX.push(getRandomSign());
         scaleSignRandY.push(getRandomSign());
         rotRand.push(Math.random());
         rotSignRand.push(getRandomSign());
         RandFlipX.push(getRandomSign());
         RandFlipY.push(getRandomSign());
         
        RandHue.push(Math.random());
        RandSat.push(Math.random());
        RandLight.push(Math.random());
        
    }
    
    for (var i = 0; i < activeDocument.countItems.length; i++)
    {        
        var layerPivot = layerOps.center(srcLayerset.artLayers[indexRand[i]]);
             
        var offsetX = -(layerPivot[0] - activeDocument.countItems[i].position[0]);
        var offsetY = -(layerPivot[1] - activeDocument.countItems[i].position[1]);
        var scaleX = (FlipX?RandFlipX[i]:1)*(100 + (scaleRandX[i]*scaleRandomX*scaleSignRandX[i]));
        var scaleY =(FlipY?RandFlipY[i]:1)*((uniformScale)?scaleX:(100 + (scaleRandY[i]*scaleRandomY*scaleSignRandY[i])));
        var rot = rotationRandom*rotRand[i]*rotSignRand[i];
        var theID = getLayerID(srcLayerset.artLayers[indexRand[i]]);
        
        var newLayer = duplicateMoveRotateScale (theID, offsetX, offsetY, scaleX, scaleY, rot) 
        newLayer.move (destLayerset, ElementPlacement.INSIDE)
        if (randomHSL) {HSLSmartFilter (randomH *2*(RandHue[i]-0.5), randomS*2*(RandSat[i]-0.5), randomL*2*(RandLight[i]-0.5))}
    }
}

//Generates a random integer between min and max
function getRandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSign()
{
  return (Math.random() >= 0.5)?1:-1;
}


//Main interface window
function OpenMainWindow()
{
    var MainWindow = new Window("dialog", scriptName + " v" + scriptVersion);
    
    var GroupWidth = 500;
    
    MainWindow.orientation = 'column';
    MainWindow.alignChildren = 'center';
    
    var InputGroup = MainWindow.add("group");
    InputGroup.orientation = 'row';
    
        InputGroup.add("statictext", undefined, "Source sprite group:");
        var LayersetsDropdown = InputGroup.add("dropdownlist");
        LayersetsDropdown.preferredSize.width = 250;
        for (var i = 0; i < activeDocument.layerSets.length; i++)
        {
            LayersetsDropdown.add("item",activeDocument.layerSets[i].name);
        }
        LayersetsDropdown.selection = 0;
        
        DistributionPanel = MainWindow.add("panel", undefined, "Distribution");
 //       DistributionPanel.spacing = 0;
        DistributionPanel.orientation = 'column';
        
            var GroupMethod = DistributionPanel.add("Group");
            GroupMethod.orientation = 'row';
            
            
                GroupMethod.add("statictext", undefined, "Random: ");
                var radioRand = GroupMethod.add("radiobutton")
                radioRand.value = true;
                GroupMethod.add("statictext", undefined, "     Sequential: ");
                var radioSeq = GroupMethod.add("radiobutton")
                radioRand.onClick = function(){radioSeq.value= false; radioRand.value = true;}
                radioSeq.onClick = function(){radioSeq.value= true; radioRand.value = false;}          
                
            var GroupRotation = DistributionPanel.add("panel", undefined, "Rotation");
            GroupRotation.orientation = 'row';
            GroupRotation.spacing = 0;
            GroupRotation.preferredSize.width = GroupWidth;
                
                GroupRotation.add("statictext", undefined, "     Random: ");
                var editRotation = GroupRotation.add("edittext", undefined, "0");
                GroupRotation.add("statictext", undefined, "°");
                GroupRotation.add("statictext", undefined, "      Random Flip            X:");
                var checkFlipX = GroupRotation.add("checkbox");
                GroupRotation.add("statictext", undefined, "  Y:");
                var checkFlipY = GroupRotation.add("checkbox");       
 
             var GroupScale = DistributionPanel.add("panel", undefined, "Scale");
            GroupScale.orientation = 'row';
            GroupScale.spacing = 0;
            GroupScale.preferredSize.width = GroupWidth;
 
            GroupScale.add("statictext", undefined, "   Uniform:");
            var checkUniformScale = GroupScale.add("checkbox");
            checkUniformScale.value = true;
            checkUniformScale.onClick = function()
            {
                editScaleY.enabled = !checkUniformScale.value
            }
            
            GroupScale.add("statictext", undefined, "    Random        X: ");
            var editScaleX = GroupScale.add("edittext", undefined, "0");
            GroupScale.add("statictext", undefined, "%      Y: ");
            var editScaleY = GroupScale.add("edittext", undefined, "0");
            editScaleY.enabled = false;
            GroupScale.add("statictext", undefined, "%");
            
            
                         var GroupHSL = DistributionPanel.add("panel", undefined, "Hue/Saturation/Lightness");
            GroupHSL.orientation = 'row';
            GroupHSL.spacing = 0;
            GroupHSL.preferredSize.width = GroupWidth;
 
            GroupHSL.add("statictext", undefined, "   Enable:");
            var checkHSL = GroupHSL.add("checkbox");
            checkHSL.value = false;
            checkHSL.onClick = function()
            {
                HueRand.enabled = SatRand.enabled = LightRand.enabled =  checkHSL.value;
            }
            
            GroupHSL.add("statictext", undefined, "    Random        Hue: ");
            var HueRand = GroupHSL.add("edittext", undefined, "0");
            GroupHSL.add("statictext", undefined, "/180°      Saturation: ");
            var SatRand = GroupHSL.add("edittext", undefined, "0");
            GroupHSL.add("statictext", undefined, "%      Lightness: ");
            var LightRand = GroupHSL.add("edittext", undefined, "0");
            HueRand.enabled = SatRand.enabled = LightRand.enabled = false;
            GroupHSL.add("statictext", undefined, "%");
            


 
    ConfirmGroup = MainWindow.add("group");
    ConfirmGroup.orientation = 'row';
        OkButton = ConfirmGroup.add("button", undefined, "Ok");
        OkButton.onClick = function()
        {
            
               ///HSLSmartFilter STUFF
                function distRandom(inLength) {return getRandomInt(0, inLength-1)}
                function distSequential(inLength) {var tmp = sequentialNum%inLength; sequentialNum = sequentialNum+1; return tmp;}
                var srcLayerset = activeDocument.layerSets[LayersetsDropdown.selection.index];
                if (srcLayerset.artLayers.length == 0) {alert ("Error, group contains no layers"); return;}
                var newLayerset = activeDocument.layerSets.add();
                newLayerset.name = "NSInstancer Layers";
                runInstancerFasterRandom(srcLayerset, newLayerset,((radioRand.value)?distRandom:distSequential), (isNaN(Number(editRotation.text))?0:Number(editRotation.text)),(isNaN(Number(editScaleX.text))?0:Number(editScaleX.text)),(isNaN(Number(editScaleY.text))?0:Number(editScaleY.text)),checkFlipX.value, checkFlipY.value, checkUniformScale.value,checkHSL.value,(isNaN(Number(HueRand.text))?0:Number(HueRand.text)),(isNaN(Number(SatRand.text))?0:Number(SatRand.text)),(isNaN(Number(LightRand.text))?0:Number(LightRand.text)));
                MainWindow.close();return result;
        }

        CancelButton = ConfirmGroup.add("button", undefined, "Cancel"); 
        CancelButton.onClick = function()
        {MainWindow.close();return result;}
        
    MainWindow.center();
	var result = MainWindow.show();

}



function HSLSmartFilter(inH, inS, inL)
{
    //DEPRECATED
    smartfilter.HSL(inH, inS, inL)
}

function getLayerID(inLayer)
{
    //DEPRECATED
    return layerOps.getID(inLayer)
}
    

function duplicateMoveRotateScale (theID, theX, theY, theScaleX, theScaleY, theRotation) 
{
    //DEPRECATED
    return layerOps.duplicateTransform(theID, [theX, theY], [theScaleX,theScaleY], theRotation)
}
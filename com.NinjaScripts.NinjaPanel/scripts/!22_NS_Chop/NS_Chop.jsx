eval("#include \""+Folder($.fileName).parent.parent.fullName + "/NS_LIB.jsxinc\"");
//#include "NS_LIB.jsxinc" 

#target photoshop


var scriptName = "TitleScript Chop";
var scriptVersion = "0.05";

activeDocument.suspendHistory("TS_Slice", "Main()")

function Main()
{
    if (getSelectedLayersIdx().length != 1){ alert("Please select only the layer you would like to chop."); return;} 
    var originalRulerUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.POINTS;

    optionsDialog();
    
    app.preferences.rulerUnits = originalRulerUnits;
}

function optionsDialog()
{
	saveOptionsDlg = new Window("dialog", scriptName + " v" + scriptVersion);
	
	saveOptionsDlg.orientation = 'column';
	saveOptionsDlg.alignChildren = 'left';
	
	//The Main group
	myMainGroup = saveOptionsDlg.add("group");
  	
	//The Input Group
    myInputGroup = myMainGroup.add("group");
    myInputGroup.orientation = 'row';
    myInputGroup.alignChildren = 'left';
    myInputGroup.alignment = 'left'; 
    
    var strokeSlider = myInputGroup.add("slider", undefined, 60, 0, 250);
    myInputGroup.add("statictext",undefined, "   ");
    
    var textPx = myInputGroup.add('edittext {text: 0, characters: 5, justify: "right", active: true}');
    
    textPx.onChange = function () {strokeSlider.value = Number (textPx.text); strokeSlider.onChange();}
    myInputGroup.add("statictext",undefined, "px");
  
    strokeSlider.preferredSize.width = 250;
    strokeSlider.onChange = function ()
    {

        textPx.text = strokeSlider.value.toFixed(1);
        layerStroke (strokeSlider.value, 100, [255,0,0]); 
        app.refresh(); 

    }

    strokeSlider.onChanging = function ()
    {

        textPx.text = strokeSlider.value.toFixed(1);

    }
    
 	//The Buttons Group
	myButtonsGroup = saveOptionsDlg.add("group");
	myButtonsGroup.orientation = 'row';
	myButtonsGroup.alignChildren = 'center';
	myButtonsGroup.alignment = 'center';

	myOkButton = myButtonsGroup.add("button", undefined, "Chop");
	myOkButton.onClick = function()
    {
                layerUnstroke();
            Chop(strokeSlider.value);
            activeDocument.activeLayer.remove();
            saveOptionsDlg.close();

    }

	myCancelButton = myButtonsGroup.add("button", undefined, "Cancel");
	myCancelButton.onClick = function()
    {
        layerUnstroke();
        saveOptionsDlg.close();
	}

    strokeSlider.onChange();
	saveOptionsDlg.center();
	var result = saveOptionsDlg.show();
}


//////////////////////////////////////////////////

function Chop(inExpansion){
    
    
    
    var desc922 = new ActionDescriptor();
    var ref529 = new ActionReference();
    ref529.putProperty( cID( "Chnl" ), cID( "fsel" ) );
    desc922.putReference( cID( "null" ), ref529 );
    var ref530 = new ActionReference();
    ref530.putEnumerated( cID( "Chnl" ), cID( "Chnl" ), cID( "Trsp" ) );
    desc922.putReference( cID( "T   " ), ref530 );
    executeAction(  cID( "setd" ), desc922, DialogModes.NO );

    activeDocument.selection.expand(inExpansion);

    activeDocument.quickMaskMode=true;

    activeDocument.activeLayer.threshold (1);

    var desc642 = new ActionDescriptor();
    desc642.putClass( cID( "Nw  " ), cID( "Dcmn" ) );
    var ref535 = new ActionReference();      
    ref535.putEnumerated( cID( "Chnl" ),  cID( "Ordn" ), cID( "Trgt" ) );
    desc642.putReference( cID( "Usng" ), ref535 );
    executeAction( cID( "Mk  " ), desc642, DialogModes.NO );


// =======================================================
activeDocument.resizeImage("200%", "200%", undefined, ResampleMethod.NEARESTNEIGHBOR)

// =======================================================
var desc934 = new ActionDescriptor();
var ref535 = new ActionReference();
ref535.putProperty( cID( "Chnl" ), cID( "fsel" ) );
desc934.putReference( cID( "null" ), ref535 );
var ref536 = new ActionReference();
var idOrdn = cID( "Ordn" );
var idTrgt = cID( "Trgt" );
ref536.putEnumerated( cID( "Chnl" ), idOrdn, idTrgt );
desc934.putReference( cID( "T   " ), ref536 );
executeAction( cID( "setd" ), desc934, DialogModes.NO );


activeDocument.selection.makeWorkPath(0.5);

// =======================================================
activeDocument.resizeImage("50%", "50%", undefined, ResampleMethod.NEARESTNEIGHBOR)

var pathInfo=collectPathInfoFromDesc (activeDocument, activeDocument.pathItems[activeDocument.pathItems.length-1])
var subPathsLength= activeDocument.pathItems[0].subPathItems.length

// =======================================================
    var desc974 = new ActionDescriptor();
    desc974.putEnumerated( cID( "Svng" ), cID( "YsN " ), cID( "N   " ) );
executeAction( cID( "Cls " ), desc974, DialogModes.NO );

// =======================================================
activeDocument.quickMaskMode=false

// =======================================================

    //make channel
    // =======================================================
    var idMk = cID( "Mk  " );
        var desc6 = new ActionDescriptor();
        var idNw = cID( "Nw  " );
            var desc7 = new ActionDescriptor();
            var idNm = cID( "Nm  " );
            desc7.putString( idNm, "ContiguityMask" );
            var idClrI = cID( "ClrI" );
            var idMskI = cID( "MskI" );
            var idMskA = cID( "MskA" );
            desc7.putEnumerated( idClrI, idMskI, idMskA );
            var idClr = cID( "Clr " );
                var desc8 = new ActionDescriptor();
                var idRd = cID( "Rd  " );
                desc8.putDouble( idRd, 255.000000 );
                var idGrn = cID( "Grn " );
                desc8.putDouble( idGrn, 0.000000 );
                var idBl = cID( "Bl  " );
                desc8.putDouble( idBl, 0.000000 );
            var idRGBC = cID( "RGBC" );
            desc7.putObject( idClr, idRGBC, desc8 );
            var idOpct = cID( "Opct" );
            desc7.putInteger( idOpct, 50 );
        
        desc6.putObject( idNw, cID( "Chnl" ), desc7 );
        var idUsng = cID( "Usng" );
            var ref5 = new ActionReference();
            
            var idfsel = cID( "fsel" );
            ref5.putProperty( cID( "Chnl" ), idfsel );
        desc6.putReference( idUsng, ref5 );
    executeAction( idMk, desc6, DialogModes.NO );


    

    for(i=0;i<subPathsLength;i++){
    //deselect
     
    var idsetd = cID( "setd" );
        var desc279 = new ActionDescriptor();
        
            var ref137 = new ActionReference();
            
            var idfsel = cID( "fsel" );
            ref137.putProperty( cID( "Chnl" ), idfsel );
        desc279.putReference( cID( "null" ), ref137 );
        var idT = cID( "T   " );
        var idOrdn = cID( "Ordn" );
        var idNone = cID( "None" );
        desc279.putEnumerated( idT, idOrdn, idNone );
    executeAction( idsetd, desc279, DialogModes.NO );
    ///select alpha channel
    var idslct = cID( "slct" );
        var desc315 = new ActionDescriptor();
        
            var ref175 = new ActionReference();
            
            ref175.putName( cID( "Chnl" ), "ContiguityMask" );
        desc315.putReference( cID( "null" ), ref175 );
    executeAction( idslct, desc315, DialogModes.NO );
    //use magic wand
    var idsetd = cID( "setd" );
        var desc263 = new ActionDescriptor();
        
            var ref123 = new ActionReference();
            
            var idfsel = cID( "fsel" );
            ref123.putProperty( cID( "Chnl" ), idfsel );
        desc263.putReference( cID( "null" ), ref123 );
        var idT = cID( "T   " );
            var desc264 = new ActionDescriptor();
            var idHrzn = cID( "Hrzn" );
            var idRlt = cID( "#Rlt" );
            desc264.putUnitDouble( idHrzn, idRlt, pathInfo[i][0][0]);
            var idVrtc = cID( "Vrtc" );
            var idRlt = cID( "#Rlt" );
           
            desc264.putUnitDouble( idVrtc, idRlt, pathInfo[i][0][1]);
        var idPnt = cID( "Pnt " );
        desc263.putObject( idT, idPnt, desc264 );
        var idTlrn = cID( "Tlrn" );
        desc263.putInteger( idTlrn, 1 );
    executeAction( idsetd, desc263, DialogModes.NO );
    
    

    var idslct = cID( "slct" );
        var desc346 = new ActionDescriptor();
        
            var ref205 = new ActionReference();
            
            
            var idRGB = cID( "RGB " );
            ref205.putEnumerated( cID( "Chnl" ), cID( "Chnl" ), idRGB );
        desc346.putReference( cID( "null" ), ref205 );
        var idMkVs = cID( "MkVs" );
        desc346.putBoolean( idMkVs, false );
    executeAction( idslct, desc346, DialogModes.NO );



    
    try{
    // =======================================================
    var idCpTL = cID( "CpTL" );
    executeAction( idCpTL, undefined, DialogModes.NO );

       // function convertToSmartObject()
    var idnewPlacedLayer = stringIDToTypeID( "newPlacedLayer" );
    executeAction( idnewPlacedLayer, undefined, DialogModes.NO );


    var idslct = cID( "slct" );
        var desc348 = new ActionDescriptor();
        
            var ref206 = new ActionReference();
            var idLyr = cID( "Lyr " );
            var idOrdn = cID( "Ordn" );
            var idBckw = cID( "Bckw" );
            ref206.putEnumerated( idLyr, idOrdn, idBckw );
        desc348.putReference( cID( "null" ), ref206 );
        var idMkVs = cID( "MkVs" );
        desc348.putBoolean( idMkVs, false );
    executeAction( idslct, desc348, DialogModes.NO );
    

    }catch(e){}
    


    }
    var idsetd = cID( "setd" );
        var desc1045 = new ActionDescriptor();
        
            var ref578 = new ActionReference();
            
            var idfsel = cID( "fsel" );
            ref578.putProperty( cID( "Chnl" ), idfsel );
        desc1045.putReference( cID( "null" ), ref578 );
        var idT = cID( "T   " );
        var idOrdn = cID( "Ordn" );
        var idNone = cID( "None" );
        desc1045.putEnumerated( idT, idOrdn, idNone );
    executeAction( idsetd, desc1045, DialogModes.NO );

    // =======================================================

    var idDlt = cID( "Dlt " );
        var desc694 = new ActionDescriptor();
        
            var ref323 = new ActionReference();
            
            ref323.putName( cID( "Chnl" ), "ContiguityMask" );
        desc694.putReference( cID( "null" ), ref323 );
    executeAction( idDlt, desc694, DialogModes.NO );

    var idHd = cID( "Hd  " );
        var desc736 = new ActionDescriptor();
        
            var list22 = new ActionList();
                var ref541 = new ActionReference();
                var idLyr = cID( "Lyr " );
                var idOrdn = cID( "Ordn" );
                var idTrgt = cID( "Trgt" );
                ref541.putEnumerated( idLyr, idOrdn, idTrgt );
            list22.putReference( ref541 );
        desc736.putList( cID( "null" ), list22 );
    executeAction( idHd, desc736, DialogModes.NO );

}



function collectPathInfoFromDesc (myDocument, thePath) {
var myDocument = app.activeDocument;

// based of functions from xbytor’s stdlib;
var ref = new ActionReference();
for (var l = 0; l < myDocument.pathItems.length; l++) {
   var thisPath = myDocument.pathItems[l];
   if (thisPath == thePath && thisPath.name == "Work Path") {
      ref.putProperty(cID("Path"), cID("WrPt"));
      };
   if (thisPath == thePath && thisPath.name != "Work Path" && thisPath.kind != PathKind.VECTORMASK) {
      ref.putIndex(cID("Path"), l + 1);
      };
   if (thisPath == thePath && thisPath.kind == PathKind.VECTORMASK) {
        var idPath = cID( "Path" );
        var idPath = cID( "Path" );
        var idvectorMask = sID( "vectorMask" );
        ref.putEnumerated( idPath, idPath, idvectorMask );
      };
   };
var desc = app.executeActionGet(ref);
var pname = desc.getString(cID('PthN'));
// create new array;
var theArray = new Array;
var pathComponents = desc.getObjectValue(cID("PthC")).getList(sID('pathComponents'));
// for subpathitems;
for (var m = 0; m < pathComponents.count; m++) {
   var listKey = pathComponents.getObjectValue(m).getList(sID("subpathListKey"));
// for subpathitem’s count;
   for (var n = 0; n < listKey.count; n++) {
      var points = listKey.getObjectValue(n).getList(sID('points'));
// get first point;
      var anchorObj = points.getObjectValue(0).getObjectValue(sID("anchor"));
      var anchor = [anchorObj.getUnitDoubleValue(sID('horizontal')), anchorObj.getUnitDoubleValue(sID('vertical'))];
      var thisPoint = [anchor];
      theArray.push(thisPoint);
      };
   };

// reset;

return theArray;
};



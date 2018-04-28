//activeDocument.suspendHistory("TS_Switch", "main()")
/*
function reselectLayers(Layers)
{for(var i = 0; i< Layers.length; i++)
    {
        try{
        addSelect(Layers[i]);
        }
    catch(e){}
    
    }
}*/
/*
function addSelect(TslIndex)
{
    var oID12 = charIDToTypeID( "slct" );
    var oDesc3 = new ActionDescriptor();
    var oID13 = charIDToTypeID( "null" );
    var oRef3 = new ActionReference();
    var oID14 = charIDToTypeID( "Lyr " );
    oRef3.putIndex( oID14, TslIndex );
    oDesc3.putReference( oID13, oRef3 );
    var oID15 = stringIDToTypeID( "selectionModifier" );
    var oID16 = stringIDToTypeID( "selectionModifierType" );
    var oID17 = stringIDToTypeID( "addToSelection" );
    oDesc3.putEnumerated( oID15, oID16, oID17 );
    var oID18 = charIDToTypeID( "MkVs" );
    oDesc3.putBoolean( oID18, false );
    executeAction( oID12, oDesc3, DialogModes.NO );

}*/


function getSelectedLayers(){
  var resultLayers=new Array();
  try{
    var idGrp = stringIDToTypeID( "groupLayersEvent" );
    var descGrp = new ActionDescriptor();
    var refGrp = new ActionReference();
    refGrp.putEnumerated(charIDToTypeID( "Lyr " ),charIDToTypeID( "Ordn" ),charIDToTypeID( "Trgt" ));
    descGrp.putReference(charIDToTypeID( "null" ), refGrp );
    executeAction( idGrp, descGrp, DialogModes.NO );
    for (var ix=0;ix<app.activeDocument.activeLayer.layers.length;ix++){resultLayers.push(app.activeDocument.activeLayer.layers[ix])}
    var id8 = charIDToTypeID( "slct" );
    var desc5 = new ActionDescriptor();
    var id9 = charIDToTypeID( "null" );
    var ref2 = new ActionReference();
    var id10 = charIDToTypeID( "HstS" );
    var id11 = charIDToTypeID( "Ordn" );
    var id12 = charIDToTypeID( "Prvs" );
    ref2.putEnumerated( id10, id11, id12 );
    desc5.putReference( id9, ref2 );
    executeAction( id8, desc5, DialogModes.NO );
  } catch (err) { }
  return resultLayers;
}   

main();
function main()
{
    var Layers = getSelectedLayers();
    if (Layers.length != 2) {alert("Please select excatly 2 layers")}
    else
    {
    
    
    var DistLayers = distanceVector (getCenter(Layers[1]), getCenter(Layers[0]));
    
    Layers[1].translate(DistLayers[0],DistLayers[1]);
    Layers[0].translate(-DistLayers[0],-DistLayers[1]);}
  //  reselectLayers(Layers);
    
    
    
    
    
    return;
 }


function distanceVector(inA,inB)
{
    return [inB[0]-inA[0],inB[1]-inA[1]]
}
    
    
function getCenter(inLayer)
{
    var Pivot = new Array();
    Pivot[0] = (inLayer.bounds[2] + inLayer.bounds[0])/2;
    Pivot[1] = (inLayer.bounds[3] + inLayer.bounds[1])/2;
    return Pivot
}
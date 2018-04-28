//#target photoshop

var scriptName = "NinjaScript IterateAction";
var scriptVersion = "0007";
var inExtensions = /\.(jpg|tif|psd|bmp|gif|png|exr|)$/i;
var sourceFolder = null;


var today = new Date();
StartTime = today.valueOf();

var currentActionSets = getActionSets();




main();



function main()
{
    // bring application forward for double-click events
    app.bringToFront();
	// user settings
	var prefs = new Object();
	prefs.sourceFolder         = '~';  // default browse location (default: '~')
	prefs.removeFileExtensions = true; // remove filename extensions for imported layers (default: true)
	prefs.savePrompt           = false; // display save prompt after import is complete (default: false)
	prefs.closeAfterSave       = false; // close import document after saving (default: false)
    
    
    optionsDialog();

}




function scanFiles(inFolder)
{
        var allFiles = inFolder.getFiles (inExtensions);
     //   alert(allFiles.length);
        //alert (allFiles);
        return allFiles;
}

function performAction (inFile, inActionSet, inAction)
{
    open(inFile);
    doAction(inAction,inActionSet);
 //   doAction("Test","Hotkeys");
    activeDocument.close (SaveOptions.SAVECHANGES);
    inFile.copy (sourceFolder + "/Done/" + inFile.displayName)
    inFile.remove();
 }


function optionsDialog()
{
    var ButtonWidth = 110;
    
	OpenOptionsDialog = new Window("dialog", scriptName + " v" + scriptVersion);
	
	OpenOptionsDialog.orientation = 'column';
	OpenOptionsDialog.alignChildren = 'left';
    
	
	//The Main group
    myMainGroup = OpenOptionsDialog.add("group");
    myMainGroup.orientation = 'column';
        myMainGroup.alignChildren = 'left';
    myMainGroup.alignment = 'left';     
    
    OpenGroup = myMainGroup.add("group")
 //   OpenGroup.orientation = 'row';
    OpenGroup.alignChildren = 'left';
    OpenGroup.alignment = 'left'; 
        

    







    var actionGroup = OpenGroup.add("group");
    actionGroup.orientation = 'row';
    
    actionGroup.add("statictext",undefined, "ActionSet: ")
    var DDActionSet = actionGroup.add("dropdownlist",undefined, "")
    DDActionSet.preferredSize.width = 150;
    

    
    for (var i = 0; i < currentActionSets.length; i++)
    {
            DDActionSet.add("item", currentActionSets[i]);
    }
    DDActionSet.selection = 0;
    
    
      
    actionGroup.add("statictext",undefined, "                Action: ")
    DDActions = actionGroup.add("dropdownlist",undefined, "")
    DDActions.preferredSize.width = 150;
    
    
    function populateDDActions (inSet)
    {
            DDActions.removeAll();
            
            for (var i = 0; i < currentActionSets[inSet].actions.length; i++)
            {
                DDActions.add("item", currentActionSets[inSet].actions[i]);
            }
            DDActions.selection = 0;
        
        
    }

        DDActionSet.onChange = function()
    {

        populateDDActions(DDActionSet.selection.index);
    }
    DDActionSet.onChange();
    
    
   // }    




        //>> Art Panel
    ArtGroup = myMainGroup.add("group");
    ArtGroup.orientation = 'row';
    ArtGroup.alignChildren = 'center';
    ArtGroup.alignment = 'top';     

            
    buttonArt= ArtGroup.add("button",undefined, "Run")
    buttonArt.preferredSize.width = ButtonWidth;
    buttonArt.onClick = function()
 
   {
       var SelectedLayers = getSelectedLayers();
       
        for (var i = 0; i < SelectedLayers.length; i++)
        {
            activeDocument.activeLayer = SelectedLayers[i];
            doAction(myTable[2].items[i].text, myTable[1].items[i].text);
            
        }
            alert("Done!\nProcessed "+ StartNumber +  " files in " + ((new Date).valueOf() - StartTime )/1000 + "s.");
    }
    
     buttonProj= ArtGroup.add("button",undefined, "Exit")
    buttonProj.preferredSize.width = ButtonWidth;
    buttonProj.onClick = function() {OpenOptionsDialog.close()}       

    //Show window
	OpenOptionsDialog.center();
	var result = OpenOptionsDialog.show();
}


function getActionSets() {  
  function cTID(s) { return app.charIDToTypeID(s); };  
  var i = 1;  
  var sets = [];  
  while (true) {  
    var ref = new ActionReference();  
    ref.putIndex(cTID("ASet"), i);  
    var desc;  
    var lvl = $.level;  
    $.level = 0;  
    try {  
      desc = executeActionGet(ref);  
    } catch (e) {  
      break;    // all done  
    } finally {  
      $.level = lvl;  
    }  
    if (desc.hasKey(cTID("Nm  "))) {  
      var set = {};  
      set.index = i;  
      set.name = desc.getString(cTID("Nm  "));  
      set.toString = function() { return this.name; };  
      set.count = desc.getInteger(cTID("NmbC"));  
      set.actions = [];  
      for (var j = 1; j <= set.count; j++) {  
        var ref = new ActionReference();  
        ref.putIndex(cTID('Actn'), j);  
        ref.putIndex(cTID('ASet'), set.index);  
        var adesc = executeActionGet(ref);  
        var actName = adesc.getString(cTID('Nm  '));  
        set.actions.push(actName);  
      }  
      sets.push(set);  
    }  
    i++;  
  }  
  return sets;  
};  

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
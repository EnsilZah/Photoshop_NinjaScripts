#target photoshop

var scriptName = "NinjaScript IterateActionLayers";
var scriptVersion = "0002";

var cID = charIDToTypeID
var sID = stringIDToTypeID

#include "../layers.jsxinc"
#include "../actions.jsxinc"




main();
function main()
{
    app.bringToFront();
    optionsDialog();
}

function optionsDialog()
{
    var ButtonWidth = 100;
    var currentActionSets = actionSets.getList()
    
	OpenOptionsDialog = new Window("dialog", scriptName + " v" + scriptVersion);
	
	OpenOptionsDialog.orientation = 'column';
	OpenOptionsDialog.alignChildren = 'left';

    mainGroup = OpenOptionsDialog.add("group");
    mainGroup.orientation = 'column';
    mainGroup.alignChildren = 'left';
    mainGroup.alignment = 'left';     

    var actionSetGroup = mainGroup.add("group");
    actionSetGroup.orientation = 'row';
    actionSetGroup.add("statictext",undefined, "ActionSet: ")
    var DDActionSet = actionSetGroup.add("dropdownlist",undefined, "")
    DDActionSet.preferredSize.width = 150;
       
    for (var i = 0; i < currentActionSets.length; i++)
    {
            DDActionSet.add("item", currentActionSets[i]);
    }
    DDActionSet.selection = 0;
       
       
    var actionGroup = mainGroup.add("group");
    actionGroup.orientation = 'row';
    actionGroup.add("statictext",undefined, "Action:      ")
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
    
    mainGroup.add("statictext", undefined, "");
     
    ButtonGroup = mainGroup.add("group");
    ButtonGroup.orientation = 'row';
    ButtonGroup.alignChildren = 'center';
    ButtonGroup.alignment = 'top';     

            
    buttonRun= ButtonGroup.add("button",undefined, "Run")
    buttonRun.preferredSize.width = ButtonWidth;
    buttonRun.onClick = function()
   {
       var SelectedLayers = selectionLayers.getLayers();
       
        for (var i = 0; i < SelectedLayers.length; i++)
        {
            activeDocument.activeLayer = SelectedLayers[i];
            doAction(DDActions.selection.text, DDActionSet.selection.text);
            
        }
        OpenOptionsDialog.close()
    }
    
    buttonClose= ButtonGroup.add("button",undefined, "Exit")
    buttonClose.preferredSize.width = ButtonWidth;
    buttonClose.onClick = function() {OpenOptionsDialog.close()}       

    //Show window
	OpenOptionsDialog.center();
	var result = OpenOptionsDialog.show();
}
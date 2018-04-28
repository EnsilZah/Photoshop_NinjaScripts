var scriptName = "NinjaScript IterateAction";
var scriptVersion = "0007";
var inExtensions = /\.(jpg|tif|psd|bmp|gif|png|exr|)$/i;
var sourceFolder = null;


#include "../actions.jsxinc"


var today = new Date();
StartTime = today.valueOf();

var currentActionSets = actionSets.getList()





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
        

    



                   
        //>> Previous Projects panel
    SetProjectGroup = OpenGroup.add("panel");   
    SetProjectGroup.alignChildren = 'left';
   // SetProjectGroup.align = 'center';
    SetProjectGroup.preferredSize = [150,0]
    SetProjectGroup.add("statictext",undefined, "Queue:")
    
    
    var myTable = new Array();

    
    groupListboxen = SetProjectGroup.add("group");
    groupListboxen.spacing=0;
    groupListboxen.orientation = 'row';
    
   var header = {numberOfColumns: 1, showHeaders: true, columnWidths: [80]}; 


    header.columnTitles = ["Path"]; //0
    myTable.push (groupListboxen.add ("listbox", undefined, undefined, header))
    
    myTable[0].preferredSize = [600,myTable[0].itemSize.height*12];

    header.columnTitles = ["ActionSet"]; //1
    myTable.push (groupListboxen.add ("listbox", undefined, undefined, header))
    myTable[1].preferredSize = [150,myTable[1].itemSize.height*12];

    header.columnTitles = ["Action"]; //2
    myTable.push (groupListboxen.add ("listbox", undefined, undefined, header))
    myTable[2].preferredSize = [150,myTable[2].itemSize.height*12];
   
    header.columnTitles = ["Files"]; //1
    myTable.push (groupListboxen.add ("listbox", undefined, undefined, header))
    myTable[3].preferredSize = [40,myTable[3].itemSize.height*12];
    
    for (var i = 0; i < myTable.length; i++)
    {
        myTable[i].onClick = function () {  if(this.selection == null) return;UpdateSelection(this.selection.index)}
    }
        
        
    function UpdateSelection(inValue)
    {
         for (var i = 0; i < myTable.length; i++)
         {myTable[i].selection = inValue}
     }


    function moveSelectionToTop()
    {
        //alert (myTable[0].selection.index);
        
        ProjectList.move(myTable[0].selection.index,0);
   //     var temp = myTable[0].selection.text;
      //  myTable[0].remove(myTable[0].selection)
      //  myTable[0].add ("item", temp,0);
      //  myTable[0].selection =0;
    }

    //Save list on close
    OpenOptionsDialog.onClose = function()
    {

    }

    SetProjectGroup.add("statictext", undefined, "");
    var actionGroup = SetProjectGroup.add("group");
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
    
    

   
       SetPButtons = SetProjectGroup.add("group");


   butAddProj = SetPButtons.add("button",undefined, "Add Folder")
   
       editAddProject = SetPButtons.add("edittext",undefined, "")
    editAddProject.preferredSize.width = 700;
   
    butAddProj.onClick = function() 
    {
        
            if (Folder(editAddProject.text).exists)  //If folder
            {
                
                myTable[0].add ("item", Folder(editAddProject.text))
                myTable[1].add ("item", DDActionSet.selection.text);
                myTable[2].add ("item", DDActions.selection.text);
                myTable[3].add ("item", scanFiles(Folder(editAddProject.text)).length);
            }
            else
            {
                alert ("Can't find folder.");// return;
            }
           
            editAddProject.text = "";


    }     

            SetPButtons.add("statictext",undefined, "         ")

    butRemProj = SetPButtons.add("button",undefined, "Remove Folder")
    butRemProj.preferredSize.width = ButtonWidth
   
    butRemProj.onClick = function() 
    {
        for (var i = 0; i < myTable.length; i++)
        { myTable[i].remove(myTable[i].selection);}
            
            if (myTable.length>0)
            {
        myTable[0].selection =0;
        myTable[0].onClick();
        }
    }
    
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
            var StartTime = today.valueOf();
            var StartNumber = 0;

        for (var i = 0; i < myTable[0].items.length; i++)
        {
            UpdateSelection(i);
            
             //  myTable[0].selection  MOOP
                sourceFolder = Folder(myTable[0].items[i].text)
                

                fileList = scanFiles(sourceFolder);
                
                Folder(sourceFolder+"/Done").create();


                for (var j = 0; j < fileList.length; j++)
                {
                    
                    open(fileList[j]);
                    doAction(myTable[2].items[i].text, myTable[1].items[i].text);
                    activeDocument.close (SaveOptions.SAVECHANGES);
                    fileList[j].copy (sourceFolder + "/Done/" + fileList[j].displayName)
                    fileList[j].remove();    
                    
                    StartNumber++;
                    myTable[3].items[i].text = myTable[3].items[i].text - 1;
                   // app.refresh();
                }
            
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

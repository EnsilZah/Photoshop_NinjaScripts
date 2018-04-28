eval("#include \""+Folder($.fileName).parent.parent.fullName + "/NS_LIB.jsxinc\"");
//#include "NS_LIB.jsxinc" 
#target photoshop

var scriptName = "TitleExport"
var scriptVersion = "0.0.4"
var BG_Layer

app.preferences.rulerUnits = Units.PIXELS
app.preferences.typeUnits = TypeUnits.PIXELS

//MacProjectsRoot = "projects/Projects"
//PCProjectsRoot = "/p"
MacBackupRoot = "art/MAC/projects"
TestProjectsRoot = "/d"

ProjectsSaveFolder = "STUDIO/TITLES/Subtitles"
BackupSaveFolder = "mac"
DesktopPath = "~/Desktop"

ProjectName = ""

var TEST = 0;
var MAC = 1;
var WIN = 2;

SystemType = MAC

var ProjectsRoot = new Array;
ProjectsRoot[TEST] ="/p"
ProjectsRoot[MAC] = "projects/Projects";
ProjectsRoot[WIN] = "/p"

var IncludeLayerName = true;
var IncludeNumber = true;


var EditBackupPath
var EditProjectPath

function Main()
{
 
    duplicateDocument();
    Export_Temp_Doc =  activeDocument;
    PrepareDoc();
    
 //   app.refresh();
   ExportDialog();
   
   activeDocument = Export_Temp_Doc;
   app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
 }
Main();

function PrepareDoc()
{
    CreateSolid (dscColorBlack);
    BG_Layer = app.activeDocument.activeLayer;
    BG_Layer.name = "NS_BGLayer";
    BG_Layer.move (app.activeDocument, ElementPlacement.PLACEATEND);
}

function CloseDoc()
{

}

function ProjectDialog()
{    var ProjectSelectWindow = new Window("dialog", scriptName + " v" + scriptVersion);

    
    //MEEEP
    
       var ProjectsList =  ProjectSelectWindow.add ("listbox");
   ProjectsList.preferredSize = [500,800];  // TitlesList.itemSize.height*9

inSource = Folder(ProjectsRoot[SystemType])



    var folderContents = inSource.getFiles().sort();
    
    for(var i = 0; i < folderContents.length; i++)
    {
        if (folderContents[i].constructor == Folder)
                
        {ProjectsList.add("item", folderContents[i].name);} // Test return value}

    }


    var ControlsGroup = ProjectSelectWindow.add("group");
    var result = "";
    ControlsGroup.orientation = 'row';
    ControlsGroup.alignChildren = 'center';
    ControlsGroup.alignment = 'center'; 
    
    	OKButton = ControlsGroup.add("button", undefined, "OK");
	OKButton.onClick = function()
    {
        result = ProjectsList.selection.text
        ProjectSelectWindow.close();

	}

	CancelButton = ControlsGroup.add("button", undefined, "Cancel");
	CancelButton.onClick = function()
    {
        result = "";
        ProjectSelectWindow.close();
	}

    ProjectSelectWindow.center();
    ProjectSelectWindow.show();
        return result
}


function ExportDialog()
{
    var ExportDialogWindow = new Window("dialog", scriptName + " v" + scriptVersion);
    var ControlsGroup = ExportDialogWindow.add("group");
    ControlsGroup.orientation = 'row';
    ControlsGroup.alignChildren = 'left';
    ControlsGroup.alignment = 'left'; 
      
    LayersGroup = ControlsGroup.add("panel", undefined, "Layers:");
    LayersGroup.orientation = 'column';
    LayersGroup.alignChildren = 'left';
    LayersGroup.alignment = 'top';     
    LayersGroup.margins = [10, 10, 10, 10];
    LayersGroup.preferredSize = [160,260];
    
    var TitlesList =  LayersGroup.add ("listbox");
    TitlesList.preferredSize = [182,261];  // TitlesList.itemSize.height*9
  
activeDocument.layers[0].name  
      TitlesList.onClick = function()
    {
       
        for (var i = 0; i < activeDocument.artLayers.length; i++)
        { activeDocument.artLayers[i].visible = false;}
            
       //     SelectAllLayers();
            SetLayersVisible(false);
            activeDocument.activeLayer = activeDocument.artLayers[TitlesList.selection.index];
             activeDocument.artLayers[TitlesList.selection.index].visible = true;

          // SetLayersVisible(true);
            
            if (ExportDialogWindow.enabled){app.refresh();}
            
             updateFilename();
        
    }


  ///Populate list
  //Don't include BG layer
    for (var i = 0; i<(activeDocument.layers.length-1); i++)
    {
        TitlesList.add("item", activeDocument.layers[i].name.replace(/ /g,"_"));
    }
    TitlesList.selection = 0;

    
    



  
     
    
     
     var RightControlsGroup = ControlsGroup.add("group");
    RightControlsGroup.orientation = 'column';
    RightControlsGroup.alignChildren = 'left';
    RightControlsGroup.alignment = 'top';   
        
    
    
    PathGroup = RightControlsGroup.add("panel", undefined, "Export path:");
         PathGroup.orientation = 'column';
             PathGroup.alignment = 'left';
                 PathGroup.alignChildren = 'left';
    //PathGroup.preferredSize.width = 450;
        
   //     PathGroup.graphics.backgroundColor = BGColor;
        
        
      
              DesktopGroup = PathGroup.add("group");
              
        DesktopSelect = DesktopGroup.add("radiobutton")//.value = true;

        DesktopPanel = DesktopGroup.add("panel", undefined, "Desktop Folder:")
                DesktopGroup.orientation = 'row';
        EditDesktop = DesktopPanel.add("edittext",undefined, "Titles_Export");
                EditDesktop.preferredSize.width = 320;
                
        

        ProjectGroup = PathGroup.add("group");
        ProjectGroup.orientation = 'row';
     //   ProjectGroup.preferredSize.width = 450;

        ProjectSelect = ProjectGroup.add("radiobutton")
        ProjectPanel = ProjectGroup.add("panel", undefined, "Project:");
        ProjectPanel.orientation = 'row';
        EditProject = ProjectPanel.add("edittext",undefined, "SELECT PROJECT");
        EditProject.preferredSize.width = 278;
    ///    EditProject.enabled = false;
        ProjectGroup.add("statictext", undefined, "      ");
        bttnBrowse = ProjectPanel.add("iconbutton", undefined, File(Folder($.fileName).parent.parent+ "/Images/FolderIcon.png"));
        bttnBrowse.preferredSize.height = 20
        
        

                
                
        DesktopSelect.onClick = function()
        {
            DesktopSelect.value = true;
            DesktopPanel.enabled = true;
       //     EditDesktop.enabled = true;
            
            ProjectSelect.value = false;
            ProjectPanel.enabled = false;            
           }
       
              ProjectSelect.onClick = function()
        {
            
            
            ProjectSelect.value = true;
            ProjectPanel.enabled = true;
                        
            DesktopSelect.value = false;
            DesktopPanel.enabled = false;
     //       EditDesktop.enabled = false;


          
           }
                            DesktopSelect.onClick();
            
        
        bttnBrowse.onClick = function()
        {

          ProjectName = ProjectDialog()
          if (ProjectName != null)
          {
               EditProject.text = ProjectName;
               if (SystemType == TEST)
                {
                   EditProjectPath = TestProjectsRoot + "/ScriptsTemp/" +  ProjectName +"/" + ProjectsSaveFolder +"/"+dateString();
                   EditBackupPath = TestProjectsRoot + "/ScriptsTemp/" +   ProjectName + "/" + BackupSaveFolder + "/"+dateString();
               }
               
               else
               {
                   EditProjectPath = ProjectsRoot[SystemType] + "/" + ProjectName +"/" + ProjectsSaveFolder +"/"+dateString();                               
                   EditBackupPath = MacBackupRoot +"/" + ProjectName + "/" + BackupSaveFolder + "/"+dateString();
                }
            }
          

        }

       NameGroup = RightControlsGroup.add("panel", undefined,"File Name:");
       
           
    NameGroup.add("group").preferredSize = [10,10]
         NameGroup.preferredSize.width = 440;
     NameGroup.orientation = 'column';
    NameGroup.alignChildren = 'left';
    NameGroup.alignment = 'top';     
     
 
    var FileButtonsGroup = NameGroup.add("group");
         FileButtonsGroup.orientation = 'row';
    FileButtonsGroup.alignChildren = 'left';
    FileButtonsGroup.alignment = 'left';   
    
 
      var CheckLayerName = FileButtonsGroup.add("checkbox", undefined, "Include Layer Name");
     CheckLayerName.value = IncludeLayerName;
     
        var CheckNumber = FileButtonsGroup.add("checkbox", undefined, "Include Number");
      CheckNumber.value = IncludeNumber;
      
      CheckNumber.onClick = function ()
      {
          IncludeNumber = this.value; updateFilename()

            RadioTop.enabled =this.value;
            RadioBottom. enabled = this.value;
      }
     
          CheckLayerName.onClick = function() {IncludeLayerName = this.value; updateFilename()};
             var CheckLayerName = FileButtonsGroup.add("statictext", undefined, "");
     var RadioTop = FileButtonsGroup.add("radiobutton", undefined, "From Top");
     
     RadioTop.onClick = function() {updateFilename()};
     RadioTop.value = true;
     RadioBottom = FileButtonsGroup.add("radiobutton", undefined, "From Bottom");
          RadioBottom.onClick = function() {updateFilename()};
 
 NameGroup.add("group").preferredSize = [10,5] 
 
     var PrefixGroup = NameGroup.add("group");
     PrefixGroup.orientation = 'row';

    PrefixGroup.add("statictext", undefined, "Prefix: ");
     
     var TextPrefix = PrefixGroup.add("edittext",undefined, "");
     TextPrefix.onChanging = function() {updateFilename()}
     TextPrefix.preferredSize.width = 200;
     
     FilenameGroup = NameGroup.add("group");
     FilenameGroup.orientation = 'row';
     
     FilenameGroup.add("statictext", undefined, "Current file name: ")
     currentFilename = FilenameGroup.add("statictext", undefined, "")
     currentFilename.preferredSize.width = 300;
  //   FilenameGroup.add("statictext", undefined, ".tga")
  
   NameGroup.add("group").preferredSize = [10,1] 
     

        

    var ButtonsGroup = ExportDialogWindow.add("group");
    ButtonsGroup.orientation = 'row';
    ButtonsGroup.alignChildren = 'center';
    ButtonsGroup.alignment = 'center'; 
        
    var ButtonExportLayer = ButtonsGroup.add("button", undefined, "Export Layer");
    ButtonExportLayer.onClick = function()
    {

         var LayerNumber = IncludeNumber?PadNumber((RadioTop.value?(TitlesList.selection.index+1):(TitlesList.items.length-TitlesList.selection.index))+"_",3):""
            var ExportFilename = ((TextPrefix.text=="")?"":(TextPrefix.text+"_"))+LayerNumber+(IncludeLayerName?TitlesList.selection.text:"")    
        
                  if((!Folder(ProjectsRoot[SystemType] + "/" + ProjectName).exists || ProjectName =="")&&ProjectSelect.value)
          {alert ("Error, no project selected");}

          else
          {
                          if(!IncludeNumber&&!IncludeLayerName) {alert("Error, please select at least one unique field to include in filename");}
            else
            {
        
        
        if(DesktopSelect.value)
        {
                       
            ExportLayer(ExportFilename, (DesktopPath+"/"+EditDesktop.text+"/"+dateString()));
        }
        else
        {
            ExportLayer(ExportFilename, EditProjectPath);
            ExportLayer(ExportFilename, EditBackupPath);
         }
                            
        alert("Exported layer: " + TitlesList.selection.text);
        }
    }
}



    
        ButtonsGroup.add("statictext", undefined, " ");
 

    var ButtonExportAll = ButtonsGroup.add("button", undefined, "Export All Layers");
    ButtonExportAll.onClick = function ()
    {


         
         
        if((!Folder(ProjectsRoot[SystemType] + "/" + ProjectName).exists || ProjectName =="")&&ProjectSelect.value)
        {alert ("Error, no project selected"); return;}
          
        if(!IncludeNumber&&!IncludeLayerName) 
        {alert("Error, please select at least one unique field to include in filename"); return;}
          

        ExportDialogWindow.enabled = false;
        for (var i = 0; i<activeDocument.layers.length-1; i++)
        {
            TitlesList.selection = i;
            TitlesList.onClick();
      
            var LayerNumber = IncludeNumber?PadNumber((RadioTop.value?(i+1):(TitlesList.items.length-i))+"_",3):""
            var ExportFilename = ((TextPrefix.text=="")?"":(TextPrefix.text+"_"))+LayerNumber+(IncludeLayerName?TitlesList.selection.text:"")      
            
            if(DesktopSelect.value)
            {
                ExportLayer(ExportFilename, (DesktopPath+"/"+EditDesktop.text+"/"+dateString()));
            }
            else
            {

                ExportLayer(ExportFilename, EditProjectPath);
                ExportLayer(ExportFilename, EditBackupPath);
             }

          }
        ExportDialogWindow.enabled = true;
        alert("Exported all layers.");

     }
    
    

    
    ButtonsGroup.add("statictext", undefined, " ");
    var ButtonExportAll = ButtonsGroup.add("button", undefined, "Close",{name: "cancel"});
  
  
       function updateFilename()
     {

         var LayerNumber = IncludeNumber?PadNumber((RadioTop.value?(TitlesList.selection.index+1):(TitlesList.items.length-TitlesList.selection.index))+"_",3):""
         
         
            var ExportFilename = ((TextPrefix.text=="")?"":(TextPrefix.text+"_"))+LayerNumber+(IncludeLayerName?TitlesList.selection.text:"")      
            currentFilename.text = ExportFilename + ".tga"
     }
 
         updateFilename();
   
   ExportDialogWindow.onClose = function ()
   {
        BG_Layer.remove();
   }
   
       TitlesList.onClick();
    ExportDialogWindow.center();
	var result = ExportDialogWindow.show();
}
 
function ExportLayer(inLayerName, inPath)
{
    
    RemoveAlphaChannels()
    SelectTransp();
    SelectionToAlpha();
    app.activeDocument.selection.deselect();
    BG_Layer.visible = true;
    SaveTGADest(File(inPath+ "/"+ inLayerName + ".tga"))

    BG_Layer.visible = false;
    RemoveAlphaChannels()
}
 
 function SaveTGADest(inDestPath)
{
    var SaveFolder = inDestPath.parent;
    
    if(!SaveFolder.exists) 
    {
       SaveFolder.create();
    }    
    tgaSaveOptions = new TargaSaveOptions()
    
    tgaSaveOptions.alphaChannels = true;
    tgaSaveOptions.resolution = TargaBitsPerPixels.THIRTYTWO

    tgaSaveOptions.rleCompression = true;
    app.activeDocument.saveAs(inDestPath, tgaSaveOptions, true,Extension.LOWERCASE)
}
 
 function SelectAllLayers()
 {
    var desc3 = new ActionDescriptor();
    var ref2 = new ActionReference();
    ref2.putEnumerated( cID( "Lyr " ), cID( "Ordn" ), cID( "Trgt" ) );
    desc3.putReference( cID( "null" ), ref2 );
    executeAction( sID( "selectAllLayers" ), desc3, DialogModes.NO );
}

function SetLayersVisible(inValue)
{
    var desc6 = new ActionDescriptor();
    var list2 = new ActionList();
    var ref5 = new ActionReference();
    ref5.putEnumerated( cID( "Lyr " ), cID( "Ordn" ), cID( "Trgt" ) );
    list2.putReference( ref5 );
    desc6.putList( cID( "null" ), list2 );
    executeAction( (inValue)? cID( "Shw " ):cID( "Hd  " ), desc6, DialogModes.NO );
}
    
function RemoveAlphaChannels()
{
    app.activeDocument.channels.removeAll();
}

function dateString()
{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = dd+'.'+mm+'.'+yyyy;
    
 //   dateDay = dd;
    //dateMonth = mm;
    return dd+"_" + mm
}
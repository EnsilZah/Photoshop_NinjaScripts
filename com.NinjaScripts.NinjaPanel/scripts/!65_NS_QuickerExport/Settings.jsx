    var scriptName = "NS Quicker Export Options";
    var scriptVersion = "0003";

var ScriptPath = Folder($.fileName).parent

var defaultXML = <NS_Export_Settings>
</NS_Export_Settings>;

var OpenSettings = readXML(File(ScriptPath + "/Data/Settings.xml" ))

function Settings()
{
    this.Trim = OpenSettings.Settings.Trim == 'true';
    this.Reveal = OpenSettings.Settings.Reveal == 'true';
        this.FolderName = OpenSettings.Settings.FolderName;
            this.FileType = OpenSettings.Settings.FileType;
            this.ShowErrors = OpenSettings.Settings.ShowErrors == 'true';
}

CurrentSettings = new Settings();

main();
function main()
{
    optionsDialog();
}



function optionsDialog()
{
    var MainWindow = new Window("dialog", scriptName + " v" + scriptVersion);
    
    MainWindow.orientation = 'column';
    MainWindow.alignChildren = 'center';
    

    
    OptionsGroup = MainWindow.add("group");
    OptionsGroup.orientation = 'column'; 
    
    
    
    Check01 = OptionsGroup.add("group");
    Check01.orientation = 'row'; 
    var TrimChk = Check01.add("checkbox");
        TrimChk.value = CurrentSettings.Trim;
    Check01.add("statictext",undefined,"Trim               ");
    
    
    var RevealChk = Check01.add("checkbox");
    RevealChk.value = CurrentSettings.Reveal;
    Check01.add("statictext",undefined,"Reveal All");
    

    Check02 = OptionsGroup.add("group");
    Check02.orientation = 'row'; 


     Check02.add("statictext",undefined,"Export Folder: ");
    var ExportFolderEdit = Check02.add("edittext",undefined,"");
    ExportFolderEdit.text = CurrentSettings.FolderName;  
    ExportFolderEdit.preferredSize.width = 200

 
 
 
    Check03 = OptionsGroup.add("group");
    Check03.orientation = 'row'; 
    Check03.add("statictext",undefined,"File Type:");
    var FileDropdown = Check03.add("dropdownlist");
    FileDropdown.preferredSize.width = 220
    FileDropdown.add("item","PNG");
    FileDropdown.selection = 0;
    FileDropdown.enabled = false;
  
      OptionsGroup.add("statictext",undefined," ");
    Check04 = OptionsGroup.add("group");
    Check04.orientation = 'row'; 
    
      var ErrorChk = Check04.add("checkbox");
          ErrorChk.value = CurrentSettings.ShowErrors;    
    var ErrorsText = Check04.add("statictext",undefined,"Show Errors");
    ErrorsText.onClick  = function() {ErrorChk.value = ! ErrorChk.value}


    var ButtonsGroup = OptionsGroup.add("group");
    ButtonsGroup.add("button",undefined,"Run");
    var SaveBttn = ButtonsGroup .add("button",undefined,"Save");
        SaveBttn.onClick = function()
    {

        defaultXML.appendChild(createXMLSettings(TrimChk.value, RevealChk.value, ExportFolderEdit.text, "PNG", ErrorChk.value));
        writeXML(File(ScriptPath + "/Data/Settings.xml" )); 
        MainWindow.close();
    }

    ButtonsGroup .add("button",undefined,"Cancel");

    MainWindow.center();
	var result = MainWindow.show();

}

function readXML (file) {
  var content;
  try {
    file.open('r');
    content = file.read();
    file.close();
    return new XML(content);
  } catch (e) {
    alert("" + e.message + "\nError opening list.");
    return false;
  }
  return true;
};

function writeXML(file) 
{
    try 
    {
        file.open("w");
        file.write(defaultXML);
        file.close();
    } catch (e) {
        alert("" + e.message + "\nError saving list.");
        return false;
    }
    return true;
};


function createXMLSettings(inTrim, inReveal, inFolder, inFile, inErrors)
{
    return <Settings>
                <Trim>{inTrim}</Trim>
                <Reveal>{inReveal}</Reveal>
                <FolderName>{inFolder}</FolderName>
                <FileType>{inFile}</FileType>
                <ShowErrors>{inErrors}</ShowErrors>
            </Settings>;
};
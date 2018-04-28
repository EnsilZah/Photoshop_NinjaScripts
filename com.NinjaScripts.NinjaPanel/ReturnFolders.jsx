function main()
{
    var CurrentFolder = Folder(Folder($.fileName).parent + "/scripts")

    var FolderFiles = CurrentFolder.getFiles()
    var FolderList = new Array;

    //Only include folders that have "NS_" in the name
    for (i = 0; i < FolderFiles.length; i++)
    {
         if ((FolderFiles[i] instanceof Folder) && (strContains(FolderFiles[i].name, "NS_"))) {FolderList.push(FolderFiles[i].name)}
    }

    var fullHTML =
    '<script src="./ext.js"></script>  \n  <script src="./lib/CSInterface-4.0.0.js"></script>  \n  <link id="ppstyle" rel="stylesheet" type="text/css" href="./styleButtons.css">  \n  <body onLoad="onLoaded()">'

    for (var i = 0; i < FolderList.length; i++)
    {
        NameOfFile = (FolderList[i][0] == "!")? FolderList[i].substring(4):FolderList[i];
        NameOfFolder = FolderList[i];

        if (NameOfFile == "NS_SPACER")  //Create Spacer
        {
            fullHTML += "\n\n" + '<p> </p><hr width="50%" size="2" noshade><p> </p>'
        }
        else    //Create Button
        {
            var scriptPath = "scripts" + "/" + NameOfFolder + "/" + NameOfFile + ".jsx";
            var scriptIcon = "scripts" + "/" + NameOfFolder + "/" + NameOfFile + ".png";
            var scriptName = readContents(File(CurrentFolder + "/" + NameOfFolder + "/" + NameOfFile + ".txt"));
            if (scriptName == "" || scriptName == null) scriptName = NameOfFile;
            
            fullHTML += "\n\n" + writeHtmlButton(scriptPath, scriptIcon, scriptName);  
        }
    }

    var outFile = File(Folder($.fileName).parent + "/Buttons.html")
    outFile.open("w");
    outFile.write(fullHTML);
    outFile.close();
}
main();

function readContents(inFile)
{
    if (!inFile.exists) return "";
    inFile.open("r");
    var name = inFile.readln();
    inFile.close();

    return name;
}

function writeHtmlButton (inScript, inIcon, inName)
{
    var outHtml = "<button class='default' id='btn_PHXS'  onClick='runJSX(\""+ inScript +"\")' style='height: 22px; width: 122px'>";
    outHtml += "\n" +  "<img src='"+ inIcon +"' alt='' align='left'/>"
    outHtml += "\n" + inName + "\n" + "</button>";
    
    return outHtml;
}

function strContains (inString, subString)
{
    return (inString.indexOf(subString) > -1);
}


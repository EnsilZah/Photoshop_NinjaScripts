
main();
function main()
{
    if (!activeDocument.saved) {activeDocument.save()}
    var Filename = String(activeDocument.fullName);
    Filename = Filename.substring (0, Filename.indexOf (".psd")) +".jpg"
    SaveJPGDest(Filename)
}

function SaveJPGDest(inDestPath)
{    
    jpgFile = new File( inDestPath );
    jpgSaveOptions = new JPEGSaveOptions()
    
    jpgSaveOptions.quality = 10;
    activeDocument.saveAs(jpgFile, jpgSaveOptions, true,Extension.LOWERCASE)
}

// this function reads in the image coordinates that were calculated by the python file 
async function getImage(){
    var lines = [];
    const response = await fetch("imgcoords.txt");
    const text = await response.text();
    lines = text.split("\n");
    return lines;

}
// this function exports the coordinates into an array into the main js file that can be used 
export async function drawImage() {
    const lines = await getImage();
    return lines;
}
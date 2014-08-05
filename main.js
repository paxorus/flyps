// This JS/DOM script 

// INITIALIZATIONS
var ImgData,Vector;
var V=new Vector();
var timeLapse=document.getElementById("timeLapse");
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext('2d');
var image=document.createElement("img"); 

// CONSTANTS
var HEIGHT=1040;
var WIDTH=585;
var DATA_LENGTH=24633600;// 1170 * 2080 * 4 =9734400
var PIXEL_RANGE=80;// MAXIMUM-MINIMUM=20
var topLeft=[0,0];
var bottomRight=[WIDTH,HEIGHT];
image.src="vial.jpg";
image.onload=repaint;

// change qualifying pixels green
function turnGreen(){
    var start=currentTime();
    for(var row=topLeft[1];row<=bottomRight[1];row++){
        for(var j=indexOf([topLeft[0],row]);j<=indexOf([bottomRight[0],row]);j+=4){
            if(isFly(j)){
                ImgData.data[j]=0;
                ImgData.data[j+1]=255;
                ImgData.data[j+2]=0;
            }
        }
	}
	ctx.putImageData(ImgData,0,0);
	var time_lapse=currentTime()-start;
	// write time to timeLapse element and to console
	console.log(timeLapse.textContent="Operation took "+time_lapse/1000+" seconds.");
}



function isFly(index){
    var pixel=pixelAt(index);
    var boolean=true;
    for (var j=0;j<=2;j++){
        boolean=boolean && (pixel[j]>=minima[j]) && (pixel[j]<=maxima[j]);// between minimum and minimum+range
        boolean=boolean && (Math.abs(pixel[j]-pixel[(j+1)%3])<=interpixel_deviation);// RGB values differ by <= INTERPIXEL
    }
    return boolean;
}

/* minima 50, maxima 110 was good for 1-1 */
function useHint(hint){
    V.copy(minima,hint);
    V.bump(minima,-PIXEL_RANGE/2);
    V.copy(maxima,hint);
    V.bump(maxima,PIXEL_RANGE/2);
    interpixel_deviation=Math.max(Math.max(getDev(0,1),Math.max(getDev(1,2),getDev(0,2))),20);    
}



// PARAMETERS adjusted by hint_pixel
var interpixel_deviation=30;// between RG,GB,BR
var minima=[60,50,55];
var maxima=[110,100,105];
var mouse=[0,0];
var hint_pixel;

// draw a circle, take the hint to ballpark MAXIMUM,MINIMUM, and INTERPIXEL_DEVIATION
canvas.addEventListener("click",function(ev){
    mouse=[ev.offsetX,ev.offsetY];
    dot(mouse);
    // take the mouse hint: MINI=hint-DEV/2, MAXI=hint+DEV/2, INTERPIXEL[0]=1.5*(R-G)
    hint_pixel=pixelAt(indexOf(mouse));
    useHint(hint_pixel);
});

document.addEventListener("keydown",function(ev){
    switch(ev.keyCode){
        case 67:repaint();break;// C
        case 68:ctx.drawImage(image,0,0,WIDTH,HEIGHT);break;// D
        case 70:turnGreen();break;// F
        case 76:V.copy(topLeft,mouse);break;//L
        case 82:V.copy(bottomRight,mouse);break;//R
        //case 72:break; H
        default:console.log(ev.keyCode+" has not been registered.");
    }
});


function dot(point){
    ctx.beginPath();
    ctx.arc(point[0],point[1],20,0,2*Math.PI);
    ctx.fillStyle="rgba(0,0,0,0.2)";
    ctx.fill();
}
function repaint(){
    ctx.drawImage(image,0,0,WIDTH,HEIGHT);
	ImgData=ctx.getImageData(0,0,WIDTH,HEIGHT);   
}
function currentTime(){
    return new Date().getTime();
}
function pixelAt(int){
    return [ImgData.data[int],ImgData.data[int+1],ImgData.data[int+2]];
}
function indexOf(point){
    return 4*(WIDTH*point[1]+point[0]);
}
function getDev(i,j){
        return Math.abs(hint_pixel[i]-hint_pixel[j]);
}



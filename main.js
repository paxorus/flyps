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
image.onload=clearData;

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
    autoshade();
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



var in_shadow=[false,false];

// PARAMETERS adjusted by hint_pixel
var interpixel_deviation=30;// between RG,GB,BR
var minima=[60,50,55];
var maxima=[110,100,105];
var mouse=[0,0];
var hint_pixel;

// draw a circle, take the hint to ballpark MAXIMUM,MINIMUM, and INTERPIXEL_DEVIATION
canvas.addEventListener("click",function(ev){
    mouse=[ev.offsetX,ev.offsetY];
});

document.addEventListener("keydown",function(ev){
    switch(ev.keyCode){
        case 66:V.copy(bottomRight,mouse);shade(bottomRight,ev.keyCode);break;// Bottom
        case 67:clearData();break;// Clear
        case 70:turnGreen();break;// Find
        case 80:plant();break;//Plant
        case 84:V.copy(topLeft,mouse);shade(topLeft,ev.keyCode);break;// Top
        case 85:file_input.click();break;// Upload
        case 72:
            dot(mouse);
            // take the mouse hint: MINI=hint-DEV/2, MAXI=hint+DEV/2, INTERPIXEL[0]=1.5*(R-G)
            hint_pixel=pixelAt(indexOf(mouse));
            useHint(hint_pixel);break;// Hint
        default:console.log(ev.keyCode+" has not been registered.");
    }
});


function dot(point){
    ctx.beginPath();
    ctx.arc(point[0],point[1],20,0,2*Math.PI);
    ctx.fillStyle="rgba(0,0,0,0.2)";
    ctx.fill();
}
function clearData(){
    ctx.drawImage(image,0,0,WIDTH,HEIGHT);
	ImgData=ctx.getImageData(0,0,WIDTH,HEIGHT);
    in_shadow=[false,false];
    topRight=[0,0];
    bottomRight=[WIDTH,HEIGHT];
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
function shade(corner,direction){
    ctx.fillStyle="rgba(0,0,0,0.3)";
    if(direction==84 && !in_shadow[0]){
        if(in_shadow[1]){// if B already set, avoid corners
            console.log("avoiding in TL");
            ctx.fillRect(0,0,bottomRight[0],corner[1]);// top
            ctx.fillRect(0,corner[1],corner[0],bottomRight[1]-corner[1]);// left
        }else{// include corners
            ctx.fillRect(0,0,WIDTH,corner[1]);// top
            ctx.fillRect(0,corner[1],corner[0],HEIGHT-corner[1]);// left
        }
        in_shadow[0]=true;
    }else if(direction==66 && !in_shadow[1]){
        if(in_shadow[0]){// if T already set, avoid corners
            console.log("avoiding in BR");
            ctx.fillRect(topLeft[0],corner[1],WIDTH-topLeft[0],HEIGHT-corner[1]);// bottom
            ctx.fillRect(corner[0],topLeft[1],WIDTH-corner[0],corner[1]-topLeft[1]);// right
        }else{// include corners
            ctx.fillRect(0,corner[1],WIDTH,HEIGHT-corner[1]);// bottom
            ctx.fillRect(corner[0],0,WIDTH-corner[0],corner[1]);// right
        }
        in_shadow[1]=true;
    }// close direction==76
}
function autoshade(){
    ctx.fillStyle="rgba(0,0,0,0.3)";
    ctx.fillRect(0,0,WIDTH,topLeft[1]);// top
    ctx.fillRect(0,bottomRight[1],WIDTH,HEIGHT-bottomRight[1]);// bottom
    ctx.fillRect(0,topLeft[1],topLeft[0],bottomRight[1]-topLeft[1]);
    ctx.fillRect(bottomRight[0],topLeft[1],WIDTH-bottomRight[0],bottomRight[1]-topLeft[1]);
}
// This JS/DOM script 


// INITIALIZATIONS
var ImgData,Vector;
var V=new Vector();
var ctx=canvas.getContext('2d');
var image=document.createElement("img");
var timeLapse,canvas,top_s,bottom_s,left_s,right_s;// DOM IDs

// CONSTANTS
var HEIGHT=1040;
var WIDTH=585;
var DATA_LENGTH=HEIGHT*WIDTH*4;// 1170 * 2080 * 4 =9734400
var PIXEL_RANGE=80;// MAXIMUM-MINIMUM=20
image.onload=clearData;


// ADJUSTIBLE
var topLeft=[0,0];
var bottomRight=[WIDTH,HEIGHT];
image.src="vial.jpg";
var in_shadow=[false,false];

// PARAMETERS adjusted by hint_pixel
var interpixel_deviation=30;// between RG,GB,BR
var minima=[60,50,55];
var maxima=[110,100,105];
var mouse=[0,0];
var hint_pixel;

// SHADOW and BALLS
var side_shades=["top_s","left_s","bottom_s","right_s"];
for(var k in side_shades){
    side_shades[k]=new CropCorner(document.getElementById(side_shades[k]),k);
    side_shades[k].elem.addEventListener("dragover",function(ev){
        shiftShade(ev);
        updateMouse(ev);
    });
}

// elements for TrackBall
var corner_balls=["","","",""];
for(var i in corner_balls){
    corner_balls[i]=new TrackBall(document.getElementById("ball"+i),i);
    // track corner_balls between mousedown and mouseup
    corner_balls[i].elem.addEventListener("dragstart",function(ev){
        ev.dataTransfer.setData("text",ev.target.id.substring(4));// see canvas drop event
    });
}

// cast the JS onto the canvas
putShade();


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
    var bool=true;
    for (var j=0;j<=2;j++){
        bool=bool && (pixel[j]>=minima[j]) && (pixel[j]<=maxima[j]);// between minimum and minimum+range
        bool=bool && (Math.abs(pixel[j]-pixel[(j+1)%3])<=interpixel_deviation);// RGB values differ by <= INTERPIXEL
    }
    return bool;
}

/* minima 50, maxima 110 was good for 1-1 */
function useHint(hint){
    V.copy(minima,hint);
    V.bump(minima,-PIXEL_RANGE/2);
    V.copy(maxima,hint);
    V.bump(maxima,PIXEL_RANGE/2);
    interpixel_deviation=Math.max(Math.max(getDev(0,1),Math.max(getDev(1,2),getDev(0,2))),20);    
}


// EVENT LISTENERS
canvas.addEventListener("click",function(ev){
    updateMouse(ev);
});
canvas.addEventListener("dragover",function(ev){
    ev.preventDefault();
    updateMouse(ev);
    shiftShade(ev);
});

document.addEventListener("keydown",function(ev){
    switch(ev.keyCode){
        case 66:V.copy(bottomRight,mouse);shade(bottomRight,ev.keyCode);break;// Bottom
        case 67:clearData();break;// Clear
        case 70:turnGreen();break;// Find
        case 72:dot(mouse);hint_pixel=pixelAt(indexOf(mouse));useHint(hint_pixel);break;// Hint
        case 80:plant();break;// Plant
        case 83:putShade();// Shade
        case 84:V.copy(topLeft,mouse);shade(topLeft,ev.keyCode);break;// Top
        case 85:file_input.click();break;// Upload
        default:console.log(ev.keyCode+" has not been registered.");
    }
});



/*function autoshade(){
    ctx.fillStyle="rgba(0,0,0,0.3)";
    ctx.fillRect(0,0,WIDTH,topLeft[1]);// top
    ctx.fillRect(0,bottomRight[1],WIDTH,HEIGHT-bottomRight[1]);// bottom
    ctx.fillRect(0,topLeft[1],topLeft[0],bottomRight[1]-topLeft[1]);
    ctx.fillRect(bottomRight[0],topLeft[1],WIDTH-bottomRight[0],bottomRight[1]-topLeft[1]);
}*/

// put the four divs over the canvas
function putShade(){
    side_shades[0].set(0,0,WIDTH,50);
    side_shades[1].set(0,50,50,HEIGHT-100);
    side_shades[2].set(0,HEIGHT-50,WIDTH,50);
    side_shades[3].set(WIDTH-50,50,50,HEIGHT-100);

    corner_balls[0].set(WIDTH-50,50);
    corner_balls[1].set(50,50);
    corner_balls[2].set(50,HEIGHT-50);
    corner_balls[3].set(WIDTH-50,HEIGHT-50);
}
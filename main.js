// This JS/DOM script 


// INITIALIZATIONS
var ImgData,Vector,TrackBall,CropCorner;
var V=new Vector();
var timeLapse=getNode("timeLapse");
var canvas=getNode("canvas");
var ctx=canvas.getContext('2d');

var image=document.createElement("img");
var dataTransfer;// because ev.dataTransfer not in GitHub


// CONSTANTS
var HEIGHT=1040;
var WIDTH=585;
var DATA_LENGTH=HEIGHT*WIDTH*4;// 1170 * 2080 * 4 =9734400
var PIXEL_RANGE=80;// MAXIMUM-MINIMUM=20
image.onload=clearData;


// ADJUSTIBLE
image.src="vial.jpg";
var topLeft=[0,0];
var bottomRight=[WIDTH,HEIGHT];
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
        ev.preventDefault();
        shiftShade(ev);
    });
}

// elements for TrackBall
var corner_balls=["","","",""];
for(var i in corner_balls){
    corner_balls[i]=new TrackBall(document.getElementById("ball"+i),i);
    // track corner_balls between mousedown and mouseup
    corner_balls[i].elem.addEventListener("dragstart",function(ev){
        dataTransfer=ev.target.id.substring(4);// see canvas drop event
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

	// write time to timeLapse element
    var time_lapse=currentTime()-start;
	timeLapse.textContent="Operation took "+time_lapse/1000+" seconds.";
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
    ev.preventDefault();
    updateMouse(ev.pageX,ev.pageY);
});
document.addEventListener("dragover",function(ev){
    ev.preventDefault();
    var normal=[true];
    if(ev.pageX<canvas.offsetLeft){
        flushBorder(canvas.offsetLeft,ev.pageY,normal);
    }else if(ev.pageX>canvas.offsetLeft+WIDTH){
        flushBorder(canvas.offsetLeft+WIDTH,ev.pageY,normal);
    }
    if(ev.pageY<canvas.offsetTop){
        flushBorder(ev.pageX,canvas.offsetTop,normal);
    }else if(ev.pageY>canvas.offsetTop+HEIGHT){
        flushBorder(ev.pageX,canvas.offsetTop+HEIGHT,normal);
    }
    if(normal[0]){// flushBorder signals successful shiftShade bypass
        shiftShade(ev);
    }
});

document.addEventListener("keydown",function(ev){
    switch(ev.keyCode){
        case 66:V.copy(bottomRight,mouse);shade(bottomRight,ev.keyCode);break;// Bottom
        case 67:clearData();break;// Clear
        case 70:turnGreen();break;// Find
        case 72:dot(mouse);hint_pixel=pixelAt(indexOf(mouse));useHint(hint_pixel);break;// Hint
        case 79:case 80:plant(ev.keyCode);break;// Plant, reverse
        case 83:putShade();// Shade
        case 84:V.copy(topLeft,mouse);shade(topLeft,ev.keyCode);break;// Top
        case 85:file_input.click();break;// Upload
        default:console.log(ev.keyCode+" has not been registered.");
    }
});
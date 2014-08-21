// DOM MUTATORS

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

function shiftShade(ev){
    // on dragover, adjust shades and balls using set methods
    updateMouse(ev.pageX,ev.pageY);
    var drop=[ev.pageX-canvas.offsetLeft,ev.pageY-canvas.offsetTop];
    var num=parseInt(dataTransfer,10);

    // set shades and balls
    corner_balls[num].set(drop[0],drop[1]);
    if(num%2===0){
        // TR,BL,next needs vert change
        corner_balls[(num+1)%4].set("no",drop[1]);
        corner_balls[(num+3)%4].set(drop[0],"no");

        // x,y,width,height
        if(num==0){
            var b_height=parseInt(side_shades[2].elem.style.height);
            side_shades[3].set(drop[0],drop[1],WIDTH-drop[0],HEIGHT-b_height-drop[1]);// R
            side_shades[0].set("no","no","no",drop[1]);// T
            side_shades[1].set("no",drop[1],"no",HEIGHT-b_height-drop[1]);// L
        }else if(num==2){
            var t_height=parseInt(side_shades[0].elem.style.height);
            side_shades[1].set("no",t_height,drop[0],drop[1]-t_height);// L
            side_shades[2].set("no",drop[1],"no",HEIGHT-drop[1]);// B
            side_shades[3].set("no",t_height,"no",drop[1]-t_height);// R
        }

    }else{// TL,BR,next needs horiz change
        corner_balls[(num+1)%4].set(drop[0],"no");
        corner_balls[(num+3)%4].set("no",drop[1]);

        if(num==1){
            var b_height=parseInt(side_shades[2].elem.style.height);
            side_shades[3].set("no",drop[1],"no",HEIGHT-b_height-drop[1]);// R
            side_shades[0].set("no","no","no",drop[1]);// T
            side_shades[1].set("no",drop[1],drop[0],HEIGHT-b_height-drop[1]);// L
        }else if(num==3){
            var t_height=parseInt(side_shades[0].elem.style.height);
            side_shades[1].set("no",t_height,"no",drop[1]-t_height);// L
            side_shades[2].set("no",drop[1],"no",HEIGHT-drop[1]);// B
            side_shades[3].set(drop[0],t_height,WIDTH-drop[0],drop[1]-t_height);// R
        }        
    }

    // set virtual search area
    topLeft=[
        parseInt(corner_balls[1].elem.style.left,10)-canvas.offsetLeft+8,
        parseInt(corner_balls[1].elem.style.top,10)-canvas.offsetTop+8
    ];
    bottomRight=[
        parseInt(corner_balls[3].elem.style.left,10)-canvas.offsetLeft+8,
        parseInt(corner_balls[3].elem.style.top,10)-canvas.offsetTop+8
    ];
}

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

// when dragover out of canvas, shiftShade with fake coordinates
function flushBorder(x,y,normal){
    console.log([x,y]);
    shiftShade({pageX:x,pageY:y});
    normal[0]=false;// a signal to document-dragover to skip normal shiftShade
}


// QUICKIES
function isFly(index){
    var pixel=pixelAt(index);
    var bool=true;
    for (var j=0;j<=2;j++){
        bool=bool && (pixel[j]>=minima[j]) && (pixel[j]<=maxima[j]);// between minimum and minimum+range
        bool=bool && (Math.abs(pixel[j]-pixel[(j+1)%3])<=interpixel_deviation);// RGB values differ by <= INTERPIXEL
    }
    return bool;
}
function getNode(id){
    return document.getElementById(id);
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
function updateMouse(x,y){
    mouse=[x-canvas.offsetLeft,y-canvas.offsetTop];
}



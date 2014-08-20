function dot(point){
    ctx.beginPath();
    ctx.arc(point[0],point[1],20,0,2*Math.PI);
    ctx.fillStyle="rgba(0,0,0,0.2)";
    ctx.fill();
}
function getNode(id){
    return document.getElementById(id);
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
function updateMouse(ev){
    ev.preventDefault();
    mouse=[ev.clientX-canvas.offsetLeft,ev.clientY-canvas.offsetTop];
}
function shiftShade(ev){// move two *_s and three *_b based on *_b
    var drop=[ev.clientX-canvas.offsetLeft,ev.clientY-canvas.offsetTop];
    console.log(ev);
    var num=parseInt(ev.dataTransfer.getData("Text"),10);

    // move the balls
    corner_balls[num].set(drop[0],drop[1]);
    if(num%2===0){// TR,BL,next needs vert change
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

    topLeft=[parseInt(side_shades[1].elem.style.left,10),parseInt(side_shades[1].elem.style.top,10)];
    bottomRight=[parseInt(side_shades[3].elem.style.left,10),parseInt(side_shades[3].elem.style.top,10)];

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
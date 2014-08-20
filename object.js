var timeLapse=document.getElementById("timeLapse");
var canvas=document.getElementById("canvas");



function CropCorner(elem,num){
    this.elem=elem;
    this.num=num;
    this.set=function(x,y,w,h){
        if(x!="no"){
            this.elem.style.left=canvas.offsetLeft+x;
        }
        if(y!="no"){
            this.elem.style.top=canvas.offsetTop+y;
        }
        if(w!="no"){
            this.elem.style.width=w;
        }
        if(h!="no"){
            this.elem.style.height=h;
        }
    }
}

function TrackBall(elem,num){
    this.elem=elem;
    this.num=num;
    this.elem.draggable="true";
    this.set=function(x,y){
        if(x!="no"){
            this.elem.style.left=canvas.offsetLeft+x-8;
        }
        if(y!="no"){
            this.elem.style.top=canvas.offsetTop+y-8;
        }
    }
}



function Vector(){
    // [a+z,b+z,c+z]
    this.bump=function(a,b){
        for(var index in a){
            a[index]+=b;
        }
    };
    
    // [a*z,b*z,c*z]
    this.scale=function(a,b){
        for(var index in a){
            a[index]*=b;
        }
    };
    
    // [a+x,b+y,c+z]
    this.add=function(a,b){
        for(var index in a){
            a[index]+=b[index];
        }
    };

    // [x,y,z]
    this.copy=function(a,b){
        for(var index in a){
            a[index]=b[index];
        }
    };
}

// FUNCTION CLOSURES: if a nested function accesses variables outside of its scope, those values are saved with it for it to use
// general example: function a returns function b, has local variable x- when b is returned, its outer context (x) is also stored in memory
// application: function a sets function b to .onclick, and the entire context of a() is saved for b to use
// function a(x){function b(){return x+5}return b}
// var closure1=a(10); closure1 is function b(){return 10+5}
// var result=closure1()
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
var file_input=document.getElementById("file_input");// for Upload click event
var file_output=document.getElementById("file_output");
file_input.addEventListener('change',handleFileSelect,false);// add file on change
var files=[];

function handleFileSelect(ev){
	files=ev.target.files;
	var output=[];
	var f;
	for(var i=0;i<files.length;i++){
		f=files[i];
		f.num=i;
		output.push("<li onclick='plant(this.dataset.num)' data-num="+i+">"+f.name+" "+f.type+"</li>");
	}
	file_output.innerHTML="<ul>"+output.join('')+"</ul>";
	plant("0");
}

// load the next image
function plant(nav){
	var reader=new FileReader();
	reader.onload=function(ev){
		image.src=ev.target.result;
	}
	var newIndex;
	if(nav==79){
		newIndex=parseInt(canvas.dataset.num,10);
		canvas.dataset.num=(newIndex=(newIndex-1+files.length)%files.length);
	}else if(nav==80){
		newIndex=parseInt(canvas.dataset.num,10);
		canvas.dataset.num=(newIndex=(newIndex+1)%files.length);
	}else{
		canvas.dataset.num=(newIndex=parseInt(nav,10));
	}
	reader.readAsDataURL(files[newIndex]);// set .result to data URL
}
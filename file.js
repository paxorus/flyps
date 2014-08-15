var file_input=document.getElementById("file_input");// for Upload click event
var file_output=document.getElementById("file_output");
file_input.addEventListener('change',handleFileSelect,false);// add file on change
var files=[];

function handleFileSelect(ev){
	files=ev.target.files;
	var output=[];
	var f;
	for(var i=0;f=files[i];i++){
		output.push("<li>"+f.name+" "+f.type+"</li>");
	}
	file_output.innerHTML="<ul>"+output.join('')+"</ul>";
}

// load the next image
function plant(){
	var reader=new FileReader();
	reader.onload=function(ev){
		image.src=ev.target.result;
	}
	reader.readAsDataURL(files[0]);// set .result to data URL
}



  var files = evt.target.files; // FileList object
    for (var i = 0, f; f = files[i]; i++) {
      if (!f.type.match('image.*')) {
        continue;
      }
      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload=function(e) {
          // Render thumbnail.
          var span = document.createElement('span');
          span.innerHTML = ['<img class="thumb" src="', e.target.result,'" title="', escape(f.name), '"/>'].join('');
          document.getElementById('list').insertBefore(span, null);
        };

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
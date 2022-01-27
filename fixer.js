function imgAspectRatio(){
  

  setTimeout(function(){
  
    let obj =Array.from( document.getElementsByClassName("core-height"));
    let height = window.innerHeight;
    let width = window.innerWidth;
    let wGreaterH = height > width;
    let multiply;
    console.log("objs",obj)
    
    if(wGreaterH){
    multiply = Math.floor( height/9 )
    }else{
    multiply = Math.floor( width/16 )
    }
    
console.log("before funca")
console.log("elements",obj)
  obj.forEach((element) => {
    console.log("funca")
    element.style.height= `${9*multiply}px`
    element.style.width= `${16*multiply}px`

  });
},3000)
}


setTimeout(function(){

window.addEventListener('resize', imgAspectRatio());
},3000)

imgAspectRatio()


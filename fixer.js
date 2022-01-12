function imgAspectRatio(){

  let obj = document.getElementsByClassName("core-height");
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


  Array.from(obj).forEach((element) => {
    console.log("funca")
    element.style.height= `${9*multiply}px`
    element.style.width= `${16*multiply}px`

  });
}



window.addEventListener('resize', imgAspectRatio());

imgAspectRatio()


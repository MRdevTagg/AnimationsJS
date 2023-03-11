class Button {
  constructor({name,affected}) {
    this.name = name;
    this.$ = $(`.${this.name}`)
    this.pressed = false;
    this.affected = affected
  }
  

  update(){
    if (this.active === true) {
      this.selector.style.color = 'black'
      if (this.name === 'stop') {
      this.selector.style.background = 'orangered';
      } 
      else if(this.name === 'play'){
      this.selector.style.background = 'greenyellow';
      }
      else{
      this.selector.style.background = 'skyblue';
      }
    }
    else {
      this.selector.style.color = 'white'
      this.selector.style.background = 'rgba (0,0,0,.75)'
      }
    }
}

class Animator{
  constructor(){
    this.selected = selected;
    this.buttons = buttons;
    this.controls = {
      cycle :[ $('.forward'),$('.reverse'),$('.loop-forward'),$('.loop-reverse'),$('.loop-pingpong')],
      state:[$('.play'),$('.stoo')]
    };
    this.frameOptions = ['FPS','MIN','MAX','STEP'];
  }
awake(){
  this.controls.state.forEach((btn)=>{
    switch (this.btn.className) {
      case 'play':
        
        break;
      case 'stop':
        
        break;
      default :
      break
    }
  })
  return
}
update()
  
}

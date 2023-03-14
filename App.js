
let loaded = false
let finished = false
let closed = false


const animatedSprite = new Anima({
  transform:new Transform({size:4.5,y: 190}),
  animChange: animChangeHandler,
  animRun : animRunHandler,
  animControls : controller
});
animatedSprite.setAnimation(idle)
const s2 = new Anima({
  name:'sprite2',
  transform : new Transform({size:2.7, x : 20,y:195}),
  animChange: animChangeHandler,
  animRun : animRunHandler,
  animControls : controller
})
s2.setAnimation(flip)

const interruptor = new Animation({
  name: 'interruptor',
  path: 'img/',
  format: 'png',
  cycle: 'forward'
})
const inter = new Anima({name:'inter',})
const Animations = [idle, walk, flip, interruptor]
inter.setAnimation(interruptor)
inter.transform.x  = 250
inter.controls.enabled = false


const elements = [animatedSprite,s2,inter]

let selected = animatedSprite;
let frameOption = ['FPS','MAX','MIN','STEP'];
let I = 0;
let frameProp = frameOption[I];
let framePropInt = selected.frame.rate;


Animations.forEach((anim, index, a) => {
    anim.anim_length()
})
function update(){
    RAF(update)


elements.forEach((el)=>{
 el.animate();
})

if (!closed) {
  $('.frameset').style.display='flex'

 frameProp = frameOption[I]

 switch (frameProp) {
   case 'FPS':
     framePropInt = selected.frame.rate
     break;
   case 'MAX':
     framePropInt = selected.frame.max
     break;
   case 'MIN':
     framePropInt = selected.frame.min
     break;
   case 'STEP':
     framePropInt = selected.frame.step
     break;
 
 }
 
 if (selected.state_changed === true) {
   changeBtn(btncontrollers,btnstate)
 }

 ID('AnimMonitor').textContent = 
 ` NAME: ${selected.name}
 PREV: ${selected.prev_anim?.name}
 NEXT: ${selected.next_anim.name}
 STATE: ${selected.state}
 CYCLE: ${selected.cycle}
 FRAME: ${selected.frame.current}`

  $('#framerate p').innerHTML = `${framePropInt}`
  $('.frame-options').innerHTML = `${frameProp} : (click for more)`
}
else{
  $('.frameset').style.display='none'
  
}


}
const btnstate = [$('.play'),$('.stop')]
const btncontrollers = [ $('.forward'),$('.reverse'),$('.loop-forward'),$('.loop-reverse'),$('.loop-pingpong') ]


EV(window,'load',update)
EV(ID('background'),start,()=>{    selected.element.style.outline = 'none'
})
EV(ID('inter'),start,()=>{
  inter.cycle === 'forward' ?
  inter.cycle = 'reverse' :
    inter.cycle = 'forward'
    inter.play()

})
elements.forEach((el)=>{ if(el.mode!=='canvas'){
  EV(el.element,start,()=>{
    selected.element.style.outline = 'none'
    selected = el;
    el.element.style.outline = '1px solid #288ACFC2'
    selected.state_changed = true
  })}
  else{}
})
btnstate.forEach((btn) => {
EV(btn,start,(e)=>{
  e.target.className === 'stop' ?
    selected.stop():
    selected.play()
  })})

btncontrollers.forEach((btn)=>{

EV(btn,start, (e) => {
  selected.loop(e.target.className)
  selected?.play()
})
})
EV(ID('idle'),start,()=>{selected.setAnimation(idle)})
EV(ID('walk'),start,()=>{
  selected.setAnimation(walk)
  selected.controls.move = true
})
EV(ID('walk'),end,()=>{
  selected.setAnimation(idle)

})
EV(ID('left'),start,()=>{
  selected.controls.right = false
  selected.controls.left = true
  

})
EV(ID('left'),end,()=>{
selected.controls.left = false
  selected.setAnimation(idle)


})
EV(ID('right'),start,()=>{
selected.controls.left = false
selected.controls.right = true
})
EV(ID('right'),end,()=>{
selected.controls.right = false
selected.setAnimation(idle)

})
EV(ID('flip'),start,()=>{
  selected.setAnimation(flip)})

EV($('.frame-options'),start,()=>{
  I < frameOption.length-1 ?
  I ++ : I = 0
  
})

EV($('.plusfrr'), start, () => {
  
  switch (frameProp) {
    case 'FPS':
    selected.frame.rate < 60?
    selected.frame.rate +=1 :
    selected.frame.rate = 0
    break;
    case 'MAX':
    selected.frame.max < selected.animation.frames?
    selected.frame.max += 1 :
    selected.frame.max = selected.animation.frames

    break;
    case 'MIN':
    selected.frame.min < selected.frame.max?
    selected.frame.min += 1 :
    selected.frame.min = selected.frame.max

    break;
    case 'STEP':
    selected.frame.step += 1
    break;
  }
})
EV($('.minusfrr'), start, () => {
  switch (frameProp) {
    case 'FPS':
    selected.frame.rate > 0?
    selected.frame.rate -= 1 :
    selected.frame.rate = 60
    break;
    case 'MAX':
    selected.frame.max > selected.animation.start?
    selected.frame.max -= 1 :
    selected.frame.max = selected.animation.start

    break;
    case 'MIN':
    selected.frame.min > selected.animation.start?
    selected.frame.min -= 1 :
    selected.frame.min = selected.animation.start

    break;
    case 'STEP':
    selected.frame.step -= 1
    break;
  }

})
EV($('.close'),start,()=>{
  closed === false?
  closed = true : closed = false
})
EV(window,'keydown',(e)=>{
  if(selected){
  switch (e.key) {
    case 'ArrowRight':
      selected.controls.left = false
      selected.controls.right = true
      break;
    case 'ArrowLeft':
      selected.controls.right = false
      selected.controls.left = true
      break;
    default:
      break;
  }
}
})
EV(window,'keyup',(e)=>{
  if(selected){
  switch (e.key) {
    case 'ArrowRight':
      selected.controls.right = false
    

      break;
    case 'ArrowLeft':
      selected.controls.left = false
    
     
      break;
    default:
      break;
  }
}
})
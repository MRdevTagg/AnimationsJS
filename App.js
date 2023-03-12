
let loaded = false
let finished = false
let closed = false
/*const c = ID('game')
const ctx = c.getContext('2d')
c.style.border = '1px solid #000'*/

const animatedSprite = new Anima({transform:new Transform({size:3.5,y: 190})});
const s2 = new Anima({name:'sprite2',transform : new Transform({size:2.7, x : 20,y:195})})
const s3 = new Anima({name:'sprite3',transform : new Transform({size:2.5, x: 300,scale:-1})})
const s4 = new Anima({name:'sprite4',transform : new Transform({size:2, x: 200, scale:-1,y:205})})
const s5 = new Anima({name:'sprite5',transform : new Transform({size:1.7,y:210})})
const s6 = new Anima({name:'sprite6',transform : new Transform({size:1.2,y:220,velocity:1.2})})
const interruptor = new Animation({
  name: 'interruptor',
  path: 'img/',
  format: 'png',
  cycle: 'forward'
})
const inter = new Anima({name:'inter',})
const Animations = [idle, walk, flip, interruptor]
inter.next_anim = interruptor
inter.animation = interruptor
inter.transform.x  = 250
inter.controls.enabled = false


const elements = [animatedSprite,s2,s3,s4,s5,s6,inter]

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
 PREV: ${selected.prev_anim.name}
 NEXT: ${selected.next_anim.name}
 STATE: ${selected.state}
 CYCLE: ${selected.cycle}
 FRAME: ${selected.frame.current}`

  $('#framerate p').innerHTML = `${framePropInt}`
  $('.frame-options').innerHTML = `${frameProp} :`
}
else{
  $('.frameset').style.display='none'
  
}


}
const btnstate = [$('.play'),$('.stop')]
const btncontrollers = [ $('.forward'),$('.reverse'),$('.loop-forward'),$('.loop-reverse'),$('.loop-pingpong') ]


EV(window,'load',update)
EV(ID('background'),'touchstart',()=>{    selected.element.style.outline = 'none'
})
EV(ID('inter'),'touchstart',()=>{
  inter.cycle === 'forward' ?
  inter.cycle = 'reverse' :
    inter.cycle = 'forward'
    inter.play()

})
elements.forEach((el)=>{ if(el.mode!=='canvas'){
  EV(el.element,'touchstart',()=>{
    selected.element.style.outline = 'none'
    selected = el;
    el.element.style.outline = '1px solid #288ACFC2'
    selected.state_changed = true
  })}
  else{}
})
btnstate.forEach((btn) => {
EV(btn,'touchstart',(e)=>{
  e.target.className === 'stop' ?
    selected.stop():
    selected.play()
  })})

btncontrollers.forEach((btn)=>{

EV(btn,'touchstart', (e) => {
  selected.loop(e.target.className)
})
})
EV(ID('idle'),'touchstart',()=>{selected.setAnimation(idle)})
EV(ID('walk'),'touchstart',()=>{
  selected.setAnimation(walk)
  selected.controls.move = true
})
EV(ID('walk'),'touchend',()=>{
  selected.setAnimation(idle)

})
EV(ID('left'),'touchstart',()=>{
  selected.controls.right = false
  selected.controls.left = true
  

})
EV(ID('left'),'touchend',()=>{
selected.controls.left = false
  selected.setAnimation(idle)


})
EV(ID('right'),'touchstart',()=>{
selected.controls.left = false
selected.controls.right = true
})
EV(ID('right'),'touchend',()=>{
selected.controls.right = false
selected.setAnimation(idle)

})
EV(ID('flip'),'touchstart',()=>{
  selected.setAnimation(flip)})

EV($('.frame-options'),'touchstart',()=>{
  I < frameOption.length-1 ?
  I ++ : I = 0
  
})

EV($('.plusfrr'), 'touchstart', () => {
  
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
EV($('.minusfrr'), 'touchstart', () => {
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
EV($('.close'),'touchstart',()=>{
  closed === false?
  closed = true : closed = false
})

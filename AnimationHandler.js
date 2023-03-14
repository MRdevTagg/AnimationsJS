
class Controller{
  constructor(){
    this.enabled = true;
    this.move = false;
    this.right = false;
    this.left = false;
    this.jump = false;
    this.crunch = false;
    this.grab = false;
    this.climb = false;
    this.shoot = false;
    this.action = false;
    this.pause = false;
  }
  
}

class Collider {
  constructor({transform}) {
    this.transform = transform || new Transform({})
    }
  update(){
    
  }
}

class Transform {
  constructor({size,w,h,x,y,z,scale,opacity}) {
    this.size = size || 1.5
    this.w = w || 70 /this.size
    this.h = h || 102 /this.size
    this.x = x || 100
    this.y = y || 200
    this.z = z || 0
    this.scale = scale || 1
    this.opacity = opacity || 1
    
    this.velocity = 1
    this.facingRight = true;
   
  }
  update(element){
    element.width = this.w;
    element.height = this.h;
    element.style.left = this.x +'px';
    element.style.top = this.y +'px';
    element.style.transform = `scaleX(${this.scale})`;
    element.style.opacity = this.opacity;
    
  }
  move(){
    this.x += this.velocity*this.scale
  }
}

class Frame{
  constructor( current, min, max, step, rate, lap){
      this.current = current || 1
      this.previous = 0
      this.min = min || 0
      this.max = max || 1
      this.step = step || 1
      this.rate = rate || 24
      this.lap = lap || 0
      this.reachEnd = ()=> this.current === this.max
      this.reachStart = ()=> this.current === this.min
      this.reachPoint = point => this.current === point

  }

}

class Animation {
  constructor({ anima, name, path, format, start, cycle }) {
    this.anima = anima
    this.name = name || ''
    this.path = path || 'img'
    this.format = format || 'png'
    this.start = start || 0
    this.cycle = cycle || 'loop-forward'

    this.frames = 1
    this.images = []

    this.lengthSet = false

    this.anim_length =async () => {
      // Build the URL of the current image to check.
      let url = `${this.path}/${this.name}${this.frames}.${this.format}`
      // Check if the length of the animation has been set.
      if (this.lengthSet !== true) {
        // Make a GET request to the current image URL using fetch().
        
        fetch(url)
          .then(response => {
            // If the response status is "OK", add the URL to the images array,
            // increase the frames counter by 1, and call anim_length() again
            // to check if there are more images.
            if (response.ok) {
              this.images.push(url)
              this.frames += 1
              this.anim_length()
            } else {
              // If the response status is not "OK", it means there are no more
              // images, so set lengthSet to true and set url to null.
              this.lengthSet = true
              
            }
          })
          .catch(error => {
            console.log('finish'),error});
      }
      else {
        this.lengthSet = true;
        return}
    }
  }
}

class Anima {
  constructor({frame,animation,transform,collider,name,controls,cycle,state, mode,animRun,animChange,animControls}) {
    this.name = name || 'sprite'
    this.element = ID(this.name) 
    this.frame = frame || new Frame({});
    this.animation = animation || new Animation({anima : this});
    this.transform = transform || new Transform({});
    this.controls = controls || new Controller({});
    this.collider = collider || new Collider({transform : this.transform});
    this.cycle = cycle || 'loop-forward';
    this.state = state || 'play';
    this.prev_frame;
    this.mode = mode || 'source';
    this.counter = 0;
    this.direction = 1;
    this.state_changed = true;
    
    this.next_anim;
    this.prev_anim;
    
    this.animRun = animRun || null ;
    this.animChange = animChange || null ;
    this.animControls = animControls || null ;
    this.anim_waiting =()=> this.animation !== this.next_anim;
    
    this.transition = (current,next)=>
      this.animation.name === current && this.next_anim.name === next;
      
    this.canDraw = () => this.frame.current <= this.animation.frames && this.frame.current >= this.animation.start && this.frame.current !== this.frame.previous && this.animation.lengthSet;
  }
  
 play(){
   if(this.state === 'stop'){
     this.state = 'play'
     this.state_changed = true;
   }
 }
 stop(){
if(this.state === 'play'){
  this.state = 'stop' 
  this.state_changed = true;
  }
 }
 /// this method will change the loop cycle of current animation
 // we must pass in the argument a string with the loop cycle name
 // posible values are : 'forward','reverse','loop-forward','loop-reverse' and 'loop-pingpong'
 // the default will be 'forward'
 loop(prop = 'forward') {
   this.cycle = prop;
   this.state_changed = true;
   this.frame.lap =0
 }
 /// this method will ask to change the animation
 /// then will jump to animaOnChange to handle this change
 setAnimation(anim){
   this.next_anim = anim
 }
 
 // this method the frame step
 frameStep(){
   if (this.direction === -1 && this.frame.current > this.frame.min || this.direction === 1 &&  this.frame.current < this.frame.max) {
        this.frame.current += this.direction
   }
   else {this.frame.current += 0}
   
 }
 // this method handle the behavior of each loop cycles
 playModes(){

if(this.animation.lengthSet){
    switch (this.cycle){
      case "forward" :
        if(this.frame.reachEnd()){
        this.frame.current = this.frame.max
        this.stop()
        this.frame.lap += 1
        
        }
        else {
          this.direction = 1
        }
        break;
        
        case "reverse":
        if (this.frame.reachStart()) {
          this.frame.current = this.frame.min;
          this.stop();
          this.frame.lap += 1;
        }
        else {
          this.direction = -1;
        }break;
        
      case 'loop-forward':
       
       if( this.frame.current < this.frame.max ){
         this.direction = 1;
       }
       else{ 
         this.frame.lap += 1;
         this.frame.current = this.frame.min ;
         
       }
        break;
      case 'loop-reverse':
        this.frame.current > this.frame.min ?
        this.direction = -1 :
        this.frame.current = this.frame.max
      break;
      case 'loop-pingpong':
        if (this.frame.reachEnd()){
          this.direction = -1}
        else if(this.frame.reachStart()){
          this.direction = 1}
        break;
      default : this.direction = 1
    }

}
  
  }
     
// this method changes the image source based on current frame value
draw(){
  this.animatorRunning()
  this.element.src = this.animation.images[this.frame.current]
  this.frame.previous = this.frame.current  
}
// this method will handle changes during animation
// this method is usefull when you want to do something when animation reaches any frame
animatorRunning(){
this.animRun && this.animRun(this)
}
/// this method will handle the situation where next animation is difretent from current animation
animaOnChange(){
if (this.animChange) {
  this.animChange(this)
} else {
  this.switchAnimation()
}
}
/// this method will update the transform component baser on controls
controller(){
this.animControls && this.animControls(this)
}

animate(){
  if(this.state === 'play'){
    this.counter+=1;
    this.frame.max = this.animation.images.length-1
    this.controller()
    if(this.counter >= Math.round(60/this.frame.rate)){ 
      this.counter = 0;
      this.frameStep()
      this.anim_waiting() && this.animaOnChange()
      this.playModes()
    }
    this.transform.update(this.element)
    this.canDraw() && this.draw()
    }
}

switchAnimation(){
   if(this.anim_waiting()){
      this.frame.max = this.next_anim.images.length
      this.frame.min = this.next_anim.start
      this.frame.lap = 0
      this.loop(this.next_anim.cycle)
      this.frame.current = 0
      this.prev_anim = this.animation
      this.animation = this.next_anim
    }
 }
 
 
} 


/* 

//// CREATE ANIMA ////

-- STEP 1 --
-- SETTING IMAGES TO WORK PROPERLY --
    First than anything you need to have your images set properly named in your folder. 

    EXAMLPLE : let's say you have a walk animation set of 14 frames, each one in separated files in .png format, you should name them like this: 
    (walk1.png,walk2.png,...,walk14.png). 
    this number at the end of the animation name will represent each frame.
    Done with this you have to put tthe images inside your root directory, for this example we'll name the folder 'img' ( wich is the default value).
    
 -- STEP 2 -- 
 -- CREATE & SET ANIMATION --

    Now we are ready to create our first Animation Component...
    Create an animation set is easy.
    Lets create two of them so we can switch from one to another:
    
  const walk = new Animation({
  name: 'walk', //string must be equal to img name without the number that we put at the end earlier//
  path: 'img', // in case you have a more complex path just pass a string with usual slashes. for example : 'img/character/' //
  format: 'png', //string for extension (without the dot) //
});
 const idle = new Animation({
  name: 'idle', // string 
  path: 'img', // string
  format: 'png', // string
});

With this done lets proced with the Anima cemponent.

-- STEP 3
First we need to create the animated element and get it linked with a DOM node or canvas element(we'll see it later)
---- HTML (document node): ----
Begin by adding the node in your html file (or create it via JavaScript), for example an img tag and then assign an id : 
<img id="myID">

-- STEP 4 -- 
Now you are ready to create the Anima class object, to assign the element's id to the component just pass it as a string to the Anima 'name' property.
--- Notice that Anima's properties are inside an object --

const anima = new Anima({name: 'myID'});

-- METHODS & PROPS
 _________________________
|                         |
| @@Method setAnimation() |
|_________________________|

Now (to make this work) we must set the animation. otherwise we will have an error.
this method will take only one argument wich is the animation we want to request

anima.setAnimation(idle);

This method will say to Anima component that a new animation is requested. 
internally it will fire anim_waiting() method that returns true if current animation 
is not equal to the animation requested
Then it will ask to change the animation after some condition met and 
this condition can be setted by animaOnchange() method(we'll see it next).. 

 __________________________    
|                          |
| @@Method animaOnChange() |
|__________________________|

  the default behavior of this method will be to change animation right away, but we can customize this using the
  animChange Anima's property. this property must be a function with a single argument to reference the 
  anima we're working with
  this method comes to be the transition handler.
  To do so we can take advantage of transition method an write less code
  the transition()method takes two string parameters, the first is the current animation name
  and the second is the next animation name. this method will compare if the given names are in fact 
  these animations names and then will return true. in other words it's like we were asking if 
  some transition is taking place in a given moment. 
  eg.:

  function changeHandler(el)//el = reference to anima//{
        if(el.transition('flip','walk')){
        el.frame.reachEnd() && el.switchAnimation()
        }else{
          el.switchAnimation()
        }
  }

  or a more complex one:

  function changeHandler(el){
  switch (true) {
    case el.transition('walk','idle'):
      if(el.frame.current < 6){
      if(el.direction === 1){
      el.loop('loop-reverse')}
      el.frame.reachPoint(4) && (el.controls.move = false)
      
      if (el.frame.reachStart()) {
        el.controls.move = false
        el.switchAnimation()}
      }
      else{el.frame.reachStart() && el.switchAnimation()}
      
      break;
      case el.transition('flip','walk'):
        el.frame.reachEnd() && el.switchAnimation()
        break;
        case el.transition('flip','idle'):
        el.frame.reachEnd() && el.switchAnimation()
        break;
    default : el.switchAnimation()
     
     break;
  }
}
  this function, like the example above could be
  an if/else conditions chaining or a switch statement
  another important thing is that the default value in case none of this conditions met must be to
  switch the animation for this we will use the switchAnimation() method

  --- switchAnimation method is the actual method that internally changes the animation

  now we're ready to pass the function to our anima's property
  we have two ways:
  the first, in the moment we crate the anima :

  const anima = new Anima({name: 'myID',animChange:changeHandler});

  or:

  anima.animChange = changeHandler

  ( note that we don't pass any parameter, 
  that's because it will be passeed internally inside the animaOnChange()method
  you must never pass a parameter )

  In conclusion if we don't change the animChange property, the default bahavior 
  will be change the animation right away
  otherwise we can pass a function that handle all posibilities and changes between animations


*/

const walk = new Animation({
  name: 'walk',
  path: 'img',
  format: 'png',
})
const idle = new Animation({
  name: 'idle',
  path: 'img',
  format: 'png',
})
const flip = new Animation({
  name: 'flip',
  path: 'img',
  format: 'png',
})
// this method will handle changes during animation
// this method is usefull when you want to do something when animation reaches any frame
function animRunHandler(anima){
  switch (anima.animation.name) {
    case 'flip':
      if (anima.frame.reachPoint(4)) {
        anima.transform.scale =-anima.transform.scale
      }
      break;
    case 'walk':
      if (anima.frame.reachPoint(3)) {
         anima.controls.move = true
      }
      if (anima.frame.current > 5) {
         anima.frame.min = 4
      }
      break;
    case 'idle':
      anima.controls.move = false
      break;
  }
}
/// this method will handle the situation where next animation is difretent from current animation
function animChangeHandler(anima){
  switch (true) {
    case anima.transition('walk','idle'):
      if(anima.frame.current < 6){
      if(anima.direction === 1){
      anima.loop('loop-reverse')}
      anima.frame.reachPoint(4) && (anima.controls.move = false)
      
      if (anima.frame.reachStart()) {
        anima.controls.move = false
        anima.switchAnimation()}
      }
      else{anima.frame.reachStart() && anima.switchAnimation()}
      
      break;
      case anima.transition('flip','walk'):
        anima.frame.reachEnd() && anima.switchAnimation()
        break;
        case anima.transition('flip','idle'):
        anima.frame.reachEnd() && anima.switchAnimation()
        break;
    default : anima.switchAnimation()
     
     break;
  }
}
/// this method will update the transform component based on controls
function controller(anima){
  if (anima.controls.enabled) {
  switch (true) {
    case anima.controls.move:
     anima.transform.move()
      break;
    case anima.controls.left:
      anima.transform.scale >0 ?
        anima.setAnimation(flip) :
        anima.setAnimation(walk)
      break;
    case anima.controls.right :
      anima.transform.scale <0 ?
        anima.setAnimation(flip) :
        anima.setAnimation(walk)
      break; 
    case !anima.controls.right && !anima.controls.left :
      anima.setAnimation(idle);
      break;
      default:anima.setAnimation(idle)
  }
}
}


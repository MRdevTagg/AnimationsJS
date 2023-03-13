
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
      this.current = current || 0
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
    this.name = name || 'idle'
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
            console.log(error)});
      }
      else return
    }
  }
}

class Anima {
  constructor({frame,animation,transform,collider,element,name,controls,cycle,state, mode}) {
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
    this.direction = 1;//frame
    this.state_changed = true;
    
    this.next_anim = idle;
    this.prev_anim = idle;
    
    this.anim_waiting =()=> this.animation !== this.next_anim;
    
    this.transition = (current,next)=>
      this.animation.name === current && this.next_anim.name === next;
      
    this.canDraw = () => this.frame.current <= this.animation.frames && this.frame.current >= this.animation.start && this.frame.current !== this.frame.previous && this.animation.lengthSet;
  }
  
create(parent){
  
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
 loop(prop) {
   this.cycle = prop;
   this.state_changed = true;
   this.frame.lap =0
 }
 
 setAnimation(anim){
   this.next_anim = anim
 }
 
 
 frameStep(){
   if (this.direction === -1 && this.frame.current > this.frame.min || this.direction === 1 &&  this.frame.current < this.frame.max) {
        this.frame.current += this.direction
   }
   else {this.frame.current += 0}
   
 }
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
     

draw(){

  this.animatorRunning()


  this.element.src = this.animation.images[this.frame.current]
  this.frame.previous = this.frame.current  
  

}

animatorRunning(){
  switch (this.animation.name) {
    case 'flip':
      if (this.frame.reachPoint(4)) {
        this.transform.scale =-this.transform.scale
      }
      break;
    case 'walk':
      if (this.frame.reachPoint(3)) {
         this.controls.move = true
      }
      if (this.frame.current > 5) {
         this.frame.min = 4
      }
      break;
    case 'idle':
      this.controls.move = false
      break;
  }
}
animaOnChange(){
  switch (true) {
    case this.transition('walk','idle'):
      if(this.frame.current < 6){
      if(this.direction ===1){
      this.loop('loop-reverse')}
      this.frame.reachPoint(4) && (this.controls.move = false)
      
      if (this.frame.reachStart()) {
        this.controls.move = false
        this.switchAnimation()}
      }
      else{this.frame.reachStart() && this.switchAnimation()}
      
      break;
    case this.transition('idle','walk'):
        this.switchAnimation()
      break;
     case this.transition('idle','flip'):
        this.switchAnimation()
      break;
      case this.transition('walk','flip'):
        this.switchAnimation()
      break;
      case this.transition('flip','walk'):
        this.frame.reachEnd() && this.switchAnimation()
        break;
        case this.transition('flip','idle'):
        this.frame.reachEnd() && this.switchAnimation()
        break;
    default : this.switchAnimation()
     
     break;
  }
}

controller(){
  if (this.controls.enabled) {
    
  
  switch (true) {
    case this.controls.move:
     this.transform.move()
      break;
    case this.controls.left:
      this.transform.scale >0 ?
        this.setAnimation(flip) :
        this.setAnimation(walk)
      break;
    case this.controls.right :
      this.transform.scale <0 ?
        this.setAnimation(flip) :
        this.setAnimation(walk)
      break;
    
  }
}
}

animate(){

  //this is the Animation component method that will set the length of frames 

  if(this.state === 'play'){

     this.counter+=1;
      this.frame.max = this.animation.images.length-1

          this.controller()


  if(this.counter >= Math.round(60/this.frame.rate)){ 
    this.counter = 0;
    //this.playModes()

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

    Now we are ready to create our first Animation...
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
Now you are ready to create the Anima class component, to assign the element's id to the component just pass it as a string to the Anima 'name' property.
--- Notice that Anima's properties are inside an object --

const anima = new Anima({name: 'myID'});

-- METHODS & PROPS
 _________________________
|                         |
| @@Method setAnimation() |
|_________________________|
You can create animations and switch between them on the run using setAnimation() method.
An example could be :

anima.setAnimation(idle);

This method will say to Anima component that a new animation is requested. Then it will ask to change the animation after some condition met, this condition can be setted by transition() function that returns a boolean. and it will be called inside  animaOnchange() method.(we'll see it next).. 
    the default beahavior of this transition will be to change animation after the current animation reaches the last frame.
    
  @@Method animaOnChange()
  
  this method comes to be the transition handler.
  we must know about Frame component and Animation component to set it properly
*/

const walk = new Animation({
  name: 'walk',
  path: 'img',
  format: 'png',
})
const idle = new Animation({
  name: 'idle',
  path: 'img/',
  format: 'png',
})
const flip = new Animation({
  name: 'flip',
  path: 'img/',
  format: 'png',
})



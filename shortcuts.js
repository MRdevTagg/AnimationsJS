const $ = selector => document.querySelector(selector);
const ID = id => document.getElementById(id)

const $$ = selector => document.querySelectorAll(selector) ;
const $ch = (parent, child) => document.querySelector(parent).querySelector(child);
const EV = (selector, evnt, callback) =>  selector.addEventListener(evnt, callback);
const isClass = (sel, classname) => sel.classList.contains(classname);
const addClass = (selector, classname) => selector.classList.add(classname);
const removeClass = (selector = null, classname) => selector.classList.remove(classname)
  
const changeClass = (el,add)=>{
 removeClass(el,'');
 addClass(el,add)
}
const rect = sel => sel.getBoundingClientRect();
const nNull = el => el !== null && el !== undefined;
const RAF = fun => window.requestAnimationFrame(fun);
function inputUpdate(touch,mouse){
  navigator.userAgent.match(/Android/i) ||
  navigator.userAgent.match(/iPhone/i) ? 
    input = touch: input= mouse;
    return input
    }
 
		let start = inputUpdate('touchstart','mousedown')
		let move = inputUpdate('touchmove','mousemove')
		let end = inputUpdate('touchend','click')
		
		
const create = ({element='div',parent='div',clase=null,id = null,times = 1,content = null, source = null})=>{
 let el = document.createElement(element);
 if(nNull(id)){
   el.setAttribute('id',`${id}${times}`)
 }
 if(nNull(source)){
   el.setAttribute('src',source)
 }
 if(nNull(clase)){
 addClass(el, clase);
 }
 $(parent).appendChild(el);
 times--
 if(times > 0){
  create({element,parent,clase,id,times,content,source})
 }
 else return
} 


function changeBtn(cycles,states){
  selected.state_changed = false
  if(nNull(states)){
   states.forEach((state)=>{
   if (state.className === selected.state) {
   state.style.color = 'black'
   state.className === 'play'?
   state.style.background = 'greenyellow':
   state.style.background = 'orangered'
   }
   else{
     state.style.background = 'rgba(0,0,0,.75)'
     state.style.color = 'white'
        
   }})
   
  }
  if (nNull(cycles)) {
   cycles.forEach((cycle)=>{
   if(selected.cycle===cycle.className  ){
     cycle.style.background = 'skyblue'
     cycle.style.color = 'black'
   }
   else{
     cycle.style.background = 'rgba(0,0,0,.75)'
     cycle.style.color = 'white'
   }})
  }
  return
 }

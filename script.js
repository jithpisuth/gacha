let data = JSON.parse(localStorage.getItem("ultraGacha")) || {
tickets:20,total:0,pity:0,five:0,four:0,
guaranteed:false,inventory:[],usedCodes:[],achievements:[]
};

const banner5="Neon Goddess";
const pool5=["Neon Goddess","CEO Overlord","Time Breaker"];
const pool4=["Cyber Mage","Night Sniper","Elite Guard"];
const pool3=["Intern","Training Bot","Slime"];

function save(){localStorage.setItem("ultraGacha",JSON.stringify(data));}

function updateUI(){
if(document.getElementById("tickets"))
document.getElementById("tickets").innerText=data.tickets;

if(document.getElementById("stats"))
document.getElementById("stats").innerHTML=
`Total: ${data.total} | 5★: ${data.five} | Pity: ${data.pity}`;
}

function roll(times){
if(data.tickets<times){alert("Not enough tickets");return;}
data.tickets-=times;
for(let i=0;i<times;i++)singleRoll();
updateUI();renderAll();save();
}

function singleRoll(){
data.total++;data.pity++;
let rate5=0.006;
if(data.pity>=74)rate5+=(data.pity-73)*0.06;
if(data.pity>=90)rate5=1;

if(Math.random()<rate5){
data.five++;data.pity=0;
let isRateUp=false;
if(!data.guaranteed && Math.random()<0.5){
data.guaranteed=true;
}else{
isRateUp=true;data.guaranteed=false;
}
let char=isRateUp?banner5:pool5[Math.floor(Math.random()*pool5.length)];
data.inventory.push({name:char,r:5});
cinematic(char,5);
unlock("first5","🏆 First 5★!");
return;
}

if(Math.random()<0.051){
data.four++;
let char=pool4[Math.floor(Math.random()*pool4.length)];
data.inventory.push({name:char,r:4});
cinematic(char,4);
return;
}

let char=pool3[Math.floor(Math.random()*pool3.length)];
data.inventory.push({name:char,r:3});
cinematic(char,3);
}

function cinematic(name,rarity){
let c=document.getElementById("cinematic");
c.innerHTML="✨";
c.className="show";
setTimeout(()=>{
c.innerHTML=name+"<br>"+rarity+"★";
c.style.color=rarity==5?"gold":rarity==4?"#4da6ff":"#aaa";
},700);
setTimeout(()=>{c.className="";},2000);
}

function renderAll(){
if(document.getElementById("inventoryList")){
let div=document.getElementById("inventoryList");
div.innerHTML="";
data.inventory.forEach(c=>{
div.innerHTML+=`<div class="inventory-card r${c.r}">${c.name}<br>${c.r}★</div>`;
});
}

if(document.getElementById("analysis")){
let avg=data.total*0.016;
let luck=(data.five/data.total*100)||0;
document.getElementById("analysis").innerHTML=
`Expected Avg: ${avg.toFixed(2)}<br>Your Rate: ${luck.toFixed(2)}%`;
}

if(document.getElementById("achievementList")){
document.getElementById("achievementList").innerHTML=
data.achievements.join("<br>");
}
}

function unlock(id,text){
if(!data.achievements.includes(id)){
data.achievements.push(id);
alert(text);
}
}

function redeem(){
const codes={"WORK100":5,"FOCUS200":10,"TARGET500":20};
let input=document.getElementById("codeInput").value.trim();
if(data.usedCodes.includes(input)){
document.getElementById("shopMsg").innerText="Code already used";return;
}
if(codes[input]){
data.tickets+=codes[input];
data.usedCodes.push(input);
document.getElementById("shopMsg").innerText="Success +"+codes[input];
save();updateUI();
}else{
document.getElementById("shopMsg").innerText="Invalid Code";
}
}

/* Particle Background */
if(document.getElementById("bg")){
let canvas=document.getElementById("bg");
let ctx=canvas.getContext("2d");
canvas.width=innerWidth;canvas.height=innerHeight;
let stars=Array.from({length:120},()=>({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
r:Math.random()*2
}));
function anim(){
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.fillStyle="white";
stars.forEach(s=>{
ctx.beginPath();
ctx.arc(s.x,s.y,s.r,0,2*Math.PI);
ctx.fill();
s.y+=0.6;
if(s.y>canvas.height)s.y=0;
});
requestAnimationFrame(anim);
}
anim();
}

updateUI();
renderAll();

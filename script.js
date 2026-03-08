if(localStorage.getItem("loggedIn")!=="true"){
window.location.href="login.html";
}

let transactions=JSON.parse(localStorage.getItem("data"))||[];

let editId=null;
let chart;

function addTransaction(){

let desc=document.getElementById("desc").value;
let amount=document.getElementById("amount").value;
let type=document.getElementById("type").value;
let date=document.getElementById("date").value;

if(desc===""||amount===""||date===""){
alert("Fill all fields")
return
}

if(editId){

transactions=transactions.map(t=>{
if(t.id===editId){
return{ id:editId,desc,amount:+amount,type,date }
}
return t
})

editId=null

}else{

transactions.push({
id:Date.now(),
desc,
amount:+amount,
type,
date
})

}

save()
display(transactions)
clearForm()

}

function display(data){

let list=document.getElementById("list")
list.innerHTML=""

let income=0
let expense=0

data.forEach(t=>{

let li=document.createElement("li")

li.innerHTML=`
${t.date} | ${t.desc} ₹${t.amount}

<span>
<button onclick="edit(${t.id})">✏️</button>
<button onclick="del(${t.id})">❌</button>
</span>
`

list.appendChild(li)

if(t.type==="income") income+=t.amount
else expense+=t.amount

})

document.getElementById("income").innerText=income
document.getElementById("expense").innerText=expense
document.getElementById("balance").innerText="₹"+(income-expense)

draw(income,expense)

}

function edit(id){

let t=transactions.find(x=>x.id===id)

desc.value=t.desc
amount.value=t.amount
type.value=t.type
date.value=t.date

editId=id

}

function del(id){

transactions=transactions.filter(t=>t.id!==id)

save()
display(transactions)

}

function filterByDate(){

let d=document.getElementById("filterDate").value

let filtered=transactions.filter(t=>t.date===d)

display(filtered)

}

function showAll(){
display(transactions)
}

function save(){
localStorage.setItem("data",JSON.stringify(transactions))
}

function clearForm(){
desc.value=""
amount.value=""
date.value=""
}

function draw(income,expense){

let ctx=document.getElementById("chart")

if(chart) chart.destroy()

chart=new Chart(ctx,{
type:"pie",
data:{
labels:["Income","Expense"],
datasets:[{
data:[income,expense],
backgroundColor:["green","red"]
}]
}
})

}

display(transactions)
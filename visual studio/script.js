// Templates
for(let i=1;i<=20;i++){
    let div=document.createElement("div");
    div.className="template";
    div.innerHTML=`<img src="https://picsum.photos/300/200?random=${i}"><div>Template ${i}</div>`;
    document.getElementById("templateList").appendChild(div);
}

let generatedCode="", siteCount=0, publishCount=0, visitCount=0;

// Drag & Drop
function allowDrop(e){ e.preventDefault(); }
function drag(e){ e.dataTransfer.setData("text", e.target.id); }
function drop(e){
    e.preventDefault();
    let data = e.dataTransfer.getData("text"), html="";
    if(data==="text") html="<p>Example text</p>";
    if(data==="image") html="<img src='https://picsum.photos/400'>";
    if(data==="button") html="<button>Click</button>";
    e.target.innerHTML += html;
}

// Generate & Publish
function generateSite(){
    siteCount++;
    document.getElementById("sitesStat").innerText = siteCount;
    let title=document.getElementById("title").value;
    let tagline=document.getElementById("tagline").value;
    let color=document.getElementById("color").value;
    let font=document.getElementById("font").value;
    let content=document.getElementById("preview").innerHTML;
    generatedCode=`<!DOCTYPE html>
<html><head><title>${title}</title>
<style>body{font-family:${font};margin:0}header{background:${color};color:white;padding:40px;text-align:center}</style>
</head><body><header><h1>${title}</h1><p>${tagline}</p></header><section>${content}</section></body></html>`;
    alert("Website generated!");
}

function publishSite(){
    if(!generatedCode){ alert("Generate site first"); return; }
    publishCount++;
    visitCount += Math.floor(Math.random()*200);
    document.getElementById("publishStat").innerText = publishCount;
    document.getElementById("visitsStat").innerText = visitCount;
    alert("Publishing: In production this would deploy the site and create a subdomain.");
}

// Customers
function addCustomer(){
    let name=document.getElementById("custName").value;
    let type=document.getElementById("custType").value;
    let status=document.getElementById("custStatus").value;
    let row=`<tr><td>${name}</td><td>${type}</td><td>${status}</td></tr>`;
    document.getElementById("customerTable").innerHTML += row;
}

// Login using backend
document.getElementById("loginForm").addEventListener("submit", async (e)=>{
    e.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let res = await fetch('/login', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    });

    let text = await res.text();
    document.getElementById("loginMsg").innerText = text;

    if(text.includes("Logged in successfully")){
        document.getElementById("builder").classList.remove("hidden");
        document.getElementById("dashboard").classList.remove("hidden");

        // Show admin panel only if admin
        let sessionRes = await fetch('/session');
        let sessionData = await sessionRes.json();
        if(sessionData.isAdmin) document.getElementById("admin").classList.remove("hidden");
    }
});

// Logout
async function logout(){
    await fetch('/logout');
    alert("Logged out");
    location.reload();
}
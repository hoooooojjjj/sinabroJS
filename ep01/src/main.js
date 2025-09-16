document.body.innerHTML = "<h1>Hello World</h1>";
const h2 = document.createElement("h2")
const h3 = document.createElement('h3');
h2.innerHTML = "Hello World2"
h3.innerHTML = "Hello World3"
document.body.appendChild(h2)
document.body.prepend(h3)

const addClass = (ele)=> {
    ele.classList.add("title")
    console.log(ele.className)
}

const insertBefore = (newNode, referenceNode)=>{
  document.body.insertBefore(newNode, referenceNode);
  console.log(referenceNode)
}

addClass(h2)

const p = document.createElement('p');
p.innerText = "Hi, I am hojun"
document.body.insertBefore(h2, p);

insertBefore(h2, p)
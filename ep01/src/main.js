document.querySelector("#app").innerHTML =`
<button class="hello1">Hello1</button>
<button class="hello2">Hello2</button>
<button class="hello3">Hello3</button>

<div>
  <input class="input" type="text" placeHolder="input your name" />
</div>

<div class="parentOfButton">
<button class="helloWorldButton" type="button">
  <span>Hello</span>
  <span>World</span>
  <span>!</span>
</button>

</div>
`

document.querySelector("button").addEventListener('click' ,()=>{
  const input = document.querySelector(".input")
  console.log(input.value)
})

document.querySelector(".input").addEventListener("input", (e)=>{
  console.log(e.target.value)
} )

document.querySelector(".helloWorldButton").addEventListener("click", (e)=>{
  e.stopPropagation()
  console.log("event fron button", e.target)
} )

document.querySelector(".parentOfButton").addEventListener("click", (e)=>{
  console.log("event fron div", e.target)
} )
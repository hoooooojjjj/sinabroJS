document.querySelector("#app").innerHTML =`
<button class="hello1">Hello1</button>
<button class="hello2">Hello2</button>
<button class="hello3">Hello3</button>

<div>
  <input class="input" type="text" placeHolder="input your name" />
</div>
`

document.querySelector("button").addEventListener('click' ,()=>{
  const input = document.querySelector(".input")
  console.log(input.value)
})

document.querySelector(".input").addEventListener("input", (e)=>{
  console.log(e.target.value)
} )
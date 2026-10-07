### Q. A responsive navigation bar and hero section. (8 marks)

```html
<header class="navbar">
  <div class="logo">MySite</div>
  <nav class="links">
    <a href="#">Home</a>
    <a href="#">About</a>
  </nav>
</header>
<section class="hero">
  <div class="dropdown">Menu</div>
</section>

CSS:

.navbar {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  position: relative;
  z-index: 10;
}

.hero {
  position: relative;
  z-index: 5;
}

@media (max-width: 600px) {
  .navbar {
    flex-direction: column;
  }
}
```

**(a) [2 marks]** In the `.navbar` class, what does `justify-content: space-between` do?

**Model answer:**

```
It distributes the flex items (the logo and the nav links) along the main axis so that the first item is flush with the start edge and the last item is flush with the end edge, maximizing the space between them.
```

```
1 mark for mentioning it distributes items along the main axis.
1 mark for stating it puts maximum space between the items (logo on the left, links on the right).
```

**(b) [3 marks]** When the page is viewed on a mobile device with a 400px screen width, how does the layout of the `.navbar` change and why?

**Model answer:**

```
The layout changes from a horizontal row to a vertical column.
This happens because the screen width (400px) is less than 600px, so the media query applies, changing `flex-direction` to `column`.
```

```
1 mark for stating the layout becomes vertical/column.
2 marks for explaining that the media query `max-width: 600px` applies and overrides the default flex-direction.
```

**(c) [3 marks]** Why is `z-index` used on both `.navbar` and `.hero`? Which one will appear on top if they overlap?

**Model answer:**

```
`z-index` is used to control the stacking order of positioned elements along the z-axis.
Because both have `position: relative`, they form stacking contexts. The `.navbar` has a higher z-index (10) than the `.hero` (5), so the navbar will appear on top if they overlap.
```

```
1 mark for explaining z-index controls stacking order.
1 mark for noting they are both positioned elements.
1 mark for correctly stating `.navbar` appears on top because 10 > 5.
```

---

### Q. A simple JavaScript counter. (6 marks)

```javascript
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const myCounter = createCounter();
console.log(myCounter());
console.log(myCounter());
```

**(a) [3 marks]** What will be printed to the console when this code runs? Explain why `count` is not reset to 0 on the second call.

**Model answer:**

```
1
2
The variable `count` is not reset because the inner function forms a closure. It retains access to the scope of `createCounter` even after `createCounter` has finished executing, allowing the same `count` variable to be preserved and updated across multiple calls.
```

```
1 mark for the correct output (1 then 2).
2 marks for explaining the concept of a closure and how it preserves the scope/state of `count`.
```

**(b) [3 marks]** How does NodeJS execution of this JavaScript differ from running it directly inside a browser's `<script>` tag? Name two objects available in the browser but NOT in NodeJS.

**Model answer:**

```
NodeJS runs JavaScript on the server/system level using the V8 engine, while the browser runs it within a web page context.
Two objects available in the browser but not in NodeJS are `window` and `document`.
```

```
1 mark for stating NodeJS is a server/system environment while the browser is a web page context.
2 marks for naming two browser-specific objects (e.g., window, document, localStorage).
```

---

### Q. Handling user input and local storage. (6 marks)

```html
<form id="user-form">
  <input type="text" id="username" required>
  <button type="submit">Save</button>
</form>
<p id="greeting"></p>

JS:

const form = document.getElementById('user-form');
const input = document.getElementById('username');
const greeting = document.getElementById('greeting');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = input.value;
  localStorage.setItem('savedName', name);
  greeting.textContent = `Hello, ${name}`;
});
```

**(a) [3 marks]** What is the purpose of `e.preventDefault()` in this code? What would happen if it were removed?

**Model answer:**

```
`e.preventDefault()` stops the browser's default behavior for form submission, which is to send a request and reload the page.
If removed, the page would immediately reload when the button is clicked, preventing the JavaScript from saving the name or updating the greeting (or they would briefly flash before disappearing).
```

```
1 mark for stating it stops the default form submission.
2 marks for explaining that removing it causes a page reload and breaks the intended JS behavior.
```

**(b) [3 marks]** Write the JavaScript code that should run when the page first loads to check if a name is already saved in `localStorage` and display the greeting if it exists.

**Model answer:**

```javascript
const savedName = localStorage.getItem('savedName');
if (savedName) {
  greeting.textContent = `Hello, ${savedName}`;
}
```

```
1 mark for using `localStorage.getItem('savedName')`.
1 mark for checking if the value exists.
1 mark for updating the `textContent` of the greeting element.
```

---

### Q. Fetching data from an API. (8 marks)

```javascript
function getUserData() {
  fetch('https://api.example.com/user')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data.name);
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}
```

**(a) [4 marks]** Rewrite the `getUserData` function using `async/await` syntax instead of `.then()` and `.catch()`.

**Model answer:**

```javascript
async function getUserData() {
  try {
    const response = await fetch('https://api.example.com/user');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data.name);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}
```

```
1 mark for adding `async` to the function definition.
1 mark for using `await fetch(...)`.
1 mark for using `await response.json()`.
1 mark for wrapping the code in a `try...catch` block.
```

**(b) [2 marks]** Why is `response.json()` necessary in the code?

**Model answer:**

```
`response.json()` is necessary to parse the raw JSON text string returned by the server into a usable JavaScript object so we can access properties like `data.name`.
```

```
1 mark for stating it parses JSON.
1 mark for stating it converts it into a JavaScript object.
```

**(c) [2 marks]** `fetch` is an asynchronous operation. Why is it important for network requests to be asynchronous in the browser?

**Model answer:**

```
Network requests take time to complete. If they were synchronous, the browser's main thread would be blocked, freezing the UI and making the page unresponsive until the server replies. Asynchronous requests allow the user to continue interacting with the page while waiting for the data.
```

```
1 mark for mentioning that synchronous requests would block the main thread/freeze the UI.
1 mark for mentioning it allows continued user interaction while waiting.
```

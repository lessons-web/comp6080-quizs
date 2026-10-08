### Q. DOM 操作与交互 (8 marks)

```html
<ul id="task-list">
  <li class="task">Read notes</li>
</ul>
<button id="add-btn">Add Task</button>

<script>
  const btn = document.getElementById('add-btn');
  const list = document.getElementById('task-list');

  btn.addEventListener('click', () => {
    const newItem = document.createElement('li');
    newItem.textContent = 'New Task';
    newItem.className = 'task';
    list.appendChild(newItem);
  });
</script>
```

**(a) [2 marks]** 什么是 DOM？在上述代码中，DOM 扮演了什么角色？

**Model answer:**

```
DOM（文档对象模型，Document Object Model）是浏览器将 HTML 页面解析成树状结构的 API 接口。
在这段代码中，DOM 作为桥梁，让 JavaScript 能够查找现有的 HTML 元素（getElementById），创建新元素（createElement），并将其插入到页面的结构树中（appendChild）。
```

```
1 mark for defining DOM as the tree representation/API of the HTML document.
1 mark for explaining its role in allowing JS to interact with and modify the page.
```

**(b) [2 marks]** 用户连续点击了 3 次 "Add Task" 按钮，页面上的 `<ul>` 列表中总共会有几个 `<li>` 元素？

**Model answer:**

```
总共会有 4 个 <li> 元素。（1个初始存在的，加上 3 次点击新创建的 3个）。
```

```
2 marks for correctly stating 4 elements.
```

**(c) [2 marks]** 开发者想在点击列表项时给其添加一个完成的样式，于是他写了：
```javascript
const tasks = document.querySelectorAll('.task');
tasks.forEach(task => {
  task.addEventListener('click', () => task.classList.add('done'));
});
```
他发现点击 "Read notes" 时正常，但点击新添加的 "New Task" 时却没有任何反应。为什么？

**Model answer:**

```
因为 `querySelectorAll` 只在脚本初始执行时获取了当时页面上已存在的 `.task` 元素（即第一个 <li>），并为它绑定了事件。后续动态创建的新 <li> 元素并没有绑定点击事件。
```

```
1 mark for explaining that querySelectorAll only grabs existing elements.
1 mark for explaining that dynamically added elements miss out on the event listener.
```

**(d) [2 marks]** 承接上一题，为了让所有现有和未来新添加的列表项都能响应点击，通常推荐使用什么技术方案？（只需说出概念或思路）

**Model answer:**

```
事件委托（Event Delegation）。
思路是将点击事件监听器绑定在父元素 `<ul>` 上，利用事件冒泡机制，当点击发生时检查 `event.target` 是否是 `.task` 元素，从而统一处理所有子元素的点击。
```

```
1 mark for mentioning Event Delegation.
1 mark for explaining the concept (binding to parent and checking event.target).
```

---

### Q. 表单验证与默认行为 (6 marks)

```html
<form id="loginForm">
  <input type="text" id="user" name="user">
  <input type="password" id="pass" name="pass">
  <button type="submit">Login</button>
</form>
<div id="error-msg"></div>

<script>
  const form = document.getElementById('loginForm');
  const errorMsg = document.getElementById('error-msg');

  form.addEventListener('submit', function(event) {
    const user = document.getElementById('user').value;
    if (user === '') {
      errorMsg.textContent = 'Username cannot be empty';
      // 代码缺少了一行关键逻辑
    }
  });
</script>
```

**(a) [2 marks]** 当用户留空用户名并点击 Login 时，页面闪过一条错误信息然后立刻刷新了，错误信息也消失了。为什么会这样？

**Model answer:**

```
因为点击 `type="submit"` 的按钮触发了表单的默认提交行为。默认行为会将表单数据发送给服务器并刷新当前页面。虽然 JavaScript 修改了错误信息，但紧接着页面刷新导致修改被重置。
```

```
1 mark for explaining the default form submission behavior.
1 mark for explaining that page reload wipes out the JS DOM changes.
```

**(b) [2 marks]** 为了修复上述问题，阻止页面刷新并保留错误信息，应该在 `if` 块中（或最前面）添加哪一行关键代码？

**Model answer:**

```javascript
event.preventDefault();
```

```
2 marks for correctly writing `event.preventDefault();`.
```

**(c) [2 marks]** 假设不写任何 JavaScript，如何仅通过修改 HTML 代码来实现“用户名不能为空”的验证，并阻止表单提交？

**Model answer:**

```
在 username 的 `<input>` 标签中添加 `required` 属性。
例如：`<input type="text" id="user" name="user" required>`
浏览器原生表单验证会拦截提交并提示用户。
```

```
1 mark for identifying the `required` attribute.
1 mark for explaining that browser's native validation handles it.
```

---

### Q. JavaScript 闭包 (Closure) (6 marks)

```javascript
function makeMultiplier(multiplier) {
  return function(x) {
    return x * multiplier;
  };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

console.log(double(5));
console.log(triple(5));
```

**(a) [2 marks]** 代码运行后，控制台会输出什么？

**Model answer:**

```
10
15
```

```
1 mark for 10.
1 mark for 15.
```

**(b) [2 marks]** 什么是闭包？在上述代码中，闭包体现在哪里？

**Model answer:**

```
闭包是指一个函数能够记住并访问它被创建时所在的词法作用域，即使该外部函数已经执行完毕。
体现在：返回的匿名函数 `function(x)` 记住了外部函数 `makeMultiplier` 的参数 `multiplier` 的值，因此 `double` 函数永远记住了 2，`triple` 永远记住了 3。
```

```
1 mark for defining closure (function remembering its lexical scope).
1 mark for applying it to the code (inner function remembers `multiplier`).
```

**(c) [2 marks]** 在前端开发中，闭包经常被用来解决什么实际问题？请举一个例子。

**Model answer:**

```
常用来解决：
1. 状态私有化/数据封装（隐藏不希望被外部直接修改的变量）。
2. 事件处理函数或回调函数中保存外部变量。
3. 柯里化或工厂函数（如本题的生成器）。
```

```
2 marks for a valid use case in frontend development.
```

### Q. 响应式导航栏与首屏区域。 (8 marks)

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

**(a) [2 marks]** 在 `.navbar` 类中，`justify-content: space-between` 的作用是什么？

**Model answer:**

```
它的作用是沿主轴（水平方向）分布 flex 子元素（logo 和 nav 链接），使得第一个元素紧贴起始边缘，最后一个元素紧贴结束边缘，从而在它们之间留出最大的空白空间。
```

```
1 mark for 提到沿主轴分布/对齐子元素。
1 mark for 提到使得子元素分别靠两边对齐，中间留出最大空间。
```

**(b) [3 marks]** 当在一个屏幕宽度为 400px 的移动设备上查看该页面时，`.navbar` 的布局会发生什么变化？为什么？

**Model answer:**

```
布局会从水平排列的行（row）变为垂直排列的列（column）。
发生这种情况是因为屏幕宽度（400px）小于 600px，因此触发了媒体查询 `@media (max-width: 600px)`，将 `flex-direction` 更改为 `column`。
```

```
1 mark for 说明布局变为垂直/列（column）。
2 marks for 解释因为屏幕小于 600px 触发了媒体查询，覆盖了默认的 flex-direction。
```

**(c) [3 marks]** 为什么 `.navbar` 和 `.hero` 都使用了 `z-index`？如果它们发生重叠，哪一个会显示在最上面？

**Model answer:**

```
`z-index` 用于控制定位元素在 Z 轴上的层叠顺序。
因为两个元素都使用了 `position: relative`，它们都创建了层叠上下文。由于 `.navbar` 的 z-index (10) 高于 `.hero` 的 z-index (5)，因此如果发生重叠，`.navbar` 会显示在最上面。
```

```
1 mark for 解释 z-index 用于控制层叠顺序。
1 mark for 注意到它们都是定位元素（position: relative）。
1 mark for 正确回答 .navbar 会显示在上面（因为 10 > 5）。
```

---

### Q. 简单的 JavaScript 计数器。 (6 marks)

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

**(a) [3 marks]** 当这段代码运行时，控制台会打印出什么？请解释为什么在第二次调用时 `count` 没有被重置为 0。

**Model answer:**

```
1
2
变量 `count` 没有被重置是因为内部函数形成了一个闭包（Closure）。即使 `createCounter` 函数已经执行完毕，返回的内部函数依然保留了对 `createCounter` 作用域的访问权，从而使得同一个 `count` 变量在多次调用间被保存和更新。
```

```
1 mark for 给出正确的输出 (先 1 后 2)。
2 marks for 解释闭包（Closure）的概念以及它如何保存 `count` 的状态/作用域。
```

**(b) [3 marks]** NodeJS 执行这段 JavaScript 与在浏览器的 `<script>` 标签中直接运行有什么不同？请列举出两个存在于浏览器环境中但不属于 NodeJS 环境的对象。

**Model answer:**

```
NodeJS 使用 V8 引擎在服务器/系统层面上运行 JavaScript，而浏览器是在网页的上下文中运行 JavaScript。
两个存在于浏览器但不属于 NodeJS 的对象是 `window` 和 `document`。
```

```
1 mark for 说明 NodeJS 是服务器/系统环境，而浏览器是网页上下文。
2 marks for 列出两个浏览器特有的对象（例如 window, document, localStorage 等）。
```

---

### Q. 处理用户输入与本地存储。 (6 marks)

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

**(a) [3 marks]** 这段代码中 `e.preventDefault()` 的作用是什么？如果把它删掉会发生什么？

**Model answer:**

```
`e.preventDefault()` 用于阻止浏览器默认的表单提交行为（即发送请求并重新加载页面）。
如果将其删除，点击按钮时页面会立即重新加载，这会导致 JavaScript 无法成功保存名称或更新问候语（或者它们只会短暂闪烁然后消失）。
```

```
1 mark for 说明它阻止了表单的默认提交行为。
2 marks for 解释如果删除它会导致页面刷新，从而破坏预期的 JS 逻辑。
```

**(b) [3 marks]** 请编写一段 JavaScript 代码：在页面首次加载时运行，检查 `localStorage` 中是否已经保存了名字，如果存在，则将其显示在问候语段落中。

**Model answer:**

```javascript
const savedName = localStorage.getItem('savedName');
if (savedName) {
  greeting.textContent = `Hello, ${savedName}`;
}
```

```
1 mark for 正确使用 `localStorage.getItem('savedName')`。
1 mark for 使用 if 检查该值是否存在。
1 mark for 正确更新 greeting 元素的 `textContent`。
```

---

### Q. 从 API 获取数据。 (8 marks)

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

**(a) [4 marks]** 请使用 `async/await` 语法重写 `getUserData` 函数，替换掉原来的 `.then()` 和 `.catch()`。

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
1 mark for 在函数定义中添加 `async`。
1 mark for 使用 `await fetch(...)`。
1 mark for 使用 `await response.json()`。
1 mark for 将代码正确地包裹在 `try...catch` 块中。
```

**(b) [2 marks]** 为什么在这段代码中必须要调用 `response.json()`？

**Model answer:**

```
调用 `response.json()` 是必须的，因为它用于将服务器返回的原始 JSON 文本字符串解析为可用的 JavaScript 对象，这样我们才能访问像 `data.name` 这样的属性。
```

```
1 mark for 说明它用于解析 JSON。
1 mark for 说明它将其转换为 JavaScript 对象。
```

**(c) [2 marks]** `fetch` 是一个异步操作。为什么在浏览器中进行网络请求时，必须是异步的？

**Model answer:**

```
网络请求需要时间来完成。如果它们是同步的，浏览器的 JavaScript 主线程将被阻塞，导致用户界面（UI）冻结，直到服务器响应为止。异步请求允许用户在等待数据的同时，继续与页面进行交互。
```

```
1 mark for 提到同步请求会阻塞主线程/冻结 UI。
1 mark for 提到异步允许在等待时继续进行用户交互。
```
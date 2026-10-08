### Q. 异步编程与 Fetch API (8 marks)

```javascript
function loadWeather() {
  let weather = "Loading...";
  
  fetch('https://api.weather.com/today')
    .then(response => response.json())
    .then(data => {
      weather = data.condition;
      console.log("A: ", weather);
    });
    
  console.log("B: ", weather);
}

loadWeather();
```

**(a) [2 marks]** 代码运行时，控制台打印的顺序是先打印 A 还是先打印 B？各自打印出的 `weather` 变量的值是什么？

**Model answer:**

```
先打印 B，后打印 A。
B 打印出的值是 "Loading..."。
A 打印出的值是服务器返回的真实天气状况（例如 "Sunny"）。
```

```
1 mark for correct order (B then A).
1 mark for correct values ("Loading..." then the actual data).
```

**(b) [2 marks]** 解释为什么会出现 (a) 中的打印顺序，即使服务器响应非常快（只需 1 毫秒）。

**Model answer:**

```
因为 `fetch` 是异步非阻塞操作。JavaScript 主线程发起网络请求后不会停下来等待，而是立刻继续执行后面的同步代码（打印 B）。只有当网络请求完成且主线程空闲时，传递给 `.then()` 的回调函数才会被放入微任务队列执行（打印 A）。
```

```
1 mark for explaining `fetch` is asynchronous and non-blocking.
1 mark for explaining that callbacks execute only after the main thread finishes synchronous code.
```

**(c) [4 marks]** 使用 `async/await` 重写上述 `loadWeather` 函数，使得我们可以按照同步代码的阅读习惯，先等待天气数据获取完毕，再按顺序打印出最终的天气结果。

**Model answer:**

```javascript
async function loadWeather() {
  try {
    let weather = "Loading...";
    const response = await fetch('https://api.weather.com/today');
    const data = await response.json();
    weather = data.condition;
    console.log("Result: ", weather);
  } catch (error) {
    console.error(error);
  }
}
```

```
1 mark for adding `async` to the function.
1 mark for using `await fetch(...)`.
1 mark for using `await response.json()`.
1 mark for correct logic that logs the final result after waiting.
```

---

### Q. 前后端通信与 HTTP 基础 (6 marks)

一个前端页面想要显示用户的购物车列表。前端开发人员写了如下代码：
```javascript
fetch('https://shop.example.com/api/cart')
  .then(res => res.json())
  .then(cart => renderCart(cart));
```

**(a) [2 marks]** 在这个场景中，前端与后端的数据交换格式通常是什么？为什么现代 Web 开发普遍选择这种格式而不是 XML？

**Model answer:**

```
通常是 JSON (JavaScript Object Notation) 格式。
因为 JSON 的语法更轻量、易读，且原生兼容 JavaScript，可以通过 `response.json()` 极其方便地转换为 JS 对象，不需要像 XML 那样进行复杂的 DOM 解析。
```

```
1 mark for identifying JSON.
1 mark for explaining its benefits (lightweight, native JS compatibility).
```

**(b) [2 marks]** 如果服务器发生故障崩溃了，它可能会返回哪种范围的 HTTP 状态码？（选择：2xx, 3xx, 4xx, 5xx）。前端的 `.then(res => res.json())` 会报错吗？

**Model answer:**

```
服务器崩溃会返回 5xx 状态码（如 500 Internal Server Error）。
`fetch` 并不会因为 5xx 状态码而自动抛出网络错误抛到 `catch` 中。它仍然会正常执行 `.then()`，前端需要手动检查 `res.ok` 或 `res.status`。如果服务器返回的是一个 HTML 错误页面而不是 JSON，`res.json()` 解析时就会报错抛出异常。
```

```
1 mark for identifying 5xx.
1 mark for explaining that fetch doesn't reject HTTP error status codes, or that res.json() will fail if parsing HTML.
```

**(c) [2 marks]** AJAX 这种技术的出现解决了早期 Web 时代最大的什么痛点？

**Model answer:**

```
解决了“每次请求新数据都必须整页刷新”的痛点。AJAX 允许在后台异步向服务器请求数据，并在不刷新整个页面的情况下，局部更新页面的内容，极大提升了用户体验。
```

```
1 mark for mentioning preventing full page reloads.
1 mark for mentioning updating page content partially/asynchronously.
```

---

### Q. 回调地狱与异步演进 (6 marks)

```javascript
// 早期基于回调的异步风格
getUser(1, function(user) {
  getPosts(user.id, function(posts) {
    getComments(posts[0].id, function(comments) {
      console.log(comments);
    });
  });
});
```

**(a) [2 marks]** 上述代码结构通常被开发者戏称为“回调地狱 (Callback Hell)”。这种写法有什么坏处？

**Model answer:**

```
1. 代码横向嵌套过深，形成“金字塔”形状，严重降低可读性。
2. 难以进行错误处理，每个回调层级都需要单独写错误处理逻辑。
3. 难以管理复杂的并行或串行异步控制流。
```

```
1 mark for readability / deep nesting / pyramid of doom.
1 mark for difficulty in error handling or control flow.
```

**(b) [2 marks]** 为了解决这个问题，ES6 引入了 `Promise`。请将上述代码用假想的返回 Promise 的 `getUserAsync`, `getPostsAsync`, `getCommentsAsync` 函数改写成 `.then()` 链式调用的形式。

**Model answer:**

```javascript
getUserAsync(1)
  .then(user => getPostsAsync(user.id))
  .then(posts => getCommentsAsync(posts[0].id))
  .then(comments => console.log(comments))
  .catch(err => console.error(err));
```

```
1 mark for chaining `.then()` without deep nesting.
1 mark for returning the next promise in the chain.
```

**(c) [2 marks]** 从 `XMLHttpRequest` 到 `Fetch API` 的演进，除了语法更现代外，最重要的底层设计改进是什么？

**Model answer:**

```
最重要的底层改进是 Fetch API 原生基于 Promise 设计。
这使得它可以摆脱 XHR 时代复杂的事件监听和回调函数，直接享受 Promise 链式调用以及后来的 `async/await` 语法带来的红利。
```

```
1 mark for identifying that Fetch is natively built on Promises.
1 mark for explaining how this improves handling (chaining, async/await).
```

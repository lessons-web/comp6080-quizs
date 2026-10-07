### Q. 语义化 HTML 与图像处理。 (6 marks)

```html
<figure>
  <img src="logo.svg" alt="Company Logo">
  <figcaption>Welcome to our site</figcaption>
</figure>
```

**(a) [3 marks]** `img` 标签中的 `alt` 属性有什么作用？请列举两个主要原因。

**Model answer:**

```
`alt` 属性用于提供图像的替代文本。
主要原因：
1. 无障碍访问（Accessibility）：屏幕阅读器会朗读替代文本，帮助视障用户理解图片内容。
2. 容错与 SEO：当图片加载失败时，浏览器会显示替代文本；同时搜索引擎会利用它来理解图像内容。
```

```
1 mark for 解释是替代文本。
1 mark for 提到无障碍访问（屏幕阅读器）。
1 mark for 提到图片加载失败或 SEO。
```

**(b) [3 marks]** 上面的代码使用了 SVG 格式的图片，相比于 PNG 或 JPG，SVG 有什么独特的优势？在什么场景下不适合使用 SVG？

**Model answer:**

```
优势：SVG 是矢量图，放大或缩小都不会失真，且通常文件体积较小，支持通过 CSS/JS 修改样式。
不适合的场景：包含丰富颜色细节和复杂光影的照片（真实世界照片），这种场景更适合使用 JPG 或 WebP。
```

```
1 mark for 矢量图/无限缩放不失真。
1 mark for 支持代码修改或体积小。
1 mark for 指出不适合复杂照片场景。
```

---

### Q. JavaScript 高阶函数与作用域。 (8 marks)

```javascript
const numbers = [1, 2, 3, 4, 5];
const result = numbers
  .filter(n => n % 2 !== 0)
  .map(n => n * 2);

console.log(result);
```

**(a) [4 marks]** 上述代码运行后，控制台会输出什么？请解释 `filter` 和 `map` 在这段代码中的执行过程。

**Model answer:**

```
输出: [2, 6, 10]
执行过程：
1. `filter` 遍历数组，保留所有不能被 2 整除的数字（奇数），得到中间数组 `[1, 3, 5]`。
2. `map` 遍历上一步得到的奇数数组，将每个数字乘以 2，最终得到 `[2, 6, 10]`。
```

```
2 marks for 正确输出 [2, 6, 10]。
1 mark for 解释 filter 筛选出了奇数。
1 mark for 解释 map 将筛选出的数字翻倍。
```

**(b) [4 marks]** 在前端工程化中，`package.json` 文件的主要作用是什么？请列举至少两个它包含的关键信息。

**Model answer:**

```
`package.json` 是 Node.js/NPM 项目的配置文件，用于管理项目的依赖和元数据。
它包含的关键信息有：
1. 项目的依赖列表（dependencies 和 devDependencies）及其版本号。
2. 项目的运行脚本（scripts，如 npm run dev/build）。
（其他合理答案如项目名称、版本、作者等也可得分）
```

```
2 marks for 解释它是项目配置文件/管理依赖。
1 mark for 提到包含依赖列表。
1 mark for 提到包含 npm 运行脚本或元数据。
```

---

### Q. 浏览器 DOM 操控与事件机制。 (8 marks)

```html
<ul id="todo-list">
  <li>Learn HTML</li>
</ul>
<button id="add-btn">Add Task</button>

JS:
const btn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

btn.addEventListener('click', () => {
  // TODO: 添加新的 <li>Learn JS</li> 到列表中
});
```

**(a) [4 marks]** 请补全注释 `TODO` 处的 JavaScript 代码，实现点击按钮时，动态创建并向列表中添加一个内容为 "Learn JS" 的 `<li>` 元素。

**Model answer:**

```javascript
const newItem = document.createElement('li');
newItem.textContent = 'Learn JS';
list.appendChild(newItem);
```

```
1 mark for 使用 document.createElement('li')。
1 mark for 正确设置文本内容（textContent 或 innerText）。
2 marks for 使用 list.appendChild() 将其插入到页面中。
```

**(b) [4 marks]** 假设我们在 `ul` 元素上也绑定了一个点击事件监听器。当用户点击新添加的 `li` 元素时，`ul` 上的点击事件也会被触发，这种现象称为什么？如何在 `li` 的点击事件中阻止这种行为？

**Model answer:**

```
这种现象称为事件冒泡（Event Bubbling），即事件从最深的嵌套元素向外层祖先元素传播。
要阻止这种行为，可以在 `li` 的事件处理函数中调用事件对象的 `stopPropagation()` 方法。
```

```
2 marks for 正确说出“事件冒泡 (Event Bubbling)”。
2 marks for 提到使用 `event.stopPropagation()` 阻止冒泡。
```

---

### Q. 异步请求与 API 通信。 (6 marks)

```javascript
function fetchWeather() {
  fetch('https://api.weather.com/today')
    .then(res => res.json())
    .then(data => {
      console.log(`Today's temp: ${data.temp}`);
    })
    .catch(err => {
      console.error('Failed to load weather', err);
    });
}
```

**(a) [3 marks]** 什么是 Promise？在上面的 `fetch` 请求中，Promise 可能会处于哪三种状态？

**Model answer:**

```
Promise 是 JavaScript 中用于表示异步操作最终完成（或失败）及其结果值的对象。
它有三种状态：
1. Pending（进行中）：初始状态，既没有被兑现，也没有被拒绝。
2. Fulfilled（已兑现）：意味着操作成功完成。
3. Rejected（已拒绝）：意味着操作失败。
```

```
1 mark for 提到 Pending 状态。
1 mark for 提到 Fulfilled (或 Resolved/成功) 状态。
1 mark for 提到 Rejected (或失败) 状态。
```

**(b) [3 marks]** 为什么现代前端开发倾向于使用 `fetch` API，而不是早期的 `XMLHttpRequest` (XHR)？

**Model answer:**

```
1. `fetch` 基于 Promise，天然支持 `.then()` 或 `async/await`，使异步代码的逻辑更清晰，避免了 XHR 中复杂的回调地狱（Callback Hell）。
2. `fetch` 的 API 设计更现代、更简洁，使用起来比 XHR 繁琐的配置和事件监听（如 onreadystatechange）更容易。
```

```
1.5 marks for 提到基于 Promise 或 async/await 支持更好。
1.5 marks for 提到语法更简洁或避免了回调地狱。
```
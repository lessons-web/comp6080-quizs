### Q. 移动端优先与响应式设计 (6 marks)

```html
<head>
  <style>
    .gallery {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 10px;
    }

    @media (max-width: 768px) {
      .gallery {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 480px) {
      .gallery {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="gallery">
    <img src="pic1.jpg" alt="Pic 1">
    <img src="pic2.jpg" alt="Pic 2">
    <img src="pic3.jpg" alt="Pic 3">
    <img src="pic4.jpg" alt="Pic 4">
  </div>
</body>
```

**(a) [2 marks]** 在屏幕宽度为 900px 的桌面显示器上，图片会显示为几列？在屏幕宽度为 390px 的手机上，图片会显示为几列？

**Model answer:**

```
900px 时显示为 4 列。
390px 时显示为 1 列。
```

```
1 mark for 4 columns at 900px.
1 mark for 1 column at 390px.
```

**(b) [2 marks]** 如果在 `<head>` 中忘记添加 `<meta name="viewport" content="width=device-width, initial-scale=1">` 标签，在真实手机上查看时，图片大概率会显示为几列？为什么？

**Model answer:**

```
大概率会显示为 4 列。
因为如果没有 viewport 标签，手机浏览器会默认使用一个较宽的视口（通常是 980px 左右）来渲染页面，然后将其缩小以适应屏幕。由于渲染视口宽于 768px，媒体查询不会生效。
```

```
1 mark for stating it would likely show 4 columns.
1 mark for explaining that without viewport, mobile browsers simulate a desktop width (e.g., 980px).
```

**(c) [2 marks]** 上述代码采用了“桌面端优先 (Desktop-First)”还是“移动端优先 (Mobile-First)”的开发思路？如何判断？

**Model answer:**

```
采用了“桌面端优先 (Desktop-First)”思路。
因为默认的基础样式（4列）是为桌面端编写的，然后通过 `max-width` 的媒体查询，逐渐在较小屏幕上覆盖样式（降级为 2 列、1 列）。如果是移动端优先，基础样式应为 1 列，并使用 `min-width` 来增加列数。
```

```
1 mark for identifying Desktop-First.
1 mark for explaining that default styles are for large screens and `max-width` is used to override for smaller screens.
```

---

### Q. JavaScript 基础语法与函数 (8 marks)

```javascript
const numbers = [10, 20, 30];

function processNumbers(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}

const result = processNumbers(numbers);
console.log(result);
```

**(a) [2 marks]** 代码运行后，控制台会输出什么？`total` 变量的作用域是什么？

**Model answer:**

```
控制台会输出 60。
`total` 的作用域是函数级作用域（或块级作用域），它只能在 `processNumbers` 函数内部被访问，外部无法直接读取。
```

```
1 mark for outputting 60.
1 mark for explaining function/block scope for `total`.
```

**(b) [2 marks]** 请使用 JavaScript 数组的高阶函数 `reduce` 重写 `processNumbers` 函数的核心逻辑，使其更简洁。

**Model answer:**

```javascript
function processNumbers(arr) {
  return arr.reduce((total, num) => total + num, 0);
}
```

```
1 mark for correctly using `.reduce()`.
1 mark for correct accumulator logic and initial value.
```

**(c) [2 marks]** 在 `const numbers = [10, 20, 30];` 中使用了 `const` 声明，那么执行 `numbers.push(40);` 会报错吗？执行 `numbers = [1, 2, 3];` 会报错吗？为什么？

**Model answer:**

```
`numbers.push(40);` 不会报错。
`numbers = [1, 2, 3];` 会报错。
因为 `const` 保证的是变量指向的内存地址不可变。对于数组这种引用类型，修改其内部元素（push）没有改变内存地址，而重新赋值（=）试图改变指针地址，这违反了 const 的规则。
```

```
1 mark for stating push works but reassignment fails.
1 mark for explaining that `const` protects the reference/pointer, not the contents of an object/array.
```

**(d) [2 marks]** 什么是高阶函数 (Higher-Order Function)？请给出一个常见的前端开发场景。

**Model answer:**

```
高阶函数是指接收函数作为参数，或者返回一个函数作为结果的函数。
常见场景：数组操作如 map、filter，或者事件监听如 addEventListener 接收一个回调函数作为参数。
```

```
1 mark for definition (takes a function as argument or returns one).
1 mark for a valid frontend example (map/filter/addEventListener/setTimeout).
```

---

### Q. NPM 与生态系统 (6 marks)

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

**(a) [2 marks]** 上述代码属于哪个文件？这个文件在前端工程化项目中的核心作用是什么？

**Model answer:**

```
属于 `package.json` 文件。
它的核心作用是管理项目的元信息、依赖包（dependencies）版本，以及定义项目中常用的脚本命令（scripts）。
```

```
1 mark for identifying `package.json`.
1 mark for describing its role in managing dependencies and scripts.
```

**(b) [2 marks]** 解释 `dependencies` 和 `devDependencies` 之间的区别。

**Model answer:**

```
`dependencies` 是项目在生产环境（运行阶段）必需的包（如 React、Express）。
`devDependencies` 是仅在开发和构建阶段需要的工具包（如打包工具、测试框架、nodemon），它们不会被包含在最终的生产环境运行代码中。
```

```
1 mark for explaining `dependencies` (production/runtime).
1 mark for explaining `devDependencies` (development/build tools).
```

**(c) [2 marks]** 开发者想要运行 `dev` 脚本启动本地开发服务器，应该在终端输入什么命令？如果另一个开发者克隆了这个项目代码，他在运行脚本之前必须先执行什么命令？

**Model answer:**

```
运行 dev 脚本命令：`npm run dev`
克隆代码后必须先执行：`npm install`（或 `npm i`），以便根据 package.json 下载并安装 `node_modules` 文件夹中的所有依赖。
```

```
1 mark for `npm run dev`.
1 mark for `npm install`.
```

### Q. HTML 语义化与页面结构 (8 marks)

```html
<div class="top-nav">
  <div class="site-logo">Course App</div>
  <div class="menu">
    <a href="/home">Home</a>
    <a href="/about">About</a>
  </div>
</div>
<div class="main-content">
  <div class="post">
    <div class="post-title">Learning HTML</div>
    <div class="post-body">HTML is the foundation of the web.</div>
  </div>
</div>
```

**(a) [3 marks]** 上述代码大量使用了 `<div>` 标签，这种做法被称为“div 汤 (div soup)”。请使用 HTML5 语义化标签对上述代码进行重构，使结构更具专业性和可读性。

**Model answer:**

```html
<header class="top-nav">
  <div class="site-logo">Course App</div>
  <nav class="menu">
    <a href="/home">Home</a>
    <a href="/about">About</a>
  </nav>
</header>
<main class="main-content">
  <article class="post">
    <h1 class="post-title">Learning HTML</h1>
    <p class="post-body">HTML is the foundation of the web.</p>
  </article>
</main>
```

```
1 mark for using <header> or <nav> appropriately.
1 mark for using <main> for the main content area.
1 mark for using <article>, <h1>, or <p> instead of generic divs.
```

**(b) [3 marks]** 解释为什么使用语义化标签（如 `<header>`, `<nav>`, `<article>`）比单纯使用 `<div>` 更好。请给出至少两个原因。

**Model answer:**

```
1. 提升可访问性 (Accessibility/A11Y)：屏幕阅读器可以更准确地识别页面结构，帮助视障用户导航（例如跳过导航栏直接阅读主内容）。
2. 有利于 SEO（搜索引擎优化）：搜索引擎爬虫能更好地理解页面的重点内容和层级关系，提升搜索排名。
3. 提高代码可读性和可维护性：开发者能一眼看懂各个区域的功能，不需要完全依赖 class 命名来猜测结构。
```

```
1 mark for mentioning Accessibility (A11Y) / Screen readers.
1 mark for mentioning SEO.
1 mark for mentioning developer readability / maintainability.
```

**(c) [2 marks]** 在包含页面正文和元信息时，应该将上述代码放在 HTML 文档的 `<head>` 还是 `<body>` 标签中？为什么？

**Model answer:**

```
必须放在 `<body>` 标签中。
因为 `<body>` 包含的是用户在浏览器窗口中直接可见的所有页面主体内容。而 `<head>` 主要用于放置页面的元信息，如 `<title>`、`<meta>` 和引用的 CSS 样式表，这些不会直接显示为页面正文。
```

```
1 mark for stating it should go in `<body>`.
1 mark for explaining the difference between `<head>` (metadata) and `<body>` (visible content).
```

---

### Q. CSS 盒模型与尺寸计算 (6 marks)

```html
<div class="box">Content</div>

CSS:
.box {
  width: 200px;
  height: 100px;
  padding: 20px;
  border: 5px solid black;
  margin: 10px;
}
```

**(a) [2 marks]** 在默认的 CSS 盒模型下，这个 `.box` 元素在页面上实际占据的总宽度（包括边框）是多少像素？请写出计算过程。

**Model answer:**

```
实际占据的总宽度为 250px。
计算过程：
width (200px) + padding-left (20px) + padding-right (20px) + border-left (5px) + border-right (5px) = 250px。
(注意：margin 不计入元素本身的可见宽度)
```

```
1 mark for correctly stating 250px.
1 mark for showing the correct calculation (200 + 20*2 + 5*2).
```

**(b) [2 marks]** 如果在 `.box` 的 CSS 中添加一行 `box-sizing: border-box;`，这个元素实际占据的总宽度会变成多少像素？此时内容区域（Content box）的宽度变成了多少？

**Model answer:**

```
总宽度会变成 200px。
此时内容区域的宽度会变成 150px。
计算过程：200px (总宽) - 40px (左右 padding) - 10px (左右 border) = 150px。
```

```
1 mark for stating total width becomes 200px.
1 mark for stating content width becomes 150px.
```

**(c) [2 marks]** 开发者想要让这个 `.box` 在其父容器中水平居中，可以在 CSS 中添加什么属性？

**Model answer:**

```
添加 `margin: 0 auto;`（或 `margin-left: auto; margin-right: auto;`）。
```

```
2 marks for correctly identifying `margin: 0 auto;` or `margin: auto;` for horizontal centering of a block element.
```

---

### Q. Flexbox 布局基础 (6 marks)

```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>

CSS:
.container {
  display: flex;
  height: 200px;
  border: 1px solid gray;
}
.item {
  width: 50px;
  background: lightblue;
}
```

**(a) [2 marks]** 默认情况下，这三个 `.item` 是水平排列还是垂直排列？为什么？

**Model answer:**

```
水平排列。
因为 `display: flex` 默认的 `flex-direction` 属性值是 `row`（行），所以子元素会沿着水平主轴从左到右排列。
```

```
1 mark for stating horizontal (row) layout.
1 mark for explaining that the default flex-direction is `row`.
```

**(b) [2 marks]** 开发者想要让这三个项目在容器内水平居中对齐（项目之间紧挨着），并且垂直方向也居中对齐。应该在 `.container` 的 CSS 中添加哪两行代码？

**Model answer:**

```css
justify-content: center;
align-items: center;
```

```
1 mark for `justify-content: center;` (horizontal/main axis).
1 mark for `align-items: center;` (vertical/cross axis).
```

**(c) [2 marks]** 如果开发者在 `.container` 中设置了 `flex-direction: column;`，那么控制垂直方向分布的属性是 `justify-content` 还是 `align-items`？

**Model answer:**

```
是 `justify-content`。
因为当设置 `flex-direction: column` 时，主轴变成了垂直方向，而 `justify-content` 永远用于控制主轴方向的对齐和分布。
```

```
1 mark for identifying `justify-content`.
1 mark for explaining that the main axis is now vertical.
```

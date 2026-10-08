
### Q. The four rules below all set the colour of the same button. (8 marks)

```
<button class="important" id="confirm">Delete Account</button>

CSS:

button {
    color: blue;
}

.important {
    color: red;
}

#confirm {
    color: green;
}

button.important {
    color: orange;
}
```

**(a) [3 marks]** What colour is the button text, and how does the browser choose between the four rules? Explain what it compares and why source order does not decide the result here.

**Model answer:**

```
The button text is GREEN.
ID always takes precedent over classes and type selectors.
The order does not matter unless it's two tied things (e.g. .important and button.important)
```

```
1 mark for identifying the text as green.
1 mark for explaining about precedent
1 mark for highlighting order only matters with a tie
```

**(b) [1 marks]** The student cannot change the id rule, so they add !important to the first rule. What colour is the text now?

**Model answer:**

```
The button text becomes BLUE.
```

```
1 mark for identifying the text as blue.
```

**(c) [2 marks]** Why does routinely using !important cause problems? Describe what a developer should usually do when a rule is not taking effect.

**Model answer:**

```
It ends the conversation. Once a declaration is important, the only ways to override
it are another !important or an inline style, so the next person with a legitimate
reason to change that colour has to escalate too. Stylesheets that use it accumulate
!important on top of !important until specificity no longer means anything and the
cascade cannot be reasoned about at all.

If a rule is not taking effect, the developer should inspect the element in the
browser dev tools, check which rule is winning in the cascade, and then fix the
normal CSS by changing the selector, specificity, or source order instead of
adding !important as a shortcut.
```
```
1 mark for explaining one real problem caused by routinely using `!important`.
1 mark for describing what to do instead, including diagnosing with dev tools or
fixing the selector rather than just "try harder".
```

---

### Q. A badge is positioned over a photo. (6 marks)

```
<div class="phone">
  <div class="hero">
    <img class="photo" src="assets/beach.jpg" alt="Bondi Beach at sunrise">
    <div class="badge">NEW</div>
  </div>
</div>

CSS:

.phone {
  width: 400px;
  margin: 0 auto;
}

.hero {
  position: relative;
  height: 300px;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 80px;
  height: 40px;
}
```

**(a) [2 marks]** The badge is positioned 20px from the hero's right edge. How many pixels from the hero's left edge is the badge's left edge? Show where the hero's width comes from and why it is needed for the calculation.

**Model answer:**

```
300px.

right: 20px pins the badge's RIGHT edge 20px in from the hero's right edge, and
the badge is 80px wide, so its left edge sits at:

  400 - 20 - 80 = 300px
```

```
1 mark for calculating the badge's left edge as 300px.
1 mark for explaining it.
```

**(b) [2 marks]** The developer removes position relative from the hero. Where does the badge move, and what are top and right now measured against?

**Model answer:**

```
The badge ends up in the top right corner of the page — 20px from the top and
20px from the right of the window — rather than in the corner of the hero. Absolute will
attach to the nearest previous relative.
```

```
1 mark for stating where the badge moves: the top right of the page or viewport.
1 mark for explaining that the offsets are measured from the nearest positioned
ancestor, or from the initial containing block when there is none.
```

---

### Q. Determine the size and spacing of the two blocks below. Each element has its natural height unless a height is specified, and the page is wider than 600px. (6 marks)

```
<body>
  <div class="card">
    <h2>Sydney</h2>
    <p>Population 5.3 million.</p>
  </div>
  <div class="note">Data collected in 2021.</div>
</body>

CSS:

body {
  margin: 0;
}

.card {
  width: 400px;
  padding: 0 20px;
  border: 2px solid #333333;
  margin-bottom: 40px;
}

.card h2 {
  margin: 24px 0;
}

.note {
  margin-top: 25px;
}
```

**(a) [2 marks]** Calculate the card's total width in pixels, showing your working. Then state its total width if box-sizing were set to border-box.

**Model answer:**

```
444px.

width: 400px sets the CONTENT box, because box-sizing defaults to content-box.
The padding and the border are then added outside it:

  400 (content) + 20 + 20 (padding) + 2 + 2 (border) = 444px
```

```
1 mark for calculating 444px
1 mark for working shown.
```

---

### Q. A website remembers whether the user chose dark mode. (6 marks)

```
<button id="dark">Dark mode</button>

JS:

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
}

document.getElementById('dark').addEventListener('click', () => {
  document.body.classList.add('dark');
  localStorage.setItem('theme', 'dark');
});
```

**(a) [2 marks]** A user visits the site for the first time. What does `localStorage.getItem('theme')` return, and is the page shown in dark mode?

**Model answer:**

```
It returns null, because nothing has been saved under 'theme' yet.
The if condition is false, so the page is NOT in dark mode.
```

```
1 mark for stating getItem returns null.
1 mark for stating the page is not in dark mode.
```

**(b) [2 marks]** The user clicks the button, closes the browser, and comes back the next day. Is the page in dark mode? Explain why.

**Model answer:**

```
Yes, the page is in dark mode.
setItem saved 'dark' in localStorage, which stays in the browser even after it
is closed. When the page loads, getItem returns 'dark' and the class is added.
```

```
1 mark for stating the page is in dark mode.
1 mark for explaining that localStorage keeps data after the browser is closed.
```

**(c) [2 marks]** The developer deletes the `localStorage.setItem` line. What happens now when the user clicks the button and then reloads the page?

**Model answer:**

```
Clicking still turns the page dark, but after reloading it goes back to light.
Without setItem the choice is never saved, so getItem returns null on reload.
```

```
1 mark for stating the page goes back to light mode after reloading.
1 mark for explaining that the choice is no longer saved to localStorage.
```

---

### Q. A button shows a message when it is clicked. (6 marks)

```
<button id="greet">Say hello</button>
<p id="message"></p>

JS:

const button = document.getElementById('greet');
const message = document.getElementById('message');

function showMessage() {
  message.textContent = 'Hello!';
}

button.addEventListener('click', showMessage);
```

**(a) [2 marks]** What does the user see when the page first loads, and what happens when they click the button?

**Model answer:**

```
When the page loads the paragraph is empty, so no message is shown.
When the button is clicked, showMessage runs and "Hello!" appears in the paragraph.
```

```
1 mark for stating no message is shown on load.
1 mark for stating "Hello!" appears when the button is clicked.
```

**(b) [2 marks]** The developer changes the last line to `button.addEventListener('click', showMessage());`. What happens now, and why?

**Model answer:**

```
"Hello!" appears straight away when the page loads, without any click.
The brackets call showMessage immediately instead of passing the function to
addEventListener, so it is not run when the button is clicked.
```

```
1 mark for stating the message appears immediately on page load.
1 mark for explaining that the brackets call the function straight away.
```

**(c) [2 marks]** The developer changes `'click'` to `'mouseover'`. When does the message appear now?

**Model answer:**

```
The message appears when the user moves their mouse over the button, without
needing to click it. The event name decides which user action runs the function.
```

```
1 mark for stating the message appears when the mouse moves over the button.
1 mark for explaining that the event name controls when the function runs.
```

---

### Q. A sign-up form shows a welcome message. (6 marks)

```
<form id="signup">
  <input id="name" type="text">
  <button type="submit">Sign up</button>
</form>
<p id="output"></p>

JS:

const form = document.getElementById('signup');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value;
  document.getElementById('output').textContent = 'Welcome, ' + name;
});
```

**(a) [2 marks]** The user types `Sam` into the box and clicks Sign up. What is shown on the page? Explain where the name comes from.

**Model answer:**

```
"Welcome, Sam" is shown in the paragraph.
.value reads the text the user typed into the input box.
```

```
1 mark for stating "Welcome, Sam".
1 mark for explaining that .value gives the text typed into the input.
```

**(b) [2 marks]** The developer deletes the `event.preventDefault();` line. What happens now when the form is submitted?

**Model answer:**

```
The browser submits the form the normal way and reloads the page, so the
welcome message disappears straight away (or is never seen).
preventDefault is what stops the browser's default submit behaviour.
```

```
1 mark for stating the page reloads and the message disappears.
1 mark for explaining that preventDefault stops the default form submission.
```

**(c) [2 marks]** The developer wants to stop the form from being submitted when the name box is empty, without writing any JavaScript. What should they add to the HTML, and what happens if the user then clicks Sign up with the box empty?

**Model answer:**

```
Add the required attribute to the input:

  <input id="name" type="text" required>

The browser then stops the form from submitting and shows a message asking the
user to fill in the field, so no welcome message is shown.
```

```
1 mark for adding the required attribute to the input.
1 mark for stating the browser blocks the submission and shows a warning.
```

---

### Q. A page changes its layout on small screens. (6 marks)

```
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1 class="title">My Blog</h1>
  <nav class="menu">Home | Posts | About</nav>
</body>

CSS:

.title {
  font-size: 32px;
}

.menu {
  display: block;
}

@media (max-width: 600px) {
  .title {
    font-size: 20px;
  }

  .menu {
    display: none;
  }
}
```

**(a) [2 marks]** The page is viewed on a laptop with a screen 1000px wide. What size is the title, and is the menu shown? Explain why.

**Model answer:**

```
The title is 32px and the menu is shown.
The screen is wider than 600px, so the rules inside the media query do not apply.
```

```
1 mark for stating 32px and the menu is shown.
1 mark for explaining the media query does not apply above 600px.
```

**(b) [2 marks]** The page is viewed on a phone with a screen 400px wide. What size is the title, and is the menu shown? Explain why.

**Model answer:**

```
The title is 20px and the menu is hidden.
The screen is 600px or narrower, so the rules inside the media query apply and
override the earlier rules.
```

```
1 mark for stating 20px and the menu is hidden.
1 mark for explaining the media query applies at 600px or below.
```

**(c) [2 marks]** What is the purpose of the `<meta name="viewport">` tag in the head?

**Model answer:**

```
It tells the phone to use its real screen width for the page instead of
pretending to be a wide desktop screen and zooming out. Without it, the phone
may not match max-width: 600px, so the mobile styles would not apply.
```

```
1 mark for explaining it makes the page use the device's real width.
1 mark for explaining that without it the mobile styles may not apply.
```

---

### Q. A simple web page about a trip. (4 marks)

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My Trip</title>
  </head>
  <body>
    <h1>Trip to Sydney</h1>
    <img src="opera.jpg">
    <ul>
      <li>Opera House</li>
      <li>Harbour Bridge</li>
    </ul>
  </body>
</html>
```

**(a) [2 marks]** Where does the text "My Trip" appear, and where does "Trip to Sydney" appear?

**Model answer:**

```
"My Trip" appears in the browser tab, because it is inside <title> in the head.
"Trip to Sydney" appears on the page itself as the main heading, because it is
inside <h1> in the body.
```

```
1 mark for stating "My Trip" appears in the browser tab.
1 mark for stating "Trip to Sydney" appears on the page as a heading.
```

**(b) [2 marks]** The developer wants the list to be numbered 1, 2 instead of using bullet points. What should they change?

**Model answer:**

```
Change <ul> to <ol> (and </ul> to </ol>).
ul is an unordered list shown with bullets; ol is an ordered list shown with numbers.
```

```
1 mark for changing ul to ol.
1 mark for explaining the difference between unordered and ordered lists.
```

---

### Q. A student uses browser dev tools to work out why their page is broken. (4 marks)

**(a) [2 marks]** The student selects a heading in the Elements panel. In the Styles pane, their rule `color: red` is shown with a line through it. What does the line mean, and how can they find out which rule is actually setting the colour?

**Model answer:**

```
The line means the declaration matched the element but was overridden by
another rule, for example one with higher specificity or one that comes later.
They can look for the rule higher up in the Styles pane that is not crossed out,
or open the Computed tab to see the final colour and which rule it came from.
```

```
1 mark for explaining that the rule was overridden by another rule.
1 mark for describing how to find the winning rule (Styles pane or Computed tab).
```

**(c) [2 marks]** The student fixes the colour by editing it directly in the Styles pane, and the page looks right. When they reload the page, the fix is gone. Why, and what should they do?

**Model answer:**

```
Changes made in dev tools only affect the copy of the page currently open in
the browser. They are not saved to the student's CSS file, so reloading loads
the original file again. They need to make the same change in their CSS file
and save it.
```

```
1 mark for explaining dev tools edits are not saved to the source files.
1 mark for stating the change must be copied into the actual CSS file.
```

---

### Q. A developer chooses image formats for a website. (7 marks)

The site needs three images:

- a large photo of a beach at sunset
- the company logo, with a transparent background, which must stay sharp at any size
- a small animated loading icon

**(a) [3 marks]** Choose the most suitable format for each image from JPG, PNG, GIF and SVG. Give a reason for each choice.

**Model answer:**

```
Beach photo: JPG. It uses lossy compression, which keeps photos with lots of
colours and detail at a small file size.

Logo: SVG. It is a vector format, so it stays sharp at any size, and it supports
transparency.

Loading icon: GIF. It supports simple animation.
```

```
1 mark for each correct format with a valid reason.
Accept PNG for the logo only if transparency is mentioned (but it will not
scale sharply). Accept SVG or WebP for the loading icon if animation is mentioned.
```

**(b) [2 marks]** The developer saves the beach photo as a PNG instead, and the file is about five times bigger. It also looks no better. Explain why.

**Model answer:**

```
PNG is lossless, so it keeps every pixel exactly. A photo has lots of fine
detail and colour changes, which lossless compression cannot shrink well.
JPG throws away detail the eye barely notices, so it is much smaller while
looking almost the same.
```

```
1 mark for explaining PNG is lossless and keeps all the detail.
1 mark for explaining JPG discards detail people do not notice, making it smaller.
```

**(c) [2 marks]** Someone saves the logo as a JPG instead. On the site's dark blue header it now has a white box around it, and it looks blurry when shown larger. Explain both problems.

**Model answer:**

```
White box: JPG does not support transparency, so the transparent background
is filled in with a solid colour (white).

Blurry: JPG is a raster format made of a fixed number of pixels. Showing it
larger stretches those pixels, so it looks blurry or blocky. An SVG is
drawn from shapes, so it can be redrawn sharply at any size.
```

```
1 mark for explaining JPG has no transparency.
1 mark for explaining raster images blur when scaled up, unlike vector images.
```

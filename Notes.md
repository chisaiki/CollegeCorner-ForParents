React is built around the idea that everything is a component.

Components are reusable, self-contained pieces of UI
They can manage their own state and logic.

## Common options for React projects:
- `jsx` - for React components with JSX
- `javascript` or `js` - for plain JavaScript
- `typescript` or `ts` - for TypeScript
- `css` - for CSS code
- `json` - for JSON files


## Errors

My page wasn't loading because I forget to export all the component pages, and actually fill them with data.

I was already including them in main.jsx, but since they had nothing and didn't export the pages, it was throwing an error.

Link paths in Layout.jsx must match Route paths in main.jsx - React Router connects navigation to components by matching these paths exactly.<br>

How React Router Connects URLs to Components

```jsx
1. Route Definition (in main.jsx)
<Route path="/faq" element={<FAQ />} />

2. Link Navigation (in Layout.jsx)
<Link to="/faq">FAQ</Link>
```
This tells React Router: "When clicked, navigate to /faq"

Navigation buttons weren't displaying side-by-side because I had 3 separate `<nav>` elements instead of 1 nav with 3 links inside.

```jsx
// Wrong - 3 separate nav containers
<nav><Link to="/">Home</Link></nav>
<nav><Link to="/resources">Resources</Link></nav>
<nav><Link to="/faq">FAQ</Link></nav>

// Correct - 1 nav container with 3 links
<nav>
    <Link to="/">Home</Link>
    <Link to="/resources">Resources</Link>
    <Link to="/faq">FAQ</Link>
</nav>
```
CSS flexbox (`display: flex`) only works when multiple items are children of the same flex container.
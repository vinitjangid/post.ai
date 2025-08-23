/**
 * JavaScript and React Multiple Choice Questions
 * This file contains 100 MCQs that can be posted to LinkedIn
 */

const mcqQuestions = [
  {
    id: 1,
    question: "What is the output of `console.log(typeof null)`?",
    options: [
      "null",
      "undefined",
      "object",
      "string"
    ],
    correctAnswer: "object",
    explanation: "In JavaScript, typeof null returns 'object', which is considered a bug in the language.",
    category: "javascript",
    difficulty: "easy"
  },
  {
    id: 2,
    question: "Which method is used to add elements to the end of an array in JavaScript?",
    options: [
      "push()",
      "append()",
      "add()",
      "insert()"
    ],
    correctAnswer: "push()",
    explanation: "The push() method adds one or more elements to the end of an array and returns the new length of the array.",
    category: "javascript",
    difficulty: "easy"
  },
  {
    id: 3,
    question: "What is the correct way to create a React functional component?",
    options: [
      "function Component() { return <div>Hello</div>; }",
      "class Component { render() { return <div>Hello</div>; } }",
      "const Component = () => { <div>Hello</div> }",
      "const Component = function() { return <div>Hello</div> }"
    ],
    correctAnswer: "function Component() { return <div>Hello</div>; }",
    explanation: "A functional component is a JavaScript function that returns JSX. Both function declarations and arrow functions with explicit returns are valid.",
    category: "react",
    difficulty: "easy"
  },
  {
    id: 4,
    question: "What is the output of `console.log(1 + '2' + '2')`?",
    options: [
      "122",
      "32",
      "14",
      "1 + '2' + '2'"
    ],
    correctAnswer: "122",
    explanation: "The + operator first converts 1 to a string due to the presence of a string '2', then concatenates all the strings.",
    category: "javascript",
    difficulty: "easy"
  },
  {
    id: 5,
    question: "In React, which hook is used to perform side effects?",
    options: [
      "useEffect",
      "useState",
      "useContext",
      "useReducer"
    ],
    correctAnswer: "useEffect",
    explanation: "useEffect hook allows you to perform side effects in function components, similar to componentDidMount and componentDidUpdate in class components.",
    category: "react",
    difficulty: "easy"
  },
  {
    id: 6,
    question: "What is the output of `console.log(0.1 + 0.2 === 0.3)`?",
    options: [
      "true",
      "false",
      "undefined",
      "Error"
    ],
    correctAnswer: "false",
    explanation: "Due to floating-point precision in JavaScript, 0.1 + 0.2 is actually 0.30000000000000004, not exactly 0.3.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 7,
    question: "Which React hook is used for handling component state?",
    options: [
      "useState",
      "useEffect",
      "useContext",
      "useReducer"
    ],
    correctAnswer: "useState",
    explanation: "useState hook is used to add state to functional components in React.",
    category: "react",
    difficulty: "easy"
  },
  {
    id: 8,
    question: "What does the `bind()` method do in JavaScript?",
    options: [
      "Creates a new function with a specified 'this' value",
      "Connects two functions together",
      "Creates a copy of an object",
      "Binds events to DOM elements"
    ],
    correctAnswer: "Creates a new function with a specified 'this' value",
    explanation: "The bind() method creates a new function where the 'this' keyword refers to the provided value.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 9,
    question: "In React, what is the purpose of the 'key' prop when rendering lists?",
    options: [
      "To help React identify which items have changed, been added, or removed",
      "To specify CSS styles for list items",
      "To define the order of list items",
      "To bind event handlers to list items"
    ],
    correctAnswer: "To help React identify which items have changed, been added, or removed",
    explanation: "Keys help React identify which items have changed, been added, or removed, making the rendering process more efficient.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 10,
    question: "What is the output of `console.log(2 + true)`?",
    options: [
      "3",
      "2true",
      "true2",
      "Error"
    ],
    correctAnswer: "3",
    explanation: "When a number is added to a boolean, the boolean is converted to a number (true becomes 1, false becomes 0).",
    category: "javascript",
    difficulty: "easy"
  },
  {
    id: 11,
    question: "What is the correct lifecycle method to make API calls in React class components?",
    options: [
      "componentDidMount",
      "componentWillMount",
      "componentDidUpdate",
      "render"
    ],
    correctAnswer: "componentDidMount",
    explanation: "componentDidMount is called after the component is mounted and is the recommended place to make API calls.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 12,
    question: "What is the result of `typeof undefined`?",
    options: [
      "undefined",
      "'undefined'",
      "null",
      "object"
    ],
    correctAnswer: "'undefined'",
    explanation: "typeof undefined returns the string 'undefined'.",
    category: "javascript",
    difficulty: "easy"
  },
  {
    id: 13,
    question: "What is a React Portal used for?",
    options: [
      "Rendering children into a DOM node that exists outside the DOM hierarchy of the parent component",
      "Creating routes in React applications",
      "Optimizing React applications",
      "Creating animations in React"
    ],
    correctAnswer: "Rendering children into a DOM node that exists outside the DOM hierarchy of the parent component",
    explanation: "Portals provide a way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.",
    category: "react",
    difficulty: "hard"
  },
  {
    id: 14,
    question: "What is the output of `console.log([] == 0)`?",
    options: [
      "true",
      "false",
      "undefined",
      "Error"
    ],
    correctAnswer: "true",
    explanation: "When comparing with ==, an empty array is converted to a string, then to a number, resulting in 0.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 15,
    question: "In React, what is the purpose of the useRef hook?",
    options: [
      "To create a mutable reference that persists across renders",
      "To handle side effects in function components",
      "To optimize rendering performance",
      "To store component state"
    ],
    correctAnswer: "To create a mutable reference that persists across renders",
    explanation: "useRef returns a mutable ref object whose .current property is initialized to the passed argument and persists across re-renders.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 16,
    question: "What is hoisting in JavaScript?",
    options: [
      "Moving declarations to the top of their scope",
      "Moving code from one file to another",
      "Converting code to a higher-level language",
      "Optimizing function calls"
    ],
    correctAnswer: "Moving declarations to the top of their scope",
    explanation: "Hoisting is JavaScript's default behavior of moving declarations to the top of their scope before code execution.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 17,
    question: "Which method is used to pass data from parent to child components in React?",
    options: [
      "Props",
      "State",
      "Context",
      "Redux"
    ],
    correctAnswer: "Props",
    explanation: "Props (short for properties) are used to pass data from parent to child components in React.",
    category: "react",
    difficulty: "easy"
  },
  {
    id: 18,
    question: "What is the output of `console.log('5' - 3)`?",
    options: [
      "2",
      "'5' - 3",
      "53",
      "8"
    ],
    correctAnswer: "2",
    explanation: "When the - operator is used, JavaScript converts the string '5' to a number and performs the subtraction.",
    category: "javascript",
    difficulty: "easy"
  },
  {
    id: 19,
    question: "What is the main benefit of using Redux with React?",
    options: [
      "Centralized state management",
      "Faster rendering",
      "Better SEO",
      "Simpler syntax"
    ],
    correctAnswer: "Centralized state management",
    explanation: "Redux provides a centralized store for all the state in your application, making it easier to debug and test.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 20,
    question: "What is the purpose of the 'use strict' directive in JavaScript?",
    options: [
      "To enable strict mode, which catches common coding mistakes",
      "To make the code execute faster",
      "To enable new JavaScript features",
      "To enable backwards compatibility"
    ],
    correctAnswer: "To enable strict mode, which catches common coding mistakes",
    explanation: "Strict mode catches common coding mistakes and 'unsafe' actions like assigning to undeclared variables.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 21,
    question: "What is a controlled component in React?",
    options: [
      "A component where form data is handled by React state",
      "A component that controls other components",
      "A component with higher-order functions",
      "A component that doesn't re-render"
    ],
    correctAnswer: "A component where form data is handled by React state",
    explanation: "In a controlled component, form data is handled by React state, making React the 'single source of truth'.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 22,
    question: "What is the output of `console.log(typeof NaN)`?",
    options: [
      "number",
      "NaN",
      "undefined",
      "object"
    ],
    correctAnswer: "number",
    explanation: "In JavaScript, NaN (Not-a-Number) is technically a number value, so typeof NaN returns 'number'.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 23,
    question: "Which React lifecycle method is invoked right before a component is unmounted?",
    options: [
      "componentWillUnmount",
      "componentDidUnmount",
      "beforeUnmount",
      "onUnmount"
    ],
    correctAnswer: "componentWillUnmount",
    explanation: "componentWillUnmount is called right before a component is removed from the DOM and is useful for cleanup operations.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 24,
    question: "What is event bubbling in JavaScript?",
    options: [
      "When an event triggered on an element propagates up through its ancestors",
      "When an event is delayed until the browser is idle",
      "When multiple events happen simultaneously",
      "When events are queued in the event loop"
    ],
    correctAnswer: "When an event triggered on an element propagates up through its ancestors",
    explanation: "Event bubbling is when an event starts at the target element and bubbles up to its ancestors in the DOM tree.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 25,
    question: "What is React's virtual DOM?",
    options: [
      "A lightweight copy of the real DOM used for performance optimization",
      "A special DOM that only exists in React applications",
      "A DOM that allows for virtual reality integration",
      "A testing environment for React components"
    ],
    correctAnswer: "A lightweight copy of the real DOM used for performance optimization",
    explanation: "The virtual DOM is a programming concept where a virtual representation of the UI is kept in memory and synced with the real DOM by a library such as ReactDOM.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 26,
    question: "What is the result of `console.log('10' + 20)`?",
    options: [
      "1020",
      "30",
      "10 + 20",
      "Error"
    ],
    correctAnswer: "1020",
    explanation: "When the + operator is used with a string and a number, it converts the number to a string and concatenates them.",
    category: "javascript",
    difficulty: "easy"
  },
  {
    id: 27,
    question: "How do you prevent the default behavior of an event in React?",
    options: [
      "e.preventDefault()",
      "e.stopPropagation()",
      "return false",
      "e.preventDefaults()"
    ],
    correctAnswer: "e.preventDefault()",
    explanation: "e.preventDefault() prevents the default behavior of an event, such as following a link or submitting a form.",
    category: "react",
    difficulty: "easy"
  },
  {
    id: 28,
    question: "What is closure in JavaScript?",
    options: [
      "A function that has access to variables from its outer scope even after the outer function has finished execution",
      "A way to close and terminate functions",
      "A method to encapsulate private variables",
      "A way to lock down objects to prevent modifications"
    ],
    correctAnswer: "A function that has access to variables from its outer scope even after the outer function has finished execution",
    explanation: "A closure is a function that has access to its own scope, the outer function's variables, and global variables, even after the outer function has returned.",
    category: "javascript",
    difficulty: "hard"
  },
  {
    id: 29,
    question: "What does the useCallback hook do in React?",
    options: [
      "Returns a memoized callback function that only changes if one of its dependencies has changed",
      "Creates a new callback function each time the component renders",
      "Automatically optimizes all callback functions in a component",
      "Allows using callbacks outside of React components"
    ],
    correctAnswer: "Returns a memoized callback function that only changes if one of its dependencies has changed",
    explanation: "useCallback returns a memoized version of the callback that only changes if one of the dependencies has changed, which is useful for optimizing performance.",
    category: "react",
    difficulty: "hard"
  },
  {
    id: 30,
    question: "What is the output of `console.log(0 === '0')`?",
    options: [
      "false",
      "true",
      "undefined",
      "Error"
    ],
    correctAnswer: "false",
    explanation: "The === operator checks both value and type equality, and since 0 is a number and '0' is a string, they are not strictly equal.",
    category: "javascript",
    difficulty: "easy"
  },
  {
    id: 31,
    question: "In React, what is the purpose of the useContext hook?",
    options: [
      "To consume context in a functional component",
      "To manage component state",
      "To handle side effects",
      "To optimize rendering"
    ],
    correctAnswer: "To consume context in a functional component",
    explanation: "useContext allows you to consume a context value in a functional component without using a Context.Consumer component.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 32,
    question: "What is the difference between let and var in JavaScript?",
    options: [
      "let has block scope, var has function scope",
      "var has block scope, let has function scope",
      "let is hoisted, var is not",
      "var can be reassigned, let cannot"
    ],
    correctAnswer: "let has block scope, var has function scope",
    explanation: "let is block-scoped, meaning it exists only within the current block. var is function-scoped, available throughout the function it is declared in.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 33,
    question: "What happens when you render an array directly in JSX?",
    options: [
      "React renders each item in the array",
      "React throws an error",
      "Only the first item is rendered",
      "The array is converted to a string"
    ],
    correctAnswer: "React renders each item in the array",
    explanation: "React can render arrays directly in JSX, but each element should have a unique 'key' prop for optimal performance.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 34,
    question: "What is a Promise in JavaScript?",
    options: [
      "An object representing a value that may not be available yet",
      "A guarantee that a function will return a value",
      "A way to ensure code executes in a specific order",
      "A method to improve performance"
    ],
    correctAnswer: "An object representing a value that may not be available yet",
    explanation: "A Promise is an object representing the eventual completion or failure of an asynchronous operation and its resulting value.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 35,
    question: "What is the purpose of React.memo?",
    options: [
      "To memoize a component to prevent unnecessary re-renders",
      "To remember user input in form components",
      "To cache API responses in React applications",
      "To store data persistently in the browser"
    ],
    correctAnswer: "To memoize a component to prevent unnecessary re-renders",
    explanation: "React.memo is a higher-order component that memoizes a component, preventing it from re-rendering unless its props change.",
    category: "react",
    difficulty: "hard"
  },
  {
    id: 36,
    question: "What is the result of `console.log(typeof [])`?",
    options: [
      "object",
      "array",
      "undefined",
      "list"
    ],
    correctAnswer: "object",
    explanation: "In JavaScript, arrays are a type of object, so typeof [] returns 'object'.",
    category: "javascript",
    difficulty: "easy"
  },
  {
    id: 37,
    question: "In React, how can you conditionally render content?",
    options: [
      "Using && or ternary operators in JSX",
      "Using if statements directly in JSX",
      "Using switch statements in JSX",
      "Using try/catch blocks"
    ],
    correctAnswer: "Using && or ternary operators in JSX",
    explanation: "Conditional rendering in React can be done using logical operators like && or ternary operators directly in JSX.",
    category: "react",
    difficulty: "easy"
  },
  {
    id: 38,
    question: "What is the output of `console.log(typeof console.log)`?",
    options: [
      "function",
      "object",
      "undefined",
      "method"
    ],
    correctAnswer: "function",
    explanation: "console.log is a function, so typeof console.log returns 'function'.",
    category: "javascript",
    difficulty: "easy"
  },
  {
    id: 39,
    question: "What is React's StrictMode used for?",
    options: [
      "To highlight potential problems in an application",
      "To enforce type checking in React components",
      "To improve performance by eliminating unnecessary renders",
      "To ensure CSS rules are applied correctly"
    ],
    correctAnswer: "To highlight potential problems in an application",
    explanation: "StrictMode is a tool that highlights potential problems in an application, such as deprecated lifecycle methods or unsafe practices.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 40,
    question: "What is the output of `console.log(3 > 2 > 1)`?",
    options: [
      "false",
      "true",
      "undefined",
      "Error"
    ],
    correctAnswer: "false",
    explanation: "The expression is evaluated left to right: (3 > 2) > 1, which becomes true > 1. Since true is converted to 1, the result is 1 > 1, which is false.",
    category: "javascript",
    difficulty: "hard"
  },
  {
    id: 41,
    question: "What does the useReducer hook do in React?",
    options: [
      "Provides an alternative to useState for complex state logic",
      "Reduces the bundle size of React applications",
      "Optimizes state updates in class components",
      "Reduces the number of components in an application"
    ],
    correctAnswer: "Provides an alternative to useState for complex state logic",
    explanation: "useReducer is a hook that is usually preferable to useState when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one.",
    category: "react",
    difficulty: "hard"
  },
  {
    id: 42,
    question: "What is the 'this' keyword referring to in a JavaScript arrow function?",
    options: [
      "The enclosing lexical context",
      "The window object",
      "The function itself",
      "The object the function is called on"
    ],
    correctAnswer: "The enclosing lexical context",
    explanation: "Arrow functions don't have their own 'this' binding; instead, 'this' is inherited from the enclosing lexical context.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 43,
    question: "What is the purpose of the 'key' attribute in React lists?",
    options: [
      "To help React identify which items have changed, been added, or removed",
      "To specify the order of list items",
      "To provide a unique identifier for CSS styling",
      "To bind event handlers to list items"
    ],
    correctAnswer: "To help React identify which items have changed, been added, or removed",
    explanation: "Keys help React identify which items have changed, been added, or removed, which helps make the reconciliation process more efficient.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 44,
    question: "What is the output of `console.log(1 + +'2' + +'3')`?",
    options: [
      "6",
      "123",
      "1+'2'+'3'",
      "Error"
    ],
    correctAnswer: "6",
    explanation: "The unary + operator converts '2' and '3' to numbers, so the expression becomes 1 + 2 + 3, which equals 6.",
    category: "javascript",
    difficulty: "hard"
  },
  {
    id: 45,
    question: "What is the purpose of React's Error Boundaries?",
    options: [
      "To catch JavaScript errors in child components",
      "To validate form input in React applications",
      "To prevent network errors in API calls",
      "To handle routing errors in React Router"
    ],
    correctAnswer: "To catch JavaScript errors in child components",
    explanation: "Error Boundaries are React components that catch JavaScript errors in their child component tree, log those errors, and display a fallback UI.",
    category: "react",
    difficulty: "hard"
  },
  {
    id: 46,
    question: "What is the result of `console.log(Boolean(''))`?",
    options: [
      "false",
      "true",
      "undefined",
      "Error"
    ],
    correctAnswer: "false",
    explanation: "Empty strings are falsy values in JavaScript, so Boolean('') returns false.",
    category: "javascript",
    difficulty: "easy"
  },
  {
    id: 47,
    question: "What does the useMemo hook do in React?",
    options: [
      "Memoizes a computed value to optimize performance",
      "Memorizes user actions for analytics",
      "Creates a memoized version of a component",
      "Stores values in local storage"
    ],
    correctAnswer: "Memoizes a computed value to optimize performance",
    explanation: "useMemo returns a memoized value that only recomputes when one of its dependencies changes, which helps to optimize performance.",
    category: "react",
    difficulty: "hard"
  },
  {
    id: 48,
    question: "What is the purpose of the 'map' method in JavaScript?",
    options: [
      "Creates a new array with the results of calling a function on every element",
      "Modifies each element in the original array",
      "Searches for elements that match certain criteria",
      "Removes elements from an array"
    ],
    correctAnswer: "Creates a new array with the results of calling a function on every element",
    explanation: "The map method creates a new array with the results of calling a provided function on every element in the calling array, without modifying the original array.",
    category: "javascript",
    difficulty: "easy"
  },
  {
    id: 49,
    question: "What is the React Fragment used for?",
    options: [
      "To group multiple elements without adding extra nodes to the DOM",
      "To fragment large components into smaller ones",
      "To split code into multiple files",
      "To create partial renders for performance"
    ],
    correctAnswer: "To group multiple elements without adding extra nodes to the DOM",
    explanation: "React Fragment lets you group a list of children without adding extra nodes to the DOM, as a component can't return multiple elements otherwise.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 50,
    question: "What is the output of `console.log(0 || 'Hello')`?",
    options: [
      "Hello",
      "0",
      "true",
      "false"
    ],
    correctAnswer: "Hello",
    explanation: "The || operator returns the first truthy value. Since 0 is falsy, it returns 'Hello'.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 51,
    question: "In React, what is prop drilling?",
    options: [
      "Passing props through multiple nested components",
      "Directly modifying props in child components",
      "Using props to create dynamic styles",
      "A technique for optimizing prop updates"
    ],
    correctAnswer: "Passing props through multiple nested components",
    explanation: "Prop drilling refers to the process of passing props through multiple nested components that don't need the data but only pass it down to deeper components.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 52,
    question: "What is the result of `console.log(10 == '10')`?",
    options: [
      "true",
      "false",
      "undefined",
      "Error"
    ],
    correctAnswer: "true",
    explanation: "The == operator performs type coercion, so it converts '10' to a number before comparison.",
    category: "javascript",
    difficulty: "easy"
  },
  {
    id: 53,
    question: "What is the purpose of React's useLayoutEffect hook?",
    options: [
      "To perform DOM measurements before the browser repaints the screen",
      "To improve the layout of components",
      "To manage CSS styles in React",
      "To create responsive layouts in React"
    ],
    correctAnswer: "To perform DOM measurements before the browser repaints the screen",
    explanation: "useLayoutEffect is similar to useEffect, but it fires synchronously after all DOM mutations, allowing you to read layout from the DOM and synchronously re-render before the browser repaints.",
    category: "react",
    difficulty: "hard"
  },
  {
    id: 54,
    question: "What is a callback function in JavaScript?",
    options: [
      "A function passed as an argument to another function to be executed later",
      "A function that calls itself",
      "A function that returns another function",
      "A function that handles errors"
    ],
    correctAnswer: "A function passed as an argument to another function to be executed later",
    explanation: "A callback function is a function passed into another function as an argument, which is then invoked inside the outer function to complete some kind of action.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 55,
    question: "What does the React.lazy() function do?",
    options: [
      "Enables code splitting by lazy loading components",
      "Makes components render more efficiently",
      "Delays component rendering until needed",
      "Reduces the frequency of component re-renders"
    ],
    correctAnswer: "Enables code splitting by lazy loading components",
    explanation: "React.lazy() allows you to render a dynamic import as a regular component, enabling code splitting by loading components only when they are needed.",
    category: "react",
    difficulty: "hard"
  },
  {
    id: 56,
    question: "What is the output of `console.log([1, 2, 3] + [4, 5, 6])`?",
    options: [
      "1,2,34,5,6",
      "[1, 2, 3, 4, 5, 6]",
      "[1, 2, 3]+[4, 5, 6]",
      "Error"
    ],
    correctAnswer: "1,2,34,5,6",
    explanation: "When arrays are added with the + operator, they are first converted to strings, so [1,2,3] becomes '1,2,3' and [4,5,6] becomes '4,5,6', resulting in '1,2,34,5,6'.",
    category: "javascript",
    difficulty: "hard"
  },
  {
    id: 57,
    question: "What are controlled components in React forms?",
    options: [
      "Components where form data is controlled by React state",
      "Components that control user input validation",
      "Components that limit user interaction",
      "Components that control other components"
    ],
    correctAnswer: "Components where form data is controlled by React state",
    explanation: "Controlled components are those where form data is handled by React state, making React the 'single source of truth' for input values.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 58,
    question: "What is the result of `console.log('5' + + '3')`?",
    options: [
      "53",
      "8",
      "5 + 3",
      "Error"
    ],
    correctAnswer: "53",
    explanation: "The unary + operator converts '3' to a number, but the result is still concatenated as a string, so '5' + 3 results in '53'.",
    category: "javascript",
    difficulty: "hard"
  },
  {
    id: 59,
    question: "What is the purpose of the useImperativeHandle hook in React?",
    options: [
      "To customize the instance value exposed when using ref with forwardRef",
      "To handle imperative actions like focus or animation",
      "To directly modify DOM elements",
      "To manage imperative code in React components"
    ],
    correctAnswer: "To customize the instance value exposed when using ref with forwardRef",
    explanation: "useImperativeHandle customizes the instance value that is exposed when a parent component uses ref with forwardRef to reference a child component.",
    category: "react",
    difficulty: "hard"
  },
  {
    id: 60,
    question: "What is the output of `console.log(typeof typeof 42)`?",
    options: [
      "string",
      "number",
      "typeof 42",
      "undefined"
    ],
    correctAnswer: "string",
    explanation: "typeof 42 returns 'number', and typeof 'number' returns 'string'.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 61,
    question: "What is the purpose of React's Suspense component?",
    options: [
      "To show fallback content while components are loading",
      "To suspend rendering when errors occur",
      "To pause execution of React components",
      "To improve performance by batching updates"
    ],
    correctAnswer: "To show fallback content while components are loading",
    explanation: "Suspense lets your components 'wait' for something before rendering, such as data from an API or a code split component, and displays fallback content during that time.",
    category: "react",
    difficulty: "hard"
  },
  {
    id: 62,
    question: "What is a pure function in JavaScript?",
    options: [
      "A function that always returns the same result given the same arguments and has no side effects",
      "A function that only uses ES6 syntax",
      "A function that doesn't use any global variables",
      "A function written in pure JavaScript without any libraries"
    ],
    correctAnswer: "A function that always returns the same result given the same arguments and has no side effects",
    explanation: "A pure function always produces the same output for the same input and has no side effects like modifying external variables or performing I/O operations.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 63,
    question: "What is the main difference between props and state in React?",
    options: [
      "Props are passed to the component, state is managed within the component",
      "Props are mutable, state is immutable",
      "Props are for functional components, state is for class components",
      "Props are for data, state is for functions"
    ],
    correctAnswer: "Props are passed to the component, state is managed within the component",
    explanation: "Props (short for properties) are passed to a component from its parent, while state is managed internally within the component and can be changed over time.",
    category: "react",
    difficulty: "easy"
  },
  {
    id: 64,
    question: "What is event delegation in JavaScript?",
    options: [
      "A pattern where a single event listener handles events for multiple elements",
      "Assigning event handling to a separate function",
      "Using the addEventListener method to bind events",
      "Delaying event execution until the event loop is clear"
    ],
    correctAnswer: "A pattern where a single event listener handles events for multiple elements",
    explanation: "Event delegation is a technique where you add an event listener to a parent element instead of adding event listeners to multiple child elements.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 65,
    question: "What is the purpose of React's Context API?",
    options: [
      "To share data between components without passing props manually through each level",
      "To provide context-sensitive help in the IDE",
      "To create global variables for React applications",
      "To connect React applications to external APIs"
    ],
    correctAnswer: "To share data between components without passing props manually through each level",
    explanation: "Context provides a way to pass data through the component tree without having to pass props down manually at every level.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 66,
    question: "What is the result of `console.log([] === [])`?",
    options: [
      "false",
      "true",
      "undefined",
      "Error"
    ],
    correctAnswer: "false",
    explanation: "Arrays are objects in JavaScript, and when comparing objects with ===, it checks if they reference the same object in memory, not if they have the same content.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 67,
    question: "In React, what is the correct way to update state based on the previous state?",
    options: [
      "Using a function in the state setter: setState(prevState => prevState + 1)",
      "Directly modifying the state: state = state + 1",
      "Using a callback: setState(state + 1, callback)",
      "Using refs: ref.current = state + 1"
    ],
    correctAnswer: "Using a function in the state setter: setState(prevState => prevState + 1)",
    explanation: "When updating state based on the previous state, you should use the functional form of setState to ensure you're working with the most current state value.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 68,
    question: "What is the output of `console.log('hello'.toUpperCase())`?",
    options: [
      "HELLO",
      "Hello",
      "hello",
      "Error"
    ],
    correctAnswer: "HELLO",
    explanation: "The toUpperCase() method returns a new string with all characters converted to uppercase.",
    category: "javascript",
    difficulty: "easy"
  },
  {
    id: 69,
    question: "What is the purpose of the shouldComponentUpdate lifecycle method in React?",
    options: [
      "To control whether the component should re-render",
      "To update the component's state",
      "To determine if a component should be mounted",
      "To handle errors during rendering"
    ],
    correctAnswer: "To control whether the component should re-render",
    explanation: "shouldComponentUpdate allows you to determine whether a component's output is affected by changes in props or state, potentially improving performance by skipping unnecessary re-renders.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 70,
    question: "What is the output of `console.log(2 ** 3)`?",
    options: [
      "8",
      "6",
      "9",
      "Error"
    ],
    correctAnswer: "8",
    explanation: "The ** operator is the exponentiation operator in JavaScript, so 2 ** 3 equals 2³, which is 8.",
    category: "javascript",
    difficulty: "easy"
  },
  {
    id: 71,
    question: "What is the purpose of React's dangerouslySetInnerHTML prop?",
    options: [
      "To render raw HTML content",
      "To indicate potentially unsafe component props",
      "To bypass React's security checks",
      "To mark components as potentially containing bugs"
    ],
    correctAnswer: "To render raw HTML content",
    explanation: "dangerouslySetInnerHTML is React's replacement for innerHTML in browsers, used to render raw HTML content. The name is intentionally scary to remind developers to be cautious about XSS attacks.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 72,
    question: "What is the result of `console.log(typeof null === typeof {})`?",
    options: [
      "true",
      "false",
      "undefined",
      "Error"
    ],
    correctAnswer: "true",
    explanation: "typeof null and typeof {} both return 'object', so the comparison evaluates to true.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 73,
    question: "What is the correct way to pass a method to a child component in React?",
    options: [
      "<Child onClick={this.handleClick} />",
      "<Child onClick=\"this.handleClick\" />",
      "<Child onClick={handleClick()} />",
      "<Child onClick=handleClick />",
    ],
    correctAnswer: "<Child onClick={this.handleClick} />",
    explanation: "Methods should be passed as references using curly braces, not invoked directly in the JSX or passed as strings.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 74,
    question: "What is the difference between null and undefined in JavaScript?",
    options: [
      "null is an assignment value representing no value, undefined is a variable that has been declared but not assigned a value",
      "undefined is an assignment value, null is a type",
      "null is a primitive type, undefined is an object",
      "They are exactly the same and can be used interchangeably"
    ],
    correctAnswer: "null is an assignment value representing no value, undefined is a variable that has been declared but not assigned a value",
    explanation: "null is an explicit assignment value representing no value or no object, while undefined is a variable that has been declared but hasn't been assigned a value yet.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 75,
    question: "What is a Higher-Order Component (HOC) in React?",
    options: [
      "A function that takes a component and returns a new component",
      "A component with more complex UI elements",
      "A component that renders at the top of the page",
      "A component with high priority rendering"
    ],
    correctAnswer: "A function that takes a component and returns a new component",
    explanation: "A Higher-Order Component is a function that takes a component and returns a new enhanced component with additional props or behavior.",
    category: "react",
    difficulty: "hard"
  },
  {
    id: 76,
    question: "What is the output of `console.log([...'hello'])`?",
    options: [
      "['h', 'e', 'l', 'l', 'o']",
      "['hello']",
      "'hello'",
      "Error"
    ],
    correctAnswer: "['h', 'e', 'l', 'l', 'o']",
    explanation: "The spread operator (...) can be used to spread a string into an array of its characters.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 77,
    question: "What is the purpose of React's useEffect cleanup function?",
    options: [
      "To clean up side effects before the component is removed or before the effect runs again",
      "To clear the component's state",
      "To remove event listeners automatically",
      "To optimize rendering performance"
    ],
    correctAnswer: "To clean up side effects before the component is removed or before the effect runs again",
    explanation: "The cleanup function returned from useEffect runs before the component is removed from the UI or before the effect runs again, allowing you to clean up subscriptions, timers, or other side effects.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 78,
    question: "What is the prototype chain in JavaScript?",
    options: [
      "A series of links between objects that enables inheritance",
      "A list of all prototype methods in JavaScript",
      "A way to chain multiple function calls together",
      "A design pattern for structuring JavaScript applications"
    ],
    correctAnswer: "A series of links between objects that enables inheritance",
    explanation: "The prototype chain is the mechanism by which JavaScript objects inherit features from one another, creating a chain of prototype objects.",
    category: "javascript",
    difficulty: "hard"
  },
  {
    id: 79,
    question: "What is the purpose of the React.cloneElement method?",
    options: [
      "To clone and return a new React element with new props",
      "To duplicate DOM elements",
      "To create deep copies of React components",
      "To create identical instances of class components"
    ],
    correctAnswer: "To clone and return a new React element with new props",
    explanation: "React.cloneElement is used to clone an element and optionally modify its props, key, or ref.",
    category: "react",
    difficulty: "hard"
  },
  {
    id: 80,
    question: "What is the output of `console.log('b' + 'a' + + 'a' + 'a')`?",
    options: [
      "baNaNa",
      "baaaa",
      "ba+a+a",
      "Error"
    ],
    correctAnswer: "baNaNa",
    explanation: "The expression evaluates as: 'b' + 'a' + (+ 'a') + 'a'. The unary + tries to convert 'a' to a number, resulting in NaN. So it becomes 'b' + 'a' + NaN + 'a', which is 'baNaNa'.",
    category: "javascript",
    difficulty: "hard"
  },
  {
    id: 81,
    question: "What is the purpose of React's useDebugValue hook?",
    options: [
      "To display a label for custom hooks in React DevTools",
      "To debug component rendering issues",
      "To log debug information to the console",
      "To highlight performance issues in React"
    ],
    correctAnswer: "To display a label for custom hooks in React DevTools",
    explanation: "useDebugValue is used to display a label for custom hooks in React DevTools, making it easier to inspect and debug custom hooks.",
    category: "react",
    difficulty: "hard"
  },
  {
    id: 82,
    question: "What is a JavaScript generator function?",
    options: [
      "A function that can pause execution and later resume at the same point",
      "A function that generates random values",
      "A function that creates new functions",
      "A function that automatically generates documentation"
    ],
    correctAnswer: "A function that can pause execution and later resume at the same point",
    explanation: "Generator functions use the function* syntax and yield keyword to pause and resume execution, allowing for iterative algorithms.",
    category: "javascript",
    difficulty: "hard"
  },
  {
    id: 83,
    question: "What is the purpose of the 'key' prop in React lists?",
    options: [
      "To help React identify which items have changed, been added, or removed",
      "To give elements a unique CSS selector",
      "To define the order of elements in a list",
      "To provide accessibility labels for screen readers"
    ],
    correctAnswer: "To help React identify which items have changed, been added, or removed",
    explanation: "Keys help React identify which items in a list have changed, been added, or removed, which helps with efficient updates and preserves component state.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 84,
    question: "What is the result of `console.log(typeof NaN === typeof 1)`?",
    options: [
      "true",
      "false",
      "undefined",
      "Error"
    ],
    correctAnswer: "true",
    explanation: "Both NaN and 1 are of type 'number' in JavaScript, so the comparison returns true.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 85,
    question: "What problem does React's 'key' prop solve?",
    options: [
      "It helps React efficiently update lists by identifying which items have changed",
      "It provides accessibility for screen readers",
      "It enhances SEO for React applications",
      "It improves CSS styling for list items"
    ],
    correctAnswer: "It helps React efficiently update lists by identifying which items have changed",
    explanation: "Without keys, React has to re-render the entire list when it changes, but with keys, it can identify exactly which items changed and only update those.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 86,
    question: "What is the output of `console.log('10' - '4')`?",
    options: [
      "6",
      "104",
      "'10-4'",
      "Error"
    ],
    correctAnswer: "6",
    explanation: "When the - operator is used, JavaScript converts strings to numbers and performs the subtraction.",
    category: "javascript",
    difficulty: "easy"
  },
  {
    id: 87,
    question: "What is React's 'Strict Mode'?",
    options: [
      "A development mode that identifies potential problems in an application",
      "A mode that enforces strict typing like TypeScript",
      "A production mode that optimizes performance",
      "A mode that enforces consistent coding style"
    ],
    correctAnswer: "A development mode that identifies potential problems in an application",
    explanation: "Strict Mode is a tool for highlighting potential problems in an application, such as deprecated lifecycle methods or unsafe practices.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 88,
    question: "What is the result of `console.log(Boolean(0))`?",
    options: [
      "false",
      "true",
      "0",
      "undefined"
    ],
    correctAnswer: "false",
    explanation: "0 is a falsy value in JavaScript, so Boolean(0) returns false.",
    category: "javascript",
    difficulty: "easy"
  },
  {
    id: 89,
    question: "What is the difference between a class component and a functional component in React?",
    options: [
      "Class components can have state and lifecycle methods, while functional components traditionally could not (before hooks)",
      "Functional components are faster but less powerful",
      "Class components are deprecated in React",
      "Functional components cannot render JSX"
    ],
    correctAnswer: "Class components can have state and lifecycle methods, while functional components traditionally could not (before hooks)",
    explanation: "Traditionally, class components could use state and lifecycle methods, while functional components were simpler. With the introduction of hooks, functional components can now also use state and lifecycle features.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 90,
    question: "What does the 'super(props)' do in a React class component constructor?",
    options: [
      "Calls the constructor of the parent class and passes props to it",
      "Makes the component more powerful",
      "Enables the use of this.props in the constructor",
      "Initializes the component's state"
    ],
    correctAnswer: "Calls the constructor of the parent class and passes props to it",
    explanation: "super(props) calls the constructor of the parent class (React.Component) and passes props to it, which is necessary before using 'this' in the constructor.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 91,
    question: "What is a JavaScript Promise?",
    options: [
      "An object representing the eventual completion or failure of an asynchronous operation",
      "A guarantee that a function will return a specific value",
      "A way to ensure code executes in a specific order",
      "A special type of function that always returns a value"
    ],
    correctAnswer: "An object representing the eventual completion or failure of an asynchronous operation",
    explanation: "A Promise is an object representing the eventual completion or failure of an asynchronous operation and its resulting value.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 92,
    question: "What is a Pure Component in React?",
    options: [
      "A component that implements shouldComponentUpdate with a shallow comparison of props and state",
      "A component with no side effects",
      "A component written in pure JavaScript without JSX",
      "A component that doesn't use class methods"
    ],
    correctAnswer: "A component that implements shouldComponentUpdate with a shallow comparison of props and state",
    explanation: "PureComponent is similar to Component but implements shouldComponentUpdate with a shallow comparison of props and state, potentially improving performance by reducing unnecessary renders.",
    category: "react",
    difficulty: "hard"
  },
  {
    id: 93,
    question: "What is the result of `console.log(1 < 2 < 3)`?",
    options: [
      "true",
      "false",
      "undefined",
      "Error"
    ],
    correctAnswer: "true",
    explanation: "The expression is evaluated left to right: (1 < 2) < 3, which becomes true < 3. Since true is converted to 1, the result is 1 < 3, which is true.",
    category: "javascript",
    difficulty: "hard"
  },
  {
    id: 94,
    question: "What does the React.memo() function do?",
    options: [
      "Creates a memoized component that only re-renders when props change",
      "Memorizes the component's state between renders",
      "Creates a component that remembers its previous renders",
      "Improves component loading performance"
    ],
    correctAnswer: "Creates a memoized component that only re-renders when props change",
    explanation: "React.memo is a higher-order component that memoizes a component, preventing it from re-rendering if its props haven't changed, similar to shouldComponentUpdate.",
    category: "react",
    difficulty: "hard"
  },
  {
    id: 95,
    question: "What is the output of `console.log([1, 2, 3].map(parseInt))`?",
    options: [
      "[1, NaN, NaN]",
      "[1, 2, 3]",
      "[0, 1, 2]",
      "Error"
    ],
    correctAnswer: "[1, NaN, NaN]",
    explanation: "map passes three arguments to the callback: current value, index, and array. parseInt accepts two arguments: string and radix. So it becomes parseInt(1, 0), parseInt(2, 1), parseInt(3, 2), resulting in [1, NaN, NaN].",
    category: "javascript",
    difficulty: "hard"
  },
  {
    id: 96,
    question: "What is the purpose of React's 'refs'?",
    options: [
      "To access DOM elements or React component instances",
      "To reference external JavaScript libraries",
      "To create references to CSS files",
      "To link different React applications"
    ],
    correctAnswer: "To access DOM elements or React component instances",
    explanation: "Refs provide a way to access DOM elements or React component instances created in the render method.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 97,
    question: "What is event bubbling in JavaScript?",
    options: [
      "When an event triggers on an element and then bubbles up to its ancestors",
      "When multiple events happen simultaneously",
      "When events are stored in a queue",
      "When events are ignored by the browser"
    ],
    correctAnswer: "When an event triggers on an element and then bubbles up to its ancestors",
    explanation: "Event bubbling is the process where an event triggers on the deepest target element and then bubbles up through its ancestors in the DOM tree.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 98,
    question: "What is the significance of the 'children' prop in React?",
    options: [
      "It represents the content between the opening and closing tags of a component",
      "It's used to create child components",
      "It defines the hierarchy of components",
      "It specifies which components should re-render"
    ],
    correctAnswer: "It represents the content between the opening and closing tags of a component",
    explanation: "The children prop represents what's passed between the opening and closing tags of a component, allowing components to be composed together.",
    category: "react",
    difficulty: "medium"
  },
  {
    id: 99,
    question: "What is the output of `console.log(typeof typeof 1)`?",
    options: [
      "string",
      "number",
      "undefined",
      "object"
    ],
    correctAnswer: "string",
    explanation: "typeof 1 returns 'number', and typeof 'number' returns 'string'.",
    category: "javascript",
    difficulty: "medium"
  },
  {
    id: 100,
    question: "What is the purpose of React's forwardRef function?",
    options: [
      "To forward refs to child components",
      "To reference functions across components",
      "To speed up the rendering process",
      "To skip the reconciliation process"
    ],
    correctAnswer: "To forward refs to child components",
    explanation: "forwardRef allows components to take a ref they receive and forward it to a child component, giving the parent direct access to the child's DOM node.",
    category: "react",
    difficulty: "hard"
  }
];

module.exports = mcqQuestions;

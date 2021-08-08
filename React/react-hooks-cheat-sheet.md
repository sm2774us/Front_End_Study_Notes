# React Hooks cheat sheet: Best practices with examples

> ___Editor’s note:___ This React Hooks tutorial was last updated in January 2021 to include more React Hooks best practices and examples.
>

React Hooks have a very simple API, but given its massive community and variety of use cases, questions are bound to arise around React Hooks best practices and how to solve common problems.

In this tutorial, we’ll outline some React Hooks best practices and highlight some use cases with examples, from simple to advanced scenarios. To help demonstrate how to solve common React Hooks questions, I built an [accompanying web app](https://github.com/ohansemmanuel/react-hooks-cheatsheet) for live interaction with the examples herein.

# React Hooks cheat sheet: Best practices and examples

This React Hooks cheat sheet includes a lot of code snippets and assumes some Hooks fluency. If you’re completely new to Hooks, you may want to start with our [React Hooks API reference guide](./react-reference-guide-hooks-api.md).

## Table of Contents

- [React Hooks cheat sheet: Best practices with examples](#react-hooks-cheat-sheet--best-practices-with-examples)
  - [React Hooks cheat sheet: Best practices and examples](#react-hooks-cheat-sheet--best-practices-and-examples)
  - [Table of Contents](#table-of-contents)
  - [`useState`](#usestate)
    <details>
    <summary>Click to expand!</summary>
	
    - [Declare state variable](#declare-state-variable)
    - [Update state variable](#update-state-variable)
    - [Why does the React `useState` Hook not update immediately?](#why-does-the-react-usestate-hook-not-update-immediately)
	- [React Hooks and multiple state variables](#react-hooks-and-multiple-state-variables)
	- [Use object state variable](#use-object-state-variable)
	- [Initialize state from function](#initialize-state-from-function)
	- [Functional `setState`](#functional-setstate)
  - [`useEffect`](#useeffect)
      <details>
      <summary>Click to expand!</summary>

      - [Basic side effect](#basic-side-effect)
	  - [Effect with Cleanup](#effect-with-cleanup)
	  - [Multiple effects](#multiple-effects)
	  - [Skipping effects (array dependency)](#skipping-effects--array-dependency)
	  - [Skipping effects (empty array dependency)](skipping-effects--empty-array-dependency)
	  - [Skipping effects (no array dependency)](skipping-effects--no-array-dependency)
  - [`useContext`](#usecontext)
  - [`useLayoutEffect`](#uselayouteffect)
      <details>
      <summary>Click to expand!</summary>

      - [Similar usage as `useEffect`](#similar-usage-as-useeffect)
	  - [`useLayoutEffect` vs. `useEffect`](#uselayouteffect-vs-useeffect)
  - [`useReducer`](#usereducer)
      <details>
      <summary>Click to expand!</summary>

      - [Basic usage](#basic-usage)
      - [Initialize state lazily](#initialize-state-lazily)
	  - [Imitate the behavior of this.setState](#imitate-the-behavior-of-thissetstate)
  - [`useCallback`](#usecallback)
      <details>
      <summary>Click to expand!</summary>

      - [`useCallback` example](#usecallback-example)
      - [`useCallback` with referenced function](#usecallback-with-referenced-function)
      - [`useCallback` with inline function](#usecallback-with-inline-function)
  - [`useMemo`](#usememo)
      <details>
      <summary>Click to expand!</summary>

      - [`useMemo` example](#usememo-example)
      - [Basic usage](#basic-usage)
  - [`useRef`](#useref)
      <details>
      <summary>Click to expand!</summary>

      - [Accessing the DOM](#accessing-the-dom)
      - [Instance-like variables (generic container)](#instance-like-variables--generic-container)
  - [Other examples](#other-examples)
  - [Conclusion](#conclusion)

## `useState`

### Declare state variable

### Update state variable

### Why does the React `useState` Hook not update immediately?

### React Hooks and multiple state variables

### Use object state variable

### Initialize state from function

### Functional `setState`

## `useEffect`

### Basic side effect

### Effect with Cleanup

### Multiple effects

### Skipping effects (array dependency)

### Skipping effects (empty array dependency)

### Skipping effects (no array dependency)

## `useContext`

## `useLayoutEffect`

### Similar usage as `useEffect`

### `useLayoutEffect` vs. `useEffect`

## `useReducer`

### Basic usage

### Initialize state lazily

### Imitate the behavior of `this.setState`

## `useCallback`

### `useCallback` example

### `useCallback` with referenced function

### `useCallback` with inline function

## `useMemo`

### `useMemo` example

### Basic usage

## `useRef`

### Accessing the DOM

### Instance-like variables (generic container)

## Other examples

## Conclusion

/**
 * @jest-environment jsdom
 */

const {
    addElementToDOM,
    removeElementFromDOM,
    simulateClick,
    handleFormSubmit
} = require('../index.js')

//
// Reset the DOM before each test to ensure isolation.
// This creates a consistent testing environment to mimic the real HTML structure.
//
beforeEach(() => {
    document.body.innerHTML = `
    <form id="user-form">
      <input type="text" id="user-input" />
    </form>
    <div id="dynamic-content"></div>
    <div id="error-message" class="hidden"></div>
  `
})

//
// Test: addElementToDOM
// Verifies that content is correctly inserted into the specified container.
//
test('addElementToDOM adds content to the correct DOM element', () => {
    const container = document.getElementById('dynamic-content');

    // Run function
    addElementToDOM('dynamic-content', 'Hello world');

    expect(container).not.toBeNull();
    expect(container.innerHTML).toBe('Hello world');

    // Ensure unrelated elements are not modified
    expect(document.getElementById('error-message').innerHTML).toBe('');
})

//
// Test: removeElementFromDOM
// Verifies that an existing DOM element is removed.
//
test('removeElementFromDOM removes an existing element from the DOM', () => {
    // Verify initial state
    expect(document.getElementById('dynamic-content')).not.toBeNull();

    // Run function
    removeElementFromDOM('dynamic-content');

    // Verify DOM updates reflecting removed element
    expect(document.getElementById('dynamic-content')).toBeNull();
})

//
// Test: simulateClick
// Verifies that simulating a click updates the DOM with expected content.
//
test('simulateClick updates the DOM with the expected content', () => {
    const clickComment = 'Hello World'
    const container = document.getElementById('dynamic-content');

    // Initial state
    expect(container).not.toBeNull();
    expect(container.innerHTML).toBe('');

    // Simulate click behavior
    simulateClick('dynamic-content', clickComment);

    // Verify DOM update
    expect(container.innerHTML).toBe(clickComment);
})

//
//Test: handleFormSubmit (valid input)
// Verifies that valid user input updates the page AND does not show an error.
//
test('handleFormSubmit updates the page when the form input contains valid text', () => {
    const formInput = 'Hello World'
    const container = document.getElementById('dynamic-content');
    const errorMessage = document.getElementById('error-message');

    // Initial state
    expect(container).not.toBeNull();
    expect(errorMessage.innerHTML).toBe('');

    // Simulate user typing valid input
    document.getElementById('user-input').value = formInput;

    // Trigger form submission logic
    handleFormSubmit('user-form', 'dynamic-content');

    // Verify content update
    expect(container.innerHTML).toBe(formInput);

    // Verify error message remains hidden
    expect(errorMessage.classList).toContain('hidden');

})

//
// Test: handleFormSubmit (empty input)
// Verifies that submitting empty or whitespace-only input:
// - does not update the content
// - displays an error message
// - makes the error visible
//
test('handleFormSubmit displays the error message Input cannot be empty when the input is empty', () => {
    const container = document.getElementById('dynamic-content');
    const formInput = document.getElementById('user-input');
    const errorMessage = document.getElementById('error-message');

    // Simulate whitespace-only input (tests trim behavior)
    formInput.value = ' ';

    // Initial state
    expect(container).not.toBeNull();
    expect(formInput).not.toBeNull();
    expect(formInput.value).toBe(' ')
    expect(errorMessage.innerHTML).toBe('');
    expect(errorMessage.classList).toContain('hidden');

    // Trigger form submission logic
    handleFormSubmit('user-form', 'dynamic-content');

    // Verify content is NOT updated
    expect(container.innerHTML).toBe('');

    // Verify error message is shown
    expect(errorMessage.innerHTML).toContain('Input cannot be empty');

    // Verify error message is visible
    expect(errorMessage.classList).not.toContain('hidden');
})

import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent} from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Note from './Note'

test('renders content', () => {
    const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
    }

    const component = render(
        <Note note={note} />
    )

    //to print the HTML rendered by the component to the console.
    component.debug()

    //search for a smaller part of the component and print its HTML code
    const li = component.container.querySelector('li')
    console.log(prettyDOM(li))

    //method 1
    expect(component.container).toHaveTextContent(
        'Component testing is done with react-testing-library'
    )

    //method 2
    const element = component.getByText(
        'Component testing is done with react-testing-library'
    )
    expect(element).toBeDefined()

    //method 3
    const div = component.container.querySelector('.note')
    expect(div).toHaveTextContent(
        'Component testing is done with react-testing-library'
    )

})

test('clicking the button calls event handler once', () => {
    const note = {
        content: 'Component testing is done with react-testing-library',
        important: true 
    }

    const mockHandler = jest.fn()

    const component = render(
        <Note note={note} toggleImportance={mockHandler} />
    )

    // finds the button based on the text from the rendered component
    const button = component.getByText('make not important')
    fireEvent.click(button)

    //verifies that the mock function has been called exactly once.
    expect(mockHandler.mock.calls).toHaveLength(1)
})
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('testing blogform', () => {
    const addBlog = jest.fn()

    const component = render(
        <BlogForm addBlog={addBlog}/>
    )
    
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(title, {
        target: {value: 'Hello World'}
    })
    fireEvent.change(author, {
        target: {value: 'Samuel'}
    })
    fireEvent.change(url, {
        target: {value: 'hello.io'}
    })
    fireEvent.submit(form)

    expect(addBlog.mock.calls).toHaveLength(1)
    // expect(addBlog.mock.calls[0][0].content).toBe('Hello World')
    // expect(addBlog.mock.calls[0][1].content).toBe('Samuel')
    // expect(addBlog.mock.calls[0][2].content).toBe('hello.io')
})
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent} from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

test('check blog initially only renders title and author', () => {
    const blog = {
        title: 'Hello from a Blog',
        author: 'Samuel',
        url: "hello.com"
    }

    const component = render(
        <Blog blog={blog}/>
    )

    const div = component.container.querySelector('.blogShortInfo')
    expect(div).toHaveTextContent('Hello from a Blog')
    expect(div).toHaveTextContent('Samuel')
    expect(div).not.toHaveTextContent("hello.com")
})

test('check renders url and likes after button clicked', () => {
    const blog = {
        title: 'Hello from a Blog',
        author: 'Samuel',
        url: "hello.com",
        likes: 0
    }

    const component = render(
        <Blog blog={blog}/>
    )

    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.blogShortInfo')
    expect(div).toHaveTextContent('hello.com')
    expect(div).toHaveTextContent('0')
})

test('clicking like button twice', () => {
    const blog = {
        title: 'Hello from a Blog',
        author: 'Samuel',
        url: "hello.com",
        likes: 0
    }

    const mockHandler = jest.fn()

    const component = render(
        <Blog blog={blog} likeBlog={mockHandler}/>
    )

    const button = component.getByText('view')
    fireEvent.click(button)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
})
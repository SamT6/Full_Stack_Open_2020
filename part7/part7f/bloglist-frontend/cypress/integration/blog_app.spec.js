describe('Blog app', function (){
    beforeEach(function(){
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            "name": "Samuel",
            "username": "hellohello",
            "password": "hello123"
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function(){
        cy.contains('username')
        cy.contains('password')
        cy.contains('login')
    })

    describe('Login', function(){
        it('succeeds with correct credentials', function(){
            cy.get('#username').type('hellohello')
            cy.get('#password').type('hello123')
            cy.get('#login-button').click()
    
            cy.contains('Samuel logged-in')
        })

        it('fails with wrong credentials', function(){
            cy.get('#username').type('hellohello')
            cy.get('#password').type('wrong')
            cy.get('#login-button').click()   

            cy.get('.error').contains('wrong credentials')  
            cy.get('html').should('not.contain', "Samuel logged-in")
        })
    })

    describe('when logged in', function(){
        beforeEach(function(){
            cy.login({username: "hellohello", password: 'hello123'})
        })

        describe('when theres one blog', function(){
            beforeEach(function(){
                cy.createBlog({
                    title: "Hello",
                    author: "Samuel",
                    url: 'hello.com'
                })
            })

            it('user can like a blog', function(){
                cy.contains('view').click()
                cy.contains('like').click()
            })

            it('user can delete blog', function(){
                cy.contains('view').click()
                cy.contains('remove').click()
                cy.get('html').should('not.contain', "Hello")
            })
        })

        describe('when theres three blogs', function(){
            beforeEach(function(){
                cy.createBlog({
                    title: "Hello1",
                    author: "Samuel",
                    url: 'hello.com'
                })
                cy.createBlog({
                    title: "Hello2",
                    author: "Samuel2",
                    url: 'hello2.com'
                })
                cy.createBlog({
                    title: "Hello3",
                    author: "Samuel3",
                    url: 'hello3.com'
                })
            })

            it('blogs are sorted based on likes', function(){
                cy.contains('Hello3').contains('view').click()
                cy.contains('Hello3').contains('like').click()
                cy.wait(1000)
                cy.contains('Hello3').contains('like').click()
                cy.wait(1000)
                cy.contains('Hello3').contains('like').click()
                cy.wait(1000)
                cy.contains('Hello3').contains('like').click()

                cy.contains('Hello2').contains('view').click()
                cy.contains('Hello2').contains('like').click()
                cy.wait(1000)
                cy.contains('Hello2').contains('like').click()
                cy.wait(1000)
                cy.contains('Hello2').contains('like').click()

                cy.contains('Hello1').contains('view').click()
                cy.contains('Hello1').contains('like').click()


                
            })
        })

        
    })
})
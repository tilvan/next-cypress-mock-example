describe('Joke', () => {
  it('fetches a random joke', () => {
    cy.visit('/joke')
    cy.get('[data-cy=joke]').should('not.be.empty')
  })

  it('getServerSideProps returns mock', () => {
    const joke = 'Our wedding was so beautiful, even the cake was in tiers.'
    cy.task('nock', {
      hostname: 'https://v2.jokeapi.dev',
      method: 'GET',
      path: '/joke/Any?type=single',
      statusCode: 200,
      body: {
        id: 'NmbFtH69hFd',
        joke,
        status: 200
      }
    })
    cy.visit('/joke')
    // nock has worked!
    cy.contains('[data-cy=joke]', joke)
  })
});

export {}

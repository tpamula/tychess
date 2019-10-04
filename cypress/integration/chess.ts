describe('chess', () => {
  it("should be able to play a fool's mate game", () => {
    cy.visit('/');

    cy.get('[data-testid=player-white-selector]').should('be.visible');
    cy.get('[data-testid=player-black-selector]').should('be.visible');

    cy.get('[data-testid=player-black-selector]').should('be.visible').select('Human');

    cy.get('[data-testid=submit]').click();

    cy.contains('ongoing').should('be.visible');
    const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    cy.contains(initialFen).should('be.visible');
    cy.get('[data-testid=undo-move]').should('be.visible').and('not.be.disabled');

    cy.get('[data-testid=chessboard').should('be.visible');

    cy.get('[data-testid=chessboard-square-f2').should('be.visible').click();
    cy.get('[data-testid=chessboard-square-f3').should('be.visible').click();

    cy.get('[data-testid=chessboard-square-e7').should('be.visible').click();
    cy.get('[data-testid=chessboard-square-e5').should('be.visible').click();

    cy.get('[data-testid=chessboard-square-g2').should('be.visible').click();
    cy.get('[data-testid=chessboard-square-g4').should('be.visible').click();

    cy.get('[data-testid=chessboard-square-d8').should('be.visible').click();
    cy.get('[data-testid=chessboard-square-h4').should('be.visible').click();

    cy.contains('checkmate, black won').should('be.visible');
    const foolsMateCheckmateFen = 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 4 3';
    cy.contains(foolsMateCheckmateFen).should('be.visible');
    cy.get('[data-testid=undo-move]').should('be.visible').and('not.be.disabled');
  })
});

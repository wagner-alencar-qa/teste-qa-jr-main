describe("Teste de CRUD", () => {

    // Executa antes de cada teste
    // Garante que o teste sempre inicia na página inicial
    beforeEach(() => {
      cy.visit("/");
    });
  
    it("Criação e edição de usuário", () => {
  
      // Gera dados aleatórios para evitar conflitos de cadastro
      cy.generateUserData().then((user) => {
  
        // ======================
        // C - Criação
        // ======================
  
        // Abre o modal/formulário de criação de usuário
        cy.get('#new-user').click();
  
        // Preenche os campos obrigatórios do formulário
        cy.get('[placeholder="Nome"]').type(user.name);
        cy.get('[placeholder="Email"]').type(user.email);
        cy.get('[placeholder="Telefone"]').type(user.phone);
        cy.get('[placeholder="Cidade de nascimento"]').type(user.city);
        cy.get('[placeholder="Data de nascimento"]').type(user.birthDate);
  
        // Abre o select customizado de empresa
        cy.get('[name="search_name_input"]').click();
  
        // Seleciona a primeira empresa disponível na lista
        cy.get('ul.optionContainer li.option').eq(0).click();
  
        // Clica fora do select para garantir que o dropdown seja fechado
        cy.get('.ReactModal__Content').click();
  
        // Submete o formulário para criar o usuário
        cy.get('.sc-eCImPb > button').click();
  
        // ======================
        // Validação pós-criação
        // ======================
  
        // ======================
        // R - Ler
        // ======================

        // Verifica se o usuário criado aparece na tabela
        cy.contains('tbody tr', user.email).should('be.visible');
  
        // ======================
        // U - Edição
        // ======================
  
        // Localiza a linha do usuário pelo e-mail
        cy.contains('tbody tr', user.email)
          // Acessa a coluna de ações (7ª coluna)
          .find('td')
          .eq(6)
          // BUG: Clica especificamente no ícone de edição
          .find('img[alt="edit"]')
          .click();


        // ======================
        // D - Deletar
        // ======================

        // Localiza a linha do usuário pelo e-mail
        cy.contains('tbody tr', user.email)
          // Acessa a coluna de ações (7ª coluna
          .find('td')
          .eq(6)
          // Clica especificamente no ícone de deletar
          .find('img[alt="delete"]')
          .click();
        cy.get('.swal2-confirm').click()

        // BUG: Verifica se o usuário deletado não aparece mais na tabela

        cy.contains('tbody tr', user.email).should('exist');

      
    });
    });
  
  });
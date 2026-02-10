describe('Cadastro de Usuário', () => {

    // Executa antes de cada teste
    // Garante que o teste sempre inicia na página inicial
    beforeEach(() => {
      cy.visit("http://localhost:5400");
    });

  describe('Fluxo principal', () => {  
    it('Deve criar, visualizar, editar e deletar um usuário', () => {
  
      // Gera dados aleatórios para evitar conflitos de cadastro
      cy.generateUserData().then((user) => {
  
        // ======================
        // C - Criação
        // ======================
  
        // Abre o modal/formulário de criação de usuário
        cy.get('#new-user').click();
  
        // Preenche os campos do formulário
        cy.get('[placeholder="Nome"]').type(user.name);
        cy.get('[placeholder="Email"]').type(user.email);
        cy.get('[placeholder="Telefone"]').type(user.phone);
        cy.get('[placeholder="Cidade de nascimento"]').type(user.city);
        cy.get('[placeholder="Data de nascimento"]').type(user.birthDate);
  
        // Abre o select customizado de empresa
        cy.get('[name="search_name_input"]').click();
  
        // Seleciona a primeira empresa disponível na lista
        cy.get('ul.optionContainer li.option')
          .eq(0)
          .click();
  
        // Clica fora do select para garantir que o dropdown seja fechado
        cy.get('.ReactModal__Content').click();
  
        // Submete o formulário para criar o usuário
        cy.get('.sc-eCImPb > button').click();
  
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
          // Acessa a coluna de ações (7ª coluna)
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

  describe('Validações de Campos', () => { 

    // ======================
    // CAMPO - Nome
    // ======================

    it('Deve não permitir cadastro com nome vazio', () => {
  
        // Abre o modal/formulário de criação de usuário
        cy.get('#new-user').click();

        // Preenche os campos do formulário
        //cy.get('[placeholder="Nome"]').type(user.name);
        cy.get('[placeholder="Email"]').type("teste@mail.com");
        cy.generateUserData().then((user) => {
        cy.get('[placeholder="Telefone"]').type(user.phone);
        cy.get('[placeholder="Cidade de nascimento"]').type(user.city);
        cy.get('[placeholder="Data de nascimento"]').type(user.birthDate);
  
        // Abre o select customizado de empresa
        cy.get('[name="search_name_input"]').click();
  
        // Seleciona a primeira empresa disponível na lista
        cy.get('ul.optionContainer li.option')
          .eq(0)
          .click();

        // Clica fora do select para garantir que o dropdown seja fechado
        cy.get('.ReactModal__Content').click();
  
        // Submete o formulário para criar o usuário
        cy.get('.sc-eCImPb > button').click();
        

        // Pega a mensagem padrão do navegador quando o campo obrigatório está inválido
        cy.get('[placeholder="Nome"]').then(($input) => {
          expect($input[0].validationMessage).to.eq('Preencha este campo.');
  
        });
      });
    });


//Código comenpara para ser utilizado em uma  atualização futura. Para utiliza-lo retire o "/*" do inicio e final do códiiigo 

    /*it('Deve não permitir caracteres especiais', () => {
  
      // Abre o modal/formulário de criação de usuário
      cy.get('#new-user').click();

      // Preenche os campos do formulário
      cy.generateUserData().then((user) => {

      cy.get('[placeholder="Nome"]').type(user.specialName);
      cy.get('[placeholder="Email"]').type(user.specialEmail); 
      cy.get('[placeholder="Telefone"]').type(user.phone);
      cy.get('[placeholder="Cidade de nascimento"]').type(user.city);
      cy.get('[placeholder="Data de nascimento"]').type(user.birthDate);

      // Abre o select customizado de empresa
      cy.get('[name="search_name_input"]').click() ;

      // Seleciona a primeira empresa disponível na lista
      cy.get('ul.optionContainer li.option')
        .eq(0)
        .click();

      // Clica fora do select para garantir que o dropdown seja fechado
      cy.get('.ReactModal__Content').click();

      // Submete o formulário para criar o usuário
      cy.get('.sc-eCImPb > button').click();


      // Validação esperada, mas ainda não mapeada
      cy.contains('Nome inválido').should('be.visible');

      
    });
  });*/

  // ======================
  // CAMPO - Email
  // ======================

    it('Deve não permitir cadastro com email vazio', () => {
  
      // Abre o modal/formulário de criação de usuário
      cy.get('#new-user').click();

      // Preenche os campos do formulário
      cy.generateUserData().then((user) => {
      cy.get('[placeholder="Nome"]').type(user.name);
      //cy.get('[placeholder="Email"]').type(user.email);
      cy.get('[placeholder="Telefone"]').type(user.phone);
      cy.get('[placeholder="Cidade de nascimento"]').type(user.city);
      cy.get('[placeholder="Data de nascimento"]').type(user.birthDate);

      // Abre o select customizado de empresa
      cy.get('[name="search_name_input"]').click();

      // Seleciona a primeira empresa disponível na lista
      cy.get('ul.optionContainer li.option')
        .eq(0)
        .click();

      // Clica fora do select para garantir que o dropdown seja fechado
      cy.get('.ReactModal__Content').click();

      // Submete o formulário para criar o usuário
      cy.get('.sc-eCImPb > button').click();
      

      // Pega a mensagem padrão do navegador quando o campo obrigatório está inválido
      cy.get('[placeholder="Email"]').then(($input) => {
        expect($input[0].validationMessage).to.eq('Preencha este campo.');

      });
    });
  });


//Código comentado para para ser utilizado em uma  atualização futura. Para utiliza-lo retire o "/*" do inicio e final do códiiigo 

  /*it('Deve não permitir caracteres especiais', () => {
  
      // Abre o modal/formulário de criação de usuário
      cy.get('#new-user').click();

      // Preenche os campos do formulário
      cy.generateUserData().then((user) => {

      cy.get('[placeholder="Nome"]').type(user.specialName);
      cy.get('[placeholder="Email"]').type(user.specialEmail); 
      cy.get('[placeholder="Telefone"]').type("user.phone");
      cy.get('[placeholder="Cidade de nascimento"]').type(user.city);
      cy.get('[placeholder="Data de nascimento"]').type(user.birthDate);

      // Abre o select customizado de empresa
      cy.get('[name="search_name_input"]').click() ;

      // Seleciona a primeira empresa disponível na lista
      cy.get('ul.optionContainer li.option')
        .eq(0)
        .click();

      // Clica fora do select para garantir que o dropdown seja fechado
      cy.get('.ReactModal__Content').click();

      // Submete o formulário para criar o usuário
      cy.get('.sc-eCImPb > button').click();

      // Validação esperada, mas ainda não mapeada
      cy.contains('Email inválido').should('be.visible');
    
    });
  });*/


  // ======================
  // CAMPO - Telefone
  // ======================

  it('Deve não permitir cadastro com telefone vazio', () => {
  
    // Abre o modal/formulário de criação de usuário
    cy.get('#new-user').click();

    // Preenche os campos do formulário
    cy.generateUserData().then((user) => {
    cy.get('[placeholder="Nome"]').type(user.name);
    cy.get('[placeholder="Email"]').type(user.email);
    //cy.get('[placeholder="Telefone"]').type(user.phone);
    cy.get('[placeholder="Cidade de nascimento"]').type(user.city);
    cy.get('[placeholder="Data de nascimento"]').type(user.birthDate);

    // Abre o select customizado de empresa
    cy.get('[name="search_name_input"]').click();

    // Seleciona a primeira empresa disponível na lista
    cy.get('ul.optionContainer li.option')
      .eq(0)
      .click();

    // Clica fora do select para garantir que o dropdown seja fechado
    cy.get('.ReactModal__Content').click();

    // Submete o formulário para criar o usuário
    cy.get('.sc-eCImPb > button').click();
    

    // Verifica se o usuário está na tabela pelo email 
    cy.contains('tbody tr', user.email)
      .should('exist')
      // Isso evita pegar dados de outras linhas da tabela
      .within(() => {
    cy.get('td')
      // coluna telefone
      .eq(2) 
      // Valida que o texto dessa célula está vazio
      .should('have.text', '');
  });


  });
});


//Código comentado para para ser utilizado em uma  atualização futura. Para utiliza-lo retire o "/*" do inicio e final do códiiigo 

/*it('Deve não aceitar letras ou caracteres especiais', () => {

  // Abre o modal/formulário de criação de usuário
  cy.get('#new-user').click();

  // Valor de telefone propositalmente inválido
  // Contém letras e caracteres especiais para testar a regra de negócio
  const telefoneInvalido = '21a55b44c9@#1234';

  // Gera dados válidos para os outros campos do formulário
  cy.generateUserData().then((user) => {

    // Preenche o campo Nome com um valor válido
    cy.get('[placeholder="Nome"]').type(user.name);

    // Preenche o campo Email com um valor válido
    cy.get('[placeholder="Email"]').type(user.email);

    // Preenche o campo Telefone com valor inválido
    cy.get('[placeholder="Telefone"]').type(telefoneInvalido);

    // Preenche os demais campos obrigatórios
    cy.get('[placeholder="Cidade de nascimento"]').type(user.city);
    cy.get('[placeholder="Data de nascimento"]').type(user.birthDate);

    // Abre o select customizado de empresa
    cy.get('[name="search_name_input"]').click();

    // Seleciona a primeira empresa da lista
    cy.get('ul.optionContainer li.option').eq(0).click();

    // Clica fora do select para garantir que ele seja fechado
    cy.get('.ReactModal__Content').click();

    // Submete o formulário para criação do usuário
    cy.get('.sc-eCImPb > button').click();

    // Localiza na tabela a linha correspondente ao usuário criado
    cy.contains('tbody tr', user.email)
      .should('exist')
      .within(() => {

        // Obtém o valor exibido na coluna Telefone da tabela
        cy.get('td')
          .eq(2) 

          // Lê o texto exatamente como foi salvo e exibido pelo sistema
          .invoke('text')

          // Resultado esperado não conter os caracteres e letras 
          .should('not.match', /[a-zA-Z@#]/);
      });
  });
});*/

// ============================
// CAMPO - Cidade de Nascimento
// ============================

it('Deve não permitir cadastro sem cidade', () => {
  
  // Abre o modal/formulário de criação de usuário
  cy.get('#new-user').click();

  // Preenche os campos do formulário
  cy.generateUserData().then((user) => {
  cy.get('[placeholder="Nome"]').type(user.name);
  cy.get('[placeholder="Email"]').type(user.email);
  cy.get('[placeholder="Telefone"]').type(user.phone);
  //cy.get('[placeholder="Cidade de nascimento"]').type(user.city);
  cy.get('[placeholder="Data de nascimento"]').type(user.birthDate);

  // Abre o select customizado de empresa
  cy.get('[name="search_name_input"]').click();

  // Seleciona a primeira empresa disponível na lista
  cy.get('ul.optionContainer li.option')
    .eq(0)
    .click();

  // Clica fora do select para garantir que o dropdown seja fechado
  cy.get('.ReactModal__Content').click();

  // Submete o formulário para criar o usuário
  cy.get('.sc-eCImPb > button').click();
  

  // Verifica se o usuário está na tabela pelo email 
  cy.contains('tbody tr', user.email)
    .should('exist')
    // Isso evita pegar dados de outras linhas da tabela
    .within(() => {
  cy.get('td')
    // coluna telefone
    .eq(4) 
    // Valida que o texto dessa célula está vazio
    .should('have.text', '');
    });
 

   });
  });

// ==========================
// CAMPO - Data de Nascimento
// ==========================

  it('Deve não permitir campo vazio', () => {
  
      // Abre o modal/formulário de criação de usuário
      cy.get('#new-user').click();

      // Preenche os campos do formulário
      cy.generateUserData().then((user) => {
      cy.get('[placeholder="Nome"]').type(user.name);
      cy.get('[placeholder="Email"]').type(user.email);
      cy.get('[placeholder="Telefone"]').type(user.phone);
      cy.get('[placeholder="Cidade de nascimento"]').type(user.city);
      //cy.get('[placeholder="Data de nascimento"]').type(user.birthDate);

      // Abre o select customizado de empresa
      cy.get('[name="search_name_input"]').click();

      // Seleciona a primeira empresa disponível na lista
      cy.get('ul.optionContainer li.option')
        .eq(0)
        .click();

      // Clica fora do select para garantir que o dropdown seja fechado
      cy.get('.ReactModal__Content').click();

      // Submete o formulário para criar o usuário
      cy.get('.sc-eCImPb > button').click();
      

      // Pega a mensagem padrão do navegador quando o campo obrigatório está inválido
      cy.get('[placeholder="Data de nascimento"]').then(($input) => {
        expect($input[0].validationMessage).to.eq('Preencha este campo.');

      });
    });
  });

  //Esta aceitando a DataTransfer, mas ao confimar esta voltando para o dia atual.

  // Função que retorna a data de amanhã no formato YYYY-MM-DD
  /*const getTomorrowDate = () => {
  const today = new Date();
  // Cria um objeto Date com a data e hora atuais do sistema
  today.setDate(today.getDate() + 1); 
  // Soma 1 dia à data atual
  return today.toISOString().split('T')[0]; 
};
  it('Deve não aceitar data futura', () => {

    // Abre o modal/formulário
    cy.get('#new-user').click();

    // Gera data de amanhã
    const tomorrowDate = getTomorrowDate();

    cy.generateUserData().then((user) => {

    cy.get('[placeholder="Nome"]').type(user.name);
    cy.get('[placeholder="Email"]').type(user.email);
    cy.get('[placeholder="Telefone"]').type(user.phone);
    cy.get('[placeholder="Cidade de nascimento"]').type(user.city);

    // Data atual + 1 dia
    cy.get('[placeholder="Data de nascimento"]').type(tomorrowDate);

    cy.get('[name="search_name_input"]').click();
    cy.get('ul.optionContainer li.option').eq(0).click();
    cy.get('.ReactModal__Content').click();

    cy.get('.sc-eCImPb > button').click();

    // Validação: data futura não deve ser aceita
    cy.get('[placeholder="Data de nascimento"]').then(($input) => {
      expect($input[0].checkValidity()).to.be.false;
    });
  });
});*/

// ================
// CAMPO - Empresas
// ================

  it('Deve permitir cadastro sem empresa selecionada', () => {
  
      // Abre o modal/formulário de criação de usuário
      cy.get('#new-user').click();

      // Preenche os campos do formulário
      cy.generateUserData().then((user) => {
      cy.get('[placeholder="Nome"]').type(user.name);
      cy.get('[placeholder="Email"]').type(user.email);
      cy.get('[placeholder="Telefone"]').type(user.phone);
      cy.get('[placeholder="Cidade de nascimento"]').type(user.city);
      cy.get('[placeholder="Data de nascimento"]').type(user.birthDate);

      // Abre o select customizado de empresa
      //cy.get('[name="search_name_input"]').click();

      // Seleciona a primeira empresa disponível na lista
      //cy.get('ul.optionContainer li.option')
      //  .eq(0)
      //  .click();

      // Clica fora do select para garantir que o dropdown seja fechado
      //cy.get('.ReactModal__Content').click();

      // Submete o formulário para criar o usuário
      cy.get('.sc-eCImPb > button').click();

      // Verifica se o popup do SweetAlert2 está visível
      cy.get('.swal2-popup')
        .should('be.visible');

      // Verifica se o botão OK existe e está visível
      cy.get('.swal2-confirm')
        .should('be.visible')
        .and('contain', 'OK') // opcional, se o texto for "OK"
        .click();

      // Confirma que o email do ultimo socio não existe
      cy.contains('tbody tr', user.email).should('not.exist');
      
    });
  });

it('Deve permitir selecionar múltiplas empresas', () => {
  
  // Abre o modal/formulário de criação de usuário
  cy.get('#new-user').click();

  // Preenche os campos do formulário
  cy.generateUserData().then((user) => {
  cy.get('[placeholder="Nome"]').type(user.name);
  cy.get('[placeholder="Email"]').type(user.email);
  cy.get('[placeholder="Telefone"]').type(user.phone);
  cy.get('[placeholder="Cidade de nascimento"]').type(user.city);
  cy.get('[placeholder="Data de nascimento"]').type(user.birthDate);

  // Abre o select
  cy.get('[name="search_name_input"]').click();

  // Busca todas as opções disponíveis dentro do dropdown
  cy.get('ul.optionContainer li.option').then($options => {
    // Converte a lista de elementos do Cypress
    [...$options].forEach(option => {
      option.click();
  });
});
  // Clica fora do select para garantir que o dropdown seja fechado
  cy.get('.ReactModal__Content').click();

  // Submete o formulário para criar o usuário
  cy.get('.sc-eCImPb > button').click();

  });
 });
});

});

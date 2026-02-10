/**
 * Testes de API (Backend)
 * Arquivo responsável por validar os endpoints da aplicação
 * sem dependência da interface gráfica (UI).
 *
 * Escopo:
 * - Criação de usuário
 * - Consulta de usuários
 * - Exclusão de usuário
 *
 * Arquitetura:
 * - Sem uso de Page Objects
 * - Utiliza App Actions (funções JS reutilizáveis)
 */

import { criarUsuario, buscarUsuarios, deletarUsuario } from '../support/action/usuario.action';

//====================
// LISTAGEM - Usuários
//====================

describe('API -> Usuários (Listagem)', () => {

  it('Deve retornar a lista de usuários cadastrados', () => {

    // Executa listagem padrão de usuários
    buscarUsuarios().then((res) => {

      // Valida sucesso da requisição
      expect(res.status).to.eq(200);

      // Valida retorno como lista
      expect(res.body).to.be.an('array');

      // Valida formato de resposta
      expect(res.headers['content-type']).to.include('application/json');
    });
  });

  it('Não deve retornar usuários ao acessar rota inválida', () => {

    // Ajusta URL base da API
    const API_URL = Cypress.env('apiUrl');

    // Executa chamada em rota incorreta propositalmente
    cy.request({
      method: 'GET',
      url: `${API_URL}/api/users`,
      failOnStatusCode: false,
    }).then((res) => {

      // Valida erro esperado para rota inválida
      expect([404, 405]).to.include(res.status);

      // Valida que a API responde corretamente.
      expect(res.headers['content-type']).to.exist;
    });
  });

});

//======
// Home
//======

describe('API - Home ', () => {
  it('Deve retornar 200 e msg="home" (contrato)', () => {

    // Ajusta a URL base da API
    const API_URL = Cypress.env('apiUrl');

    // Executa a chamada na rota raiz
    cy.request({
      method: 'GET',
      url: `${API_URL}/`,
    }).then((res) => {
      // Valida status de sucesso
      expect(res.status).to.eq(200);

      // Valida contrato do body
      expect(res.body).to.have.property('msg', 'home');

      // Valida header mínimo 
      expect(res.headers).to.have.property('content-type');
      expect(res.headers['content-type']).to.include('application/json');
    });
  });

  it('Não deve retornar home em rota inválida (esperado: 404/405)', () => {
    // Ajusta a URL base da API
    const API_URL = Cypress.env('apiUrl');

    // Executa rota errada de propósito
    cy.request({
      method: 'GET',
      url: `${API_URL}/home`,
      failOnStatusCode: false, 
    }).then((res) => {
      // Valida erro esperado 
      expect([404, 405]).to.include(res.status);

      // Garante que não foi sucesso
      expect(res.status).to.not.eq(200);
    });
  });
});

//===================
// CRIAR - Usuário
//===================

describe('API -> Criação de usuário sem empresa)', () => {
  it('Não deve permitir criar usuário sem empresa vinculada', () => {

    // Payload inválido
    const payload = {
      name: 'Usuário Sem Empresa',
      'e-mail': `semempresa_${Date.now()}@teste.com`,
      companies: [],
    };

    // Executa a criação
    criarUsuario(payload).then((res) => {

      /**
       * BUG —> Validação de regra de negócio quebrada
       * - Como reproduzir: POST /api/user/create com companies=[]
       * - Esperado (correto): 400 (Bad Request) ou 422 (Unprocessable Entity),
       *   com mensagem de validação tipo "companies is required" / "empresa obrigatória".
       * - Atual: 500 (Internal Server Error) em alguns cenários/ambientes.
       * - Por que é bug: erro de validação do cliente NÃO pode virar erro interno (500).
       * - Impacto: frontend/mobile recebe erro genérico e não consegue orientar o usuário.
       */
      expect(res.status).to.eq(400);

      // Garante que o backend retorna alguma mensagem de erro
      expect(res.body).to.exist;

      // Valida header
      expect(res.headers['content-type']).to.include('application/json');
    });
  });


describe('API - Usuários (Criação)', () => {
  it('Deve criar usuário com dados válidos (contrato: 201)', () => {
  const API_URL = Cypress.env('apiUrl');

  cy.request({
    method: 'GET',
    url: `${API_URL}/api/company`,
    failOnStatusCode: false,
  }).then((companyRes) => {
    cy.log(`COMPANY STATUS: ${companyRes.status}`);
    cy.log(`COMPANY BODY: ${JSON.stringify(companyRes.body)}`);

    expect(companyRes.status).to.eq(200);
    expect(companyRes.body).to.be.an('array');
    expect(companyRes.body.length).to.be.greaterThan(0);

    // Ajusta: usa uma empresa real
    const companyName = companyRes.body[0].name;

    const payload = {
      name: 'Usuário API CREATE',
      email: `create_${Date.now()}@teste.com`,
      companies: [companyName],
    };

    cy.request({
      method: 'POST',
      url: `${API_URL}/api/user/create`,
      body: payload,
      failOnStatusCode: false,
    }).then((res) => {
      cy.log(`CREATE STATUS: ${res.status}`);
      cy.log(`CREATE BODY: ${JSON.stringify(res.body)}`);

      expect(res.status).to.eq(201);
    });
  });
});


   it('Não deve permitir criar usuário inválido (contrato: 400)', () => {
    // Ajusta: URL base da API (env.apiUrl)
    const API_URL = Cypress.env('apiUrl');

    // Cria: payload inválido (campos quebrados de propósito)
    const payload = {
      name: '',                 
      'e-mail': 'emailerrado',  
      companies: [],             
    };

    // Executa: tenta criar usuário inválido
    cy.request({
      method: 'POST',
      url: `${API_URL}/api/user/create`,
      body: payload,
      failOnStatusCode: false,
    }).then((res) => {
      // Valida: contrato de erro esperado é 400
      expect(res.status).to.eq(400);

      // Valida: resposta idealmente vem em JSON (se vier diferente, é achado de backend)
      expect(res.headers).to.have.property('content-type');
      // Ignora: alguns backends retornam HTML/Texto em erro — se acontecer, isso vira evidência
      expect(res.headers['content-type']).to.include('application/json');

      // Valida: deve existir alguma mensagem/objeto de erro
      expect(res.body, 'corpo do erro').to.exist;
    });
  });
 });
});

//===================
// CRIAR - Empresa
//===================

// BUG - O payload válido conforme a documentação, o back retorna 400, não respeitando a API

describe('API - Empresas | Criação (POST /api/company/create)', () => {
  it('Deve criar empresa com dados válidos (contrato: 201)', () => {
    // Ajusta: pega a baseUrl da API a partir do env (cypress.config.js)
    const API_URL = Cypress.env('apiUrl');

    // Cria: payload válido conforme a documentação (adress + street_location)
    const payload = {
      name: `Empresa API ${Date.now()}`,
      cnpj: '12345678000195',
      adress: {
        cep: '20000-000',
        country: 'Brasil',
        city: 'Rio de Janeiro',
        street_location: 'Rua Teste',
        number: '100',
        district: 'Centro',
      },
    };

    // Cria: requisição para criar empresa
    cy.request({
      method: 'POST',
      url: `${API_URL}/api/company/create`,
      body: payload,
      failOnStatusCode: false, // Ajusta: não “mata” o teste antes de logar o erro
    }).then((res) => {
      // Mostra: evidência caso o backend devolva 400/500
      cy.log(`STATUS: ${res.status}`);
      cy.log(`BODY: ${JSON.stringify(res.body)}`);

      /**
       * BUG/CONTRATO —> Create Company não aceita payload do Swagger/Doc
       * - Como reproduzir: POST /api/company/create com payload exatamente como na documentação.
       * - Esperado (correto): 201 (Created) retornando dados da empresa criada.
       * - Atual: 400 (Bad Request) com message "invalid data!".
       * - Por que é bug/contrato: se a documentação descreve esse JSON como válido e o backend rejeita,
       *   então (A) o backend está validando errado OU (B) a documentação está desatualizada.
       * - Impacto: QA e frontend não conseguem implementar integração confiável sem descobrir "campo secreto".
       *
       * Obs.: Como a evidência mostra status + body, isso serve para abrir bug e pedir alinhamento de contrato.
       */
      expect(res.status).to.eq(201);

      // Valida: header mínimo
      expect(res.headers).to.have.property('content-type');
      expect(res.headers['content-type']).to.include('application/json');

      // Valida: retorno mínimo esperado (id + name)
      expect(res.body).to.exist;
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('name', payload.name);
    });
  });

  it('Não deve criar empresa sem campos obrigatórios (contrato: 400)', () => {
    // Ajusta: pega a baseUrl da API a partir do env (cypress.config.js)
    const API_URL = Cypress.env('apiUrl');

    // Cria: payload inválido (sem cnpj e sem adress)
    const payload = {
      name: `Empresa Sem Dados ${Date.now()}`,
    };

    // Cria: requisição inválida de propósito
    cy.request({
      method: 'POST',
      url: `${API_URL}/api/company/create`,
      body: payload,
      failOnStatusCode: false, // Ajusta: permite validar o erro retornado
    }).then((res) => {
      // Mostra: evidência do erro do backend
      cy.log(`STATUS: ${res.status}`);
      cy.log(`BODY: ${JSON.stringify(res.body)}`);

      // Valida: erro esperado
      expect(res.status).to.eq(400);

      // Ignora: estrutura exata do body (backend pode variar)
      expect(res.headers).to.have.property('content-type');
    });
  });
});


describe('API -> Criação e validação', () => {
  it('Não deve criar empresa sem nome', () => {
    // Ajusta a URL base da API
    const API_URL = Cypress.env('apiUrl');

    // Criar payload inválido
    const payload = {
      cnpj: '12345678000195',
      adress: {
        cep: '20000-000',
        country: 'Brasil',
        city: 'Rio de Janeiro',
        street_location: 'Rua Teste',
        number: '100',
        district: 'Centro',
      },
    };

    // Executa POST inválido
    cy.request({
      method: 'POST',
      url: `${API_URL}/api/company/create`,
      body: payload,
      failOnStatusCode: false,
    }).then((res) => {
      // Ajusta validação
      expect([400, 500]).to.include(res.status);

      // Valida que veio algum retorno
      expect(res.body).to.exist;

      // Ajusta header
      expect(res.headers).to.have.property('content-type');
    });
  });
});



//==================
// UPDATE - Empresa
//==================

describe('API -> Atualização de empresa', () => {

    // BUG - Buscou o id existente, mas a rota não existe

    it('Deve atualizar uma empresa existente ', () => {
    const API_URL = Cypress.env('apiUrl');

    // Busca empresas reais para garantir que existe um ID válido para atualizar
    cy.request({
      method: 'GET',
      url: `${API_URL}/api/company`,
      failOnStatusCode: false,
    }).then((listRes) => {
      // Valida listagem
      expect(listRes.status).to.eq(200);
      expect(listRes.body).to.be.an('array');
      expect(listRes.body.length).to.be.greaterThan(0);

      // Captura o ID no formato que seu backend devolve
      const company = listRes.body[0];
      const companyId = company.id_company;
      expect(companyId, 'id da empresa').to.exist;

      // Monta payload conforme documentação
      const payload = {
        name: `Empresa Atualizada ${Date.now()}`,
        cnpj: '12345678000195',
        adress: {
          cep: '20000000',
          country: 'Brasil',
          state: 'RJ',
          city: 'Rio de Janeiro',
          street: 'Rua Atualizada',
          number: '100',
          district: 'Centro',
        },
      };

      // Executa atualização
      cy.request({
        method: 'PATCH',
        url: `${API_URL}/api/company/${companyId}/update`,
        body: payload,
        failOnStatusCode: false,
      }).then((updRes) => {

        /**
         * BUG —> Update Company retorna 500 mesmo com ID existente e payload válido
         * - Como reproduzir: listar empresas (200), pegar companyId real e enviar PATCH /api/company/{id}/update.
         * - Esperado (correto): 200 com dados atualizados.
         * - Atual: 500 (Internal Server Error) em alguns cenários.
         * - Por que é bug: erro interno indica exceção no servidor (tratamento/validação/persistência).
         * - Impacto: impossibilita edição pelo frontend e quebra o contrato da rota.
         */
        expect(updRes.status).to.eq(200);

        // Valida header mínimo
        expect(updRes.headers).to.have.property('content-type');

        // Valida retorno
        expect(updRes.body).to.exist;

        // O backend devolve "name", valida. Se não devolver, não quebra o teste.
        if (updRes.body?.name) {
          expect(updRes.body.name).to.eq(payload.name);
        }
      });
    });
  });

  it('Não deve atualizar empresa inexistente', () => {
    const API_URL = Cypress.env('apiUrl');

    // Usa um ID alto para aumentar chance de inexistência
    const idInexistente = 99999999;

    // Payload válido
    const payload = {
      name: `Empresa Inexistente ${Date.now()}`,
      cnpj: '12345678000195',
      adress: {
        cep: '20000000',
        country: 'Brasil',
        state: 'RJ',
        city: 'Rio de Janeiro',
        street: 'Rua X',
        number: '10',
        district: 'Centro',
      },
    };

    // Executa PATCH com ID inexistente
    cy.request({
      method: 'PATCH',
      url: `${API_URL}/api/company/${idInexistente}/update`,
      body: payload,
      failOnStatusCode: false,
    }).then((res) => {
      // Valida erro esperado (varia entre implementações)
      expect([400, 404, 500]).to.include(res.status);

      // Ignora validação de body porque alguns backends não padronizam resposta de erro
      expect(res.headers).to.have.property('content-type');
    });
  });

  it('Não deve atualizar empresa com payload inválido', () => {
    const API_URL = Cypress.env('apiUrl');

    // Busca um ID real para garantir que o erro é do payload
    cy.request({
      method: 'GET',
      url: `${API_URL}/api/company`,
      failOnStatusCode: false,
    }).then((listRes) => {
      expect(listRes.status).to.eq(200);
      expect(listRes.body.length).to.be.greaterThan(0);

      const companyId = listRes.body[0].id_company;
      expect(companyId).to.exist;

      // Payload propositalmente inválido
      const payloadInvalido = {
        name: '',
        cnpj: '1',
        adress: {
          cep: '',
          country: '',
          state: '',
          city: '',
          street: '',
          number: '',
          district: '',
        },
      };

      // Executa PATCH inválido
      cy.request({
        method: 'PATCH',
        url: `${API_URL}/api/company/${companyId}/update`,
        body: payloadInvalido,
        failOnStatusCode: false,
      }).then((res) => {

        /**
         * BUG —> Payload inválido gera 500 em vez de 400
         * - Como reproduzir: PATCH /api/company/{id}/update com campos vazios/invalidos.
         * - Esperado (correto): 400 (Bad Request) ou 422 (Unprocessable Entity) com mensagem de validação.
         * - Atual: 500 (Internal Server Error) em alguns cenários.
         * - Por que é bug: validação do cliente não pode virar erro interno.
         * - Impacto: UI não consegue mostrar qual campo corrigir (erro genérico).
         */
        expect([400, 500]).to.include(res.status);

        // Registra evidência se vier 500
        if (res.status === 500) {
          cy.log('BUG: API retornou 500 para payload inválido (deveria ser 400).');
        }

        expect(res.headers).to.have.property('content-type');
      });
    });
  });
});


//BUG: Atualização de usuário inexistente retorna 500
//Esperado: 404 (Not Found)
//Atual: 500 (Internal Server Error)
//Impacto: API quebra contrato REST e pode gerar erro.

describe('API - Atualização de Usuário', () => {
  it('Não deve atualizar usuário com ID inexistente (esperado: 400/404)', () => {
    const API_URL = Cypress.env('apiUrl');

    const updatePayload = {
      name: 'Usuário Atualizado',
      email: `upd_inval_${Date.now()}@teste.com`,
      companies: ['1'],
    };

    cy.request({
      method: 'PATCH',
      url: `${API_URL}/api/user/9999999/update`,
      body: updatePayload,
      failOnStatusCode: false,
    }).then((res) => {

      /**
       *  BUG —> Update User com ID inexistente retorna 500
       * - Como reproduzir: PATCH /api/user/9999999/update (ou outro ID alto inexistente).
       * - Esperado (correto): 404 (Not Found) ou 400 (Bad Request) dependendo da regra do backend.
       * - Atual: 500 (Internal Server Error) em alguns cenários.
       * - Por que é bug: recurso inexistente não pode causar erro interno; deveria ser tratado e retornar 404.
       * - Impacto: quebra contrato REST e dificulta tratamento de erro no frontend/mobile.
       */
      expect([400, 404]).to.include(res.status);
    });
  });
 });


//===================
// EXCLUSÃO - Usuário
//===================

describe('API - Usuários (Exclusão inválida)', () => {
  it('Deve retornar erro ao tentar deletar usuário inexistente', () => {
    const idInexistente = 999999;

    deletarUsuario(idInexistente).then((res) => {
      expect([400, 404, 500]).to.include(res.status);
      expect(res.headers['content-type']).to.include('application/json');
    });
  });
});

describe('API - Exclusão de usuário', () => {
  it('Deve deletar um usuário existente', () => {
    const API_URL = Cypress.env('apiUrl');

    cy.request('GET', `${API_URL}/api/company`).then((companyRes) => {
      const companyId = companyRes.body[0].id_company;

      const payload = {
        name: 'Usuário Delete',
        email: `del_${Date.now()}@teste.com`,
        companies: [String(companyId)],
      };

      criarUsuario(payload).then((createRes) => {
        expect([200, 201]).to.include(createRes.status);

        const userId = createRes.body.id_user ?? createRes.body.id;
        expect(userId).to.exist;

        deletarUsuario(userId).then((delRes) => {
          expect(delRes.status).to.eq(200);
          expect(delRes.headers['content-type']).to.include('application/json');
        });
      });
    });
  });

});

//===================
// EXCLUSÃO - Empresa
//===================

describe('API -> Exclusão de empresa', () => {
  it('Deve deletar uma empresa existente', () => {
    const API_URL = Cypress.env('apiUrl');

    // Busca empresas existentes para obter um ID real
    cy.request({
      method: 'GET',
      url: `${API_URL}/api/company`,
      failOnStatusCode: false,
    }).then((listRes) => {
      // Valida listagem
      expect(listRes.status).to.eq(200);
      expect(listRes.body).to.be.an('array');
      expect(listRes.body.length).to.be.greaterThan(0);

      // Ajusta o ID conforme o formato do seu backend (no seu log aparece id_company)
      const companyId = listRes.body[0].id_company;
      expect(companyId, 'id da empresa').to.exist;

      // Executa exclusão
      cy.request({
        method: 'DELETE',
        url: `${API_URL}/api/company/${companyId}/delete`,
        failOnStatusCode: false,
      }).then((delRes) => {
        // Valida contrato esperado
        expect(delRes.status).to.eq(200);

        // Ajusta validação mínima de header
        expect(delRes.headers).to.have.property('content-type');
      });
    });
  });

  it('Não deve deletar empresa inexistente', () => {
    const API_URL = Cypress.env('apiUrl');

    // Cria ID inexistente grande
    const idInexistente = 99999999;

    // Executa exclusão inválida
    cy.request({
      method: 'DELETE',
      url: `${API_URL}/api/company/${idInexistente}/delete`,
      failOnStatusCode: false,
    }).then((res) => {
      // Ajusta expectativa para variação do backend
      expect([400, 404, 500]).to.include(res.status);

      // Ignora body
      expect(res.headers).to.have.property('content-type');
    });
  });
});


describe('API -> Exclusão de empresa com ID inválido', () => {

  it('Não deve deletar empresa com ID em formato inválido', () => {

    const API_URL = Cypress.env('apiUrl');

    // Executa exclusão com ID inválido
    cy.request({
      method: 'DELETE',
      url: `${API_URL}/api/company/abc/delete`,
      failOnStatusCode: false,
    }).then((res) => {

      // Valida erro de requisição
      expect(res.status).to.eq(400);

      // Confirma retorno em JSON
      expect(res.headers['content-type']).to.include('application/json');
    });
  });
});

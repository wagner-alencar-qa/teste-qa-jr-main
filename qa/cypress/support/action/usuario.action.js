const API_URL = Cypress.env('apiUrl');

export const criarUsuario = (user) => {
  return cy.request({
    method: 'POST',
    url: `${API_URL}/api/user/create`,
    body: user,
    failOnStatusCode: false
  });
};

export const buscarUsuarios = () => {
  return cy.request({
    method: 'GET',
    url: `${API_URL}/api/user`,
    failOnStatusCode: false
  });
};

export const deletarUsuario = (id) => {
  return cy.request({
    method: 'DELETE',
    url: `${API_URL}/api/user/${id}/delete`,
    failOnStatusCode: false
  });
};

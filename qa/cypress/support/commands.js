
// Esse comando serve para gerar dados dinâmicos de usuário para os testes
Cypress.Commands.add("generateUserData", () => {

  // Gera um número aleatório de 0 a 9999
  const random = Math.floor(Math.random() * 10000);

  // Lista de nomes válidos (sem caracteres especiais)
  const names = ["regina", "ana", "paula", "lucas", "marcos", "joao"];

  // Lista de cidades disponíveis para preenchimento do formulário
  const cities = ["rio de janeiro", "niteroi", "duque de caxias", "petropolis"];

  // Lista de nomes com caracteres especiais
  const specialNames = ["regina@#", "a$na", "p*aula", "lu+++cas", "mar!co$s", "jo&ao/"];

  // Seleciona aleatoriamente um nome válido da lista "names"
  const name = names[Math.floor(Math.random() * names.length)];

  // Seleciona aleatoriamente uma cidade da lista "cities"
  const city = cities[Math.floor(Math.random() * cities.length)];

  // Seleciona aleatoriamente um nome com caracteres especiais
  const specialName = specialNames[Math.floor(Math.random() * specialNames.length)];

  // Gera um telefone no padrão
  const phone = `21 9${Math.floor(10000000 + Math.random() * 89999999)}`;

  // Gera um email válido e único
  const email = `${name}${random}@gmail.com`;

  // Gera um email com caracteres especiais no nome
  const specialEmail = `${specialName}${random}@gmail.com`;

  // cy.wrap transforma o objeto em um comando Cypress
  return cy.wrap({
    name,          // Nome válido
    email,         // Email válido
    specialName,   // Nome com caracteres especiais
    specialEmail,  // Email com caracteres especiais
    phone,         // Telefone gerado
    city,          // Cidade selecionada
    birthDate: "2026-01-19", // Data fixa para evitar variação nos testes
  });
});



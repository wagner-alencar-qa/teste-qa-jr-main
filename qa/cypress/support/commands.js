
// Esse comando faz de formar randomica os campos NOME, EMAL, TELEFONE, CIDADE DE NASCIMENTO
  Cypress.Commands.add("generateUserData", () => {
    const random = Math.floor(Math.random() * 10000);
  
    const names = ["regina", "ana", "paula", "lucas", "marcos", "joao"];
    const cities = ["rio de janeiro", "niteroi", "duque de caxias", "petropolis"];
  
    const name = names[Math.floor(Math.random() * names.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
  
    const phone = `21 9${Math.floor(10000000 + Math.random() * 89999999)}`;
    const email = `${name}${random}@gmail.com`;
  
    return {
      name,
      email,
      phone,
      city,
      birthDate: "2026-01-19"
    };
  });
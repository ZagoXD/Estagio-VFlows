# Cadastro de Fornecedor/Produto

## Autor

Gustavo Luiz Conceição Zago

## Descrição

Esta é uma página web para o cadastro de novos fornecedores, desenvolvida utilizando HTML, CSS, JavaScript, Bootstrap e jQuery. A página permite a inserção de dados do fornecedor, produtos oferecidos e anexos relevantes.

## Requisitos

Para executar este projeto, você precisará ter os seguintes softwares instalados:

- [Node.js](https://nodejs.org/en/)
- Um servidor web para servir os arquivos HTML (pode ser o Live Server no VS Code, por exemplo)
- Conexão com a Internet para carregar as dependências do Bootstrap e jQuery

## Instalação

1. Clone o repositório:
    ```sh
    git clone https://github.com/ZagoXD/Estagio-VFlows.git
    ```
2. Navegue até o diretório do projeto:
    ```sh
    cd Estagio-VFlows
    ```
3. Abra o arquivo `index.html` no seu navegador ou utilize uma extensão como o Live Server no VS Code para servir o projeto.

## Uso

- Abra o formulário de cadastro de fornecedor.
- Preencha os campos obrigatórios com os dados do fornecedor.
- Adicione os produtos oferecidos pelo fornecedor.
- Anexe os documentos necessários.
- Clique em "Salvar Fornecedor" para enviar os dados.

## Funcionalidades

- **Cadastro de Fornecedor:** Formulário para inserir dados do fornecedor.
- **Cadastro de Produtos:** Possibilidade de adicionar múltiplos produtos oferecidos pelo fornecedor.
- **Anexos:** Adição de arquivos anexos ao cadastro do fornecedor.
- **Validação de CEP:** Busca automática de endereço através da API ViaCEP ao inserir o CEP.
- **Formato de Telefone:** Formatação automática do campo de telefone.
- **Mensagens de Alerta:** Exibição de mensagens de alerta para feedback do usuário.

## Dependências

- [Bootstrap 4.5.2](https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css)
- [jQuery 3.5.1](https://code.jquery.com/jquery-3.5.1.min.js)
- [Bootstrap JS 4.5.2](https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js)
- [ViaCEP API](https://viacep.com.br/)

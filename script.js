$(document).ready(() => {
    // Função para garantir que apenas números sejam inseridos nos campos CEP e Número
    $('#cep, #numero').on('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });

    // Função para formatar o número de telefone e limitar os caracteres
    function formatarNumeroTelefone(input) {
        var numero = input.value.replace(/\D/g, '');

        if (numero.length > 0) {
            numero = '(' + numero.substring(0, 2) + ') ' + numero.substring(2);
        }
        if (numero.length > 10) {
            numero = numero.substring(0, 10) + '-' + numero.substring(10);
        }
        if (numero.length > 15) {
            numero = numero.substring(0, 15);
        }

        input.value = numero;
    }

    // Aplica a formatação no campo de telefone ao digitar
    $('#telefone').on('input', function() {
        formatarNumeroTelefone(this);
    });

    // Função para mostrar mensagem de alerta
    function mostrarAlerta(tipo, mensagem, destino) {
        const alertHtml = `<div class="alert alert-${tipo}" role="alert">${mensagem}</div>`;
        $(destino).append(alertHtml);

        setTimeout(() => {
            $(destino).find('.alert').remove();
        }, 5000); // Remove o alerta após 5 segundos
    }

    // Função para buscar dados do endereço pelo CEP
    $('#cep').on('blur', function() {
        const cep = $(this).val().replace(/\D/g, '');
        if (cep) {
            const validacep = /^[0-9]{8}$/;
            if (validacep.test(cep)) {
                $.getJSON(`https://viacep.com.br/ws/${cep}/json/`, function(dados) {
                    if (!("erro" in dados)) {
                        $('#rua').val(dados.logradouro);
                        $('#bairro').val(dados.bairro);
                        $('#municipio').val(dados.localidade);
                        $('#estado').val(dados.uf);
                    } else {
                        mostrarAlerta('warning', 'CEP não encontrado.', '#cep').parent();
                    }
                });
            } else {
                mostrarAlerta('danger', 'Formato de CEP inválido.', '#cep').parent();
            }
        }
    });

    // Função para processar o envio do formulário
    $('#formCadastro').on('submit', function(event) {
        event.preventDefault();

        // Verifica se há pelo menos um produto no container
        const produtos = [];
        let produtosValidos = true; // Variável para verificar se todos os produtos são válidos

        $('#produtosContainer .product-box').each(function() {
            const descricaoProduto = $(this).find('input[id^="produtoNome"]').val();
            const unidadeMedida = $(this).find('select[id^="produtoUnidade"]').val();
            const qtdeEstoque = $(this).find('input[id^="produtoQtd"]').val();
            const valorUnitario = $(this).find('input[id^="produtoValor"]').val();

            if (!descricaoProduto || !unidadeMedida || !qtdeEstoque || !valorUnitario) {
                produtosValidos = false;
                mostrarAlerta('danger', 'Todos os campos de Produto são obrigatórios.', $(this).find('.alert-container'));
            } else {
                const valorTotal = $(this).find('input[id^="produtoTotal"]').val();
                produtos.push({
                    indice: produtos.length + 1,
                    descricaoProduto,
                    unidadeMedida,
                    qtdeEstoque,
                    valorUnitario,
                    valorTotal
                });
            }
        });

        // Verifica se há pelo menos um anexo na tabela
        const anexos = [];
        $('#tabelaAnexos tr').each(function(index) {
            const nomeArquivo = $(this).find('td:nth-child(2)').text();
            const fileBlob = $(this).data('fileBlob'); // Pega o blob do arquivo salvo anteriormente
            if (nomeArquivo && fileBlob) {
                anexos.push({
                    indice: index + 1,
                    nomeArquivo,
                    blobArquivo: fileBlob // Blob do arquivo
                });
            }
        });

        if (produtos.length === 0) {
            mostrarAlerta('danger', 'Por favor, adicione pelo menos um produto.', '#produtosContainer');
            return;
        }

        if (!produtosValidos) {
            return; // Se algum produto for inválido, interrompe o envio do formulário
        }

        if (anexos.length === 0) {
            mostrarAlerta('danger', 'Por favor, adicione pelo menos um anexo.', '#tabelaAnexos');
            return;
        }

        // Mostrar o modal de carregamento e adicionar a classe 'd-flex'
        $('.loading-modal').addClass('d-flex').show();

        // Simula um carregamento de 2 segundos antes de enviar os dados e mostrar o alerta de sucesso
        setTimeout(() => {
            enviarDados(produtos, anexos);
            // Remover a classe 'd-flex' e esconder o modal de carregamento
            $('.loading-modal').removeClass('d-flex').hide();
        }, 2000);
    });

    // Função para adicionar uma nova div de produto
    $('#addProduto').on('click', function() {
        const produtoCount = $('#produtosContainer .product-box').length + 1;
        addProduto(produtoCount);
    });

    // Função para adicionar produto
    function addProduto(id) {
        const newProduto = `
            <div class="product-box" id="produto-${id}">
                <button type="button" class="delete-btn" onclick="removeProduto(${id})">
                    <img src="assets/img/del.png" alt="Excluir">
                </button>
                <h4>Produto - ${id}</h4>
                <div class="form-row">
                    <div class="form-group col-md-1 d-flex align-items-center">
                        <img src="assets/img/item.png" alt="Produto" class="product-icon">
                    </div>
                    <div class="form-group col-md-11">
                        <label for="produtoNome-${id}">Produto</label>
                        <input type="text" class="form-control" id="produtoNome-${id}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-3">
                        <label for="produtoUnidade-${id}">UND. Medida</label>
                        <select class="form-control" id="produtoUnidade-${id}" required>
                            <option value="">Selecione</option>
                            <option value="unidade">Unidade</option>
                            <option value="kg">Kg</option>
                            <option value="litro">Litro</option>
                        </select>
                    </div>
                    <div class="form-group col-md-3">
                        <label for="produtoQtd-${id}">QTD. em Estoque</label>
                        <input type="number" class="form-control" id="produtoQtd-${id}" required>
                    </div>
                    <div class="form-group col-md-3">
                        <label for="produtoValor-${id}">Valor Unitário</label>
                        <input type="number" class="form-control" id="produtoValor-${id}" step="0.01" required>
                    </div>
                    <div class="form-group col-md-3">
                        <label for="produtoTotal-${id}">Valor Total</label>
                        <input type="number" class="form-control" id="produtoTotal-${id}" readonly>
                    </div>
                </div>
                <div class="alert-container"></div>
            </div>`;
        $('#produtosContainer').append(newProduto);
    }

    // Função para remover um produto
    window.removeProduto = function(id) {
        $(`#produto-${id}`).remove();
        renumberProdutos();
    };

    // Função para renumerar os produtos
    function renumberProdutos() {
        let count = 1;
        $('#produtosContainer .product-box').each(function() {
            $(this).attr('id', `produto-${count}`);
            $(this).find('h4').text(`Produto - ${count}`);
            $(this).find('.form-control').each(function() {
                const oldId = $(this).attr('id');
                const newId = oldId.replace(/-\d+$/, `-${count}`);
                $(this).attr('id', newId);
            });
            $(this).find('label').each(function() {
                const oldFor = $(this).attr('for');
                const newFor = oldFor.replace(/-\d+$/, `-${count}`);
                $(this).attr('for', newFor);
            });
            $(this).find('.delete-btn').attr('onclick', `removeProduto(${count})`);
            count++;
        });
    }

    // Função para calcular o valor total do produto
    $(document).on('input', '#produtosContainer .form-control', function() {
        const id = $(this).closest('.product-box').attr('id').split('-')[1];
        const qtdeEstoque = $(`#produtoQtd-${id}`).val();
        const valorUnitario = $(`#produtoValor-${id}`).val();
        const valorTotal = qtdeEstoque * valorUnitario;
        $(`#produtoTotal-${id}`).val(valorTotal.toFixed(2));
    });

    // Função para adicionar um novo anexo na tabela
    $('#addAnexo').on('click', function() {
        $('#fileInput').click();
    });

    $('#fileInput').on('change', function() {
        const fileInput = $(this);
        const file = fileInput[0].files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const blob = e.target.result;
                const newRow = `<tr data-file-blob="${blob}">
                    <td class="table-actions">
                        <button type="button" class="btn btn-danger btn-sm removerAnexo">
                            <img src="assets/img/del.png" alt="Excluir">
                        </button>
                        <button type="button" class="btn btn-primary btn-sm downloadAnexo">
                            <img src="assets/img/view.png" alt="View">
                        </button>
                    </td>
                    <td>${file.name}</td>
                </tr>`;
                $('#tabelaAnexos').append(newRow);
            };
            reader.readAsDataURL(file); // Converte o arquivo em uma URL de dados
        }
    });

    // Função para remover uma linha de anexo da tabela
    $(document).on('click', '.removerAnexo', function() {
        $(this).closest('tr').remove();
    });

    // Função para baixar um anexo
    $(document).on('click', '.downloadAnexo', function() {
        const fileName = $(this).closest('tr').find('td:last').text();
        const fileBlob = $(this).closest('tr').data('fileBlob');
        const link = document.createElement('a');
        link.href = fileBlob;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Função para enviar os dados
    function enviarDados(produtos, anexos) {
        const dados = {
            razaoSocial: $('#razaoSocial').val(),
            nomeFantasia: $('#nomeFantasia').val(),
            cnpj: $('#cnpj').val(),
            inscricaoEstadual: $('#inscricaoEstadual').val(),
            inscricaoMunicipal: $('#inscricaoMunicipal').val(),
            nomeContato: $('#nomeContato').val(),
            telefoneContato: $('#telefone').val(),
            emailContato: $('#email').val(),
            produtos,
            anexos
        };

        console.log(JSON.stringify(dados, null, 2));

        // Ocultar o modal de carregamento e exibir alerta de sucesso
        $('.loading-modal').hide();

        // Exibir alerta de sucesso
        mostrarAlerta('success', 'Fornecedor Adicionado com sucesso!', '.container');

        // Resetar o formulário
        $('#formCadastro')[0].reset();

        // Limpar os produtos e anexos
        $('#produtosContainer').empty();
        $('#tabelaAnexos').empty();
    }
});
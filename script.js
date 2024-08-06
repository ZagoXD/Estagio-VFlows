$(document).ready(() => {
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
                        alert("CEP não encontrado.");
                    }
                });
            } else {
                alert("Formato de CEP inválido.");
            }
        }
    });

    // Função para processar o envio do formulário
    $('#formCadastro').on('submit', function(event) {
        event.preventDefault();
        $('.loading-modal').show();

        // Verifica se há pelo menos um produto na tabela
        const produtos = [];
        $('#tabelaProdutos tr').each(function() {
            const descricaoProduto = $(this).find('.descricaoProduto').val();
            if (descricaoProduto) {  // Verifica se o campo não está vazio
                const unidadeMedida = $(this).find('.unidadeMedida').val();
                const qtdeEstoque = $(this).find('.qtdeEstoque').val();
                const valorUnitario = $(this).find('.valorUnitario').val();
                const valorTotal = $(this).find('.valorTotal').val();
                produtos.push({
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
        const fileInputs = $('#tabelaAnexos .anexoArquivo');
        fileInputs.each(function() {
            const arquivoInput = $(this)[0];
            if (arquivoInput.files.length > 0) {
                const file = arquivoInput.files[0];
                anexos.push({
                    nomeArquivo: file.name,
                    blobArquivo: file // Mudança aqui: armazena o próprio arquivo em vez de base64
                });
            }
        });

        if (produtos.length === 0) {
            $('.loading-modal').hide();
            alert('Por favor, adicione pelo menos um produto.');
            return;
        }

        if (anexos.length === 0) {
            $('.loading-modal').hide();
            alert('Por favor, adicione pelo menos um anexo.');
            return;
        }

        // Se ambos são válidos, enviar dados
        enviarDados(produtos, anexos);
    });

    // Função para adicionar uma nova linha de produto na tabela
    $('#addProduto').on('click', function() {
        const newRow = `<tr>
            <td><input type="text" class="form-control descricaoProduto" required></td>
            <td><input type="text" class="form-control unidadeMedida" required></td>
            <td><input type="number" class="form-control qtdeEstoque" required></td>
            <td><input type="number" class="form-control valorUnitario" step="0.01" required></td>
            <td><input type="number" class="form-control valorTotal" readonly></td>
        </tr>`;
        $('#tabelaProdutos').append(newRow);
    });

    // Função para adicionar uma nova linha de anexo na tabela
    $('#addAnexo').on('click', function() {
        const newRow = `<tr>
            <td><input type="file" class="form-control-file anexoArquivo" required></td>
            <td>
                <button type="button" class="btn btn-danger btn-sm removerAnexo">Excluir</button>
                <button type="button" class="btn btn-primary btn-sm visualizarAnexo">Visualizar</button>
            </td>
        </tr>`;
        $('#tabelaAnexos').append(newRow);
    });

    // Função para remover uma linha de anexo da tabela
    $(document).on('click', '.removerAnexo', function() {
        $(this).closest('tr').remove();
    });

    // Função para visualizar um anexo
    $(document).on('click', '.visualizarAnexo', function() {
        const arquivoInput = $(this).closest('tr').find('.anexoArquivo')[0];
        if (arquivoInput.files.length > 0) {
            const file = arquivoInput.files[0];
            const url = URL.createObjectURL(file);
            window.open(url);
        }
    });

    // Função para calcular o valor total do produto
    $(document).on('input', '.valorUnitario, .qtdeEstoque', function() {
        const row = $(this).closest('tr');
        const qtdeEstoque = row.find('.qtdeEstoque').val();
        const valorUnitario = row.find('.valorUnitario').val();
        const valorTotal = qtdeEstoque * valorUnitario;
        row.find('.valorTotal').val(valorTotal.toFixed(2));
    });

    // Função para enviar os dados
    function enviarDados(produtos, anexos) {
        const dados = {
            razaoSocial: $('#razaoSocial').val(),
            nomeFantasia: $('#nomeFantasia').val(),
            cnpj: $('#cnpj').val(),
            inscricaoEstadual: $('#inscricaoEstadual').val(),
            inscricaoMunicipal: $('#inscricaoMunicipal').val(),
            cep: $('#cep').val(),
            rua: $('#rua').val(),
            numero: $('#numero').val(),
            complemento: $('#complemento').val(),
            bairro: $('#bairro').val(),
            municipio: $('#municipio').val(),
            estado: $('#estado').val(),
            nomeContato: $('#nomeContato').val(),
            telefone: $('#telefone').val(),
            email: $('#email').val(),
            produtos,
            anexos
        };

        console.log(JSON.stringify(dados, null, 2));

    }
});
$(document).ready(() => {
    $('#cep').on('blur', function() {
        const cep = $(this).val().replace(/\D/g, '');
        if (cep) {
            const validacep = /^[0-9]{8}$/;
            if(validacep.test(cep)) {
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

    $('#formCadastro').on('submit', function(event) {
        event.preventDefault();
        $('.loading-modal').show();

        const produtos = [];
        $('#tabelaProdutos tr').each(function(index) {
            const descricaoProduto = $(this).find('.descricaoProduto').val();
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
        });

        const anexos = [];
        const fileInputs = $('#tabelaAnexos .anexoArquivo');
        if (fileInputs.length > 0) {
            fileInputs.each(function(index) {
                const arquivoInput = $(this)[0];
                if (arquivoInput.files.length > 0) {
                    const file = arquivoInput.files[0];
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const blobArquivo = e.target.result;
                        anexos.push({
                            indice: index + 1,
                            nomeArquivo: file.name,
                            blobArquivo
                        });

                        if (anexos.length === fileInputs.length) {
                            enviarDados(produtos, anexos);
                        }
                    };
                    reader.readAsDataURL(file);
                } else if (anexos.length === fileInputs.length - 1) {
                    enviarDados(produtos, anexos);
                }
            });
        } else {
            enviarDados(produtos, anexos);
        }
    });

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

    $(document).on('click', '.removerAnexo', function() {
        $(this).closest('tr').remove();
    });

    $(document).on('click', '.visualizarAnexo', function() {
        const arquivoInput = $(this).closest('tr').find('.anexoArquivo')[0];
        if (arquivoInput.files.length > 0) {
            const file = arquivoInput.files[0];
            const url = URL.createObjectURL(file);
            window.open(url);
        }
    });

    $(document).on('input', '.valorUnitario, .qtdeEstoque', function() {
        const row = $(this).closest('tr');
        const qtdeEstoque = row.find('.qtdeEstoque').val();
        const valorUnitario = row.find('.valorUnitario').val();
        const valorTotal = qtdeEstoque * valorUnitario;
        row.find('.valorTotal').val(valorTotal.toFixed(2));
    });

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

        // Simula um atraso de 3 segundos para o modal de carregamento
        setTimeout(() => {
            $('.loading-modal').hide();
            alert('Fornecedor salvo com sucesso!');
        }, 3000);
    }
});
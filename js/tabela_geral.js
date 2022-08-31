let fii_user = [];
let fii_table = [];

async function carregarDadosUser(url){
    await fetch(url)
            .then(resp => resp.json())
            .then(json => fii_user = json);
            console.log(fii_user);
            carregarDadosFundos();
}

async function carregarDadosFundos(){
    for (fii of fii_user){
        let json = await fetch(`https://api-simple-flask.herokuapp.com/api/${fii.nome}`)
                        .then(resp => resp.json());
        fii_table.push(json);
        console.log(fii_table);
    }
    exibirTabela();
}

carregarDadosUser("json/fii.json");

function exibirTabela(){ 
    for(let table of fii_table) {
        if(table.proximoRendimento.cotaBase == "-") {
            table.proximoRendimento.cotaBase = table.ultimoRendimento.cotaBase;
        }
        if(table.proximoRendimento.dataBase == "-") {
            table.proximoRendimento.dataBase = table.ultimoRendimento.dataBase;
        }
        if(table.proximoRendimento.dataPag == "-") {
            table.proximoRendimento.dataPag = table.ultimoRendimento.dataPag;
        }
        if(table.proximoRendimento.rendimento == "-") {
            table.proximoRendimento.rendimento = table.ultimoRendimento.rendimento;
        }
    }
    let cor;
    let total_geral = 0;
    let total_qtde = 0;
    let total_invest = 0;
    let dados = `<table>`;
    fii_table.forEach((user, i) => {
        const num2 = fii_user[i];
        total_geral = total_geral + num2.qtde * user.proximoRendimento.rendimento;
        total_qtde += num2.qtde;
        total_invest += num2.totalgasto;
        if ((user.proximoRendimento.rendimento * 100 / user.valorAtual) < 0.60) {
            cor = "negativo";
        }  else {
            cor = "positivo";
        }
    dados += `<tr class=${cor}>
              <td>${num2.nome.toUpperCase()}</td>
              <td>${user.setor}</td>
              <td>${user.proximoRendimento.dataBase}</td>
              <td>${user.proximoRendimento.dataPag}</td>
              <td>R$${user.proximoRendimento.rendimento}</td>
              <td>R$${user.valorAtual}</td>
              <td>${num2.qtde}</td>
              <td>${num2.totalgasto}</td>
              <td>${(num2.totalgasto / num2.qtde).toFixed(2)}</td>
              <td>${(user.proximoRendimento.rendimento * 100 / user.valorAtual).toFixed(2)}%</td>
              <td>${user.dividendYield}%</td>
              <td>R$${user.rendimentoMedio24M.toFixed(2)}</td>
              </tr>`;
    })
    dados += `<tr class="fundo_total">
              <td></td>
              <td>Total Geral</td>
              <td></td>
              <td></td>
              <td>R$${total_geral}</td>
              <td>-</td>
              <td>${total_qtde}</td>
              <td>R$${(total_invest).toFixed(2)}</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              </tr>`;
    dados += `</table>`;
    document.querySelector("table").innerHTML += dados;
    document.querySelector("#loading").style.display = "none";
}

/* INTEGRANTES
NOME: IGOR BONUZZI FORTI
RGM: 27562735

NOME: RAUL BONUZZI FORTI
RGM: 27563014
*/

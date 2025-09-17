// Função para calcular a média de um array de números
function calcularMedia(numeros) {
    if (!Array.isArray(numeros) || numeros.length === 0) {
        throw new Error("Por favor, forneça um array de números não vazio.");
    }

    const soma = numeros.reduce((acumulador, numero) => acumulador + numero, 0);
    return soma / numeros.length;
}

// Exemplo de uso
const numeros = [10, 20, 30, 40];
const media = calcularMedia(numeros);
console.log(`A média é: ${media}`);

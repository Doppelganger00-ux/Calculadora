// Seleciona o display da calculadora
const result = document.querySelector(".result");
// Seleciona todos os botões
const buttons = document.querySelectorAll(".buttons button");

// Variáveis para gerenciar o estado da calculadora
let currentNumber = ""; // Número atualmente exibido no display
let firstOperand = null; // Primeiro número da operação
let operator = null; // Operador da operação atual (+, -, ×, ÷)
let restart = false; // Indica se um novo número substituirá o atual

// Atualiza o display da calculadora
const updateResult = (clear = false) => 
  (result.innerText = clear ? 0 : currentNumber.replace(".", ",")); // Mostra 0 ou o número atual

// Adiciona dígitos ou vírgula ao número atual
const addDigit = (digit) => {
  if (digit === "," && (currentNumber.includes(",") || !currentNumber)) return; // Evita múltiplas vírgulas
  currentNumber = restart ? digit : currentNumber + digit; // Substitui ou adiciona ao número atual
  restart = false; // Reinício desativado ao adicionar dígito
  updateResult(); // Atualiza o display
};

// Define o operador e prepara para o próximo número
const setOperator = (op) => {
  if (currentNumber) calculate(); // Calcula se já há operação pendente
  firstOperand = parseFloat(currentNumber.replace(",", ".")); // Salva o primeiro número
  operator = op; // Define o operador
  currentNumber = ""; // Reseta o número atual
};

// Realiza o cálculo entre os dois números
const calculate = () => {
  if (!operator || firstOperand === null) return; // Retorna se não houver cálculo pendente
  const secondOperand = parseFloat(currentNumber.replace(",", ".")); // Converte o número atual para número
  // Realiza a operação correspondente
  const operations = {
    "+": firstOperand + secondOperand,
    "-": firstOperand - secondOperand,
    "×": firstOperand * secondOperand,
    "÷": firstOperand / secondOperand,
  };
  currentNumber = (operations[operator] ?? "").toString(); // Calcula e converte o resultado para string

  // Remove zeros desnecessários do final e ajusta casas decimais
  currentNumber = currentNumber.includes(".")
    ? parseFloat(currentNumber).toFixed(5).replace(/0+$/, "").replace(/\.$/, "")
    : currentNumber;

  operator = firstOperand = null; // Reseta operador e primeiro número
  restart = true; // Indica que o próximo número substituirá o atual
  updateResult(); // Atualiza o display com o resultado
};

// Limpa a calculadora
const clearCalculator = () => {
  currentNumber = ""; // Zera o número atual
  firstOperand = operator = null; // Reseta variáveis de estado
  updateResult(true); // Atualiza o display para 0
};

// Calcula a porcentagem
const setPercentage = () => {
  // Calcula o número como porcentagem; ajusta para operações de + ou -
  currentNumber = (
    (parseFloat(currentNumber) / 100) *
    (["+", "-"].includes(operator) ? firstOperand || 1 : 1)
  ).toString();
  updateResult(); // Atualiza o display
};

// Alterna o sinal do número atual
const toggleSign = () => {
  currentNumber = (parseFloat(currentNumber || firstOperand || 0) * -1).toString(); // Inverte o número
  updateResult(); // Atualiza o display
};

// Processa cliques nos botões
buttons.forEach((button) =>
  button.addEventListener("click", () => {
    const actions = {
      C: clearCalculator, // Limpa a calculadora
      "±": toggleSign, // Alterna sinal
      "%": setPercentage, // Calcula porcentagem
      "=": calculate, // Realiza o cálculo
    };
    const buttonText = button.innerText; // Obtém o texto do botão clicado
    if (/^[0-9,]$/.test(buttonText)) addDigit(buttonText); // Verifica se é número ou vírgula
    else if (["+", "-", "×", "÷"].includes(buttonText)) setOperator(buttonText); // Verifica se é operador
    else actions[buttonText]?.(); // Executa a ação correspondente ao botão
  })
);

// Processa entrada pelo teclado
document.addEventListener("keydown", (e) => {
  const keyMap = { "+": "+", "-": "-", "*": "×", "/": "÷", Enter: "=", Escape: "C", Backspace: "Backspace", "%": "%" };
  if (!isNaN(e.key)) addDigit(e.key); // Adiciona número
  else if (["+", "-", "*", "/"].includes(e.key)) setOperator(keyMap[e.key]); // Define operador
  else if (e.key === "Enter" || e.key === "=") calculate(); // Calcula
  else if (e.key === "Escape") clearCalculator(); // Limpa
  else if (e.key === "%") setPercentage(); // Calcula porcentagem
  else if (e.key === "Backspace") {
    currentNumber = currentNumber.slice(0, -1); // Remove o último dígito
    updateResult(); // Atualiza o display
  } else if (e.key === ".") addDigit(","); // Adiciona vírgula
});

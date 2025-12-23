// --- Lógica de Abas ---
function openTab(tabName, btnElement) {
  // Esconde todos os conteúdos
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.add("hidden");
  });

  // Reseta estilo de todos os botões
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("bg-orange-500", "text-white", "shadow-md");
    btn.classList.add("bg-gray-200", "text-gray-600");
  });

  // Mostra o conteúdo selecionado e ativa o botão
  document.getElementById(tabName).classList.remove("hidden");

  // Ativa o botão clicado
  btnElement.classList.remove("bg-gray-200", "text-gray-600");
  btnElement.classList.add("bg-orange-500", "text-white", "shadow-md");
}

// --- Calculadora Padrão ---
let display = document.getElementById("display");

function appendToDisplay(value) {
  if (display.innerText === "0" || display.innerText === "Erro") {
    display.innerText = value;
  } else {
    display.innerText += value;
  }
}

function clearDisplay() {
  display.innerText = "0";
}

function calculate() {
  try {
    display.innerText = eval(display.innerText);
  } catch {
    display.innerText = "Erro";
  }
}

// --- Conversor de Moedas ---
async function convertCurrency() {
  const amount = parseFloat(document.getElementById("amount").value);
  const from = document.getElementById("currency-from").value;
  const to = document.getElementById("currency-to").value;
  const resultDiv = document.getElementById("currency-result");

  if (isNaN(amount)) {
    resultDiv.innerText = "Por favor, insira um valor válido.";
    return;
  }

  resultDiv.innerText = "Buscando cotação atualizada...";

  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${from}`
    );
    const data = await response.json();
    const rate = data.rates[to];
    const finalVal = amount * rate;

    resultDiv.innerText = `${amount} ${from} = ${finalVal.toFixed(2)} ${to}`;
  } catch (error) {
    console.error("Erro ao buscar cotação:", error);
    resultDiv.innerText = "Erro de conexão. Verifique sua internet.";
  }
}

// --- Calculadora CLT 2024 (Simplificada) ---
function calculateCLT() {
  const salary = parseFloat(document.getElementById("salary").value);
  const dependents = parseInt(document.getElementById("dependents").value) || 0;
  const resultDiv = document.getElementById("clt-result");

  if (isNaN(salary)) {
    resultDiv.innerText = "Insira o salário bruto.";
    return;
  }

  // 1. Cálculo INSS (Progressivo 2024)
  let inss = 0;
  if (salary <= 1412.0) inss = salary * 0.075;
  else if (salary <= 2666.68) inss = 1412 * 0.075 + (salary - 1412) * 0.09;
  else if (salary <= 4000.03)
    inss = 1412 * 0.075 + (2666.68 - 1412) * 0.09 + (salary - 2666.68) * 0.12;
  else if (salary <= 7786.02)
    inss =
      1412 * 0.075 +
      (2666.68 - 1412) * 0.09 +
      (4000.03 - 2666.68) * 0.12 +
      (salary - 4000.03) * 0.14;
  else inss = 908.85; // Teto

  // 2. Base IRRF
  const deductionPerDependent = 189.59 * dependents;
  const baseIRRF = salary - inss - deductionPerDependent;

  // 3. Cálculo IRRF
  let irrf = 0;
  if (baseIRRF <= 2259.2) irrf = 0;
  else if (baseIRRF <= 2826.65) irrf = baseIRRF * 0.075 - 169.44;
  else if (baseIRRF <= 3751.05) irrf = baseIRRF * 0.15 - 381.44;
  else if (baseIRRF <= 4664.68) irrf = baseIRRF * 0.225 - 662.77;
  else irrf = baseIRRF * 0.275 - 896.0;

  if (irrf < 0) irrf = 0;

  const netSalary = salary - inss - irrf;

  resultDiv.innerHTML = `
    <strong>Salário Bruto:</strong> R$ ${salary.toFixed(2)}<br>
    <strong>Desconto INSS:</strong> R$ ${inss.toFixed(2)}<br>
    <strong>Desconto IRRF:</strong> R$ ${irrf.toFixed(2)}<br>
    <strong>Salário Líquido:</strong> R$ ${netSalary.toFixed(2)}
  `;
}

// --- Calculadora Financeira (Juros Compostos) ---
function calculateCompound() {
  const P = parseFloat(document.getElementById("principal").value);
  const i = parseFloat(document.getElementById("rate").value) / 100;
  const t = parseFloat(document.getElementById("time").value);
  const resultDiv = document.getElementById("financial-result");

  if (isNaN(P) || isNaN(i) || isNaN(t)) {
    resultDiv.innerText = "Preencha todos os campos.";
    return;
  }

  const M = P * Math.pow(1 + i, t);
  const interest = M - P;

  resultDiv.innerHTML = `
    <strong>Total Final:</strong> R$ ${M.toFixed(2)}<br>
    <strong>Total Investido:</strong> R$ ${P.toFixed(2)}<br>
    <strong>Total em Juros:</strong> R$ ${interest.toFixed(2)}
  `;
}

// --- Modals (Política, Termos, etc) ---
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden"; // Previne rolagem do fundo
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "auto"; // Restaura rolagem
  }
}

// --- Compartilhamento WhatsApp ---
function shareOnWhatsApp(toolName) {
  const url = "https://calc-lucdev.netlify.app/";
  let message = "";

  switch (toolName) {
    case "padrao":
      message = `Confira esta Calculadora Online Gratuita e Simples: ${url}`;
      break;
    case "moedas":
      message = `Veja quanto vale seu dinheiro com este Conversor de Moedas: ${url}`;
      break;
    case "clt":
      message = `Calcule seu Salário Líquido 2024 com esta calculadora CLT: ${url}`;
      break;
    case "financeira":
      message = `Simule seus investimentos com esta Calculadora de Juros Compostos: ${url}`;
      break;
    default:
      message = `Ferramentas Financeiras e Trabalhistas Gratuitas: ${url}`;
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
}

// --- Copiar Resultado ---
function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    navigator.clipboard
      .writeText(element.innerText)
      .then(() => {
        alert("Resultado copiado para a área de transferência!");
      })
      .catch((err) => {
        console.error("Erro ao copiar: ", err);
      });
  }
}

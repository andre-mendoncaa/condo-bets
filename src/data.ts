import { Cliente, Produto, Venda, Despesa } from './types';

export const clientes: Cliente[] = [
  {
    id: '1',
    nome: 'João Silva',
    telefone: '(11) 98765-4321',
    email: 'joao@email.com',
    moto: 'Harley-Davidson Sportster'
  }
];

export const produtos: Produto[] = [
  {
    id: '1',
    nome: 'Guidão Ape Hanger',
    descricao: 'Guidão alto estilo ape hanger 12"',
    preco: 799.90,
    quantidade: 5,
    minimo: 2
  },
  {
    id: '2',
    nome: 'Banco Solo Spring',
    descricao: 'Banco solo com molas aparentes',
    preco: 459.90,
    quantidade: 3,
    minimo: 1
  }
];

export const vendas: Venda[] = [];
export const despesas: Despesa[] = [];

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  moto?: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  minimo: number;
}

export interface Venda {
  id: string;
  clienteId: string;
  data: string;
  itens: {
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
  }[];
  total: number;
}

export interface Despesa {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  categoria: 'Fornecedor' | 'Funcionários' | 'Aluguel' | 'Outros';
}

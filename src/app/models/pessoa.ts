
export interface Endereco {
  idPessoa?: number;
  cep: string;
  numero: string;
  complemento: string;
}

export interface Pessoa {
  idPessoa?: number;
  nome: string;
  CPF: number;
  dataNascimento: string;
  sexo: string;
  email: string;
  telefone: number;
  ativoPessoa: string;
  enderecos: Endereco[];
}

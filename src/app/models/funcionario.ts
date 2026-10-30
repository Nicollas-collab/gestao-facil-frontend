export interface Endereco {
  idendereco?: number;
  cep: string;
  numero: number;
  complemento: string;
}

export interface Funcionario {
  idpessoa: number;
  nome: string;
  cpf: number;
  dataNascimento: string;
  sexo: string;
  email: string;
  telefone: number;
  ativoPessoa: string;
  cargo: string;
  dataAdmissao: string;
  enderecos: Endereco[];
}

export interface FuncionarioCriarDTO {
  nome: string;
  cpf: number;
  dataNascimento: string;
  sexo: string;
  email: string;
  telefone: number;
  ativoPessoa: string;
  cargo: string;
  dataAdmissao: string;
  enderecos: Endereco[];
}

export interface FuncionarioAtualizarDTO {
  nome: string;
  cpf: number;
  dataNascimento: string;
  sexo: string;
  email: string;
  telefone: number;
  ativoPessoa: string;
  cargo: string;
  dataAdmissao: string;
  enderecos: Endereco[];
}
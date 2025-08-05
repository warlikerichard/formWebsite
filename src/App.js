import React, { useState } from 'react';
import * as yup from 'yup';
import { IMaskInput } from 'react-imask';
import './App.css';

// Schema de validação com Yup
const validationSchema = yup.object().shape({
  nome: yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  email: yup
    .string()
    .required('E-mail é obrigatório')
    .email('E-mail deve ser válido'),
  telefone: yup
    .string()
    .required('Telefone é obrigatório')
    .matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone deve estar no formato (00) 00000-0000'),
  senha: yup
    .string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'
    ),
  confirmarSenha: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('senha'), null], 'Senhas devem ser iguais')
});

function App() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: ''
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      telefone: value
    }));
    
    // Limpar erro quando o usuário começar a digitar
    if (errors.telefone) {
      setErrors(prev => ({
        ...prev,
        telefone: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validar dados do formulário com Yup
      await validationSchema.validate(formData, { abortEarly: false });
      
      // Se a validação passou, prosseguir com o envio
      console.log('Form data:', formData);
      setShowSuccess(true);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        senha: '',
        confirmarSenha: ''
      });
      setErrors({});
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (validationErrors) {
      // Converter erros do Yup para o formato do estado de erro
      const newErrors = {};
      validationErrors.inner.forEach(error => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="form-container">
          <h1>Cadastro de Usuário</h1>
          
          {showSuccess && (
            <div className="success-message">
              <p>✅ Cadastro realizado com sucesso!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-group">
              <label htmlFor="nome">Nome *</label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Digite seu nome completo"
                className={errors.nome ? 'error' : ''}
              />
              {errors.nome && <span className="error-message">{errors.nome}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite seu e-mail"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="telefone">Telefone *</label>
              <IMaskInput
                mask="(00) 00000-0000"
                id="telefone"
                name="telefone"
                type="tel"
                value={formData.telefone}
                onAccept={handlePhoneChange}
                placeholder="(00) 00000-0000"
                className={errors.telefone ? 'error' : ''}
              />
              {errors.telefone && <span className="error-message">{errors.telefone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="senha">Senha *</label>
              <input
                id="senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Digite sua senha"
                className={errors.senha ? 'error' : ''}
              />
              {errors.senha && <span className="error-message">{errors.senha}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmarSenha">Confirmar Senha *</label>
              <input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                value={formData.confirmarSenha}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                className={errors.confirmarSenha ? 'error' : ''}
              />
              {errors.confirmarSenha && <span className="error-message">{errors.confirmarSenha}</span>}
            </div>

            <button type="submit" className="submit-btn">
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
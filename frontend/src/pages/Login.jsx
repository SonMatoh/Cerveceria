import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Container, Card, Button } from 'react-bootstrap';

import FormField from '../components/molecules/FormField.jsx';
import Input from '../components/atoms/Input.jsx';
import { iniciarSesion, autenticar } from '../data/Products.js';

const PATRON_CORREO = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

export function Login() {
  const navigate = useNavigate();
  const [errorLogin, setErrorLogin] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const onSubmit = (data) => {
    setErrorLogin('');

    const usuario = autenticar(data.email, data.password);
    if (!usuario) {
      setErrorLogin('Email o contraseña incorrectos.');
      return;
    }

    iniciarSesion({ nombre: usuario.nombre, email: usuario.email, rol: usuario.rol });
    if (window.actualizarNavbar) {
      window.actualizarNavbar();
    }
    navigate('/');
  };

  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h1 className="h4 mb-4 text-center">Iniciar sesión</h1>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {errorLogin && (
                  <div className="alert alert-danger py-2" role="alert">
                    {errorLogin}
                  </div>
                )}

                <FormField htmlFor="login-email" label="Email" error={errors.email?.message}>
                  <Input
                    id="login-email"
                    type="email"
                    className={errors.email ? 'is-invalid' : ''}
                    {...register('email', {
                      required:
                        'Correo inválido. Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.',
                      pattern: {
                        value: PATRON_CORREO,
                        message:
                          'Correo inválido. Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.',
                      },
                    })}
                  />
                </FormField>

                <FormField
                  htmlFor="login-pass"
                  label="Contraseña"
                  error={errors.password?.message}
                >
                  <Input
                    id="login-pass"
                    type="password"
                    className={errors.password ? 'is-invalid' : ''}
                    {...register('password', {
                      required: 'La contraseña debe tener entre 4 y 10 caracteres.',
                      minLength: {
                        value: 4,
                        message: 'La contraseña debe tener entre 4 y 10 caracteres.',
                      },
                      maxLength: {
                        value: 10,
                        message: 'La contraseña debe tener entre 4 y 10 caracteres.',
                      },
                    })}
                  />
                </FormField>

                <Button type="submit" variant="primary" className="w-100">
                  Entrar
                </Button>
              </form>

              <p className="small text-secondary text-center mt-3 mb-0">
                Socios: <strong>cliente@duoc.cl</strong> / <strong>cliente123</strong>
                <br />
                Admin: <strong>admin@duoc.cl</strong> / <strong>admin123</strong>
              </p>

              <p className="small text-center text-secondary mt-2 mb-0">
                ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default Login;
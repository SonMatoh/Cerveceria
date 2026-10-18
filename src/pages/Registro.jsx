import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Container, Card, Button } from 'react-bootstrap';

import FormField from '../components/molecules/FormField.jsx';
import Input from '../components/atoms/Input.jsx';
import { registrarUsuario, esMayorDeEdad } from '../data/Products.js';

const PATRON_CORREO = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

export function Registro() {
  const navigate = useNavigate();
  const [errorGeneral, setErrorGeneral] = useState('');
  const [errorPass2, setErrorPass2] = useState('');
  const [errorEdad, setErrorEdad] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: '',
      email: '',
      fechaNacimiento: '',
      password: '',
      password2: '',
    },
  });

  const onSubmit = (data) => {
    setErrorGeneral('');
    setErrorPass2('');
    setErrorEdad('');

    if (!esMayorDeEdad(data.fechaNacimiento)) {
      setErrorEdad('Debes ser mayor de 18 años para crear una cuenta.');
      return;
    }

    if (data.password !== data.password2) {
      setErrorPass2('Las contraseñas no coinciden.');
      return;
    }

    const resultado = registrarUsuario({
      nombre: data.nombre,
      email: data.email,
      password: data.password,
      fechaNacimiento: data.fechaNacimiento,
    });

    if (!resultado.ok) {
      setErrorGeneral('Este correo ya está registrado.');
      return;
    }

    navigate('/login');
  };

  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h1 className="h4 mb-4 text-center">Registrar usuario</h1>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {errorGeneral && (
                  <div className="alert alert-danger py-2" role="alert">
                    {errorGeneral}
                  </div>
                )}

                <FormField htmlFor="reg-nombre" label="Nombre" error={errors.nombre?.message}>
                  <Input
                    id="reg-nombre"
                    type="text"
                    className={errors.nombre ? 'is-invalid' : ''}
                    {...register('nombre', {
                      required: 'El nombre debe tener al menos 2 caracteres.',
                      minLength: {
                        value: 2,
                        message: 'El nombre debe tener al menos 2 caracteres.',
                      },
                    })}
                  />
                </FormField>

                <FormField htmlFor="reg-email" label="Email" error={errors.email?.message}>
                  <Input
                    id="reg-email"
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
                  htmlFor="reg-fecha"
                  label="Fecha de nacimiento"
                  error={errors.fechaNacimiento?.message || errorEdad}
                  hint="Venta exclusiva para mayores de 18 años."
                >
                  <Input
                    id="reg-fecha"
                    type="date"
                    className={errors.fechaNacimiento || errorEdad ? 'is-invalid' : ''}
                    {...register('fechaNacimiento', {
                      required: 'Debes ingresar tu fecha de nacimiento.',
                    })}
                  />
                </FormField>

                <div className="row">
                  <div className="col-sm-6">
                    <FormField
                      htmlFor="reg-pass"
                      label="Contraseña"
                      error={errors.password?.message}
                    >
                      <Input
                        id="reg-pass"
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
                  </div>
                  <div className="col-sm-6">
                    <FormField
                      htmlFor="reg-pass2"
                      label="Repetir contraseña"
                      error={errors.password2?.message || errorPass2}
                    >
                      <Input
                        id="reg-pass2"
                        type="password"
                        className={errors.password2 || errorPass2 ? 'is-invalid' : ''}
                        {...register('password2', {
                          required: 'Las contraseñas no coinciden.',
                        })}
                      />
                    </FormField>
                  </div>
                </div>

                <Button type="submit" variant="primary" className="w-100 mt-3">
                  Registrarme
                </Button>
              </form>

              <p className="small text-center text-secondary mt-3 mb-0">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default Registro;
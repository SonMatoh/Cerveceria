import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Container, Card, Button } from 'react-bootstrap';

import FormField from '../components/molecules/FormField.jsx';
import Input from '../components/atoms/Input.jsx';
import AuthService from '../services/AuthService.js';

const PATRON_CORREO = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
const PATRON_PASSWORD = /^(?=.*[A-Z])(?=.*[0-9]|.*[^A-Za-z0-9\s]).{6,100}$/;

function formatearFechaInput(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

function obtenerLimitesEdad(edadMin = 18, edadMax = 120) {
  const hoy = new Date();
  const fechaMax = new Date(hoy.getFullYear() - edadMin, hoy.getMonth(), hoy.getDate());
  const fechaMin = new Date(hoy.getFullYear() - edadMax, hoy.getMonth(), hoy.getDate());
  return {
    min: formatearFechaInput(fechaMin),
    max: formatearFechaInput(fechaMax),
  };
}

function validarFechaRegistro(fechaStr, edadMin = 18, edadMax = 120) {
  if (!fechaStr) {
    return 'Debes ingresar tu fecha de nacimiento.';
  }

  const partes = fechaStr.split('-');
  if (partes.length !== 3) {
    return 'Ingresa una fecha de nacimiento válida.';
  }

  const anio = Number(partes[0]);
  const mes = Number(partes[1]);
  const dia = Number(partes[2]);
  const hoy = new Date();

  let edad = hoy.getFullYear() - anio;
  const difMes = hoy.getMonth() + 1 - mes;
  if (difMes < 0 || (difMes === 0 && hoy.getDate() < dia)) {
    edad = edad - 1;
  }

  if (edad < edadMin) {
    return 'Debes ser mayor de 18 años para crear una cuenta.';
  }

  if (edad > edadMax) {
    return `Ingresa una fecha de nacimiento real (máximo ${edadMax} años).`;
  }

  return '';
}

export function Registro() {
  const navigate = useNavigate();
  const limitesEdad = obtenerLimitesEdad(18, 120);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [errorPass2, setErrorPass2] = useState('');
  const [errorEdad, setErrorEdad] = useState('');
  const [cargando, setCargando] = useState(false);

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

  const onSubmit = async (data) => {
    setErrorGeneral('');
    setErrorPass2('');
    setErrorEdad('');

    const mensajeEdad = validarFechaRegistro(data.fechaNacimiento, 18, 120);
    if (mensajeEdad) {
      setErrorEdad(mensajeEdad);
      return;
    }

    if (data.password !== data.password2) {
      setErrorPass2('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);
    try {
      const response = await AuthService.registro({
        nombre: data.nombre.trim(),
        email: data.email.trim(),
        password: data.password,
        fechaNacimiento: data.fechaNacimiento,
      });

      if (response?.ok === false) {
        setErrorGeneral(response.error || 'Este correo ya está registrado.');
        return;
      }

      navigate('/login');
    } catch (error) {
      const dataError = error.response?.data;

      if (dataError && dataError.campos) {
        const mensajes = Object.values(dataError.campos);
        if (mensajes.length > 0) {
          setErrorGeneral(mensajes.join(' '));
          return;
        }
      }

      setErrorGeneral(dataError?.error || 'Error al registrar usuario. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
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
                      maxLength: {
                        value: 100,
                        message: 'El nombre no puede exceder 100 caracteres.',
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
                    min={limitesEdad.min}
                    max={limitesEdad.max}
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
                      hint="Mínimo 6 caracteres, 1 mayúscula y 1 número o símbolo."
                    >
                      <Input
                        id="reg-pass"
                        type="password"
                        className={errors.password ? 'is-invalid' : ''}
                        {...register('password', {
                          required: 'La contraseña es obligatoria.',
                          minLength: {
                            value: 6,
                            message: 'La contraseña debe tener al menos 6 caracteres.',
                          },
                          maxLength: {
                            value: 100,
                            message: 'La contraseña no puede exceder 100 caracteres.',
                          },
                          pattern: {
                            value: PATRON_PASSWORD,
                            message:
                              'Debe incluir al menos 1 mayúscula y 1 número o carácter especial.',
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

                <Button type="submit" variant="primary" className="w-100 mt-3" disabled={cargando}>
                  {cargando ? 'Registrando...' : 'Registrarme'}
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
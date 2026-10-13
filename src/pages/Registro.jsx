// Registro de usuario con react-hook-form y validaciones completas.
// El usuario se guarda en usuariosStore (mismo archivo donde están
// las credenciales por defecto del proyecto).

import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Container, Card, Button, Form } from 'react-bootstrap';

import FormField from '../components/molecules/FormField.jsx';
import Input from '../components/atoms/Input.jsx';
import { registrarUsuario } from '../data/usuariosStore.js';
import {
  validarNombre,
  validarEmail,
  validarPassword,
  validarPassword2,
  validarEdadAceptada,
} from '../utils/validaciones.js';

export default function Registro() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: '',
      email: '',
      password: '',
      password2: '',
      mayorEdad: false,
    },
  });

  const password = watch('password');

  const onSubmit = (data) => {
    clearErrors('root');

    const resultado = registrarUsuario({
      nombre: data.nombre,
      email: data.email,
      password: data.password,
    });

    if (!resultado.ok) {
      setError('root', { message: 'Este correo ya está registrado.' });
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
                {errors.root && (
                  <div className="alert alert-danger py-2" role="alert">
                    {errors.root.message}
                  </div>
                )}

                <FormField htmlFor="reg-nombre" label="Nombre" error={errors.nombre?.message}>
                  <Input
                    id="reg-nombre"
                    type="text"
                    className={errors.nombre ? 'is-invalid' : ''}
                    {...register('nombre', {
                      validate: (v) => validarNombre(v).valido || validarNombre(v).mensaje,
                    })}
                  />
                </FormField>

                <FormField htmlFor="reg-email" label="Email" error={errors.email?.message}>
                  <Input
                    id="reg-email"
                    type="email"
                    className={errors.email ? 'is-invalid' : ''}
                    {...register('email', {
                      validate: (v) => validarEmail(v).valido || validarEmail(v).mensaje,
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
                          validate: (v) => validarPassword(v).valido || validarPassword(v).mensaje,
                        })}
                      />
                    </FormField>
                  </div>
                  <div className="col-sm-6">
                    <FormField
                      htmlFor="reg-pass2"
                      label="Repetir contraseña"
                      error={errors.password2?.message}
                    >
                      <Input
                        id="reg-pass2"
                        type="password"
                        className={errors.password2 ? 'is-invalid' : ''}
                        {...register('password2', {
                          validate: (v) =>
                            validarPassword2(password, v).valido ||
                            validarPassword2(password, v).mensaje,
                        })}
                      />
                    </FormField>
                  </div>
                </div>

                <Form.Check
                  type="checkbox"
                  id="reg-edad"
                  label="Declaro ser mayor de 18 años"
                  className={errors.mayorEdad ? 'is-invalid' : ''}
                  {...register('mayorEdad', {
                    validate: (v) => validarEdadAceptada(v).valido || validarEdadAceptada(v).mensaje,
                  })}
                />
                {errors.mayorEdad && (
                  <div className="text-danger small mb-3">{errors.mayorEdad.message}</div>
                )}

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

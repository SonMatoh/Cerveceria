// Inicio de sesión con react-hook-form.
// Autentica contra usuariosStore (credenciales por defecto del proyecto:
// admin@duoc.cl/admin123 y cliente@duoc.cl/cliente123) y guarda la sesión
// (que después autocompleta el checkout). Si vino del guard AdminLock,
// devuelve al usuario a la ruta que intentaba abrir.

import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Container, Card, Button } from 'react-bootstrap';

import FormField from '../components/molecules/FormField.jsx';
import Input from '../components/atoms/Input.jsx';
import { iniciarSesion } from '../data/sesionStore.js';
import { autenticar } from '../data/usuariosStore.js';
import { validarEmail, validarPassword } from '../utils/validaciones.js';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const onSubmit = (data) => {
    clearErrors('root');

    const usuario = autenticar(data.email, data.password);
    if (!usuario) {
      setError('root', { message: 'Email o contraseña incorrectos.' });
      return;
    }

    iniciarSesion({ nombre: usuario.nombre, email: usuario.email });
    // Vuelve a la ruta protegida desde la que llegó, o al home.
    navigate(location.state?.from || '/', { replace: true });
  };

  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h1 className="h4 mb-4 text-center">Iniciar sesión</h1>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {errors.root && (
                  <div className="alert alert-danger py-2" role="alert">
                    {errors.root.message}
                  </div>
                )}

                <FormField htmlFor="login-email" label="Email" error={errors.email?.message}>
                  <Input
                    id="login-email"
                    type="email"
                    className={errors.email ? 'is-invalid' : ''}
                    {...register('email', {
                      validate: (v) => validarEmail(v).valido || validarEmail(v).mensaje,
                    })}
                  />
                </FormField>

                <FormField htmlFor="login-pass" label="Contraseña" error={errors.password?.message}>
                  <Input
                    id="login-pass"
                    type="password"
                    className={errors.password ? 'is-invalid' : ''}
                    {...register('password', {
                      validate: (v) => validarPassword(v).valido || validarPassword(v).mensaje,
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

// Formulario de contacto con react-hook-form (patrón de la guía)
// y validaciones centralizadas en utils/validaciones.js.

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Card, Button } from 'react-bootstrap';

import FormField from '../components/molecules/FormField.jsx';
import Input from '../components/atoms/Input.jsx';
import {
  validarNombre,
  validarEmail,
  validarAsunto,
  validarMensaje,
} from '../utils/validaciones.js';

const reglas = {
  nombre: { validate: (v) => validarNombre(v).valido || validarNombre(v).mensaje },
  email: { validate: (v) => validarEmail(v).valido || validarEmail(v).mensaje },
  asunto: { validate: (v) => validarAsunto(v).valido || validarAsunto(v).mensaje },
  mensaje: { validate: (v) => validarMensaje(v).valido || validarMensaje(v).mensaje },
};

export default function Contacto() {
  const [exito, setExito] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { nombre: '', email: '', asunto: '', mensaje: '' },
  });

  const onSubmit = () => {
    setExito(true);
    reset();
    setTimeout(() => setExito(false), 4000);
  };

  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="h3 mb-4">Contacto</h1>

          {exito && (
            <div className="alert alert-success" role="alert">
              Mensaje enviado correctamente. ¡Te responderemos pronto! 🍻
            </div>
          )}

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormField htmlFor="nombre" label="Nombre" error={errors.nombre?.message}>
                  <Input
                    id="nombre"
                    type="text"
                    className={errors.nombre ? 'is-invalid' : ''}
                    {...register('nombre', reglas.nombre)}
                  />
                </FormField>

                <FormField htmlFor="email" label="Email" error={errors.email?.message}>
                  <Input
                    id="email"
                    type="email"
                    className={errors.email ? 'is-invalid' : ''}
                    {...register('email', reglas.email)}
                  />
                </FormField>

                <FormField htmlFor="asunto" label="Asunto" error={errors.asunto?.message}>
                  <Input
                    id="asunto"
                    type="text"
                    className={errors.asunto ? 'is-invalid' : ''}
                    {...register('asunto', reglas.asunto)}
                  />
                </FormField>

                <FormField
                  htmlFor="mensaje"
                  label="Mensaje"
                  error={errors.mensaje?.message}
                  hint="Mínimo 10 caracteres."
                >
                  <textarea
                    id="mensaje"
                    rows="4"
                    className={`form-control ${errors.mensaje ? 'is-invalid' : ''}`}
                    {...register('mensaje', reglas.mensaje)}
                  ></textarea>
                </FormField>

                <Button type="submit" variant="primary">
                  Enviar mensaje
                </Button>
              </form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

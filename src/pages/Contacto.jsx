import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Card, Button } from 'react-bootstrap';

import FormField from '../components/molecules/FormField.jsx';
import Input from '../components/atoms/Input.jsx';

const PATRON_CORREO = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

export function Contacto() {
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
                    {...register('nombre', {
                      required: 'El nombre debe tener al menos 2 caracteres.',
                      minLength: {
                        value: 2,
                        message: 'El nombre debe tener al menos 2 caracteres.',
                      },
                    })}
                  />
                </FormField>

                <FormField htmlFor="email" label="Email" error={errors.email?.message}>
                  <Input
                    id="email"
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

                <FormField htmlFor="asunto" label="Asunto" error={errors.asunto?.message}>
                  <Input
                    id="asunto"
                    type="text"
                    className={errors.asunto ? 'is-invalid' : ''}
                    {...register('asunto', {
                      required: 'El asunto es obligatorio.',
                    })}
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
                    {...register('mensaje', {
                      required: 'El mensaje debe tener al menos 10 caracteres.',
                      minLength: {
                        value: 10,
                        message: 'El mensaje debe tener al menos 10 caracteres.',
                      },
                    })}
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

export default Contacto;
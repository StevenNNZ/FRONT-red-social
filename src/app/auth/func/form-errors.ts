import { FormGroup } from '@angular/forms';

import Swal from 'sweetalert2';

export const patterEmail = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;

export const sweetAlert = (title: string, html: string) => {
  Swal.fire({
    title,
    html,
    timer: 2500,
    position: 'top-end',
    backdrop: false,
    timerProgressBar: true,
  });
};

export const isInvalidField = (
  field: string,
  form: FormGroup
): boolean | null => {
  return form.controls[field].errors && form.controls[field].touched;
};

export const getFieldError = (
  field: string,
  form: FormGroup
): string | null => {
  if (!form.controls[field]) return null;

  const errors = form.controls[field].errors || {};

  for (const key of Object.keys(errors)) {
    switch (key) {
      case 'required':
        return 'Este campo es requerido';
      case 'pattern':
        return 'Debe ingresar un formato válido';
      case 'minlength':
        return `Mínimo ${errors[key].requiredLength} caracteres.`;
      case 'min':
        return `El valor debe ser mayor a  ${errors[key].min}.`;
    }
  }

  return null;
};

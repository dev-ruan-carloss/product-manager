import * as yup from 'yup'

export const productFormSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('O título é obrigatório.')
    .min(1, 'Informe um título válido.'),
  price: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || originalValue === undefined) {
        return undefined
      }

      return value
    })
    .typeError('Informe um preço válido.')
    .required('O preço é obrigatório.')
    .moreThan(0, 'O preço deve ser maior que zero.'),
  description: yup.string().trim().required('A descrição é obrigatória.'),
  category: yup
    .string()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === null || originalValue === undefined || originalValue === '') {
        return undefined
      }

      return value
    })
    .required('A categoria é obrigatória.'),
  image: yup
    .string()
    .trim()
    .required('A URL da imagem é obrigatória.')
    .url('Informe uma URL de imagem válida.'),
})

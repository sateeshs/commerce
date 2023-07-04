import * as Yup from 'yup';

export const languageSchema = Yup.object({
    locale: Yup.string().required().min(2).max(5),
    languageName: Yup.string().required()
}).camelCase();
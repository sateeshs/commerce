import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { object, string } from "yup";
import { ObjectShape, OptionalObjectSchema } from "yup/lib/object";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const validate = (schema: OptionalObjectSchema<ObjectShape>, handler: NextApiHandler) => {

    return async (req: NextApiRequest, res: NextApiResponse) => {
            if(['POST', 'PUT', 'DELETE'].includes(req.method as HttpMethod ?? '')) {
                try {

                    const newSchema = req.method === 'POST' 
                                        ? schema 
                                        : schema.concat(object({pk: string().required()})).concat(object({sk: string().required()}));
                    req.body = await newSchema.camelCase().validate(req.body, { abortEarly: false, stripUnknown: true});

                } catch(e) {

                    return res.status(400).json(e);
                }
            }

            await handler(req, res);
    }

}
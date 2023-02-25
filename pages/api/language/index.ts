// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PutCommandInput } from '@aws-sdk/lib-dynamodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import { documentClient } from '../../../lib/dynamodb-document-client';
import { validate } from '../../../middleware/validate';
import { languageSchema } from '../../../schemas/languages';

type Data = {
  name: string
}

const handler  = async (
  req: NextApiRequest,
  res: NextApiResponse<undefined | any>
) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'POST' || req.method === 'PUT') {
        try {
                const resp = await documentClient.saveItem(<PutCommandInput>{});
                res.status(201).json(JSON.stringify(resp));
        } catch(e) {
            res.status(400).json(JSON.stringify(e));
        }

    }
    else if(req.method === 'DELETE'){
        /**Key: { pk: `${pk}`, sk: `${sk}`} */
    }
  res.status(200).json({ name: 'John Doe' })
}


export default validate(languageSchema, handler);
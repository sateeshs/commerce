// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { documentClient } from '../../../lib/dynamodb-document-client';
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
                const resp = await documentClient.saveItem()

        } catch(e) {
            res.status(400).json(JSON.stringify(e));
        }

    }
  res.status(200).json({ name: 'John Doe' })
}


export default validate(languageSchema, handler);
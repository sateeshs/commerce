import { RequestEntity } from "../lib/dynamoDb/entities"
import { ResourceEntity } from "../lib/dynamoDb/entities"

const addRequestForAllLocales = async (clienitId: string, request: ResourceEntity) => {
    const clienitRequests = ['en','fr'].map((x: string) => { 
        const newRequest= <RequestEntity>{
            
        }
    return {
        PutRequest: {
Item: newRequest
        }
    }})
}
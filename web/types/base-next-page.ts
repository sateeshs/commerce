import { NextPage } from "next"
import { type } from "os"


type BaseNextPage<type> = NextPage<type> & { auth: boolean}
export type {BaseNextPage}
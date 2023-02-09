import { NextPage } from "next"
import { type } from "os"


type CCNextPage<type> = NextPage<type> & { auth: boolean}
export type {CCNextPage}
export interface User {
    username?: string;
    password?: string;
    email?:string
    id?:string | undefined
    fullname?:string
    mobileNumber?:string| null
    role?:string
    department?:string,
    token?:string
}
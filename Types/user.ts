 interface registerUserType {
    name:string,
    image:string,
    phone_number:string,
    password:string
}

interface loginUserType {
    name:string,
    password:string
}

interface usertypes {
    id:string,
    name:string,
    image:string,
    phone_number:string,
    password:string
}

export {registerUserType,loginUserType,usertypes}
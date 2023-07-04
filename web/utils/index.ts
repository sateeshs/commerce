function setLocale(locale: string) {
    document.cookie = `NEXT_LOCALE=${locale}; max-age=31536000; path=/`;
}

const parseJwt: any = (token: string) => {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}

export {setLocale, parseJwt}
import axios from "axios"

export const setTheme = (t) => {
    document.getElementsByTagName('html')[0].setAttribute('data-theme', t)
    window.localStorage.setItem('phs-theme', t)
}

export const loadTheme = () => {
    let savedTheme = localStorage.getItem('phs-theme')
    document.getElementsByTagName('html')[0].setAttribute('data-theme', savedTheme)
}

export const CtoF = (C) => {
  var cTemp = C;
  var cToFahr = cTemp * 9 / 5 + 32;
  return C.toFixed(2)
}

export let API = axios.create({
    baseURL : "http://127.0.0.1:3000",
    withCredentials : true
})

API.defaults.withCredentials = true

export const amISignedIn = async ()=> {
    try{
        const resp = await API.post('/api/phs/checkCreds')
        return true
    }catch(e){ console.log("err") }
    return false
}
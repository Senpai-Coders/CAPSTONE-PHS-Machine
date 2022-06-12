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

export let API = axios.create({ baseURL : "", withCredentials : true })
API.defaults.withCredentials = true

export const amISignedIn = async ()=> {
    try{
        const resp = await API.post('/api/phs/checkCreds')
        return true
    }catch(e){ console.log("err") }
    return false
}

export const translateSystemState = (status) => {
    if(status === 0) return 'Detecting'
    if(status === 1) return 'Resolving'
    if(status === 2) return 'Debugging'
    if(status === 3) return 'Connecting'
    if(status === -1) return 'Disabled'
    if(status === -2) return 'Off'
}

export const dateToWord = (date) => {
    let thisDate = new Date(date);
    let wordDate = `${thisDate.toLocaleString("en-us", { month: "short" })} ${thisDate.getDate()}, ${thisDate.getFullYear()} - ${thisDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    return wordDate
  };
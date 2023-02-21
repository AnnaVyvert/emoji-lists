export function getStoreArr(e: string): string[] {
  let s = window.localStorage[e]
  try{
    s = JSON.parse(s)
  }catch(e){
    s = []
  }
  console.log(s);
  
  return s
}

export function setStoreArr(e: string, val: any): boolean  {
  try{
    window.localStorage[e] = JSON.stringify(val)
    return true
  }catch(e){
    return false
  }
}
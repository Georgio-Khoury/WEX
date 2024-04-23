const k1 = ()=>{return new Promise((resolve,reject)=>{
    resolve(setTimeout(()=>{
        console.log("hello")
    },4000))
})
}
const k2 = ()=>{
    return new Promise((resolve,reject)=>{
        resolve(setTimeout(()=>{
            console.log("ok")
        },4000))
    })
   
}
async function test(){
    await k2()
    k1()
}
test()
function createID(p1,p2){
    let st1 = p1.toLowerCase()
    let st2 = p2.toLowerCase()
    if(st1<st2){
    var concatenated = st1+st2
    }else{
        var concatenated = st2+st1
    }
    return concatenated;
}
module.exports={createID}
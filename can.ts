function throttles(callback:Function,wait:number):Function {
    let timer= null;
    return function(){
        let conttext=this
        let args=arguments
        if(!timer){
            clearTimeout(timer)
        }
        timer=setTimeout(()=>{
            callback.apply(conttext,args)
            timer=null
        },wait)
    }
}